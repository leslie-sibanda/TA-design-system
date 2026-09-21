# ADR-0004: Provide MCP and WebMCP Agent Access

- **Status:** Accepted
- **Date:** 2026-09-21

## Context

External coding agents need persistent structured access to component files and documentation. Browser agents need contextual access to the live documentation experience. These are different trust and lifecycle models.

## Decision

Provide:

- A read-only MCP server for component source, tokens, documentation, examples, registry metadata, and search.
- Progressive WebMCP tools for safe documentation search, navigation, component lookup, and install-command retrieval while the site is open.
- `llms.txt`, stable routes, and structured JSON endpoints as low-complexity fallbacks.

Initial agent interfaces cannot write repository files, execute arbitrary commands, or read arbitrary filesystem paths.

## Consequences

- MCP and WebMCP schemas become tested public interfaces.
- Path allowlists, output filtering, and schema validation are mandatory.
- Write-capable tools, authenticated remote access, and publishing actions require separate security review and ADRs.

