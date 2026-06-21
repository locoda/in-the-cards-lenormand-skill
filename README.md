# Stargazer Interpreter · 星解者

A [WorkBuddy](https://www.codebuddy.ai) skill for interpreting Lenormand card readings from [Stargazer's Oracle](https://stargazer.estework.site/).

Parses AI prompts → produces traditional combination-reading interpretations → generates Kami-styled A4 PDF visualizations.

## Features

- **6 spread types**: 1-card Yes/No, 2-card, 3-card, 5-card, 9-card Box Spread (3×3), A-or-B choice
- **Bilingual**: Auto-detects Chinese or English prompts
- **Combination-first reading**: Adjacent card pair chains, not isolated card meanings
- **PDF output**: Kami-styled — warm parchment (#f5f4ed) + ink-blue accent (#1B365D) + Chiron Sung HK variable font
- **Card images**: Pulls from Stargazer with inline SVG fallback

## Install

```bash
git clone https://github.com/locoda/stargazer-interpreter.git ~/.codebuddy/skills/stargazer-interpreter/
```

Requires: Node.js + Puppeteer + Google Chrome for PDF generation.

## Usage

1. Go to [Stargazer's Oracle](https://stargazer.estework.site/), draw a spread, copy the AI prompt
2. Paste it into WorkBuddy with "帮我解读" or "interpret this spread"
3. The skill auto-triggers and produces an A4 PDF

## Structure

```
├── SKILL.md                     # Main skill instructions
├── references/
│   ├── lenormand-cards.md       # 36-card database with meanings
│   ├── spread-parsing.md        # Prompt parsing rules
│   └── visual-templates.md      # HTML/CSS templates
└── scripts/
    └── generate-pdf.js          # Puppeteer HTML→PDF converter
```

## License

MIT
