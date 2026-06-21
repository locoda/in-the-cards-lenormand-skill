# Stargazer Interpreter · 星解者

A [WorkBuddy](https://www.codebuddy.ai) & [Claude Code](https://claude.ai/code) skill for interpreting Lenormand card readings from [Stargazer's Oracle](https://stargazer.estework.site/). Follows the [Agent Skills](https://agentskills.io) open standard.

Parses AI prompts → produces traditional combination-reading interpretations → generates Kami-styled A4 PDF visualizations.

## Features

- **6 spread types**: 1-card Yes/No, 2-card, 3-card, 5-card, 9-card Box Spread (3×3), A-or-B choice
- **Bilingual**: Auto-detects Chinese or English prompts
- **Combination-first reading**: Adjacent card pair chains, not isolated card meanings
- **PDF output**: Kami-styled — warm parchment (#f5f4ed) + ink-blue accent (#1B365D) + Chiron Sung HK variable font
- **Text-only cards**: Clean number + name display with polarity-colored backgrounds — no external images, no copyright concerns
- **Geometric Silence Deck**: Optional inline SVG card faces — cream/sage/rose Swiss International Style — 36 SVG + 36 PNG previews bundled in `cards/`

## Install

### WorkBuddy
```bash
git clone https://github.com/locoda/stargazer-interpreter.git ~/.codebuddy/skills/stargazer-interpreter/
```

### Claude Code
This skill follows the [Agent Skills](https://agentskills.io) open standard and is compatible with Claude Code:
```bash
git clone https://github.com/locoda/stargazer-interpreter.git ~/.claude/skills/stargazer-interpreter/
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

## Credits & References

**Typography**
- [Chiron Sung HK (昭源宋體)](https://github.com/chiron-fonts/chiron-sung-hk) — the variable serif font used for both headings and body text. Derived from [Source Han Serif](https://github.com/adobe-fonts/source-han-serif) / [Noto Serif CJK](https://github.com/googlefonts/noto-cjk). Licensed under [SIL OFL 1.1](https://scripts.sil.org/OFL).

**Design**
- Visual style inspired by [Kami](https://github.com/tw93/Kami) — the warm parchment + ink-blue A4 typesetting aesthetic by [tw93](https://github.com/tw93). Kami is MIT-licensed.

**Data**
- [Stargazer's Oracle](https://stargazer.estework.site/) — the online Lenormand reading platform that generates the AI prompts this skill interprets.
- Lenormand card meanings draw from traditional interpretations in the public domain, compiled and annotated for this skill.
