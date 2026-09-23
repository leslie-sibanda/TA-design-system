# Component Markdown and agent access

## Status and intent

Accepted design direction; production implementation is pending. [ADR-0005](../adr/ADR-0005-webmcp-component-documentation.md) records the shared Markdown and WebMCP decision, extending [ADR-0004](../adr/ADR-0004-agent-access.md) without broadening its permissions. The [design status](../design/site-design-status.md) records the approved interface and known gaps.

Every component detail page offers **View Markdown** and **Copy Markdown** in its Reference section. Humans and agents should retrieve the same guidance without scraping the visual site or depending on browser-agent support.

The HTML design preview implements these actions for Button, Input, Tabs and Alert in their Reference sections. View Markdown opens a selectable-text dialog; Copy Markdown attempts clipboard access and falls back to that dialog. It derives Markdown from the displayed preview documentation, including API tables, and labels it as draft. Browser interaction verification remains pending. It does not implement production endpoints, MCP or WebMCP. The preview converter is disposable, not the production content pipeline.

## Canonical content

Public guidance remains under `content/docs/`. Component metadata supplies stable IDs, lifecycle status, imports, source references and version information. Implementation stays in `packages/ui/`.

Generate rendered documentation and plain Markdown from the same canonical content and metadata. Do not maintain a second hand-written guide in each package. Transform MDX presentation elements explicitly: include example source, preserve tables and code fences, and omit interactive controls. Do not export raw JSX or silently discard meaningful guidance.

Each Markdown document includes:

- Component ID, name, lifecycle status and available version/provenance information.
- Purpose and when to use or avoid the component.
- Validated installation instructions and import paths.
- Supported API, variants, sizes and states.
- Correct examples and unsupported patterns to avoid.
- Accessibility and keyboard requirements, plus known limitations.
- Semantic token and theme guidance.
- Canonical documentation and source links.

Draft APIs must be marked as illustrative. Never invent release versions, supported props or installable packages. Known accessibility limitations must remain visible in agent output; the current white-on-brand-orange button proposal has an unresolved contrast issue.

## Human and HTTP interfaces

- Proposed route: `/components/{id}.md`, for example `/components/button.md`.
- Return UTF-8 plain Markdown with `Content-Type: text/markdown; charset=utf-8`.
- Resolve IDs through the component manifest; unknown IDs return 404.
- View Markdown opens the public Markdown URL; Copy Markdown copies the same content and announces success accessibly.
- Clipboard failure offers readable, selectable Markdown rather than falsely reporting success.
- `llms.txt` lists discoverable Markdown URLs. Any full-document export uses the same content graph.

Ordinary links and HTTP access remain available when WebMCP is unsupported.

## MCP and WebMCP

Proposed tool contract:

```ts
get_component_docs({ id: "button" })
// -> { id, title, status, version?, sourceUrl, markdown }
```

The external MCP server and progressively enhanced browser WebMCP adapter consume the same read-only records. Exact registration APIs and transport schemas must be checked against the chosen implementations during scaffolding; they are not specified by this preview.

Validate a bounded component ID against a fixed manifest. Accept no paths, arbitrary URLs or write operations. Apply response-size limits and structured errors without exposing filesystem details. Follow the [agent access policy](../security/agent-access-policy.md).

## Verification before release

- Contract tests for known and unknown IDs, content type, output schema and size limits.
- Rejection tests for path traversal, arbitrary URLs and unsupported parameters.
- Markdown export tests covering tables, links, code fences, MDX examples and lifecycle metadata.
- Parity tests between HTML documentation, Markdown endpoints and agent records.
- Compile examples against canonical component APIs.
- Browser tests for view/copy actions, clipboard failure, keyboard focus, mobile layout and operation without WebMCP.

These checks supplement the repository testing standard. No production access capability is complete merely because its preview control exists.
