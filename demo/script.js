/* ============================================================
   STATE
   ============================================================ */
const state = {
  question: '',
  cards: [],       // [{num, name, slug}]
  parsed: null,    // result from parseReading()
  cardSVGs: {},    // cache: num → SVG string
  websiteInstructions: '' // interpretation instructions from website output
};

/* ============================================================
   UI HELPERS
   ============================================================ */
function $(id) { return document.getElementById(id); }

function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

function showSpinner(msg) {
  $('spinner-msg').textContent = msg || '載入中...';
  $('spinner').classList.add('show');
}

function hideSpinner() {
  $('spinner').classList.remove('show');
}

function showError(msg) {
  const el = $('parse-error');
  el.textContent = msg;
  el.classList.add('show');
}

function hideError() {
  $('parse-error').classList.remove('show');
}

/* ============================================================
   SECTION A — Prompt Generator
   ============================================================ */
function generatePrompt() {
  const today = new Date().toISOString().slice(0, 10);

  // Daily fortune: always 3 cards, position labels 1/2/3
  const positions = ['1', '2', '3'];

  // CARDS line
  const cardsLine = state.cards.map((c, i) => {
    const num = String(c.num).padStart(2, '0');
    const pos = positions[i] || `位置${i + 1}`;
    return `  ${pos}: ${num}. ${c.name}`;
  }).join('\n');

  // Chapter structure for daily fortune (3 cards):
  const [c1, c2, c3] = state.cards;
  if (!c1 || !c2 || !c3) {
    // Cards not loaded yet — shouldn't happen but guard
    return '';
  }
  const chapters = [
    `===CHAPTER_1===\n**組合 1+2：${c1.name} + ${c2.name}**\n{用「名詞+修飾」模型解讀：${c1.name}是主體，${c2.name}修飾它。先給出${c1.name}的字面意義，再用${c2.name}來調整或補充，形成一個具體、日常的場景。例如：一個消息（信）帶來了嶄新的開始（小孩）。}`,
    `===CHAPTER_2===\n**組合 2+3：${c2.name} + ${c3.name}**\n{用「名詞+修飾」模型解讀：${c2.name}是主體，${c3.name}修飾它。描述這個組合如何推動今天的情境往前發展。注意如果${c3.name}傳統上較沉重，請縮小尺度，用日常語境解讀。}`,
    `===CHAPTER_3===\n**整體意義**\n{將三張牌連成一句完整、連貫的訊息。描述今天的主旋律：從什麼開始，經過什麼轉折，走向什麼結果。保持務實、清晰。}`,
    `===CHAPTER_4===\n**今日提醒**\n{用一到兩句話，給出今天可以放在心上的具體行動建議或心態提醒。必須是可執行的、貼近日常生活的，不要抽象或雞湯式的建議。}`
  ];

  // Build prompt sections
  const sections = [
    '你是一位專業的諾曼底牌陣解讀師。請嚴格按照以下格式輸出解讀，',
    '不要在格式之外添加任何文字，不要用代碼塊包裹輸出。',
    '',
    '【牌陣資訊】',
    `問題：Daily Fortune`,
    '牌陣：每日運勢 3 張（Daily Fortune）',
    '抽到的牌：',
    ...state.cards.map((c, i) => `  ${positions[i] || `位置${i+1}`}: ${String(c.num).padStart(2, '0')}. ${c.name}`),
  ];

  // Append website interpretation instructions if available
  if (state.websiteInstructions) {
    sections.push('', '【解讀要求】', state.websiteInstructions);
  } else {
    sections.push(
      '',
      '【解讀要求】',
      '以「組合」為核心，不要逐張單獨給牌義。先將相鄰的牌兩兩串連，再把三張連成一句完整、連貫的訊息。',
      '最後用一到兩句話，給出一個今天可以放在心上的「今日提醒」。'
    );
  }

  sections.push(
    '',
    '【解讀心法】',
    '1. 從牌面最日常、最字面的意思開始解讀。信 = 訊息/郵件/通知，小孩 = 新開始/好奇心/學習，錨 = 穩定/安全/扎根。避免跳進過於抽象或誇張的象徵。',
    '2. 組合時使用「名詞 + 修飾」模型：前一張牌是主體（名詞），後一張牌修飾它（形容詞）。例如「信 + 小孩」→ 一個消息帶來了嶄新的開始。',
    '3. 每日運勢是務實的生活參考，不是命運預言。遇到傳統上較沉重的牌（如棺材、鐮刀），請縮小尺度：棺材可能只是結束一個小任務或休息，鐮刀可能只是一個果斷的小決定。',
    '4. 解讀應清晰、簡潔、有用。讓問者讀完後知道今天該注意什麼、可以怎麼做，而不是聽一個模糊的故事。',
    '',
    '【輸出格式（請完整照填）】',
    '',
    '===STARGAZER===',
    'QUESTION: Daily Fortune',
    `DATE: ${today}`,
    'LANGUAGE: zh',
    'CARDS:',
    cardsLine,
    '',
    ...chapters,
    '',
    '===SUMMARY===',
    '{請在此填入 2-4 句總結}',
    '',
    '===END==='
  );

  return sections.join('\n');
}

/* ============================================================
   SECTION A — Website Output Parser
   ============================================================ */
function parseWebsiteOutput(rawText) {
  const text = rawText.trim();
  if (!text) throw new Error('請先貼上 Stargazer\'s Oracle 產生的文字');

  // Build reverse lookup: Chinese name → card number
  const nameToNum = {};
  for (const card of LENORMAND_CARDS) {
    nameToNum[card.zh] = card.num;
  }

  // Extract date: 【日期】2026/06/21 or 2026-06-21
  const dateMatch = text.match(/【日期】\s*(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/);
  if (!dateMatch) throw new Error('找不到【日期】，請確認貼上了完整的 Stargazer\'s Oracle 文字');
  const date = dateMatch[1].replace(/\//g, '-');

  // Extract card count from spread line: 【牌陣】... N 張 ...
  const spreadMatch = text.match(/【牌陣】/);
  if (!spreadMatch) throw new Error('找不到【牌陣】，請確認貼上了完整的 Stargazer\'s Oracle 文字');

  // Count numbered cards: 1. 信 (Letter), 2. 小孩 (Child), ...
  const cardLines = [];
  const cardRegex = /^(\d+)\.\s*(.+?)\s*\(([^)]+)\)/gm;
  let m;
  while ((m = cardRegex.exec(text)) !== null) {
    cardLines.push({ index: m[1], name: m[2].trim(), enName: m[3].trim() });
  }

  if (cardLines.length !== 3) {
    throw new Error('目前僅支援 3 張牌的每日運勢，請確認貼上正確的文字');
  }

  // Map card names to numbers
  const cards = [];
  for (const cl of cardLines) {
    const num = nameToNum[cl.name];
    if (!num) throw new Error(`找不到牌「${cl.name}」的對應號碼，請確認牌名是否正確`);
    cards.push({ num, name: cl.name, slug: LENORMAND_CARDS_BY_NUM[num].slug });
  }

  // Extract question from first line (e.g. "請為我解讀今天的每日運勢。")
  const firstLine = text.split('\n')[0].replace(/^請為我解讀/, '').replace(/[。！]/g, '').trim();
  const question = firstLine || '日常占卜';

  // Extract interpretation instructions — everything after the last card line
  const lastCardMatch = [...text.matchAll(cardRegex)].at(-1);
  let instructions = '';
  if (lastCardMatch) {
    const afterCards = text.slice(lastCardMatch.index + lastCardMatch[0].length).trim();
    // Remove leading blank lines
    instructions = afterCards.replace(/^\n+/, '').trim();
  }
  state.websiteInstructions = instructions;

  // Auto-fill state
  state.question = question;
  state.cards = cards;

  return { question, date, cards };
}

async function parseWebsiteAndCopy() {
  const errEl = $('website-parse-error');
  errEl.classList.remove('show');
  errEl.textContent = '';

  try {
    const rawText = $('website-textarea').value;
    parseWebsiteOutput(rawText);

    // Generate and copy prompt
    const prompt = generatePrompt();
    try {
      await navigator.clipboard.writeText(prompt);
      showToast('✓ 已解析並複製 Prompt！請貼到 AI 對話中。');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('✓ 已解析並複製 Prompt！請貼到 AI 對話中。');
    }

    // Clear website textarea
    $('website-textarea').value = '';

    // Scroll to top so user sees the filled form
    $('section-a').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    errEl.textContent = err.message;
    errEl.classList.add('show');
  }
}

/* ============================================================
   SECTION B — Parser
   ============================================================ */
function parseReading(rawText) {
  // Step 1: Strip code fences
  let text = rawText.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
  }

  // Step 2: Normalize markers — Gemini sometimes collapses === to = (or expands to ==== etc.)
  // Match any number of = signs around known tags on standalone lines
  text = text.replace(/^=+STARGAZER=+$/gm, '===STARGAZER===');
  text = text.replace(/^=+CHAPTER_(\d+)=+$/gm, '===CHAPTER_$1===');
  text = text.replace(/^=+SUMMARY=+$/gm, '===SUMMARY===');
  text = text.replace(/^=+END=+$/gm, '===END===');

  // Step 3: Extract main block
  const startMarker = '===STARGAZER===';
  const endMarker = '===END===';
  const startIdx = text.indexOf(startMarker);
  const endIdx = text.indexOf(endMarker);

  if (startIdx === -1) {
    throw new Error('找不到 ===STARGAZER=== 或 =STARGAZER= 標記 — 請確認完整複製了 AI 的輸出');
  }
  if (endIdx === -1) {
    throw new Error('找不到 ===END=== 或 =END= 標記 — 請確認完整複製了 AI 的輸出');
  }

  const block = text.slice(startIdx + startMarker.length, endIdx).trim();

  // Step 3: Extract chapter blocks — stop at next chapter, summary, or end
  // Uses \s* instead of \s*\n to handle both multi-line and same-line chapter content
  const chapters = [];
  const chapterRegex = /===CHAPTER_(\d+)===\s*([\s\S]*?)(?=\n===CHAPTER_\d+===|\n===SUMMARY===|\n===END===|$)/g;
  const chapterBlock = text.slice(startIdx + startMarker.length, endIdx);
  let chMatch;
  while ((chMatch = chapterRegex.exec(chapterBlock)) !== null) {
    const raw = chMatch[2].trim();
    // First try: standard format with **...** title
    const titleMatch = raw.match(/^\*\*(.+?)\*\*/);
    let title, body;
    if (titleMatch) {
      title = titleMatch[1].trim();
      body = raw.slice(titleMatch[0].length).trim();
    } else {
      // Fallback: condensed format — detect title patterns for AI-generated output
      // Pattern for combo chapters (1+2, 2+3): 「組合 X+Y：CardName + CardName」
      const comboMatch = raw.match(/^(組合 \d+\+\d+：.+? \+ .+?)(?=[，。！？\s]|$)/);
      if (comboMatch) {
        title = comboMatch[1].trim();
        body = raw.slice(comboMatch[0].length).trim();
      } else if (/^整體意義/.test(raw)) {
        title = '整體意義';
        body = raw.replace(/^整體意義\s*/, '').trim();
      } else if (/^今日提醒/.test(raw)) {
        title = '今日提醒';
        body = raw.replace(/^今日提醒\s*/, '').trim();
      } else {
        // Last-resort fallback: first sentence as title
        const firstSentence = raw.match(/^(.+?)(?=[，。！？]|\s{2,}|$)/);
        title = firstSentence ? firstSentence[1].trim() : `Chapter ${chMatch[1]}`;
        body = firstSentence ? raw.slice(firstSentence[0].length).trim() : raw;
      }
    }
    chapters.push({ title, body });
  }

  // Step 4: Extract summary — content between ===SUMMARY=== and ===END===
  // Uses \s* instead of \s*\n to handle same-line summary content
  const summaryRegex = /===SUMMARY===\s*([\s\S]*?)(?=\n===END===|$)/;
  const summaryMatch = text.match(summaryRegex);
  const summary = summaryMatch ? summaryMatch[1].trim() : '';

  // Step 5: Parse header fields (case-insensitive)
  function getField(name) {
    const re = new RegExp(`^${name}\\s*:\\s*(.+)$`, 'im');
    const m = block.match(re);
    return m ? m[1].trim() : null;
  }

  // Step 4a: Detect condensed header format — all fields on the same line as ===STARGAZER===
  const firstLine = block.split('\n')[0].trim();
  const condensedFieldCount = (firstLine.match(/\b(?:QUESTION|DATE|LANGUAGE|CARDS|VERDICT|OPTION_A|OPTION_B)\s*:/gi) || []).length;

  let question, date, language, verdict, optionA, optionB, cards;

  if (condensedFieldCount > 1) {
    // Condensed format: parse all fields from the first line
    const fieldParts = firstLine.split(/\s+(?=(?:QUESTION|DATE|LANGUAGE|VERDICT|OPTION_A|OPTION_B|CARDS)\s*:)/i);
    const fields = {};
    for (const part of fieldParts) {
      const m = part.match(/^(QUESTION|DATE|LANGUAGE|VERDICT|OPTION_A|OPTION_B|CARDS)\s*:\s*(.*)$/i);
      if (m) fields[m[1].toUpperCase()] = m[2].trim();
    }

    question = fields.QUESTION || '日常占卜';
    date = fields.DATE || new Date().toISOString().slice(0,10);
    language = fields.LANGUAGE || 'zh';
    verdict = fields.VERDICT || 'N/A';
    optionA = fields.OPTION_A || 'N/A';
    optionB = fields.OPTION_B || 'N/A';
    cards = [];

    // Parse inline CARDS: "1: 09. 花束 2: 33. 鑰匙 3: 25. 戒指"
    if (fields.CARDS) {
      const cardEntries = fields.CARDS.split(/\s+(?=\d+:)/);
      for (const entry of cardEntries) {
        const m = entry.match(/^(\d+):\s*(\d{1,2})\.\s*(.+)$/);
        if (m) {
          cards.push({
            position: m[1].trim(),
            number: parseInt(m[2]),
            name: m[3].trim()
          });
        }
      }
    }
  } else {
    // Standard format: fields on separate lines
    question = getField('QUESTION') || '日常占卜';
    date = getField('DATE') || new Date().toISOString().slice(0,10);
    language = getField('LANGUAGE') || 'zh';
    verdict = getField('VERDICT') || 'N/A';
    optionA = getField('OPTION_A') || 'N/A';
    optionB = getField('OPTION_B') || 'N/A';
    cards = [];

    // Parse cards — standard multi-line format
    const cardsBlock = block.match(/CARDS:\s*\n([\s\S]*?)(?=\n===|$)/i);
    if (cardsBlock) {
      const cardLines = cardsBlock[1].trim().split('\n');
      for (const line of cardLines) {
        const m = line.trim().match(/^(.+?):\s*(\d{1,2})\.\s*(.+)$/);
        if (m) {
          cards.push({
            position: m[1].trim(),
            number: parseInt(m[2]),
            name: m[3].trim()
          });
        }
      }
    }
  }

  if (cards.length === 0) {
    throw new Error('找不到 CARDS 區塊或卡片格式不正確');
  }

  return { question, date, language, verdict, optionA, optionB, cards, chapters, summary };
}

/* ============================================================
   CARD SVG LOADING
   ============================================================ */
async function loadCardSVG(cardNum) {
  if (state.cardSVGs[cardNum]) return state.cardSVGs[cardNum];

  const card = LENORMAND_CARDS_BY_NUM[cardNum];
  if (!card) return null;

  const path = `../cards/card-${String(cardNum).padStart(2,'0')}-${card.slug}.svg`;

  try {
    const resp = await fetch(path);
    if (!resp.ok) return null;
    let svgText = await resp.text();

    // Extract inner content (strip outer <svg> tags), KEEP defs
    const innerMatch = svgText.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
    if (innerMatch) {
      svgText = innerMatch[1].trim();
    }

    state.cardSVGs[cardNum] = svgText;
    return svgText;
  } catch (e) {
    console.warn(`Failed to load card ${cardNum}:`, e);
    return null;
  }
}

async function loadAllCardSVGs(cardNumbers) {
  const uniqueNums = [...new Set(cardNumbers)];
  await Promise.all(uniqueNums.map(n => loadCardSVG(n)));
}

/* ============================================================
   RENDERER — Build web-format page in Section D
   ============================================================ */
function getWebCardSize(cardCount) {
  if (cardCount <= 3) return { w: 140, h: 210 };
  if (cardCount <= 5) return { w: 110, h: 165 };
  return { w: 80, h: 120 }; // 9 cards
}

function buildWebHeader(data) {
  const { date, cards, verdict, optionA, optionB } = data;
  const cardSize = getWebCardSize(cards.length);

  // Card row
  let cardsHTML = '<div class="card-row">';
  cards.forEach(card => {
    const cardNum = String(card.number).padStart(2, '0');
    const svgContent = state.cardSVGs[card.number] || `<text x="512" y="740" text-anchor="middle" font-size="80" fill="#ccc">${cardNum}</text>`;
    cardsHTML += `
      <div class="card-wrap">
        <svg class="card-svg" viewBox="0 0 1024 1536" width="${cardSize.w}" height="${cardSize.h}">
          ${svgContent}
        </svg>
        <span class="card-label">${card.name}</span>
        <span class="card-pos">${card.position}</span>
      </div>`;
  });
  cardsHTML += '</div>';

  // Verdict
  let verdictHTML = '';
  if (verdict && verdict !== 'N/A') {
    const vLabel = verdict === 'YES' ? '✓ YES' : verdict === 'NO' ? '✗ NO' : '~ MAYBE';
    const vClass = verdict === 'YES' ? 'yes' : verdict === 'NO' ? 'no' : 'maybe';
    verdictHTML = `<div class="verdict-line ${vClass}">${vLabel}</div>`;
  }

  // Options
  let optionsHTML = '';
  if (optionA && optionA !== 'N/A' && optionB && optionB !== 'N/A') {
    optionsHTML = `<div class="options-line">A: ${escapeHTML(optionA)} 　 B: ${escapeHTML(optionB)}</div>`;
  }

  return `
    <div class="web-header">
      <div class="label">Daily Fortune</div>
      <h1>每日運勢</h1>
      <div class="date">${date}</div>
    </div>
    ${cardsHTML}
    ${verdictHTML}
    ${optionsHTML}`;
}

function buildWebChapter(chapter) {
  let bodyHTML = '';
  const paragraphs = chapter.body.split(/\n\n+/).filter(p => p.trim());
  for (const para of paragraphs) {
    const formatted = para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    bodyHTML += `<p>${formatted}</p>`;
  }

  return `
    <div class="chapter">
      <h2>${escapeHTML(chapter.title)}</h2>
      ${bodyHTML}
    </div>`;
}

function buildWebSummary(summary) {
  let textHTML = '';
  const paragraphs = summary.split(/\n\n+/).filter(p => p.trim());
  for (const para of paragraphs) {
    textHTML += `<p>${escapeHTML(para)}</p>`;
  }

  return `<div class="summary-block">${textHTML}</div>`;
}

function buildRenderTarget(data) {
  const renderTarget = $('render-target');
  const date = data.date || new Date().toISOString().slice(0, 10);

  renderTarget.innerHTML = `
    ${buildWebHeader(data)}
    ${buildWebSummary(data.summary)}
    ${data.chapters.map(ch => buildWebChapter(ch)).join('')}
    <div class="web-footer">Lenormand Reading · Stargazer Interpreter · ${date}<br>Try it: stargazer-interpreter.1mether.me/demo</div>`;
}

/* ============================================================
   SECTION C — Preview clone
   ============================================================ */
function updatePreview(data) {
  const container = $('preview-container');
  const renderTarget = $('render-target');
  container.innerHTML = '';

  // Copy innerHTML from render target into preview wrapper
  const preview = document.createElement('div');
  preview.className = 'render-target';
  preview.innerHTML = renderTarget.innerHTML;

  container.appendChild(preview);

  // Update meta
  $('preview-meta').textContent =
    `${data.cards.length} 張牌 · ${data.chapters.length} 章`;

  // Show section C
  $('section-c-wrap').classList.add('show');
}

/* ============================================================
   EXPORT — html2canvas long image
   ============================================================ */
async function exportLongImage() {
  if (!state.parsed) return;

  showSpinner('正在生成長圖...');
  const renderTarget = $('render-target');

  try {
    await document.fonts.ready;

    const canvas = await html2canvas(renderTarget, {
      scale: 2,
      backgroundColor: '#faf9f5',
      width: 720,
      windowWidth: 720,
      useCORS: false
    });

    const date = state.parsed.date || new Date().toISOString().slice(0,10);
    const link = document.createElement('a');
    link.download = `stargazer-${date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    showToast('✓ 長圖已下載！');
  } catch (err) {
    console.error('Export failed:', err);
    showToast('✗ 匯出失敗，請重試');
  } finally {
    hideSpinner();
  }
}

/* ============================================================
   GENERATE PREVIEW FLOW
   ============================================================ */
async function generatePreview() {
  hideError();
  const rawText = $('paste-textarea').value.trim();

  if (!rawText) {
    showError('請先貼上 AI 的回覆內容');
    return;
  }

  // Parse
  let data;
  try {
    data = parseReading(rawText);
    state.parsed = data;
  } catch (err) {
    showError(err.message);
    return;
  }

  // Load card SVGs
  showSpinner('載入卡牌圖像...');
  const cardNums = data.cards.map(c => c.number);
  try {
    await loadAllCardSVGs(cardNums);
  } catch (err) {
    console.warn('Some card SVGs failed to load:', err);
  }
  hideSpinner();

  // Build render target
  buildRenderTarget(data);

  // Update preview
  updatePreview(data);

  // Scroll to preview
  $('section-c').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============================================================
   UTILITY
   ============================================================ */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ============================================================
   EVENT BINDINGS & INIT
   ============================================================ */
$('btn-parse-website').addEventListener('click', parseWebsiteAndCopy);
$('btn-generate').addEventListener('click', generatePreview);
$('btn-download').addEventListener('click', exportLongImage);

console.log('Stargazer Demo ready.');
console.log('Cards loaded:', LENORMAND_CARDS.length);
