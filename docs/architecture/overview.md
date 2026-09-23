# Architecture Overview

## Purpose

The system provides reusable, accessible TeacherActive interface components for multiple applications, a documentation site, installable shadcn-compatible registry items, and structured access for coding and browser agents.

## Major parts

- **Documentation site:** Next.js App Router and Fumadocs render foundations, components, patterns, examples, and install instructions.
- **Component package:** `@teacheractive/ui` owns generic component APIs and styling built on Base UI behaviour.
- **Token package:** `@teacheractive/tokens` defines primitive, semantic, and exceptional component-level tokens.
- **Theme package:** `@teacheractive/themes` maps semantic tokens to the base brand and registered app themes.
- **Patterns package:** `@teacheractive/patterns` contains proven reusable compositions without contaminating generic primitives with product logic.
- **Registry:** shadcn-compatible metadata distributes the same canonical source as copy-into-project components, themes, and blocks.
- **Theme lab:** renders every state across every registered theme for visual review and regression testing.
- **Static agent records:** public component Markdown, discovery files and metadata serve agents with HTTP access. An external MCP server is deferred by [ADR-0007](../adr/ADR-0007-static-agent-access-without-external-mcp.md).
- **WebMCP adapter:** exposes safe, page-scoped documentation and navigation tools to supported browser agents.

## Dependency direction

```text
Base UI
   ↓
tokens → themes
   ↓       ↓
     shared UI → patterns → consuming apps
          ↓          ↓
        docs       registry
          ↓          ↓
        WebMCP   static agent records
```

Dependencies flow from foundations toward products. Tokens and shared UI must never depend on an application, documentation route, registry payload, or agent adapter.

## Core invariants

- One canonical component implementation feeds packages, documentation previews, registry payloads, and agent resources.
- Components consume semantic tokens rather than application colours.
- Application themes change presentation without changing component semantics or markup.
- Accessibility behaviour remains consistent across themes and distribution methods.
- Generated output is reproducible and never becomes an editable source of truth.

