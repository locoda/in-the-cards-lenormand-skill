#!/usr/bin/env node
/**
 * In the Cards — Skill Update Checker
 *
 * Checks whether the installed skill's SKILL.md version is older than an
 * upstream SKILL.md version. Designed for the SKILL.md startup hook: by default
 * it is silent unless an update is available.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFileSync } = require('child_process');

const DEFAULT_CACHE_DAYS = 7;
const CACHE_FILE = '.last-update-check';

function parseArgs(argv) {
  const options = {
    skillRoot: process.cwd(),
    cacheDays: DEFAULT_CACHE_DAYS,
    verbose: false,
    force: false,
    source: process.env.IN_THE_CARDS_UPDATE_SOURCE || process.env.STARGAZER_INTERPRETER_UPDATE_SOURCE || null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--skill-root') options.skillRoot = argv[++i];
    else if (arg === '--cache-days') options.cacheDays = Number(argv[++i]);
    else if (arg === '--source') options.source = argv[++i];
    else if (arg === '--verbose') options.verbose = true;
    else if (arg === '--force') options.force = true;
    else if (arg === '--help') {
      printHelp();
      process.exit(0);
    }
  }

  options.skillRoot = path.resolve(options.skillRoot);
  return options;
}

function printHelp() {
  console.log(`Usage: node scripts/check-skill-update.js [options]\n\nOptions:\n  --skill-root <path>  Skill root containing SKILL.md (default: cwd)\n  --source <source>    Upstream SKILL.md URL, local file, or directory\n  --cache-days <days>  Minimum days between checks (default: 7)\n  --force             Ignore the cache and check now\n  --verbose           Print no-update and diagnostic messages\n\nSource resolution order:\n  1. --source\n  2. IN_THE_CARDS_UPDATE_SOURCE\n  3. STARGAZER_INTERPRETER_UPDATE_SOURCE (legacy)\n  4. .update-source file in the skill root\n  5. GitHub origin/upstream remote converted to raw SKILL.md URL\n`);
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function extractFrontMatterValue(text, key) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const line = match[1].split(/\r?\n/).find((item) => item.startsWith(`${key}:`));
  if (!line) return null;
  return line.slice(key.length + 1).trim().replace(/^['"]|['"]$/g, '');
}

function parseVersion(version) {
  const match = String(version || '').trim().match(/^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/);
  if (!match) return null;
  return match.slice(1).map(Number);
}

function compareVersions(a, b) {
  const av = parseVersion(a);
  const bv = parseVersion(b);
  if (!av || !bv) return 0;
  for (let i = 0; i < 3; i += 1) {
    if (av[i] > bv[i]) return 1;
    if (av[i] < bv[i]) return -1;
  }
  return 0;
}

function shouldSkip(cachePath, cacheDays, force) {
  if (force || cacheDays <= 0 || !fs.existsSync(cachePath)) return false;
  const lastCheck = Number(readText(cachePath).trim());
  if (!Number.isFinite(lastCheck)) return false;
  const elapsedSeconds = Math.floor(Date.now() / 1000) - lastCheck;
  return elapsedSeconds < cacheDays * 24 * 60 * 60;
}

function updateCache(cachePath) {
  fs.writeFileSync(cachePath, `${Math.floor(Date.now() / 1000)}\n`, 'utf-8');
}

function execGit(skillRoot, args) {
  return execFileSync('git', ['-C', skillRoot, ...args], { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

function getDefaultBranch(skillRoot, remote) {
  try {
    const output = execGit(skillRoot, ['ls-remote', '--symref', remote, 'HEAD']);
    const match = output.match(/^ref: refs\/heads\/(\S+)\s+HEAD/m);
    if (match) return match[1];
  } catch (_error) {
    // Fall through to common defaults.
  }
  return 'main';
}

function githubRawUrl(remoteUrl, branch) {
  const normalized = remoteUrl.replace(/\.git$/, '');
  const ssh = normalized.match(/^git@github\.com:([^/]+)\/(.+)$/);
  const httpsMatch = normalized.match(/^https:\/\/github\.com\/([^/]+)\/(.+)$/);
  const match = ssh || httpsMatch;
  if (!match) return null;
  return `https://raw.githubusercontent.com/${match[1]}/${match[2]}/${branch}/SKILL.md`;
}

function resolveSource(options) {
  if (options.source) return options.source;

  const sourceFile = path.join(options.skillRoot, '.update-source');
  if (fs.existsSync(sourceFile)) {
    const value = readText(sourceFile).trim();
    if (value) return value;
  }

  for (const remote of ['origin', 'upstream']) {
    try {
      const remoteUrl = execGit(options.skillRoot, ['remote', 'get-url', remote]);
      const branch = getDefaultBranch(options.skillRoot, remote);
      const rawUrl = githubRawUrl(remoteUrl, branch);
      if (rawUrl) return rawUrl;
    } catch (_error) {
      // Try the next remote.
    }
  }

  return null;
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'in-the-cards-lenormand-update-check' } }, (response) => {
      if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
        response.resume();
        fetchUrl(response.headers.location).then(resolve, reject);
        return;
      }
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`HTTP ${response.statusCode} from ${url}`));
        return;
      }
      let data = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function readSource(source) {
  if (/^https?:\/\//.test(source)) return fetchUrl(source);
  const sourcePath = path.resolve(source);
  const stat = fs.statSync(sourcePath);
  return readText(stat.isDirectory() ? path.join(sourcePath, 'SKILL.md') : sourcePath);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const cachePath = path.join(options.skillRoot, CACHE_FILE);

  if (shouldSkip(cachePath, options.cacheDays, options.force)) return;

  try {
    const localSkill = readText(path.join(options.skillRoot, 'SKILL.md'));
    const localVersion = extractFrontMatterValue(localSkill, 'version');
    const source = resolveSource(options);

    if (!source) {
      if (options.verbose) console.log('Update check skipped: no upstream source configured.');
      updateCache(cachePath);
      return;
    }

    const upstreamSkill = await readSource(source);
    const upstreamVersion = extractFrontMatterValue(upstreamSkill, 'version');

    if (!localVersion || !upstreamVersion) {
      throw new Error('Could not read version from local or upstream SKILL.md');
    }

    if (compareVersions(localVersion, upstreamVersion) < 0) {
      console.log('--- SKILL UPDATE CHECK ---');
      console.log(`Update available for in_the_cards_lenormand: ${localVersion} → ${upstreamVersion}`);
      console.log(`Source: ${source}`);
      console.log('To update, replace this skill with the latest version from the source above.');
      console.log('--- END UPDATE CHECK ---');
      updateCache(cachePath);
      process.exitCode = 10;
      return;
    }

    if (options.verbose) console.log(`No updates available (local ${localVersion}, upstream ${upstreamVersion}).`);
    updateCache(cachePath);
  } catch (error) {
    if (options.verbose) console.warn(`Update check skipped: ${error.message}`);
    updateCache(cachePath);
  }
}

main();
