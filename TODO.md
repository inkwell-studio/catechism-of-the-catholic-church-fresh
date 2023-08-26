# Tasks

## Ungrouped

- [ ] determine feasibility of different data storage and retrieval mechanisms
- [ ] add e2e tests for URLs (headless, if possible)
- [ ] add multi-language support
  - [ ] rename `catechism.ts` as `catechism-en.ts`
    - [ ] rename variables appropriately
  - [ ] rename other JSON artifacts
  - [ ] determine routing logic
- [ ] add JSON validation for `catechism.json`
- [ ] render all content
  - [ ] handle all TODO's in `content.tsx`
  - [ ] re-do the rendering structures (reorganize components, etc.)
  - [ ] opening content
  - [ ] citation markers
  - [ ] is there anything else?
- [ ] implement content loading
  - [ ] cross-reference navigation
  - [ ] chapter > chapter navigation
  - [ ] routing
    - [ ] to in-page anchor tags

## Unprioritized

- UI:
  - consider using Twind presets:
    - https://twind.style/presets#official-presets
  - consider using Radix UI things:
    - https://twind.style/preset-radix-ui
      - https://www.radix-ui.com/colors
    - https://www.radix-ui.com/
    - https://icons.radix-ui.com/
  - [ ] light/dark/high-contrast mode toggle
    - [ ] dark mode: try to avoid the "window blending" problem (cannot tell where the browser window starts and another
          application window begins)
  - [ ] consider using the following colors:
    - [ ] #E86D82 (red-pink)
- [ ] implement unimplemented tests
- [ ] add a test to ensure that all cross-references are paired (in `catechism.test.ts`)
- [ ] implement hierarchical navigation
- [ ] implement historical navigation
- [ ] implement search
- [ ] implement index
- [ ] implement glossary
- [ ] implement "copy" buttons (click a button to copy the entire text of a paragraph, quote, etc.)

# Possible features

- [ ] the ability to ask a question in natural language (via text or mic), e.g. "What happens in the Sacrament of
      Confirmation?"
- [ ] note-taking and highlighting
  - [ ] permanent and temporary storage (easily toggleable)
- [ ] narration
  - [ ] recordered audio (better than a screen reader)
  - [ ] text is highlighted to follow along (toggleable)
