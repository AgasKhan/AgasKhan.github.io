// Default HLSL shader for the playground.
// The wrapper provides these globals (no need to declare them):
//   u_resolution : float2  -- canvas size in physical pixels
//   u_time       : float   -- seconds since start
//   u_mouse      : float2  -- pointer in physical pixels, bottom-left origin
//   u_history    : Texture2D -- previous frame's output (alpha channel = trail)
//
// Convention: gl_FragCoord origin is bottom-left, so uv.y == 0 is the bottom.
// Return float4 RGBA; the alpha channel persists into u_history next frame.

float4 main(float2 uv)
{
    float t = u_time;

    // Animated gradient.
    float3 col = float3(uv.x, uv.y, 0.5 + 0.5 * sin(t));

    // Subtle pulse near the pointer.
    float2 mouseUV = u_mouse / u_resolution;
    float  d       = distance(uv, mouseUV);
    col += float3(0.4, 0.6, 0.8) * smoothstep(0.25, 0.0, d);

    return float4(saturate(col), 1.0);
}
