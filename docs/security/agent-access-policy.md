# Agent Access Policy

## Allowed initial capabilities

External agents may list and search approved components, documentation, examples, tokens, themes, and registry metadata. They may retrieve install commands and stable source files intended for consumers.

Browser agents may search documentation, open component pages, inspect public metadata, and copy approved examples or installation commands while the site is open.

## Disallowed initial capabilities

- Arbitrary filesystem paths or URL fetching.
- Repository writes, commits, releases, or package publishing.
- Shell command execution.
- Reading environment files, credentials, logs, delivery records, private reports, or restricted assets.
- Returning raw stack traces or host filesystem details to remote clients.

## Enforcement

- Resolve resource identifiers through a fixed mapping, not user-supplied paths.
- Normalise and validate every parameter before access.
- Return structured errors without filesystem disclosure.
- Apply response-size limits and content-type allowlists.
- Log tool name, result category, duration, and failure code without logging sensitive content.
- Mark future consequential tools so the host can require explicit user confirmation.

## Review trigger

Any authenticated remote transport, write operation, external API call, publishing action, or access to internal data requires an updated threat model and accepted ADR.

