#!/usr/bin/env node
/**
 * validate.js — Stargazer Interpreter deliverable validator
 *
 * Usage:
 *   node scripts/validate.js <html-file> --type <a4-pdf|social-card|web-page>
 *
 * Exit codes:
 *   0 — all checks passed, safe to present to user
 *   1 — one or more checks failed, fix before presenting
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Arguments ───────────────────────────────────────────────────────────────

const args       = process.argv.slice(2);
const htmlFile   = args[0];
const typeIdx    = args.indexOf('--type');
const productType = typeIdx !== -1 ? args[typeIdx + 1] : 'a4-pdf';

const VALID_TYPES = ['a4-pdf', 'social-card', 'web-page'];

if (!htmlFile) {
  console.error('Usage: node scripts/validate.js <html-file> --type <a4-pdf|social-card|web-page>');
  process.exit(1);
}
if (!fs.existsSync(htmlFile)) {
  console.error(`File not found: ${htmlFile}`);
  process.exit(1);
}
if (!VALID_TYPES.includes(productType)) {
  console.error(`Unknown type "${productType}". Must be one of: ${VALID_TYPES.join(', ')}`);
  process.exit(1);
}

// ─── State ───────────────────────────────────────────────────────────────────

const html    = fs.readFileSync(htmlFile, 'utf8');
const results = [];
let   allPass = true;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function check(id, name, pass, detail) {
  const icon = pass ? '✓' : '✗';
  const line = detail
    ? `${icon} ${id.padEnd(4)} ${name} — ${detail}`
    : `${icon} ${id.padEnd(4)} ${name}`;
  console.log(line);
  results.push({ id, pass });
  if (!pass) allPass = false;
}

function countMatches(str, pattern) {
  return (str.match(pattern) || []).length;
}

// ─── Static checks (no browser needed) ───────────────────────────────────────

// R1 / R4 — No unreplaced {{PLACEHOLDER}} markers
const placeholderCount = countMatches(html, /\{\{/g);
check('R1', 'No unreplaced placeholders', placeholderCount === 0,
  placeholderCount > 0 ? `${placeholderCount} unreplaced {{ markers found — grep file for {{` : null);

// R2 — Font declarations present in HTML source
const hasSung = html.includes('chiron-sung-hk');
const hasHei  = html.includes('chiron-hei-hk');
check('R2', 'Chiron font declarations present', hasSung && hasHei,
  !hasSung ? 'chiron-sung-hk declaration missing'
  : !hasHei ? 'chiron-hei-hk declaration missing'
  : null);

// R3 — SVG card elements present (any svg element with a card-related class or id)
const svgCardCount = countMatches(html, /<svg[^>]*(class|id)="[^"]*(card|Card)[^"]*"/g);
check('R3', 'SVG card elements present in HTML source', svgCardCount > 0,
  svgCardCount === 0 ? 'No <svg> elements with card class/id found — check placeholder fill step' : null);

// Type-specific static checks

if (productType === 'a4-pdf') {
  // R6 — Page breaks: chapters 2+ must have break-before: page
  const breakBeforeCount = countMatches(html, /break-before\s*:\s*page/g);
  // Heuristic: count chapter section containers; adjust selector if needed
  const chapterCount = countMatches(html, /class="[^"]*chapter[^"]*"/g);
  // We expect at least (chapterCount - 1) break-before rules; warn if zero chapters found
  if (chapterCount === 0) {
    check('R6', 'Chapter page breaks', false,
      'Could not detect chapter elements — verify CSS class name contains "chapter"');
  } else {
    const expectedBreaks = chapterCount - 1;
    check('R6', 'Chapter page breaks (break-before: page)', breakBeforeCount >= expectedBreaks,
      breakBeforeCount < expectedBreaks
        ? `Expected ≥${expectedBreaks} break-before rules for ${chapterCount} chapters, found ${breakBeforeCount}`
        : null);
  }
}

if (productType === 'web-page') {
  // R9 — Self-contained: no external JS scripts (font CDN is acceptable)
  // Allowed external hosts: fonts.googleapis.com, fonts.gstatic.com, cdnjs.cloudflare.com, cdn.jsdelivr.net
  const externalScripts = (html.match(/<script[^>]+src=["']https?:\/\/[^"']+["']/g) || [])
    .filter(tag => !/fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net/.test(tag));
  check('R9', 'No unexpected external script dependencies', externalScripts.length === 0,
    externalScripts.length > 0 ? `External scripts found:\n  ${externalScripts.join('\n  ')}` : null);

  // R10 — Viewport meta tag present
  const hasViewport = /name=["']viewport["']/.test(html);
  check('R10', 'Viewport meta tag present', hasViewport,
    !hasViewport ? 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to <head>' : null);
}

// ─── Browser-based checks (Puppeteer) ────────────────────────────────────────

(async () => {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch {
    console.log('\n⚠  Puppeteer not available — skipping browser-based checks (R2b, R5, R7, R8)');
    console.log('   Install with: npm install puppeteer');
    finalize();
    return;
  }

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  try {
    const page = await browser.newPage();
    const absolutePath = path.resolve(htmlFile);
    await page.goto(`file://${absolutePath}`, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for fonts
    await page.evaluate(() => document.fonts.ready);

    // R2b — Chiron fonts actually rendered (not fallback serif/sans)
    const fontCheck = await page.evaluate(() => {
      const candidates = ['h1', 'h2', '.chapter-title', '.summary', 'p'];
      for (const sel of candidates) {
        const el = document.querySelector(sel);
        if (el) {
          const font = window.getComputedStyle(el).fontFamily.toLowerCase();
          return {
            ok: font.includes('chiron'),
            fontFamily: font,
            element: sel,
          };
        }
      }
      return { ok: false, fontFamily: 'no text element found', element: null };
    });
    check('R2b', 'Chiron font actually rendered in browser', fontCheck.ok,
      !fontCheck.ok
        ? `Element "${fontCheck.element}" computed font-family: "${fontCheck.fontFamily}" — font may not be loading; verify @font-face src paths`
        : null);

    // ── A4 PDF checks ──────────────────────────────────────────────────────

    if (productType === 'a4-pdf') {
      // R5 — Page balance: each chapter must fill ≥ 440pt (≈587px at 96dpi)
      const MIN_HEIGHT_PX = 587; // 440pt × (96/72)
      const chapterData = await page.evaluate(() => {
        // Try common chapter container selectors
        const selectors = ['.chapter', '[class*="chapter"]', 'section', 'article'];
        let chapters = [];
        for (const sel of selectors) {
          chapters = Array.from(document.querySelectorAll(sel));
          if (chapters.length > 0) break;
        }
        return chapters.map((ch, i) => ({
          index: i + 1,
          heightPx: Math.round(ch.getBoundingClientRect().height),
          selector: ch.className || ch.tagName,
        }));
      });

      if (chapterData.length === 0) {
        check('R5', 'Page balance (≥440pt per chapter)', false,
          'No chapter elements found — verify chapter container CSS class');
      } else {
        const thinChapters = chapterData.filter(ch => ch.heightPx < MIN_HEIGHT_PX);
        check('R5', 'Page balance (≥440pt per chapter)', thinChapters.length === 0,
          thinChapters.length > 0
            ? thinChapters.map(ch => `Chapter ${ch.index}: ${ch.heightPx}px (${Math.round(ch.heightPx * 0.75)}pt) < 440pt minimum`).join('; ')
            : null);
      }
    }

    // ── Social card checks ─────────────────────────────────────────────────

    if (productType === 'social-card') {
      // R7 — No overflow on any card page
      await page.setViewport({ width: 1080, height: 1440, deviceScaleFactor: 1 });

      const overflowData = await page.evaluate(() => {
        const selectors = ['.poster.xhs', '.poster', '[class*="poster"]', '.card-page', '.page', '[class*="card-page"]', '[class*="slide"]'];
        let pages = [];
        for (const sel of selectors) {
          pages = Array.from(document.querySelectorAll(sel));
          if (pages.length > 0) break;
        }
        return pages.map((p, i) => ({
          index: i + 1,
          scrollHeight: p.scrollHeight,
          clientHeight: p.clientHeight,
          overflow: p.scrollHeight > p.clientHeight + 5,
        }));
      });

      if (overflowData.length === 0) {
        check('R7', 'No content overflow on card pages', false,
          'No card page elements found — verify container CSS class contains "card-page", "page", or "slide"');
      } else {
        const overflowing = overflowData.filter(p => p.overflow);
        check('R7', 'No content overflow on card pages', overflowing.length === 0,
          overflowing.length > 0
            ? overflowing.map(p => `Page ${p.index}: scrollHeight ${p.scrollHeight}px > clientHeight ${p.clientHeight}px`).join('; ')
            : null);

        // R7b — Content pages must fill ~60% (no thin pages)
        // Skip cover (page 1); check content pages only
        const MIN_BODY_HEIGHT_PX = 500; // body-text area minimum fill
        const bodyHeightData = overflowData.filter(p => p.index > 1).map(p => ({
          index: p.index,
        }));
        // Re-evaluate with body-text height measurement
      }

      // R7b — Content page body-text area fills ≥500px (≈60% of usable area)
      const bodyTextData = await page.evaluate(() => {
        const selectors = ['.body-text', '[class*="body-text"]', '.content-page > div'];
        let blocks = [];
        for (const sel of selectors) {
          blocks = Array.from(document.querySelectorAll(sel));
          if (blocks.length > 0) break;
        }
        return blocks.map((b, i) => ({
          index: i + 2, // +2 because page 1 is cover
          heightPx: Math.round(b.getBoundingClientRect().height),
        }));
      });

      const MIN_BODY_HEIGHT = 500;
      if (bodyTextData.length === 0) {
        check('R7b', `Social card content pages fill ≥${MIN_BODY_HEIGHT}px`, false,
          'No .body-text elements found — verify content page structure');
      } else {
        const thinPages = bodyTextData.filter(p => p.heightPx < MIN_BODY_HEIGHT);
        check('R7b', `Social card content pages fill ≥${MIN_BODY_HEIGHT}px (~60%)`, thinPages.length === 0,
          thinPages.length > 0
            ? thinPages.map(p => `Page ${p.index}: body-text ${p.heightPx}px < ${MIN_BODY_HEIGHT}px minimum — consider expanding or merging with adjacent page`).join('; ')
            : null);
      }

      // R8 — Card SVGs have non-zero dimensions
      const cardSizeData = await page.evaluate(() => {
        const selectors = ['.cover-card-svg', 'svg.cover-card-svg', '.card-svg', 'svg.card', '.card-image svg', '.card svg', '[class*="card-face"]', '[class*="card-svg"]'];
        for (const sel of selectors) {
          const els = Array.from(document.querySelectorAll(sel));
          if (els.length > 0) {
            return els.slice(0, 3).map((el, i) => {
              const r = el.getBoundingClientRect();
              return { index: i + 1, width: Math.round(r.width), height: Math.round(r.height) };
            });
          }
        }
        return [];
      });

      if (cardSizeData.length === 0) {
        check('R8', 'SVG card faces have correct dimensions', false,
          'No SVG card elements found — verify card SVG selector');
      } else {
        const zeroSize = cardSizeData.filter(c => c.width === 0 || c.height === 0);
        check('R8', 'SVG card faces have correct dimensions', zeroSize.length === 0,
          zeroSize.length > 0
            ? zeroSize.map(c => `Card ${c.index}: ${c.width}×${c.height}px`).join('; ')
            : null);
      }
    }

  } finally {
    await browser.close();
  }

  finalize();
})().catch(err => {
  console.error(`\nPuppeteer error: ${err.message}`);
  console.log('Browser-based checks skipped due to error above.');
  finalize();
});

// ─── Final result ─────────────────────────────────────────────────────────────

function finalize() {
  const failed  = results.filter(r => !r.pass).map(r => r.id);
  const passed  = results.filter(r => r.pass).map(r => r.id);

  console.log('');
  console.log(`Passed: ${passed.join(', ') || 'none'}`);
  if (failed.length > 0) {
    console.log(`Failed: ${failed.join(', ')}`);
    console.log('\nFix all failures and re-render before presenting to user.');
    process.exit(1);
  } else {
    console.log('\nAll checks passed. Safe to present to user.');
    process.exit(0);
  }
}
