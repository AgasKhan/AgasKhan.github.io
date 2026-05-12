// Minimal GLSL syntax highlighter.
// - Tokenizes the source and emits HTML with <span class="tk-...">.
// - Detects user-defined function names with a pre-pass so they get a distinct color
//   from built-in GLSL functions, same way Rider distinguishes user code from API.

(function ()
{
    'use strict';

    var KEYWORDS = makeSet([
        'if', 'else', 'for', 'while', 'do',
        'break', 'continue', 'return', 'discard',
        'switch', 'case', 'default',
        'struct', 'enum',
        'attribute', 'varying', 'uniform', 'const',
        'in', 'out', 'inout',
        'precision', 'highp', 'mediump', 'lowp',
        'true', 'false',
        'invariant', 'centroid'
    ]);

    var BUILTIN_TYPES = makeSet([
        'void', 'bool',
        'int', 'uint', 'float', 'double',
        'vec2', 'vec3', 'vec4',
        'ivec2', 'ivec3', 'ivec4',
        'uvec2', 'uvec3', 'uvec4',
        'bvec2', 'bvec3', 'bvec4',
        'dvec2', 'dvec3', 'dvec4',
        'mat2', 'mat3', 'mat4',
        'mat2x2', 'mat2x3', 'mat2x4',
        'mat3x2', 'mat3x3', 'mat3x4',
        'mat4x2', 'mat4x3', 'mat4x4',
        'sampler2D', 'sampler3D', 'samplerCube',
        'sampler2DShadow', 'samplerCubeShadow',
        'sampler2DArray', 'sampler2DArrayShadow',
        'isampler2D', 'isampler3D', 'isamplerCube',
        'usampler2D', 'usampler3D', 'usamplerCube'
    ]);

    // Built-in GLSL functions (ES 1.0 + common ES 3.0). Functions only — not types.
    var BUILTIN_FUNCS = makeSet([
        // trig
        'radians', 'degrees',
        'sin', 'cos', 'tan',
        'asin', 'acos', 'atan',
        'sinh', 'cosh', 'tanh',
        'asinh', 'acosh', 'atanh',
        // exponential
        'pow', 'exp', 'log', 'exp2', 'log2',
        'sqrt', 'inversesqrt',
        // common
        'abs', 'sign', 'floor', 'ceil', 'trunc', 'round', 'roundEven',
        'fract', 'mod', 'modf',
        'min', 'max', 'clamp', 'mix', 'step', 'smoothstep',
        'isnan', 'isinf',
        'floatBitsToInt', 'floatBitsToUint',
        'intBitsToFloat', 'uintBitsToFloat',
        // geometric
        'length', 'distance', 'dot', 'cross',
        'normalize', 'faceforward', 'reflect', 'refract',
        // matrix
        'matrixCompMult', 'transpose', 'inverse', 'determinant', 'outerProduct',
        // vector relational
        'lessThan', 'lessThanEqual',
        'greaterThan', 'greaterThanEqual',
        'equal', 'notEqual',
        'any', 'all', 'not',
        // texture
        'texture2D', 'texture2DProj', 'texture2DLod', 'texture2DProjLod',
        'textureCube', 'textureCubeLod',
        'texture', 'textureProj', 'textureLod', 'textureGrad',
        'texelFetch', 'textureSize',
        // derivatives
        'dFdx', 'dFdy', 'fwidth',
        // packing
        'packSnorm2x16', 'unpackSnorm2x16',
        'packUnorm2x16', 'unpackUnorm2x16',
        'packHalf2x16', 'unpackHalf2x16'
    ]);

    // Built-in variables — gl_* and friends. Distinct color, like Unity API surface.
    var BUILTIN_VARS = makeSet([
        'gl_Position', 'gl_PointSize',
        'gl_FragCoord', 'gl_FragColor', 'gl_FragData', 'gl_FragDepth',
        'gl_PointCoord', 'gl_FrontFacing',
        'gl_VertexID', 'gl_InstanceID',
        'gl_MaxVertexAttribs', 'gl_MaxVertexUniformVectors',
        'gl_MaxFragmentUniformVectors', 'gl_MaxVertexTextureImageUnits',
        'gl_MaxCombinedTextureImageUnits', 'gl_MaxTextureImageUnits',
        'gl_MaxDrawBuffers'
    ]);

    function makeSet(arr)
    {
        var s = {};
        for (var i = 0; i < arr.length; i++)
            s[arr[i]] = true;
        return s;
    }

    function escapeHtml(s)
    {
        return s.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
    }

    // A type-or-modifier followed by an identifier and an opening paren = user function.
    // Picks up:    void main()  vec2 hash22(vec2 p)  float hash21(vec2 p)  out vec2 closest
    // Excludes function calls (the leading word would be an identifier, not a type).
    var TYPE_HEAD =
        '(?:void|bool|int|uint|float|double|' +
        'vec[234]|ivec[234]|uvec[234]|bvec[234]|dvec[234]|' +
        'mat[234](?:x[234])?)';
    var USER_FN_REGEX = new RegExp(
        '(?:^|[^\\w.])' + TYPE_HEAD + '\\s+([A-Za-z_]\\w*)\\s*\\(',
        'g'
    );

    function collectUserFunctions(code)
    {
        var fns = {};
        var m;
        USER_FN_REGEX.lastIndex = 0;
        while ((m = USER_FN_REGEX.exec(code)) !== null)
        {
            // Skip 'main' deliberately — it's the entry point, treat as user fn anyway.
            fns[m[1]] = true;
        }
        return fns;
    }

    // Master tokenizer. Order matters: longest / most specific first.
    // 1: block comment      2: line comment   3: preprocessor
    // 4: string             5: number         6: identifier
    // 7: punctuation        8: whitespace     9: anything else
    var MASTER = new RegExp([
        '(\\/\\*[\\s\\S]*?\\*\\/)',
        '(\\/\\/[^\\n]*)',
        '(^[ \\t]*#[^\\n]*)',
        '("(?:[^"\\\\]|\\\\.)*")',
        '(\\b\\d+\\.\\d*(?:[eE][+-]?\\d+)?[fFlLuU]?\\b|\\.\\d+(?:[eE][+-]?\\d+)?[fFlLuU]?\\b|\\b\\d+(?:[eE][+-]?\\d+)?[fFlLuU]?\\b)',
        '(\\b[A-Za-z_]\\w*\\b)',
        '([{}()\\[\\];,.<>+\\-*/=!&|^?:~%])',
        '(\\s+)',
        '(.)'
    ].join('|'), 'gm');

    function classifyIdentifier(id, userFns)
    {
        if (KEYWORDS[id])        return 'tk-keyword';
        if (BUILTIN_TYPES[id])   return 'tk-type';
        if (BUILTIN_VARS[id])    return 'tk-builtin-var';
        if (BUILTIN_FUNCS[id])   return 'tk-builtin-fn';
        if (userFns[id])         return 'tk-user-fn';
        return 'tk-identifier';
    }

    function highlight(code)
    {
        var userFns = collectUserFunctions(code);
        var parts = [];
        var m;

        MASTER.lastIndex = 0;
        while ((m = MASTER.exec(code)) !== null)
        {
            if (m[1] || m[2])
            {
                parts.push('<span class="tk-comment">' + escapeHtml(m[1] || m[2]) + '</span>');
            }
            else if (m[3])
            {
                parts.push('<span class="tk-preprocessor">' + escapeHtml(m[3]) + '</span>');
            }
            else if (m[4])
            {
                parts.push('<span class="tk-string">' + escapeHtml(m[4]) + '</span>');
            }
            else if (m[5])
            {
                parts.push('<span class="tk-number">' + escapeHtml(m[5]) + '</span>');
            }
            else if (m[6])
            {
                var cls = classifyIdentifier(m[6], userFns);
                parts.push('<span class="' + cls + '">' + escapeHtml(m[6]) + '</span>');
            }
            else if (m[7])
            {
                parts.push('<span class="tk-punct">' + escapeHtml(m[7]) + '</span>');
            }
            else if (m[8])
            {
                parts.push(m[8]);
            }
            else if (m[9])
            {
                parts.push(escapeHtml(m[9]));
            }
        }

        return parts.join('');
    }

    window.GLSLHighlight = { highlight: highlight };
})();
