# Changelog

All notable changes to this project will be documented in this file.

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
