# Stargazer Interpreter · 星解者 v3.1

> [中文说明](README.zh-CN.md)

A [WorkBuddy](https://www.codebuddy.ai) skill for interpreting Lenormand card readings from [Stargazer's Oracle](https://stargazer.estework.site/). Follows the [Agent Skills](https://agentskills.io) open standard.

Paste a Stargazer prompt → get interpretation as A4 PDF, interactive web page, or 1080×1440 social cards (Xiaohongshu carousel).

## Features

- **6 spread types**: 1-card Yes/No, 2-card, 3-card, 5-card, 9-card Box Spread (3×3), A-or-B choice
- **Bilingual**: Auto-detects Chinese or English prompts
- **Combination-first reading**: Adjacent card pair chains, Noun+Adjective model
- **3 product types from one reading**: A4 PDF (default), web page, 1080×1440 social cards
- **Readings persist**: Saved as structured JSON + Markdown, regenerable into any product later
- **Seed-based HTML**: Copy+fill HTML skeletons — no fragile from-scratch construction
- **Geometric Silence SVG cards**: Bold inline SVG card faces ($cards/$) with cream/sage/rose Swiss International Style
- **Chiron font pair**: Chiron Sung HK (昭源宋體) for body + Chiron Hei HK (昭源黑體) for labels
- **Kami-styled PDFs**: Warm parchment (#f5f4ed) + ink-blue accent (#1B365D)

## Preview

| Product | Spread | Cards | Link |
|---------|--------|-------|------|
| A4 PDF | 3-Card Daily | 幸運草 → 小孩 → 蛇 | [PDF](previews/lenormand-three-每日運勢-2026-06-20.pdf) |
| A4 PDF | 5-Card | 月亮 → 棺材 → 樹 → 雲 → 男人 | [PDF](previews/lenormand-five-創作瓶頸-2026-06-20.pdf) |
| Social Card | 3-Card Daily | 幸運草 → 小孩 → 蛇 | [PNG](previews/lenormand-xhs-每日運勢-cover.png) |

## Install

Tell your agent:

> Install the stargazer-interpreter skill from https://github.com/locoda/stargazer-interpreter

```bash
# WorkBuddy
git clone https://github.com/locoda/stargazer-interpreter.git ~/.workbuddy/skills/stargazer-interpreter/
```

Requires: Node.js + Puppeteer for PDF and social card rendering.

## Usage — Conversation Examples

### First-time reading

```
User: Interpret this spread

You are a traditional Lenormand reader. Read for me...
---
Question: How will my career change in the next 3 months?
Date: 2026-06-20
Spread: 3-card linear
1. Clover
2. Child
3. Snake
```

→ Agent runs Phase 1–2 (parse + interpret + save), generates A4 PDF by default.

### Generate a different product

```
User: Generate social cards from the latest reading
```

→ Agent loads the saved reading, compresses content for 1080×1440, generates carousel PNGs.

```
User: List my recent readings
```

→ Agent runs `manage-readings.js list`, shows the index.

```
User: Generate web page from reading #2
```

→ Agent loads reading #2 from index, generates self-contained web page.

### Request multiple products

```
User: Interpret this spread, generate PDF and social cards

[Stargazer prompt...]
```

→ Agent runs full pipeline, delivers both products.

### Three-phase workflow

```
Stargazer Prompt
    │
    ▼
[Phase 1] Parse → structured card data
    │
    ▼
[Phase 2] Interpret → save reading (JSON + MD)
    │
    ▼
[Phase 3] Generate products from saved reading
           ├── A4 PDF (default, Kami style)
           ├── Web Page (standalone HTML)
           └── Social Card (1080×1440 carousel)
```

## Structure

```
├── SKILL.md                         # Main instructions (v3.1)
├── README.md                        # English docs
├── README.zh-CN.md                  # 中文文档
├── assets/
│   ├── seed-a4-pdf.html             # A4 PDF HTML skeleton
│   ├── seed-social-card.html        # 1080×1440 social card skeleton
│   └── seed-web-page.html           # Web page skeleton
├── cards/
│   ├── card-01-rider.svg ...        # 36 Geometric Silence SVG cards
│   └── previews/                    # 36 PNG card previews
├── previews/                        # Sample reading outputs
├── references/
│   ├── lenormand-cards.md           # 36-card database
│   ├── spread-parsing.md            # Prompt parsing rules
│   ├── design-system.md             # Shared fonts, colors, card slugs
│   ├── reading-schema.md            # JSON schema for persisted readings
│   └── template-*.md                # Template references
└── scripts/
    ├── generate-pdf.js              # HTML → A4 PDF
    ├── render-social-cards.js       # HTML → 1080×1440 PNGs
    └── manage-readings.js           # Reading index CLI
```

## License

MIT

## Credits & References

**Typography**
- [Chiron Sung HK (昭源宋體)](https://github.com/chiron-fonts/chiron-sung-hk) — variable serif, SIL OFL 1.1
- [Chiron Hei HK (昭源黑體)](https://github.com/chiron-fonts/chiron-hei-hk) — variable sans, SIL OFL 1.1

**Design**
- Visual style inspired by [Kami](https://github.com/tw93/Kami) — MIT

**Data**
- [Stargazer's Oracle](https://stargazer.estework.site/) — online Lenormand platform
- Lenormand card meanings from traditional interpretations (public domain)
