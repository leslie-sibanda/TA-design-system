# Technical Solution Design: TeacherActive Design System

- **Date:** 2026-09-25
- **Status:** Draft for owner review
- **Source:** Product Brief (Miro board "Product Brief", `uXjVHins-ds=`), 13 sections
- **Approach:** Diagram-first. The System Architecture diagram is drawn first, then the Technical Brainstorm frames and summary are derived from it and from this repository.

## 1. Purpose and scope

This document is the technical solution for the Product Brief. It maps every brief requirement to a design decision in this repository, states what is decided, built and missing, and sets the build order for the remaining slices.

It inherits the accepted decisions in ADR-0001 to ADR-0007 and does not reopen them. If a brief requirement conflicts with an ADR, this document flags the conflict in section 6 and leaves the ADR unchanged.

**Out of scope for this pass:** the Miro "Technical Documentation" and "Cloud Architecture" boards (a static GitHub Pages site has one deployment box, so a cloud diagram adds nothing), repository code changes, and the production CI/CD improvements plan (`docs/superpowers/plans/2026-09-24-production-cicd-improvements.md`), which is unapproved and tracked separately.

## 2. Architecture

The architecture follows [`docs/architecture/overview.md`](../../architecture/overview.md). Dependencies flow from foundations toward products; tokens and shared UI never depend on an application, documentation route, registry payload or agent adapter.

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

### Layers and status

Status was verified against the filesystem on 2026-09-25.

| Layer | Component | Status | Evidence |
| --- | --- | --- | --- |
| Foundations | Base UI | Dependency only (`@base-ui/react`) | `package.json`; no shared component uses it yet |
| Foundations | `@teacheractive/tokens` | Built, minimal | `packages/tokens/src/primitive.css`, `semantic.css` |
| Foundations | `@teacheractive/themes` | Built, base theme only | `packages/themes/src/teacheractive.css`; no app themes (RFC-0002 proposed) |
| Components | `@teacheractive/ui` | Not built | No `packages/ui/` |
| Components | `@teacheractive/patterns` | Not built | Created only after demonstrated reuse (`AGENTS.md`) |
| Distribution | shadcn-compatible registry | Decided, not built | ADR-0002; no `registry/` or `registry.json` |
| Distribution | Theme lab | Decided, not built | Master plan |
| Distribution | Styling canvas | Design accepted, not built | `docs/design/site-design-status.md`; `/styling` is a placeholder |
| Delivery and access | Fumadocs static site (GitHub Pages export) | Built | Homepage, catalogue, four proposal pages, Foundations, Contributing, Pages, Styling placeholders |
| Delivery and access | Static search | Built | `src/app/api/search/route.ts` |
| Delivery and access | CI verify, then deploy | Built, never run on GitHub | `.github/workflows/`; Pages settings not configured |
| Delivery and access | Static Markdown and `llms.txt` | Decided, not built | ADR-0005, ADR-0007 |
| Delivery and access | WebMCP adapter | Decided, not built | ADR-0005 |
| Delivery and access | External MCP server | Deferred | ADR-0007 |
| Consumers | Client Portal, New Tabs | Undecided | Brief §13 lists them as candidate first adopters |

The four component pages (Alert, Button, Input, Tabs) are proposals with prototype previews, not implementations of shared components.

## 3. Traceability

Each row cites the repository document that holds the decision. A row marked **Gap** has no decision behind it yet.

| Brief section | Requirement | Design decision | Status | Slice |
| --- | --- | --- | --- | --- |
| §1 Overview | One trusted place for components, foundations, themes, docs, install guidance and agent-readable resources | `architecture/overview.md` | Partial: site, tokens, one theme | All |
| §2 Background | A single TeacherActive-owned source of truth, managed by the development team with design and marketing input | ADR-0002, ADR-0001 | Decided. **Gap:** governance and sign-off process | 0 |
| §3 Problem | Reduce duplicated effort; ground AI-assisted work in approved material | ADR-0005, ADR-0007, `security/agent-access-policy.md` | Decided, not built | 6, 7 |
| §4 Objectives | Reuse approved components | ADR-0002; `packages/ui/` per `AGENTS.md` | Not built | 2 |
| §4 Objectives | Faster new work from foundations, layouts, examples, accessibility guidance | Foundations page; standards under `docs/standards/` | Partial | 2, 3 |
| §4 Objectives | Consistent products with app-specific themes | ADR-0003, RFC-0002 | Base theme built; app themes proposed | 4 |
| §4 Objectives | Shared review against one source of truth | Documentation site | Built for proposals only | 3 |
| §4 Objectives | AI workflows retrieve approved guidance | ADR-0005, `architecture/component-markdown.md` | Not built | 6, 7 |
| §5 Audience | Developers, designers, product owners, marketing, agents | `design/site-design-status.md` audience section | Human surfaces built; agent surfaces not | 6, 7 |
| §6 Value | Internal ownership, no external library lock-in | ADR-0001 (Base UI, HeroUI as reference only) | Decided | 2 |
| §6 Value | Guardrails for AI-assisted delivery | ADR-0007; `security/threat-model.md` | Decided, not built | 6, 7 |
| §7 Scope | Static Next.js and Fumadocs site | ADR-0006 | Built | 1 |
| §7 Scope | Foundations: colour, typography, spacing, accessibility, brand | `domain/brand-language.md`; `content/docs/foundations.mdx` | Partial | 1, 2 |
| §7 Scope | Catalogue of proposed components | `domain/component-taxonomy.md`; `content/docs/components/` | Four proposals | 3 |
| §7 Scope | Canonical component architecture (packages, tokens, themes) | ADR-0002, ADR-0003 | Decided, not built | 2 |
| §7 Scope | shadcn-compatible registry | ADR-0002; master plan "shadcn registry" | Decided, not built | 5 |
| §7 Scope | Static Markdown and discovery records | ADR-0005, ADR-0007 | Decided, not built | 6 |
| §7 Scope | Styling canvas and theme lab | `design/site-design-status.md` (Styling) | Design accepted, not built | 4 |
| §7 Out of scope | External MCP server, unapproved forks, unproven one-off workflows | ADR-0007; `AGENTS.md` | Decided | n/a |
| §8 Requirements | Documentation for people: when to use, behaviour, accessibility, brand | `standards/documentation.md` | Partial | 3 |
| §8 Requirements | One canonical source for docs, examples, registry items and tests | ADR-0002 | Decided, not built | 2, 5 |
| §8 Requirements | Multiple apps through semantic tokens and themes | ADR-0003, RFC-0002 | Base only | 4 |
| §8 Requirements | Safe agent access, no secrets, no repository writes | `security/agent-access-policy.md`, ADR-0007 | Decided, not built | 6, 7 |
| §8 Requirements | Automated checks: types, lint, unit, accessibility, browser, export, registry, agent content | `standards/testing-and-evals.md`; `scripts/check` | Types, lint, unit, export, browser and accessibility built; registry and agent checks not | 5, 6, 7 |
| §9 Journey | Find foundations, choose approved components | Documentation site | Built for proposals | 3 |
| §9 Journey | Copy an install command that matches canonical source | Registry (ADR-0002) | Not built | 5 |
| §9 Journey | Review guidance, states and examples without reading source | Component page layout in `design/site-design-status.md` | Partial: Button follows it; Input, Tabs, Alert still need source panels | 3 |
| §9 Journey | AI reads approved Markdown and discovery records | ADR-0005 | Not built | 6 |
| §10 Constraints | Brand assets and accessible colour decisions | `design/assets/README.md`; `#182B3A` on `#F57D00` (about 5.43:1) approved 2026-09-23 | Resolved | 1 |
| §10 Constraints | Static GitHub Pages, Base UI, tokens and themes, generated registry | ADR-0006, ADR-0001, ADR-0003, ADR-0002 | Decided | n/a |
| §10 Constraints | Follow-on work: shared components, registry release checks, WebMCP registration, screen-reader review, real deployment | `delivery/handoffs/current.md` | Open | 0 to 7 |
| §11 Milestones | Seven delivery slices | Section 4 of this document | Slice 1 complete | 1 to 7 |
| §12 Metrics | Components implemented, adoption, time saved, accessibility passing, AI tasks grounded | Accessibility checks (axe) run in `pnpm check` locally and are configured for CI, which has never run on GitHub. **Gap:** no mechanism defined for adoption, time saved or grounded AI tasks | Partial | 7 |
| §13 Questions | Agent access level after the static and WebMCP foundation | ADR-0007; `security/agent-access-policy.md` (read-only, no writes, no secrets; any wider access needs a new ADR and threat model) | Decided | 6, 7 |
| §13 Questions | First adopters, first release components, governance, sign-off | None yet | **Gap** | 0 |
| §13 Risks | Docs-only outcome, teams bypass the system, examples drift, brand drift, poor AI output, stale iteration | Canonical-source rule (ADR-0002), RFC-0001, RFC-0002, static generation from canonical content. **Gap:** no mitigation for "stale development and iteration on the site" | Partial | 2 to 7 |

## 4. Build order

The brief lists seven slices. Slice 0 is added here because the scaffold has never been deployed and several settings need an owner. Slice 1 is complete.

| Slice | Deliverable | Depends on | Additional gates beyond `pnpm check` |
| --- | --- | --- | --- |
| 0 | First real deployment: set Pages source to GitHub Actions, restrict the `github-pages` environment to `main`, make verification jobs required checks, run CI once including WebKit | Owner permissions | Green CI run on GitHub; WebKit passes; deployed site reachable at the correct base path |
| 1 | Static scaffold and approved visual direction | none | Complete |
| 2 | Canonical components in `packages/ui/` on Base UI, tokens and semantic themes | 1 | Unit and accessibility tests per component; states render under the base theme |
| 3 | Catalogue expansion: live previews, API tables, install examples | 2 | Docs source matches distributed source |
| 4 | Theme support, RFC-0002 app theme registration, Styling canvas and theme lab | 2, 3 | Contrast, focus, forced-colour, reduced-motion and text-scaling checks across all registered themes |
| 5 | Registry generation and install verification | 2 | `pnpm dlx shadcn@latest registry validate`; package and registry installs produce equivalent APIs |
| 6 | Static Markdown, `llms.txt`, `llms-full.txt`, JSON metadata | 2, 3 | Exported bytes and public URLs checked; retrievable without WebMCP |
| 7 | WebMCP adapter, then adoption in Client Portal and New Tabs | 6 | WebMCP accepts only approved record IDs and rejects arbitrary paths or URLs; site works without WebMCP; agent evals pass |

Slices 5 and 6 both depend only on slices 2 and 3, so they can run in parallel. See open question 3 in section 6.

## 5. Miro deliverables

All Miro work targets the live set of boards (`uXjVHin…`). The duplicate set (`uXjVHig…`) is an untouched template and is left alone. The Product Brief board is read only.

1. **System Architecture** (`uXjVHin2SLs=`): a diagram widget holding the layered diagram from section 2 (section 8 explains why it is not inside a frame), each box tagged Built, Decided (ADR) or Not built. Consuming apps appear as dashed placeholders. The external MCP server appears in a dashed box labelled "Deferred (ADR-0007)". The board's template diagram widget is left as is, because it is filled by Miro's own AI and cannot be driven from here.
2. **Technical Brainstorm** (`uXjVHin2_0U=`): the four frames, each note citing its source.
   - Problem: brief §2 and §3.
   - Design Principles: `AGENTS.md` and ADR-0001 to ADR-0007.
   - Current State: the status table in section 2 and `delivery/handoffs/current.md`.
   - Future State: section 4 and the open questions in section 6.
3. **Summary doc** on the Technical Brainstorm board, written directly because the Generate Summary button cannot be pressed from here. It contains the goal, one paragraph of architecture, the decisions taken, the gaps and the build order.

**Consistency rule:** the decision list in the summary doc and the decision list in this document must match. Any difference is a defect in one of them and is fixed before work is reported complete.

## 6. Open questions, conflicts and documentation drift

**Open questions**

1. Which products adopt first, Client Portal or New Tabs? This decides which components slice 2 builds first (brief §13).
2. Who owns governance, contribution review and release approval, and how do design, marketing and development sign off brand changes (brief §13)? RFC-0001 (proposed) names the Design System Team as owner and has a review step for API, visual, accessibility, QA and security findings, but it does not cover brand sign-off by marketing and design or release approval.
3. **Slice order.** The brief puts the registry (5) before Markdown (6); `docs/design/site-design-status.md` puts Markdown first. Both depend only on slices 2 and 3. Recommendation: build Markdown and `llms.txt` first, because it is cheaper and delivers agent value sooner, and run the registry in parallel once slice 2 lands.
4. How will adoption, time saved and grounded AI tasks be measured (brief §12)? Nothing is defined.
5. What is the mitigation for "stale development and iteration on the site" (brief §13)? The brief names the risk but no mechanism.

**Documentation drift to fix before the first deployment**

- **Base path casing.** `README.md` (lines 32 and 40) says `/TA-design-system`. The workflow (`verify-site.yml`, commit `2d9ac70`) and ADR-0006 use lowercase `/ta-design-system`. The lowercase form was a deliberate change, so the README is likely stale. Confirm the real Pages URL on the first deployment and align every reference.
- **Master plan summary.** `docs/agent-ready-design-system-plan.md` still says the repository has "no scaffolded Next.js app" and "no CI workflow", which is no longer true.

## 7. Verification

- Status tags are checked against the filesystem before each Miro write.
- After each Miro write, the board is re-read and compared with this document.
- The summary doc and this document are diffed on their decision lists (section 5).
- Repository changes that follow from this design run the shared `pnpm check`, with `PLAYWRIGHT_PROJECTS=chromium,mobile,firefox` locally and all engines in CI.

## 8. Published boards and known deviations

Published on 2026-09-25 to the live Miro boards:

- System Architecture diagram: https://miro.com/app/board/uXjVHin2SLs=/?moveToWidget=3458764684950607465
- Technical Brainstorm frames and summary doc: https://miro.com/app/board/uXjVHin2_0U=/?moveToWidget=3458764643469371082

**Deviations from section 5**

- **Diagram not in a frame.** The System Architecture diagram is a titled Miro diagram widget. Wrapping it in a frame would mean recreating it, and Miro rejected re-parenting existing items. The widget carries its own title.
- **Ten loose stickies, owner decision pending.** In the Technical Brainstorm board, the 4 Problem and 6 Design Principles stickies sit inside their frames visually but are not children of them, because the first write did not address the frames correctly. Moving one of those frames would leave its stickies behind. Fixing it means deleting the 10 stickies and recreating them inside the frames, which needs the owner's approval. The Current State and Future State stickies are correctly nested.
- **Added after review.** Future State carries four open-question stickies and every Current State sticky cites a source, as section 5 requires. One Future State sticky ends 16 px from the template's widget stack; it does not overlap it.
- **Sync unverified.** The summary doc is meant to sync to the System Architecture board's synced-copy frame. That frame exposes only its instruction text, so the sync could not be confirmed.
