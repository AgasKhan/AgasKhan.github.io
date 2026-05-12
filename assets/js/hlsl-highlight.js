// Minimal HLSL syntax highlighter — mirrors glsl-highlight.js with HLSL-specific
// keywords, types, intrinsics and semantics. Same overlay technique applies.

(function ()
{
    'use strict';

    var KEYWORDS = makeSet([
        'if', 'else', 'for', 'while', 'do',
        'break', 'continue', 'return', 'discard',
        'switch', 'case', 'default',
        'struct', 'class', 'enum', 'typedef',
        'in', 'out', 'inout', 'const', 'static', 'uniform',
        'precise', 'shared', 'volatile',
        'true', 'false',
        'cbuffer', 'tbuffer', 'register', 'packoffset',
        'namespace'
    ]);

    var BUILTIN_TYPES = makeSet([
        'void', 'bool',
        'int', 'int2', 'int3', 'int4',
        'uint', 'uint2', 'uint3', 'uint4',
        'half', 'half2', 'half3', 'half4',
        'float', 'float2', 'float3', 'float4',
        'fixed', 'fixed2', 'fixed3', 'fixed4',
        'double', 'double2', 'double3', 'double4',
        'float2x2', 'float3x3', 'float4x4',
        'float3x4', 'float4x3', 'float2x3', 'float3x2', 'float2x4', 'float4x2',
        'half2x2', 'half3x3', 'half4x4',
        'Texture2D', 'Texture3D', 'TextureCube',
        'Texture2DArray', 'TextureCubeArray',
        'SamplerState', 'SamplerComparisonState',
        'RWTexture2D', 'RWTexture3D',
        'StructuredBuffer', 'RWStructuredBuffer',
        'ByteAddressBuffer', 'RWByteAddressBuffer'
    ]);

    // HLSL intrinsics (functions only — not types).
    var BUILTIN_FUNCS = makeSet([
        // trig
        'sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh',
        'asin', 'acos', 'atan', 'atan2',
        'radians', 'degrees',
        // exp / power
        'pow', 'exp', 'exp2', 'log', 'log2', 'log10',
        'sqrt', 'rsqrt',
        // common
        'abs', 'sign', 'floor', 'ceil', 'round', 'trunc',
        'frac', 'fmod', 'modf',
        'min', 'max', 'clamp', 'saturate',
        'lerp', 'step', 'smoothstep',
        'isnan', 'isinf', 'isfinite',
        // bit casting
        'asfloat', 'asint', 'asuint',
        // geometric
        'length', 'distance', 'dot', 'cross',
        'normalize', 'faceforward', 'reflect', 'refract',
        // matrix
        'mul', 'transpose', 'determinant',
        // vector relational
        'all', 'any',
        // texture
        'tex2D', 'tex2Dlod', 'tex2Dproj', 'tex2Dgrad',
        'texCUBE', 'texCUBElod',
        // derivatives
        'ddx', 'ddy', 'fwidth',
        'ddx_coarse', 'ddy_coarse', 'ddx_fine', 'ddy_fine',
        // misc
        'sincos', 'clip', 'mad'
    ]);

    // Common HLSL semantics (used in the ": SV_TARGET" position).
    var SEMANTICS = makeSet([
        'SV_POSITION', 'SV_Position', 'SV_TARGET', 'SV_Target',
        'SV_Depth', 'SV_VertexID', 'SV_InstanceID', 'SV_PrimitiveID',
        'SV_GroupID', 'SV_GroupThreadID', 'SV_DispatchThreadID',
        'POSITION', 'POSITION0', 'POSITION1',
        'COLOR', 'COLOR0', 'COLOR1',
        'NORMAL', 'NORMAL0',
        'TEXCOORD0', 'TEXCOORD1', 'TEXCOORD2', 'TEXCOORD3',
        'TEXCOORD4', 'TEXCOORD5', 'TEXCOORD6', 'TEXCOORD7',
        'TANGENT', 'BINORMAL',
        'VPOS', 'VFACE', 'PSIZE', 'DEPTH'
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

    // Detect user-declared functions: `<type> <name>(`.
    var TYPE_HEAD =
        '(?:void|bool|int|uint|half|float|fixed|double|' +
        'int[234]|uint[234]|half[234]|float[234]|fixed[234]|double[234]|' +
        'half[234]x[234]|float[234]x[234])';
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
            fns[m[1]] = true;
        }
        return fns;
    }

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
        if (KEYWORDS[id])      return 'tk-keyword';
        if (BUILTIN_TYPES[id]) return 'tk-type';
        if (SEMANTICS[id])     return 'tk-builtin-var';
        if (BUILTIN_FUNCS[id]) return 'tk-builtin-fn';
        if (userFns[id])       return 'tk-user-fn';
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

    window.HLSLHighlight = { highlight: highlight };
})();
