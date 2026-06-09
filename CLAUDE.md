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
- `pnpm build-storybook` — static Storybook build
- `pnpm dlx shadcn@latest add <component>` — add a Shadcn component (do not write Shadcn primitives by hand; the project tracks the official registry)

There is no typecheck script. Run `pnpm exec tsc --noEmit` if you need a standalone type pass.

Netlify local dev (proxied) runs on port 8888 and forwards to Vite at 3000 (`netlify.toml`).

## Architecture

**Read `CONTEXT.md` first.** It is the source of truth for the design-token / Tailwind-utility rule and the typography primitives. The rules in CONTEXT.md override any temptation to reach for `var(--token)` or inline styles in JSX.

**Framework:** TanStack Start (SSR React 19 on Vite). Entry-less — the router itself is the app entry. `src/router.tsx` builds the router via `getRouter()`, wires SSR + TanStack Query through `setupRouterSsrQueryIntegration`, and uses the auto-generated `src/routeTree.gen.ts`. Do not edit `routeTree.gen.ts` — the TanStack Router Vite plugin regenerates it from `src/routes/`.

**Routing:** File-based under `src/routes/`. `__root.tsx` defines the HTML shell, head metadata, and devtools panel. Routes get `queryClient` from router context (typed via `createRootRouteWithContext<MyRouterContext>`), so loaders can call `queryClient.ensureQueryData(...)` directly. Server functions and API routes live alongside routes (see README for `createServerFn` and `server.handlers` patterns).

**State / data:** A single `QueryClient` is created in `src/integrations/tanstack-query/root-provider.tsx#getContext` and threaded through the router context. SSR query hydration is handled by `setupRouterSsrQueryIntegration` — no manual `<QueryClientProvider>` wrapping is needed in routes.

**Domain layer:** Pure logic lives under `src/features/<feature>/` — currently `src/features/calculator/` with `formulas.ts` (BMR, TDEE, macro-split, unit conversions), `schema.ts` (Zod input validation), and colocated `*.test.ts` files. Keep domain code free of React/router imports so it can be unit-tested with Vitest in isolation. New domain logic should follow the same `features/<name>/{logic,schema,test}` layout.

**App-wide config:** `src/config/app.ts` holds app metadata (name, social links, `appStyle` raw CSS values). `appStyle` is the one sanctioned place for `var(--token)` strings consumed as inline `style` props (see CONTEXT.md exception).

**React Compiler is on.** `vite.config.ts` enables `babel-plugin-react-compiler` via `@rolldown/plugin-babel`. Avoid hand-rolled `useMemo`/`useCallback` for referential stability unless profiling shows the compiler missed it.

**UI layers — keep them distinct:**
- `src/components/ui/*` — Shadcn primitives generated via the CLI (style: `new-york`, base color: `zinc`, icons: `lucide`). Configured by `components.json`. Consumed by app code; do not hand-edit.
- `src/components/storybook/*` — handwritten wrapper components paired with `.stories.*` files. Storybook only globs `src/**/*.stories.*`. Keep stories next to the wrapper, not next to the raw `ui/` primitives.
- `src/components/wrappers/*` — composed building blocks that wrap `ui/` primitives with project styling.
- `src/components/icons/*` — icon factory wrappers over `lucide-react`. Use these instead of importing from `lucide-react` directly.
- `src/components/typography.tsx` — semantic typography primitives (`<Heading>`, `<Text>`, `<Strong>`, etc.). Prefer these over ad-hoc `<h1>`/`<p>` tags. See CONTEXT.md for the full table.

**Path aliases:** `#/*` and `@/*` both map to `src/*` (see `tsconfig.json` and `package.json#imports`). `components.json` uses the `#/` form — prefer `#/` for consistency with the Shadcn config.

**Styling:** Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config.*` file — config is CSS-driven in `src/styles.css`). `tw-animate-css` is available. `src/styles.css` is intentionally excluded from Biome.

Design tokens are declared as CSS variables in `:root` / `.dark` and re-exported through `@theme inline` so every token has a generated Tailwind utility (`text-sea-ink`, `bg-lagoon`, `border-line`, …). **In JSX/TSX, always use the utility class. Never use `text-[var(--token)]`, inline `style={{ color: "var(--token)" }}`, or `cva("text-(--token)")`.** The only sanctioned `var(--token)` consumers in TS are plain `.css` files and `appConfig.appStyle` in `src/config/app.ts`. Adding a new token: add to `:root` + `.dark`, add the `--color-<name>` mapping inside `@theme inline`, then use the utility. Full rationale in `CONTEXT.md`.

## Conventions enforced by tooling

- **Biome:** tab indentation, double quotes (JS), `organizeImports` runs as an assist action. Scope is limited to `src/**`, `.vscode/**`, `index.html`, and `vite.config.ts`. `src/routeTree.gen.ts` and `src/styles.css` are excluded — do not try to format them.
- **TypeScript:** `strict`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` are all on. Use `import type` for type-only imports; the compiler will fail otherwise.

## Deployment

Netlify, configured via `netlify.toml` and `@netlify/vite-plugin-tanstack-start`. The plugin auto-detects server functions / API routes and packages them as Netlify Functions during `vite build`. Publish dir: `dist/client`. No separate deploy script.
