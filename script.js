// ---- i18n Engine ----
const I18N = {
  _data: {},
  _lang: 'zh-CN',

  async init(defaultLang) {
    this._lang = this._detectLang() || defaultLang || 'zh-CN';
    await this.load(this._lang);
    this.apply();
    this._renderToggle();
  },

  _detectLang() {
    try {
      let v = localStorage.getItem('stargazer-lang');
      if (v === 'zh') v = 'zh-CN';
      return v;
    } catch (e) {
      return null;
    }
  },

  async load(lang) {
    const resp = await fetch('locales/' + lang + '.json');
    this._data = await resp.json();
    this._lang = lang;
    try { localStorage.setItem('stargazer-lang', lang); } catch (e) {}
  },

  t(key) {
    return this._data[key] || key;
  },

  apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.innerHTML = this.t(el.getAttribute('data-i18n'));
    });
  },

  async switchTo(lang) {
    await this.load(lang);
    this.apply();
    this._renderToggle();
  },

  _renderToggle() {
    document.querySelectorAll('[data-lang-btn]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lang-btn') === this._lang);
    });
  }
};

// ---- Install Prompt Copy ----
async function copyInstallPrompt() {
  const promptEl = document.querySelector('[data-i18n="install.prompt_text"]');
  const button = document.querySelector('.copy-prompt-btn');
  if (!promptEl || !button) return;

  const prompt = promptEl.textContent.replace(/^"|"$/g, '');

  try {
    await navigator.clipboard.writeText(prompt);
  } catch (err) {
    const ta = document.createElement('textarea');
    ta.value = prompt;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  const original = I18N.t('install.copy_prompt');
  button.textContent = I18N.t('install.copied');
  button.classList.add('is-copied');
  setTimeout(() => {
    button.textContent = original;
    button.classList.remove('is-copied');
  }, 1600);
}

// ---- Product Tabs ----
function switchTab(tabId) {
  document.querySelectorAll('.product-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.product-panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  document.getElementById(`panel-${tabId}`).classList.add('active');
}

// ---- Card Gallery ----
(function () {
  let offset = 0;
  const itemsPerPage = window.innerWidth < 600 ? 6 : 12;
  const gallery = document.getElementById('card-gallery');

  function showSlice() {
    gallery.innerHTML = '';
    let slice = LENORMAND_CARDS.slice(offset, offset + itemsPerPage);
    if (slice.length < itemsPerPage) {
      slice = slice.concat(LENORMAND_CARDS.slice(0, itemsPerPage - slice.length));
    }
    slice.forEach(c => {
      const div = document.createElement('div');
      div.className = 'gallery-item';
      div.title = c.en;
      const img = document.createElement('img');
      img.src = `cards/card-${String(c.num).padStart(2, '0')}-${c.slug}.svg`;
      img.alt = c.en;
      img.loading = 'lazy';
      div.appendChild(img);
      gallery.appendChild(div);
    });
  }
  showSlice();

  window.rotateGallery = function () {
    offset = (offset + itemsPerPage) % LENORMAND_CARDS.length;
    showSlice();
  };
})();

// ---- Event Bindings ----
function bindEvents() {
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => I18N.switchTo(btn.getAttribute('data-lang-btn')));
  });

  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
  });

  const copyBtn = document.querySelector('[data-action="copy-install-prompt"]');
  if (copyBtn) copyBtn.addEventListener('click', copyInstallPrompt);

  const rotateBtn = document.querySelector('[data-action="rotate-gallery"]');
  if (rotateBtn) rotateBtn.addEventListener('click', () => window.rotateGallery());
}

// ---- Boot ----
window.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  I18N.init('zh-CN');
});
