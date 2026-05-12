// HLSL → GLSL ES 1.0 conversor for the playground.
//
// Lexical: a list of regex rules transforms HLSL types and built-ins to GLSL
// equivalents. Good enough for ~90% of fragment shaders written in HLSL style.
//
// Conventions assumed of the user's HLSL:
//   - A single entry point: float4 main(float2 uv) { ... return float4(...); }
//   - No SubShader/Pass/ShaderLab/cbuffer scaffolding. Just the function.
//   - The following globals are pre-declared by the wrapper (do NOT declare them):
//       float2     u_resolution
//       float      u_time
//       float2     u_mouse
//       Texture2D  u_history
//
// Output: a self-contained GLSL ES 1.0 fragment shader with precision, uniform
// declarations, the user's translated code (with main renamed to main_user),
// and a void main() entry point that calls main_user with the right uv.

(function ()
{
    'use strict';

    // Each rule: [regex, replacement]. Order matters — longest/most specific first.
    // Multi-component vector and matrix types must precede shorter prefixes
    // (float4x4 before float4 before float etc.).
    var RULES = [
        // Strip HLSL semantics from declarations: ": SV_POSITION", ": TEXCOORD0", etc.
        [/:\s*(SV_POSITION|SV_TARGET|SV_Target|SV_Depth|SV_VertexID|SV_InstanceID|POSITION\d*|COLOR\d*|NORMAL\d*|TEXCOORD\d*|TANGENT\d*|BINORMAL\d*|VPOS|VFACE|PSIZE|DEPTH\d*)\b/g, ''],
        // Strip register bindings.
        [/:\s*register\s*\(\s*[stub]\d+\s*\)/g, ''],
        // packoffset — strip.
        [/:\s*packoffset\s*\(\s*[^)]+\)/g, ''],

        // 'static const' → 'const'; bare 'static' is GLSL-meaningless, drop it.
        [/\bstatic\s+const\b/g, 'const'],
        [/\bstatic\s+/g, ''],

        // Matrix types (must come before vector types).
        [/\bfloat4x4\b/g, 'mat4'],
        [/\bfloat3x3\b/g, 'mat3'],
        [/\bfloat2x2\b/g, 'mat2'],
        [/\bfloat3x4\b/g, 'mat3x4'],
        [/\bfloat4x3\b/g, 'mat4x3'],
        [/\bfloat2x3\b/g, 'mat2x3'],
        [/\bfloat3x2\b/g, 'mat3x2'],
        [/\bfloat2x4\b/g, 'mat2x4'],
        [/\bfloat4x2\b/g, 'mat4x2'],
        [/\bhalf4x4\b/g,  'mat4'],
        [/\bhalf3x3\b/g,  'mat3'],
        [/\bhalf2x2\b/g,  'mat2'],

        // Vector types.
        [/\bfloat4\b/g, 'vec4'],
        [/\bfloat3\b/g, 'vec3'],
        [/\bfloat2\b/g, 'vec2'],
        [/\bint4\b/g,   'ivec4'],
        [/\bint3\b/g,   'ivec3'],
        [/\bint2\b/g,   'ivec2'],
        [/\bbool4\b/g,  'bvec4'],
        [/\bbool3\b/g,  'bvec3'],
        [/\bbool2\b/g,  'bvec2'],
        [/\buint4\b/g,  'ivec4'],
        [/\buint3\b/g,  'ivec3'],
        [/\buint2\b/g,  'ivec2'],
        [/\buint\b/g,   'int'],

        // half / fixed (Unity-style) → float / vec*. Vector before scalar.
        [/\bhalf4\b/g,  'vec4'],
        [/\bhalf3\b/g,  'vec3'],
        [/\bhalf2\b/g,  'vec2'],
        [/\bhalf\b/g,   'float'],
        [/\bfixed4\b/g, 'vec4'],
        [/\bfixed3\b/g, 'vec3'],
        [/\bfixed2\b/g, 'vec2'],
        [/\bfixed\b/g,  'float'],

        // Textures and samplers.
        [/\bTexture2D\b/g,       'sampler2D'],
        [/\bTextureCube\b/g,     'samplerCube'],
        [/\bSamplerState\s+\w+\s*;/g, ''],
        [/\bSamplerComparisonState\s+\w+\s*;/g, ''],

        // saturate(x) → clamp(x, 0.0, 1.0). Captures a single non-nested expression.
        [/\bsaturate\s*\(\s*([^()]+?)\s*\)/g, 'clamp($1, 0.0, 1.0)'],

        // mul(a, b) → (a) * (b). Simple top-level capture; does not handle
        // nested mul(mul(...)) — those need to be written manually.
        [/\bmul\s*\(\s*([^()]+?)\s*,\s*([^()]+?)\s*\)/g, '(($1) * ($2))'],

        // Common renames.
        [/\bfrac\s*\(/g,    'fract('],
        [/\blerp\s*\(/g,    'mix('],
        [/\batan2\s*\(/g,   'atan('],
        [/\bfmod\s*\(/g,    'mod('],
        [/\brsqrt\s*\(/g,   'inversesqrt('],
        [/\bddx\s*\(/g,     'dFdx('],
        [/\bddy\s*\(/g,     'dFdy('],
        [/\btex2D\s*\(/g,   'texture2D('],
        [/\btex2Dlod\s*\(/g,'texture2DLod('],
        [/\btexCUBE\s*\(/g, 'textureCube('],

        // .Sample(sampler, uv) on a Texture2D variable → texture2D(var, uv).
        // Caller writes e.g. u_tex.Sample(s, uv); becomes texture2D(u_tex, uv).
        [/\b(\w+)\s*\.\s*Sample\s*\(\s*\w+\s*,\s*([^)]+)\)/g, 'texture2D($1, $2)'],
        // .SampleLevel(sampler, uv, lod) → texture2DLod(var, uv, lod).
        [/\b(\w+)\s*\.\s*SampleLevel\s*\(\s*\w+\s*,\s*([^,]+),\s*([^)]+)\)/g, 'texture2DLod($1, $2, $3)'],

        // sincos(x, s, c) is HLSL only — turn into manual assignments.
        [/\bsincos\s*\(\s*([^,]+?)\s*,\s*([^,]+?)\s*,\s*([^()]+?)\s*\)/g, '$2 = sin($1); $3 = cos($1)']
    ];

    var PRELUDE = [
        '// === Auto-generated GLSL from HLSL ===',
        'precision mediump float;',
        '',
        'uniform vec2      u_resolution;',
        'uniform float     u_time;',
        'uniform vec2      u_mouse;',
        'uniform sampler2D u_history;',
        '',
        '// --- User code (translated) ---'
    ].join('\n');

    var EPILOGUE = [
        '',
        '// --- Entry point (wrapper) ---',
        'void main()',
        '{',
        '    vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
        '    gl_FragColor = main_user(uv);',
        '}'
    ].join('\n');

    function convert(hlslSource)
    {
        var src = hlslSource;
        var warnings = [];

        // Rename the user's float4 main(...) → vec4 main_user(...) BEFORE the
        // type rules run (otherwise we'd be matching "vec4 main"), and we keep
        // the rename in a single pass to avoid the rules touching it.
        var mainRegex = /\b(float4|half4|fixed4)\s+main\s*\(/;
        if (mainRegex.test(src))
        {
            src = src.replace(mainRegex, '$1 main_user(');
        }
        else
        {
            warnings.push('No "float4 main(float2 uv)" entry point found. The wrapper expects one.');
        }

        // Apply rules in order.
        for (var i = 0; i < RULES.length; i++)
        {
            src = src.replace(RULES[i][0], RULES[i][1]);
        }

        var glsl = PRELUDE + '\n\n' + src.trim() + '\n' + EPILOGUE + '\n';
        return { glsl: glsl, warnings: warnings };
    }

    window.HLSLToGLSL = { convert: convert };
})();
