import { useEffect, useMemo, useRef } from "react";

// ============================================================================
// CONFIGURATION PARAMETERS (SPRITE LINE WALLPAPER)
// Sprites sit on walkable platforms and the ground line axis, wandering with cute hops,
// and take larger escape hops away from the cursor when hovered.
// ============================================================================

export type SpawnType = "fall" | "fade" | "appear";

export interface SpriteLineConfig {
    /** Visual size of the sprite in pixels (default: 10) */
    spriteSize: number;

    /** Small hop vertical height in pixels during normal wandering (default: 8) */
    smallHopHeight: number;
    /** Small hop horizontal distance in pixels during normal wandering (default: 16) */
    smallHopDistance: number;

    /** Large hop vertical height in pixels when fleeing cursor (default: 22) */
    largeHopHeight: number;
    /** Large hop horizontal distance in pixels when fleeing cursor (default: 50) */
    largeHopDistance: number;

    /** Overall movement and hopping speed multiplier (default: 2) */
    speed: number;

    /** Hopping speed multiplier when fleeing from cursor (default: 1) */
    fleeSpeed: number;

    /**
     * Likelihood / probability (0.0 to 1.0) of hopping during normal wandering (default: 0.3).
     * Influenced by individual sprite personality variance (does not apply to fleeing).
     */
    hopChance?: number;

    /**
     * Probability (0.0 to 1.0) of reversing direction when starting a wandering hop (default: 0.2).
     * Controls how likely sprites are to turn around during wandering (not applied to fleeing).
     */
    turnChance?: number;

    /**
     * Personality variance between individual sprites (0.0 to 1.0, default: 0.3).
     * Controls individual variance in wandering speed, flee speed, hop size/length,
     * hop frequency, direction change likelihood, sensitivity to cursor, and idle patience.
     */
    personalityVariance: number;

    /** Number of sprites along the ground line (default: 6) */
    spriteCount?: number;

    /**
     * Ground line Y position in pixels or fraction of screen height (0.0 to 1.0).
     * If undefined, calculated using groundOffsetFromBottom.
     */
    groundY?: number;

    /** Distance in pixels from bottom of viewport to ground line (default: 70) */
    groundOffsetFromBottom?: number;

    /** Distance from cursor in pixels that triggers fleeing behavior (default: 50) */
    cursorFleeRadius?: number;

    /** Whether to draw a subtle horizontal ground line axis (default: false) */
    showGroundLine?: boolean;
    /** Stroke color for the ground line axis */
    groundLineColor?: string;

    /** Path to sprite sheet image (default: "/sprites/sprites.png") */
    spriteSheetSrc?: string;
    /** Number of horizontal columns in sprite sheet (default: 6) */
    spriteSheetCols?: number;

    // Platform Navigation Parameters
    /** Whether sprites treat DOM elements as walkable/jumpable platforms (default: true) */
    enablePlatforms?: boolean;
    /** CSS selector for DOM elements to treat as platforms */
    platformSelector?: string;
    /** CSS selector for elements to exclude from being platforms (default: "nav, header, [data-no-sprite-platform]") */
    platformExcludeSelector?: string;
    /** Maximum vertical reach in pixels a sprite can leap up to reach an overhead platform (default: 200) */
    platformJumpReachY?: number;
    /** Maximum horizontal reach in pixels a sprite can leap across to reach a nearby platform or adjacent word (default: 20) */
    platformJumpReachX?: number;
    /** Probability (0.0 to 1.0) of attempting a jump when an overhead platform is detected (default: 0.15) */
    platformJumpChance?: number;
    /** Probability (0.0 to 1.0) of hopping off a ledge and dropping down instead of turning around (default: 0.15) */
    platformDropChance?: number;
    /** Probability (0.0 to 1.0) of performing a lateral platform shift when at the edge of a platform with an adjacent platform available (default: 0.5) */
    platformShiftChance?: number;
    /** Canvas container z-index. Set to 20 for sprites to walk on top of text/cards (default: 20) */
    zIndex?: number;
    /** Optional visual outline of detected platform surfaces for inspection (default: false) */
    showPlatforms?: boolean;
    /** Delay in milliseconds before spawning sprites to allow page entrance animations to complete (default: 1500) */
    spawnDelay?: number;
    /** Vertical offset applied to platform surfaces relative to element bounds. "auto" aligns to visible text/chips (default: "auto") */
    platformTopOffset?: number | "auto";
    /** Spawning visual behavior: "fall" (sky drop with squash), "fade" (smooth opacity transition), "appear" (instant) (default: "fall") */
    spawnType?: SpawnType;
    /** Whether to register the document bottom ground line as an available platform (default: true) */
    enableGroundPlatform?: boolean;
    /** Whether sprites can drop/fall off platform edges (default: true). Set to false to confine sprites strictly to their platform */
    enableLedgeDrop?: boolean;
    /** Specific sprite index or array of sprite indices (0 to spriteSheetCols - 1) to use for spawned sprites, or "random" (optional) */
    spriteIndices?: number | number[] | "random";
    /** Alias for spriteIndices */
    selectedSprites?: number | number[] | "random";
    /** If true, randomly selects sprite breeds/palettes for each spawned instance (default: false) */
    randomizeSprites?: boolean;
}

const SPRITE_LINE_DEFAULT_CONFIG: SpriteLineConfig = {
    spriteSize: 10,
    smallHopHeight: 8,
    smallHopDistance: 16,
    largeHopHeight: 22,
    largeHopDistance: 50,
    speed: 2,
    fleeSpeed: 1.5,
    hopChance: 0.3,
    turnChance: 0.2,
    personalityVariance: 0.3,

    spriteCount: 6,
    groundOffsetFromBottom: 70,
    cursorFleeRadius: 60,

    showGroundLine: true,
    groundLineColor: "rgba(128, 128, 128, 0.2)",

    spriteSheetSrc: "/sprites/sprites.png",
    spriteSheetCols: 6,

    enablePlatforms: true,
    platformSelector: "[data-sprite-platform], .feature > div, .chip-group, [role=button] > .title",
    platformExcludeSelector: "nav, header, [data-no-sprite-platform]",
    platformJumpReachY: 200,
    platformJumpReachX: 20,
    platformJumpChance: 0.15,
    platformDropChance: 0.15,
    platformShiftChance: 0.5,
    zIndex: 20,
    showPlatforms: false,
    spawnDelay: 1500,
    platformTopOffset: "auto",
    spawnType: "fall",
    enableGroundPlatform: true,
    enableLedgeDrop: true,
    randomizeSprites: false,
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
    spriteCount?: number;
    groundY?: number;
    groundOffsetFromBottom?: number;
    cursorFleeRadius?: number;
    showGroundLine?: boolean;
    groundLineColor?: string;
    spriteSheetSrc?: string;
    spriteSheetCols?: number;
    enablePlatforms?: boolean;
    platformSelector?: string;
    platformExcludeSelector?: string;
    platformJumpReachY?: number;
    platformJumpReachX?: number;
    platformJumpChance?: number;
    platformDropChance?: number;
    platformShiftChance?: number;
    zIndex?: number;
    showPlatforms?: boolean;
    spawnDelay?: number;
    /** Vertical offset applied to platform surfaces relative to element bounds. "auto" aligns to visible text/chips (default: "auto") */
    platformTopOffset?: number | "auto";
    /** Spawning visual behavior: "fall" (sky drop with squash), "fade" (smooth opacity transition), "appear" (instant) (default: "fall") */
    spawnType?: SpawnType;
    /** Whether to register the document bottom ground line as an available platform (default: true) */
    enableGroundPlatform?: boolean;
    /** Whether sprites can drop/fall off platform edges (default: true). Set to false to confine sprites strictly to their platform */
    enableLedgeDrop?: boolean;
    /** Specific sprite index or array of sprite indices (0 to spriteSheetCols - 1) to use for spawned sprites, or "random" (optional) */
    spriteIndices?: number | number[] | "random";
    /** Alias for spriteIndices */
    selectedSprites?: number | number[] | "random";
    /** If true, randomly selects sprite breeds/palettes for each spawned instance (default: false) */
    randomizeSprites?: boolean;
}

// ============================================================================
// SPRITE PIXEL ART & PROCEDURAL GENERATOR
// ============================================================================

/** 2 discrete lateral facing directions: 0 = Right, 1 = Left */
export type CatFacing = 0 | 1;
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
];

const CAT_SIDE_LEFT_SPRITE: string[] = CAT_SIDE_SPRITE.map((row) =>
    row.split("").reverse().join("")
);

/** Generates procedural cat stamps for Right (0) and Left (1) directions */
function generateCatSprites(palettes: CatPalette[]): HTMLCanvasElement[][] {
    const rawSprites = [
        CAT_SIDE_SPRITE,      // 0: Right
        CAT_SIDE_LEFT_SPRITE, // 1: Left
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
        };

        const breedResult: HTMLCanvasElement[] = [];

        for (let f = 0; f < 2; f++) {
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

/** Slices a horizontal sprite sheet into Right (0) and mirrored Left (1) stamps */
function sliceSpriteSheet(
    image: HTMLImageElement,
    cols: number
): HTMLCanvasElement[][] {
    if (!image.naturalWidth || !image.naturalHeight || cols <= 0) {
        return [];
    }

    const frameW = Math.floor(image.naturalWidth / cols);
    const frameH = image.naturalHeight;
    const allBreedsResult: HTMLCanvasElement[][] = [];

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
            rCtx.drawImage(image, sx, sy, frameW, frameH, 0, 0, frameW, frameH);
        }

        // 2. Left-facing stamp (mirrored horizontally)
        const leftCvs = document.createElement("canvas");
        leftCvs.width = frameW;
        leftCvs.height = frameH;
        const lCtx = leftCvs.getContext("2d");
        if (lCtx) {
            lCtx.imageSmoothingEnabled = false;
            lCtx.save();
            lCtx.translate(frameW, 0);
            lCtx.scale(-1, 1);
            lCtx.drawImage(image, sx, sy, frameW, frameH, 0, 0, frameW, frameH);
            lCtx.restore();
        }

        // [0: Right, 1: Left]
        allBreedsResult.push([rightCvs, leftCvs]);
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

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
    return a;
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
    excludeSelector?: string,
    platformTopOffset: number | "auto" = "auto",
    enableGroundPlatform: boolean = true
): PlatformSurface[] {
    const surfaces: PlatformSurface[] = [];
    const scrollX = window.scrollX || window.pageXOffset || 0;
    const scrollY = window.scrollY || window.pageYOffset || 0;

    // Include the document ground line as platform 0 if enabled
    if (enableGroundPlatform) {
        surfaces.push({
            id: "ground",
            left: 0,
            right: pageWidth,
            top: groundYBaseline,
            width: pageWidth,
            isGround: true,
        });
    }

    try {
        const elements = document.querySelectorAll<HTMLElement>(selector);
        const seenIds = new Set<string>(enableGroundPlatform ? ["ground"] : []);

        const pushSurface = (
            idSuffix: string,
            r: DOMRect | { left: number; right: number; top: number; width: number; height: number },
            computedOffset: number
        ) => {
            if (r.width < 24 || r.height < 1) return;
            let finalId = idSuffix;
            if (seenIds.has(finalId)) {
                finalId = `${idSuffix}_${++globalPlatformCounter}`;
            }
            seenIds.add(finalId);
            const rOffset = Math.min(r.height * 0.55, Math.max(0, computedOffset));
            surfaces.push({
                id: finalId,
                left: r.left + scrollX,
                right: r.right + scrollX,
                top: r.top + scrollY + rOffset,
                width: r.width,
            });
        };

        elements.forEach((el) => {
            if (el.offsetParent === null && el.offsetWidth === 0 && el.offsetHeight === 0) return;
            const style = window.getComputedStyle(el);
            if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) < 0.05 || style.position === "fixed") {
                return;
            }

            if (excludeSelector) {
                try {
                    if (el.matches(excludeSelector) || el.closest(excludeSelector)) return;
                } catch {
                    // Ignore selector parse errors
                }
            }

            let platId = platformElementWeakMap.get(el);
            if (!platId) {
                platId = `plat_${++globalPlatformCounter}`;
                platformElementWeakMap.set(el, platId);
            }

            const isTextElement = /^(H[1-6]|P|SPAN|A|DIV|LABEL|LI)$/i.test(el.tagName) && el.children.length === 0;

            let computedOffset = 0;
            if (platformTopOffset === "auto") {
                const paddingTop = parseFloat(style.paddingTop) || 0;
                const borderTop = parseFloat(style.borderTopWidth) || 0;

                if (isTextElement) {
                    const fontSize = parseFloat(style.fontSize) || 16;
                    const lineHeight = parseFloat(style.lineHeight) || (fontSize * 1.2);
                    const halfLeading = Math.max(0, (lineHeight - fontSize) * 0.5);
                    const capGap = fontSize * 0.16;
                    computedOffset = paddingTop + borderTop + halfLeading + capGap;
                } else if (el.firstElementChild) {
                    const childRect = el.firstElementChild.getBoundingClientRect();
                    const childDiff = childRect.top - el.getBoundingClientRect().top;
                    computedOffset = childDiff > 0 ? childDiff : (paddingTop + borderTop);
                } else {
                    computedOffset = paddingTop + borderTop;
                }
            } else if (typeof platformTopOffset === "number") {
                computedOffset = platformTopOffset;
            }

            const rects = isTextElement && typeof el.getClientRects === "function" ? el.getClientRects() : null;

            if (rects && rects.length > 1) {
                for (let i = 0; i < rects.length; i++) {
                    pushSurface(`${platId}_${i}`, rects[i], computedOffset);
                }
            } else {
                pushSurface(platId, el.getBoundingClientRect(), computedOffset);
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
    spawnTargetPlatformId?: string; // If set, sprite is in initial spawn fall directly targeting this platform
    spawnFadeProgress?: number; // 0.0 to 1.0 for "fade" spawnType

    // Personality Variance Traits
    catType: CatType;
    speedMod: number;
    fleeSpeedMod: number;
    hopChanceMod: number;
    turnChanceMod: number;
    sensitivity: number;
    hopHeightMod: number;
    hopDistMod: number;
    wanderPatience: number;
}

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
    spriteCount,
    groundY,
    groundOffsetFromBottom,
    cursorFleeRadius,
    showGroundLine,
    groundLineColor,
    spriteSheetSrc,
    spriteSheetCols,
    enablePlatforms,
    platformSelector,
    platformExcludeSelector,
    platformJumpReachY,
    platformJumpReachX,
    platformJumpChance,
    platformDropChance,
    platformShiftChance,
    zIndex,
    showPlatforms,
    spawnDelay,
    platformTopOffset,
    spawnType,
    enableGroundPlatform,
    enableLedgeDrop,
    spriteIndices,
    selectedSprites,
    randomizeSprites,
}: SpriteLineWallpaperProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Merge configuration from props and config object once with useMemo
    const activeCfg = useMemo<SpriteLineConfig>(() => ({
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
        ...(spriteCount !== undefined ? { spriteCount } : {}),
        ...(groundOffsetFromBottom !== undefined ? { groundOffsetFromBottom } : {}),
        ...(groundY !== undefined ? { groundY } : {}),
        ...(cursorFleeRadius !== undefined ? { cursorFleeRadius } : {}),
        ...(showGroundLine !== undefined ? { showGroundLine } : {}),
        ...(groundLineColor !== undefined ? { groundLineColor } : {}),
        ...(spriteSheetSrc !== undefined ? { spriteSheetSrc } : {}),
        ...(spriteSheetCols !== undefined ? { spriteSheetCols } : {}),
        ...(enablePlatforms !== undefined ? { enablePlatforms } : {}),
        ...(platformSelector !== undefined ? { platformSelector } : {}),
        ...(platformExcludeSelector !== undefined ? { platformExcludeSelector } : {}),
        ...(platformJumpReachY !== undefined ? { platformJumpReachY } : {}),
        ...(platformJumpReachX !== undefined ? { platformJumpReachX } : {}),
        ...(platformJumpChance !== undefined ? { platformJumpChance } : {}),
        ...(platformDropChance !== undefined ? { platformDropChance } : {}),
        ...(platformShiftChance !== undefined ? { platformShiftChance } : {}),
        ...(zIndex !== undefined ? { zIndex } : {}),
        ...(showPlatforms !== undefined ? { showPlatforms } : {}),
        ...(spawnDelay !== undefined ? { spawnDelay } : {}),
        ...(platformTopOffset !== undefined ? { platformTopOffset } : {}),
        ...(spawnType !== undefined ? { spawnType } : {}),
        ...(enableGroundPlatform !== undefined ? { enableGroundPlatform } : {}),
        ...(enableLedgeDrop !== undefined ? { enableLedgeDrop } : {}),
        ...(spriteIndices !== undefined ? { spriteIndices } : {}),
        ...(selectedSprites !== undefined ? { selectedSprites } : {}),
        ...(randomizeSprites !== undefined ? { randomizeSprites } : {}),
    }), [
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
        spriteCount,
        groundOffsetFromBottom,
        groundY,
        cursorFleeRadius,
        showGroundLine,
        groundLineColor,
        spriteSheetSrc,
        spriteSheetCols,
        enablePlatforms,
        platformSelector,
        platformExcludeSelector,
        platformJumpReachY,
        platformJumpReachX,
        platformJumpChance,
        platformDropChance,
        platformShiftChance,
        zIndex,
        showPlatforms,
        spawnDelay,
        platformTopOffset,
        spawnType,
        enableGroundPlatform,
        enableLedgeDrop,
        spriteIndices,
        selectedSprites,
        randomizeSprites,
    ]);

    const cfgRef = useRef<SpriteLineConfig>(activeCfg);
    useEffect(() => {
        cfgRef.current = activeCfg;
    }, [activeCfg]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let screenWidth = window.innerWidth;
        let screenHeight = window.innerHeight;

        // Theme and Motion preferences
        const mediaDark = window.matchMedia("(prefers-color-scheme: dark)");
        const mediaReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

        let isDark = mediaDark.matches;
        let isReduced = mediaReduced.matches;

        let catSprites: HTMLCanvasElement[][] = generateCatSprites(
            isDark ? CAT_DARK_PALETTES : CAT_LIGHT_PALETTES
        );

        const handleReduced = (e: MediaQueryListEvent) => {
            isReduced = e.matches;
        };
        mediaReduced.addEventListener("change", handleReduced);

        // Preload external sprite sheet
        let sheetStamps: HTMLCanvasElement[][] | null = null;
        if (activeCfg.spriteSheetSrc) {
            const sheetImg = new Image();
            sheetImg.src = activeCfg.spriteSheetSrc;
            sheetImg.onload = () => {
                const sliced = sliceSpriteSheet(
                    sheetImg,
                    activeCfg.spriteSheetCols || 6
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

        // Cached document dimensions to avoid synchronous reflows at 60fps
        let docDimensions = getDocumentDimensions();

        const computeGroundY = (pageH: number) => {
            const cfg = cfgRef.current;
            if (cfg.groundY !== undefined) {
                return cfg.groundY <= 1.0 ? pageH * cfg.groundY : cfg.groundY;
            }
            return pageH - (cfg.groundOffsetFromBottom ?? 70);
        };

        const distributeBoidsToPlatforms = (boidsList: LineBoid[]) => {
            if (platforms.length === 0 || boidsList.length === 0) return;
            const nonGround = platforms.filter((p) => !p.isGround);
            const ground = platforms.find((p) => p.isGround);

            const { pageWidth, pageHeight } = docDimensions;
            const cfg = cfgRef.current;
            const spawnType = cfg.spawnType ?? "fall";
            const baseSize = cfg.spriteSize;
            const estimatedHalfW = Math.max(16, (baseSize * 1.2) * 0.5);
            const boundaryMargin = estimatedHalfW + 12;
            const currentScrollY = window.scrollY || window.pageYOffset || 0;

            if (nonGround.length === 0) {
                if (!ground || cfg.enableGroundPlatform === false) {
                    return;
                }
                // All boids to ground with even horizontal distribution
                const groundTop = ground ? ground.top : computeGroundY(pageHeight);
                for (let i = 0; i < boidsList.length; i++) {
                    const b = boidsList[i];
                    const minX = boundaryMargin + 20;
                    const maxX = pageWidth - boundaryMargin - 20;
                    const step = Math.max(1, (maxX - minX) / Math.max(1, boidsList.length));
                    const spawnX = minX + (i + 0.2 + Math.random() * 0.6) * step;
                    const dropStartY = Math.min(groundTop - 120, currentScrollY - 30) - (i * 20 + Math.random() * 30);

                    b.x = spawnX;
                    b.hopStartX = spawnX;
                    b.hopStartY = groundTop;
                    b.hopTargetX = spawnX;
                    b.hopTargetY = groundTop;
                    b.hopY = 0;
                    b.currentPlatformId = "ground";
                    b.targetPlatformId = "ground";
                    b.isHopping = false;
                    b.direction = Math.random() < 0.5 ? 1 : -1;
                    b.recoveryTimer = 0;

                    if (spawnType === "fade") {
                        b.y = groundTop;
                        b.isFalling = false;
                        b.spawnFadeProgress = 0;
                    } else if (spawnType === "appear") {
                        b.y = groundTop;
                        b.isFalling = false;
                        b.spawnFadeProgress = 1;
                    } else {
                        b.y = dropStartY;
                        b.isFalling = true;
                        b.fallVelocity = 60 + Math.random() * 80;
                        b.spawnTargetPlatformId = "ground";
                        b.fallingFromPlatformId = undefined;
                        b.fallStartY = dropStartY;
                        b.spawnFadeProgress = 1;
                    }
                }
                return;
            }

            // Sort elevated platforms by vertical position (top to bottom)
            const sortedElevated = [...nonGround].sort((a, b) => a.top - b.top);

            // Reserve at least 1 sprite for the ground line if multiple sprites AND ground platform enabled
            const groundSpriteIndex = (boidsList.length > 2 && ground && cfg.enableGroundPlatform !== false) ? 0 : -1;

            const elevatedSpriteIndices = boidsList
                .map((_, idx) => idx)
                .filter((idx) => idx !== groundSpriteIndex);

            // Shuffle elevated sprite indices so breed/personality doesn't correlate with vertical height
            const shuffledElevatedSpriteIndices = shuffleArray(elevatedSpriteIndices);
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
                const dropStartY = Math.min(targetPlat.top - 120, currentScrollY - 30) - (k * 20 + Math.random() * 30);

                b.x = spawnX;
                b.hopStartX = spawnX;
                b.hopStartY = targetPlat.top;
                b.hopTargetX = spawnX;
                b.hopTargetY = targetPlat.top;
                b.hopY = 0;
                b.currentPlatformId = targetPlat.id;
                b.targetPlatformId = targetPlat.id;
                b.isHopping = false;
                b.direction = Math.random() < 0.5 ? 1 : -1;
                b.recoveryTimer = 0;

                if (spawnType === "fade") {
                    b.y = targetPlat.top;
                    b.isFalling = false;
                    b.spawnFadeProgress = 0;
                } else if (spawnType === "appear") {
                    b.y = targetPlat.top;
                    b.isFalling = false;
                    b.spawnFadeProgress = 1;
                } else {
                    b.y = dropStartY;
                    b.isFalling = true;
                    b.fallVelocity = 60 + Math.random() * 80;
                    b.spawnTargetPlatformId = targetPlat.id;
                    b.fallingFromPlatformId = undefined;
                    b.fallStartY = dropStartY;
                    b.spawnFadeProgress = 1;
                }
            }

            // Position ground sprite if applicable
            if (groundSpriteIndex >= 0 && ground) {
                const b = boidsList[groundSpriteIndex];
                if (!b.isFleeing && !b.isHopping) {
                    const minX = boundaryMargin + 20;
                    const maxX = pageWidth - boundaryMargin - 20;
                    const spawnX = minX + Math.random() * Math.max(1, maxX - minX);
                    const dropStartY = Math.min(ground.top - 120, currentScrollY - 30) - (numElevatedSprites * 20 + Math.random() * 30);

                    b.x = spawnX;
                    b.hopStartX = spawnX;
                    b.hopStartY = ground.top;
                    b.hopTargetX = spawnX;
                    b.hopTargetY = ground.top;
                    b.hopY = 0;
                    b.currentPlatformId = "ground";
                    b.targetPlatformId = "ground";
                    b.isHopping = false;
                    b.direction = Math.random() < 0.5 ? 1 : -1;
                    b.recoveryTimer = 0;

                    if (spawnType === "fade") {
                        b.y = ground.top;
                        b.isFalling = false;
                        b.spawnFadeProgress = 0;
                    } else if (spawnType === "appear") {
                        b.y = ground.top;
                        b.isFalling = false;
                        b.spawnFadeProgress = 1;
                    } else {
                        b.y = dropStartY;
                        b.isFalling = true;
                        b.fallVelocity = 60 + Math.random() * 80;
                        b.spawnTargetPlatformId = "ground";
                        b.fallingFromPlatformId = undefined;
                        b.fallStartY = dropStartY;
                        b.spawnFadeProgress = 1;
                    }
                }
            }
        };

        const scanPlatforms = () => {
            const cfg = cfgRef.current;
            docDimensions = getDocumentDimensions();
            const { pageWidth, pageHeight } = docDimensions;
            const currentGroundY = computeGroundY(pageHeight);

            if (!cfg.enablePlatforms) {
                if (cfg.enableGroundPlatform !== false) {
                    platforms = [{
                        id: "ground",
                        left: 0,
                        right: pageWidth,
                        top: currentGroundY,
                        width: pageWidth,
                        isGround: true,
                    }];
                } else {
                    platforms = [];
                }
                return;
            }
            platforms = extractPlatformSurfaces(
                cfg.platformSelector || "[data-sprite-platform], .feature > div, h2, h3, [role='button'], button, a.btn",
                currentGroundY,
                pageWidth,
                cfg.platformExcludeSelector || "nav, header, [data-no-sprite-platform]",
                cfg.platformTopOffset,
                cfg.enableGroundPlatform !== false
            );
        };

        // Initialize Sprites across the document after entrance animation buffer
        let hasSpawned = false;
        let spawnReady = false;

        const spawnBoids = () => {
            if (hasSpawned || !spawnReady) return;

            scanPlatforms();

            const cfg = cfgRef.current;
            if (platforms.length === 0 && cfg.enableGroundPlatform === false) {
                // Platforms haven't rendered yet (e.g. async Firestore content on /resume).
                // Do not mark hasSpawned = true, so debouncedScan will spawn once the element mounts.
                return;
            }

            hasSpawned = true;

            const count = cfg.spriteCount ?? cfg.spriteSheetCols ?? 6;
            const padding = Math.max(50, cfg.spriteSize * 2.5);
            const { pageWidth: initialPageWidth, pageHeight: initialPageHeight } = docDimensions;
            const availableWidth = Math.max(100, initialPageWidth - padding * 2);
            const step = availableWidth / Math.max(1, count);
            const initialGroundY = computeGroundY(initialPageHeight);

            const shuffledSlots = shuffleArray(Array.from({ length: count }, (_, idx) => idx));

            // Build candidate sprite pool
            const totalCols = Math.max(1, cfg.spriteSheetCols || 6);
            const rawSelection = cfg.spriteIndices ?? cfg.selectedSprites;
            const isRandom = cfg.randomizeSprites || rawSelection === "random";

            const spritePool: number[] = Array.isArray(rawSelection) && rawSelection.length > 0
                ? rawSelection.map((idx) => Math.abs(idx) % totalCols)
                : (typeof rawSelection === "number"
                    ? [Math.abs(rawSelection) % totalCols]
                    : Array.from({ length: totalCols }, (_, idx) => idx));

            // Distribute sprite types without repeating until pool is exhausted
            const assignedSpriteTypes: number[] = [];
            if (isRandom) {
                let currentShuffled: number[] = [];
                for (let i = 0; i < count; i++) {
                    if (currentShuffled.length === 0) {
                        currentShuffled = shuffleArray(spritePool);
                    }
                    assignedSpriteTypes.push(currentShuffled.pop()!);
                }
            } else {
                for (let i = 0; i < count; i++) {
                    assignedSpriteTypes.push(spritePool[i % spritePool.length]);
                }
            }

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

                const catType = assignedSpriteTypes[i];

                boids.push({
                    x: initX,
                    y: initialGroundY,
                    direction: initialDir,
                    catType,

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
                    spawnTargetPlatformId: undefined,

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

            // Distribute boids onto detected platforms with sky spawn fall
            distributeBoidsToPlatforms(boids);
        };

        // Debounced scanner to prevent layout thrashing on high-frequency DOM/Resize mutations
        let scanDebounceTimer: ReturnType<typeof setTimeout> | null = null;
        const debouncedScan = () => {
            if (scanDebounceTimer !== null) clearTimeout(scanDebounceTimer);
            scanDebounceTimer = setTimeout(() => {
                scanPlatforms();
                const currentCfg = cfgRef.current;
                if (!hasSpawned) {
                    // Only spawn if spawnDelay has elapsed AND (ground platform is enabled or non-ground platforms are detected)
                    if (spawnReady && (currentCfg.enableGroundPlatform !== false || platforms.some((p) => !p.isGround))) {
                        spawnBoids();
                    }
                } else if (boids.length > 0 && platforms.some((p) => !p.isGround)) {
                    // If boids exist but are stranded on ground while ground platform is disabled,
                    // or are assigned to an obsolete platform ID, re-distribute them to the detected platform(s)
                    const stranded = boids.some((b) =>
                        (currentCfg.enableGroundPlatform === false && b.currentPlatformId === "ground") ||
                        !platforms.some((p) => p.id === b.currentPlatformId)
                    );
                    if (stranded) {
                        distributeBoidsToPlatforms(boids);
                    }
                }
            }, 40);
        };

        // Resize handler
        const handleResize = () => {
            if (!canvas) return;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            screenWidth = window.innerWidth;
            screenHeight = window.innerHeight;
            canvas.width = Math.floor(screenWidth * dpr);
            canvas.height = Math.floor(screenHeight * dpr);
            debouncedScan();
        };
        handleResize();
        scanPlatforms();
        window.addEventListener("resize", handleResize, { passive: true });

        // Observers for layout and dynamic content changes
        const observer = new MutationObserver(() => {
            debouncedScan();
        });
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        }

        let resizeObserver: ResizeObserver | null = null;
        if (typeof ResizeObserver !== "undefined" && document.body) {
            resizeObserver = new ResizeObserver(() => {
                debouncedScan();
            });
            resizeObserver.observe(document.body);
        }

        // Schedule subsequent scans to catch async data loads (Firebase) and CSS animations
        const scanTimer1 = setTimeout(debouncedScan, 400);
        const scanTimer2 = setTimeout(debouncedScan, 1000);
        const scanTimer3 = setTimeout(debouncedScan, 2200);

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

        const spawnDelay = activeCfg.spawnDelay ?? 1500;
        let spawnTimer: ReturnType<typeof setTimeout> | null = null;
        if (spawnDelay <= 0) {
            spawnReady = true;
            spawnBoids();
        } else {
            spawnTimer = setTimeout(() => {
                spawnReady = true;
                spawnBoids();
            }, spawnDelay);
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

            const cfg = cfgRef.current;
            const speedMultiplier = isReduced ? 0.5 : 1.0;
            const overallSpeed = cfg.speed * speedMultiplier;
            const overallFleeSpeed = (cfg.fleeSpeed ?? (cfg.speed * 1.5)) * speedMultiplier;

            // Use cached document dimensions to avoid synchronous reflows
            const { pageWidth, pageHeight } = docDimensions;
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

            const baseSize = cfg.spriteSize;
            const estimatedHalfW = Math.max(16, (baseSize * 1.2) * 0.5);
            const boundaryMargin = estimatedHalfW + 12;

            // Mouse in document coordinates
            const mouseWorldX = mouseActive ? clientMouseX + scrollX : -10000;
            const mouseWorldY = mouseActive ? clientMouseY + scrollY : -10000;

            // Update physics & hopping state machine
            for (let i = 0; i < boids.length; i++) {
                const b = boids[i];
                const effectiveFleeRadius = (cfg.cursorFleeRadius ?? 50) * b.sensitivity;

                const dx = b.x - mouseWorldX;
                const dy = b.y - mouseWorldY;
                const distToCursor = Math.hypot(dx, dy);
                const isCursorNear = mouseActive && clientMouseX >= 0 && clientMouseY >= 0 && distToCursor < effectiveFleeRadius;

                // 1. FREE FALLING / DROPPING DOWN
                if (b.isFalling) {
                    b.fallVelocity += 900 * dt;
                    const prevY = b.y;
                    b.y += b.fallVelocity * dt;

                    // SPAWN FALL: falling straight down from the top of the screen onto its assigned platform
                    if (b.spawnTargetPlatformId) {
                        let target: PlatformSurface | undefined = platforms.find((p) => p.id === b.spawnTargetPlatformId);
                        if (!target && b.spawnTargetPlatformId === "ground") {
                            target = groundPlat || undefined;
                        }
                        const targetY = target ? target.top : groundYBaseline;

                        if (b.y >= targetY) {
                            b.y = targetY;
                            b.currentPlatformId = target ? target.id : "ground";
                            b.isFalling = false;
                            b.spawnTargetPlatformId = undefined;
                            b.fallVelocity = 0;
                            b.fallingFromPlatformId = undefined;
                            b.fallStartY = undefined;
                            b.squashTimer = 0.16; // Deeper squash on impact from sky fall
                            b.recoveryTimer = 0.12 + Math.random() * 0.2;
                            b.hopY = 0;

                            if (target) {
                                b.x = Math.max(target.left + 4, Math.min(target.right - 4, b.x));
                            }
                        }
                        continue;
                    }

                    b.x += b.direction * 30 * dt;
                    b.x = Math.max(boundaryMargin, Math.min(pageWidth - boundaryMargin, b.x));

                    // Check platform collisions
                    let landedPlat: PlatformSurface | null = null;
                    for (let j = 0; j < platforms.length; j++) {
                        const p = platforms[j];
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
                        landedPlat = groundPlat || (platforms.length > 0 ? platforms[0] : null);
                    }

                    if (landedPlat) {
                        b.y = landedPlat.top;
                        b.currentPlatformId = landedPlat.id;
                        b.isFalling = false;
                        b.fallVelocity = 0;
                        b.fallingFromPlatformId = undefined;
                        b.fallStartY = undefined;
                        b.squashTimer = 0.12;
                        b.recoveryTimer = 0.08;
                        b.hopY = 0;

                        if (isCursorNear) {
                            b.direction = dx >= 0 ? 1 : -1;
                        } else {
                            if (b.x <= landedPlat.left + 6) {
                                b.x = landedPlat.left + 6;
                                b.direction = 1;
                            } else if (b.x >= landedPlat.right - 6) {
                                b.x = landedPlat.right - 6;
                                b.direction = -1;
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
                                    if (!isCursorNear) b.direction = 1;
                                } else if (b.x >= maxX) {
                                    b.x = maxX;
                                    if (!isCursorNear) b.direction = -1;
                                }
                            } else {
                                b.x = Math.max(currentPlat.left + 2, Math.min(currentPlat.right - 2, b.x));
                            }
                        }

                        if (isCursorNear) {
                            const baseFleePause = 0.03 + Math.random() * 0.03;
                            b.fleeIdleTimer = baseFleePause / Math.max(0.2, (overallFleeSpeed / 2) * b.fleeSpeedMod);
                        }
                    } else {
                        // In flight: smoothstep horizontal displacement + linear baseline + parabolic arc
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
                    const platUnderFeet = platforms.find(
                        (p) => !p.isGround && b.x >= p.left - 6 && b.x <= p.right + 6 && Math.abs(b.y - p.top) <= 20
                    );
                    if (platUnderFeet) {
                        currentPlat = platUnderFeet;
                        b.currentPlatformId = platUnderFeet.id;
                        b.y = platUnderFeet.top;
                        b.hopY = 0;
                    } else {
                        // Platform is gone: start falling naturally
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
                    const rawChance = cfg.hopChance ?? 0.3;
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

                    const plat = currentPlat || groundPlat || (platforms.length > 0 ? platforms[0] : null);
                    if (!plat) continue;

                    if (isFleeHop) {
                        const fleeDir: 1 | -1 = dx >= 0 ? 1 : -1;
                        let didChooseVerticalEscape = false;

                        // VERTICAL ESCAPE PRIORITY:
                        // Search for reachable overhead platforms, lower platforms, or ledge drops
                        if (cfg.enablePlatforms) {
                            const maxReachY = cfg.platformJumpReachY ?? 200;
                            const maxReachX = Math.max(cfg.platformJumpReachX ?? 20, 24);

                            const fleeUpCandidates: PlatformSurface[] = [];
                            const fleeDownCandidates: PlatformSurface[] = [];
                            const fleeAcrossCandidates: PlatformSurface[] = [];

                            const isNearLeftLedge = b.x <= plat.left + 22 && fleeDir === -1;
                            const isNearRightLedge = b.x >= plat.right - 22 && fleeDir === 1;
                            const canLedgeDrop = cfg.enableLedgeDrop !== false && !plat.isGround && (isNearLeftLedge || isNearRightLedge);

                            for (let j = 0; j < platforms.length; j++) {
                                const q = platforms[j];
                                if (q.id === plat.id) continue;
                                const diffY = plat.top - q.top;

                                const distToQ = b.x < q.left ? q.left - b.x : (b.x > q.right ? b.x - q.right : 0);

                                if (distToQ <= maxReachX) {
                                    if (diffY >= 14 && diffY <= maxReachY && q.top >= 20 && q.top <= pageHeight - 10) {
                                        fleeUpCandidates.push(q);
                                    } else if (diffY <= -14 && -diffY <= maxReachY && !plat.isGround) {
                                        fleeDownCandidates.push(q);
                                    } else if (Math.abs(diffY) <= 28) {
                                        if (isNearRightLedge && q.left >= plat.right - 10 && q.left <= plat.right + maxReachX) {
                                            fleeAcrossCandidates.push(q);
                                        } else if (isNearLeftLedge && q.right <= plat.left + 10 && q.right >= plat.left - maxReachX) {
                                            fleeAcrossCandidates.push(q);
                                        }
                                    }
                                }
                            }

                            type EscapeOption =
                                | { type: "up"; plat: PlatformSurface; score: number }
                                | { type: "down"; plat: PlatformSurface; score: number }
                                | { type: "across"; plat: PlatformSurface; score: number }
                                | { type: "drop"; score: number };

                            const escapeOptions: EscapeOption[] = [];

                            const scoreCandidate = (targetPlat: PlatformSurface) => {
                                const margin = Math.min(12, targetPlat.width * 0.25);
                                let candX = b.x + fleeDir * Math.max(10, (cfg.largeHopDistance ?? 50) * 0.7);
                                candX = Math.max(targetPlat.left + margin, Math.min(targetPlat.right - margin, candX));
                                const distFromCursor = Math.hypot(candX - mouseWorldX, targetPlat.top - mouseWorldY);
                                return { targetX: candX, distFromCursor };
                            };

                            for (const q of fleeUpCandidates) {
                                const { distFromCursor } = scoreCandidate(q);
                                const verticalBonus = dy < 0 ? 60 : (Math.abs(dy) <= 30 ? 40 : 10);
                                escapeOptions.push({ type: "up", plat: q, score: distFromCursor + verticalBonus });
                            }

                            for (const q of fleeDownCandidates) {
                                const { distFromCursor } = scoreCandidate(q);
                                const verticalBonus = dy > 0 ? 60 : (Math.abs(dy) <= 30 ? 40 : 10);
                                escapeOptions.push({ type: "down", plat: q, score: distFromCursor + verticalBonus });
                            }

                            for (const q of fleeAcrossCandidates) {
                                const { distFromCursor } = scoreCandidate(q);
                                escapeOptions.push({ type: "across", plat: q, score: distFromCursor + 45 });
                            }

                            if (canLedgeDrop) {
                                const estimatedDropY = Math.min(pageHeight - 20, plat.top + 70);
                                const estimatedDropX = b.x + fleeDir * 25;
                                const distFromCursor = Math.hypot(estimatedDropX - mouseWorldX, estimatedDropY - mouseWorldY);
                                const dropBonus = dy >= -15 ? 70 : 25;
                                escapeOptions.push({ type: "drop", score: distFromCursor + dropBonus });
                            }

                            if (escapeOptions.length > 0) {
                                escapeOptions.sort((a, b) => b.score - a.score);
                                const chosen = escapeOptions[0];

                                if (chosen.type === "up" || chosen.type === "down" || chosen.type === "across") {
                                    didChooseVerticalEscape = true;
                                    const targetPlat = chosen.plat;
                                    const margin = Math.min(12, targetPlat.width * 0.25);
                                    let targetX = b.x + fleeDir * Math.max(12, (cfg.largeHopDistance ?? 50) * b.hopDistMod);
                                    targetX = Math.max(targetPlat.left + margin, Math.min(targetPlat.right - margin, targetX));

                                    b.direction = targetX >= b.x ? 1 : -1;

                                    const diffY = plat.top - targetPlat.top;
                                    b.hopTargetX = targetX;
                                    b.hopTargetY = targetPlat.top;
                                    b.targetPlatformId = targetPlat.id;

                                    const absDiffY = Math.abs(diffY);
                                    b.hopArcPeak = Math.max((cfg.largeHopHeight ?? 22) * b.hopHeightMod, absDiffY * 0.45 + 14);
                                    b.currentHopDuration = (0.22 / Math.max(0.1, overallFleeSpeed * b.fleeSpeedMod)) * Math.sqrt(b.hopArcPeak / 10);
                                } else if (chosen.type === "drop") {
                                    b.isHopping = false;
                                    b.isFalling = true;
                                    b.fallVelocity = 35;
                                    b.fallingFromPlatformId = plat.id;
                                    b.fallStartY = plat.top;
                                    b.direction = fleeDir;
                                    b.x += fleeDir * 8;
                                    continue;
                                }
                            }
                        }

                        // FALLBACK: Horizontal Platform Jump
                        if (!didChooseVerticalEscape) {
                            const minX = plat.isGround ? boundaryMargin : plat.left + 6;
                            const maxX = plat.isGround ? pageWidth - boundaryMargin : plat.right - 6;

                            const isCornered = (fleeDir === 1 && b.x >= maxX - 10) || (fleeDir === -1 && b.x <= minX + 10);

                            if (isCornered) {
                                if (distToCursor < 90) {
                                    // Desperation leap over the cursor
                                    b.direction = (fleeDir === 1 ? -1 : 1) as 1 | -1;
                                    b.currentHopHeight = (cfg.largeHopHeight ?? 22) * b.hopHeightMod * 1.5;
                                    b.currentHopDistance = Math.min(plat.width * 0.7, (cfg.largeHopDistance ?? 50) * b.hopDistMod * 1.5);
                                    b.hopArcPeak = b.currentHopHeight;
                                    b.currentHopDuration = (0.26 / Math.max(0.1, overallFleeSpeed * b.fleeSpeedMod));
                                    b.hopTargetX = Math.max(minX, Math.min(maxX, b.x + b.direction * b.currentHopDistance));
                                    b.hopTargetY = plat.top;
                                    b.targetPlatformId = plat.id;
                                } else {
                                    b.direction = fleeDir;
                                    b.isHopping = false;
                                    b.squashTimer = 0.12;
                                    b.fleeIdleTimer = 0.1;
                                    continue;
                                }
                            } else {
                                b.direction = fleeDir;

                                const hopJitter = 1.0 + (Math.random() * 2 - 1) * (cfg.personalityVariance * 0.25);
                                b.currentHopHeight = Math.max(4, (cfg.largeHopHeight ?? 22) * b.hopHeightMod * hopJitter);
                                b.currentHopDistance = Math.max(6, (cfg.largeHopDistance ?? 50) * b.hopDistMod * hopJitter);
                                b.hopArcPeak = b.currentHopHeight;
                                b.currentHopDuration = (0.22 / Math.max(0.1, overallFleeSpeed * b.fleeSpeedMod)) * Math.sqrt(b.currentHopHeight / Math.max(1, cfg.largeHopHeight ?? 22));

                                b.hopTargetX = Math.max(minX, Math.min(maxX, b.x + b.direction * b.currentHopDistance));
                                b.hopTargetY = plat.top;
                                b.targetPlatformId = plat.id;
                            }
                        }
                    } else {
                        // NORMAL WANDERING HOP
                        let didChooseJumpUp = false;

                        if (cfg.enablePlatforms) {
                            const maxReachY = cfg.platformJumpReachY ?? 200;
                            const maxReachX = cfg.platformJumpReachX ?? 20;
                            const upCandidates: PlatformSurface[] = [];
                            const downCandidates: PlatformSurface[] = [];
                            const acrossCandidates: PlatformSurface[] = [];

                            // Edge detection: horizontal jump across is only permitted if sprite is at the edge of its current platform
                            const edgeMargin = Math.min(16, plat.width * 0.45);
                            const isAtRightEdge = b.direction === 1 && b.x >= plat.right - edgeMargin;
                            const isAtLeftEdge = b.direction === -1 && b.x <= plat.left + edgeMargin;
                            const isAtEdge = !plat.isGround && (isAtRightEdge || isAtLeftEdge);

                            for (let j = 0; j < platforms.length; j++) {
                                const q = platforms[j];
                                if (q.id === plat.id) continue;
                                const diffY = plat.top - q.top;

                                if (diffY >= 14 && diffY <= maxReachY && q.top >= 20 && q.top <= pageHeight - 10) {
                                    const distToQ = b.x < q.left ? q.left - b.x : (b.x > q.right ? b.x - q.right : 0);
                                    if (distToQ <= maxReachX) {
                                        upCandidates.push(q);
                                    }
                                } else if (diffY <= -14 && diffY >= -maxReachY && !plat.isGround) {
                                    const distToQ = b.x < q.left ? q.left - b.x : (b.x > q.right ? b.x - q.right : 0);
                                    if (distToQ <= maxReachX) {
                                        downCandidates.push(q);
                                    }
                                } else if (isAtEdge && Math.abs(diffY) <= 28) {
                                    if (isAtRightEdge && q.left >= plat.right - 10 && q.left <= plat.right + maxReachX) {
                                        acrossCandidates.push(q);
                                    } else if (isAtLeftEdge && q.right <= plat.left + 10 && q.right >= plat.left - maxReachX) {
                                        acrossCandidates.push(q);
                                    }
                                }
                            }

                            const jumpChance = (cfg.platformJumpChance ?? 0.15) * b.hopChanceMod;
                            const dropChance = (cfg.platformDropChance ?? 0.15) * (1 / Math.max(0.5, b.wanderPatience));
                            const shiftChance = (cfg.platformShiftChance ?? 0.5) * b.hopChanceMod;

                            // 1. Horizontal platform shift attempt (lateral jump to adjacent platform when at edge)
                            if (acrossCandidates.length > 0 && Math.random() < shiftChance) {
                                const targetPlat = acrossCandidates[0];
                                didChooseJumpUp = true;

                                const margin = Math.min(10, targetPlat.width * 0.2);
                                const targetX = b.direction === 1 ? targetPlat.left + margin : targetPlat.right - margin;

                                b.hopTargetX = targetX;
                                b.hopTargetY = targetPlat.top;
                                b.targetPlatformId = targetPlat.id;
                                b.hopArcPeak = Math.max(3, cfg.smallHopHeight * b.hopHeightMod);
                                const gapDist = Math.abs(targetX - b.x);
                                b.currentHopDuration = (0.28 / Math.max(0.1, overallSpeed * b.speedMod)) * Math.sqrt(gapDist / 20 + 1);
                            }

                            // 2. Overhead jump attempt
                            if (!didChooseJumpUp && upCandidates.length > 0 && Math.random() < jumpChance * 0.5) {
                                const targetPlat = upCandidates[Math.floor(Math.random() * upCandidates.length)];
                                didChooseJumpUp = true;

                                const margin = Math.min(14, targetPlat.width * 0.25);
                                const targetX = Math.max(targetPlat.left + margin, Math.min(targetPlat.right - margin, b.x + (Math.random() - 0.5) * 40));

                                b.direction = targetX >= b.x ? 1 : -1;

                                const diffY = plat.top - targetPlat.top;
                                b.hopTargetX = targetX;
                                b.hopTargetY = targetPlat.top;
                                b.targetPlatformId = targetPlat.id;
                                b.hopArcPeak = Math.max(cfg.smallHopHeight * b.hopHeightMod, diffY * 0.45 + 12);
                                b.currentHopDuration = (0.36 / Math.max(0.1, overallSpeed * b.speedMod)) * Math.sqrt(b.hopArcPeak / 10);
                            }

                            // 3. Jump Down to lower platform attempt
                            if (!didChooseJumpUp && downCandidates.length > 0 && Math.random() < dropChance * 0.6) {
                                const targetPlat = downCandidates[Math.floor(Math.random() * downCandidates.length)];
                                didChooseJumpUp = true;

                                const margin = Math.min(12, targetPlat.width * 0.25);
                                const targetX = Math.max(targetPlat.left + margin, Math.min(targetPlat.right - margin, b.x + (Math.random() - 0.5) * 30));

                                b.direction = targetX >= b.x ? 1 : -1;

                                const distY = targetPlat.top - plat.top;
                                b.hopTargetX = targetX;
                                b.hopTargetY = targetPlat.top;
                                b.targetPlatformId = targetPlat.id;
                                b.hopArcPeak = Math.max(3, cfg.smallHopHeight * b.hopHeightMod);
                                b.currentHopDuration = (0.32 / Math.max(0.1, overallSpeed * b.speedMod)) * Math.sqrt(distY / 40 + 1);
                            }
                        }

                        if (!didChooseJumpUp) {
                            // 2. Normal hop on current platform or ledge drop
                            const ledgeMargin = Math.min(14, plat.width * 0.45);
                            const isAtLeftLedge = b.x <= plat.left + ledgeMargin && b.direction === -1;
                            const isAtRightLedge = b.x >= plat.right - ledgeMargin && b.direction === 1;

                            if (!plat.isGround && (isAtLeftLedge || isAtRightLedge)) {
                                if (cfg.enableLedgeDrop !== false) {
                                    const dropChance = (cfg.platformDropChance ?? 0.15) * (1 / Math.max(0.5, b.wanderPatience));
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
                                    }
                                } else {
                                    b.direction = (b.direction === 1 ? -1 : 1) as 1 | -1;
                                }
                            } else {
                                const isAtGroundLeft = plat.isGround && b.x <= boundaryMargin + 20 && b.direction === -1;
                                const isAtGroundRight = plat.isGround && b.x >= pageWidth - boundaryMargin - 20 && b.direction === 1;

                                if (isAtGroundLeft) {
                                    b.direction = 1;
                                } else if (isAtGroundRight) {
                                    b.direction = -1;
                                } else {
                                    const baseTurnChance = cfg.turnChance ?? 0.2;
                                    const effectiveTurnChance = Math.min(0.95, Math.max(0.02, baseTurnChance * b.turnChanceMod));
                                    if (Math.random() < effectiveTurnChance) {
                                        b.direction = (b.direction === 1 ? -1 : 1) as 1 | -1;
                                    }
                                }
                            }

                            const hopJitter = 1.0 + (Math.random() * 2 - 1) * (cfg.personalityVariance * 0.25);
                            b.currentHopHeight = Math.max(2, cfg.smallHopHeight * b.hopHeightMod * hopJitter);
                            b.currentHopDistance = Math.max(4, cfg.smallHopDistance * b.hopDistMod * hopJitter);
                            b.hopArcPeak = b.currentHopHeight;
                            b.currentHopDuration = (0.32 / Math.max(0.1, overallSpeed * b.speedMod)) * Math.sqrt(b.currentHopHeight / Math.max(1, cfg.smallHopHeight));

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
            // RENDERING
            // ================================================================
            ctx.save();
            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, screenWidth, screenHeight);

            // Optional debug visualization of detected platform surfaces
            if (cfg.showPlatforms) {
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
            if (cfg.showGroundLine) {
                const screenGroundY = groundYBaseline - scrollY;
                if (screenGroundY >= -10 && screenGroundY <= screenHeight + 10) {
                    ctx.save();
                    ctx.strokeStyle =
                        cfg.groundLineColor ||
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
                // Facing: 0 = Right (direction 1), 1 = Left (direction -1)
                const sprite = breedSprites[b.direction === 1 ? 0 : 1];
                if (!sprite) continue;

                const renderW = Math.round(sprite.width * (baseSize / 20));
                const renderH = Math.round(sprite.height * (baseSize / 20));

                // Off-screen culling: skip drawing sprites outside visible viewport
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
                    const squashRatio = b.squashTimer / 0.12;
                    scaleX = 1.0 + 0.22 * squashRatio;
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
                if (b.spawnFadeProgress !== undefined && b.spawnFadeProgress < 1.0) {
                    b.spawnFadeProgress = Math.min(1.0, b.spawnFadeProgress + dt / 0.5);
                    ctx.globalAlpha = (ctx.globalAlpha || 1.0) * b.spawnFadeProgress;
                }
                ctx.drawImage(sprite, -renderW * 0.5, -renderH, renderW, renderH);
                ctx.restore();
            }

            ctx.restore();

            rafId = requestAnimationFrame(render);
        };

        rafId = requestAnimationFrame(render);

        return () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerleave", handlePointerLeave);
            mediaReduced.removeEventListener("change", handleReduced);
            mediaDark.removeEventListener("change", handleTheme);
            document.removeEventListener("visibilitychange", handleVisibility);
            if (observer) observer.disconnect();
            if (resizeObserver) resizeObserver.disconnect();
            clearTimeout(scanTimer1);
            clearTimeout(scanTimer2);
            clearTimeout(scanTimer3);
            if (scanDebounceTimer !== null) clearTimeout(scanDebounceTimer);
            if (spawnTimer !== null) clearTimeout(spawnTimer);
        };
    }, [activeCfg]);

    return (
        <div
            aria-hidden="true"
            className={`fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden ${className || ""}`}
            style={{ zIndex: activeCfg.zIndex ?? 20 }}
        >
            <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
    );
}
