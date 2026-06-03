# MacroMate

A macro calculator built with TanStack Start and React. Given your age, sex, weight, height, activity level, and goal, MacroMate computes your BMR, TDEE, and daily macro targets (protein, carbs, fat) across four diet presets.

## Features

- **BMR** — Mifflin-St Jeor equation for males and females
- **TDEE** — five activity multipliers (sedentary → extra active)
- **Goal adjustments** — cut (−20%), maintain, or bulk (+15%)
- **Diet presets** — balanced, high-protein, low-carb, keto
- **Unit conversions** — metric ↔ imperial (kg/lb, cm/ft-in)

## Tech Stack

| Area | Tool |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (SSR, React 19) |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based) |
| Data fetching | [TanStack Query](https://tanstack.com/query) |
| Forms | [TanStack Form](https://tanstack.com/form) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| UI components | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Validation | [Zod](https://zod.dev/) |
| Linting / Formatting | [Biome](https://biomejs.dev/) |
| Testing | [Vitest](https://vitest.dev/) |
| Component explorer | [Storybook](https://storybook.js.org/) |
| Deployment | [Netlify](https://netlify.com/) |

## Getting Started

```bash
pnpm install
pnpm dev        # starts dev server on http://localhost:3000
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server (port 3000) |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build locally |
| `pnpm test` | Run unit tests with Vitest |
| `pnpm lint` | Lint with Biome |
| `pnpm format` | Format with Biome |
| `pnpm check` | Lint + format check together |
| `pnpm storybook` | Start Storybook on port 6006 |
| `pnpm build-storybook` | Build static Storybook |

## Project Structure

```
src/
├── config/
│   └── app.ts               # App-wide config (name, social links)
├── features/
│   └── calculator/
│       ├── formulas.ts      # BMR, TDEE, macro-split logic + unit conversions
│       └── formulas.test.ts # Vitest unit tests for all formulas
├── components/
│   ├── ui/                  # shadcn/ui components (Button, Input, Select, …)
│   └── storybook/           # Storybook stories
├── integrations/
│   └── tanstack-query/      # TanStack Query client setup & devtools
├── routes/
│   ├── __root.tsx           # Root layout (head, shell, devtools)
│   └── index.tsx            # Home route
├── router.tsx
└── styles.css
```

## Calculator Logic

The core formulas live in `src/features/calculator/formulas.ts`:

1. **`bmr()`** — Mifflin-St Jeor equation
2. **`tdee()`** — BMR × activity multiplier
3. **`kcalForGoal()`** — applies a goal delta to TDEE
4. **`splitMacros()`** — distributes calories across protein, fat, and carbs based on a diet preset

### Diet Presets

| Preset | Protein (g/kg) | Fat (% of kcal) |
|---|---|---|
| Balanced | 1.6 | 30% |
| High-protein | 2.2 | 25% |
| Low-carb | 1.8 | 50% |
| Keto | 1.8 | 70% |

## Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add <component>
```

## Deploy to Netlify

1. Push this repo to GitHub
2. Go to [app.netlify.com/start](https://app.netlify.com/start) and import the repo
3. Netlify auto-detects the build settings from `netlify.toml`
4. Add any required environment variables under **Site settings → Environment variables**
5. Trigger the first deploy

## Author

[@masiu_cd](https://x.com/masiu_cd) · [masiucd.dev](https://masiucd.dev) · [GitHub](https://github.com/masiu_cd)
