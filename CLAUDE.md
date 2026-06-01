# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: **pnpm** (lockfile is `pnpm-lock.yaml`).

- `pnpm dev` — Vite dev server on port 3000 (TanStack Start)
- `pnpm build` — production build to `dist/client` (Netlify-ready)
- `pnpm preview` — preview the built bundle
- `pnpm test` — run Vitest once (jsdom environment)
- `pnpm test -- <pattern>` — run a single test file/pattern (e.g. `pnpm test -- src/foo.test.ts`)
- `pnpm check` — Biome lint + format check (combined)
- `pnpm lint` / `pnpm format` — Biome lint or format only
- `pnpm storybook` — Storybook on port 6006
- `pnpm dlx shadcn@latest add <component>` — add a Shadcn component (do not write Shadcn primitives by hand; the project tracks the official registry)

Netlify local dev (proxied) runs on port 8888 and forwards to Vite at 3000 (`netlify.toml`).

## Architecture

**Framework:** TanStack Start (SSR React 19 on Vite). Entry-less — the router itself is the app entry. `src/router.tsx` builds the router via `getRouter()`, wires SSR + TanStack Query through `setupRouterSsrQueryIntegration`, and uses the auto-generated `src/routeTree.gen.ts`. Do not edit `routeTree.gen.ts` — the TanStack Router Vite plugin regenerates it from `src/routes/`.

**Routing:** File-based under `src/routes/`. `__root.tsx` defines the HTML shell, head metadata, and devtools panel. Routes get `queryClient` from router context (typed via `createRootRouteWithContext<MyRouterContext>`), so loaders can call `queryClient.ensureQueryData(...)` directly. Server functions and API routes live alongside routes (see README for `createServerFn` and `server.handlers` patterns).

**State / data:** A single `QueryClient` is created in `src/integrations/tanstack-query/root-provider.tsx#getContext` and threaded through the router context. SSR query hydration is handled by `setupRouterSsrQueryIntegration` — no manual `<QueryClientProvider>` wrapping is needed in routes.

**React Compiler is on.** `vite.config.ts` enables `babel-plugin-react-compiler` via `@rolldown/plugin-babel`. Avoid hand-rolled `useMemo`/`useCallback` for referential stability unless profiling shows the compiler missed it.

**UI layers — two parallel component trees, do not conflate:**
- `src/components/ui/*` — Shadcn primitives generated via the CLI (style: `new-york`, base color: `zinc`, icons: `lucide`). Configured by `components.json`. These are consumed by app code.
- `src/components/storybook/*` — handwritten wrapper components paired with `.stories.*` files. Storybook only globs `src/**/*.stories.*`. Keep stories next to the wrapper, not next to the raw `ui/` primitives.

**Path aliases:** `#/*` and `@/*` both map to `src/*` (see `tsconfig.json` and `package.json#imports`). `components.json` uses the `#/` form — prefer `#/` for consistency with the Shadcn config.

**Styling:** Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config.*` file — config is CSS-driven in `src/styles.css`). `tw-animate-css` is available. `src/styles.css` is intentionally excluded from Biome.

## Conventions enforced by tooling

- **Biome:** tab indentation, double quotes (JS), `organizeImports` runs as an assist action. Scope is limited to `src/**`, `.vscode/**`, `index.html`, and `vite.config.ts`. `src/routeTree.gen.ts` and `src/styles.css` are excluded — do not try to format them.
- **TypeScript:** `strict`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` are all on. Use `import type` for type-only imports; the compiler will fail otherwise.

## Deployment

Netlify, configured via `netlify.toml` and `@netlify/vite-plugin-tanstack-start`. The plugin auto-detects server functions / API routes and packages them as Netlify Functions during `vite build`. Publish dir: `dist/client`. No separate deploy script.
