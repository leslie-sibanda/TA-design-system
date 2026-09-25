# RFC-0002: App Theme Registration

- **Status:** Proposed
- **Owners:** Design System Team and App Owner

## Goal

Allow applications to style shared components through a controlled token contract without creating component forks.

## Required theme record

Each theme registers:

- Stable ID, display name, owner, and supported applications.
- Parent theme, normally `teacheractive`.
- Supported light/dark modes and density settings.
- CSS entry point and registry item name.
- Documented token overrides and rationale.
- Theme-lab fixture and visual baseline.

## Validation

A theme is accepted only when:

- Every required semantic token resolves.
- Text, non-text, focus, and status contrast meet the accessibility standard.
- All shared component states render without clipping or unreadable combinations.
- Forced colours, reduced motion, zoom, and text scaling remain usable.
- A registry-installed theme produces the same result as the docs preview.

## Change policy

Adding an optional token is minor. Changing the meaning of an existing token is breaking. Removing or renaming a token requires a migration period. App themes cannot introduce undocumented component selectors to bypass the token contract.

