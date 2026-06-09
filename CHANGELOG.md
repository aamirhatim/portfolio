# Changelog

All notable changes to this project will be documented in this file.

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
