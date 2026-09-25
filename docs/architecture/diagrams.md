# Architecture diagrams

The architecture diagrams live in Miro. This page links to them so the repository stays the entry point. The Miro boards need TeacherActive team access.

The originals are on the **System Architecture** board. Copies for the Technical Documentation flow are on the **Technical Diagrams** board. Edit the original first, then refresh the copy.

| Diagram | Shows | Original | Copy |
| --- | --- | --- | --- |
| System Architecture: product view | Layers from tokens to consuming apps, how apps install components, agent access routes, and the status of each part | [System Architecture board](https://miro.com/app/board/uXjVHin2SLs=/?moveToWidget=3458764684991837386) | [Technical Diagrams board](https://miro.com/app/board/uXjVHinoFAs=/?moveToWidget=3458764684995289153) |
| Delivery pipeline | How a change reaches GitHub Pages: pull request, verify, merge, deploy, rollback, and planned stages | [System Architecture board](https://miro.com/app/board/uXjVHin2SLs=/?moveToWidget=3458764684992668406) | [Technical Diagrams board](https://miro.com/app/board/uXjVHinoFAs=/?moveToWidget=3458764684995289154) |
| Contribution and release flow | [RFC-0001](../rfc/RFC-0001-component-lifecycle.md) lifecycle by role, with the decision owners | [System Architecture board](https://miro.com/app/board/uXjVHin2SLs=/?moveToWidget=3458764684993699057) | [Technical Diagrams board](https://miro.com/app/board/uXjVHinoFAs=/?moveToWidget=3458764684995289155) |

## Related boards

- [Product Brief](https://miro.com/app/board/uXjVHins-ds=/): the brief these diagrams answer.
- [Technical Brainstorm](https://miro.com/app/board/uXjVHin2_0U=/): problem, principles, current and future state, and the summary doc.
- [Technical Documentation](https://miro.com/app/board/uXjVHinuRBA=/): the template board for technical documentation generated from the diagrams.

## Keeping them current

Each diagram marks status with a coloured dot: built, partly built, decided but not built, undecided or deferred. When a slice in the [technical solution design](../superpowers/specs/2026-09-25-technical-solution-design.md) ships, update the dot on the original and refresh the copy. The repository stays the source of truth for decisions; the diagrams illustrate them.
