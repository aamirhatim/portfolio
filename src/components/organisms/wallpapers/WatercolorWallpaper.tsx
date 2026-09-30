import { useEffect, useRef, useState } from "react";

const VERTEX_SHADER = `
attribute vec2 a_position;

uniform float u_dark;

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

varying vec3 v_c0;
varying vec3 v_c1;
varying vec3 v_c2;
varying vec3 v_c3;
varying vec3 v_c4;
varying vec3 v_c5;
varying vec3 v_lineCol;
varying vec3 v_pA;
varying vec3 v_pB;

void main() {
    v_c0 = mix(L_C0, D_C0, u_dark);
    v_c1 = mix(L_C1, D_C1, u_dark);
    v_c2 = mix(L_C2, D_C2, u_dark);
    v_c3 = mix(L_C3, D_C3, u_dark);
    v_c4 = mix(L_C4, D_C4, u_dark);
    v_c5 = mix(L_C5, D_C5, u_dark);
    v_lineCol = mix(L_LINE, D_LINE, u_dark);

    // Prismatic color gradient endpoints interpolated by theme
    v_pA = mix(vec3(0.88, 0.74, 0.45), vec3(0.32, 0.95, 0.78), u_dark);
    v_pB = mix(vec3(0.28, 0.82, 0.72), vec3(0.72, 0.96, 0.48), u_dark);

    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_velocity;
uniform float u_seed;
uniform float u_reducedMotion;

varying vec3 v_c0;
varying vec3 v_c1;
varying vec3 v_c2;
varying vec3 v_c3;
varying vec3 v_c4;
varying vec3 v_c5;
varying vec3 v_lineCol;
varying vec3 v_pA;
varying vec3 v_pB;

const float SPEED = 0.07;
const float SCALE = 3.2;
const float WARP = 1.25;
const float STREAK = 1.8;

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

    p.y /= (1.0 + STREAK);
    p = p * SCALE + u_seed;

    float t = u_time * (u_reducedMotion > 0.5 ? 0.015 : SPEED);

    // Multi-octave domain warping for background fluid flow
    vec2 q = vec2(fbm(p + t * 0.10),
                  fbm(p + vec2(5.2, 1.3) - t * 0.07));
    vec2 r = vec2(fbm(p + WARP * q + vec2(1.7, 9.2) + t * 0.14),
                  fbm(p + WARP * q + vec2(8.3, 2.8) - t * 0.11));
    float f = fbm(p + WARP * r);

    // Unified grain seed computed once per fragment
    float grainSeed = fract(floor(u_time * 12.0) * 0.1031);

    // Edge bleed / capillary dissolve noise
    vec2 egp = gl_FragCoord.xy;
    egp.y /= 2.5;
    float en = mix(hash(floor(egp) + grainSeed * vec2(19.3, 7.7)),
                   hash(floor(egp) * 0.37 + 13.7), 0.5);
    float dn = (en - 0.5) * 0.015;

    // Layer base green watercolor washes using vertex-interpolated palette
    const float HW = 0.03;
    vec3 col = mix(v_c0, v_c1, smoothstep(0.35 - HW, 0.35 + HW, f + dn));
    col = mix(col, v_c2, smoothstep(0.55 - HW, 0.55 + HW, q.x + dn) * 0.75);
    col = mix(col, v_c3, smoothstep(0.68 - HW, 0.68 + HW, r.y + dn) * 0.65);
    col = mix(col, v_c4, smoothstep(0.76 - HW, 0.76 + HW, q.y * f * 1.5 + dn) * 0.50);
    col = mix(col, v_c5, smoothstep(0.83 - HW, 0.83 + HW, r.x * q.x + dn) * 0.40);

    // Prismatic / Chromatic Dispersion along pigment edges (hardware derivatives eliminate 2 full FBMs)
#ifdef GL_OES_standard_derivatives
    vec2 grad = vec2(dFdx(f), dFdy(f)) * (u_res.y * 0.008);
#else
    float fRight = fbm(p + WARP * r + vec2(0.025, 0.0));
    float fUp    = fbm(p + WARP * r + vec2(0.0, 0.025));
    vec2 grad = vec2(fRight - f, fUp - f);
#endif
    float gradMag = length(grad);
    float prismStrength = smoothstep(0.07, 0.20, gradMag);
    vec3 prismColor = mix(v_pA, v_pB, sin(f * 14.0 + u_time * 0.6) * 0.5 + 0.5);
    col = mix(col, prismColor, prismStrength * 0.22);

    // Drying puddle contour lines
    float e1 = 1.0 - smoothstep(0.0, 0.02, abs(f + dn - 0.35));
    float e2 = 1.0 - smoothstep(0.0, 0.02, abs(q.x + dn - 0.55));
    float e3 = 1.0 - smoothstep(0.0, 0.02, abs(r.y + dn - 0.68));
    float lineM = max(max(e1, e2), e3);
    float covN = noise(p * 1.5 + vec2(31.7, 7.9));
    lineM *= 1.0 - smoothstep(0.20, 0.38, covN);
    col = mix(v_lineCol, col, 1.0 - lineM * 0.24);

    // Paper grain
    vec2 gp = floor(gl_FragCoord.xy);
    float g = hash(gp + grainSeed * vec2(37.7, 17.3)) - 0.5;
    col += g * 0.03;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export interface WatercolorWallpaperProps {
    /** Optional additional Tailwind CSS classes for the canvas element */
    className?: string;
}

export type WatercolorBackgroundProps = WatercolorWallpaperProps;

export default function WatercolorWallpaper({ className = "" }: WatercolorWallpaperProps = {}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
        if (!gl) return;

        // Enable hardware standard derivatives if available (for zero-cost analytical gradients)
        gl.getExtension("OES_standard_derivatives");

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

        // Viewport dimensions cache to prevent window layout thrashing on pointermove
        let winWidth = window.innerWidth;
        let winHeight = window.innerHeight;

        const handlePointerMove = (e: PointerEvent) => {
            const x = e.clientX / (winWidth || 1);
            const y = 1.0 - e.clientY / (winHeight || 1);
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

        // Responsive viewport resizing with resolution capping to preserve fill rate
        const handleResize = () => {
            if (!canvas || !gl) return;
            winWidth = window.innerWidth;
            winHeight = window.innerHeight;

            // Cap internal resolution to avoid fill-rate explosion on 4K / Retina screens
            // Soft watercolor washes look smooth when upscaled via bilinear hardware filtering
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            const maxDimension = 1920;
            let targetWidth = Math.round(winWidth * dpr * 0.65);
            let targetHeight = Math.round(winHeight * dpr * 0.65);

            if (targetWidth > maxDimension || targetHeight > maxDimension) {
                const scale = maxDimension / Math.max(targetWidth, targetHeight);
                targetWidth = Math.round(targetWidth * scale);
                targetHeight = Math.round(targetHeight * scale);
            }

            canvas.width = Math.max(1, targetWidth);
            canvas.height = Math.max(1, targetHeight);
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        window.addEventListener("resize", handleResize, { passive: true });
        handleResize();

        // Animation loop with frame rate throttling to preserve battery
        const startTime = performance.now();
        let rafId: number | null = null;
        let isPaused = document.visibilityState === "hidden";
        let lastFrameTime = performance.now();

        const handleVisibilityChange = () => {
            isPaused = document.visibilityState === "hidden";
            if (!isPaused && rafId === null) {
                lastFrameTime = performance.now();
                rafId = requestAnimationFrame(render);
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        const render = (currentTime: number) => {
            if (isPaused) {
                rafId = null;
                return;
            }

            rafId = requestAnimationFrame(render);

            // Cap at 60 FPS (or 30 FPS under reduced motion) to prevent 120Hz/ProMotion battery burn
            const targetInterval = isReducedMotion ? 33.33 : 16.66;
            const elapsedSinceLast = currentTime - lastFrameTime;

            if (elapsedSinceLast < targetInterval - 1.0) {
                return;
            }

            lastFrameTime = currentTime - (elapsedSinceLast % targetInterval);
            const elapsed = (currentTime - startTime) / 1000.0;

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

            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.uniform1f(uTime, elapsed);
            gl.uniform2f(uMouse, currentMouse[0], currentMouse[1]);
            gl.uniform2f(uVelocity, currentVel[0], currentVel[1]);
            gl.uniform1f(uDark, currentDark);
            gl.uniform1f(uReducedMotion, isReducedMotion ? 1.0 : 0.0);

            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        // Trigger initial frame
        rafId = requestAnimationFrame(render);
        setIsLoaded(true);

        return () => {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            mediaDark.removeEventListener("change", handleThemeChange);
            mediaReduced.removeEventListener("change", handleReducedChange);

            gl.disableVertexAttribArray(aPosition);
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
            className={`fixed inset-0 w-full h-full pointer-events-none -z-20 block transition-opacity duration-700 ease-out transform-gpu ${
                isLoaded ? "opacity-100" : "opacity-0"
            } ${className}`}
        />
    );
}
