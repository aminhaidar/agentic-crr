# Operator design system

## Source of truth

Runtime design decisions live in `src/styles/tokens.css`. The tokens map Workiva
Unify conventions to the Operator's product semantics:

- Roboto is the bundled default typeface.
- `--op-*` variables are canonical application tokens.
- `prototype.css` aliases those tokens while legacy views are migrated.
- Tailwind and shadcn primitives map to the same semantic values.
- The Operator launchpad and conversational session share the `--op-dark-*`
  palette. Manual workspaces use the light enterprise palette.

The files under `design/unify/` remain reference material for the upstream Unify
token package; they are not a second runtime theme.

## Theme contexts

1. **Operator launchpad** — dark, minimal starting surface.
2. **Conversational session** — dark immersive control plane with a docked
   artifact preview.
3. **Manual workspace** — light, dense enterprise work surface.

Theme changes may alter layout density, but the font, interaction blue, status
semantics, focus treatment, radius scale, and component behavior must remain
consistent.

## Component rules

- New React surfaces use accessible primitives from `src/components/ui`.
- Native controls are acceptable when they retain semantic HTML, an accessible
  name, keyboard behavior, and token-based styling.
- Icon-only buttons require `aria-label`.
- Menus and disclosure buttons expose `aria-expanded`.
- Toggle controls use `role="switch"` and synchronized `aria-checked` until the
  legacy control is replaced by the Radix switch.
- Dialogs use the shared Radix dialog rather than adding another overlay system.
- Dense records, comparisons, forms, and evidence belong in the artifact preview;
  decisions and next actions remain in the Operator thread.

## Migration rule

Do not add new colors, font stacks, focus rings, radii, or z-index layers directly
to feature CSS. Add or reuse a semantic `--op-*` token first. Existing prototype
literals should be migrated opportunistically when their owning view moves to
React.
