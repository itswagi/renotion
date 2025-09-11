# Copilot Instructions for Renotion

## Project Overview

- **Renotion** is a Notion-style markdown editor and viewer, designed for React. It is highly customizable via theming and component overrides.
- This is a npm package intended for frontend use in React applications.
- The project uses Vite Library Mode for building and development, and Vitest for testing.
- The main entry point is the `Renotion` React component (see `src/Editor.tsx`).
- Theming is handled via the `createTheme` helper and the `theme` prop. See `src/components/theme/` and `src/components/theme/types/` for extensibility.
- The codebase is TypeScript-first and expects strict type safety.

## Key Directories & Files

- `src/Editor.tsx`: Main editor logic and entry point.
- `src/components/`: All UI components, including markdown block renderers and theme logic.
- `src/hooks/`: Custom React hooks for editor state, drag-and-drop, and text changes.
- `src/lib/`: Shared helpers, constants, and utility functions.
- `playground/`: Example app for local development and testing.

## Developer Workflows

- **Build**: Use Vite. Run `npm run build` to build the package.
- **Test**: Run `npm test` (uses Vitest). Test files are colocated, e.g., `src/utils.test.ts`.
- **Local Release**: Run `npm run local-release` to build and pack for local consumption.
- **Playground**: Use `npm run dev` to start the playground app for live development.

## Project-Specific Patterns

- **Component Customization**: Use the `theme` prop and `createTheme` to override or extend markdown element rendering. See `README.md` for examples.
- **Drag-and-Drop**: Implemented via custom hooks and components in `src/components/dnd/`.
- **Type Definitions**: All major data structures and props are typed in `src/types.ts` and `src/components/theme/types/`.
- **No direct DOM manipulation**: All UI logic should be React idiomatic.

## Integration & Dependencies

- Uses Vite for build/dev, Vitest for testing, and Changesets for versioning.
- No backend or server code; this is a frontend-only package.
- External dependencies are managed via `package.json`.

## Conventions

- Prefer functional React components and hooks.
- Keep styles in `src/styles.css` or component-scoped.
- All new features should be covered by tests in colocated `*.test.ts` files.
- Use the Kanban board (see README) for issue tracking and workflow.

## Examples

- See `README.md` for usage and theming examples.
- For custom block rendering, refer to `src/components/theme/` and `src/components/code-block/`.

---

If you are unsure about a pattern or workflow, check the `README.md` or look for examples in the `playground/` directory.
