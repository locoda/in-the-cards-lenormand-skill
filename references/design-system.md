# Design System — Stargazer Interpreter v3.3

Shared design tokens, typography, fonts, and card reference used across all product templates.

## Global Design Constants

```css
/* -- Kami Lenormand Theme -- */
--parchment:   #f5f4ed;   /* page background */
--near-black:  #141413;   /* body text */
--dark-warm:   #3d3d3a;   /* secondary text */
--stone:       #6b6a64;   /* meta, page numbers */
--brand:       #1B365D;   /* ink-blue accent */
--border:      #e8e6dc;   /* page borders */
--border-soft: #e5e3d8;   /* soft borders */

/* Card polarity colors */
--positive:    #E1F5EE;   /* soft teal fill */
--positive-stroke: #5DCAA5;
--negative:    #FAECE7;   /* soft terracotta fill */
--negative-stroke: #D85A30;
--neutral:     #EEEDFE;   /* soft purple fill */
--neutral-stroke: #AFA9EC;

/* Typography */
--serif: "LXGW Neo ZhiSong", "Source Han Serif SC", "Noto Serif CJK SC", "Songti SC", Georgia, serif;
--sans:  -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
```

## Font Loading

**All product templates MUST include font loading.** The site font is LXGW Neo ZhiSong
(霞鹜新致宋), served by [ZeoSeven Fonts](https://fonts.zeoseven.com/items/22/) (item 22).

```html
<!-- Site font: LXGW Neo ZhiSong (霞鹜新致宋) via ZeoSeven Fonts -->
<link rel="stylesheet" href="https://fontsapi.zeoseven.com/22/main/result.css">
```

Font families:
- Serif — `"LXGW Neo ZhiSong"`, the single site font: body copy, headings, card names, verdicts
- Sans — system UI stack (no webfont): small uppercase labels, badges, page meta

Working with a single-weight face:
- The font ships **Regular (400) only**, upright, no italic. Any `font-weight` ≤ 500 renders
  identically; ≥ 600 renders as browser-synthesized bold, and `font-style: italic` is
  synthesized obliquely. Existing templates keep their weight declarations — synthetic bold
  still separates headings from body — but for new work prefer size, color, and letter-spacing
  as the primary hierarchy signals rather than adding more weight steps.
- No variable axes. The Chiron `PADG` axis (`font-variation-settings`) no longer applies;
  do not add it to templates.
- ZeoSeven's stylesheet declares `src: local("LXGW Neo ZhiSong"), url(...)`, so a locally
  installed copy is preferred over the network subsets.
- The stylesheet is split into unicode-range subsets, so renderers must wait for
  `document.fonts.ready` (all scripts under `scripts/` already do) before screenshotting
  or printing.

## Font Licensing — IPA Font License 1.0

LXGW Neo ZhiSong is derived from IPAex Mincho / IPAmj Mincho and is released under the
[IPA Font License 1.0](https://opensource.org/licenses/IPA), not OFL. Two consequences for
this project:

- **A4 PDF product — no obligation.** Embedding the font into a PDF for display and printing
  is explicitly permitted by the license, and the resulting PDF may be redistributed freely,
  commercially or not. (Extracting the font back out of a PDF to build a new font program
  would create a Derived Program still bound by the license.)
- **Web page / long-image products — attribute and offer the original.** Serving the font as
  a webfont counts as redistribution, so generated web pages carry a footer credit naming the
  font, its license URL, and a note that readers may substitute the original IPA font (via a
  browser font override or an extension such as Stylus). The seed templates already include
  this line — keep it when filling placeholders. Social-card and long-image PNGs are raster
  output with no embedded font program, so they need no notice.

## Card Slug Reference

Card slugs (for internal lookup only — no image URLs used):

| # | Slug | # | Slug | # | Slug |
|---|------|---|------|---|------|
| 1 | rider | 13 | child | 25 | ring |
| 2 | clover | 14 | fox | 26 | book |
| 3 | ship | 15 | bear | 27 | letter |
| 4 | house | 16 | stars | 28 | man |
| 5 | tree | 17 | stork | 29 | woman |
| 6 | clouds | 18 | dog | 30 | lily |
| 7 | snake | 19 | tower | 31 | sun |
| 8 | coffin | 20 | garden | 32 | moon |
| 9 | bouquet | 21 | mountain | 33 | key |
| 10 | scythe | 22 | crossroads | 34 | fish |
| 11 | whip | 23 | mice | 35 | anchor |
| 12 | birds | 24 | heart | 36 | cross |
