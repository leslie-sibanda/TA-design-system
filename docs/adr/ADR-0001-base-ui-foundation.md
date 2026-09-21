# ADR-0001: Use Base UI as the Behavioural Foundation

- **Status:** Accepted
- **Date:** 2026-09-21

## Context

TeacherActive needs generic accessible components with a distinctive visual identity. Copying shadcn styling would constrain that identity, while adopting a styled library such as HeroUI would couple component APIs and visual decisions to an external system.

## Decision

Use Base UI as the unstyled behavioural primitive layer. TeacherActive owns component wrappers, public APIs, styling, tokens, icons, tests, documentation, and releases.

Use HeroUI as a reference for polish, state coverage, documentation, and theme ergonomics. Use the shadcn registry format only for distribution and installation.

## Consequences

- Accessible interaction mechanics do not need to be reimplemented.
- TeacherActive has full control over visual language and component APIs.
- Shared components must wrap Base UI consistently and avoid leaking unnecessary primitive details.
- Base UI upgrades require focused compatibility testing of wrappers and supported interaction states.

