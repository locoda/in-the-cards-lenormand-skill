# Stargazer Interpreter · 星解者

> [English](README.md)

一个 [WorkBuddy](https://www.codebuddy.ai) 技能，用于解读来自 [Stargazer's Oracle（观星者神谕）](https://stargazer.estework.site/) 的雷诺曼（Lenormand）牌阵。遵循 [Agent Skills](https://agentskills.io) 开放标准。

粘贴 Stargazer AI 提示词 → 获得传统组合解读 → 输出为 Kami 风格 A4 PDF，内饰 Geometric Silence 极简 SVG 牌面。

## 功能特性

- **6 种牌阵**：1 张是非题、2 张对牌、3 张线性、5 张线性、9 张九宫格（3×3）、二选一
- **双语**：自动识别中文或英文提示词
- **组合优先解读**：相邻牌对链式解读，而非孤立的单张释义
- **Geometric Silence SVG 牌面（默认）**：内联 SVG 牌面 — 米白/鼠尾草绿/灰玫瑰色瑞士国际风格，无边框、无极性标签 — 36 张牌面打包在 `cards/` 目录
- **清晰章节分页**：每个分析视角独立一页（`break-before`），内容均衡（每页 ≥50% 填充）
- **Kami 风格 PDF**：暖羊皮纸底色 (#f5f4ed) + 墨蓝强调色 (#1B365D) + 昭源宋体可变字体

## 预览

| 牌阵 | 牌面 | 预览 |
|------|------|------|
| 3 张 | 星星 → 心 → 鑰匙 | [PDF](previews/lenormand-three-前进方向-2026-06-20.pdf) |
| 5 张 | 船 → 蛇 → 月亮 → 十字架 → 星星 | [PDF](previews/lenormand-five-人生转折-2026-06-20.pdf) |
| 9 张 (英文) | Clover·Star·Sun / Ship·Key·Garden / Tree·Moon·Anchor | [PDF](previews/preview-nine-en.pdf) |

## 安装

对你的 AI 助手说：

> 帮我安装 stargazer-interpreter 技能，地址是 https://github.com/locoda/stargazer-interpreter

助手会自动克隆到正确的目录。手动参考：

```bash
# WorkBuddy
git clone https://github.com/locoda/stargazer-interpreter.git ~/.workbuddy/skills/stargazer-interpreter/

# Claude Code
git clone https://github.com/locoda/stargazer-interpreter.git ~/.claude/skills/stargazer-interpreter/
```

需要 Node.js + Puppeteer + Google Chrome 用于 PDF 生成（Puppeteer 首次使用时自动安装自带 Chromium，无需额外配置）。

## 使用方式

1. 前往 [Stargazer's Oracle](https://stargazer.estework.site/)，抽取牌阵，复制 AI 提示词
2. 粘贴到 WorkBuddy 中，说「帮我解读」或「interpret this spread」
3. 技能自动触发，生成 A4 PDF

## 目录结构

```
├── SKILL.md                     # 主技能指令（v2.1）
├── README.md                    # 英文文档
├── README.zh-CN.md              # 中文文档
├── cards/
│   ├── card-01-rider.svg ...    # 36 张 Geometric Silence SVG 牌面
│   └── previews/                # 36 张 PNG 预览
├── previews/                    # 解读样例 PDF
├── references/
│   ├── lenormand-cards.md       # 36 张牌完整数据库
│   ├── spread-parsing.md        # 提示词解析规则
│   └── visual-templates.md      # HTML/CSS 模板 + 分页平衡规则
└── scripts/
    └── generate-pdf.js          # Puppeteer HTML→PDF 转换脚本
```

## 许可证

MIT

## 致谢与参考

**字体**
- [昭源宋體 (Chiron Sung HK)](https://github.com/chiron-fonts/chiron-sung-hk) — 标题与正文使用的可变宋体。源自 [Source Han Serif](https://github.com/adobe-fonts/source-han-serif) / [Noto Serif CJK](https://github.com/googlefonts/noto-cjk)。基于 [SIL OFL 1.1](https://scripts.sil.org/OFL) 授权。

**设计**
- 视觉风格受到 [Kami](https://github.com/tw93/Kami) 的启发 — [tw93](https://github.com/tw93) 创作的暖羊皮纸 + 墨蓝 A4 排版美学。Kami 基于 MIT 授权。

**数据**
- [Stargazer's Oracle（观星者神谕）](https://stargazer.estework.site/) — 生成 AI 提示词的在线雷诺曼占卜平台。
- 雷诺曼牌义参考公有领域的传统解读。
