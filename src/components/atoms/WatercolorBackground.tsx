import { useEffect, useRef, useState } from "react";

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_velocity;
uniform float u_seed;
uniform float u_dark;
uniform float u_reducedMotion;

#define MAX_BLOOMS 16
uniform vec4 u_bloomData[MAX_BLOOMS]; // xy: pos, z: age, w: maxRadius
uniform vec3 u_bloomColors[MAX_BLOOMS]; // rgb color

const float SPEED = 0.07;
const float SCALE = 3.2;
const float WARP = 1.25;
const float STREAK = 1.8;

// Light mode palette: Forest Sage
const vec3 L_C0 = vec3(0.953, 0.965, 0.961); // #f3f6f5 (base paper)
const vec3 L_C1 = vec3(0.843, 0.910, 0.871); // #d7e8de (soft sage wash)
const vec3 L_C2 = vec3(0.682, 0.859, 0.776); // #aedbc6 (mint/eucalyptus wash)
const vec3 L_C3 = vec3(0.337, 0.686, 0.533); // #56af88 (forest sage)
const vec3 L_C4 = vec3(0.133, 0.392, 0.286); // #226449 (deep pine)
const vec3 L_C5 = vec3(0.922, 0.961, 0.941); // #ebf5f0 (pale highlight)
const vec3 L_LINE = vec3(0.447, 0.671, 0.569); // #72ab91 (contour edge)

// Dark mode palette: Midnight Pine
const vec3 D_C0 = vec3(0.035, 0.055, 0.047); // #090e0c (base midnight)
const vec3 D_C1 = vec3(0.063, 0.110, 0.090); // #101c17 (deep pine mist)
const vec3 D_C2 = vec3(0.086, 0.212, 0.157); // #163628 (midnight jade)
const vec3 D_C3 = vec3(0.141, 0.361, 0.263); // #245c43 (emerald glow)
const vec3 D_C4 = vec3(0.239, 0.561, 0.420); // #3d8f6b (luminous pine)
const vec3 D_C5 = vec3(0.306, 0.659, 0.498); // #4ea87f (pale emerald mist)
const vec3 D_LINE = vec3(0.392, 0.718, 0.565); // #64b790 (contour edge)

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
               u.y);
}

float fbm(vec2 p) {
    float v = 0.5 * noise(p);
    v += 0.25 * noise(p * 2.03 + vec2(17.0, 9.0));
    v += 0.125 * noise(p * 4.01 - vec2(5.2, 13.1));
    return v / 0.875;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    float aspect = u_res.x / u_res.y;

    // 1. Cursor interaction: Velocity-aware brush wake & vortex swirling
    vec2 mp = u_mouse - 0.5;
    mp.x *= aspect;
    vec2 dvec = (uv - 0.5) * vec2(aspect, 1.0) - mp;
    float distSq = dot(dvec, dvec);
    float infl = exp(-distSq / (2.0 * 0.17 * 0.17));

    vec2 p = uv;
    p.x *= aspect;
    p += dvec * infl * 0.08;

    float speed = length(u_velocity);
    if (speed > 0.001) {
        vec2 velDir = normalize(u_velocity);
        // Perpendicular curl vector for 2D vortex rotation
        vec2 curl = vec2(-dvec.y, dvec.x);
        float wake = max(0.0, dot(-dvec, velDir));
        float swirl = infl * (wake * 0.6 + 0.4) * min(speed * 0.8, 0.25);
        p += curl * swirl;
        p += u_velocity * infl * 0.18;
    }

    // 2. Wet-on-wet blue ink blooms from user clicks/taps
    // Step A: Calculate physical disturbance of underlying green wash
    vec2 bloomDisplace = vec2(0.0);
    float bloomWashDisturb = 0.0;
    float bloomThinning = 0.0;

    for (int i = 0; i < MAX_BLOOMS; i++) {
        vec4 bData = u_bloomData[i];
        float age = bData.z;
        if (age >= 0.0 && age < 16.0) {
            vec2 bPos = bData.xy;
            float maxR = bData.w;
            vec2 rVec = (uv - bPos) * vec2(aspect, 1.0);

            // Organic oblong droplet orientation and eccentricity
            float dropAngle = hash(bPos * 43.17 + vec2(12.3, 7.9)) * 6.28318;
            float dropStretch = 1.30 + hash(bPos * 19.83 + vec2(3.1, 9.7)) * 0.40;
            vec2 rotVec = vec2(
                rVec.x * cos(dropAngle) - rVec.y * sin(dropAngle),
                (rVec.x * sin(dropAngle) + rVec.y * cos(dropAngle)) * dropStretch
            );
            float d = length(rotVec);

            // Expansion phase: blooms out smoothly over 0.9s
            float growProgress = min(1.0, age / 0.9);
            float easeGrow = 1.0 - pow(1.0 - growProgress, 3.0);
            float life = 1.0 - smoothstep(3.5, 15.0, age);

            float currentRadius = maxR * easeGrow;

            // Physical displacement of underlying green wash
            vec2 pushDir = normalize(rVec + vec2(0.0001));
            float dNorm = d / max(currentRadius, 0.001);
            float pushMag = exp(-pow(dNorm - 0.75, 2.0) / 0.20) * (1.0 - smoothstep(1.0, 2.4, dNorm));
            float ripple = sin(clamp((d - currentRadius) * 35.0, -3.1415, 3.1415)) * exp(-age * 1.0) * 0.5;
            bloomDisplace += pushDir * (pushMag * 0.12 + ripple * 0.04) * life;

            // Green wash excavation in drop center & accumulation ridge at rim
            float innerHole = exp(-pow(d / max(currentRadius * 0.85, 0.001), 2.0));
            float rimAccum = smoothstep(currentRadius * 0.60, currentRadius, d) * (1.0 - smoothstep(currentRadius, currentRadius * 1.40, d));
            bloomThinning += innerHole * 0.25 * life;
            bloomWashDisturb += (rimAccum * 0.22 - innerHole * 0.18) * life;
        }
    }

    p += bloomDisplace;

    p.y /= (1.0 + STREAK);
    p = p * SCALE + u_seed;

    float t = u_time * (u_reducedMotion > 0.5 ? 0.015 : SPEED);

    // Multi-octave domain warping for background fluid flow
    vec2 q = vec2(fbm(p + t * 0.10),
                  fbm(p + vec2(5.2, 1.3) - t * 0.07));
    vec2 r = vec2(fbm(p + WARP * q + vec2(1.7, 9.2) + t * 0.14),
                  fbm(p + WARP * q + vec2(8.3, 2.8) - t * 0.11));
    float f = fbm(p + WARP * r);

    // Disturb the green wash domain value itself
    f += bloomWashDisturb;

    // Edge bleed / capillary dissolve noise
    float eFrame = floor(u_time * 12.0);
    vec2 egp = gl_FragCoord.xy;
    egp.y /= 2.5;
    float en = mix(hash(floor(egp) + fract(eFrame * 0.1031) * vec2(19.3, 7.7)),
                   hash(floor(egp) * 0.37 + 13.7), 0.5);
    float dn = (en - 0.5) * 0.015;

    // Palette interpolation
    vec3 c0 = mix(L_C0, D_C0, u_dark);
    vec3 c1 = mix(L_C1, D_C1, u_dark);
    vec3 c2 = mix(L_C2, D_C2, u_dark);
    vec3 c3 = mix(L_C3, D_C3, u_dark);
    vec3 c4 = mix(L_C4, D_C4, u_dark);
    vec3 c5 = mix(L_C5, D_C5, u_dark);
    vec3 lineCol = mix(L_LINE, D_LINE, u_dark);

    // Layer base green watercolor washes
    const float HW = 0.03;
    vec3 col = mix(c0, c1, smoothstep(0.35 - HW, 0.35 + HW, f + dn));
    col = mix(col, c2, smoothstep(0.55 - HW, 0.55 + HW, q.x + dn) * 0.75);
    col = mix(col, c3, smoothstep(0.68 - HW, 0.68 + HW, r.y + dn) * 0.65);
    col = mix(col, c4, smoothstep(0.76 - HW, 0.76 + HW, q.y * f * 1.5 + dn) * 0.50);
    col = mix(col, c5, smoothstep(0.83 - HW, 0.83 + HW, r.x * q.x + dn) * 0.40);

    // Green wash excavation in the bloom center (dilution back to light base paper)
    if (bloomThinning > 0.001) {
        vec3 basePaper = mix(c0, c1, 0.35);
        col = mix(col, basePaper, clamp(bloomThinning * 0.40, 0.0, 0.35));
    }

    // Prismatic / Chromatic Dispersion along pigment edges
    float fRight = fbm(p + WARP * r + vec2(0.025, 0.0));
    float fUp    = fbm(p + WARP * r + vec2(0.0, 0.025));
    vec2 grad = vec2(fRight - f, fUp - f);
    float gradMag = length(grad);
    float prismStrength = smoothstep(0.07, 0.20, gradMag);
    vec3 prismLight = mix(
        vec3(0.88, 0.74, 0.45), // Warm golden rim
        vec3(0.28, 0.82, 0.72), // Cyan/teal refraction
        sin(f * 14.0 + u_time * 0.6) * 0.5 + 0.5
    );
    vec3 prismDark = mix(
        vec3(0.32, 0.95, 0.78), // Bioluminescent cyan glow
        vec3(0.72, 0.96, 0.48), // Aurora lime rim
        sin(f * 14.0 + u_time * 0.6) * 0.5 + 0.5
    );
    vec3 prismColor = mix(prismLight, prismDark, u_dark);
    col = mix(col, prismColor, prismStrength * 0.22);

    // Step B: Blue pigment evaluation with organic morphing & absorption into background amorphous wash
    vec3 bloomAccumColor = vec3(0.0);
    float bloomAccumWeight = 0.0;

    for (int i = 0; i < MAX_BLOOMS; i++) {
        vec4 bData = u_bloomData[i];
        float age = bData.z;
        if (age >= 0.0 && age < 16.0) {
            vec2 bPos = bData.xy;
            float maxR = bData.w;
            vec2 rVec = (uv - bPos) * vec2(aspect, 1.0);

            // Expansion & life decay over ~15 seconds
            float growProgress = min(1.0, age / 0.9);
            float easeGrow = 1.0 - pow(1.0 - growProgress, 3.0);
            float life = 1.0 - smoothstep(3.5, 15.0, age);

            // Organic oblong droplet orientation and eccentricity
            float dropAngle = hash(bPos * 43.17 + vec2(12.3, 7.9)) * 6.28318;
            float dropStretch = 1.30 + hash(bPos * 19.83 + vec2(3.1, 9.7)) * 0.40;
            vec2 rotVec = vec2(
                rVec.x * cos(dropAngle) - rVec.y * sin(dropAngle),
                (rVec.x * sin(dropAngle) + rVec.y * cos(dropAngle)) * dropStretch
            );

            // Morphing into background amorphous fluid streamlines:
            // As the bloom ages, background flow fields (r and q) pull and stretch the pigment
            float morph = smoothstep(0.8, 11.0, age);
            vec2 fluidStretch = ((r - 0.5) * 1.6 + (q - 0.5) * 1.0) * maxR * 1.4;
            vec2 morphedRVec = rotVec - fluidStretch * morph;

            // Fine organic paper bleed noise
            vec2 bleedCoord = morphedRVec * 16.0 + bPos * 6.0;
            float bleedNoise = noise(bleedCoord) * 0.65 + noise(bleedCoord * 2.5 + vec2(1.7, 4.3)) * 0.35;
            float currentRadius = maxR * easeGrow * (0.88 + 0.24 * bleedNoise);

            // Amorphous background absorption:
            // Pigment seeps along the FBM density ridges (f) of the background wash
            float d = length(morphedRVec);
            float washAffinity = (f - 0.5) * maxR * 0.65 * morph;
            float effectiveD = d - washAffinity;

            // Feathered watercolor pigment edge with diffusion that widens as it gets absorbed
            float edgeSoftness = currentRadius * (0.40 + 0.35 * morph);
            float pigment = 1.0 - smoothstep(currentRadius - edgeSoftness, currentRadius + 0.02, effectiveD);
            float core = (1.0 - smoothstep(0.0, currentRadius * 0.50, effectiveD)) * (1.0 - morph * 0.55);
            float totalPigment = clamp(pigment * 0.72 + core * 0.28, 0.0, 1.0) * life;

            if (totalPigment > 0.001) {
                vec3 bColor = u_bloomColors[i];
                if (u_dark > 0.5) {
                    bColor = mix(bColor, bColor * 1.25 + vec3(0.02, 0.06, 0.16), 0.50);
                }
                bloomAccumColor += bColor * totalPigment;
                bloomAccumWeight += totalPigment;
            }
        }
    }

    // Wet-on-wet glazing: blend rich blue pigment blooms into the green watercolor wash
    if (bloomAccumWeight > 0.001) {
        vec3 avgBloomColor = bloomAccumColor / max(bloomAccumWeight, 1.0);
        float bloomAlpha = clamp(bloomAccumWeight * 0.72, 0.0, 0.70);

        // Clear watercolor blue wash over paper; blends with green into rich teal & oceanic hues without any browning
        vec3 blueWash = mix(col, avgBloomColor, 0.62);
        blueWash.r = min(blueWash.r, col.r * 0.70 + avgBloomColor.r * 0.30);
        blueWash.b = max(blueWash.b, mix(col.b, avgBloomColor.b, 0.75));

        col = mix(col, blueWash, bloomAlpha);
    }

    // Drying puddle contour lines
    float e1 = 1.0 - smoothstep(0.0, 0.02, abs(f + dn - 0.35));
    float e2 = 1.0 - smoothstep(0.0, 0.02, abs(q.x + dn - 0.55));
    float e3 = 1.0 - smoothstep(0.0, 0.02, abs(r.y + dn - 0.68));
    float lineM = max(max(e1, e2), e3);
    float covN = noise(p * 1.5 + vec2(31.7, 7.9));
    lineM *= 1.0 - smoothstep(0.20, 0.38, covN);
    col = mix(col, lineCol, lineM * 0.24);

    // Paper grain
    float gFrame = floor(u_time * 12.0);
    vec2 gp = floor(gl_FragCoord.xy);
    float g = hash(gp + fract(gFrame * 0.1031) * vec2(37.7, 17.3)) - 0.5;
    col += g * 0.03;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

const MAX_BLOOMS = 16;

// Curated range of rich, pure watercolor blue tones
const BLUE_PALETTE: [number, number, number][] = [
    [0.08, 0.38, 0.92], // Vibrant French Ultramarine
    [0.10, 0.46, 0.94], // Luminous Cobalt Blue
    [0.06, 0.56, 0.96], // Pure Cerulean Wash
    [0.04, 0.52, 0.90], // Phthalo Cyan Blue
    [0.06, 0.32, 0.84], // Deep Lapis Lazuli
    [0.05, 0.62, 0.95], // Mediterranean Azure
    [0.14, 0.48, 0.92], // Cornflower Blue
    [0.08, 0.38, 0.86], // Royal Sapphire
    [0.04, 0.64, 0.90], // Brilliant Turquoise Blue
];

interface Bloom {
    x: number;
    y: number;
    startTime: number;
    maxRadius: number;
    color: [number, number, number];
}

export interface WatercolorBackgroundProps {
    /** Optional additional Tailwind CSS classes for the canvas element */
    className?: string;
}

export default function WatercolorBackground({ className = "" }: WatercolorBackgroundProps = {}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
        if (!gl) return;

        function compileShader(type: number, source: string): WebGLShader | null {
            if (!gl) return null;
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("Shader compilation failed:", gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
        const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
        if (!vs || !fs) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Program linking failed:", gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return;
        }

        gl.useProgram(program);

        // Setup screen-covering triangle
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 3, -1, -1, 3]),
            gl.STATIC_DRAW
        );

        const aPosition = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        // Uniform locations
        const uRes = gl.getUniformLocation(program, "u_res");
        const uTime = gl.getUniformLocation(program, "u_time");
        const uMouse = gl.getUniformLocation(program, "u_mouse");
        const uVelocity = gl.getUniformLocation(program, "u_velocity");
        const uSeed = gl.getUniformLocation(program, "u_seed");
        const uDark = gl.getUniformLocation(program, "u_dark");
        const uReducedMotion = gl.getUniformLocation(program, "u_reducedMotion");
        const uBloomData = gl.getUniformLocation(program, "u_bloomData[0]") || gl.getUniformLocation(program, "u_bloomData");
        const uBloomColors = gl.getUniformLocation(program, "u_bloomColors[0]") || gl.getUniformLocation(program, "u_bloomColors");

        // Seed random pattern layout
        gl.uniform1f(uSeed, Math.random() * 100.0);

        // State trackers: Position & Velocity
        const targetMouse = [0.5, 0.5];
        const currentMouse = [0.5, 0.5];
        const targetVel = [0.0, 0.0];
        const currentVel = [0.0, 0.0];
        let lastPointerTime = performance.now();
        let lastPointerX = 0.5;
        let lastPointerY = 0.5;

        // Bloom state (recycled via 15s lifespan)
        const blooms: Bloom[] = [];

        // Theme tracking
        const mediaDark = window.matchMedia("(prefers-color-scheme: dark)");
        let targetDark = mediaDark.matches ? 1.0 : 0.0;
        let currentDark = targetDark;

        const handleThemeChange = (e: MediaQueryListEvent) => {
            targetDark = e.matches ? 1.0 : 0.0;
        };
        mediaDark.addEventListener("change", handleThemeChange);

        // Reduced motion tracking
        const mediaReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        let isReducedMotion = mediaReduced.matches;
        const handleReducedChange = (e: MediaQueryListEvent) => {
            isReducedMotion = e.matches;
        };
        mediaReduced.addEventListener("change", handleReducedChange);

        // Pointer move tracking with velocity estimation
        const handlePointerMove = (e: PointerEvent) => {
            const x = e.clientX / window.innerWidth;
            const y = 1.0 - e.clientY / window.innerHeight;
            const now = performance.now();
            const dt = Math.max((now - lastPointerTime) / 1000.0, 0.001);

            const vx = (x - lastPointerX) / dt;
            const vy = (y - lastPointerY) / dt;
            targetVel[0] = Math.max(-4.0, Math.min(4.0, vx * 0.12));
            targetVel[1] = Math.max(-4.0, Math.min(4.0, vy * 0.12));

            targetMouse[0] = x;
            targetMouse[1] = y;
            lastPointerX = x;
            lastPointerY = y;
            lastPointerTime = now;
        };
        window.addEventListener("pointermove", handlePointerMove, { passive: true });

        // Tap / Click tracking (paints wet-on-wet mineral blue blooms)
        const handlePointerDown = (e: PointerEvent) => {
            const x = e.clientX / window.innerWidth;
            const y = 1.0 - e.clientY / window.innerHeight;
            const now = performance.now();

            // Random blue tone from muted curated palette
            const randomColor = BLUE_PALETTE[Math.floor(Math.random() * BLUE_PALETTE.length)];
            // Much smaller, delicate droplet radius
            const maxRadius = 0.050 + Math.random() * 0.035;

            // Find an expired slot (>= 15s) or recycle the oldest active one
            let targetSlot = -1;
            let oldestAge = -1;
            for (let i = 0; i < MAX_BLOOMS; i++) {
                if (!blooms[i] || (now - blooms[i].startTime) / 1000.0 >= 15.0) {
                    targetSlot = i;
                    break;
                }
                const bAge = now - blooms[i].startTime;
                if (bAge > oldestAge) {
                    oldestAge = bAge;
                    targetSlot = i;
                }
            }
            if (targetSlot < 0) targetSlot = 0;

            blooms[targetSlot] = {
                x,
                y,
                startTime: now,
                maxRadius,
                color: randomColor,
            };
        };
        window.addEventListener("pointerdown", handlePointerDown, { passive: true });

        // Responsive viewport resizing with 0.7x downsampling
        const handleResize = () => {
            if (!canvas || !gl) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.max(1, Math.round(window.innerWidth * dpr * 0.7));
            canvas.height = Math.max(1, Math.round(window.innerHeight * dpr * 0.7));
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        window.addEventListener("resize", handleResize, { passive: true });
        handleResize();

        // Animation loop
        const startTime = performance.now();
        let rafId: number | null = null;
        let isPaused = document.visibilityState === "hidden";

        const handleVisibilityChange = () => {
            isPaused = document.visibilityState === "hidden";
            if (!isPaused && rafId === null) {
                rafId = requestAnimationFrame(render);
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Preallocated typed arrays for bloom uniforms
        const bloomDataArray = new Float32Array(MAX_BLOOMS * 4);
        const bloomColorArray = new Float32Array(MAX_BLOOMS * 3);

        const render = () => {
            if (isPaused) {
                rafId = null;
                return;
            }

            const now = performance.now();
            const elapsed = (now - startTime) / 1000.0;

            // Smooth cursor coordinates
            currentMouse[0] += (targetMouse[0] - currentMouse[0]) * 0.06;
            currentMouse[1] += (targetMouse[1] - currentMouse[1]) * 0.06;

            // Decay velocity & smooth
            targetVel[0] *= 0.92;
            targetVel[1] *= 0.92;
            currentVel[0] += (targetVel[0] - currentVel[0]) * 0.08;
            currentVel[1] += (targetVel[1] - currentVel[1]) * 0.08;

            // Smooth theme interpolation
            currentDark += (targetDark - currentDark) * 0.08;

            // Update bloom uniform buffer (fading gracefully over 15 seconds)
            for (let i = 0; i < MAX_BLOOMS; i++) {
                const b = blooms[i];
                const dataIdx = i * 4;
                const colIdx = i * 3;
                if (b) {
                    const age = (now - b.startTime) / 1000.0;
                    if (age < 15.5) {
                        bloomDataArray[dataIdx] = b.x;
                        bloomDataArray[dataIdx + 1] = b.y;
                        bloomDataArray[dataIdx + 2] = age;
                        bloomDataArray[dataIdx + 3] = b.maxRadius;

                        bloomColorArray[colIdx] = b.color[0];
                        bloomColorArray[colIdx + 1] = b.color[1];
                        bloomColorArray[colIdx + 2] = b.color[2];
                    } else {
                        bloomDataArray[dataIdx] = 0.0;
                        bloomDataArray[dataIdx + 1] = 0.0;
                        bloomDataArray[dataIdx + 2] = -1.0;
                        bloomDataArray[dataIdx + 3] = 0.0;

                        bloomColorArray[colIdx] = 0.0;
                        bloomColorArray[colIdx + 1] = 0.0;
                        bloomColorArray[colIdx + 2] = 0.0;
                    }
                } else {
                    bloomDataArray[dataIdx] = 0.0;
                    bloomDataArray[dataIdx + 1] = 0.0;
                    bloomDataArray[dataIdx + 2] = -1.0;
                    bloomDataArray[dataIdx + 3] = 0.0;

                    bloomColorArray[colIdx] = 0.0;
                    bloomColorArray[colIdx + 1] = 0.0;
                    bloomColorArray[colIdx + 2] = 0.0;
                }
            }

            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.uniform1f(uTime, elapsed);
            gl.uniform2f(uMouse, currentMouse[0], currentMouse[1]);
            gl.uniform2f(uVelocity, currentVel[0], currentVel[1]);
            gl.uniform1f(uDark, currentDark);
            gl.uniform1f(uReducedMotion, isReducedMotion ? 1.0 : 0.0);
            gl.uniform4fv(uBloomData, bloomDataArray);
            gl.uniform3fv(uBloomColors, bloomColorArray);

            gl.drawArrays(gl.TRIANGLES, 0, 3);

            rafId = requestAnimationFrame(render);
        };

        // Trigger initial frame
        render();
        setIsLoaded(true);

        return () => {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            mediaDark.removeEventListener("change", handleThemeChange);
            mediaReduced.removeEventListener("change", handleReducedChange);

            if (buffer) gl.deleteBuffer(buffer);
            if (vs) gl.deleteShader(vs);
            if (fs) gl.deleteShader(fs);
            if (program) gl.deleteProgram(program);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={`fixed inset-0 w-screen h-screen pointer-events-none -z-20 block transition-opacity duration-700 ease-out ${
                isLoaded ? "opacity-100" : "opacity-0"
            } ${className}`}
        />
    );
}
