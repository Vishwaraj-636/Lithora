# Meera M&G — Design System Rules

## Project

`d:\COHORT-2.0\project\Meera MandG\frontend`

## Theme: Permanently Dark

The UI is **always dark**. `class="dark"` is baked into `<html>` in `index.html`.

- **No theme toggle** anywhere in the app.
- **No `useDarkMode` hook** — do not use it.
- All components use direct dark values (never `dark:` conditional Tailwind classes).

## Design Tokens (dark — permanent)

| Token                  | Value     |
| ---------------------- | --------- |
| Page background        | `#18150f` |
| Card / panel surface   | `#211f1b` |
| Input background       | `#2a2620` |
| Border / divider       | `#3a322c` |
| Primary accent         | `#b58a5a` |
| Primary accent hover   | `#c49a68` |
| Text primary           | `#f2ede6` |
| Text secondary / muted | `#a9a49b` |
| Placeholder            | `#5a5048` |
| Drop zone / slot bg    | `#2a2218` |
| Upload icon bg         | `#2e2820` |

## Typography

- Body font: **Hanken Grotesk** (already loaded in `index.html`)
- Display/heading font: **Playfair Display** (auth pages only for editorial headings)
- Apply via `style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}` at root

## Dark Mode

- **Shared hook**: `src/shared/hooks/useDarkMode.js`
- localStorage key: **`meera-mg-theme`** (never use any other key)
- Toggles `dark` class on `<html>`
- Import: `import { useDarkMode } from '../../../shared/hooks/useDarkMode.js'`

## Component Conventions

### Input fields

- Auth pages (Login, Register): floating-label bottom-border style
- Form/admin pages (CreateProduct etc.): box-border label-above style
- Both use the same color tokens above

### Buttons — Primary

```
bg-[#9a7652] dark:bg-[#b58a5a]
hover:bg-[#785836] dark:hover:bg-[#c49a68]
text-white rounded-lg font-semibold
```

### Buttons — Secondary / Ghost

```
border border-[#d3c4b8] dark:border-[#3a322c]
text-[#1e1b16] dark:text-[#f2ede6]
hover:bg-[#f4ede4] dark:hover:bg-[#2a2218]
rounded-lg font-semibold
```

### Cards

```
bg-white dark:bg-[#211f1b]
border border-[#d3c4b8] dark:border-[#3a322c]
rounded-xl p-5 sm:p-7
```

### Section headings inside cards

```
text-[10px] sm:text-[11px] tracking-[0.08em] uppercase font-semibold
text-[#81756b] dark:text-[#a9a49b]
```

### Dividers

```
h-px bg-[#d3c4b8] dark:bg-[#3a322c]
```

## Responsive Layout (CreateProduct / form pages)

- Mobile (`< sm`): single column, 16px padding, full-width buttons stacked
- Tablet (`sm`): single column, 32px padding, side-by-side buttons
- Desktop (`lg+`): **two-column grid** (5/12 left · 7/12 right), 64px padding, max-width 1200px

## File Structure

```
src/
  shared/
    hooks/
      useDarkMode.js      ← single source of truth for dark mode
  features/
    auth/pages/
      Login.jsx
      Register.jsx
    products/pages/
      CreateProduct.jsx
```
