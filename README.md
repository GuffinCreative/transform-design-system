# TransformSEO Design System

A component library and token system for the TransformSEO SaaS platform, built on shadcn/ui, Tailwind CSS, and Radix UI primitives.

## Structure

```
transform-design-system/
├── tokens/                  # Design tokens
│   ├── colors.ts            # Brand, accent, neutral, semantic colors
│   ├── typography.ts        # Font families, sizes, weights
│   ├── spacing.ts           # Spacing scale, border radius, shadows
│   └── index.ts
├── components/
│   └── ui/                  # shadcn/ui components
│       ├── button.tsx
│       ├── badge.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/
│   └── utils.ts             # cn() helper (clsx + tailwind-merge)
├── styles/
│   └── globals.css          # CSS custom properties + Tailwind directives
├── docs/                    # Component documentation
├── tailwind.config.ts
└── tsconfig.json
```

## Getting Started

### Install dependencies

```bash
npm install tailwindcss @radix-ui/react-slot class-variance-authority clsx tailwind-merge
npm install -D typescript @types/react @types/react-dom
```

### Import styles

In your app entry point:

```ts
import "@transform-design-system/styles/globals.css";
```

### Use components

```tsx
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from "@transform-design-system/components";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyword Rankings</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button>Run Audit</Button>
        <Badge variant="success">Tracking</Badge>
      </CardContent>
    </Card>
  );
}
```

## Tokens

### Colors

| Scale | Usage |
|-------|-------|
| `brand.500` | Primary actions, links |
| `accent.500` | Highlights, badges |
| `neutral.*` | Text, borders, backgrounds |
| `success/warning/error` | Semantic status |

### Adding shadcn/ui Components

Install additional components via the shadcn CLI:

```bash
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add table
```

Place generated files in `components/ui/` and export from `components/index.ts`.

## Dark Mode

Dark mode is supported via the `.dark` class on the root element. CSS custom properties in `styles/globals.css` handle all color switching automatically.
