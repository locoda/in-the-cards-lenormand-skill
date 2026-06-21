---
name: stargazer-interpreter
description: |-
  Interpret Lenormand card readings from Stargazer (stargazer.estework.site) and generate visual products from the interpretation. Three-phase workflow: (1) parse the Stargazer prompt → (2) interpret and persist the reading as structured JSON + human-readable Markdown → (3) generate products from the saved reading. Default product is Kami-styled A4 PDF; additional products include web page and 1080×1440 social cards. Past readings can be listed, queried, and regenerated into any product type via natural language. Supports all 6 spread types. Triggers on "Stargazer 解读 / 帮我解读 / Lenormand reading / 生成解读 PDF / 列出解读 / 生成社交卡片 / 上次的解读" etc.
  Triggers on: "Stargazer 解读 / 帮我解读这个牌阵 / 雷诺曼解读 / Lenormand reading / Stargazer prompt / 帮我解牌 / 帮我解读 / interpret this spread / 生成解读 PDF / 列出最近的解读 / 把上次的解读 / 生成网页版 / 生成社交卡片 / 上次的解读 / 之前的解读".
version: 3.1.0
agent_created: true
---

# Stargazer Interpreter · 星解者 v3.1

Interpret Lenormand card readings from [Stargazer's Oracle](https://stargazer.estework.site/), persist them as reusable data, and generate visual products — A4 PDF, web pages, or social cards — by copying seed HTML files and filling in placeholders.

## Architecture

```
Stargazer Prompt
    │
    ▼
[Phase 1] Parse → structured card data
    │
    ▼
[Phase 2] Interpret → save reading (JSON + MD) to output/readings/
    │
    ▼
[Phase 3] Generate products from saved reading
           ├── A4 PDF (default, Kami style)
           ├── Web Page (standalone interactive HTML)
           └── Social Card (1080×1440 carousel, 3:4)
```

Every reading is saved before product generation. Saved readings can be regenerated into any product type later.

## When to Use

**First-time reading:** User pastes a Stargazer prompt and asks for interpretation.
→ Run Phase 1 → Phase 2 → Phase 3 (generate default A4 PDF).

**Product regeneration (post hoc):** User references a past reading and asks for a different product type.
E.g., "把上次的解读生成社交卡片" / "用 #3 解读生成网页版" / "列出最近的解读".
→ Skip Phase 1–2, load the saved reading JSON, run Phase 3 with the requested product type.

## Phase 1: Parse the Prompt

Read `references/spread-parsing.md` for detailed parsing rules. Extract structured data:

1. **Strip universal instruction prefix** — the "You are a traditional Lenormand reader..." / "你是一位傳統 Lenormand 占卜師..." block before `---`
2. **Detect language** (ZH/EN) from `【問題】` / `Question:` / `Spread:`; fallback: CJK character ratio.
3. **Detect spread type**: `yesno-1` | `two` | `three` | `five` | `nine` | `choice`
4. **Extract fields**: question, date, cards with positions, verdict (yes/no), option A/B texts (choice)
5. **Resolve card names** against `references/lenormand-cards.md`
6. **Output** a structured data object

## Phase 2: Interpret & Save

### 2a. Interpret the Cards

#### Core Reading Principles

- **Combination-first**: Never list individual card meanings in isolation. Read adjacent cards as overlapping pairs (1+2, 2+3, 3+4...) that modify each other. The meaning of a card shifts based on its neighbors.
- **Neutral tone**: Stay faithful to Lenormand's traditional meanings. Do not push toward positivity or negativity — the tone emerges from the cards themselves. Avoid empty reassurance and unfounded pessimism.
- **Honesty**: The value of a reading lies in honesty, not in making the querent feel good or afraid.
- **Center dominance**: In odd-numbered linear spreads, the center card is the core theme.
- **Noun + Adjective model**: The first card is the subject, the second card modifies it. Rider + Clover = "lucky news arriving." Clover + Rider = "a fleeting visitor."
- **Full-length interpretation**: The saved interpretation should be written at **PDF-ready length** — each chapter aiming for 4-5 paragraphs + takeaway (for 3-card/5-card spreads) or equivalent depth. The interpretation JSON stores the *full* version. Social card generation will compress this saved content.

#### Card Knowledge

Load `references/lenormand-cards.md` for each card's traditional meaning, keywords, polarity, and combination modifier notes. This reference contains the full 36-card Lenormand deck with Chinese and English support.

#### Spread-Specific Interpretation Frameworks

**1-Card Yes/No:**
- State the verdict clearly (YES/NO/MAYBE)
- Interpret the card's meaning applied to the question
- Note any subtle nuances the binary verdict might miss

**2-Card:**
- Read the two cards as a single combination (1+2)
- Give the overall meaning as one connected sentence

**3-Card / Daily:**
- Chain adjacent pairs: 1+2, then 2+3
- Synthesize all three into one connected message
- End with a practical takeaway or "今日提醒" (daily reminder)

**5-Card:**
- Identify the center card (position 3) as the core theme
- Chain pairs: 1+2, 2+3, 3+4, 4+5
- Read all 5 as one connected narrative trajectory
- End with practical guidance

**9-Card Box Spread (3×3):**
Interpret from three perspectives:
1. **Time Axis** (columns) — Left column (1,4,7) = Past, Center column (2,5,8) = Present, Right column (3,6,9) = Future
2. **Three Layers** (rows) — Top row (1,2,3) = Conscious, Middle row (4,5,6) = Reality, Bottom row (7,8,9) = Subconscious
3. **Cross Method** — Core (position 5), Cross arms (2,4,6,8) = direct influences, Corners (1,3,7,9) = background/hidden factors
4. **Key Combinations** — Highlight notable card pairs and clusters
5. **Overall Synthesis** — All 9 cards woven into a unified reading

**A-or-B Choice:**
- Chain-read Option A's 3 cards (1+2, 2+3)
- Chain-read Option B's 3 cards (1+2, 2+3)
- Compare the two trajectories side by side
- Offer a tendency or caution, but respect that the final choice belongs to the querent

#### Output Format

Structure the interpretation as clear chapter sections with titles in the detected language. Use the chapter structure defined in `references/template-a4-pdf.md` for your spread type.

### 2b. Save the Reading

After interpretation, persist the reading in two parallel files under `output/readings/`:

**1. Structured JSON** — `{reading_id}.json`

Follow the schema defined in `references/reading-schema.md`. The JSON must contain:
- `version`: `"3.0"`
- `reading_id`: `"{date}-{topic_slug}"` (e.g., `2026-06-20-写作方向`)
- `meta`: language, spread_type, spread_label, question, date, generated_at, source, topic_slug
- `cards`: array of card objects with position, card_id, names, polarity, position_label
- `interpretation`: summary + chapters array, each chapter with id, title, short_title, and sections (paragraph / combination / takeaway)
- `verdict`: (yesno-1 only) verdict + verdict_zh
- `optionA` / `optionB`: (choice only) option texts + card arrays

**2. Human-readable Markdown** — `{reading_id}.md`

A readable copy including:
```markdown
# {question}
**{spread_label}** · {date}

{summary}

## 抽出牌面
| 位置 | 牌 |
|------|-----|
| {position_label} | {number}. {name_zh} |

{for each chapter:}
## {chapter_title}

{paragraphs}

> **{combo_label}**: {combo_content}

> 💡 {takeaway}
```

**3. Update the index** — append to `output/readings/index.json`:

```json
{
  "reading_id": "2026-06-20-写作方向",
  "language": "zh",
  "spread_type": "three",
  "question": "我的写作方向应该是什么？",
  "date": "2026-06-20",
  "generated_at": "2026-06-20T21:35:00+08:00",
  "topic_slug": "写作方向",
  "card_names": ["騎士", "幸運草", "書"],
  "products_generated": []
}
```

## Phase 3: Generate Products

Products are generated from the saved reading JSON. The user may request one or more product types.
If no product type is specified, default to **A4 PDF**.

### Seed-Based Workflow

Instead of building HTML from scratch, **copy the seed HTML file** from `assets/`, then fill in placeholders:

1. **Copy seed** to `output/` with the appropriate filename
2. **Replace `{{PLACEHOLDER}}` markers** with data from the saved reading JSON:
   - `{{TITLE}}`, `{{DATE}}`, `{{SPREAD_LABEL}}` etc. → from `meta`
   - `{{CARD_N_SVG}}` → read SVG from `cards/card-{NN}-{slug}.svg`, strip `<defs>…</defs>`, paste inline
   - `{{CHAPTER_TITLE}}` / `{{CHAPTER_CONTENT}}` → from `interpretation.chapters[]`
   - `{{SUMMARY}}` → from `interpretation.summary`
3. **Delete unused spread templates** from the seed (keep only the one matching `spread_type`)
4. **For chapters**: duplicate the `<!-- CHAPTER_LOOP_START -->` block for each chapter
5. **Render** with the appropriate script

| Product | Seed file | Render script | Output name |
|---------|-----------|---------------|-------------|
| `a4-pdf` | `assets/seed-a4-pdf.html` | `scripts/generate-pdf.js` | `lenormand-{spread}-{topic}-{date}.pdf` |
| `web-page` | `assets/seed-web-page.html` | — (self-contained) | `lenormand-web-{topic}-{date}.html` |
| `social-card` | `assets/seed-social-card.html` | `scripts/render-social-cards.js` | `lenormand-xhs-{topic}-{date}-NN.png` |

### 3a. A4 PDF (Default)

1. Copy `assets/seed-a4-pdf.html` → `output/lenormand-{spread}-{topic}-{date}.html`
2. Fill cover: `{{SPREAD_LABEL}}`, `{{TITLE}}`, `{{DATE}}`, card SVGs, position labels
3. Delete unused spread templates (keep only the one matching `spread_type`)
4. For each chapter in `interpretation.chapters[]`: duplicate the chapter block, fill `{{CHAPTER_TITLE}}` and `{{CHAPTER_CONTENT}}` with paragraphs/combinations/takeaway. Chapters 2+ need `style="break-before: page;"`.
5. **Page balance check** (before finalizing):
   - **(1) No page more than 40% blank**: Content must fill at least 60% of each page's printable area. **Estimate rendered height, not character count.**
     - A4 printable area ≈ 170mm × 257mm (usable height after @page margins ≈ 728pt)
     - h2 heading: ~25pt · body paragraph (80-150 chars): ~2-4 lines × ~16pt = 32-64pt
     - combination block (label + body): ~5-8 lines = 80-128pt · takeaway box: ~3-4 lines + padding = 70-90pt
     - **Target per chapter**: ≥ 3 substantial paragraphs + takeaway, or 4-5 combo blocks — total estimated ≥ 440pt to hit 60%
     - If estimated height < 440pt, expand content; if > 650pt (90%), consider condensing
   - **(2) Page breaks at natural boundaries**: Page breaks must fall at chapter headings (h2) or paragraph endings — never split a paragraph mid-sentence. Adjust chapter content so each page starts cleanly.
   - **Fix strategies** (in priority order): (a) Expand thin chapters with additional reflection paragraphs or extended takeaways; (b) Condense verbose chapters to pull orphan content onto the preceding page; (c) If necessary, merge two thin chapters by removing the break-before so they share a page.
   - See `references/template-a4-pdf.md` → Page Balance Rules for detailed guidance and spread-specific recommendations.
6. Render: `node scripts/generate-pdf.js output/<html-file>`
7. Run deliverable validation (R1-R4). Re-render if any rule fails.
8. Record: `node scripts/manage-readings.js record-product {reading_id} --type a4-pdf`

### 3b. Web Page

1. Copy `assets/seed-web-page.html` → `output/lenormand-web-{topic}-{date}.html`
2. Fill header, card tiles row, summary, chapters
3. Self-contained — no rendering step needed
4. Record: `node scripts/manage-readings.js record-product {reading_id} --type web-page`

### 3c. Social Card (1080×1440)

1. Load the full interpretation from the saved reading JSON
2. **Compress each chapter** for 1080×1440 fit (body-text area ~900×1100px at 30px font):
   - **First: reduce spacing** — gap: 16px, combo padding: 20×28, insight margin: 12px (seed defaults are already set for this)
   - **Then: compress text** — keep meaning, shorten sentences, merge paragraphs, cut filler. Max ~3 blocks per page (e.g. 2 combos + takeaway, or 3 short paragraphs + takeaway)
   - **Never truncate mid-sentence** — if a point can't be compressed, drop it and keep the strongest ones
3. Copy `assets/seed-social-card.html` → `output/lenormand-xhs-{topic}-{date}.html`
4. Fill cover: badge, title, date, SVG cards
5. For each chapter: duplicate the content-page block, fill compressed content
6. Verify R6 (no overflow): estimate block heights — if >1100px total, compress further
7. Render: `node scripts/render-social-cards.js output/<html-file>`
8. Record: `node scripts/manage-readings.js record-product {reading_id} --type social-card`

### Generating Multiple Products

User may request multiple product types at once: "生成 PDF 和网页版". Generate each as described above.

## Product Regeneration (Post Hoc)

When the user references a past reading for a new product:

1. **Identify the reading**. Common triggers:
   - "上次的解读" / "latest reading" → `node scripts/manage-readings.js latest`
   - "列出最近的解读" → `node scripts/manage-readings.js list --limit 5`
   - "用 #3 解读" / "第三张解读" → list then load by index
   - "用 6月20号的解读" → search by date

2. **Load the reading JSON** from `output/readings/{reading_id}.json`

3. **Ask which product type** (if not specified in the user's request).
   Default to A4 PDF if the user only says "生成产品" without a type.

4. **Run Phase 3** with the loaded reading and requested product type.

## Bundled Resources

| Resource | Purpose | When to Load |
|----------|---------|-------------|
| `references/lenormand-cards.md` | 36-card database: names, keywords, meanings, polarity | Phase 2 (always needed) |
| `references/spread-parsing.md` | Prompt parsing rules for all 6 spread types | Phase 1 |
| `references/design-system.md` | Shared design tokens, fonts, colors, card slugs | Phase 3 reference |
| `references/template-a4-pdf.md` | A4 PDF chapter structure & page balance rules | Phase 3a reference |
| `references/reading-schema.md` | JSON schema for saved readings | Phase 2b (saving) |
| `assets/seed-a4-pdf.html` | Copy-and-fill A4 PDF HTML skeleton | Phase 3a (copy to output/) |
| `assets/seed-web-page.html` | Copy-and-fill web page HTML skeleton | Phase 3b (copy to output/) |
| `assets/seed-social-card.html` | Copy-and-fill social card HTML skeleton | Phase 3c (copy to output/) |
| `scripts/generate-pdf.js` | Puppeteer: HTML → A4 PDF | Phase 3a |
| `scripts/manage-readings.js` | CLI: list, find, update reading index | Phase 2b, post-hoc regen |
| `scripts/render-social-cards.js` | Puppeteer: social card HTML → 1080×1440 PNGs | Phase 3c |
| `cards/*.svg` | Geometric Silence 36-card deck | Phase 3a, 3c (SVG card faces) |
| `cards/previews/*.png` | PNG previews of all 36 cards | Quick reference |

## Output Directory Structure

```
output/
├── readings/
│   ├── index.json                     # Reading manifest
│   ├── 2026-06-20-写作方向.json       # Structured reading data
│   └── 2026-06-20-写作方向.md         # Human-readable copy
├── lenormand-three-写作方向-2026-06-20.pdf    # A4 PDF product
├── lenormand-web-写作方向-2026-06-20.html     # Web page product
└── lenormand-xhs-写作方向-2026-06-20-01.png   # Social card product (page 1)
```

## Deliverable Validation

Before presenting any product to the user, run these checks. All rules apply to every product type unless marked otherwise.

### Common (All Products)

**R1 · No visible placeholders**: Grep the intermediate HTML file for `{{`. Any unreplaced placeholder is a hard failure — fix and regenerate.

**R2 · Fonts load correctly**: Verify Chinese text renders in Chiron Sung HK (serif) or Chiron Hei HK (sans):
- Check `@import` for both `chiron-sung-hk-webfont` and `chiron-hei-hk-webfont` is present
- For Puppeteer-rendered products (PDF, PNG): build script must `await page.evaluate(() => document.fonts.ready)` before capturing
- For web page: open in browser to verify

**R3 · SVG cards render**: On the cover/card row, SVG card faces must be visible:
- SVGs were inlined correctly (stripped `<defs>`, wrapped in seed's `<svg>` with class + viewBox)
- No nested `<svg><svg>` — inner content only
- Global defs block present for pattern references

**R4 · No raw code visible**: The rendered output (PDF, PNG, or viewed HTML) must NOT show raw markup:
- No visible `<div`, `<p`, `</` fragments
- No `{{PLACEHOLDER}}` strings in rendered text
- No escaped entities where normal text is expected

### A4 PDF (additional)

**R5 · Page balance**: Each page must fill at least 60% of printable area (~170mm × 257mm).
- Estimate content height per chapter (paragraphs, combinations, takeaway)
- If < 60%: expand chapter or merge with adjacent chapter
- Never split a paragraph mid-sentence across pages

**R6 · Page breaks correct**: 
- Cover page has `break-after: page`
- Chapters 2+ have `style="break-before: page;"`
- Chapter 1 (after cover) has no break-before (flows naturally)

### Social Card (additional)

**R7 · No overflow or thin pages**: Each content page must fill ~60% of 1080×1440 canvas without overflowing. **Fix strategies (in order):** (1) Reduce block spacing: gap 22px → 16px, combo-block padding 28px→20px; (2) Compress text: shorten sentences, merge redundant points, cut filler — never truncate mid-sentence; (3) Split into additional page if content is essential and can't be compressed. Body-text max ~1100px with 30px font. If too thin, expand or merge.

**R8 · Card sizing correct**: SVG card faces on cover must be properly sized per spread type (240×360px for 3-card, scale proportionally for others).

### Web Page (additional)

**R9 · Self-contained**: The HTML file must work offline — no external JS, no API calls. Fonts via `@import` is acceptable since they load from CDN on first view.

**R10 · Responsive**: Max-width 720px, centered, readable on mobile. Card row wraps gracefully on small screens.

## Edge Cases & Notes

- **Missing universal prefix**: Treat entire text as spread body if no `---` delimiter
- **Daily reading**: Auto-detected by `每日運勢`; question is null, generate "daily fortune" context
- **9-card significator**: Mark in card data if position 5 is noted as Significator
- **Card ambiguity**: Resolve both Chinese (騎士) and English (Rider) case-insensitively
- **Freeform (non-Stargazer) input**: If the input doesn't follow Stargazer format (no `---` delimiter, no Stargazer ZH/EN markers), still run Phase 1 language detection — the CJK fallback in `spread-parsing.md` will determine the output language. All Phase 2–3 rules apply as normal.
- **Language consistency**: Detect language FIRST from the prompt itself (via markers or CJK fallback). Do NOT override with user profile language preference. If Chinese prompt → all text in Chinese. English → all English. The interpretation must match the prompt's language, not the user's chat language.
- **Duplicate generation**: If a product type already recorded in index, still regenerate (overwrite) but log a note
- **Social card chapter count**: If a reading has only 1 chapter (yesno-1, two), produce a cover-only card (single 1080×1440 image)
- **Web page immutability**: Web pages are standalone and self-contained — they don't link back to the reading data
