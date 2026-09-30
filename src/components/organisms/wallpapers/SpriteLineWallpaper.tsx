import { useEffect, useRef, useState } from "react";

// ============================================================================
// CONFIGURATION PARAMETERS (SPRITE LINE WALLPAPER)
// Sprites sit on a single ground line axis, wandering with cute hops,
// and take larger escape hops away from the cursor when hovered.
// ============================================================================

export interface SpriteLineConfig {
    /** Visual size of the sprite in pixels (default: 20) */
    spriteSize: number;

    /** Small hop vertical height in pixels during normal wandering (default: 8) */
    smallHopHeight: number;
    /** Small hop horizontal distance in pixels during normal wandering (default: 16) */
    smallHopDistance: number;

    /** Large hop vertical height in pixels when fleeing cursor (default: 22) */
    largeHopHeight: number;
    /** Large hop horizontal distance in pixels when fleeing cursor (default: 38) */
    largeHopDistance: number;

    /** Overall movement and hopping speed multiplier (default: 1.0) */
    speed: number;

    /** Hopping speed multiplier when fleeing from cursor (default: 1.0) */
    fleeSpeed: number;

    /**
     * Likelihood / probability (0.0 to 1.0 or 0 to 100%) of hopping during normal wandering (default: 0.5).
     * Eliminates predictable hopping intervals in favor of a stochastic process where higher values
     * increase the chance of taking a hop.
     * Influenced by individual sprite personality variance (does not apply to fleeing).
     */
    hopChance?: number;

    /**
     * Probability (0.0 to 1.0) of reversing direction when starting a wandering hop (default: 0.25).
     * Controls how likely sprites are to turn around during wandering (not applied to fleeing).
     */
    turnChance?: number;

    /**
     * Personality variance between individual sprites (0.0 to 1.0, default: 0.3).
     * Controls individual variance in wandering speed, flee speed, hop size/length,
     * hop frequency (idle interval), direction change likelihood, sensitivity to cursor, and idle patience.
     */
    personalityVariance: number;

    /** Number of sprites along the ground line (default: 6, matching all sprite sheet columns) */
    spriteCount?: number;

    /**
     * Ground line Y position in pixels or fraction of screen height (0.0 to 1.0).
     * If undefined, calculated using groundOffsetFromBottom.
     */
    groundY?: number;

    /** Distance in pixels from bottom of viewport to ground line (default: 80) */
    groundOffsetFromBottom?: number;

    /** Distance from cursor in pixels that triggers fleeing behavior (default: 150) */
    cursorFleeRadius?: number;

    /** Whether to draw a subtle horizontal ground line axis (default: false) */
    showGroundLine?: boolean;
    /** Stroke color for the ground line axis */
    groundLineColor?: string;

    /** Path to sprite sheet image (default: "/sprites/sprites.png") */
    spriteSheetSrc?: string;
    /** Number of horizontal columns in sprite sheet (default: 6) */
    spriteSheetCols?: number;
    /** Number of vertical rows in sprite sheet (default: 1) */
    spriteSheetRows?: number;

    /** Whether to overlay frosted glass pane over the simulation (default: false) */
    frostedGlass?: boolean;
    /** Frosted glass optical blur strength in pixels (default: 0.5) */
    frostedBlur?: number;
    /** Whether to add micro-etched sandblast tactile noise to frosted glass (default: false) */
    frostedNoise?: boolean;
}

const SPRITE_LINE_DEFAULT_CONFIG: SpriteLineConfig = {
    spriteSize: 15,
    smallHopHeight: 8,
    smallHopDistance: 16,
    largeHopHeight: 22,
    largeHopDistance: 50,
    speed: 2,
    fleeSpeed: 1,
    hopChance: 0.3,
    turnChance: 0.2,
    personalityVariance: 0.3,

    spriteCount: 6,
    groundOffsetFromBottom: 80,
    cursorFleeRadius: 150,

    showGroundLine: false,
    groundLineColor: "rgba(128, 128, 128, 0.2)",

    spriteSheetSrc: "/sprites/sprites.png",
    spriteSheetCols: 6,
    spriteSheetRows: 1,

    frostedGlass: false,
    frostedBlur: 0.5,
    frostedNoise: false,
};

export interface SpriteLineWallpaperProps {
    /** Optional overrides for simulation configuration */
    config?: Partial<SpriteLineConfig>;
    /** Optional additional Tailwind CSS classes for the canvas element */
    className?: string;

    // Direct parameter props
    spriteSize?: number;
    smallHopHeight?: number;
    smallHopDistance?: number;
    largeHopHeight?: number;
    largeHopDistance?: number;
    speed?: number;
    fleeSpeed?: number;
    hopChance?: number;
    turnChance?: number;
    personalityVariance?: number;
    groundY?: number;
    cursorFleeRadius?: number;
    showGroundLine?: boolean;
}

// ============================================================================
// INTERNAL DATA TYPES & PIXEL ART FALLBACKS
// ============================================================================

/** 4 discrete facing directions: 0 = Down, 1 = Up, 2 = Right (Side), 3 = Left (Side Flipped) */
export type CatFacing = 0 | 1 | 2 | 3;
export type CatType = number;

export interface CatPalette {
    outline: string;
    main: string;
    secondary: string;
    white: string;
    pink: string;
    eye: string;
    collar: string;
    bell: string;
    dropShadow: string;
}

const CAT_LIGHT_PALETTES: CatPalette[] = [
    {
        outline: "#141218",
        main: "#232128",
        secondary: "#35313d",
        white: "#f0f4f8",
        pink: "#c97b8d",
        eye: "#10b981",
        collar: "#dc2626",
        bell: "#f59e0b",
        dropShadow: "transparent",
    },
    {
        outline: "#25282e",
        main: "#f8fafc",
        secondary: "#475569",
        white: "#ffffff",
        pink: "#f472b6",
        eye: "#0284c7",
        collar: "#16a34a",
        bell: "#f59e0b",
        dropShadow: "transparent",
    },
    {
        outline: "#663319",
        main: "#ea580c",
        secondary: "#9a3412",
        white: "#fff7ed",
        pink: "#fb7185",
        eye: "#1e1b18",
        collar: "#0284c7",
        bell: "#f59e0b",
        dropShadow: "transparent",
    },
    {
        outline: "#1c1917",
        main: "#292524",
        secondary: "#f97316",
        white: "#fde047",
        pink: "#fb7185",
        eye: "#d97706",
        collar: "#9333ea",
        bell: "#f59e0b",
        dropShadow: "transparent",
    },
];

const CAT_DARK_PALETTES: CatPalette[] = [
    {
        outline: "#1e1b24",
        main: "#2e2b36",
        secondary: "#464152",
        white: "#f1f5f9",
        pink: "#f472b6",
        eye: "#34d399",
        collar: "#ef4444",
        bell: "#fde047",
        dropShadow: "transparent",
    },
    {
        outline: "#334155",
        main: "#f8fafc",
        secondary: "#64748b",
        white: "#ffffff",
        pink: "#f472b6",
        eye: "#38bdf8",
        collar: "#22c55e",
        bell: "#fde047",
        dropShadow: "transparent",
    },
    {
        outline: "#7c2d12",
        main: "#f97316",
        secondary: "#c2410c",
        white: "#fff7ed",
        pink: "#fb7185",
        eye: "#0f172a",
        collar: "#38bdf8",
        bell: "#fde047",
        dropShadow: "transparent",
    },
    {
        outline: "#292524",
        main: "#3c3533",
        secondary: "#fb923c",
        white: "#fef08a",
        pink: "#f472b6",
        eye: "#fbbf24",
        collar: "#a855f7",
        bell: "#fde047",
        dropShadow: "transparent",
    },
];

const CAT_SIDE_SPRITE: string[] = [
    ".....................",
    "..OWO................",
    ".OSSO.........OO.....",
    ".OSSO........OPMO.OO.",
    ".OSSO.......OMMMOOMMO",
    "..OMO......OSSSSSMMMO",
    "..OMOOO...OOSSSSSMMMO",
    "..OMSSSSOOOSSSSSEWMOO",
    "..OMSSSSSMMMMMMMWWPO.",
    "..OMMMMMMMMMMMMWWWPO.",
    "..OMMMMMMMMMMMMMMMMO.",
    "...OMMMMMMMMMMMMMMO..",
    "..OMMO.OMMO.OMMO.OMMO",
    "..OMMO.OMMO.OMMO.OMMO",
    "..OWWO.OWWO.OWWO.OWWO",
    "..OOOO.OOOO.OOOO.OOOO",
    "DDDDDDDDDDDDDDDDDDDDD",
    ".DDDDDDDDDDDDDDDDDDD.",
    "...DDDDDDDDDDDDDDD...",
];

const CAT_SIDE_LEFT_SPRITE: string[] = CAT_SIDE_SPRITE.map((row) =>
    row.split("").reverse().join("")
);

function generateCatSprites(palettes: CatPalette[]): HTMLCanvasElement[][] {
    const rawSprites = [
        CAT_SIDE_SPRITE,      // 0: Down fallback
        CAT_SIDE_SPRITE,      // 1: Up fallback
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

            // [0: Down, 1: Up, 2: Right, 3: Left]
            allBreedsResult.push([rightCvs, leftCvs, rightCvs, leftCvs]);
        }
        return allBreedsResult;
    }

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

interface LineBoid {
    x: number;
    direction: 1 | -1; // 1 = right, -1 = left
    facing: CatFacing;  // 2 = right, 3 = left
    catType: CatType;

    // Hopping State Machine
    isHopping: boolean;
    isFleeing: boolean;
    hopProgress: number; // 0.0 to 1.0
    hopStartX: number;
    hopTargetX: number;
    currentHopHeight: number;
    currentHopDistance: number;
    currentHopDuration: number;
    hopY: number; // Vertical offset from ground line
    fleeIdleTimer: number; // Minimal pause between fleeing hops
    recoveryTimer: number; // Brief touchdown recovery after landing to allow squash
    squashTimer: number; // Landing squash duration

    // Personality Variance Traits
    speedMod: number;
    fleeSpeedMod: number;
    hopChanceMod: number; // Individual variance in wandering hop likelihood
    turnChanceMod: number;
    sensitivity: number;
    hopHeightMod: number;
    hopDistMod: number;
    wanderPatience: number;
}

const FROSTED_NOISE_SVG =
    "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

// ============================================================================
// COMPONENT
// ============================================================================

export default function SpriteLineWallpaper({
    config: customConfig,
    className,
    spriteSize,
    smallHopHeight,
    smallHopDistance,
    largeHopHeight,
    largeHopDistance,
    speed,
    fleeSpeed,
    hopChance,
    turnChance,
    personalityVariance,
    groundY,
    cursorFleeRadius,
    showGroundLine,
}: SpriteLineWallpaperProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Merge configuration from props and config object
    const cfgRef = useRef<SpriteLineConfig>({
        ...SPRITE_LINE_DEFAULT_CONFIG,
        ...customConfig,
        ...(spriteSize !== undefined ? { spriteSize } : {}),
        ...(smallHopHeight !== undefined ? { smallHopHeight } : {}),
        ...(smallHopDistance !== undefined ? { smallHopDistance } : {}),
        ...(largeHopHeight !== undefined ? { largeHopHeight } : {}),
        ...(largeHopDistance !== undefined ? { largeHopDistance } : {}),
        ...(speed !== undefined ? { speed } : {}),
        ...(fleeSpeed !== undefined ? { fleeSpeed } : {}),
        ...(hopChance !== undefined ? { hopChance } : {}),
        ...(turnChance !== undefined ? { turnChance } : {}),
        ...(personalityVariance !== undefined ? { personalityVariance } : {}),
        ...(groundY !== undefined ? { groundY } : {}),
        ...(cursorFleeRadius !== undefined ? { cursorFleeRadius } : {}),
        ...(showGroundLine !== undefined ? { showGroundLine } : {}),
    });

    useEffect(() => {
        cfgRef.current = {
            ...SPRITE_LINE_DEFAULT_CONFIG,
            ...customConfig,
            ...(spriteSize !== undefined ? { spriteSize } : {}),
            ...(smallHopHeight !== undefined ? { smallHopHeight } : {}),
            ...(smallHopDistance !== undefined ? { smallHopDistance } : {}),
            ...(largeHopHeight !== undefined ? { largeHopHeight } : {}),
            ...(largeHopDistance !== undefined ? { largeHopDistance } : {}),
            ...(speed !== undefined ? { speed } : {}),
            ...(fleeSpeed !== undefined ? { fleeSpeed } : {}),
            ...(hopChance !== undefined ? { hopChance } : {}),
            ...(turnChance !== undefined ? { turnChance } : {}),
            ...(personalityVariance !== undefined ? { personalityVariance } : {}),
            ...(groundY !== undefined ? { groundY } : {}),
            ...(cursorFleeRadius !== undefined ? { cursorFleeRadius } : {}),
            ...(showGroundLine !== undefined ? { showGroundLine } : {}),
        };
    }, [
        customConfig,
        spriteSize,
        smallHopHeight,
        smallHopDistance,
        largeHopHeight,
        largeHopDistance,
        speed,
        fleeSpeed,
        hopChance,
        turnChance,
        personalityVariance,
        groundY,
        cursorFleeRadius,
        showGroundLine,
    ]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let screenWidth = window.innerWidth;
        let screenHeight = window.innerHeight;
        const currentCfg = cfgRef.current;

        // Theme and reduced motion
        const mediaDark = window.matchMedia("(prefers-color-scheme: dark)");
        let isDark = mediaDark.matches;
        let catSprites = generateCatSprites(isDark ? CAT_DARK_PALETTES : CAT_LIGHT_PALETTES);

        const mediaReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        let isReduced = mediaReduced.matches;
        const handleReduced = (e: MediaQueryListEvent) => {
            isReduced = e.matches;
        };
        mediaReduced.addEventListener("change", handleReduced);

        // Preload external sprite sheet
        let sheetStamps: HTMLCanvasElement[][] | null = null;
        if (currentCfg.spriteSheetSrc) {
            const sheetImg = new Image();
            sheetImg.src = currentCfg.spriteSheetSrc;
            sheetImg.onload = () => {
                const sliced = sliceSpriteSheet(
                    sheetImg,
                    currentCfg.spriteSheetCols || 6,
                    currentCfg.spriteSheetRows || 1
                );
                if (sliced.length > 0) {
                    sheetStamps = sliced;
                    catSprites = sliced;
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

        // Resize handler
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

        // Cursor Tracking
        let mouseX = -1000;
        let mouseY = -1000;
        let mouseActive = false;

        const handlePointerMove = (e: PointerEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            mouseActive = true;
        };

        const handlePointerLeave = () => {
            mouseActive = false;
            mouseX = -1000;
            mouseY = -1000;
        };

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

        // Initialize Sprites along the Ground Line
        const cfg = cfgRef.current;
        const boids: LineBoid[] = [];
        const count = cfg.spriteCount ?? cfg.spriteSheetCols ?? 6;
        const padding = Math.max(50, cfg.spriteSize * 2.5);
        const availableWidth = Math.max(100, screenWidth - padding * 2);
        const step = availableWidth / Math.max(1, count);

        for (let i = 0; i < count; i++) {
            const initX = padding + (i + 0.5) * step + (Math.random() - 0.5) * (step * 0.35);
            const initialDir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;

            const pVar = cfg.personalityVariance;
            // Personality variance directly controls individual wandering speed and fleeing speed
            const speedMod = Math.max(0.35, 1.0 + (Math.random() * 2 - 1) * pVar);
            const fleeSpeedMod = Math.max(0.35, 1.0 + (Math.random() * 2 - 1) * pVar);
            const sensitivity = Math.max(0.35, 1.0 + (Math.random() * 2 - 1) * pVar);
            // Personality variance directly shapes each sprite's baseline hop size (height) and hop length (distance)
            const hopHeightMod = Math.max(0.35, 1.0 + (Math.random() * 2 - 1) * pVar);
            const hopDistMod = Math.max(0.35, 1.0 + (Math.random() * 2 - 1) * pVar);
            const wanderPatience = Math.max(0.3, 1.0 + (Math.random() * 2 - 1) * pVar);

            // Variance in how often they hop (likelihood) and how likely they change direction (wandering only)
            const hopChanceMod = Math.max(0.2, 1.0 + (Math.random() * 2 - 1) * pVar);
            const turnChanceMod = Math.max(0.2, 1.0 + (Math.random() * 2 - 1) * pVar);

            boids.push({
                x: initX,
                direction: initialDir,
                facing: initialDir > 0 ? 2 : 3,
                catType: i % (cfg.spriteSheetCols || 6),

                isHopping: false,
                isFleeing: false,
                hopProgress: 0,
                hopStartX: initX,
                hopTargetX: initX,
                currentHopHeight: cfg.smallHopHeight * hopHeightMod,
                currentHopDistance: cfg.smallHopDistance * hopDistMod,
                currentHopDuration: (0.32 / Math.max(0.1, speedMod)) * Math.sqrt(hopHeightMod),
                hopY: 0,
                fleeIdleTimer: 0,
                recoveryTimer: Math.random() * 0.4, // Stagger initial hop evaluations naturally
                squashTimer: 0,

                speedMod,
                fleeSpeedMod,
                hopChanceMod,
                turnChanceMod,
                sensitivity,
                hopHeightMod,
                hopDistMod,
                wanderPatience,
            });
        }

        // Animation Loop
        let rafId: number | null = null;
        let isPaused = document.visibilityState === "hidden";
        let lastFrameTime = performance.now();

        const handleVisibility = () => {
            isPaused = document.visibilityState === "hidden";
            if (!isPaused && rafId === null) {
                lastFrameTime = performance.now();
                rafId = requestAnimationFrame(render);
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);

        const render = () => {
            if (isPaused) {
                rafId = null;
                return;
            }

            const now = performance.now();
            const dt = Math.min(0.04, (now - lastFrameTime) / 1000);
            lastFrameTime = now;

            const activeCfg = cfgRef.current;
            const speedMultiplier = isReduced ? 0.5 : 1.0;
            const overallSpeed = activeCfg.speed * speedMultiplier;
            const overallFleeSpeed = (activeCfg.fleeSpeed ?? (activeCfg.speed * 1.5)) * speedMultiplier;

            // Compute current ground Y baseline
            let groundYBaseline: number;
            if (activeCfg.groundY !== undefined) {
                groundYBaseline =
                    activeCfg.groundY <= 1.0
                        ? screenHeight * activeCfg.groundY
                        : activeCfg.groundY;
            } else {
                groundYBaseline = screenHeight - (activeCfg.groundOffsetFromBottom ?? 80);
            }

            const baseSize = activeCfg.spriteSize;
            // Estimated render width for boundary padding
            const estimatedHalfW = Math.max(16, (baseSize * 1.2) * 0.5);
            const boundaryMargin = estimatedHalfW + 12;

            // Update physics & hopping state machine
            for (let i = 0; i < boids.length; i++) {
                const b = boids[i];
                const effectiveFleeRadius = (activeCfg.cursorFleeRadius ?? 150) * b.sensitivity;

                const dx = b.x - mouseX;
                const dy = groundYBaseline - mouseY;
                const distToCursor = Math.hypot(dx, dy);
                const isCursorNear = mouseActive && mouseX >= 0 && mouseY >= 0 && distToCursor < effectiveFleeRadius;

                if (b.isHopping) {
                    b.hopProgress += dt / Math.max(0.05, b.currentHopDuration);

                    if (b.hopProgress >= 1.0) {
                        // Land on ground
                        b.hopProgress = 1.0;
                        b.isHopping = false;
                        b.x = b.hopTargetX;
                        b.hopY = 0;
                        b.squashTimer = 0.08; // Landing squash effect
                        b.recoveryTimer = 0.06; // Touchdown physical recovery before next potential hop

                        // Enforce boundary clamping and direction switch on landing
                        if (b.x <= boundaryMargin) {
                            b.x = boundaryMargin;
                            b.direction = 1;
                            b.facing = 2;
                        } else if (b.x >= screenWidth - boundaryMargin) {
                            b.x = screenWidth - boundaryMargin;
                            b.direction = -1;
                            b.facing = 3;
                        }

                        // If cursor is near, reset flee pause (urgent escape)
                        if (isCursorNear) {
                            const baseFleePause = 0.03 + Math.random() * 0.03;
                            b.fleeIdleTimer = baseFleePause / Math.max(0.2, (overallFleeSpeed / 2) * b.fleeSpeedMod);
                        }
                    } else {
                        // In flight: Parabolic hop arc
                        const t = b.hopProgress;
                        b.hopY = Math.sin(t * Math.PI) * b.currentHopHeight;

                        // Smoothstep horizontal displacement
                        const ease = t * t * (3 - 2 * t);
                        b.x = b.hopStartX + (b.hopTargetX - b.hopStartX) * ease;

                        // Clamp to boundary during flight and flip direction if wall is hit
                        if (b.x <= boundaryMargin) {
                            b.x = boundaryMargin;
                            b.hopTargetX = boundaryMargin;
                            b.direction = 1;
                            b.facing = 2;
                        } else if (b.x >= screenWidth - boundaryMargin) {
                            b.x = screenWidth - boundaryMargin;
                            b.hopTargetX = screenWidth - boundaryMargin;
                            b.direction = -1;
                            b.facing = 3;
                        }
                    }
                } else {
                    // Sitting on ground
                    b.hopY = 0;
                    if (b.recoveryTimer > 0) {
                        b.recoveryTimer -= dt;
                    }

                    let shouldStartHop = false;
                    let isFleeHop = false;

                    if (isCursorNear) {
                        // FLEE BEHAVIOR (Urgent and responsive, not governed by wandering hopChance)
                        b.fleeIdleTimer -= dt;
                        if (b.fleeIdleTimer <= 0) {
                            shouldStartHop = true;
                            isFleeHop = true;
                        }
                    } else if (b.recoveryTimer <= 0) {
                        // NORMAL WANDERING: Stochastic likelihood / percentage check
                        // Removes all predictable hopping intervals in favor of a framerate-independent Poisson process
                        let rawChance = activeCfg.hopChance ?? 0.5;
                        if (rawChance > 1.0) {
                            rawChance /= 100;
                        }

                        // Personality variance directly influences each sprite's individual hopping likelihood
                        const effectiveHopChance = Math.min(0.98, Math.max(0.01, rawChance * b.hopChanceMod));

                        // Continuous Poisson rate (expected hops per second)
                        const hopRate = (effectiveHopChance * 2.8) * Math.max(0.1, overallSpeed * b.speedMod);

                        // Framerate-independent probability for time step dt: P = 1 - e^(-rate * dt)
                        const frameHopProbability = 1 - Math.exp(-hopRate * dt);

                        if (Math.random() < frameHopProbability) {
                            shouldStartHop = true;
                            isFleeHop = false;
                        }
                    }

                    if (shouldStartHop) {
                        // Initiate a new hop
                        b.isHopping = true;
                        b.isFleeing = isFleeHop;
                        b.hopProgress = 0;
                        b.hopStartX = b.x;

                        if (isFleeHop) {
                            // FLEEING HOP: move away from cursor
                            let fleeDir: 1 | -1 = dx >= 0 ? 1 : -1;

                            // Turn around if cornered against screen edges
                            if (b.x <= boundaryMargin + 10) fleeDir = 1;
                            else if (b.x >= screenWidth - boundaryMargin - 10) fleeDir = -1;

                            b.direction = fleeDir;
                            b.facing = b.direction > 0 ? 2 : 3;

                            const hopJitter = 1.0 + (Math.random() * 2 - 1) * (activeCfg.personalityVariance * 0.25);
                            b.currentHopHeight = Math.max(4, activeCfg.largeHopHeight * b.hopHeightMod * hopJitter);
                            b.currentHopDistance = Math.max(6, activeCfg.largeHopDistance * b.hopDistMod * hopJitter);
                            b.currentHopDuration = (0.22 / Math.max(0.1, overallFleeSpeed * b.fleeSpeedMod)) * Math.sqrt(b.currentHopHeight / Math.max(1, activeCfg.largeHopHeight));

                            b.hopTargetX = Math.max(
                                boundaryMargin,
                                Math.min(screenWidth - boundaryMargin, b.x + b.direction * b.currentHopDistance)
                            );
                        } else {
                            // NORMAL WANDERING HOP
                            // If near edge, switch direction away from edge
                            if (b.x <= boundaryMargin + 20) {
                                b.direction = 1;
                            } else if (b.x >= screenWidth - boundaryMargin - 20) {
                                b.direction = -1;
                            } else {
                                // Direction change probability governed by turnChance and individual turnChanceMod (wandering only)
                                const baseTurnChance = activeCfg.turnChance ?? 0.25;
                                const effectiveTurnChance = Math.min(0.95, Math.max(0.02, baseTurnChance * b.turnChanceMod));
                                if (Math.random() < effectiveTurnChance) {
                                    b.direction = (b.direction === 1 ? -1 : 1) as 1 | -1;
                                }
                            }
                            b.facing = b.direction > 0 ? 2 : 3;

                            const hopJitter = 1.0 + (Math.random() * 2 - 1) * (activeCfg.personalityVariance * 0.25);
                            b.currentHopHeight = Math.max(2, activeCfg.smallHopHeight * b.hopHeightMod * hopJitter);
                            b.currentHopDistance = Math.max(4, activeCfg.smallHopDistance * b.hopDistMod * hopJitter);
                            b.currentHopDuration = (0.32 / Math.max(0.1, overallSpeed * b.speedMod)) * Math.sqrt(b.currentHopHeight / Math.max(1, activeCfg.smallHopHeight));

                            b.hopTargetX = Math.max(
                                boundaryMargin,
                                Math.min(screenWidth - boundaryMargin, b.x + b.direction * b.currentHopDistance)
                            );
                        }
                    }
                }
            }

            // ================================================================
            // RENDERING
            // ================================================================
            ctx.save();
            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, screenWidth, screenHeight);

            // Optional ground line axis
            if (activeCfg.showGroundLine) {
                ctx.save();
                ctx.strokeStyle =
                    activeCfg.groundLineColor ||
                    (isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.1)");
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, Math.round(groundYBaseline) + 0.5);
                ctx.lineTo(screenWidth, Math.round(groundYBaseline) + 0.5);
                ctx.stroke();
                ctx.restore();
            }

            ctx.imageSmoothingEnabled = false;

            // Render each sprite in constant Z-index order
            for (let i = 0; i < boids.length; i++) {
                const b = boids[i];

                const breedSprites = catSprites[b.catType % catSprites.length];
                if (!breedSprites) continue;
                const sprite = breedSprites[b.facing % breedSprites.length];
                if (!sprite) continue;

                const renderW = Math.round(sprite.width * (baseSize / 20));
                const renderH = Math.round(sprite.height * (baseSize / 20));

                // Squash and stretch calculations
                let scaleX = 1.0;
                let scaleY = 1.0;

                if (b.squashTimer > 0) {
                    // Landing squash
                    const squashRatio = b.squashTimer / 0.08;
                    scaleX = 1.0 + 0.14 * squashRatio;
                    scaleY = 1.0 - 0.14 * squashRatio;
                    b.squashTimer -= dt;
                } else if (b.isHopping) {
                    const p = b.hopProgress;
                    if (p < 0.25) {
                        // Takeoff leap elongation
                        scaleX = 0.94;
                        scaleY = 1.07;
                    } else if (p > 0.75) {
                        // Preparing for impact
                        scaleX = 1.03;
                        scaleY = 0.97;
                    }
                }

                // 3. Draw Sprite rooted to feet contact point
                ctx.save();
                ctx.translate(b.x, groundYBaseline - b.hopY);
                ctx.scale(scaleX, scaleY);
                ctx.drawImage(sprite, -renderW * 0.5, -renderH, renderW, renderH);
                ctx.restore();
            }

            ctx.restore();

            rafId = requestAnimationFrame(render);
        };

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
        ...SPRITE_LINE_DEFAULT_CONFIG,
        ...customConfig,
        ...(spriteSize !== undefined ? { spriteSize } : {}),
        ...(smallHopHeight !== undefined ? { smallHopHeight } : {}),
        ...(smallHopDistance !== undefined ? { smallHopDistance } : {}),
        ...(largeHopHeight !== undefined ? { largeHopHeight } : {}),
        ...(largeHopDistance !== undefined ? { largeHopDistance } : {}),
        ...(speed !== undefined ? { speed } : {}),
        ...(fleeSpeed !== undefined ? { fleeSpeed } : {}),
        ...(hopChance !== undefined ? { hopChance } : {}),
        ...(turnChance !== undefined ? { turnChance } : {}),
        ...(personalityVariance !== undefined ? { personalityVariance } : {}),
        ...(groundY !== undefined ? { groundY } : {}),
        ...(cursorFleeRadius !== undefined ? { cursorFleeRadius } : {}),
        ...(showGroundLine !== undefined ? { showGroundLine } : {}),
    };

    return (
        <div
            aria-hidden="true"
            className={`fixed inset-0 w-screen h-screen pointer-events-none -z-10 overflow-hidden transition-opacity duration-700 ease-out ${isLoaded ? "opacity-100" : "opacity-0"
                } ${className || ""}`}
        >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
            {activeCfg.frostedGlass && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backdropFilter: `blur(${activeCfg.frostedBlur}px)`,
                        WebkitBackdropFilter: `blur(${activeCfg.frostedBlur}px)`,
                        backgroundColor: "color-mix(in srgb, var(--bg-color) 45%, transparent)",
                    }}
                >
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 40%, rgba(0, 0, 0, 0.04) 100%)",
                        }}
                    />
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
