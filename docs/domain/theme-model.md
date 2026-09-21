# Theme Model

## Objective

All TeacherActive applications reuse the same component contracts while selecting an explicit visual theme. Themes may alter colour, typography, radius, density, elevation, and motion without altering semantics, accessibility, or component markup.

## Token layers

1. **Primitive tokens:** approved palette values, type families, spacing, radii, shadows, and motion timings.
2. **Semantic tokens:** purpose-based values such as surface, text, border, action, focus, success, warning, and danger.
3. **Component tokens:** narrowly scoped exceptions used only when semantic tokens cannot express a component requirement.

Shared components consume semantic and component tokens only.

## Theme selection

Applications apply a registered theme and mode at their root:

```html
<html data-ta-theme="client-portal" data-ta-mode="light">
```

The theme provider must support server-rendered initial values and avoid a flash of the wrong theme. A system or dark mode is available only where a complete, approved, accessible token mapping exists.

## Registration contract

Every app theme must provide:

- A unique stable ID and human-readable name.
- A CSS token mapping based on the TeacherActive semantic contract.
- Supported modes and density options.
- Theme-lab fixtures for all component states.
- Contrast and visual-regression baselines.
- Documentation describing intended use and meaningful deviations from the base theme.

Themes cannot override component DOM structure, ARIA behaviour, keyboard interaction, or public props.

