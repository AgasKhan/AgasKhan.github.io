// Hero background — animated Voronoi.
// Uniforms expected by hero-shader.js:
//   uniform vec2  u_resolution; // canvas size in physical pixels
//   uniform float u_time;       // seconds since start
//   uniform vec2  u_mouse;      // pointer position in physical pixels, bottom-left origin

precision mediump float;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec2  u_mouse;

const vec3 gold   = vec3(0.96, 0.72, 0.20);
const vec3 orange = vec3(0.95, 0.42, 0.12);
const vec3 cyan   = vec3(0.28, 0.85, 0.85);

// ------------------------------------------------------------
// Hashes
// ------------------------------------------------------------
vec2 hash22(vec2 p)
{
    p = vec2(dot(p, vec2(127.1, 311.7)),
             dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

float hash21(vec2 p)
{
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// ------------------------------------------------------------
// Voronoi F1/F2
// f1 = distance to the closest feature point
// f2 = distance to the second-closest
// Edges are where f2 - f1 ~ 0.
// ------------------------------------------------------------
void voronoi(in vec2 p, out float f1, out float f2, out vec2 closest)
{
    vec2 ipos = floor(p);
    vec2 fpos = fract(p);
    f1 = 8.0;
    f2 = 8.0;

    for (int y = -1; y <= 1; y++)
    {
        for (int x = -1; x <= 1; x++)
        {
            vec2 g = vec2(float(x), float(y));
            vec2 rnd = hash22(ipos + g);
            // Each cell point oscillates around the cell center.
            vec2 point = 0.5 + 0.42 * sin(u_time * 0.55 + 6.2831 * rnd);
            vec2 diff  = g + point - fpos;
            float d    = length(diff);

            if (d < f1)
            {
                f2 = f1;
                f1 = d;
                closest = ipos + g;
            }
            else if (d < f2)
            {
                f2 = d;
            }
        }
    }
}

// Cell-only variant: skips f2, used for hit-testing the mouse position.
vec2 voronoiCell(in vec2 p)
{
    vec2 ipos = floor(p);
    vec2 fpos = fract(p);
    float best = 8.0;
    vec2 closest = ipos;

    for (int y = -1; y <= 1; y++)
    {
        for (int x = -1; x <= 1; x++)
        {
            vec2 g = vec2(float(x), float(y));
            vec2 rnd = hash22(ipos + g);
            vec2 point = 0.5 + 0.42 * sin(u_time * 0.55 + 6.2831 * rnd);
            vec2 diff  = g + point - fpos;
            float d    = length(diff);

            if (d < best)
            {
                best = d;
                closest = ipos + g;
            }
        }
    }
    return closest;
}

// ------------------------------------------------------------
// Main
// ------------------------------------------------------------
void main()
{
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;

    // Aspect-corrected, scaled coordinates. Larger scale = more cells.
    vec2 p = uv;
    p.x *= aspect;
    p *= 5.5;

    float f1, f2;
    vec2 closest;
    voronoi(p, f1, f2, closest);

    // Edge mask: 1 on the line between two cells, 0 deep inside a cell.
    float edgeDist      = f2 - f1;
    float lineThickness = 0.035;
    float line          = 1.0 - smoothstep(0.0, lineThickness, edgeDist);

    // Find which cell the mouse pointer is inside, in the same coord space as p.
    vec2 mouseP = u_mouse / u_resolution.xy;
    mouseP.x *= aspect;
    mouseP *= 5.5;
    vec2 mouseCell = voronoiCell(mouseP);
    // Cell ids come from floor(), so they are integer-valued — exact compare is safe.
    bool isMouseCell = (closest.x == mouseCell.x && closest.y == mouseCell.y);

    // Per-cell color based on a hash of the cell id.
    float h = hash21(closest);

    // Only the cell under the pointer goes cyan; the rest blend gold↔orange.
    vec3 cellColor = isMouseCell ? cyan : mix(gold, orange, h);

    // Dark page-matching background.
    vec3 bg = vec3(0.055, 0.063, 0.082);

    // Cell interior: faint tint of its color.
    vec3 cellShade = mix(bg, cellColor, 0.16);

    // Line color: brighter than the interior.
    vec3 lineColor = cellColor * 1.6;

    vec3 col = mix(cellShade, lineColor, line);

    gl_FragColor = vec4(col, 1.0);
}
