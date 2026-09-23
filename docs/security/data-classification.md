# Data Classification

## Public

Published documentation, stable component source, registry metadata, public examples, design tokens approved for distribution, package metadata, and `llms.txt` content.

## Internal

Draft RFCs, delivery records, unpublished roadmap material, evaluation inputs, review findings, internal app theme plans, and non-public design assets.

## Restricted

Security findings, private vulnerability reports, unpublished credentials, customer or candidate data, access tokens, signing keys, and production configuration.

## Handling rules

- Public data may be exposed through docs, registry files, static agent records and WebMCP after review. External MCP is deferred under ADR-0007.
- Internal data may be available to authenticated repository collaborators but is excluded from public endpoints and default agent resources.
- Restricted data must never enter client bundles, public docs, examples, fixtures, prompts, generated reports, MCP responses, or registry payloads.
- Test and example data must be synthetic and must not resemble real personal records closely enough to be mistaken for production data.
- Generated reports containing repository paths or source excerpts inherit the highest classification of their inputs.

