# ADR-0005: Expose canonical component documentation through progressive WebMCP

- **Status:** Accepted
- **Date:** 2026-09-23
- **Extends:** [ADR-0004: MCP and WebMCP agent access](./ADR-0004-agent-access.md)

## Context

Browser agents need component guidance without scraping visual layouts. External coding agents need the same information without an open browser tab. The design review approved per-component Markdown and proposed exposing it through WebMCP.

ADR-0004 establishes both read-only integration layers. This decision defines their shared documentation contract; it does not replace the external MCP server or broaden its permissions.

## Decision

Generate a public component-documentation record from canonical MDX content and component metadata. Use that record for the website, per-component Markdown, external Model Context Protocol (MCP) retrieval and browser WebMCP retrieval. Do not maintain separate hand-written agent guides.

Each component page places View Markdown and Copy Markdown in its Reference section. Public Markdown URLs, such as `/components/button.md`, and `llms.txt` discovery remain usable without WebMCP.

The initial browser documentation operation is a read-only component lookup by stable ID. The logical contract is:

```ts
get_component_docs({ id: "button" })
// Returns: { id, title, status, version?, sourceUrl, markdown }
```

The exact browser registration API and wire schema must be validated against the selected WebMCP implementation during scaffolding. This ADR does not assume browser support or establish an unverified browser API.

Feature-detect WebMCP and register the adapter only where supported. Unsupported browsers must retain navigation, search, public Markdown and copy actions. Browser tool availability is scoped to the open site; the external MCP server serves agents independently of that tab.

## Security boundaries

Resolve IDs through an approved component manifest. Validate input shape, enforce bounded output and return structured errors without filesystem information. Tools must not accept arbitrary paths, fetch arbitrary URLs, execute commands or write repository content.

Expose only public consumer documentation and metadata. Exclude private engineering records, credentials, unpublished assets and local design sessions. Omit unavailable version information rather than inventing release metadata. Label draft APIs and known limitations in the same way across human and agent outputs.

The documentation retrieval tool does not navigate the tab or write to the clipboard. Navigation and clipboard actions are separate capabilities and must not happen as hidden retrieval side effects. Future write operations or authenticated transports require separate security review under the existing policy.

## Alternatives considered

- **WebMCP-only documentation:** rejected because it requires browser support and an open tab.
- **Separate Markdown guides for agents:** rejected because guidance and supported APIs could drift from the human documentation.
- **HTML scraping:** rejected as the primary contract because presentation changes should not break agent retrieval.

## Consequences and verification

The site needs a deterministic documentation export pipeline and transport adapters that share its records. HTML, Markdown and agent outputs must agree on IDs, status, examples and supported APIs.

Before release, test schema validation, unknown IDs, traversal attempts, response limits and content parity. Test browser operation with WebMCP available and unavailable. Verify Markdown actions with keyboard input, clipboard failure and narrow viewports. Agent evaluations should confirm that unsupported props and unreleased components are not presented as supported.

Implementation has not started. The current design preview contains Markdown controls only; it does not register WebMCP tools or implement public Markdown routes. Further output and testing requirements are recorded in the [component Markdown contract](../architecture/component-markdown.md).
