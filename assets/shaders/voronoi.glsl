// Hero background — animated Voronoi.
// Lines use the perpendicular-bisector technique from
// https://iquilezles.org/articles/voronoilines/ for uniform-thickness edges
// and clean triple-junction vertices.
//
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

// Position of the feature point owned by a given cell id, in absolute
// (pre-fragment) space. Shared between the two Voronoi passes so the same
// animation drives them.
vec2 cellPoint(in vec2 cellId)
{
    vec2 rnd = hash22(cellId);
    return cellId + 0.5 + 0.42 * sin(u_time * 0.55 + 6.2831 * rnd);
}

// ------------------------------------------------------------
// Pass 1 — 3x3 neighborhood. Find the closest feature point.
// Returns the cell id and the absolute position of that point so pass 2
// can compute distances to bisectors without re-hashing the same cell.
// ------------------------------------------------------------
void voronoi(in vec2 p, out vec2 cellId, out vec2 closestPos)
{
    vec2 ipos = floor(p);
    float best = 8.0;
    cellId     = ipos;
    closestPos = ipos;

    for (int y = -1; y <= 1; y++)
    {
        for (int x = -1; x <= 1; x++)
        {
            vec2 g   = vec2(float(x), float(y));
            vec2 pos = cellPoint(ipos + g);
            float d  = length(pos - p);

            if (d < best)
            {
                best       = d;
                cellId     = ipos + g;
                closestPos = pos;
            }
        }
    }
}

// ------------------------------------------------------------
// Pass 2 — 5x5 neighborhood. IQ's voronoi-lines distance.
//
// For every other feature point, the cell boundary is the perpendicular
// bisector between the closest point and that other point. The distance
// from the fragment to that line is:
//     dot( midpoint - p, normalize(other - closest) )
// Taking the minimum across neighbors gives the perpendicular distance
// to the actual nearest cell boundary — which yields lines of uniform
// thickness and clean triple-junction vertices.
//
// 5x5 (instead of 3x3) matters near triple junctions, where the relevant
// neighbor can sit two cells away.
// ------------------------------------------------------------
float voronoiEdgeDistance(in vec2 p, in vec2 closestPos)
{
    vec2 ipos = floor(p);
    float md = 8.0;

    for (int y = -2; y <= 2; y++)
    {
        for (int x = -2; x <= 2; x++)
        {
            vec2 g   = vec2(float(x), float(y));
            vec2 pos = cellPoint(ipos + g);
            vec2 r   = pos - closestPos;

            // Skip the closest point itself (r would be ~0, normalize undefined).
            if (dot(r, r) > 0.00001)
            {
                vec2 mid = 0.5 * (closestPos + pos);
                md = min(md, dot(mid - p, normalize(r)));
            }
        }
    }
    return md;
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

    vec2 cellId, closestPos;
    voronoi(p, cellId, closestPos);

    float edgeDist = voronoiEdgeDistance(p, closestPos);

    // Edge mask: 1 on the line, 0 deep inside a cell.
    // With IQ's metric edgeDist is the actual perpendicular distance to the
    // nearest boundary, so lineThickness is a real "half-width in cell units".
    float lineThickness = 0.025;
    float line = 1.0 - smoothstep(0.0, lineThickness, edgeDist);

    // Hit-test the pointer to highlight the cell it sits in.
    vec2 mouseP = u_mouse / u_resolution.xy;
    mouseP.x *= aspect;
    mouseP *= 5.5;
    vec2 mouseCellId, mouseClosestPos;
    voronoi(mouseP, mouseCellId, mouseClosestPos);
    // Cell ids come from floor(), so they are integer-valued — exact compare is safe.
    bool isMouseCell = (cellId.x == mouseCellId.x && cellId.y == mouseCellId.y);

    // Per-cell color: cyan under the pointer, otherwise blend gold ↔ orange.
    float h = hash21(cellId);
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
