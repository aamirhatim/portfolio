# Changelog

All notable changes to this project will be documented in this file.


## [9.11.2] - 2026-06-28 21:01:00

### Changed
- Refactored `useIsMobile` to use `useSyncExternalStore` for a singleton resize listener, eliminating redundant event listeners.
- Deduplicated identical Firestore fetch logic in `ArticleManager` into a single `useCallback` hook.
- Optimized autoplay interval creation in `FeaturedWorkCarousel` by removing `currentIndex` from `useEffect` dependencies.
- Removed expensive mock data generation on error in `GithubContributionTracker`; now gracefully renders a simple fallback message.

## [9.11.1] - 2026-06-28 20:38:00

### Added
- Extracted a reusable `ParallaxWrapper` component to encapsulate requestAnimationFrame-based mouse tracking and coordinate translations.
- Applied universal parallax mouse-tracking to interactive elements across the application, including project link buttons, socials bar icons, carousel navigation arrows, and About page skill chips.
- Added smooth scale-on-hover effects to project link buttons.

### Changed
- Refactored `ProjectItem` tile by removing internal tracking refs, stripping inner padding, and removing redundant background/border classes for a clean, minimal layout.
- Styled article viewer navigation arrows to match the carousel design and wrapped them in `ParallaxWrapper`.
- Simplified the month label rendering logic in `GithubContributionTracker` by replacing complex colSpan math with a straightforward 1:1 week mapping to ensure labels strictly align with column transitions.
- Increased spacing gap for desktop project list in `ProjectsPage`.

### Fixed
- Fixed overlapping month label fragments in `GithubContributionTracker` by explicitly omitting labels for the first week to prevent layout clipping.
- Fixed a bug on the mobile `ProjectItem` where Code and Video links lacked the `newTab` prop, causing internal router conflicts.
- Cleaned up unused `ANIMATION_DURATION_MS` import from `ProjectViewer.tsx`.

## [9.11.0] - 2026-06-16 23:41:00

### Changed
- Refactored `ProjectItem` mouse-tracking parallax to use cached bounding rects and `requestAnimationFrame`, eliminating layout thrashing and improving scroll smoothness.
- Adjusted parallax coordinates to invert the translation direction.
- Updated `ProjectItem` layout to use transparent borders by default, fading in on hover, and aligned the tile background color with the main canvas.
- Updated `AnimateInView` to accept custom CSS class props, allowing `ProjectsPage` to dynamically elevate the stacking context (`hover:z-50`) of active tiles to prevent clipping beneath adjacent siblings.
- Replaced the `Asterisk` spotlight icon with the `Star` icon from `lucide-react` across both desktop and mobile views.
- Repositioned the spotlight indicator from floating relative to the title to being inline as the left-most item within the article link flex row.
- Consolidated mobile links row rendering logic to ensure visibility if a project is spotlighted, even if it lacks external links.

### Removed
- Removed the publication date and hero image from the client article layout (`ArticleHeader.tsx`).

## [9.10.0] - 2026-06-16 21:46:00

### Changed
- Removed legacy local `src/data/articles` JSON and markdown fallback files, standardizing article resolution entirely on the production Firestore `articles` collection to reduce Javascript bundle size and enforce single-source-of-truth reliability.
- Cleaned up `import.meta.glob` dynamic imports and fallback states from `ProjectArticle`, `FeaturedWorkCarousel`, `ProjectItem`, `ArticleManager`, and `ArticleEditor`.
- Removed legacy "local-fallback" badge UI logic from the Articles admin dashboard table.

## [9.9.0] - 2026-06-15 20:41:00

### Added
- Added architectural documentation to `TableBlockType` and `TableEditor` state mappings to explicitly document Firestore schema constraints regarding nested arrays and prevent accidental regressions.

### Fixed
- Injected `projectId` into all local JSON article blocks to prevent `undefined` image storage path errors when rendering imported fallback articles.
- Refactored `TableBlockType.content` schema from nested arrays (`string[][]`) to an array of objects (`{ cells: string[] }[]`) to comply with Firestore restrictions.
- Migrated legacy `day-zero.json` table data to match the newly enforced schema format.

## [9.8.1] - 2026-06-15 19:23:00

### Changed
- Updated `ArticleImage` to resolve image paths dynamically from the project-specific storage location (`/proj_img/[projectId]/article/`).
- Updated `ImageEditor` component to clarify that users should input the image filename instead of a full path.

## [9.8.0] - 2026-06-13 15:09:49

### Changed
- Refactored `ArticleEditor` by decomposing the monolithic editor into highly modular sub-components (`ParagraphEditor`, `TitleEditor`, `ImageEditor`, `CodeEditor`, `ListEditor`, `FormulaEditor`, and `TableEditor`).
- Simplified the nested field state logic in `CollectionManager` by introducing pure helper functions (`getFieldValue` and `setFieldValue`) in a new `fieldUtils.ts` utility.
- Streamlined `CollectionManager` and `ArticleEditor` by extracting form logic, list item rendering, and live preview rendering into separate atomic components (`CollectionForm`, `CollectionListItem`, `ArticleBlocksBuilder`, `ArticlePreview`).
- Enhanced Admin Portal UX by minimizing the `BlockToolbar` to an icon-only row with hover tooltips and centering it within the editor.
- Refined global action buttons (Save, Delete, Cancel) in the article editor to icon-only controls.
- Unified the first-column width (`w-36 min-w-[9rem]`) across all document viewers in the collection tabs to ensure consistent layouts.
- Re-architected `ArticleManager` table status badges into an isolated `ArticleStatusBadge` component.
## [9.7.0] - 2026-06-12 15:24:00

### Added
- Integrated a responsive, level-colored skills directory on the About page, displaying skills with level 3 and above, grouped by categories (code, tools, and concepts).
- Added `sm`, `md`, and `lg` sizing support in the `Chip` component, mapping sizes to exact classes (`px-2 text-xs`, `px-3 py-1 text-md`, and `px-4 py-2 text-lg`).
- Enforced strict TypeScript typing (`'sm' | 'md' | 'lg'`) on the `size` prop of `Chip` and `ChipGroup` components.

### Changed
- Configured About page skill sections to render chips with the medium (`md`) size.
- Refactored biography `useEffect` data loading to check if the component is active, preventing memory leaks on unmount.
- Memoized filtered and sorted skill lists using `useMemo` to optimize rendering.
- Simplified rendering structure on the About page, utilizing loop configs to map over columns dynamically (DRY cleanup).
- Removed the redundant "skills." heading title on the About page.

## [9.6.0] - 2026-06-12 13:40:00

### Added
- Declared global and viewport-wide `color-scheme: light dark` support in `index.html` and `src/root.css` to allow proper native styling and media query evaluation of dark mode.
- Introduced a custom static dark token set (`--static-dark-bg`, `--static-dark-text`, and `--static-dark-border`) to encapsulate color values for components with fixed dark overlays.

### Changed
- Shifted light and dark mode variables to a cohesive, sophisticated custom **Forest Sage & Midnight Pine** theme, replacing previous cyan/teal accents.
- Improved light-mode contrast and readability by darkening body text (`#2b3832`), subtitles (`#4b5d55`), solid accents (`#226449`), and link text (`#1d5f44`) to meet WCAG AA standards.
- Refactored `FeaturedWorkCarousel` overlay styles and tag chips to use new `--static-dark-*` tokens instead of hardcoded stone colors.
- Refactored `GithubContributionTracker` scrollbars to utilize the semantic `--border-color` variable and restructured contribution levels for natural light-to-dark progression.

## [9.5.1] - 2026-06-12 12:43:00

### Fixed
- Resolved a bug where refreshing or reloading the page caused the active navigation state indicator to reset to "home" instead of preserving the active route.
- Aligned all uncolored borders to explicitly use the semantic `--border-color` token across `ExpPatentItem` status tags, `currentWork` section dividers, and `ProjectPopup` containers.

### Changed
- Configured the navigation context state setter (`handleSetNav`) in `Main.tsx` to persist active route targets to `sessionStorage` and fallback-synchronize them on mount.

## [9.5.0] - 2026-06-12 11:54:00

### Added
- Declared comprehensive Tier 2 semantic variables (e.g. `--bg-card`, `--bg-interactive-hover`, `--txt-link-hover`, `--border-focus`, `--feedback-error`, `--feedback-warning`, and a brand `--color-accent-*` scale) in `src/root.css` to enable unified styling for light and dark modes.

### Changed
- Refactored `Chip` component to set default adaptive border, background, and text styling tokens when custom classes are not provided.
- Refactored Logout buttons in `Navbar` and `NavMenu` to use the `--feedback-error` status token.
- Updated delete button in `CollectionManager` to use `--feedback-error` for hover background.
- Updated `FeaturedWorkCarousel` component to utilize theme-adaptive skeleton loaders, container backdrops, focus outline rings (`focus-visible:ring-(--border-focus)`), and navigation controls.
- Updated `GithubContributionTracker` to bind contribution cell levels to the `--color-accent-bg-*` brand scale, skeleton trackers to secondary backgrounds, and offline tags to warning tokens.
- Replaced the non-existent `--bg-layer-color` variable on tables in `ArticleTable` with the correct `--bg-secondary-color` semantic property.

## [9.4.1] - 2026-06-11 21:38:00

### Changed
- Configured specific Admin Portal form fields (e.g. `detail`, `end`, `subtitle`, `url`, `video`) to no longer be required, permitting more flexible document creation and updates.
- Refactored `firebase-admin` dependency out of the root project scope by isolating it to a dedicated `package.json` inside the `scripts/` directory.
- Updated the `uploadFilesToStorage.cjs` script to use modern Firebase Admin SDK v12+ modular imports.
- Updated the email placeholder text on the `AdminPage` login form.


## [9.4.0] - 2026-06-11 20:40:00

### Added
- Implemented a secure `AdminDashboard` and `CollectionManager` allowing dynamic CRUD operations for Firestore collections with a styled table view for expanded document data.
- Integrated Google Sign-in to the `AdminPage` alongside existing Email/Password authentication.
- Added strict frontend route guarding to the `AdminPage` using `checkIsAdmin()`, logging out unauthorized users attempting to access the portal.

### Changed
- Refactored `firestore.rules` to apply strict write restrictions, ensuring only users with an ID registered in the `admins` collection can modify database content.
- Updated `NavMenu` and `Navbar` to conditionally render a right-aligned Logout button specifically on the `/admin` route.
- Applied JSDoc annotations to `adminLib` functions and `CollectionManager` component props for improved maintainability.

## [9.3.0] - 2026-06-11 14:39:00

### Added
- Implemented a premium Featured Work Spotlight Carousel component (`FeaturedWorkCarousel`) on the Projects page that cycles spotlighted projects with smooth cross-fading, mobile touch gestures, and keyboard accessibility.
- Implemented responsive, theme-adaptive `GithubContributionTracker` component showing GitHub contributions calendar grid with relative positioning layout for month labels and fallback mock data.

### Changed
- Unified typography styles in `root.css` by separating structural margins from global heading elements (`h2`, `h3`, `h4`).
- Migrated legacy `div` header structures to semantic headings (`h2` and `h3`) across home page, project details, and resume details.
- Refactored `Chip` component to accept custom tailwind and CSS classes via props.
- Integrated absolute positioning for GitHub contribution tracker months to prevent scroll clipping.

## [9.2.5] - 2026-06-10 09:27:30

### Fixed
- Resolved transient "transparent box" and flickering glitches in `ProjectPopup` by rendering all preloaded images concurrently in DOM overlay layers and cross-fading them via CSS opacity transitions.
- Resolved top-left viewport coordinates jump behavior in `ProjectPopup` by introducing a coordinate initialization state (`hasCoords`), keeping the popup hidden until cursor movement initializes valid coordinates.

## [9.2.4] - 2026-06-10 09:13:20

### Changed
- Relocated the social icons bar (`SocialsBar`) out of the desktop navigation header and placed it centered at the bottom of the About page content.
- Kept the socials bar in the mobile navigation menu drawer (`NavMenu.tsx`) for responsive ease-of-use.

## [9.2.3] - 2026-06-10 09:05:00

### Fixed
- Fixed Firestore query error on the home page by aligning the collection query to `intro` (matching security rules).

### Changed
- Removed unused `colorjs.io` dependency.

### Removed
- Deleted unused `usePreferredColorScheme.tsx` hook.

## [9.2.2] - 2026-06-10 08:51:30

### Fixed
- Fixed typescript MouseEvent type shadowing in `NavMenu.tsx` to resolve compile errors.
- Resolved `react-hooks/exhaustive-deps` in `useIntersectionObserver.tsx` by destructuring configuration options.
- Resolved `react-hooks/refs` in `ProjectPopup.tsx` by using CSS custom properties for position rendering.

### Changed
- Refactored codebase to completely remove all legacy `eslint-disable` and `eslint-disable-next-line` comments.
- Renamed lowercase component `linkRenderer` to `LinkRenderer` for React Fast Refresh export compliance.
- Moved synchronous state updates in effects to render-phase state adjustments in `useMountTransition.tsx`, `Main.tsx`, and `NavMenu.tsx`.
- Derived `hasArticle` state directly from static imports during rendering in `ProjectItem.tsx`.
- Standardized data-fetching components to use async inlined queries with active flags to prevent race conditions and satisfy `react-hooks/set-state-in-effect`.
- Upgraded project toolchain dependencies (Vite 8, React 19, Tailwind 4, KaTeX 0.17) and cleaned up deprecated animation imports.

## [9.2.1] - 2026-06-09 21:13:00

### Fixed
- Resolved a bug where the project popup hover event was missed on initial load.

### Changed
- Updated social icons (GitHub, LinkedIn, WordPress, Instagram) to use `currentColor`, ensuring a seamless transition to white in dark mode.

## [9.2.0] - 2026-06-09 20:50:00

### Changed
- Replaced `motion`/`react` animations with native CSS transitions and Tailwind utility classes across components to optimize bundle size and execution.
- Created `useMountTransition` and `useIntersectionObserver` hooks to handle mount animations natively without third-party dependencies.

### Removed
- Uninstalled `motion` dependency.
- Removed unused `ScrollHint` and `Sidebar` components.

## [9.1.0] - 2026-06-09 18:19:00

### Changed
- Migrated icons from FontAwesome to Lucide and custom SVGs to optimize bundle size.
- Added native SVG assets for GitHub, LinkedIn, Instagram, and WordPress in `socialsBar.tsx`.
- Refactored `ProjectLink.tsx` to use a clean `renderIcon` helper with `lucide-react`.

### Removed
- Uninstalled `@fortawesome` packages and unused simple-icons dependencies.
## [9.0.0] - 2026-06-09 17:14:00

### Added
- Created dedicated atomic components for rendering articles: `ArticleCode`, `ArticleFormula`, `ArticleImage`, `ArticleList`, `ArticleParagraph`, `ArticleTable`, and `ArticleTitle` in `src/components/atoms`.
- Added shared helper utility functions for article formatting in `src/lib/articleUtils.tsx`.
- Implemented robust global module-level image cache (`globalImgCache`) in `src/lib/firestoreLib.tsx` to optimize re-renders in `LazyImg` components.

### Changed
- Refactored `ProjectArticle.tsx` to use the new atomic layout components.
- Renamed components/pages (`Navbar`, `Sidebar`, `ProjectsPage`, `ResumePage`) to PascalCase for consistency.
- Hardened Firestore and Storage rules (`firestore.rules` and `storage.rules`) to follow the principle of least privilege, restricting all read/write paths except for public showcase collections.
- Updated navigation SVGs to semantic HTML `<button>` elements with clear `aria-label` tags for accessibility.
- Enhanced `.gitignore` with detailed Node, Vite, and Firebase debugging/temp file ignore rules (including `.vite/`, `.firebase/`, and logs).

### Removed
- Removed unnecessary server-side `firebase-admin` dependency from `package.json`.
- Deleted unused guides (`agents/article_conversion_guide.txt`) and old configuration files (`.eslintrc.cjs`, `.firebaserc`).
