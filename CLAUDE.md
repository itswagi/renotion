# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Renotion is a Notion-style markdown editor/viewer React component library published as an npm package. The main export is the `Renotion` component (`lib/Editor.tsx`) along with a `createTheme` helper for customization.

## Commands

| Task | Command |
|---|---|
| Dev server (playground) | `npm run dev` |
| Build library | `npm run build` |
| Run all tests | `npm test` |
| Lint | `npm run lint` |
| Format code | `npm run format` |
| Check formatting | `npm run check-format` |
| Type check | `npm run type-check` |
| Full CI check | `npm run ci` (format check → tests → build) |
| Storybook | `npm run storybook` |
| Release | `npm run local-release` (changeset version + publish) |

Run a single test file: `npx vitest run lib/path/to/file.test.ts`

## Architecture

**Build:** Vite library mode producing dual ES/CJS output (`dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`). React and React DOM are peer dependencies (externalized from bundle).

**Source layout (`lib/`):**
- `Editor.tsx` — Main `Renotion` component entry point
- `index.ts` — Public API exports
- `types.ts` — `RenotionProps` and public type definitions
- `components/theme/` — Theme components (Heading1-6, Paragraph, etc.) and theme types
- `components/code-block/` — Syntax-highlighted code block (highlight.js + prism-react-renderer)
- `components/dnd/` — Drag-and-drop via `@dnd-kit` (SortableItem, DragOverlayItem)
- `hooks/` — `useTextChanges`, `useDropIndicator`
- `lib/` — Helpers (markdown parsing), constants, types (`BlockType`, `ParsedMarkdown`, `RichText`), utilities

**Styling:** Tailwind CSS v4 with custom prefix `re:` to avoid conflicts with consuming apps. CSS is injected into JS at build time via `vite-plugin-css-injected-by-js`.

**Theming:** `createTheme()` accepts overrides as either a custom React component or a className string. The `editorWrapper` key only accepts className.

**Data model:** Markdown is parsed into `ParsedMarkdown[]` — each block has `id`, `type` (heading_1-6, paragraph, code, bulleted_list_item, numbered_list_item, to_do, quote, divider), and `rich_text[]` with annotations (bold, italic, strikethrough, underline, code, links, images).

## Testing

Vitest with jsdom environment and React Testing Library. Tests are colocated with source files using `.test.ts(x)` suffix. Test files live under `lib/` and match the pattern `lib/**/*.test.{ts,tsx}`.

## Code Conventions

- TypeScript strict mode throughout
- Functional React components and hooks only
- Prettier: semicolons, single quotes, trailing commas, 80 char width
- ESLint flat config with TypeScript and React plugins
- Changesets for versioning (`npm run local-release`)

## CI

GitHub Actions runs `npm run ci` on PRs and pushes to `main`: format check → test → build.
