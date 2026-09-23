# ADR-0007: Use WebMCP and static documentation without an external MCP server

- **Status:** Accepted
- **Date:** 2026-09-23
- **Partially supersedes:** ADR-0004, ADR-0005 and ADR-0006 where they require an external MCP server

## Decision

The initial release exposes agent-readable content through public static Markdown, `llms.txt` and feature-detected browser WebMCP tools. Defer the external Model Context Protocol (MCP) server entirely: do not scaffold a server package, transport, deployment or server-specific tests.

Generate the website, component Markdown and WebMCP records from the same canonical documentation and metadata. Keep View Markdown and Copy Markdown in each component's Reference section. Preserve the static GitHub Pages deployment and all read-only security boundaries.

## Rationale and trade-off

This meets the current documentation-discovery need without operating another service. WebMCP tools are available only to supported browser agents while the site is open. Other agents can retrieve the public Markdown and discovery files if they support ordinary web requests.

Static HTTP access is not an MCP transport. Agents that require MCP and cannot fetch public URLs will not be supported by this initial integration. That limitation is accepted rather than hidden behind a claim that WebMCP replaces every MCP use case.

## Scope and verification

Test exported content, base-path-aware URLs, discovery links, input validation, read-only browser tools and behaviour when WebMCP is unsupported. Do not require MCP Inspector, stdio transport or a server build in the initial CI pipeline.

Public records must not expose secrets, private repository files or arbitrary filesystem paths. WebMCP retrieval must not silently navigate, copy to the clipboard or perform writes. Earlier restrictions on future server capabilities remain security guidance, not an implementation requirement.

Reconsider an external MCP server only when a concrete consuming agent requires protocol access outside the browser. That addition needs a new scope decision, transport design, security review and tests. ADR-0004 and ADR-0005 remain historical records of the broader proposal; their canonical-content and safety decisions still apply.
