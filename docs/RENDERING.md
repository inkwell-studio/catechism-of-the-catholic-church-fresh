# Rules

The following should be rendered when each particular content type is navigated to:

## Part

- `partNumber`
- `title`
- all of `openingContent`

## Section

- `sectionNumber`
- `title`
- all of `openingContent`

## Chapter

- `chapterNumber`
- `title`
- all of `openingContent`
- first item of `mainContent` according to its rule

## Article

- `articleNumber`
- `title`
- all of `openingContent`
- (if first child in `mainContent` is an `ArticleParagraph` or `Subarticle`):
  - render the first child
- (else):
  - render all items in `mainContent`, and `inBrief` (this assumes that `mainContent` has only `ParagraphGroup`s and
    `Paragraph`s)

## In Brief

- (if in `openingContent` of a `Section`):
  - render the `Section` according to its rule

## Article Paragraph

- `articleParagraphNumber`
- `title`
- first child in `mainContent`

## Subarticle

- `subarticleNumber`
- `title`
- all of `mainContent`
- (if parent is an `Article` and this is the last child in `parent.mainContent`):
  - `parent.inBrief`

## Paragraph Group

- render the parent according to its rule

## Paragraph

- render the parent according to its rule
