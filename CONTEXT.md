# MacroMate — Project Context

AI agents working in this repo should read this file before making changes.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TanStack Router |
| Styling | Tailwind CSS v4 |
| Component library | shadcn/ui (install via `pnpm dlx shadcn@latest add <component>`) |
| Package manager | pnpm |

---

## Design tokens & Tailwind color utilities

### Rule: always use Tailwind utility classes, never arbitrary CSS-variable syntax in JSX

The app's design palette is declared as CSS variables in `src/styles.css` (`:root` / `.dark`).
Every token is **also registered** in the `@theme inline` block so Tailwind generates real utility classes.

```css
/* src/styles.css */
@theme inline {
  --color-sea-ink:        var(--sea-ink);
  --color-sea-ink-soft:   var(--sea-ink-soft);
  --color-lagoon:         var(--lagoon);
  --color-lagoon-deep:    var(--lagoon-deep);
  --color-palm:           var(--palm);
  --color-sand:           var(--sand);
  --color-foam:           var(--foam);
  --color-surface:        var(--surface);
  --color-surface-strong: var(--surface-strong);
  --color-line:           var(--line);
  --color-inset-glint:    var(--inset-glint);
  --color-kicker:         var(--kicker);
  --color-bg-base:        var(--bg-base);
  --color-header-bg:      var(--header-bg);
  --color-chip-bg:        var(--chip-bg);
  --color-chip-line:      var(--chip-line);
}
```

This means you get `text-*`, `bg-*`, `border-*`, `fill-*`, etc. for every token.

#### Correct usage in JSX/TSX

```tsx
// ✅ DO — Tailwind utility class
<p className="text-sea-ink">…</p>
<div className="border-line">…</div>
<span className="text-sea-ink-soft">…</span>
```

#### Patterns to avoid

```tsx
// ❌ DON'T — arbitrary Tailwind escape hatch
<p className="text-[var(--sea-ink)]">…</p>

// ❌ DON'T — inline style for design-token colors
<p style={{ color: "var(--sea-ink)" }}>…</p>

// ❌ DON'T — cva / cn with CSS-variable arbitrary syntax
cva("text-(--sea-ink)")  // old Tailwind v3 shorthand, also avoid
```

#### Exception: plain CSS files

Inside `.css` files (e.g. `src/styles.css`) and `color-mix()`/`linear-gradient()` expressions,
using `var(--token)` is correct and necessary — Tailwind utilities cannot be used there.

```css
/* ✅ fine in CSS */
.nav-link { color: var(--sea-ink-soft); }
```

Also fine: `appConfig.appStyle` in `src/config/app.ts` stores raw CSS values (`"var(--sea-ink)"`)
that are intentionally used as `style` property values in non-Tailwind contexts.

---

## Adding a new design token

1. Add the CSS variable to both `:root` and `.dark` in `src/styles.css`.
2. Add the `--color-<name>: var(--<name>)` mapping inside `@theme inline` in the same file.
3. Use the Tailwind utility (`text-<name>`, `bg-<name>`, etc.) everywhere in JSX.

---

## Typography components

Reusable typography primitives live in `src/components/typography.tsx`:

| Component | Element | Use for |
|---|---|---|
| `<Heading size="h1–h4">` | `h1`–`h4` | Page / section headings |
| `<Text variant="p/lead/large/small/muted">` | semantic | Body copy, captions |
| `<Strong>` | `<strong>` | Inline emphasis |
| `<Small>` | `<small>` | Fine print, labels |
| `<InlineCode>` | `<code>` | Inline code snippets |
| `<Blockquote>` | `<blockquote>` | Pull quotes |
| `<List>` | `<ul>` | Unordered lists |

Prefer these over ad-hoc elements to keep typographic styles consistent.
