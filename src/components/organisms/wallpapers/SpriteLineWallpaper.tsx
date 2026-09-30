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

    // Platform Navigation Parameters
    /** Whether sprites treat DOM elements as walkable/jumpable platforms (default: true) */
    enablePlatforms?: boolean;
    /** CSS selector for DOM elements to treat as platforms */
    platformSelector?: string;
    /** CSS selector for elements to exclude from being platforms (default: "nav, header, [data-no-sprite-platform]") */
    platformExcludeSelector?: string;
    /** Maximum vertical reach in pixels a sprite can leap up to reach an overhead platform (default: 140) */
    platformJumpReachY?: number;
    /** Maximum horizontal reach in pixels a sprite can leap across to reach a nearby platform or adjacent word (default: 40) */
    platformJumpReachX?: number;
    /** Probability (0.0 to 1.0) of attempting a jump when an overhead platform is detected (default: 0.3) */
    platformJumpChance?: number;
    /** Probability (0.0 to 1.0) of hopping off a ledge and dropping down instead of turning around (default: 0.35) */
    platformDropChance?: number;
    /** Canvas container z-index. Set to 20 for sprites to walk on top of text/cards, or -10 for background (default: 20) */
    zIndex?: number;
    /** Optional visual outline of detected platform surfaces for inspection (default: false) */
    showPlatforms?: boolean;
    /** Delay in milliseconds before spawning sprites to allow page entrance animations to complete (default: 1200) */
    spawnDelay?: number;
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
    cursorFleeRadius: 50,

    showGroundLine: false,
    groundLineColor: "rgba(128, 128, 128, 0.2)",

    spriteSheetSrc: "/sprites/sprites.png",
    spriteSheetCols: 6,
    spriteSheetRows: 1,

    frostedGlass: false,
    frostedBlur: 0,
    frostedNoise: false,

    enablePlatforms: true,
    platformSelector: "[data-sprite-platform], .feature > div, h2, h3, [role='button'], button, a.btn",
    platformExcludeSelector: "nav, header, [data-no-sprite-platform]",
    platformJumpReachY: 200,
    platformJumpReachX: 10,
    platformJumpChance: 0.2,
    platformDropChance: 0.2,
    zIndex: 20,
    showPlatforms: true,
    spawnDelay: 3000,
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
    enablePlatforms?: boolean;
    platformSelector?: string;
    platformExcludeSelector?: string;
    platformJumpReachY?: number;
    platformJumpReachX?: number;
    platformJumpChance?: number;
    platformDropChance?: number;
    zIndex?: number;
    showPlatforms?: boolean;
    spawnDelay?: number;
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

interface PlatformSurface {
    id: string;
    left: number;       // Document X coordinate
    right: number;      // Document X coordinate
    top: number;        // Document Y coordinate where feet land
    width: number;
    isGround?: boolean; // Base ground baseline across full document width
}

function getDocumentDimensions() {
    const doc = document.documentElement;
    const body = document.body;
    const pageHeight = Math.max(
        doc ? doc.scrollHeight : 0,
        doc ? doc.offsetHeight : 0,
        doc ? doc.clientHeight : 0,
        body ? body.scrollHeight : 0,
        body ? body.offsetHeight : 0,
        window.innerHeight
    );
    const pageWidth = Math.max(
        doc ? doc.scrollWidth : 0,
        doc ? doc.offsetWidth : 0,
        doc ? doc.clientWidth : 0,
        body ? body.scrollWidth : 0,
        body ? body.offsetWidth : 0,
        window.innerWidth
    );
    return { pageWidth, pageHeight };
}

const platformElementWeakMap = new WeakMap<Element, string>();
let globalPlatformCounter = 0;

function extractPlatformSurfaces(
    selector: string,
    groundYBaseline: number,
    pageWidth: number,
    excludeSelector?: string
): PlatformSurface[] {
    const surfaces: PlatformSurface[] = [];
    const scrollX = window.scrollX || window.pageXOffset || 0;
    const scrollY = window.scrollY || window.pageYOffset || 0;

    // Always include the document ground line as platform 0
    surfaces.push({
        id: "ground",
        left: 0,
        right: pageWidth,
        top: groundYBaseline,
        width: pageWidth,
        isGround: true,
    });

    try {
        const elements = document.querySelectorAll<HTMLElement>(selector);
        const seenIds = new Set<string>();
        seenIds.add("ground");

        elements.forEach((el) => {
            // Remove legacy dataset attribute to prevent stale duplicates from contaminating scans
            if (el.hasAttribute("data-sprite-plat-id")) {
                el.removeAttribute("data-sprite-plat-id");
            }

            // Discard elements that are display:none, zero visibility, or transparent (< 0.05 opacity)
            if (el.offsetParent === null && el.offsetWidth === 0 && el.offsetHeight === 0) return;
            const style = window.getComputedStyle(el);
            if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) < 0.05) {
                return;
            }

            // Exclude fixed-position elements (e.g. sticky/fixed navigation bars)
            if (style.position === "fixed") {
                return;
            }

            // Exclude elements matching excludeSelector or located inside an excluded container
            if (excludeSelector) {
                try {
                    if (el.matches(excludeSelector) || el.closest(excludeSelector)) {
                        return;
                    }
                } catch {
                    // Gracefully skip selector error if invalid custom selector is provided
                }
            }

            // Maintain stable, collision-free platform ID across re-scans via WeakMap
            let platId = platformElementWeakMap.get(el);
            if (!platId) {
                platId = `plat_${++globalPlatformCounter}`;
                platformElementWeakMap.set(el, platId);
            }

            // Check if element has multi-line wrapped text rects
            const isTextElement = /^(H[1-6]|P|SPAN|A|DIV)$/i.test(el.tagName) && el.children.length === 0;
            const rects = isTextElement && typeof el.getClientRects === "function" ? el.getClientRects() : null;

            if (rects && rects.length > 1) {
                for (let i = 0; i < rects.length; i++) {
                    const r = rects[i];
                    if (r.width >= 24 && r.height >= 8) {
                        let finalId = `${platId}_${i}`;
                        if (seenIds.has(finalId)) {
                            finalId = `${platId}_${i}_${++globalPlatformCounter}`;
                        }
                        seenIds.add(finalId);
                        surfaces.push({
                            id: finalId,
                            left: r.left + scrollX,
                            right: r.right + scrollX,
                            top: r.top + scrollY,
                            width: r.width,
                        });
                    }
                }
            } else {
                const r = el.getBoundingClientRect();
                if (r.width >= 24 && r.height >= 6) {
                    let finalId = platId;
                    if (seenIds.has(finalId)) {
                        finalId = `${platId}_${++globalPlatformCounter}`;
                    }
                    seenIds.add(finalId);
                    surfaces.push({
                        id: finalId,
                        left: r.left + scrollX,
                        right: r.right + scrollX,
                        top: r.top + scrollY,
                        width: r.width,
                    });
                }
            }
        });
    } catch {
        // Fallback gracefully on query error
    }

    return surfaces;
}

interface LineBoid {
    x: number;
    y: number; // Current feet contact Y in canvas coords
    direction: 1 | -1; // 1 = right, -1 = left
    facing: CatFacing;  // 2 = right, 3 = left
    catType: CatType;

    currentPlatformId: string;

    // Hopping State Machine
    isHopping: boolean;
    isFleeing: boolean;
    hopProgress: number; // 0.0 to 1.0
    hopStartX: number;
    hopStartY: number;
    hopTargetX: number;
    hopTargetY: number;
    targetPlatformId: string;
    currentHopHeight: number;
    currentHopDistance: number;
    currentHopDuration: number;
    hopArcPeak: number;
    hopY: number; // Vertical offset from ground line
    fleeIdleTimer: number; // Minimal pause between fleeing hops
    recoveryTimer: number; // Brief touchdown recovery after landing to allow squash
    squashTimer: number; // Landing squash duration

    // Falling / Dropping State
    isFalling: boolean;
    fallVelocity: number;
    fallingFromPlatformId?: string;
    fallStartY?: number;

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
    enablePlatforms,
    platformSelector,
    platformExcludeSelector,
    platformJumpReachY,
    platformJumpReachX,
    platformJumpChance,
    platformDropChance,
    zIndex,
    showPlatforms,
    spawnDelay,
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
        ...(enablePlatforms !== undefined ? { enablePlatforms } : {}),
        ...(platformSelector !== undefined ? { platformSelector } : {}),
        ...(platformExcludeSelector !== undefined ? { platformExcludeSelector } : {}),
        ...(platformJumpReachY !== undefined ? { platformJumpReachY } : {}),
        ...(platformJumpReachX !== undefined ? { platformJumpReachX } : {}),
        ...(platformJumpChance !== undefined ? { platformJumpChance } : {}),
        ...(platformDropChance !== undefined ? { platformDropChance } : {}),
        ...(zIndex !== undefined ? { zIndex } : {}),
        ...(showPlatforms !== undefined ? { showPlatforms } : {}),
        ...(spawnDelay !== undefined ? { spawnDelay } : {}),
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
            ...(enablePlatforms !== undefined ? { enablePlatforms } : {}),
            ...(platformSelector !== undefined ? { platformSelector } : {}),
            ...(platformExcludeSelector !== undefined ? { platformExcludeSelector } : {}),
            ...(platformJumpReachY !== undefined ? { platformJumpReachY } : {}),
            ...(platformJumpReachX !== undefined ? { platformJumpReachX } : {}),
            ...(platformJumpChance !== undefined ? { platformJumpChance } : {}),
            ...(platformDropChance !== undefined ? { platformDropChance } : {}),
            ...(zIndex !== undefined ? { zIndex } : {}),
            ...(showPlatforms !== undefined ? { showPlatforms } : {}),
            ...(spawnDelay !== undefined ? { spawnDelay } : {}),
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
        enablePlatforms,
        platformSelector,
        platformExcludeSelector,
        platformJumpReachY,
        platformJumpReachX,
        platformJumpChance,
        platformDropChance,
        zIndex,
        showPlatforms,
        spawnDelay,
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

        // Platform Surfaces & Boids Management
        let platforms: PlatformSurface[] = [];
        const boids: LineBoid[] = [];

        const computeGroundY = (pageH: number) => {
            const activeCfg = cfgRef.current;
            if (activeCfg.groundY !== undefined) {
                return activeCfg.groundY <= 1.0
                    ? pageH * activeCfg.groundY
                    : activeCfg.groundY;
            }
            return pageH - (activeCfg.groundOffsetFromBottom ?? 80);
        };

        const distributeBoidsToPlatforms = (boidsList: LineBoid[]) => {
            if (platforms.length === 0 || boidsList.length === 0) return;
            const nonGround = platforms.filter((p) => !p.isGround);
            const ground = platforms.find((p) => p.isGround);

            const { pageWidth } = getDocumentDimensions();
            const activeCfg = cfgRef.current;
            const baseSize = activeCfg.spriteSize;
            const estimatedHalfW = Math.max(16, (baseSize * 1.2) * 0.5);
            const boundaryMargin = estimatedHalfW + 12;

            if (nonGround.length === 0) {
                // All boids to ground with even horizontal distribution
                for (let i = 0; i < boidsList.length; i++) {
                    const b = boidsList[i];
                    const minX = boundaryMargin + 20;
                    const maxX = pageWidth - boundaryMargin - 20;
                    const step = Math.max(1, (maxX - minX) / Math.max(1, boidsList.length));
                    b.x = minX + (i + 0.2 + Math.random() * 0.6) * step;
                    b.y = ground ? ground.top : b.y;
                    b.hopStartX = b.x;
                    b.hopStartY = b.y;
                    b.hopTargetX = b.x;
                    b.hopTargetY = b.y;
                    b.currentPlatformId = "ground";
                    b.isFalling = false;
                    b.isHopping = false;
                }
                return;
            }

            // Sort elevated platforms by vertical position (top to bottom)
            const sortedElevated = [...nonGround].sort((a, b) => a.top - b.top);

            // Reserve at least 1 sprite for the ground line if multiple sprites
            const groundSpriteIndex = (boidsList.length > 2 && ground) ? 0 : -1;

            const elevatedSpriteIndices = boidsList
                .map((_, idx) => idx)
                .filter((idx) => idx !== groundSpriteIndex);

            // Shuffle elevated sprite indices so breed/personality doesn't correlate with vertical height
            const shuffledElevatedSpriteIndices = [...elevatedSpriteIndices].sort(() => Math.random() - 0.5);
            const numElevatedSprites = shuffledElevatedSpriteIndices.length;
            const usedPlatformIds = new Set<string>();

            // Distribute elevated sprites evenly across vertical tiers of the page
            for (let k = 0; k < numElevatedSprites; k++) {
                const boidIdx = shuffledElevatedSpriteIndices[k];
                const b = boidsList[boidIdx];
                if (b.isFleeing || b.isHopping) continue;

                const startRatio = k / numElevatedSprites;
                const endRatio = (k + 1) / numElevatedSprites;
                const startIdx = Math.floor(startRatio * sortedElevated.length);
                const endIdx = Math.min(sortedElevated.length, Math.max(startIdx + 1, Math.ceil(endRatio * sortedElevated.length)));

                const bandPlatforms = sortedElevated.slice(startIdx, endIdx);

                // Prefer unused platform in this vertical band
                let targetPlat = bandPlatforms.find((p) => !usedPlatformIds.has(p.id));
                if (!targetPlat) {
                    targetPlat = sortedElevated.find((p) => !usedPlatformIds.has(p.id));
                }
                if (!targetPlat) {
                    targetPlat = bandPlatforms[Math.floor(Math.random() * bandPlatforms.length)] || sortedElevated[0];
                }

                usedPlatformIds.add(targetPlat.id);

                const margin = Math.min(14, targetPlat.width * 0.25);
                const availableW = Math.max(1, targetPlat.width - margin * 2);
                const spawnX = targetPlat.left + margin + Math.random() * availableW;
                const spawnY = targetPlat.top;

                b.x = spawnX;
                b.y = spawnY;
                b.hopStartX = b.x;
                b.hopStartY = b.y;
                b.hopTargetX = b.x;
                b.hopTargetY = b.y;
                b.currentPlatformId = targetPlat.id;
                b.isFalling = false;
                b.isHopping = false;
                b.fallingFromPlatformId = undefined;
                b.fallStartY = undefined;

                b.direction = Math.random() < 0.5 ? 1 : -1;
                b.facing = b.direction > 0 ? 2 : 3;
                b.recoveryTimer = Math.random() * 0.5;
            }

            // Position ground sprite if applicable
            if (groundSpriteIndex >= 0 && ground) {
                const b = boidsList[groundSpriteIndex];
                if (!b.isFleeing && !b.isHopping) {
                    const minX = boundaryMargin + 20;
                    const maxX = pageWidth - boundaryMargin - 20;
                    b.x = minX + Math.random() * Math.max(1, maxX - minX);
                    b.y = ground.top;
                    b.hopStartX = b.x;
                    b.hopStartY = b.y;
                    b.hopTargetX = b.x;
                    b.hopTargetY = b.y;
                    b.currentPlatformId = "ground";
                    b.isFalling = false;
                    b.isHopping = false;
                    b.fallingFromPlatformId = undefined;
                    b.fallStartY = undefined;
                    b.direction = Math.random() < 0.5 ? 1 : -1;
                    b.facing = b.direction > 0 ? 2 : 3;
                    b.recoveryTimer = Math.random() * 0.5;
                }
            }
        };

        const scanPlatforms = () => {
            const activeCfg = cfgRef.current;
            const { pageWidth, pageHeight } = getDocumentDimensions();
            const currentGroundY = computeGroundY(pageHeight);

            if (!activeCfg.enablePlatforms) {
                platforms = [{
                    id: "ground",
                    left: 0,
                    right: pageWidth,
                    top: currentGroundY,
                    width: pageWidth,
                    isGround: true,
                }];
                return;
            }
            platforms = extractPlatformSurfaces(
                activeCfg.platformSelector || "[data-sprite-platform], .feature > div, h2, h3, [role='button'], button, a.btn",
                currentGroundY,
                pageWidth,
                activeCfg.platformExcludeSelector || "nav, header, [data-no-sprite-platform]"
            );
        };

        // Resize handler
        const handleResize = () => {
            if (!canvas) return;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            screenWidth = window.innerWidth;
            screenHeight = window.innerHeight;
            canvas.width = Math.floor(screenWidth * dpr);
            canvas.height = Math.floor(screenHeight * dpr);
            scanPlatforms();
        };
        handleResize();
        window.addEventListener("resize", handleResize, { passive: true });

        // Observers for layout and dynamic content changes
        const observer = new MutationObserver(() => {
            scanPlatforms();
        });
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        }

        let resizeObserver: ResizeObserver | null = null;
        if (typeof ResizeObserver !== "undefined" && document.body) {
            resizeObserver = new ResizeObserver(() => {
                scanPlatforms();
            });
            resizeObserver.observe(document.body);
        }

        // Schedule subsequent scans to catch async data loads (Firebase) and CSS animations
        const scanTimer1 = setTimeout(scanPlatforms, 400);
        const scanTimer2 = setTimeout(scanPlatforms, 1000);
        const scanTimer3 = setTimeout(scanPlatforms, 2200);

        // Cursor Tracking in Viewport
        let clientMouseX = -1000;
        let clientMouseY = -1000;
        let mouseActive = false;

        const handlePointerMove = (e: PointerEvent) => {
            clientMouseX = e.clientX;
            clientMouseY = e.clientY;
            mouseActive = true;
        };

        const handlePointerLeave = () => {
            mouseActive = false;
            clientMouseX = -1000;
            clientMouseY = -1000;
        };

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

        // Initialize Sprites across the document after entrance animation buffer
        let hasSpawned = false;

        const spawnBoids = () => {
            if (hasSpawned) return;
            hasSpawned = true;

            scanPlatforms();

            const cfg = cfgRef.current;
            const count = cfg.spriteCount ?? cfg.spriteSheetCols ?? 6;
            const padding = Math.max(50, cfg.spriteSize * 2.5);
            const { pageWidth: initialPageWidth, pageHeight: initialPageHeight } = getDocumentDimensions();
            const availableWidth = Math.max(100, initialPageWidth - padding * 2);
            const step = availableWidth / Math.max(1, count);
            const initialGroundY = computeGroundY(initialPageHeight);

            const shuffledSlots = Array.from({ length: count }, (_, idx) => idx).sort(() => Math.random() - 0.5);

            for (let i = 0; i < count; i++) {
                const initX = padding + (shuffledSlots[i] + 0.15 + Math.random() * 0.7) * step;
                const initialDir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;

                const pVar = cfg.personalityVariance;
                const speedMod = Math.max(0.35, 1.0 + (Math.random() * 2 - 1) * pVar);
                const fleeSpeedMod = Math.max(0.35, 1.0 + (Math.random() * 2 - 1) * pVar);
                const sensitivity = Math.max(0.35, 1.0 + (Math.random() * 2 - 1) * pVar);
                const hopHeightMod = Math.max(0.35, 1.0 + (Math.random() * 2 - 1) * pVar);
                const hopDistMod = Math.max(0.35, 1.0 + (Math.random() * 2 - 1) * pVar);
                const wanderPatience = Math.max(0.3, 1.0 + (Math.random() * 2 - 1) * pVar);

                const hopChanceMod = Math.max(0.2, 1.0 + (Math.random() * 2 - 1) * pVar);
                const turnChanceMod = Math.max(0.2, 1.0 + (Math.random() * 2 - 1) * pVar);

                boids.push({
                    x: initX,
                    y: initialGroundY,
                    direction: initialDir,
                    facing: initialDir > 0 ? 2 : 3,
                    catType: i % (cfg.spriteSheetCols || 6),

                    currentPlatformId: "ground",

                    isHopping: false,
                    isFleeing: false,
                    hopProgress: 0,
                    hopStartX: initX,
                    hopStartY: initialGroundY,
                    hopTargetX: initX,
                    hopTargetY: initialGroundY,
                    targetPlatformId: "ground",
                    currentHopHeight: cfg.smallHopHeight * hopHeightMod,
                    currentHopDistance: cfg.smallHopDistance * hopDistMod,
                    currentHopDuration: (0.32 / Math.max(0.1, speedMod)) * Math.sqrt(hopHeightMod),
                    hopArcPeak: cfg.smallHopHeight * hopHeightMod,
                    hopY: 0,

                    isFalling: false,
                    fallVelocity: 0,
                    fallingFromPlatformId: undefined,
                    fallStartY: undefined,

                    fleeIdleTimer: 0,
                    recoveryTimer: Math.random() * 0.4,
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

            // Distribute boids onto detected platforms now that animations have completed
            distributeBoidsToPlatforms(boids);
            setIsLoaded(true);
        };

        const spawnDelay = currentCfg.spawnDelay ?? 1200;
        let spawnTimer: ReturnType<typeof setTimeout> | null = null;
        if (spawnDelay <= 0) {
            spawnBoids();
        } else {
            spawnTimer = setTimeout(spawnBoids, spawnDelay);
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

            // Current document dimensions & camera scroll
            const { pageWidth, pageHeight } = getDocumentDimensions();
            const groundYBaseline = computeGroundY(pageHeight);

            const scrollX = window.scrollX || window.pageXOffset || 0;
            const scrollY = window.scrollY || window.pageYOffset || 0;

            // Synchronize ground platform
            const groundPlat = platforms.find((p) => p.isGround);
            if (groundPlat) {
                groundPlat.top = groundYBaseline;
                groundPlat.right = pageWidth;
                groundPlat.width = pageWidth;
            }

            const baseSize = activeCfg.spriteSize;
            const estimatedHalfW = Math.max(16, (baseSize * 1.2) * 0.5);
            const boundaryMargin = estimatedHalfW + 12;

            // Mouse in document coordinates
            const mouseWorldX = mouseActive ? clientMouseX + scrollX : -10000;
            const mouseWorldY = mouseActive ? clientMouseY + scrollY : -10000;

            // Update physics & hopping state machine
            for (let i = 0; i < boids.length; i++) {
                const b = boids[i];
                const effectiveFleeRadius = (activeCfg.cursorFleeRadius ?? 150) * b.sensitivity;

                const dx = b.x - mouseWorldX;
                const dy = b.y - mouseWorldY;
                const distToCursor = Math.hypot(dx, dy);
                const isCursorNear = mouseActive && clientMouseX >= 0 && clientMouseY >= 0 && distToCursor < effectiveFleeRadius;

                // 1. FREE FALLING / DROPPING DOWN
                if (b.isFalling) {
                    b.fallVelocity += 900 * dt;
                    const prevY = b.y;
                    b.y += b.fallVelocity * dt;
                    b.x += b.direction * 30 * dt;
                    b.x = Math.max(boundaryMargin, Math.min(pageWidth - boundaryMargin, b.x));

                    // Check platform collisions
                    let landedPlat: PlatformSurface | null = null;
                    for (let j = 0; j < platforms.length; j++) {
                        const p = platforms[j];
                        // Skip the platform we just dropped from while still near its top edge to prevent instant re-landing
                        if (p.id === b.fallingFromPlatformId && b.y < (b.fallStartY ?? p.top) + 14) {
                            continue;
                        }
                        if (b.x >= p.left - 10 && b.x <= p.right + 10) {
                            if (prevY <= p.top + 4 && b.y >= p.top) {
                                if (!landedPlat || p.top < landedPlat.top) {
                                    landedPlat = p;
                                }
                            }
                        }
                    }
                    if (!landedPlat && b.y >= groundYBaseline) {
                        landedPlat = groundPlat || null;
                    }

                    if (landedPlat) {
                        b.y = landedPlat.top;
                        b.currentPlatformId = landedPlat.id;
                        b.isFalling = false;
                        b.fallVelocity = 0;
                        b.fallingFromPlatformId = undefined;
                        b.fallStartY = undefined;
                        b.squashTimer = 0.12; // Deeper squash on impact from fall
                        b.recoveryTimer = 0.08;
                        b.hopY = 0;

                        if (isCursorNear) {
                            const fleeDir: 1 | -1 = dx >= 0 ? 1 : -1;
                            b.direction = fleeDir;
                            b.facing = fleeDir > 0 ? 2 : 3;
                        } else {
                            if (b.x <= landedPlat.left + 6) {
                                b.x = landedPlat.left + 6;
                                b.direction = 1;
                                b.facing = 2;
                            } else if (b.x >= landedPlat.right - 6) {
                                b.x = landedPlat.right - 6;
                                b.direction = -1;
                                b.facing = 3;
                            }
                        }
                    }
                    continue;
                }

                // 2. IN HOP FLIGHT
                if (b.isHopping) {
                    b.hopProgress += dt / Math.max(0.05, b.currentHopDuration);

                    if (b.hopProgress >= 1.0) {
                        // Land on destination surface
                        b.hopProgress = 1.0;
                        b.isHopping = false;
                        b.x = b.hopTargetX;
                        b.y = b.hopTargetY;
                        b.hopY = 0;
                        b.currentPlatformId = b.targetPlatformId;
                        b.squashTimer = 0.08;
                        b.recoveryTimer = 0.06;

                        let currentPlat = platforms.find((p) => p.id === b.currentPlatformId);
                        if (!currentPlat && b.currentPlatformId === "ground") {
                            currentPlat = groundPlat;
                        }
                        if (!currentPlat) {
                            currentPlat = platforms.find(
                                (p) => !p.isGround && b.x >= p.left - 6 && b.x <= p.right + 6 && Math.abs(b.y - p.top) <= 20
                            );
                            if (currentPlat) {
                                b.currentPlatformId = currentPlat.id;
                            }
                        }
                        if (currentPlat) {
                            b.y = currentPlat.top;
                            if (currentPlat.isGround) {
                                const minX = boundaryMargin;
                                const maxX = pageWidth - boundaryMargin;
                                if (b.x <= minX) {
                                    b.x = minX;
                                    if (!isCursorNear) {
                                        b.direction = 1;
                                        b.facing = 2;
                                    }
                                } else if (b.x >= maxX) {
                                    b.x = maxX;
                                    if (!isCursorNear) {
                                        b.direction = -1;
                                        b.facing = 3;
                                    }
                                }
                            } else {
                                // Clamp to platform boundaries without reversing direction so ledge drops can trigger
                                b.x = Math.max(currentPlat.left + 2, Math.min(currentPlat.right - 2, b.x));
                            }
                        }

                        if (isCursorNear) {
                            const baseFleePause = 0.03 + Math.random() * 0.03;
                            b.fleeIdleTimer = baseFleePause / Math.max(0.2, (overallFleeSpeed / 2) * b.fleeSpeedMod);
                        }
                    } else {
                        // In flight: smoothstep horizontal displacement + elevation linear baseline + parabolic arc
                        const t = b.hopProgress;
                        const ease = t * t * (3 - 2 * t);
                        b.x = b.hopStartX + (b.hopTargetX - b.hopStartX) * ease;
                        const yBase = b.hopStartY + (b.hopTargetY - b.hopStartY) * t;
                        const yArc = Math.sin(t * Math.PI) * b.hopArcPeak;
                        b.hopY = yArc;
                        b.y = yBase - yArc;
                    }
                    continue;
                }

                // 3. GROUNDED ON PLATFORM
                let currentPlat = platforms.find((p) => p.id === b.currentPlatformId);
                if (!currentPlat && b.currentPlatformId === "ground") {
                    currentPlat = groundPlat;
                }
                if (!currentPlat) {
                    // Check if there is still a platform surface right under the cat's feet
                    const platUnderFeet = platforms.find(
                        (p) => !p.isGround && b.x >= p.left - 6 && b.x <= p.right + 6 && Math.abs(b.y - p.top) <= 20
                    );
                    if (platUnderFeet) {
                        currentPlat = platUnderFeet;
                        b.currentPlatformId = platUnderFeet.id;
                        b.y = platUnderFeet.top;
                        b.hopY = 0;
                    } else {
                        // Platform is gone or moved: start falling naturally instead of teleporting
                        b.isFalling = true;
                        b.fallVelocity = 0;
                        b.fallingFromPlatformId = undefined;
                        b.fallStartY = b.y;
                        continue;
                    }
                } else {
                    b.y = currentPlat.top;
                    b.hopY = 0;
                }

                if (b.recoveryTimer > 0) {
                    b.recoveryTimer -= dt;
                }

                let shouldStartHop = false;
                let isFleeHop = false;

                if (isCursorNear) {
                    // FLEE BEHAVIOR (Urgent and responsive)
                    b.fleeIdleTimer -= dt;
                    if (b.fleeIdleTimer <= 0) {
                        shouldStartHop = true;
                        isFleeHop = true;
                    }
                } else if (b.recoveryTimer <= 0) {
                    // NORMAL WANDERING: Stochastic likelihood check
                    let rawChance = activeCfg.hopChance ?? 0.3;
                    if (rawChance > 1.0) rawChance /= 100;
                    const effectiveHopChance = Math.min(0.98, Math.max(0.01, rawChance * b.hopChanceMod));
                    const hopRate = (effectiveHopChance * 2.8) * Math.max(0.1, overallSpeed * b.speedMod);
                    const frameHopProbability = 1 - Math.exp(-hopRate * dt);

                    if (Math.random() < frameHopProbability) {
                        shouldStartHop = true;
                        isFleeHop = false;
                    }
                }

                if (shouldStartHop) {
                    b.isHopping = true;
                    b.isFleeing = isFleeHop;
                    b.hopProgress = 0;
                    b.hopStartX = b.x;
                    b.hopStartY = b.y;

                    const plat = currentPlat || groundPlat!;

                    if (isFleeHop) {
                        // FLEEING: Determine horizontal flee direction away from cursor
                        const fleeDir: 1 | -1 = dx >= 0 ? 1 : -1;

                        let didChooseVerticalEscape = false;

                        // VERTICAL ESCAPE PRIORITY:
                        // Search for reachable overhead platforms, lower platforms, or ledge drops
                        // and prioritize them over staying on the same horizontal platform.
                        if (activeCfg.enablePlatforms) {
                            const maxReachY = activeCfg.platformJumpReachY ?? 140;
                            // Allow reachable platforms horizontally with a comfortable flee reach
                            const maxReachX = Math.max(activeCfg.platformJumpReachX ?? 40, 24);

                            const fleeUpCandidates: PlatformSurface[] = [];
                            const fleeDownCandidates: PlatformSurface[] = [];

                            for (let j = 0; j < platforms.length; j++) {
                                const q = platforms[j];
                                if (q.id === plat.id) continue;
                                const diffY = plat.top - q.top; // Positive = overhead, Negative = lower

                                const distToQ = b.x < q.left ? q.left - b.x : (b.x > q.right ? b.x - q.right : 0);

                                if (distToQ <= maxReachX) {
                                    // Overhead platform within reach (Jump Up)
                                    if (diffY >= 14 && diffY <= maxReachY && q.top >= 20 && q.top <= pageHeight - 10) {
                                        fleeUpCandidates.push(q);
                                    }
                                    // Lower platform or ground within reach (Jump Down)
                                    else if (diffY <= -14 && -diffY <= maxReachY && !plat.isGround) {
                                        fleeDownCandidates.push(q);
                                    }
                                }
                            }

                            // Ledge drop option: if on elevated platform and near an edge facing towards it
                            const isNearLeftLedge = b.x <= plat.left + 22 && fleeDir === -1;
                            const isNearRightLedge = b.x >= plat.right - 22 && fleeDir === 1;
                            const canLedgeDrop = !plat.isGround && (isNearLeftLedge || isNearRightLedge);

                            type EscapeOption =
                                | { type: "up"; plat: PlatformSurface; score: number }
                                | { type: "down"; plat: PlatformSurface; score: number }
                                | { type: "drop"; score: number };

                            const escapeOptions: EscapeOption[] = [];

                            // Helper to score a candidate platform based on resulting distance from cursor
                            const scoreCandidate = (targetPlat: PlatformSurface) => {
                                const margin = Math.min(12, targetPlat.width * 0.25);
                                let candX = b.x + fleeDir * Math.max(10, (activeCfg.largeHopDistance ?? 60) * 0.7);
                                candX = Math.max(targetPlat.left + margin, Math.min(targetPlat.right - margin, candX));
                                const distFromCursor = Math.hypot(candX - mouseWorldX, targetPlat.top - mouseWorldY);
                                return { targetX: candX, distFromCursor };
                            };

                            // Score UP candidates
                            for (const q of fleeUpCandidates) {
                                const { distFromCursor } = scoreCandidate(q);
                                // dy < 0 means cursor is below sprite -> bonus for jumping UP
                                const verticalBonus = dy < 0 ? 60 : (Math.abs(dy) <= 30 ? 40 : 10);
                                escapeOptions.push({ type: "up", plat: q, score: distFromCursor + verticalBonus });
                            }

                            // Score DOWN candidates
                            for (const q of fleeDownCandidates) {
                                const { distFromCursor } = scoreCandidate(q);
                                // dy > 0 means cursor is above sprite -> bonus for jumping DOWN
                                const verticalBonus = dy > 0 ? 60 : (Math.abs(dy) <= 30 ? 40 : 10);
                                escapeOptions.push({ type: "down", plat: q, score: distFromCursor + verticalBonus });
                            }

                            // Score Ledge Drop option
                            if (canLedgeDrop) {
                                const estimatedDropY = Math.min(pageHeight - 20, plat.top + 70);
                                const estimatedDropX = b.x + fleeDir * 25;
                                const distFromCursor = Math.hypot(estimatedDropX - mouseWorldX, estimatedDropY - mouseWorldY);
                                const dropBonus = dy >= -15 ? 70 : 25;
                                escapeOptions.push({ type: "drop", score: distFromCursor + dropBonus });
                            }

                            // PRIORITIZE VERTICAL ESCAPE: If any vertical escape option is available, execute the best one!
                            if (escapeOptions.length > 0) {
                                escapeOptions.sort((a, b) => b.score - a.score);
                                const chosen = escapeOptions[0];

                                if (chosen.type === "up" || chosen.type === "down") {
                                    didChooseVerticalEscape = true;
                                    const targetPlat = chosen.plat;
                                    const margin = Math.min(12, targetPlat.width * 0.25);
                                    let targetX = b.x + fleeDir * Math.max(12, (activeCfg.largeHopDistance ?? 60) * b.hopDistMod);
                                    targetX = Math.max(targetPlat.left + margin, Math.min(targetPlat.right - margin, targetX));

                                    b.direction = targetX >= b.x ? 1 : -1;
                                    b.facing = b.direction > 0 ? 2 : 3;

                                    const diffY = plat.top - targetPlat.top;
                                    b.hopTargetX = targetX;
                                    b.hopTargetY = targetPlat.top;
                                    b.targetPlatformId = targetPlat.id;

                                    const absDiffY = Math.abs(diffY);
                                    b.hopArcPeak = Math.max((activeCfg.largeHopHeight ?? 45) * b.hopHeightMod, absDiffY * 0.45 + 14);
                                    b.currentHopDuration = (0.22 / Math.max(0.1, overallFleeSpeed * b.fleeSpeedMod)) * Math.sqrt(b.hopArcPeak / 10);
                                } else if (chosen.type === "drop") {
                                    b.isHopping = false;
                                    b.isFalling = true;
                                    b.fallVelocity = 35;
                                    b.fallingFromPlatformId = plat.id;
                                    b.fallStartY = plat.top;
                                    b.direction = fleeDir;
                                    b.facing = fleeDir > 0 ? 2 : 3;
                                    b.x += fleeDir * 8; // Nudge past ledge into air
                                    continue;
                                }
                            }
                        }

                        // FALLBACK: Horizontal Platform Jump (Only if no vertical escape options were available)
                        if (!didChooseVerticalEscape) {
                            const minX = plat.isGround ? boundaryMargin : plat.left + 6;
                            const maxX = plat.isGround ? pageWidth - boundaryMargin : plat.right - 6;

                            // Check if trapped against the boundary
                            const isCornered = (fleeDir === 1 && b.x >= maxX - 10) || (fleeDir === -1 && b.x <= minX + 10);

                            if (isCornered) {
                                // Trapped at edge with no vertical platforms available
                                if (distToCursor < 90) {
                                    // Desperation leap over the cursor
                                    b.direction = (fleeDir === 1 ? -1 : 1) as 1 | -1;
                                    b.facing = b.direction > 0 ? 2 : 3;
                                    b.currentHopHeight = (activeCfg.largeHopHeight ?? 45) * b.hopHeightMod * 1.5;
                                    b.currentHopDistance = Math.min(plat.width * 0.7, (activeCfg.largeHopDistance ?? 60) * b.hopDistMod * 1.5);
                                    b.hopArcPeak = b.currentHopHeight;
                                    b.currentHopDuration = (0.26 / Math.max(0.1, overallFleeSpeed * b.fleeSpeedMod));
                                    b.hopTargetX = Math.max(minX, Math.min(maxX, b.x + b.direction * b.currentHopDistance));
                                    b.hopTargetY = plat.top;
                                    b.targetPlatformId = plat.id;
                                } else {
                                    // Face away, stay rooted to avoid rapid flipping
                                    b.direction = fleeDir;
                                    b.facing = fleeDir > 0 ? 2 : 3;
                                    b.isHopping = false;
                                    b.squashTimer = 0.12;
                                    b.fleeIdleTimer = 0.1;
                                    continue;
                                }
                            } else {
                                // Standard horizontal flee hop away from cursor
                                b.direction = fleeDir;
                                b.facing = fleeDir > 0 ? 2 : 3;

                                const hopJitter = 1.0 + (Math.random() * 2 - 1) * (activeCfg.personalityVariance * 0.25);
                                b.currentHopHeight = Math.max(4, (activeCfg.largeHopHeight ?? 45) * b.hopHeightMod * hopJitter);
                                b.currentHopDistance = Math.max(6, (activeCfg.largeHopDistance ?? 60) * b.hopDistMod * hopJitter);
                                b.hopArcPeak = b.currentHopHeight;
                                b.currentHopDuration = (0.22 / Math.max(0.1, overallFleeSpeed * b.fleeSpeedMod)) * Math.sqrt(b.currentHopHeight / Math.max(1, activeCfg.largeHopHeight ?? 45));

                                b.hopTargetX = Math.max(minX, Math.min(maxX, b.x + b.direction * b.currentHopDistance));
                                b.hopTargetY = plat.top;
                                b.targetPlatformId = plat.id;
                            }
                        }
                    } else {
                        // NORMAL WANDERING HOP
                        let didChooseJumpUp = false;

                        // 1. Check Jump Up to overhead platform, Jump Down to lower platform, or Jump Across to adjacent platform
                        if (activeCfg.enablePlatforms) {
                            const maxReachY = activeCfg.platformJumpReachY ?? 140;
                            const maxReachX = activeCfg.platformJumpReachX ?? 40;
                            const upCandidates: PlatformSurface[] = [];
                            const downCandidates: PlatformSurface[] = [];
                            const acrossCandidates: PlatformSurface[] = [];

                            for (let j = 0; j < platforms.length; j++) {
                                const q = platforms[j];
                                if (q.id === plat.id) continue;
                                const diffY = plat.top - q.top; // Positive = overhead, Negative = lower platform

                                // Overhead platform (Jump up)
                                if (diffY >= 14 && diffY <= maxReachY && q.top >= 20 && q.top <= pageHeight - 10) {
                                    const distToQ = b.x < q.left ? q.left - b.x : (b.x > q.right ? b.x - q.right : 0);
                                    if (distToQ <= maxReachX) {
                                        upCandidates.push(q);
                                    }
                                }
                                // Lower platform (Jump down)
                                else if (diffY <= -14 && diffY >= -maxReachY && !plat.isGround) {
                                    const distToQ = b.x < q.left ? q.left - b.x : (b.x > q.right ? b.x - q.right : 0);
                                    if (distToQ <= maxReachX) {
                                        downCandidates.push(q);
                                    }
                                }
                                // Adjacent platform at similar level (Jump across)
                                else if (Math.abs(diffY) <= 24) {
                                    if (b.direction === 1 && q.left >= plat.right - 10 && q.left <= plat.right + maxReachX) {
                                        acrossCandidates.push(q);
                                    } else if (b.direction === -1 && q.right <= plat.left + 10 && q.right >= plat.left - maxReachX) {
                                        acrossCandidates.push(q);
                                    }
                                }
                            }

                            const jumpChance = (activeCfg.platformJumpChance ?? 0.3) * b.hopChanceMod;
                            const dropChance = (activeCfg.platformDropChance ?? 0.35) * (1 / Math.max(0.5, b.wanderPatience));

                            // Overhead jump attempt
                            if (upCandidates.length > 0 && Math.random() < jumpChance * 0.5) {
                                const targetPlat = upCandidates[Math.floor(Math.random() * upCandidates.length)];
                                didChooseJumpUp = true;

                                const margin = Math.min(14, targetPlat.width * 0.25);
                                const targetX = Math.max(targetPlat.left + margin, Math.min(targetPlat.right - margin, b.x + (Math.random() - 0.5) * 40));

                                b.direction = targetX >= b.x ? 1 : -1;
                                b.facing = b.direction > 0 ? 2 : 3;

                                const diffY = plat.top - targetPlat.top;
                                b.hopTargetX = targetX;
                                b.hopTargetY = targetPlat.top;
                                b.targetPlatformId = targetPlat.id;
                                b.hopArcPeak = Math.max(activeCfg.smallHopHeight * b.hopHeightMod, diffY * 0.45 + 12);
                                b.currentHopDuration = (0.36 / Math.max(0.1, overallSpeed * b.speedMod)) * Math.sqrt(b.hopArcPeak / 10);
                            }

                            // Jump Down to lower platform attempt
                            if (!didChooseJumpUp && downCandidates.length > 0 && Math.random() < dropChance * 0.6) {
                                const targetPlat = downCandidates[Math.floor(Math.random() * downCandidates.length)];
                                didChooseJumpUp = true;

                                const margin = Math.min(12, targetPlat.width * 0.25);
                                const targetX = Math.max(targetPlat.left + margin, Math.min(targetPlat.right - margin, b.x + (Math.random() - 0.5) * 30));

                                b.direction = targetX >= b.x ? 1 : -1;
                                b.facing = b.direction > 0 ? 2 : 3;

                                const distY = targetPlat.top - plat.top;
                                b.hopTargetX = targetX;
                                b.hopTargetY = targetPlat.top;
                                b.targetPlatformId = targetPlat.id;
                                b.hopArcPeak = Math.max(3, activeCfg.smallHopHeight * b.hopHeightMod);
                                b.currentHopDuration = (0.32 / Math.max(0.1, overallSpeed * b.speedMod)) * Math.sqrt(distY / 40 + 1);
                            }

                            // Adjacent word/platform jump across attempt (small hop between neighboring words)
                            if (!didChooseJumpUp && acrossCandidates.length > 0 && Math.random() < 0.6) {
                                const targetPlat = acrossCandidates[0];
                                didChooseJumpUp = true;

                                const margin = Math.min(10, targetPlat.width * 0.2);
                                const targetX = b.direction === 1 ? targetPlat.left + margin : targetPlat.right - margin;

                                b.hopTargetX = targetX;
                                b.hopTargetY = targetPlat.top;
                                b.targetPlatformId = targetPlat.id;
                                b.hopArcPeak = Math.max(3, activeCfg.smallHopHeight * b.hopHeightMod);
                                b.currentHopDuration = (0.28 / Math.max(0.1, overallSpeed * b.speedMod));
                            }
                        }

                        if (!didChooseJumpUp) {
                            // 2. Normal hop on current platform or ledge drop
                            const ledgeMargin = Math.min(14, plat.width * 0.45);
                            const isAtLeftLedge = b.x <= plat.left + ledgeMargin && b.direction === -1;
                            const isAtRightLedge = b.x >= plat.right - ledgeMargin && b.direction === 1;

                            if (!plat.isGround && (isAtLeftLedge || isAtRightLedge)) {
                                const dropChance = (activeCfg.platformDropChance ?? 0.35) * (1 / Math.max(0.5, b.wanderPatience));
                                if (Math.random() < dropChance) {
                                    b.isHopping = false;
                                    b.isFalling = true;
                                    b.fallVelocity = 25;
                                    b.fallingFromPlatformId = plat.id;
                                    b.fallStartY = plat.top;
                                    b.x += b.direction * 6;
                                    continue;
                                } else {
                                    b.direction = (b.direction === 1 ? -1 : 1) as 1 | -1;
                                    b.facing = b.direction > 0 ? 2 : 3;
                                }
                            } else if (plat.isGround) {
                                if (b.x <= boundaryMargin + 20) {
                                    b.direction = 1;
                                    b.facing = 2;
                                } else if (b.x >= pageWidth - boundaryMargin - 20) {
                                    b.direction = -1;
                                    b.facing = 3;
                                } else {
                                    const baseTurnChance = activeCfg.turnChance ?? 0.2;
                                    const effectiveTurnChance = Math.min(0.95, Math.max(0.02, baseTurnChance * b.turnChanceMod));
                                    if (Math.random() < effectiveTurnChance) {
                                        b.direction = (b.direction === 1 ? -1 : 1) as 1 | -1;
                                        b.facing = b.direction > 0 ? 2 : 3;
                                    }
                                }
                            } else {
                                const baseTurnChance = activeCfg.turnChance ?? 0.2;
                                const effectiveTurnChance = Math.min(0.95, Math.max(0.02, baseTurnChance * b.turnChanceMod));
                                if (Math.random() < effectiveTurnChance) {
                                    b.direction = (b.direction === 1 ? -1 : 1) as 1 | -1;
                                    b.facing = b.direction > 0 ? 2 : 3;
                                }
                            }

                            const hopJitter = 1.0 + (Math.random() * 2 - 1) * (activeCfg.personalityVariance * 0.25);
                            b.currentHopHeight = Math.max(2, activeCfg.smallHopHeight * b.hopHeightMod * hopJitter);
                            b.currentHopDistance = Math.max(4, activeCfg.smallHopDistance * b.hopDistMod * hopJitter);
                            b.hopArcPeak = b.currentHopHeight;
                            b.currentHopDuration = (0.32 / Math.max(0.1, overallSpeed * b.speedMod)) * Math.sqrt(b.currentHopHeight / Math.max(1, activeCfg.smallHopHeight));

                            const minX = plat.isGround ? boundaryMargin : plat.left + 6;
                            const maxX = plat.isGround ? pageWidth - boundaryMargin : plat.right - 6;

                            b.hopTargetX = Math.max(minX, Math.min(maxX, b.x + b.direction * b.currentHopDistance));
                            b.hopTargetY = plat.top;
                            b.targetPlatformId = plat.id;
                        }
                    }
                }
            }

            // ================================================================
            // RENDERING (Camera projection via scroll offset)
            // ================================================================
            ctx.save();
            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, screenWidth, screenHeight);

            // Optional debug visualization of detected platform surfaces
            if (activeCfg.showPlatforms) {
                ctx.save();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "rgba(16, 185, 129, 0.75)";
                ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
                for (let j = 0; j < platforms.length; j++) {
                    const p = platforms[j];
                    const py = p.top - scrollY;
                    const px = p.left - scrollX;
                    if (py >= -20 && py <= screenHeight + 20) {
                        ctx.fillRect(px, py, p.width, 3);
                        ctx.strokeRect(px, py, p.width, 3);
                    }
                }
                ctx.restore();
            }

            // Optional ground line axis
            if (activeCfg.showGroundLine) {
                const screenGroundY = groundYBaseline - scrollY;
                if (screenGroundY >= -10 && screenGroundY <= screenHeight + 10) {
                    ctx.save();
                    ctx.strokeStyle =
                        activeCfg.groundLineColor ||
                        (isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.1)");
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(0, Math.round(screenGroundY) + 0.5);
                    ctx.lineTo(screenWidth, Math.round(screenGroundY) + 0.5);
                    ctx.stroke();
                    ctx.restore();
                }
            }

            ctx.imageSmoothingEnabled = false;

            // Render each sprite in constant Z-index order
            for (let i = 0; i < boids.length; i++) {
                const b = boids[i];
                const screenX = b.x - scrollX;
                const screenY = b.y - scrollY;

                const breedSprites = catSprites[b.catType % catSprites.length];
                if (!breedSprites) continue;
                const sprite = breedSprites[b.facing % breedSprites.length];
                if (!sprite) continue;

                const renderW = Math.round(sprite.width * (baseSize / 20));
                const renderH = Math.round(sprite.height * (baseSize / 20));

                // Off-screen culling: skip drawing sprites outside the visible camera view
                if (
                    screenX < -renderW ||
                    screenX > screenWidth + renderW ||
                    screenY < -renderH ||
                    screenY > screenHeight + renderH
                ) {
                    continue;
                }

                // Squash and stretch calculations
                let scaleX = 1.0;
                let scaleY = 1.0;

                if (b.squashTimer > 0) {
                    // Landing squash
                    const squashRatio = b.squashTimer / 0.08;
                    scaleX = 1.0 + 0.16 * squashRatio;
                    scaleY = 1.0 - 0.16 * squashRatio;
                    b.squashTimer -= dt;
                } else if (b.isHopping) {
                    const p = b.hopProgress;
                    if (p < 0.25) {
                        scaleX = 0.94;
                        scaleY = 1.07;
                    } else if (p > 0.75) {
                        scaleX = 1.03;
                        scaleY = 0.97;
                    }
                } else if (b.isFalling) {
                    scaleX = 0.92;
                    scaleY = 1.10; // Streamline elongation during freefall drop
                }

                // Draw Sprite rooted to feet contact point
                ctx.save();
                ctx.translate(screenX, screenY);
                ctx.scale(scaleX, scaleY);
                ctx.drawImage(sprite, -renderW * 0.5, -renderH, renderW, renderH);
                ctx.restore();
            }

            ctx.restore();

            rafId = requestAnimationFrame(render);
        };

        rafId = requestAnimationFrame(render);

        return () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
            if (spawnTimer !== null) clearTimeout(spawnTimer);
            clearTimeout(scanTimer1);
            clearTimeout(scanTimer2);
            clearTimeout(scanTimer3);
            observer.disconnect();
            if (resizeObserver) resizeObserver.disconnect();
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
        ...(enablePlatforms !== undefined ? { enablePlatforms } : {}),
        ...(platformSelector !== undefined ? { platformSelector } : {}),
        ...(platformExcludeSelector !== undefined ? { platformExcludeSelector } : {}),
        ...(platformJumpReachY !== undefined ? { platformJumpReachY } : {}),
        ...(platformJumpReachX !== undefined ? { platformJumpReachX } : {}),
        ...(platformJumpChance !== undefined ? { platformJumpChance } : {}),
        ...(platformDropChance !== undefined ? { platformDropChance } : {}),
        ...(zIndex !== undefined ? { zIndex } : {}),
        ...(showPlatforms !== undefined ? { showPlatforms } : {}),
        ...(spawnDelay !== undefined ? { spawnDelay } : {}),
    };

    return (
        <div
            aria-hidden="true"
            className={`fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden transition-opacity duration-700 ease-out ${isLoaded ? "opacity-100" : "opacity-0"
                } ${className || ""}`}
            style={{ zIndex: activeCfg.zIndex ?? 20 }}
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
