import { useEffect, useRef, useState } from "react";

// ============================================================================
// HIGH-LEVEL CONFIGURATION PARAMETERS (2D SWARM FLOCK SIMULATION)
// Adjust these parameters to tune flock size, physics, non-collision bounds,
// and dynamic cursor response (avoidance while moving, swarming while still).
// ============================================================================

export interface FlockSwarmConfig {
    /** Total number of flocking boids in the simulation (default: 5) */
    boidCount: number;
    /** Base rendering size in pixels (length and wingspan) */
    boidSize: number;

    /** Minimum cruising speed in pixels per frame */
    minSpeed: number;
    /** Maximum flight speed in pixels per frame */
    maxSpeed: number;
    /** Steering agility force limit applied per frame */
    maxForce: number;
    /** Lateral aerodynamic sinusoidal wander amplitude */
    wanderStrength: number;
    /** Inertial heading persistence (0 = agile turns, 1 = heavy momentum) */
    headingPersistence: number;
    /** Baseline maximum turning rate in radians per frame */
    maxTurnRate: number;
    /** Maximum turning rate during evasive panic */
    cursorFleeMaxTurnRate: number;

    /** Neighbor detection radius for local flocking behaviors */
    flockRadius: number;
    /** Repulsion steering weight between flockmates */
    separationWeight: number;
    /** Velocity matching steering weight with flockmates */
    alignmentWeight: number;
    /** Centering steering weight toward local flock center of mass */
    cohesionWeight: number;

    /** Cursor avoidance trigger radius in pixels */
    cursorFleeRadius: number;
    /** Repulsion force strength pushing birds away from cursor */
    cursorFleeForce: number;
    /** Seconds cursor must remain still before birds begin swarming */
    cursorStillDelay: number;
    /** Duration in seconds over which swarming attraction ramps in */
    cursorSwarmRampDuration: number;
    /** Maximum reach radius for attraction when cursor is stationary */
    cursorAttractRadius: number;
    /** Gravitational attraction pull strength toward stationary cursor */
    cursorAttractForce: number;
    /** Orbital radius threshold where attraction transitions to orbit */
    cursorOrbitRadius: number;
    /** Tangential velocity boost maintaining orbital rotation */
    cursorOrbitStrength: number;

    /** Individual personality variance (0 to 1) applied to cruise speed, agility, and orbit shells */
    personalityVariance: number;

    /** Distribution ratio across the 3 focal depth variants [sharpForeground, softMidground, defocusedBackground] */
    depthTierRatio: [number, number, number];

    /** Whether to draw connection lines between flocking birds and their nearest neighbors */
    enableFlockLines: boolean;
    /** Number of nearest neighbors to connect with lines (default: 3) */
    flockLineNeighborCount: number;
    /** Minimum number of neighbors within flock radius for a bird to be considered part of a flock */
    minFlockNeighbors: number;
    /** Maximum reach distance for flock neighbor connection lines in pixels */
    flockLineMaxDistance: number;
    /** Base opacity of flock connection lines (0 to 1) */
    flockLineOpacity: number;

    /** Whether to overlay an authentic frosted glass pane over the simulation */
    frostedGlass: boolean;
    /** Frosted glass optical blur strength in pixels */
    frostedBlur: number;
    /** Whether to add micro-etched sandblast tactile noise to the frosted glass */
    frostedNoise: boolean;

    /** Light mode palette (Forest Sage & Soft Paper) */
    lightPalette: {
        background: string;
        boidBody: string;
        boidAccent: string;
        boidGlow: string;
        flockLine?: string;
    };

    /** Dark mode palette (Midnight Pine & Luminous Sage) */
    darkPalette: {
        background: string;
        boidBody: string;
        boidAccent: string;
        boidGlow: string;
        flockLine?: string;
    };
}

export type SwarmFlockConfig = FlockSwarmConfig;

const FLOCK_SWARM_DEFAULT_CONFIG: FlockSwarmConfig = {
    boidCount: 200,
    boidSize: 8,

    minSpeed: .1,
    maxSpeed: 1.5,
    maxForce: .3,
    wanderStrength: 0.02,
    headingPersistence: 0.6,
    maxTurnRate: 0.05,
    cursorFleeMaxTurnRate: 0.3,

    flockRadius: 60,
    separationWeight: .4,
    alignmentWeight: 0.1,
    cohesionWeight: 0.1,

    cursorFleeRadius: 150,
    cursorFleeForce: 1,
    cursorStillDelay: 0.5,
    cursorSwarmRampDuration: 4,
    cursorAttractRadius: 250,
    cursorAttractForce: .5,
    cursorOrbitRadius: 60,
    cursorOrbitStrength: 2,

    personalityVariance: 0.3,

    depthTierRatio: [0.45, 0.30, 0.25],

    enableFlockLines: true,
    flockLineNeighborCount: 3,
    minFlockNeighbors: 1,
    flockLineMaxDistance: 100,
    flockLineOpacity: 1,

    frostedGlass: true,
    frostedBlur: 2,
    frostedNoise: true,

    // Light Mode - Forest Sage Theme
    lightPalette: {
        background: "rgba(243, 246, 245, 0.45)",
        boidBody: "#226449", // Deep forest pine
        boidAccent: "#318260", // Forest sage
        boidGlow: "#56af88", // Mint highlight
        flockLine: "rgba(49, 130, 96, 0.28)",
    },

    // Dark Mode - Midnight Pine & Emerald Luminous Theme
    darkPalette: {
        background: "rgba(9, 14, 12, 0.45)",
        boidBody: "#3d8f6b", // Luminous pine
        boidAccent: "#56af88", // Bright emerald sage
        boidGlow: "#9ef5d2", // Bioluminescent mint core
        flockLine: "rgba(110, 214, 168, 0.28)",
    },
};

export const SWARM_FLOCK_DEFAULT_CONFIG = FLOCK_SWARM_DEFAULT_CONFIG;

export interface FlockSwarmWallpaperProps {
    /** Optional overrides for any high-level simulation configuration parameters */
    config?: Partial<FlockSwarmConfig>;
    /** Optional additional Tailwind CSS classes for the canvas element */
    className?: string;
}

export type SwarmFlockBackgroundProps = FlockSwarmWallpaperProps;

// ============================================================================
// INTERNAL CONSTANTS & HEURISTICS
// ============================================================================

/** Minimum cursor velocity (px/sec) to consider it actively moving */
const CURSOR_MOVE_THRESHOLD = 30;
/** Viewport boundary distance where soft inward turning begins (px) */
const BOUNDARY_MARGIN = 70;
/** Inward steering force when approaching viewport edges */
const BOUNDARY_TURN_FORCE = 0.2;
/** Hairline connection stroke width in pixels */
const FLOCK_LINE_WIDTH = 1.0;
/** Frequency of wing oscillation flapping animation */
const WING_OSCILLATION_SPEED = 7.5;
/** Seamless tactile sandblast noise texture data URI for frosted glass */
const FROSTED_NOISE_SVG = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

// ============================================================================
// PURE INTERNAL GEOMETRIC & MATH HELPERS
// ============================================================================

/** Normalizes an angle into the [-PI, PI] range */
function normalizeAngle(theta: number): number {
    let a = theta;
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
}

/** Coordinate pair [gridX, gridY] relative to the organism's center on a discrete pixel grid */
type PixelCoord = [number, number];

interface OrganismFrame {
    body: PixelCoord[];
    accent: PixelCoord[];
    glow: PixelCoord[];
}

/** 3-frame discrete pixel art gait for a cute baby sea creature / organism: [Glide, Paddle forward, Paddle back] */
const ORGANISM_FRAMES: [OrganismFrame, OrganismFrame, OrganismFrame] = [
    // FRAME 0: HAPPY GLIDE (Plump dumpling body, resting flippers, whale tail fluke)
    {
        body: [
            [-2, 0],           // Tail base
            [-1, -1], [-1, 0], [-1, 1], // Plump back
            [0, -1], [0, 1],   // Chubby flanks
            [1, 0],            // Snout bridge
            [2, 0],            // Rounded baby nose
        ],
        accent: [
            [-3, -1], [-3, 1], // Cute whale tail fluke lobes
            [-1, -2], [0, -2], // Stubby left flipper
            [-1, 2], [0, 2],   // Stubby right flipper
        ],
        glow: [
            [0, 0],            // Glowing tummy / heart
            [1, -1], [1, 1],   // Big cute glowing eyes
        ],
    },
    // FRAME 1: PADDLE FORWARD (Flippers paddle forward, tail fluke wiggles up)
    {
        body: [
            [-2, 0],
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, 0],
            [2, 0],
        ],
        accent: [
            [-3, -2], [-3, 0], // Tail fluke tilted up
            [0, -2], [1, -2],  // Left flipper paddles forward
            [0, 2], [1, 2],    // Right flipper paddles forward
        ],
        glow: [
            [0, 0],            // Glowing tummy
            [1, -1], [1, 1],   // Big cute eyes
        ],
    },
    // FRAME 2: PADDLE BACK (Flippers paddle backward, tail fluke wiggles down)
    {
        body: [
            [-2, 0],
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, 0],
            [2, 0],
        ],
        accent: [
            [-3, 0], [-3, 2],  // Tail fluke tilted down
            [-2, -2], [-1, -2],// Left flipper paddles backward
            [-2, 2], [-1, 2],  // Right flipper paddles backward
        ],
        glow: [
            [0, 0],            // Glowing tummy
            [1, -1], [1, 1],   // Big cute eyes
        ],
    },
];

/** Renders the pixel art organism with authentic discrete pixel squares and focal depth tiering */
function renderPixelOrganism(
    ctx: CanvasRenderingContext2D,
    focusTier: 0 | 1 | 2,
    frameIndex: number,
    pixelSize: number,
    palette: { boidBody: string; boidAccent: string; boidGlow: string }
): void {
    const frame = ORGANISM_FRAMES[frameIndex];
    const halfP = pixelSize * 0.5;

    if (focusTier === 0) {
        // TIER 0: CRISP PIXEL ART FOREGROUND
        ctx.globalAlpha = 1.0;

        // Accent & fins
        ctx.fillStyle = palette.boidAccent;
        for (let i = 0; i < frame.accent.length; i++) {
            const [gx, gy] = frame.accent[i];
            ctx.fillRect(gx * pixelSize - halfP, gy * pixelSize - halfP, pixelSize, pixelSize);
        }

        // Core organism carapace
        ctx.fillStyle = palette.boidBody;
        for (let i = 0; i < frame.body.length; i++) {
            const [gx, gy] = frame.body[i];
            ctx.fillRect(gx * pixelSize - halfP, gy * pixelSize - halfP, pixelSize, pixelSize);
        }

        // Bioluminescent eyes and heart nucleus
        ctx.fillStyle = palette.boidGlow;
        for (let i = 0; i < frame.glow.length; i++) {
            const [gx, gy] = frame.glow[i];
            ctx.fillRect(gx * pixelSize - halfP, gy * pixelSize - halfP, pixelSize, pixelSize);
        }
    } else if (focusTier === 1) {
        // TIER 1: SOFT FOCUS MIDGROUND PIXEL ART
        const pad = pixelSize * 0.6;

        // Translucent aura
        ctx.globalAlpha = 0.24;
        ctx.fillStyle = palette.boidBody;
        for (let i = 0; i < frame.body.length; i++) {
            const [gx, gy] = frame.body[i];
            ctx.fillRect(
                gx * pixelSize - halfP - pad * 0.5,
                gy * pixelSize - halfP - pad * 0.5,
                pixelSize + pad,
                pixelSize + pad
            );
        }

        // Midground body
        ctx.globalAlpha = 0.76;
        ctx.fillStyle = palette.boidBody;
        for (let i = 0; i < frame.body.length; i++) {
            const [gx, gy] = frame.body[i];
            ctx.fillRect(gx * pixelSize - halfP, gy * pixelSize - halfP, pixelSize, pixelSize);
        }

        // Midground accent
        ctx.globalAlpha = 0.68;
        ctx.fillStyle = palette.boidAccent;
        for (let i = 0; i < frame.accent.length; i++) {
            const [gx, gy] = frame.accent[i];
            ctx.fillRect(gx * pixelSize - halfP, gy * pixelSize - halfP, pixelSize, pixelSize);
        }

        // Luminous eye/heart glow
        ctx.globalAlpha = 0.90;
        ctx.fillStyle = palette.boidGlow;
        for (let i = 0; i < frame.glow.length; i++) {
            const [gx, gy] = frame.glow[i];
            ctx.fillRect(gx * pixelSize - halfP, gy * pixelSize - halfP, pixelSize, pixelSize);
        }
    } else {
        // TIER 2: DEFOCUSED BOKEH DEEP ORGANISM
        const halo = pixelSize * 1.6;

        // Broad diffuse halo
        ctx.globalAlpha = 0.14;
        ctx.fillStyle = palette.boidBody;
        for (let i = 0; i < frame.body.length; i++) {
            const [gx, gy] = frame.body[i];
            ctx.fillRect(
                gx * pixelSize - halfP - halo * 0.5,
                gy * pixelSize - halfP - halo * 0.5,
                pixelSize + halo,
                pixelSize + halo
            );
        }

        // Translucent deep-water organism
        ctx.globalAlpha = 0.40;
        ctx.fillStyle = palette.boidAccent;
        for (let i = 0; i < frame.accent.length; i++) {
            const [gx, gy] = frame.accent[i];
            ctx.fillRect(gx * pixelSize - halfP, gy * pixelSize - halfP, pixelSize, pixelSize);
        }
        ctx.fillStyle = palette.boidBody;
        for (let i = 0; i < frame.body.length; i++) {
            const [gx, gy] = frame.body[i];
            ctx.fillRect(gx * pixelSize - halfP, gy * pixelSize - halfP, pixelSize, pixelSize);
        }

        // Ethereal glowing core
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = palette.boidGlow;
        for (let i = 0; i < frame.glow.length; i++) {
            const [gx, gy] = frame.glow[i];
            ctx.fillRect(gx * pixelSize - halfP, gy * pixelSize - halfP, pixelSize, pixelSize);
        }
    }
}

// Internal Boid Data Structure
interface Boid {
    x: number;
    y: number;
    vx: number;
    vy: number;
    ax: number;
    ay: number;
    spd: number; // Current cruising speed in px/frame
    heading: number; // Current flight direction angle in radians
    scale: number;
    phase: number;
    orbitSign: number; // 1 for clockwise orbit, -1 for counter-clockwise
    // Individual Personality Traits
    speedMod: number;
    agilityMod: number;
    orbitRadiusMod: number;
    orbitSpeedMod: number;
    boldness: number; // 0.0 (cautious) to 1.0 (bold/curious)
    wanderFreq: number;
    wanderPhase: number;
    personalSwarm: number; // Current individualized swarming transition progress (0 to 1)
    panic: number; // Evasive panic intensity when repelled by cursor (0 to 1)
    focusTier: 0 | 1 | 2; // 0 = Sharp Foreground, 1 = Soft Midground, 2 = Defocused Bokeh Background
    nearestNeighbors: [number, number, number]; // Indices of up to 3 nearest flockmates (-1 if none)
    nearestDistances: [number, number, number]; // Distances in pixels to up to 3 nearest flockmates
    isFlocking: boolean; // Whether boid currently has enough flockmates to be part of a flock
}

export default function FlockSwarmWallpaper({ config: customConfig, className }: FlockSwarmWallpaperProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Merge high-level parameters
    const cfgRef = useRef<FlockSwarmConfig>({
        ...FLOCK_SWARM_DEFAULT_CONFIG,
        ...customConfig,
    });

    // Keep config reference synchronized if props change
    useEffect(() => {
        cfgRef.current = {
            ...FLOCK_SWARM_DEFAULT_CONFIG,
            ...customConfig,
        };
    }, [customConfig]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let screenWidth = window.innerWidth;
        let screenHeight = window.innerHeight;

        // System Theme and Reduced Motion queries
        const mediaDark = window.matchMedia("(prefers-color-scheme: dark)");
        let isDark = mediaDark.matches;
        const handleTheme = (e: MediaQueryListEvent) => {
            isDark = e.matches;
        };
        mediaDark.addEventListener("change", handleTheme);

        const mediaReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        let isReduced = mediaReduced.matches;
        const handleReduced = (e: MediaQueryListEvent) => {
            isReduced = e.matches;
        };
        mediaReduced.addEventListener("change", handleReduced);

        // Resize handler with High-DPI Retina support
        const handleResize = () => {
            if (!canvas) return;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            screenWidth = window.innerWidth;
            screenHeight = window.innerHeight;
            canvas.width = Math.floor(screenWidth * dpr);
            canvas.height = Math.floor(screenHeight * dpr);
        };
        handleResize();
        window.addEventListener("resize", handleResize, { passive: true });

        // Physics State & Boid Allocation
        const cfg = cfgRef.current;
        const boids: Boid[] = [];

        // Mouse Tracker with velocity heuristics
        let mouseX = -1000;
        let mouseY = -1000;
        let prevMouseX = -1000;
        let prevMouseY = -1000;
        let mouseVx = 0;
        let mouseVy = 0;
        let mouseSpeed = 0;
        let lastMouseMoveTime = 0;
        let mouseActive = false;
        let stillDuration = 0;
        let swarmIntensity = 0;

        const handlePointerMove = (e: PointerEvent) => {
            const now = performance.now();
            const dt = (now - lastMouseMoveTime) / 1000;
            lastMouseMoveTime = now;

            if (mouseX < 0 || dt <= 0.001 || dt > 0.5) {
                mouseX = e.clientX;
                mouseY = e.clientY;
                prevMouseX = e.clientX;
                prevMouseY = e.clientY;
                mouseVx = 0;
                mouseVy = 0;
                mouseSpeed = 0;
            } else {
                prevMouseX = mouseX;
                prevMouseY = mouseY;
                mouseX = e.clientX;
                mouseY = e.clientY;

                const rawVx = (mouseX - prevMouseX) / dt;
                const rawVy = (mouseY - prevMouseY) / dt;

                // Smooth exponential filter for velocity tracking
                mouseVx = mouseVx * 0.35 + rawVx * 0.65;
                mouseVy = mouseVy * 0.35 + rawVy * 0.65;
                mouseSpeed = Math.hypot(mouseVx, mouseVy);
            }
            mouseActive = true;
        };

        const handlePointerLeave = () => {
            mouseActive = false;
            mouseX = -1000;
            mouseY = -1000;
            mouseVx = 0;
            mouseVy = 0;
            mouseSpeed = 0;
            stillDuration = 0;
            swarmIntensity = 0;
        };

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

        // Initialize Boids
        for (let i = 0; i < cfg.boidCount; i++) {
            const initX = Math.random() * screenWidth;
            const initY = Math.random() * screenHeight;
            const angle = Math.random() * Math.PI * 2;
            const speed = cfg.minSpeed + Math.random() * (cfg.maxSpeed - cfg.minSpeed);

            // Individual personality modifiers: centered at 1.0 with variance bounded by personalityVariance
            const pVar = cfg.personalityVariance;
            const speedMod = 1.0 + (Math.random() * 2 - 1) * pVar;
            const agilityMod = 1.0 + (Math.random() * 2 - 1) * pVar;
            const orbitRadiusMod = 1.0 + (Math.random() * 2 - 1) * pVar;
            const orbitSpeedMod = 1.0 + (Math.random() * 2 - 1) * pVar;
            const boldness = Math.random(); // 0.0 (hesitant) to 1.0 (reckless)
            const wanderFreq = 0.8 + Math.random() * 1.5;
            const wanderPhase = Math.random() * Math.PI * 2;

            // Assign one of the 3 focus tiers based on depthTierRatio
            const ratio = cfg.depthTierRatio ?? SWARM_FLOCK_DEFAULT_CONFIG.depthTierRatio;
            const rand = Math.random();
            const focusTier: 0 | 1 | 2 = rand < ratio[0] ? 0 : rand < ratio[0] + ratio[1] ? 1 : 2;

            // Perspective scale: Foreground sharp birds are slightly larger, deep defocused birds are smaller
            const scale = focusTier === 0 ? 0.95 + Math.random() * 0.2 : focusTier === 1 ? 0.8 + Math.random() * 0.15 : 0.65 + Math.random() * 0.15;

            const initSpeed = speed * speedMod;
            boids.push({
                x: initX,
                y: initY,
                vx: Math.cos(angle) * initSpeed,
                vy: Math.sin(angle) * initSpeed,
                ax: 0,
                ay: 0,
                spd: initSpeed,
                heading: angle,
                scale,
                phase: Math.random() * Math.PI * 2,
                orbitSign: Math.random() < 0.5 ? 1 : -1,
                speedMod,
                agilityMod,
                orbitRadiusMod,
                orbitSpeedMod,
                boldness,
                wanderFreq,
                wanderPhase,
                personalSwarm: 0,
                panic: 0,
                focusTier,
                nearestNeighbors: [-1, -1, -1],
                nearestDistances: [Infinity, Infinity, Infinity],
                isFlocking: false,
            });
        }

        // Pre-sort depth order back-to-front (tier 2 defocused first, tier 0 sharp last on top)
        const depthOrder = new Int32Array(cfg.boidCount);
        for (let i = 0; i < cfg.boidCount; i++) depthOrder[i] = i;
        depthOrder.sort((a, b) => boids[b].focusTier - boids[a].focusTier);

        // Spatial Hashing Grid for O(N) neighbor query
        const maxPerception = Math.max(
            cfg.flockRadius,
            cfg.flockLineMaxDistance ?? cfg.flockRadius,
            cfg.boidSize * 3
        );
        const cellSize = maxPerception;
        let gridCols = Math.max(1, Math.ceil(screenWidth / cellSize));
        let gridRows = Math.max(1, Math.ceil(screenHeight / cellSize));
        let gridHead = new Int32Array(gridCols * gridRows).fill(-1);
        const gridNext = new Int32Array(cfg.boidCount).fill(-1);

        const updateSpatialGrid = () => {
            gridCols = Math.max(1, Math.ceil(screenWidth / cellSize));
            gridRows = Math.max(1, Math.ceil(screenHeight / cellSize));
            const totalCells = gridCols * gridRows;

            if (gridHead.length !== totalCells) {
                gridHead = new Int32Array(totalCells);
            }
            gridHead.fill(-1);

            for (let i = 0; i < boids.length; i++) {
                const b = boids[i];
                let cx = Math.floor(b.x / cellSize);
                let cy = Math.floor(b.y / cellSize);

                if (cx < 0) cx = 0;
                else if (cx >= gridCols) cx = gridCols - 1;
                if (cy < 0) cy = 0;
                else if (cy >= gridRows) cy = gridRows - 1;

                const cellIdx = cy * gridCols + cx;
                gridNext[i] = gridHead[cellIdx];
                gridHead[cellIdx] = i;
            }
        };

        // Animation Loop & Physics Engine
        let rafId: number | null = null;
        let isPaused = document.visibilityState === "hidden";
        const drawnEdges = new Set<number>();

        const handleVisibility = () => {
            isPaused = document.visibilityState === "hidden";
            if (!isPaused && rafId === null) {
                rafId = requestAnimationFrame(render);
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);

        let lastFrameTime = performance.now();
        const startTime = performance.now();

        const render = () => {
            if (isPaused) {
                rafId = null;
                return;
            }

            const now = performance.now();
            const dt = Math.min(0.035, (now - lastFrameTime) / 1000);
            const elapsed = (now - startTime) / 1000;
            lastFrameTime = now;

            const currentCfg = cfgRef.current;
            const speedMultiplier = isReduced ? 0.45 : 1.0;
            const maxSpd = currentCfg.maxSpeed * speedMultiplier;
            const minSpd = currentCfg.minSpeed * speedMultiplier;

            // 1. Process Cursor Dynamics (Moving Avoidance vs. Still Swarming)
            // Decay instantaneous cursor velocity
            mouseVx *= 0.88;
            mouseVy *= 0.88;
            mouseSpeed = Math.hypot(mouseVx, mouseVy);

            const isCursorMoving = mouseSpeed > CURSOR_MOVE_THRESHOLD;

            if (mouseActive && mouseX >= 0 && mouseY >= 0) {
                if (isCursorMoving) {
                    // Cursor is actively moving: reset stillness
                    stillDuration = 0;
                    swarmIntensity = Math.max(0, swarmIntensity - dt * 4.5);
                } else {
                    // Cursor is still: increment stillness timer
                    stillDuration += dt;
                    if (stillDuration > currentCfg.cursorStillDelay) {
                        const progress = (stillDuration - currentCfg.cursorStillDelay) / currentCfg.cursorSwarmRampDuration;
                        swarmIntensity = Math.min(1.0, Math.max(0, progress));
                    } else {
                        swarmIntensity = 0;
                    }
                }
            } else {
                stillDuration = 0;
                swarmIntensity = 0;
            }

            // Update each boid's individual swarming state based on its boldness and reaction spread
            const pVar = currentCfg.personalityVariance ?? 0.25;
            const delaySpread = 1.0 + pVar * 2.0;
            const rampDur = Math.max(0.2, currentCfg.cursorSwarmRampDuration);

            for (let i = 0; i < boids.length; i++) {
                const b = boids[i];
                if (mouseActive && mouseX >= 0 && mouseY >= 0) {
                    if (isCursorMoving) {
                        // When cursor moves, cautious boids react immediately; bold ones take an extra instant to scatter
                        const scatterRate = 4.0 + (1 - b.boldness) * 3.5;
                        b.personalSwarm = Math.max(0, b.personalSwarm - dt * scatterRate);
                    } else {
                        // When cursor is still, bold boids investigate first; cautious boids wait longer
                        const individualDelay = currentCfg.cursorStillDelay + (1 - b.boldness) * delaySpread;
                        if (stillDuration > individualDelay) {
                            const individualRamp = rampDur * (0.8 + (1 - b.boldness) * 0.5);
                            const boidProgress = (stillDuration - individualDelay) / individualRamp;
                            b.personalSwarm = Math.min(1.0, Math.max(0, boidProgress));
                        } else {
                            b.personalSwarm = Math.max(0, b.personalSwarm - dt * 2.0);
                        }
                    }
                } else {
                    b.personalSwarm = Math.max(0, b.personalSwarm - dt * 2.5);
                }
            }

            // 2. Refresh Spatial Grid
            updateSpatialGrid();

            // 3. Calculate Steering Forces (Reynolds Boids + Cursor Interaction)
            const flockRadiusSq = currentCfg.flockRadius * currentCfg.flockRadius;
            const lineMaxDist = currentCfg.flockLineMaxDistance ?? currentCfg.flockRadius;
            const lineMaxDistSq = lineMaxDist * lineMaxDist;
            const queryRadiusSq = Math.max(flockRadiusSq, lineMaxDistSq);
            const cursorFleeRadiusSq = currentCfg.cursorFleeRadius * currentCfg.cursorFleeRadius;
            const cursorAttractRadiusSq = currentCfg.cursorAttractRadius * currentCfg.cursorAttractRadius;

            for (let i = 0; i < boids.length; i++) {
                const b = boids[i];

                let sepX = 0;
                let sepY = 0;
                let alignX = 0;
                let alignY = 0;
                let cohX = 0;
                let cohY = 0;
                let neighborCount = 0;
                let sepCount = 0;
                let n1Idx = -1, n1DistSq = Infinity;
                let n2Idx = -1, n2DistSq = Infinity;
                let n3Idx = -1, n3DistSq = Infinity;

                // Query adjacent cells in spatial hash grid
                const bCellX = Math.floor(b.x / cellSize);
                const bCellY = Math.floor(b.y / cellSize);

                const minCX = Math.max(0, bCellX - 1);
                const maxCX = Math.min(gridCols - 1, bCellX + 1);
                const minCY = Math.max(0, bCellY - 1);
                const maxCY = Math.min(gridRows - 1, bCellY + 1);

                for (let cy = minCY; cy <= maxCY; cy++) {
                    for (let cx = minCX; cx <= maxCX; cx++) {
                        let otherIdx = gridHead[cy * gridCols + cx];
                        while (otherIdx !== -1) {
                            if (otherIdx !== i) {
                                const o = boids[otherIdx];
                                const dx = b.x - o.x;
                                const dy = b.y - o.y;
                                const distSq = dx * dx + dy * dy;

                                if (distSq < queryRadiusSq && distSq > 0.0001) {
                                    const dist = Math.sqrt(distSq);

                                    // Track top 3 nearest neighbors within flock line distance
                                    if (distSq < n1DistSq) {
                                        n3DistSq = n2DistSq; n3Idx = n2Idx;
                                        n2DistSq = n1DistSq; n2Idx = n1Idx;
                                        n1DistSq = distSq; n1Idx = otherIdx;
                                    } else if (distSq < n2DistSq) {
                                        n3DistSq = n2DistSq; n3Idx = n2Idx;
                                        n2DistSq = distSq; n2Idx = otherIdx;
                                    } else if (distSq < n3DistSq) {
                                        n3DistSq = distSq; n3Idx = otherIdx;
                                    }

                                    // Separation: soft repulsion from nearby neighbors
                                    if (distSq < flockRadiusSq) {
                                        const push = (1 - dist / currentCfg.flockRadius) / dist;
                                        sepX += dx * push;
                                        sepY += dy * push;
                                        sepCount++;

                                        // Alignment & Cohesion
                                        alignX += o.vx;
                                        alignY += o.vy;
                                        cohX += o.x;
                                        cohY += o.y;
                                        neighborCount++;
                                    }
                                }
                            }
                            otherIdx = gridNext[otherIdx];
                        }
                    }
                }

                // Determine flock membership & nearest neighbors connection
                b.nearestNeighbors[0] = n1Idx;
                b.nearestDistances[0] = n1Idx !== -1 ? Math.sqrt(n1DistSq) : Infinity;
                b.nearestNeighbors[1] = n2Idx;
                b.nearestDistances[1] = n2Idx !== -1 ? Math.sqrt(n2DistSq) : Infinity;
                b.nearestNeighbors[2] = n3Idx;
                b.nearestDistances[2] = n3Idx !== -1 ? Math.sqrt(n3DistSq) : Infinity;
                b.isFlocking = neighborCount >= currentCfg.minFlockNeighbors;

                // Acceleration accumulator
                let steerX = 0;
                let steerY = 0;

                // Separation force
                if (sepCount > 0) {
                    steerX += sepX * currentCfg.separationWeight;
                    steerY += sepY * currentCfg.separationWeight;
                }

                // Alignment force: steer towards average velocity of neighbors
                if (neighborCount > 0) {
                    const avgVx = alignX / neighborCount;
                    const avgVy = alignY / neighborCount;
                    const alignDiffX = avgVx - b.vx;
                    const alignDiffY = avgVy - b.vy;
                    steerX += alignDiffX * currentCfg.alignmentWeight;
                    steerY += alignDiffY * currentCfg.alignmentWeight;

                    // Cohesion force: steer towards center of mass of neighbors
                    const centerX = cohX / neighborCount;
                    const centerY = cohY / neighborCount;
                    const toCenterX = centerX - b.x;
                    const toCenterY = centerY - b.y;
                    const toCenterDist = Math.hypot(toCenterX, toCenterY);
                    if (toCenterDist > 0) {
                        steerX += (toCenterX / toCenterDist) * currentCfg.cohesionWeight;
                        steerY += (toCenterY / toCenterDist) * currentCfg.cohesionWeight;
                    }
                }

                // True Aerodynamic Lateral Wandering (Perpendicular to current flight heading, zero world-bias)
                if (b.spd > 0.001) {
                    const perpX = -b.vy / b.spd;
                    const perpY = b.vx / b.spd;
                    const wanderOscillation = Math.sin(elapsed * b.wanderFreq + b.wanderPhase);
                    steerX += perpX * wanderOscillation * currentCfg.wanderStrength;
                    steerY += perpY * wanderOscillation * currentCfg.wanderStrength;
                }

                let fleePanic = 0;

                // Cursor Avoidance vs. Swarming Behavior (Smoothly Blended per Boid)
                if (mouseActive && mouseX >= 0 && mouseY >= 0) {
                    const mdx = b.x - mouseX;
                    const mdy = b.y - mouseY;
                    const mDistSq = mdx * mdx + mdy * mdy;

                    const pSwarm = b.personalSwarm;
                    const pAvoid = 1.0 - pSwarm;

                    // AVOIDANCE COMPONENT: Only active when cursor is in motion
                    if (isCursorMoving && pAvoid > 0.05 && mDistSq < cursorFleeRadiusSq && mDistSq > 0.01) {
                        const mDist = Math.sqrt(mDistSq);
                        const fleeFalloff = Math.pow(1 - mDist / currentCfg.cursorFleeRadius, 1.8);
                        fleePanic = fleeFalloff * pAvoid;
                        const nx = mdx / mDist;
                        const ny = mdy / mDist;

                        // Radial outward flee impulse
                        steerX += nx * currentCfg.cursorFleeForce * fleeFalloff * pAvoid;
                        steerY += ny * currentCfg.cursorFleeForce * fleeFalloff * pAvoid;

                        // Dynamic wake push: if cursor is moving fast, divert boids laterally outward
                        const mDirX = mouseVx / mouseSpeed;
                        const mDirY = mouseVy / mouseSpeed;
                        const dot = nx * mDirX + ny * mDirY;
                        if (dot > 0.1) {
                            const perpX = -mDirY;
                            const perpY = mDirX;
                            const side = (mdx * perpX + mdy * perpY) > 0 ? 1 : -1;
                            steerX += perpX * side * currentCfg.cursorFleeForce * fleeFalloff * 0.8 * pAvoid;
                            steerY += perpY * side * currentCfg.cursorFleeForce * fleeFalloff * 0.8 * pAvoid;
                        }
                    }

                    // SWARMING COMPONENT
                    if (pSwarm > 0.05 && mDistSq < cursorAttractRadiusSq && mDistSq > 0.01) {
                        const mDist = Math.sqrt(mDistSq);
                        const nx = mdx / mDist; // vector pointing from cursor to boid
                        const ny = mdy / mDist;

                        // Individualized orbit radius creates a multi-layered murmuration cloud
                        const personalOrbitR = currentCfg.cursorOrbitRadius * b.orbitRadiusMod;

                        // Radial attraction toward personal orbit ring
                        const radialDiff = mDist - personalOrbitR;
                        const radialDir = radialDiff > 0 ? -1 : 1; // pull inward if outside, push outward if inside
                        const radialStrength = Math.min(2.5, Math.abs(radialDiff) / 60) * currentCfg.cursorAttractForce;

                        steerX += nx * radialDir * radialStrength * pSwarm;
                        steerY += ny * radialDir * radialStrength * pSwarm;

                        // Tangential / Vortex orbital velocity with individual orbit speed
                        const tangentX = -ny * b.orbitSign;
                        const tangentY = nx * b.orbitSign;
                        const personalOrbitSpeed = currentCfg.cursorOrbitStrength * b.orbitSpeedMod;

                        steerX += tangentX * personalOrbitSpeed * pSwarm;
                        steerY += tangentY * personalOrbitSpeed * pSwarm;
                    }
                }

                // Soft Viewport Boundary Steer (keeps flock within screen without abrupt wall bounces)
                if (b.x < BOUNDARY_MARGIN) {
                    steerX += ((BOUNDARY_MARGIN - b.x) / BOUNDARY_MARGIN) * BOUNDARY_TURN_FORCE;
                } else if (b.x > screenWidth - BOUNDARY_MARGIN) {
                    steerX -= ((b.x - (screenWidth - BOUNDARY_MARGIN)) / BOUNDARY_MARGIN) * BOUNDARY_TURN_FORCE;
                }

                if (b.y < BOUNDARY_MARGIN) {
                    steerY += ((BOUNDARY_MARGIN - b.y) / BOUNDARY_MARGIN) * BOUNDARY_TURN_FORCE;
                } else if (b.y > screenHeight - BOUNDARY_MARGIN) {
                    steerY -= ((b.y - (screenHeight - BOUNDARY_MARGIN)) / BOUNDARY_MARGIN) * BOUNDARY_TURN_FORCE;
                }

                // Clamp steering force to individual agility, dynamically boosted by evasive escape reflex
                const panicAgilityBoost = fleePanic * currentCfg.cursorFleeForce;
                const personalMaxForce = (currentCfg.maxForce * b.agilityMod) + panicAgilityBoost;
                const steerMag = Math.hypot(steerX, steerY);
                if (steerMag > personalMaxForce) {
                    steerX = (steerX / steerMag) * personalMaxForce;
                    steerY = (steerY / steerMag) * personalMaxForce;
                }

                b.ax = steerX;
                b.ay = steerY;
                b.panic = fleePanic;
            }

            // 4. Integrate Velocity & Position with Individual Speed Limits and Dynamic Angular Turn Clamping
            const basePersistence = Math.min(0.98, Math.max(0, currentCfg.headingPersistence ?? 0.7));
            const baseMaxTurn = currentCfg.maxTurnRate ?? 0.04;
            const fleeMaxTurn = currentCfg.cursorFleeMaxTurnRate ?? 0.22;

            for (let i = 0; i < boids.length; i++) {
                const b = boids[i];
                const panic = b.panic || 0;

                // When panicking from moving cursor, forward persistence gives way to escape impulse
                const effectivePersistence = basePersistence * Math.pow(1 - panic, 1.5);
                // When panicking, turning rate expands toward cursorFleeMaxTurnRate (~12.6 deg/frame)
                const effectiveMaxTurn = baseMaxTurn + (fleeMaxTurn - baseMaxTurn) * panic;

                const currentSpd = b.spd;
                const currentHeading = b.heading;

                // Candidate velocity after acceleration
                let desiredVx = b.vx + b.ax;
                let desiredVy = b.vy + b.ay;

                // Forward aerodynamic momentum bias (resists lateral push during calm cruising)
                if (effectivePersistence > 0 && currentSpd > 0.001) {
                    const forwardVx = Math.cos(currentHeading) * currentSpd;
                    const forwardVy = Math.sin(currentHeading) * currentSpd;
                    desiredVx = desiredVx * (1 - effectivePersistence) + forwardVx * effectivePersistence;
                    desiredVy = desiredVy * (1 - effectivePersistence) + forwardVy * effectivePersistence;
                }

                // Angular turn rate limiter: expands dynamically during cursor evasion
                if (effectiveMaxTurn > 0 && currentSpd > 0.001) {
                    const desiredHeading = Math.atan2(desiredVy, desiredVx);
                    const deltaTheta = normalizeAngle(desiredHeading - currentHeading);

                    // Clamp to effectiveMaxTurn
                    if (Math.abs(deltaTheta) > effectiveMaxTurn) {
                        const clampedHeading = currentHeading + Math.sign(deltaTheta) * effectiveMaxTurn;
                        const desiredSpeed = Math.hypot(desiredVx, desiredVy);
                        desiredVx = Math.cos(clampedHeading) * desiredSpeed;
                        desiredVy = Math.sin(clampedHeading) * desiredSpeed;
                    }
                }

                b.vx = desiredVx;
                b.vy = desiredVy;

                // Escape sprint boost when evading cursor
                const sprintBoost = 1.0 + panic * 0.75;
                const personalMaxSpd = maxSpd * b.speedMod * sprintBoost;
                const personalMinSpd = minSpd * b.speedMod;

                // Clamp speed between individual min and max
                let spd = Math.hypot(b.vx, b.vy);
                if (spd > personalMaxSpd) {
                    b.vx = (b.vx / spd) * personalMaxSpd;
                    b.vy = (b.vy / spd) * personalMaxSpd;
                    spd = personalMaxSpd;
                } else if (spd < personalMinSpd && spd > 0.001) {
                    b.vx = (b.vx / spd) * personalMinSpd;
                    b.vy = (b.vy / spd) * personalMinSpd;
                    spd = personalMinSpd;
                }

                b.spd = spd;
                b.heading = spd > 0.0001 ? Math.atan2(b.vy, b.vx) : b.heading;

                b.x += b.vx;
                b.y += b.vy;

                // Screen border clamp safety
                if (b.x < currentCfg.boidSize) {
                    b.x = currentCfg.boidSize;
                    b.vx = Math.abs(b.vx);
                    b.heading = Math.atan2(b.vy, b.vx);
                } else if (b.x > screenWidth - currentCfg.boidSize) {
                    b.x = screenWidth - currentCfg.boidSize;
                    b.vx = -Math.abs(b.vx);
                    b.heading = Math.atan2(b.vy, b.vx);
                }

                if (b.y < currentCfg.boidSize) {
                    b.y = currentCfg.boidSize;
                    b.vy = Math.abs(b.vy);
                    b.heading = Math.atan2(b.vy, b.vx);
                } else if (b.y > screenHeight - currentCfg.boidSize) {
                    b.y = screenHeight - currentCfg.boidSize;
                    b.vy = -Math.abs(b.vy);
                    b.heading = Math.atan2(b.vy, b.vx);
                }

            }

            // Clear Canvas
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, screenWidth, screenHeight);

            // Render Nearest-Neighbor Constellation Flock Lines
            if (currentCfg.enableFlockLines) {
                const lineCol = (isDark ? currentCfg.darkPalette.flockLine : currentCfg.lightPalette.flockLine) || "rgba(79, 138, 110, 0.28)";
                const baseOpacity = currentCfg.flockLineOpacity ?? 1;
                const maxLineDist = currentCfg.flockLineMaxDistance ?? currentCfg.flockRadius;
                drawnEdges.clear();

                ctx.save();
                ctx.strokeStyle = lineCol;
                ctx.lineWidth = FLOCK_LINE_WIDTH;

                for (let i = 0; i < boids.length; i++) {
                    const b = boids[i];
                    if (!b.isFlocking) continue;

                    const kMax = Math.min(currentCfg.flockLineNeighborCount || 3, 3);
                    for (let k = 0; k < kMax; k++) {
                        const targetIdx = b.nearestNeighbors[k];
                        const dist = b.nearestDistances[k];

                        if (targetIdx === -1 || dist > maxLineDist) continue;
                        if (!boids[targetIdx].isFlocking) continue;

                        // Deduplicate undirected edge (A -> B same as B -> A)
                        const edgeKey = i < targetIdx ? i * 100000 + targetIdx : targetIdx * 100000 + i;
                        if (drawnEdges.has(edgeKey)) continue;
                        drawnEdges.add(edgeKey);

                        const fade = 1 - dist / maxLineDist;
                        ctx.globalAlpha = baseOpacity * Math.max(0, Math.min(1, fade));

                        const other = boids[targetIdx];
                        ctx.beginPath();
                        ctx.moveTo(b.x, b.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                }
                ctx.restore();
            }

            // Resolve active color palette
            const palette = isDark ? currentCfg.darkPalette : currentCfg.lightPalette;

            // Render 3 Focal Depth Variants (Sorted back-to-front, zero filter overhead)
            const baseSize = currentCfg.boidSize;

            for (let k = 0; k < depthOrder.length; k++) {
                const i = depthOrder[k];
                const b = boids[i];
                const s = b.scale;
                const pixelSize = Math.max(1, (baseSize / 3.4) * s);

                // Organism swimming gait (discrete 4-step sequence: 0 -> 1 -> 0 -> 2)
                const animPhase = isReduced ? 0 : (elapsed * WING_OSCILLATION_SPEED + b.phase);
                const step = Math.floor(Math.abs(animPhase) * 1.5) % 4;
                const frameIndex = step === 1 ? 1 : step === 3 ? 2 : 0;

                ctx.save();
                ctx.translate(b.x, b.y);
                ctx.rotate(b.heading);
                renderPixelOrganism(ctx, b.focusTier, frameIndex, pixelSize, palette);
                ctx.restore();
            }

            rafId = requestAnimationFrame(render);
        };

        // Start Animation Loop
        rafId = requestAnimationFrame(render);
        setIsLoaded(true);

        return () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerleave", handlePointerLeave);
            document.removeEventListener("visibilitychange", handleVisibility);
            mediaDark.removeEventListener("change", handleTheme);
            mediaReduced.removeEventListener("change", handleReduced);
        };
    }, []);

    const activeCfg = {
        ...FLOCK_SWARM_DEFAULT_CONFIG,
        ...customConfig,
    };

    return (
        <div
            aria-hidden="true"
            className={`fixed inset-0 w-screen h-screen pointer-events-none -z-10 overflow-hidden transition-opacity duration-700 ease-out ${isLoaded ? "opacity-100" : "opacity-0"
                } ${className || ""}`}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full block"
            />
            {activeCfg.frostedGlass && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backdropFilter: `blur(${activeCfg.frostedBlur}px)`,
                        WebkitBackdropFilter: `blur(${activeCfg.frostedBlur}px)`,
                        backgroundColor: "color-mix(in srgb, var(--bg-color) 45%, transparent)",
                    }}
                >
                    {/* Ambient Specular Glass Sheen */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 40%, rgba(0, 0, 0, 0.04) 100%)",
                        }}
                    />
                    {/* Micro-etched sandblast tactile grain */}
                    {activeCfg.frostedNoise && (
                        <div
                            className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
                            style={{
                                backgroundImage: `url("${FROSTED_NOISE_SVG}")`,
                                backgroundRepeat: "repeat",
                                backgroundSize: "160px 160px",
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
