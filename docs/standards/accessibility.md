# Accessibility Standard

## Baseline

Target WCAG 2.2 AA. Use native HTML semantics first and Base UI behaviour for complex interactive patterns.

## Component requirements

- Complete keyboard operation without pointer input.
- Visible focus that remains distinguishable in every app theme.
- Programmatic names, descriptions, errors, roles, states, and relationships.
- Correct focus entry, containment, restoration, and escape behaviour for overlays.
- Minimum target sizes appropriate to the product context.
- No colour-only communication of state.
- Support for 200% zoom, browser text scaling, reduced motion, and forced colours.
- Accessible loading, empty, error, disabled, read-only, and validation states.

## Theme requirements

- Validate text, icon, border, focus, control, and status contrast for each theme and mode.
- Preserve semantic status meaning across applications.
- Do not disable outlines without an equivalent visible focus indicator.
- Dark mode is unavailable until the complete token set passes the same checks as light mode.

## Verification

Use automated accessibility checks for broad coverage and keyboard/screen-reader review for interaction contracts. Record known exceptions with owner, impact, workaround, and resolution date.

