# Tasks

- [ ] implement proper content routing/rendering

## Rendering content

| content type selected | content type loaded and rendered  |
| --------------------- | --------------------------------- |
| `Prologue`            | Prologue                          |
| `Part`                | `openingContent` and first child  |
| `Section`             | `openingContent` and first child  |
| `Chapter`             | `openingContent` and first child  |
| `Article`             | see _Rendering Article_           |
| `Article Paragraph`   | see _Rendering Article Paragraph_ |
| all else              | see _Rendering low-level content_ |

### Rendering `Article`

- If `mainContent` contains any `ArticleParagraph`s:
  - render `openingContent` and `mainContent[0]`
- Else:
  - render entire element

### Rendering `Article Paragraph`

- If it is the first child of its parent:
  - render its parent according to its rule
- Else:
  - render entire element

### Rendering low-level content

- Render the nearest ancestor of the following types according to its rule:
  - `Prologue`
  - `Part`
  - `Section`
  - `Chapter`
  - `Article`
  - `Article Paragraph`

---

- [ ] determine if the semantic-path-to-path-id map needs refactoring
- [ ] use `.json` files instead of "hand-built" `.ts` files (e.g. `catechism.ts`)

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
