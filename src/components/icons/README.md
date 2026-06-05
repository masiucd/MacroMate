# Icons

Icons are thin wrappers around [Lucide React](https://lucide.dev) components, built with a **Factory / Higher-Order Component** pattern.

## How it works

```ts
function createIcon(Icon: ComponentType<LucideProps>) {
  return ({ size = 20, className }: IconProps) => (
    <Icon size={size} className={className} role="img" />
  )
}
```

`createIcon` takes any Lucide component and returns a new React component that:

- Exposes only `size` and `className` — hiding the full Lucide API from consumers
- Defaults `size` to `20`
- Hardcodes `role="img"` for consistent accessibility

## Adding a new icon

1. Find the icon name on [lucide.dev](https://lucide.dev)
2. Add it to the import
3. Call `createIcon` and export the result with a descriptive name

```ts
// 1. Import
import { Flame } from "lucide-react"

// 2. Create & export
/** "Track your calories" */
export const CaloriesIcon = createIcon(Flame)
```

That's it — no boilerplate, no repeated prop wiring.

## Props

| Prop        | Type     | Default | Description                  |
|-------------|----------|---------|------------------------------|
| `size`      | `number` | `20`    | Width and height in pixels   |
| `className` | `string` | —       | Tailwind or CSS class names  |
