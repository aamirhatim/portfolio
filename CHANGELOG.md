# Changelog

All notable changes to this project will be documented in this file.

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
