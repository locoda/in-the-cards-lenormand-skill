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
    try { var v = localStorage.getItem('stargazer-lang'); if (v === 'zh') v = 'zh-CN'; return v; } catch(e) { return null; }
  },

  async load(lang) {
    const resp = await fetch('locales/' + lang + '.json');
    this._data = await resp.json();
    this._lang = lang;
    try { localStorage.setItem('stargazer-lang', lang); } catch(e) {}
  },

  t(key) {
    return this._data[key] || key;
  },

  apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.innerHTML = this.t(el.getAttribute('data-i18n'));
    });
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && (this._lang === 'zh-CN' || this._lang === 'zh-TW')) {
      heroTitle.style.fontSize = '3.4rem';
    }
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
  setTimeout(function() {
    button.textContent = original;
    button.classList.remove('is-copied');
  }, 1600);
}

// ---- Product Tabs ----
function switchTab(tabId) {
  document.querySelectorAll('.product-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.product-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-tab="' + tabId + '"]').classList.add('active');
  document.getElementById('panel-' + tabId).classList.add('active');
}

// ---- Card Gallery ----
(function() {
  var allCards = [
    {n:'01',s:'rider',t:'Rider'},{n:'02',s:'clover',t:'Clover'},{n:'03',s:'ship',t:'Ship'},
    {n:'05',s:'tree',t:'Tree'},{n:'06',s:'clouds',t:'Clouds'},{n:'07',s:'snake',t:'Snake'},
    {n:'09',s:'bouquet',t:'Bouquet'},{n:'10',s:'scythe',t:'Scythe'},{n:'14',s:'fox',t:'Fox'},
    {n:'16',s:'stars',t:'Stars'},{n:'20',s:'garden',t:'Garden'},{n:'21',s:'mountain',t:'Mountain'},
    {n:'24',s:'heart',t:'Heart'},{n:'27',s:'letter',t:'Letter'},{n:'29',s:'woman',t:'Woman'},
    {n:'31',s:'sun',t:'Sun'},{n:'32',s:'moon',t:'Moon'},{n:'33',s:'key',t:'Key'},
    {n:'04',s:'house',t:'House'},{n:'08',s:'coffin',t:'Coffin'},{n:'15',s:'bear',t:'Bear'},
    {n:'18',s:'dog',t:'Dog'},{n:'22',s:'crossroads',t:'Crossroads'},{n:'25',s:'ring',t:'Ring'},
    {n:'26',s:'book',t:'Book'},{n:'30',s:'lily',t:'Lily'},{n:'34',s:'fish',t:'Fish'},
    {n:'35',s:'anchor',t:'Anchor'},{n:'11',s:'whip',t:'Whip'},{n:'12',s:'birds',t:'Birds'},
    {n:'13',s:'child',t:'Child'},{n:'17',s:'stork',t:'Stork'},{n:'19',s:'tower',t:'Tower'},
    {n:'23',s:'mice',t:'Mice'},{n:'28',s:'man',t:'Man'},{n:'36',s:'cross',t:'Cross'}
  ];
  var offset = 0;
  var itemsPerPage = (window.innerWidth < 600) ? 6 : 12;
  var gallery = document.getElementById('card-gallery');

  function showSlice() {
    gallery.innerHTML = '';
    var slice = allCards.slice(offset, offset + itemsPerPage);
    if (slice.length < itemsPerPage) slice = slice.concat(allCards.slice(0, itemsPerPage - slice.length));
    slice.forEach(function(c) {
      var div = document.createElement('div');
      div.className = 'gallery-item'; div.title = c.t;
      var img = document.createElement('img');
      img.src = 'cards/card-' + c.n + '-' + c.s + '.svg';
      img.alt = c.t; img.loading = 'lazy';
      div.appendChild(img); gallery.appendChild(div);
    });
  }
  showSlice();

  window.rotateGallery = function() {
    offset = (offset + itemsPerPage) % allCards.length;
    showSlice();
  };
})();

// ---- Boot ----
window.addEventListener('DOMContentLoaded', function() {
  I18N.init('zh-CN');
});
