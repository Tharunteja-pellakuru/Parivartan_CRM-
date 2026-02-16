# Parivartan CRM Design System

## 1. Typography System

**Font Family**: `Inter`, system-ui, sans-serif
**Base Font Size**: `14px` (0.875rem) - Chosen for data-dense CRM interfaces.
**Line Height**: `1.5` (Content), `1.2` (Headings/Compact)

### Scale

| Level | Size (px) | Size (rem) | Weight  | Use Case                  |
| ----- | --------- | ---------- | ------- | ------------------------- |
| H1    | 24px      | 1.5rem     | 900     | Page Titles               |
| H2    | 20px      | 1.25rem    | 800     | Section Headers           |
| H3    | 16px      | 1rem       | 700     | Card Titles               |
| Body  | 14px      | 0.875rem   | 400/500 | Standard Content          |
| Small | 12px      | 0.75rem    | 500     | Meta text, Labels         |
| Tiny  | 10px      | 0.625rem   | 700     | Badges, Uppercase Headers |

## 2. Spacing System

Base unit: `4px` (0.25rem)

| Variable  | Value | Tailwind | Use Case                            |
| --------- | ----- | -------- | ----------------------------------- |
| --space-1 | 4px   | 1        | Tight gaps, icon padding            |
| --space-2 | 8px   | 2        | Element spacing, small card padding |
| --space-3 | 12px  | 3        | Medium gaps, standard padding       |
| --space-4 | 16px  | 4        | Section gaps, comfortable padding   |
| --space-5 | 20px  | 5        | Component separation                |
| --space-6 | 24px  | 6        | Major layout sections               |

## 3. Component Standards

**Cards**:

- Background: `#FFFFFF`
- Border: `1px solid #E2E8F0` (slate-200)
- Radius: `12px` (rounded-xl) or `16px` (rounded-2xl) for containers.
- Padding: `--space-4` (16px) to `--space-6` (24px)
- Shadow: `shadow-sm` or `shadow-md` for distinct layers.

**Buttons**:

- Height: `36px` - `44px`
- Padding: `0.75rem` (12px) horizontal
- Radius: `12px` (rounded-xl)
- Typography: Uppercase, tracking-widest, bold.

**Iconography**:

- Standard Size: `18px` (1.125rem) approx
- Stroke Width: `2px` or `3px` (bold)
- Color: Muted by default, Primary/Secondary on active/hover.

## 4. Accessibility

- **Contrast**: Text `#1C1C1C` on `#F6F9F4` passes AAA. Muted text `#5F7A61` passes AA.
- **Responsiveness**:
  - Mobile: H1 scales down to 20px.
  - Sidebar: Collapses or hides.
  - Padding: Reduces to `--space-3` or `--space-4` on mobile.
