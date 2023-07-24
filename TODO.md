# Tasks

- [ ] try converting JSON artifacts to YAML
- [ ] upgrade Fresh
- [ ] move import-map specs into `deno.json`
- [ ] use Twind v1: https://fresh.deno.dev/docs/examples/using-twind-v1
- [ ] document link regarding Radix colors and their other tools

- [ ] rebuild the table-of-contents generation algorithm:
  - [ ] the algorithm:
    - [ ] for the four parts:
      - [ ] all populated `openingContent` arrays are an entry (referenced by the parent)
      - [ ] all `mainContent` arrays are split by `InBrief` content; entries are created for each sub-array (referenced
            by the first element in the sub-array)
        - [ ] write tests to verify that all content is accessible via the generated table-of-contents
  - [ ] determine if the semantic-path-to-path-id map needs refactoring

- [ ] investigate "TODO" note above `utils::hasChildContent()`
- [ ] investigate `utils::getOpeningAndMainContent()`: should the return type be `ContentBase` instead of `T`?

- [ ] render all content
  - [ ] re-do the rendering structures (reorganize components, etc.)
  - [ ] opening content
  - [ ] citation markers
  - [ ] is there anything else?
- [ ] implement content loading
  - [ ] cross-reference navigation
  - [ ] chapter > chapter navigation
  - [ ] routing
    - [ ] to in-page anchor tags

- [ ] styling

## Unprioritized

- [ ] implement hierarchical navigation
- [ ] implement historical navigation
- [ ] implement search
- [ ] implement index
- [ ] implement glossary
- [ ] implement "copy" buttons (click a button to copy the entire text of a paragraph, quote, etc.)
- [ ] light/dark/high-contrast mode toggle
  - [ ] dark mode: try to avoid the "window blending" problem (cannot tell where the browser window starts and another
        application window begins)
- [ ] consider using the following colors:
  - [ ] #E86D82 (red-pink)

# Possible features

- [ ] the ability to ask a question in natural language (via text or mic), e.g. "What happens in the sacrament of
      Confirmation?"
- [ ] note-taking and highlighting
  - [ ] permanent and temporary storage (easily toggleable)
- [ ] narration
  - [ ] recordered audio (better than a screen reader)
  - [ ] text is highlighted to follow along (toggleable)
