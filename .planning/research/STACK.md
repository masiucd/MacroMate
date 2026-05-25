# Stack Research: Macro Calculator Web App

## Recommended Stack

### Framework
**TanStack Start (latest) + React** ⚠️ USER-LOCKED CHOICE
- TanStack Start is a full-stack React framework built on TanStack Router
- User explicitly requires the latest version of TanStack Start with React
- Vite is used internally by TanStack Start for bundling — no separate Vite config needed
- Confidence: Locked (not a recommendation — user decision)

**Previously considered: React 18 + Vite standalone** — superseded by TanStack Start decision.
**Alternative: Next.js** — not applicable given user's explicit framework choice.

### Styling
**Shadcn/ui + Tailwind CSS** ⚠️ USER-LOCKED CHOICE
- Shadcn/ui provides pre-built accessible components (inputs, buttons, selects, cards) that integrate with Tailwind
- Tailwind CSS for layout and utility styling
- Shadcn components are copy-pasted into the repo (not a dependency) — fully customizable
- Confidence: Locked (not a recommendation — user decision)

**Previously considered: Tailwind CSS alone** — superseded by Shadcn + Tailwind decision.

### State Management
**React useState / useReducer** (no external library)
- Wizard state (current step, collected values) fits cleanly in a single reducer
- No need for Redux/Zustand for an app this small
- Confidence: High

### Form Handling
**TanStack Form (latest)** ⚠️ USER-LOCKED CHOICE
- User explicitly requires TanStack Form — pairs naturally with TanStack Start
- Type-safe, headless form library with first-class validation
- Confidence: Locked (not a recommendation — user decision)

**Previously considered: React Hook Form** — superseded by TanStack Form decision.

### Language
**TypeScript**
- Macro calculation formulas benefit from strict typing (units: kg vs lbs, metric vs imperial)
- Catches unit/conversion bugs at compile time
- Confidence: High

### Testing
**Vitest + React Testing Library**
- Co-located with Vite, fast
- Test calculation logic as pure functions — critical for accuracy
- Confidence: High

### Deployment
**Vercel or Netlify** (static site)
- Zero-config deploy for Vite projects
- Free tier sufficient

## What NOT to Use

| Tech | Why not |
|------|---------|
| Next.js | SSR/SSG overhead for a stateless calculator |
| Redux/Zustand | Overkill for 3-step wizard state |
| Backend/DB | Explicitly out of scope — stateless |
| React Native / Expo | Mobile-first web covers the need |
| CSS Modules / Styled Components | Tailwind is faster for mobile-first layouts |

## Unit Handling Note

Support both metric (kg/cm) and imperial (lbs/ft+in). This is a table-stakes feature and needs to be in the architecture from day one — retrofitting unit conversion is painful.

---
*Written: 2025-05-25*
