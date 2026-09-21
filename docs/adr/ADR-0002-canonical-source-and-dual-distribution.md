# ADR-0002: Use One Canonical Source with Dual Distribution

- **Status:** Accepted
- **Date:** 2026-09-21

## Context

Known TeacherActive applications benefit from centrally versioned dependencies. Standalone projects and coding agents benefit from shadcn-style source installation. Maintaining separate implementations would cause API, behaviour, and documentation drift.

## Decision

Keep canonical components in `packages/ui`, tokens in `packages/tokens`, themes in `packages/themes`, and reusable compositions in `packages/patterns`.

Publish that source through two channels:

- Versioned workspace/npm packages for managed upgrades.
- A shadcn-compatible registry for copy-into-project installation.

Documentation previews, examples, registry payloads, MCP resources, and tests must resolve from the canonical package files.

## Consequences

- Package and registry releases must be generated and tested together.
- Registry metadata may reference package source, but generated payloads cannot become editable source.
- Compatibility policy must cover both import-based and copied-source consumers.

