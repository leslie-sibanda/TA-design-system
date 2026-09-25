# Miro Technical Solution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the approved technical solution to the live Miro boards, diagram first, then the brainstorm frames and summary doc, and link the boards back into the spec.

**Architecture:** Every board write goes through `canvas_create_from_svg` or `canvas_update_from_svg` and is read back with `canvas_read_as_svg`. The System Architecture diagram is drawn from the layer table in the spec, the brainstorm stickies and the summary doc are derived from that diagram plus the repo docs, and a small script proves that the summary doc and the spec cite the same decisions.

**Tech Stack:** Miro MCP (`canvas_*` tools, `board_show`), Mermaid (flowchart) for the diagram widget, Python 3 for the consistency check, git.

**Spec:** `docs/superpowers/specs/2026-09-25-technical-solution-design.md` (approved 2026-09-25). Executors read both files. Section numbers below refer to the spec.

## Global Constraints

- Write only to the live board set (`uXjVHin…`). Never write to the duplicate template set (`uXjVHig…`). Never write to the Product Brief board (`uXjVHins-ds=`); it is read only.
- Target boards: System Architecture `https://miro.com/app/board/uXjVHin2SLs=/`, Technical Brainstorm `https://miro.com/app/board/uXjVHin2_0U=/`.
- Never delete a board item. Deletion needs an explicit confirmation from the owner first, and this plan needs none.
- Status tags are exactly the spec's section 2 table: Built, Decided, Not built, Deferred, Candidate.
- Board copy uses ASCII punctuation only: no em dashes, no emojis, no decorative Unicode.
- XML-escape `&`, `<` and `>` in every SVG attribute and body. One raw `&` fails the whole request.
- Never author or guess a `data-miro-id`. Take it from a `canvas_read_as_svg` or `canvas_*_from_svg` result and reuse it verbatim.
- After any call that reports changed dimensions, re-read the affected widgets and fix overlaps before moving on.
- Follow the Miro "Bright Paper" style guide returned by `canvas_get_canvas_composer_skill` (step `design`): at most 3 colour families per artifact, one font family, no shadows or gradients.
- Nothing is pushed to a git remote. Commits end with `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.

## Review Focus

1. **Diagram widget unavailable.** The Miro composer skill says a diagram widget's availability is per user, and an unavailable one is skipped without blocking other widgets. A "successful" call could create nothing. Task 2 checks that a diagram item exists in the result and stops for a decision if not.
2. **A sparse frame update renames or resizes the template frame.** Task 3 keeps each frame's title and size and reads them back afterwards.
3. **New stickies collide with the template's widget stack.** Each frame has an opaque stack at roughly x 1123 to 1250, y 34 to 193, whose stickies cannot be read. Task 3 keeps every new sticky at x + 199 <= 1090 and below y 110.
4. **The summary doc overwrites content someone has added.** The owner can see content on the Technical Brainstorm board, and the doc read as empty on 2026-09-25. Task 4 re-reads the doc first and stops if it is no longer empty.
5. **Summary and spec disagree on the decisions.** Task 5 compares decision IDs between the two and fails on any mismatch.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `docs/superpowers/plans/2026-09-25-miro-technical-solution.md` | This plan |
| `docs/superpowers/specs/2026-09-25-technical-solution-design.md` | Modified in Task 5 only: append a "Published boards" section with links |
| `<scratchpad>/check_ids.py` | Throwaway script from Task 5, not committed |

Scratchpad: `/tmp/claude-1000/-home-lsibanda/7dc4f994-6067-45e7-ae8c-3f377d3c6642/scratchpad`.

Miro items that later tasks depend on (all taken from `canvas_read_as_svg` on 2026-09-25):

| Item | Board | `data-miro-id` | Frame origin (translate) |
| --- | --- | --- | --- |
| Problem frame | Technical Brainstorm | `3458764641365149593` | `-1196,-460` |
| Design Principles frame | Technical Brainstorm | `3458764641365149603` | `116,-460` |
| Current State Context frame | Technical Brainstorm | `3458764641365149611` | `-1196,292` |
| Future State Brainstrom frame | Technical Brainstorm | `3458764641365149619` | `116,292` |
| Summary doc | Technical Brainstorm | `3458764643469371082` | canvas `1948,-460`, 784 by 1105 |

Each brainstorm frame is 1280 by 720 with fill `#ffffff`.

---

### Task 1: Preflight, verify facts and board state

**Files:**
- Read only: repo tree, both Miro boards

**Interfaces:**
- Consumes: the spec's section 2 status table
- Produces: a go or no-go for Tasks 2 to 4, and the confirmed frame ids used in Task 3

- [ ] **Step 1: Re-verify the status tags against the filesystem**

Run:

```bash
cd ~/projects/ta-design-system && for p in packages/tokens/src/primitive.css packages/tokens/src/semantic.css packages/themes/src/teacheractive.css src/app/api/search/route.ts .github/workflows/verify-site.yml .github/workflows/deploy-site.yml content/docs/foundations.mdx; do [ -e "$p" ] && echo "ok       $p" || echo "MISSING  $p"; done; for p in packages/ui packages/patterns registry registry.json; do [ -e "$p" ] && echo "UNEXPECTED (spec says not built): $p" || echo "absent   $p"; done; ls packages themes 2>/dev/null
```

Expected: the seven built paths print `ok`, the four not-built paths print `absent`, and `ls packages` shows only `themes` and `tokens`. Any `MISSING` or `UNEXPECTED` line means the spec's status table is out of date. Stop, tell the owner, and update the spec before drawing anything.

- [ ] **Step 2: Confirm the System Architecture board is unchanged**

Call `canvas_search` with `miro_url=https://miro.com/app/board/uXjVHin2SLs=/` and `result_mode=overview`.

Expected: `total_items` is 13 with three frames (synced Summary copy, diagram-sync frame, "System Architecture" instructions). If `total_items` is higher, someone has added content; read the new items before continuing so nothing is placed on top of them.

- [ ] **Step 3: Confirm the four brainstorm frames and the doc**

Call `canvas_search` with `miro_url=https://miro.com/app/board/uXjVHin2_0U=/` and `result_mode=overview`.

Expected: `total_items` is 41 and the four frames are titled `Problem`, `Design Principles`, `Current State Context` and `Future State Brainstrom`. If the count differs, read the frames' regions with `canvas_read_as_svg` (scope from the table above) to see what was added.

- [ ] **Step 4: Confirm the doc is still empty**

Call `canvas_read_as_svg` with `miro_url=https://miro.com/app/board/uXjVHin2_0U=/` and `widget_ids=["3458764643469371082"]`.

Expected: the `foreignObject` body is only `# `. If it contains anything else, stop. Do not run Task 4; ask the owner how to merge.

---

### Task 2: System Architecture diagram

**Files:**
- Modify (board): System Architecture, `https://miro.com/app/board/uXjVHin2SLs=/`

**Interfaces:**
- Consumes: Task 1 go decision; spec section 2 layers, arrows and statuses
- Produces: one diagram widget on the System Architecture board; the diagram's `data-miro-id` (recorded for Task 5)

- [ ] **Step 1: Load the diagramming skill**

Call `canvas_load_format_skill` with `format_name="diagramming"` and `notation="flowchart"`. Use its palette for the `classDef` colours in Step 2. The values below are the Bright Paper defaults and win only if the skill names nothing different: Built `fill:#adf0c7,stroke:#067429`, Decided `fill:#c6dcff,stroke:#305bab`, Not built `fill:#fff6b6,stroke:#af7e04`. Deferred and Candidate reuse the Not built fill with a dashed stroke.

- [ ] **Step 2: Create the diagram**

Call `canvas_create_from_svg` with `miro_url=https://miro.com/app/board/uXjVHin2SLs=/` and this payload:

```xml
<svg xmlns="http://www.w3.org/2000/svg">
<foreignObject id="arch" x="0" y="700" width="1600" height="900" data-type="diagram" data-title="TeacherActive design system: architecture and status">
flowchart TB
  subgraph F[Foundations]
    BUI[Base UI<br/>dependency only]
    TOK[tokens<br/>built, minimal]
    THM[themes<br/>built, base theme only]
  end
  subgraph C[Components]
    UI[shared ui<br/>not built]
    PAT[patterns<br/>not built, after proven reuse]
  end
  subgraph D[Distribution]
    REG[shadcn registry<br/>decided, ADR-0002]
    LAB[theme lab<br/>decided]
    STY[Styling canvas<br/>design accepted]
  end
  subgraph A[Delivery and access]
    SITE[Fumadocs static site<br/>built]
    SRCH[static search<br/>built]
    CI[CI verify then deploy<br/>built, never run on GitHub]
    MD[static Markdown and llms.txt<br/>decided, ADR-0005 and ADR-0007]
    WMCP[WebMCP adapter<br/>decided, ADR-0005]
    MCP[external MCP server<br/>deferred, ADR-0007]
  end
  subgraph P[Consumers]
    CP[Client Portal<br/>candidate]
    NT[New Tabs<br/>candidate]
  end
  BUI --&gt; TOK
  TOK --&gt; THM
  TOK --&gt; UI
  THM --&gt; UI
  UI --&gt; PAT
  UI --&gt; SITE
  UI --&gt; STY
  UI --&gt; LAB
  THM --&gt; LAB
  PAT --&gt; CP
  PAT --&gt; NT
  PAT --&gt; REG
  SITE --&gt; SRCH
  SITE --&gt; WMCP
  CI --&gt; SITE
  REG --&gt; MD
  MD -.-&gt; MCP
  classDef built fill:#adf0c7,stroke:#067429,color:#1a1a1a
  classDef decided fill:#c6dcff,stroke:#305bab,color:#1a1a1a
  classDef notbuilt fill:#fff6b6,stroke:#af7e04,color:#1a1a1a
  classDef deferred fill:#fff6b6,stroke:#af7e04,stroke-dasharray:5 5,color:#1a1a1a
  class BUI,TOK,THM,SITE,SRCH,CI built
  class REG,LAB,STY,MD,WMCP decided
  class UI,PAT notbuilt
  class MCP,CP,NT deferred
</foreignObject>
</svg>
```

Placement: the create call manages collision avoidance, so `x` and `y` are a hint only. The arrows copy the dependency direction in `docs/architecture/overview.md` exactly (UI to patterns and docs, patterns to registry, docs to WebMCP, registry to agent records).

- [ ] **Step 3: Check that a diagram was actually created**

Read the call's result. Expected: it reports one created item of type `diagram` and returns its `data-miro-id`. If the result says the diagram was skipped or unavailable, stop. Do not hand-assemble shapes on your own; tell the owner and ask whether to fall back to shapes and connectors.

Then call `canvas_search` with `miro_url=https://miro.com/app/board/uXjVHin2SLs=/`, `result_mode=overview`.
Expected: `total_items` is 14 (13 plus the diagram) and `item_types` includes `diagram: 2`.

- [ ] **Step 4: Read the diagram back and compare with the spec**

Call `canvas_read_as_svg` with `widget_ids=[<the new data-miro-id>]`.
Expected: the returned Mermaid source contains all 16 node labels and the five status words `built`, `decided`, `not built`, `deferred`, `candidate`, and no node the spec's section 2 table lacks. Any difference: fix the source with `canvas_update_from_svg` (same `data-miro-id`, full new body) and read again.

---

### Task 3: Brainstorm stickies in the four frames

**Files:**
- Modify (board): Technical Brainstorm, `https://miro.com/app/board/uXjVHin2_0U=/`

**Interfaces:**
- Consumes: Task 1 frame ids and origins (File Structure table); Task 2's diagram for the Current State wording
- Produces: 22 stickies in four frames; nothing that later tasks depend on by id

Layout, identical in every frame (frame-relative coordinates): sticky size 199 by 228, columns at x = 32, 251, 470, 689, rows at y = 110 and y = 358. The last column ends at x = 888, clear of the template stack (x 1123 and up). All stickies use `data-color="light_yellow"` so siblings match.

- [ ] **Step 1: Update the Problem and Design Principles frames**

Call `canvas_update_from_svg` with `miro_url=https://miro.com/app/board/uXjVHin2_0U=/` and:

```xml
<svg xmlns="http://www.w3.org/2000/svg">
<g id="p" data-miro-id="3458764641365149593" transform="translate(-1196,-460)">
<rect data-type="frame" x="0" y="0" width="1280" height="720" fill="#ffffff" />
<rect id="p1" data-type="sticky" x="32" y="110" width="199" height="228" data-color="light_yellow" data-content="Teams rebuild the same UI repeatedly (Brief sec. 2)" />
<rect id="p2" data-type="sticky" x="251" y="110" width="199" height="228" data-color="light_yellow" data-content="Inconsistent, slower delivery across products (Brief sec. 3)" />
<rect id="p3" data-type="sticky" x="470" y="110" width="199" height="228" data-color="light_yellow" data-content="AI output drifts without an approved source (Brief sec. 3)" />
<rect id="p4" data-type="sticky" x="689" y="110" width="199" height="228" data-color="light_yellow" data-content="In-house delivery is scaling now (Brief sec. 2)" />
</g>
<g id="d" data-miro-id="3458764641365149603" transform="translate(116,-460)">
<rect data-type="frame" x="0" y="0" width="1280" height="720" fill="#ffffff" />
<rect id="d1" data-type="sticky" x="32" y="110" width="199" height="228" data-color="light_yellow" data-content="One canonical source for all outputs (ADR-0002)" />
<rect id="d2" data-type="sticky" x="251" y="110" width="199" height="228" data-color="light_yellow" data-content="Base UI behaviour, TeacherActive tokens for style (ADR-0001)" />
<rect id="d3" data-type="sticky" x="470" y="110" width="199" height="228" data-color="light_yellow" data-content="Semantic tokens, no app colours in components (ADR-0003)" />
<rect id="d4" data-type="sticky" x="689" y="110" width="199" height="228" data-color="light_yellow" data-content="Static first, GitHub Pages export (ADR-0006)" />
<rect id="d5" data-type="sticky" x="32" y="358" width="199" height="228" data-color="light_yellow" data-content="Read-only agent access, no secrets (ADR-0007)" />
<rect id="d6" data-type="sticky" x="251" y="358" width="199" height="228" data-color="light_yellow" data-content="Accessible in every theme (AGENTS.md)" />
</g>
</svg>
```

Expected: 10 items created, no failed items, and no reported dimension changes. The frame stubs omit `data-frame`, so titles are kept.

- [ ] **Step 2: Update the Current State and Future State frames**

Call `canvas_update_from_svg` with the same `miro_url` and:

```xml
<svg xmlns="http://www.w3.org/2000/svg">
<g id="c" data-miro-id="3458764641365149611" transform="translate(-1196,292)">
<rect data-type="frame" x="0" y="0" width="1280" height="720" fill="#ffffff" />
<rect id="c1" data-type="sticky" x="32" y="110" width="199" height="228" data-color="light_yellow" data-content="Static Fumadocs site built (handoff)" />
<rect id="c2" data-type="sticky" x="251" y="110" width="199" height="228" data-color="light_yellow" data-content="Tokens and one base theme built" />
<rect id="c3" data-type="sticky" x="470" y="110" width="199" height="228" data-color="light_yellow" data-content="CI verify and deploy built, never run on GitHub" />
<rect id="c4" data-type="sticky" x="689" y="110" width="199" height="228" data-color="light_yellow" data-content="Four proposal-only component pages" />
<rect id="c5" data-type="sticky" x="32" y="358" width="199" height="228" data-color="light_yellow" data-content="No shared UI, registry or Markdown export" />
<rect id="c6" data-type="sticky" x="251" y="358" width="199" height="228" data-color="light_yellow" data-content="No WebMCP, Pages not yet deployed" />
</g>
<g id="f" data-miro-id="3458764641365149619" transform="translate(116,292)">
<rect data-type="frame" x="0" y="0" width="1280" height="720" fill="#ffffff" />
<rect id="f1" data-type="sticky" x="32" y="110" width="199" height="228" data-color="light_yellow" data-content="First deploy and owner setup (slice 0)" />
<rect id="f2" data-type="sticky" x="251" y="110" width="199" height="228" data-color="light_yellow" data-content="Canonical components in packages/ui (slice 2)" />
<rect id="f3" data-type="sticky" x="470" y="110" width="199" height="228" data-color="light_yellow" data-content="Live previews and API tables (slice 3)" />
<rect id="f4" data-type="sticky" x="689" y="110" width="199" height="228" data-color="light_yellow" data-content="Themes, Styling canvas, theme lab (slice 4)" />
<rect id="f5" data-type="sticky" x="32" y="358" width="199" height="228" data-color="light_yellow" data-content="shadcn registry (slice 5)" />
<rect id="f6" data-type="sticky" x="251" y="358" width="199" height="228" data-color="light_yellow" data-content="Markdown and llms.txt, then WebMCP (slices 6 and 7)" />
</g>
</svg>
```

Expected: 12 items created, no failed items.

- [ ] **Step 3: Read all four frames back**

Call `canvas_read_as_svg` with `miro_url=https://miro.com/app/board/uXjVHin2_0U=/` and `scope_x=-1196`, `scope_y=-460`, `scope_width=2592`, `scope_height=1472`.

Expected, checked one by one:
1. Frame titles are still `Problem`, `Design Principles`, `Current State Context`, `Future State Brainstrom`, and each frame is still 1280 by 720.
2. 22 new stickies exist (4, 6, 6, 6), with the text above.
3. Every new sticky's `data-rendered-bounds` right edge is at most frame x + 1090 and its top edge is at least frame y + 110, so none touches the template stack.

Any sticky that breaks rule 3 or reports changed dimensions: move it with a position-only update (`data-type`, `data-miro-id`, `x`, `y`) and read again.

- [ ] **Step 4: Ask the owner for a visual check**

Call `board_show` with `miro_url=https://miro.com/app/board/uXjVHin2_0U=/`. The owner can see the template stickies inside each widget stack; this plan cannot read them. Ask the owner to confirm that nothing overlaps or duplicates what they can see. If they report a clash, move the new stickies rather than deleting anything.

---

### Task 4: Summary doc

**Files:**
- Modify (board): the doc widget `3458764643469371082` on Technical Brainstorm

**Interfaces:**
- Consumes: Task 1 Step 4 result (doc still empty); the decisions cited in the spec
- Produces: the summary doc, which the board syncs to the System Architecture board's synced-copy frame; the ADR and RFC ids it cites (checked in Task 5)

- [ ] **Step 1: Write the doc**

Call `canvas_update_from_svg` with `miro_url=https://miro.com/app/board/uXjVHin2_0U=/` and:

```xml
<svg xmlns="http://www.w3.org/2000/svg">
<foreignObject data-miro-id="3458764643469371082" x="1948" y="-460" width="784" height="1105" data-type="doc">
# Technical Solution Summary

## Goal
Give TeacherActive one owned design system: accessible shared components, brand foundations, app themes, documentation, install guidance and agent-readable resources (Brief sec. 1).

## Architecture
Dependencies flow from foundations to products: Base UI, then tokens and themes, then shared UI, then patterns and consuming apps. Shared UI feeds the documentation site, patterns feed the registry, the site feeds WebMCP and the registry feeds static agent records. The System Architecture board shows every box with its status.

## Decisions taken
- ADR-0001: Base UI is the behavioural foundation; HeroUI is a reference only.
- ADR-0002: One canonical source with dual distribution (packages and registry).
- ADR-0003: Semantic tokens and app themes, no app colours in components.
- ADR-0004: MCP and WebMCP agent access, partly superseded by ADR-0007.
- ADR-0005: Component documentation is shared through public Markdown and progressive WebMCP.
- ADR-0006: Static Next.js export on GitHub Pages.
- ADR-0007: WebMCP and static documentation, external MCP server deferred.
- RFC-0001 and RFC-0002 (component lifecycle, app theme registration) are proposed, not accepted.
- Owner decision, 2026-09-23: dark text #182B3A on brand orange #F57D00 (about 5.43:1).

## Built today
- Static Fumadocs site with homepage, catalogue, four proposal pages, Foundations, Contributing and static search.
- Tokens and one base theme.
- CI verify and deploy workflows, never run on GitHub.

## Not built
- Shared UI package, patterns package, registry, theme lab and Styling canvas.
- Static Markdown, llms.txt and WebMCP.
- Pages settings and the first real deployment.

## Gaps and open questions
- First adopters: Client Portal or New Tabs?
- Who owns governance and brand sign-off?
- How are adoption, time saved and grounded AI tasks measured?
- Mitigation for stale development and iteration on the site.
- Slice order: Markdown before the registry, or in parallel? Recommended: Markdown first.

## Build order
- Slice 0: first deployment and owner setup.
- Slice 1: static scaffold (complete).
- Slice 2: canonical components.
- Slice 3: live previews and API tables.
- Slice 4: themes, Styling canvas and theme lab.
- Slice 5: registry.
- Slice 6: Markdown and llms.txt.
- Slice 7: WebMCP, then adoption in Client Portal and New Tabs.
</foreignObject>
</svg>
```

Expected: one item updated, no failed items.

- [ ] **Step 2: Read the doc back**

Call `canvas_read_as_svg` with `widget_ids=["3458764643469371082"]`.
Expected: the body starts with `# Technical Solution Summary` and contains all eight `## ` sections from Step 1.

- [ ] **Step 3: Check the sync to the System Architecture board**

Call `canvas_search` with `miro_url=https://miro.com/app/board/uXjVHin2SLs=/`, `result_mode=matches`, `patterns=["Technical Solution Summary"]`.
Expected: at least one match inside the synced-copy frame (`3458764643474313593`). No match: sync can lag or may not apply to updates made by this tool. Wait a minute and search again; if there is still no match, record it in the final report as unverified rather than claiming the sync worked.

---

### Task 5: Consistency check, link back, report

**Files:**
- Create: `<scratchpad>/check_ids.py` (throwaway)
- Modify: `docs/superpowers/specs/2026-09-25-technical-solution-design.md` (append a section)

**Interfaces:**
- Consumes: the spec file; the doc body from Task 4 Step 2 saved to `<scratchpad>/summary.txt`; the diagram id from Task 2
- Produces: a pass or fail on decision consistency; a "Published boards" section in the spec

- [ ] **Step 1: Save the doc body and write the check**

Save the body text from Task 4 Step 2 (everything inside the `foreignObject`) to `<scratchpad>/summary.txt`. Then create `<scratchpad>/check_ids.py`:

```python
import re, pathlib, sys

repo = pathlib.Path.home() / "projects/ta-design-system"
spec = (repo / "docs/superpowers/specs/2026-09-25-technical-solution-design.md").read_text()
doc = pathlib.Path(sys.argv[1]).read_text()

pat = re.compile(r"\b(?:ADR|RFC)-\d{4}\b")
spec_ids, doc_ids = set(pat.findall(spec)), set(pat.findall(doc))

known = {p.name.split("-", 2)[0] + "-" + p.name.split("-", 2)[1]
         for d in ("docs/adr", "docs/rfc") for p in (repo / d).glob("*.md")}

missing = sorted(spec_ids - doc_ids)
unknown = sorted(doc_ids - known)
print("spec ids:", sorted(spec_ids))
print("doc ids: ", sorted(doc_ids))
print("in spec, missing from doc:", missing or "none")
print("in doc, not a real ADR/RFC file:", unknown or "none")
sys.exit(1 if missing or unknown else 0)
```

- [ ] **Step 2: Run the check**

Run: `python3 <scratchpad>/check_ids.py <scratchpad>/summary.txt`
Expected: exit code 0, with both "none" lines. A non-zero exit means the doc and the spec disagree on a decision. Fix the doc with `canvas_update_from_svg` (same `data-miro-id`) or, if the doc is right and the spec is wrong, stop and tell the owner; do not edit the approved spec silently.

- [ ] **Step 3: Append the published boards to the spec**

Append this to the end of `docs/superpowers/specs/2026-09-25-technical-solution-design.md`, replacing `<diagram id>` with the id from Task 2 Step 2:

```markdown

## 8. Published boards

Published on 2026-09-25 to the live Miro boards:

- System Architecture diagram: https://miro.com/app/board/uXjVHin2SLs=/?moveToWidget=<diagram id>
- Technical Brainstorm frames and summary doc: https://miro.com/app/board/uXjVHin2_0U=/?moveToWidget=3458764643469371082
```

- [ ] **Step 4: Commit**

```bash
cd ~/projects/ta-design-system && git add docs/superpowers/specs/2026-09-25-technical-solution-design.md && git commit -m "$(cat <<'EOF'
docs: link published Miro boards from the technical solution design

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)" && git status -sb
```

Expected: one commit on `docs/technical-solution-design`; `git status` shows only the pre-existing untracked CI/CD plan.

- [ ] **Step 5: Report to the owner**

Report what was written (one diagram, 22 stickies, one doc), what was verified (Task 2 Step 4, Task 3 Step 3, Task 5 Step 2), and what was not (the sync check if it did not match, and the template stickies that cannot be read). Ask the owner to look at the boards once. Do not claim the boards look right; only the owner can see the template stickies.
