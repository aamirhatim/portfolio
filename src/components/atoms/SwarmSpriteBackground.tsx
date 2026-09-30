import { useEffect, useRef, useState } from "react";

// ============================================================================
// HIGH-LEVEL CONFIGURATION PARAMETERS (2D SWARM FLOCK SIMULATION)
// Adjust these parameters to tune flock size, physics, non-collision bounds,
// and dynamic cursor response (avoidance while moving, swarming while still).
// ============================================================================

export interface SwarmSpriteConfig {
    /** Total number of flock members in the simulation */
    boidCount: number;
    /** Visual body size in pixels (length and wingspan) */
    boidSize: number;

    /** Minimum cruising speed in pixels per frame */
    minSpeed: number;
    /** Maximum sprint speed in pixels per frame */
    maxSpeed: number;
    /** Maximum steering agility / force magnitude */
    maxForce: number;
    /** Subtle natural wandering turbulence / meandering strength */
    wanderStrength: number;
    /** Forward momentum bias (0 to 1) resisting lateral trajectory diversion */
    headingPersistence: number;
    /** Maximum allowed heading turn angle in radians per frame (e.g. 0.01 = ~0.6 deg/frame) */
    maxTurnRate: number;
    /** Maximum allowed heading turn angle (rad/frame) when evading a moving cursor (e.g. 0.22 = ~12.6 deg/frame) */
    cursorFleeMaxTurnRate: number;

    /** Perception radius for flock separation, alignment, and cohesion */
    flockRadius: number;
    /** Steering weight for separation force */
    separationWeight: number;
    /** Steering weight to match heading and velocity of nearby flockmates */
    alignmentWeight: number;
    /** Steering weight to stay centered within the local flock cluster */
    cohesionWeight: number;

    /** Repulsion radius when the cursor is moving */
    cursorFleeRadius: number;
    /** Repulsion impulse strength pushing boids away from moving cursor */
    cursorFleeForce: number;
    /** Seconds of cursor stillness before swarming behavior begins to take over */
    cursorStillDelay: number;
    /** Seconds required for swarming attraction to ramp up to full strength */
    cursorSwarmRampDuration: number;
    /** Gravitational attraction radius around resting cursor */
    cursorAttractRadius: number;
    /** Pull force toward resting cursor */
    cursorAttractForce: number;
    /** Equilibrium orbit / halo radius boids form around the resting cursor */
    cursorOrbitRadius: number;
    /** Tangential swirling angular momentum around resting cursor (murmuration vortex) */
    cursorOrbitStrength: number;

    /** Individual personality variance (0 to 1) applied to cruise speed, agility, and orbit shells */
    personalityVariance: number;

    /** Number of past position samples stored for motion wake trails */
    trailLength: number;
    /** Opacity of motion wake trails */
    trailOpacity: number;

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

    /** Path to the combined cat sprite sheet image (default: "/sprites/sprites.png") */
    spriteSheetSrc: string;
    /** Number of horizontal columns in the sprite sheet (default: 6) */
    spriteSheetCols: number;
    /** Number of vertical rows in the sprite sheet (default: 1) */
    spriteSheetRows: number;

    /** Light mode palette (Forest Sage & Soft Paper) */
    lightPalette: {
        background: string;
        boidBody: string;
        boidAccent: string;
        boidGlow: string;
        trailColor: string;
        flockLine?: string;
    };

    /** Dark mode palette (Midnight Pine & Luminous Sage) */
    darkPalette: {
        background: string;
        boidBody: string;
        boidAccent: string;
        boidGlow: string;
        trailColor: string;
        flockLine?: string;
    };
}

const SWARM_SPRITE_DEFAULT_CONFIG: SwarmSpriteConfig = {
    boidCount: 6 * 2,
    boidSize: 10,

    minSpeed: 0.1,
    maxSpeed: 0.8,
    maxForce: 0.03,
    wanderStrength: 0.06,
    headingPersistence: 0.8,
    maxTurnRate: 0.01,
    cursorFleeMaxTurnRate: 0.22,

    flockRadius: 40,
    separationWeight: 1.2,
    alignmentWeight: 0.5,
    cohesionWeight: 0.05,

    cursorFleeRadius: 250,
    cursorFleeForce: 5,
    cursorStillDelay: 0.5,
    cursorSwarmRampDuration: 0.8,
    cursorAttractRadius: 450,
    cursorAttractForce: 0.3,
    cursorOrbitRadius: 60,
    cursorOrbitStrength: 1.5,

    personalityVariance: 0.25,

    trailLength: 5,
    trailOpacity: 0.28,

    enableFlockLines: true,
    flockLineNeighborCount: 3,
    minFlockNeighbors: 3,
    flockLineMaxDistance: 100,
    flockLineOpacity: 1,

    frostedGlass: true,
    frostedBlur: .5,
    frostedNoise: true,

    spriteSheetSrc: "/sprites/sprites.png",
    spriteSheetCols: 6,
    spriteSheetRows: 1,

    // Light Mode - Forest Sage Theme
    lightPalette: {
        background: "rgba(243, 246, 245, 0.45)",
        boidBody: "#226449",         // Deep forest pine
        boidAccent: "#318260",       // Forest sage
        boidGlow: "#56af88",         // Mint highlight
        trailColor: "rgba(34, 100, 73, 0.18)",
        flockLine: "rgba(49, 130, 96, 0.28)",
    },

    // Dark Mode - Midnight Pine & Emerald Luminous Theme
    darkPalette: {
        background: "rgba(9, 14, 12, 0.45)",
        boidBody: "#3d8f6b",         // Luminous pine
        boidAccent: "#56af88",       // Bright emerald sage
        boidGlow: "#9ef5d2",         // Bioluminescent mint core
        trailColor: "rgba(86, 175, 136, 0.22)",
        flockLine: "rgba(110, 214, 168, 0.28)",
    },
};

export interface SwarmSpriteBackgroundProps {
    /** Optional overrides for any high-level simulation configuration parameters */
    config?: Partial<SwarmSpriteConfig>;
    /** Optional additional Tailwind CSS classes for the canvas element */
    className?: string;
}

// ============================================================================
// INTERNAL CONSTANTS & HEURISTICS
// ============================================================================

/** Minimum cursor velocity (px/sec) to consider it actively moving */
const CURSOR_MOVE_THRESHOLD = 30;
/** Viewport boundary distance where soft inward turning begins (px) */
const BOUNDARY_MARGIN = 80;
/** Inward steering force when approaching viewport edges */
const BOUNDARY_TURN_FORCE = 0.3;
/** Hairline connection stroke width in pixels */
const FLOCK_LINE_WIDTH = 1.0;
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

/** 4 discrete facing directions: 0 = Down (Front), 1 = Up (Back), 2 = Right (Side), 3 = Left (Side Flipped) */
export type CatFacing = 0 | 1 | 2 | 3;

/** Cat breed or sprite variation index */
export type CatType = number;
// 0: Black Cat (Obsidian coat, glowing emerald eyes, ruby collar)
// 1: White/Grey Cow Cat (Bicolor piebald, sapphire eyes, pink nose)
// 2: Tabby Cat (Classic ginger/orange tabby, cyan collar)
// 3: Tortie Cat (Tortoiseshell espresso with vibrant ginger patches, purple collar)

export interface CatPalette {
    outline: string;
    main: string;        // M: Primary coat
    secondary: string;   // S: Stripes / Patches / Markings
    white: string;       // W: White muzzle, chest & paw socks
    pink: string;        // P: Inner ear & nose
    eye: string;         // E: Eye iris
    collar: string;      // C: Collar strap
    bell: string;        // B: Golden bell
    dropShadow: string;  // D: Ground contact shadow
}

// Light Mode Breed Palettes
const CAT_LIGHT_PALETTES: CatPalette[] = [
    // 0. Black Cat
    {
        outline: "#141218",
        main: "#232128",
        secondary: "#35313d",
        white: "#f0f4f8",
        pink: "#c97b8d",
        eye: "#10b981", // Bright emerald eyes
        collar: "#dc2626", // Ruby red
        bell: "#f59e0b",
        dropShadow: "rgba(10, 10, 15, 0.24)",
    },
    // 1. White/Grey Cow Cat
    {
        outline: "#25282e",
        main: "#f8fafc",    // Clean white body
        secondary: "#475569", // Slate grey cow spots
        white: "#ffffff",
        pink: "#f472b6",    // Pink nose & ears
        eye: "#0284c7",     // Sapphire blue eyes
        collar: "#16a34a",  // Emerald green
        bell: "#f59e0b",
        dropShadow: "rgba(20, 25, 30, 0.20)",
    },
    // 2. Tabby Cat (From reference image)
    {
        outline: "#663319",
        main: "#ea580c",    // Warm ginger coat
        secondary: "#9a3412", // Rich cinnamon stripes
        white: "#fff7ed",   // Creamy white muzzle & socks
        pink: "#fb7185",    // Peach/pink nose
        eye: "#1e1b18",     // Dark beady eyes
        collar: "#0284c7",  // Bright cyan/sky blue collar
        bell: "#f59e0b",    // Golden bell
        dropShadow: "rgba(35, 20, 15, 0.22)",
    },
    // 3. Tortie Cat (Tortoiseshell)
    {
        outline: "#1c1917",
        main: "#292524",     // Dark espresso base
        secondary: "#f97316", // Warm ginger patches
        white: "#fde047",    // Honey gold highlights
        pink: "#fb7185",
        eye: "#d97706",      // Glowing amber/copper eyes
        collar: "#9333ea",   // Royal purple collar
        bell: "#f59e0b",
        dropShadow: "rgba(15, 12, 14, 0.22)",
    },
];

// Dark Mode Breed Palettes (Luminous ambient tone adjustments)
const CAT_DARK_PALETTES: CatPalette[] = [
    // 0. Black Cat
    {
        outline: "#1e1b24",
        main: "#2e2b36",
        secondary: "#464152",
        white: "#f1f5f9",
        pink: "#f472b6",
        eye: "#34d399", // Bioluminescent emerald
        collar: "#ef4444",
        bell: "#fde047",
        dropShadow: "rgba(0, 0, 0, 0.38)",
    },
    // 1. White/Grey Cow Cat
    {
        outline: "#334155",
        main: "#f8fafc",
        secondary: "#64748b",
        white: "#ffffff",
        pink: "#f472b6",
        eye: "#38bdf8",
        collar: "#22c55e",
        bell: "#fde047",
        dropShadow: "rgba(0, 0, 0, 0.38)",
    },
    // 2. Tabby Cat
    {
        outline: "#7c2d12",
        main: "#f97316",
        secondary: "#c2410c",
        white: "#fff7ed",
        pink: "#fb7185",
        eye: "#0f172a",
        collar: "#38bdf8",
        bell: "#fde047",
        dropShadow: "rgba(0, 0, 0, 0.38)",
    },
    // 3. Tortie Cat
    {
        outline: "#292524",
        main: "#3c3533",
        secondary: "#fb923c",
        white: "#fef08a",
        pink: "#f472b6",
        eye: "#fbbf24",
        collar: "#a855f7",
        bell: "#fde047",
        dropShadow: "rgba(0, 0, 0, 0.38)",
    },
];

// 21x19 pixel matrices transcribed directly from the chibi cat reference art
const CAT_FRONT_SPRITE: string[] = [
    ".....................", // 0
    "....OO.........OO....", // 1: Pointed ear tips
    "...OSPO.......OPMO...", // 2: Pink inner ears
    "...OSSO.......OMMO...", // 3: Ear body
    "..OSSSSOOOOOOOMMMMO..", // 4: Crown of head
    ".OSSSSSSSSSMMMMMMMMO.", // 5: Forehead with patch on left
    "OOSSSSSSSSSMMMMMMMMOO", // 6: Upper cheek whisker tufts
    ".OSSSSEMMMMMMMEMMMO..", // 7: Wide-set 1x1 eye dots
    "OOSSSMMMMWWMMMMMMMOOO", // 8: Lower cheek tufts
    ".OSSSMMMWPOWMMMMMMO..", // 9: Cute nose / mouth
    "..OOSMMMWWWWWMMMOO...", // 10: Chin
    "....OOOMMMMMMOOO.....", // 11: Body top / chest
    ".....OMMWOOMWMO......", // 12: Two stubby front legs
    ".....OMMWOOMWMO......", // 13: Front legs
    ".....OWWWOOWWWO......", // 14: White paw socks
    ".....OOOO..OOOO......", // 15: Paws base outlines
    "..DDDDDDDDDDDDDDDDD..", // 16: Ground drop shadow
    "...DDDDDDDDDDDDDDD...", // 17: Ground drop shadow
    ".....DDDDDDDDDDD.....", // 18: Ground drop shadow
];

const CAT_BACK_SPRITE: string[] = [
    ".....................", // 0
    "....OO.........OO....", // 1: Ear tips from back
    "...OSSO.......OMMO...", // 2: Pointed ears (S on left, M on right)
    "...OSSO.......OMMO...", // 3: Ear base
    "..OSSSSOOOOOOOMMMMO..", // 4: Crown from back
    ".OSSSSSSSSSMMMMMMMMO.", // 5: Back of head
    "OOSSSSSSSSSMMMMMMMMOO", // 6: Cheek tufts
    ".OSSSSSSSSSMMMMMMMMO.", // 7: Head back
    "OOSSSSSSSSSMMMMMMMMOO", // 8: Lower cheek tufts
    ".OOSSSSSSSSMMMMMMOO..", // 9: Neck
    "....OOMMMMMMMMOO.....", // 10: Shoulders
    ".....OMMMOSMMMO......", // 11: Back & vertical stripe/tail
    ".....OMMMOSMMMO......", // 12: Torso
    ".....OMMWOOMWMO......", // 13: Two hind legs
    ".....OWWWOOWWWO......", // 14: White socks
    ".....OOOO..OOOO......", // 15: Paws base
    "..DDDDDDDDDDDDDDDDD..", // 16: Ground drop shadow
    "...DDDDDDDDDDDDDDD...", // 17: Ground drop shadow
    ".....DDDDDDDDDDD.....", // 18: Ground drop shadow
];

const CAT_SIDE_SPRITE: string[] = [
    ".....................", // 0
    "..OWO................", // 1: Tail tip
    ".OSSO.........OO.....", // 2: Tail & ear tip
    ".OSSO........OPMO.OO.", // 3: Ear with pink
    ".OSSO.......OMMMOOMMO", // 4: Ear base & crown
    "..OMO......OSSSSSMMMO", // 5: Head top & patch
    "..OMOOO...OOSSSSSMMMO", // 6: Forehead & cheek
    "..OMSSSSOOOSSSSSEWMOO", // 7: Back with patch, 1x1 Eye
    "..OMSSSSSMMMMMMMWWPO.", // 8: Flank & nose snout
    "..OMMMMMMMMMMMMWWWPO.", // 9: Chin
    "..OMMMMMMMMMMMMMMMMO.", // 10: Underbelly
    "...OMMMMMMMMMMMMMMO..", // 11: Belly line
    "..OMMO.OMMO.OMMO.OMMO", // 12: 4 walking legs
    "..OMMO.OMMO.OMMO.OMMO", // 13: 4 legs
    "..OWWO.OWWO.OWWO.OWWO", // 14: White paw socks
    "..OOOO.OOOO.OOOO.OOOO", // 15: Paw base outlines
    "DDDDDDDDDDDDDDDDDDDDD", // 16: Ground drop shadow
    ".DDDDDDDDDDDDDDDDDDD.", // 17: Ground drop shadow
    "...DDDDDDDDDDDDDDD...", // 18: Ground drop shadow
];

// Left facing sprite is the exact horizontal mirror of the right facing sprite
const CAT_SIDE_LEFT_SPRITE: string[] = CAT_SIDE_SPRITE.map((row) =>
    row.split("").reverse().join("")
);

/** Determines facing direction (0: Down, 1: Up, 2: Right, 3: Left) with axis dominance hysteresis */
function resolveCatFacing(
    currentFacing: CatFacing,
    vx: number,
    vy: number,
    horizontalOnly = false
): CatFacing {
    if (horizontalOnly) {
        if (vx > 0.05) return 2; // Right
        if (vx < -0.05) return 3; // Left
        if (currentFacing !== 2 && currentFacing !== 3) {
            return vx >= 0 ? 2 : 3;
        }
        return currentFacing;
    }

    const absX = Math.abs(vx);
    const absY = Math.abs(vy);

    // If currently facing horizontal (Right: 2, Left: 3)
    if (currentFacing === 2 || currentFacing === 3) {
        // Only switch to vertical if vertical velocity clearly dominates horizontal by 35%
        if (absY > absX * 1.35 && absY > 0.05) {
            return vy > 0 ? 0 : 1; // 0 = Down, 1 = Up
        }
        // Switch between Left and Right with a firm direction reversal deadband
        if (currentFacing === 2 && vx < -0.05) return 3; // Right -> Left
        if (currentFacing === 3 && vx > 0.05) return 2;  // Left -> Right
        return currentFacing;
    }

    // If currently facing vertical (Down: 0, Up: 1)
    if (currentFacing === 0 || currentFacing === 1) {
        // Only switch to horizontal if horizontal velocity clearly dominates vertical by 35%
        if (absX > absY * 1.35 && absX > 0.05) {
            return vx > 0 ? 2 : 3; // 2 = Right, 3 = Left
        }
        // Switch between Down and Up with a firm direction reversal deadband
        if (currentFacing === 0 && vy < -0.05) return 1; // Down -> Up
        if (currentFacing === 1 && vy > 0.05) return 0;  // Up -> Down
        return currentFacing;
    }

    return currentFacing;
}

/** Pre-renders offscreen canvas stamps for 4 cat breeds x 4 directions */
function generateCatSprites(palettes: CatPalette[]): HTMLCanvasElement[][] {
    const rawSprites = [
        CAT_FRONT_SPRITE,     // 0: Down
        CAT_BACK_SPRITE,      // 1: Up
        CAT_SIDE_SPRITE,      // 2: Right
        CAT_SIDE_LEFT_SPRITE, // 3: Left
    ];

    const canvasWidth = 24;
    const canvasHeight = 24;

    const allBreedsResult: HTMLCanvasElement[][] = [];

    for (let b = 0; b < palettes.length; b++) {
        const palette = palettes[b];
        const colorMap: Record<string, string> = {
            O: palette.outline,
            M: palette.main,
            S: palette.secondary,
            W: palette.white,
            P: palette.pink,
            E: palette.eye,
            C: palette.collar,
            B: palette.bell,
            D: palette.dropShadow,
        };

        const breedResult: HTMLCanvasElement[] = [];

        for (let f = 0; f < 4; f++) {
            const matrix = rawSprites[f];
            const numRows = matrix.length;
            const numCols = matrix[0].length;
            const offsetX = Math.max(0, Math.floor((canvasWidth - numCols) / 2));
            const offsetY = Math.max(0, Math.floor((canvasHeight - numRows) / 2));

            const cvs = document.createElement("canvas");
            cvs.width = canvasWidth;
            cvs.height = canvasHeight;
            const sCtx = cvs.getContext("2d");
            if (!sCtx) {
                breedResult.push(cvs);
                continue;
            }

            sCtx.imageSmoothingEnabled = false;
            sCtx.globalAlpha = 1.0;
            for (let r = 0; r < matrix.length; r++) {
                const row = matrix[r];
                for (let c = 0; c < row.length; c++) {
                    const color = colorMap[row[c]];
                    if (color) {
                        sCtx.fillStyle = color;
                        sCtx.fillRect(offsetX + c, offsetY + r, 1, 1);
                    }
                }
            }

            breedResult.push(cvs);
        }
        allBreedsResult.push(breedResult);
    }

    return allBreedsResult;
}

/** Slices an external sprite sheet image into offscreen canvas stamps */
function sliceSpriteSheet(
    image: HTMLImageElement,
    cols: number,
    rows: number
): HTMLCanvasElement[][] {
    if (!image.naturalWidth || !image.naturalHeight || cols <= 0 || rows <= 0) {
        return [];
    }

    const frameW = Math.floor(image.naturalWidth / cols);
    const frameH = Math.floor(image.naturalHeight / rows);
    const allBreedsResult: HTMLCanvasElement[][] = [];

    // Mode 1: Single image per sprite (rows === 1)
    // The provided image is right-facing; generate right-facing and horizontally mirrored left-facing stamps.
    if (rows === 1) {
        for (let c = 0; c < cols; c++) {
            const sx = c * frameW;
            const sy = 0;

            // 1. Right-facing stamp (original image)
            const rightCvs = document.createElement("canvas");
            rightCvs.width = frameW;
            rightCvs.height = frameH;
            const rCtx = rightCvs.getContext("2d");
            if (rCtx) {
                rCtx.imageSmoothingEnabled = false;
                rCtx.globalAlpha = 1.0;
                rCtx.drawImage(image, sx, sy, frameW, frameH, 0, 0, frameW, frameH);
            }

            // 2. Left-facing stamp (mirrored horizontally)
            const leftCvs = document.createElement("canvas");
            leftCvs.width = frameW;
            leftCvs.height = frameH;
            const lCtx = leftCvs.getContext("2d");
            if (lCtx) {
                lCtx.imageSmoothingEnabled = false;
                lCtx.globalAlpha = 1.0;
                lCtx.save();
                lCtx.translate(frameW, 0);
                lCtx.scale(-1, 1);
                lCtx.drawImage(image, sx, sy, frameW, frameH, 0, 0, frameW, frameH);
                lCtx.restore();
            }

            // Populate [0: Down, 1: Up, 2: Right, 3: Left] for CatFacing compatibility
            allBreedsResult.push([rightCvs, leftCvs, rightCvs, leftCvs]);
        }
        return allBreedsResult;
    }

    // Mode 2: Multi-row, multi-column sprite sheet (rows = breeds, cols = directions)
    for (let r = 0; r < rows; r++) {
        const breedResult: HTMLCanvasElement[] = [];
        for (let c = 0; c < cols; c++) {
            const sx = c * frameW;
            const sy = r * frameH;

            const cvs = document.createElement("canvas");
            cvs.width = frameW;
            cvs.height = frameH;
            const sCtx = cvs.getContext("2d");
            if (!sCtx) {
                breedResult.push(cvs);
                continue;
            }

            sCtx.imageSmoothingEnabled = false;
            sCtx.globalAlpha = 1.0;
            sCtx.drawImage(image, sx, sy, frameW, frameH, 0, 0, frameW, frameH);

            breedResult.push(cvs);
        }
        allBreedsResult.push(breedResult);
    }

    return allBreedsResult;
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
    trailX: Float32Array;
    trailY: Float32Array;
    trailIndex: number;
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
    nearestNeighbors: [number, number, number]; // Indices of up to 3 nearest flockmates (-1 if none)
    nearestDistances: [number, number, number]; // Distances in pixels to up to 3 nearest flockmates
    isFlocking: boolean; // Whether boid currently has enough flockmates to be part of a flock
    facing: CatFacing; // 0 = Down, 1 = Up, 2 = Right, 3 = Left
    catType: CatType; // 0 = Black Cat, 1 = Cow Cat, 2 = Tabby Cat, 3 = Tortie Cat
}

export default function SwarmSpriteBackground({ config: customConfig, className }: SwarmSpriteBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Merge high-level parameters
    const cfgRef = useRef<SwarmSpriteConfig>({
        ...SWARM_SPRITE_DEFAULT_CONFIG,
        ...customConfig,
    });

    // Keep config reference synchronized if props change
    useEffect(() => {
        cfgRef.current = {
            ...SWARM_SPRITE_DEFAULT_CONFIG,
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
        const currentCfg = cfgRef.current;

        // System Theme and Reduced Motion queries
        const mediaDark = window.matchMedia("(prefers-color-scheme: dark)");
        let isDark = mediaDark.matches;
        let catSprites = generateCatSprites(isDark ? CAT_DARK_PALETTES : CAT_LIGHT_PALETTES);

        // Preload external sprite sheet image
        let isHorizontalOnly = currentCfg.spriteSheetRows === 1;
        let sheetStamps: HTMLCanvasElement[][] | null = null;
        if (currentCfg.spriteSheetSrc) {
            const sheetImg = new Image();
            sheetImg.src = currentCfg.spriteSheetSrc;
            sheetImg.onload = () => {
                const sliced = sliceSpriteSheet(
                    sheetImg,
                    currentCfg.spriteSheetCols,
                    currentCfg.spriteSheetRows
                );
                if (sliced.length > 0) {
                    sheetStamps = sliced;
                    catSprites = sliced;
                    isHorizontalOnly = currentCfg.spriteSheetRows === 1;
                }
            };
        }

        const handleTheme = (e: MediaQueryListEvent) => {
            isDark = e.matches;
            if (!sheetStamps) {
                catSprites = generateCatSprites(isDark ? CAT_DARK_PALETTES : CAT_LIGHT_PALETTES);
            }
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

        // Cursor State Tracking
        let mouseX = -1000;
        let mouseY = -1000;
        let prevMouseX = -1000;
        let prevMouseY = -1000;
        let mouseVx = 0;
        let mouseVy = 0;
        let mouseSpeed = 0;
        let mouseActive = false;
        let lastMouseTime = performance.now();
        let stillDuration = 0;
        let swarmIntensity = 0; // 0.0 (flee/neutral) to 1.0 (full swarming orbit)

        const handlePointerMove = (e: PointerEvent) => {
            const now = performance.now();
            const dt = Math.max(0.005, (now - lastMouseTime) / 1000);
            lastMouseTime = now;

            if (mouseX < -500) {
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

        // Initialize Flock Population
        const cfg = cfgRef.current;
        const boids: Boid[] = [];

        for (let i = 0; i < cfg.boidCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = cfg.minSpeed + Math.random() * (cfg.maxSpeed - cfg.minSpeed);
            const trail = cfg.trailLength;
            const tx = new Float32Array(trail);
            const ty = new Float32Array(trail);
            const initX = Math.random() * screenWidth;
            const initY = Math.random() * screenHeight;

            tx.fill(initX);
            ty.fill(initY);

            const pVar = cfg.personalityVariance ?? 0.25;
            const speedMod = Math.max(0.65, 1.0 + (Math.random() * 2 - 1) * pVar);
            const agilityMod = Math.max(0.65, 1.0 + (Math.random() * 2 - 1) * pVar);
            const orbitRadiusMod = Math.max(0.55, 1.0 + (Math.random() * 2 - 1) * pVar);
            const orbitSpeedMod = Math.max(0.7, 1.0 + (Math.random() * 2 - 1) * (pVar * 0.8));
            const boldness = Math.random(); // 0 (cautious) to 1 (bold/curious)
            const wanderFreq = 0.8 + Math.random() * 1.5;
            const wanderPhase = Math.random() * Math.PI * 2;

            const scale = 1.0;
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
                trailX: tx,
                trailY: ty,
                trailIndex: 0,
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
                nearestNeighbors: [-1, -1, -1],
                nearestDistances: [Infinity, Infinity, Infinity],
                isFlocking: false,
                facing: resolveCatFacing(
                    2,
                    Math.cos(angle) * initSpeed,
                    Math.sin(angle) * initSpeed,
                    isHorizontalOnly
                ),
                catType: (i % (currentCfg.spriteSheetCols || 6)) as CatType,
            });
        }

        // 2.5D visual depth order (sorted by Y position)
        const depthOrder = new Int32Array(cfg.boidCount);
        for (let i = 0; i < cfg.boidCount; i++) depthOrder[i] = i;

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
                lastFrameTime = performance.now();
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
                } else if (b.x > screenWidth - currentCfg.boidSize) {
                    b.x = screenWidth - currentCfg.boidSize;
                    b.vx = -Math.abs(b.vx);
                }

                if (b.y < currentCfg.boidSize) {
                    b.y = currentCfg.boidSize;
                    b.vy = Math.abs(b.vy);
                } else if (b.y > screenHeight - currentCfg.boidSize) {
                    b.y = screenHeight - currentCfg.boidSize;
                    b.vy = -Math.abs(b.vy);
                }

                // Record wake trail coordinates with buffer bounds clamp
                const maxTrailCapacity = b.trailX.length;
                const activeTrailLen = Math.min(currentCfg.trailLength, maxTrailCapacity);
                b.trailX[b.trailIndex] = b.x;
                b.trailY[b.trailIndex] = b.y;
                b.trailIndex = (b.trailIndex + 1) % activeTrailLen;
            }

            // 5. RENDER ROUTINE
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, screenWidth, screenHeight);

            const palette = isDark ? currentCfg.darkPalette : currentCfg.lightPalette;

            // Optional ambient background tint
            if (palette.background) {
                ctx.fillStyle = palette.background;
                ctx.fillRect(0, 0, screenWidth, screenHeight);
            }


            // Render Dynamic Wake Trails
            const activeTrailCap = boids[0]?.trailX.length || 1;
            const trailLen = Math.min(currentCfg.trailLength, activeTrailCap);
            if (trailLen > 1 && currentCfg.trailOpacity > 0) {
                ctx.strokeStyle = palette.trailColor;
                ctx.lineWidth = 1.2;
                ctx.beginPath();

                for (let i = 0; i < boids.length; i++) {
                    const b = boids[i];
                    let prevX = b.x;
                    let prevY = b.y;

                    for (let t = 1; t < trailLen; t++) {
                        const idx = (b.trailIndex - 1 - t + activeTrailCap * 2) % activeTrailCap;
                        const tx = b.trailX[idx];
                        const ty = b.trailY[idx];

                        ctx.moveTo(prevX, prevY);
                        ctx.lineTo(tx, ty);
                        prevX = tx;
                        prevY = ty;
                    }
                }
                ctx.stroke();
            }

            // Render Flock Constellation Lines (Connecting flock members to up to 3 nearest neighbors)
            if (currentCfg.enableFlockLines) {
                const maxLineDist = currentCfg.flockLineMaxDistance;
                const baseOpacity = currentCfg.flockLineOpacity;
                const lineStroke = palette.flockLine || palette.boidAccent;
                const maxNeighborsToConnect = Math.min(3, Math.max(1, currentCfg.flockLineNeighborCount ?? 3));

                ctx.save();
                ctx.lineWidth = FLOCK_LINE_WIDTH;
                ctx.strokeStyle = lineStroke;

                // Reset reusable set to eliminate per-frame allocations
                drawnEdges.clear();

                for (let i = 0; i < boids.length; i++) {
                    const b = boids[i];
                    if (!b.isFlocking) continue;

                    for (let n = 0; n < maxNeighborsToConnect; n++) {
                        const targetIdx = b.nearestNeighbors[n];
                        if (targetIdx === -1) break;

                        const dist = b.nearestDistances[n];
                        if (dist > maxLineDist) continue;

                        const minIdx = Math.min(i, targetIdx);
                        const maxIdx = Math.max(i, targetIdx);
                        const edgeKey = minIdx * 10000 + maxIdx;

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

            // Set nearest-neighbor interpolation for crisp pixel art scaling
            ctx.imageSmoothingEnabled = false;

            // Render Cats (Y-sorted for natural 2.5D floor overlapping)
            depthOrder.sort((a, b) => boids[a].y - boids[b].y);
            const baseSize = currentCfg.boidSize;

            for (let k = 0; k < depthOrder.length; k++) {
                const i = depthOrder[k];
                const b = boids[i];
                const s = b.scale;

                // Resolve facing direction (horizontal-only when using 1-row sprite sheet)
                b.facing = resolveCatFacing(b.facing, b.vx, b.vy, isHorizontalOnly);

                // Render upright 2.5D cat sprite with crisp pixel art clarity
                const breedSprites = catSprites[b.catType % catSprites.length];
                if (!breedSprites) continue;
                const sprite = breedSprites[b.facing % breedSprites.length];
                if (!sprite) continue;

                const renderW = Math.round(sprite.width * (baseSize / 20) * s);
                const renderH = Math.round(sprite.height * (baseSize / 20) * s);

                ctx.drawImage(
                    sprite,
                    b.x - renderW * 0.5,
                    b.y - renderH * 0.5,
                    renderW,
                    renderH
                );
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
        ...SWARM_SPRITE_DEFAULT_CONFIG,
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
