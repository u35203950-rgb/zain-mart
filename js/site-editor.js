/* Zain Mart - Live Visual Website Editor Module */

const DEFAULT_SITE_CONFIG = {
  storeName: 'Zain',
  storeNameAccent: 'Mart',
  storeTagline: 'Superstore',
  announcementText: '⚡ Express 30-Minute Delivery Available!',
  helplinePhone: '+92 300 1234567',
  heroTitle: 'Fresh, Organic & Everyday Essentials',
  heroSubtitle: 'Hand-picked farm produce, fresh daily dairy, quality meats and pantry goods delivered to your doorstep.',
  heroTag: 'Zain Mart Superstore',
  heroBtnText: '🛒 Order Fresh Produce Now',
  heroImage: 'images/hero.jpg',
  sideDeal1Title: 'Farm Fresh Vegetables',
  sideDeal1Sub: 'Flat 20% OFF Daily Deals',
  sideDeal1Image: 'images/fresh_produce.jpg',
  sideDeal2Title: 'Artisan Bakery & Dairy',
  sideDeal2Sub: 'Baked Fresh Every Morning',
  sideDeal2Image: 'images/dairy_bakery.jpg',
  whatsappNumber: '923001234567',
  footerAbout: 'Zain Mart is your trusted superstore for farm-fresh groceries, organic produce, daily dairy, meats and everyday household essentials delivered in 30 minutes.',
  primaryColor: '#059669'
};

const SITE_CONFIG_KEY = 'zain_mart_site_config_v1';
let currentSiteConfig = getStoredSiteConfig();
let isEditorActive = false;

function getStoredSiteConfig() {
  const saved = localStorage.getItem(SITE_CONFIG_KEY);
  if (!saved) return { ...DEFAULT_SITE_CONFIG };
  try {
    return { ...DEFAULT_SITE_CONFIG, ...JSON.parse(saved) };
  } catch (e) {
    return { ...DEFAULT_SITE_CONFIG };
  }
}

function saveSiteConfigToStorage(config) {
  localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(config));
}

function applySiteConfigToDOM() {
  const c = currentSiteConfig;

  // Header & Branding
  const brandEl = document.querySelector('.brand-logo div');
  if (brandEl) {
    brandEl.innerHTML = `${c.storeName}<span>${c.storeNameAccent}</span>`;
  }

  // Top Bar Announcement & Phone
  const topBarLeft = document.querySelector('.top-bar-left');
  if (topBarLeft) {
    topBarLeft.innerHTML = `
      <span>${c.announcementText}</span>
      <span>📞 Helpline: ${c.helplinePhone}</span>
    `;
  }

  // Hero Section
  const heroTagEl = document.querySelector('.hero-tag');
  if (heroTagEl) heroTagEl.innerText = c.heroTag;

  const heroTitleEl = document.querySelector('.hero-title');
  if (heroTitleEl) heroTitleEl.innerText = c.heroTitle;

  const heroSubEl = document.querySelector('.hero-subtitle');
  if (heroSubEl) heroSubEl.innerText = c.heroSubtitle;

  const heroBtnEl = document.querySelector('.hero-content .btn-primary');
  if (heroBtnEl) heroBtnEl.innerText = c.heroBtnText;

  const heroBannerMain = document.querySelector('.hero-banner-main');
  if (heroBannerMain && c.heroImage) {
    heroBannerMain.style.backgroundImage = `url('${c.heroImage}')`;
  }

  // Side Deals
  const sideDeals = document.querySelectorAll('.side-deal-card');
  if (sideDeals.length >= 2) {
    if (c.sideDeal1Image) sideDeals[0].style.backgroundImage = `url('${c.sideDeal1Image}')`;
    const sd1H4 = sideDeals[0].querySelector('h4');
    const sd1P = sideDeals[0].querySelector('p');
    if (sd1H4) sd1H4.innerText = c.sideDeal1Title;
    if (sd1P) sd1P.innerText = c.sideDeal1Sub;

    if (c.sideDeal2Image) sideDeals[1].style.backgroundImage = `url('${c.sideDeal2Image}')`;
    const sd2H4 = sideDeals[1].querySelector('h4');
    const sd2P = sideDeals[1].querySelector('p');
    if (sd2H4) sd2H4.innerText = c.sideDeal2Title;
    if (sd2P) sd2P.innerText = c.sideDeal2Sub;
  }

  // Footer & WhatsApp
  const footerAboutEl = document.querySelector('.footer-col p');
  if (footerAboutEl) footerAboutEl.innerText = c.footerAbout;

  const waBtn = document.querySelector('a[href*="wa.me"]');
  if (waBtn) waBtn.href = `https://wa.me/${c.whatsappNumber}`;

  // Custom Primary Accent Color
  if (c.primaryColor) {
    document.documentElement.style.setProperty('--primary', c.primaryColor);
  }
}

/* Toggle Editor Panel */
function toggleSiteEditor() {
  isEditorActive = !isEditorActive;
  const panel = document.getElementById('site-editor-panel');
  const backdrop = document.getElementById('site-editor-backdrop');

  if (panel && backdrop) {
    panel.classList.toggle('active', isEditorActive);
    backdrop.classList.toggle('active', isEditorActive);
  }

  if (isEditorActive) {
    renderSiteEditorPanelContent();
  }
}

function renderSiteEditorPanelContent() {
  const container = document.getElementById('site-editor-panel-body');
  if (!container) return;

  const c = currentSiteConfig;

  container.innerHTML = `
    <div style="margin-bottom: 1.5rem; background: var(--primary-light); padding: 1rem; border-radius: var(--radius-md);">
      <h4 style="color: var(--primary); margin-bottom: 0.25rem;">✨ Live Visual Website Customizer</h4>
      <p style="font-size: 0.82rem; color: var(--text-muted);">Modify text, store branding, hero graphics, announcement banners, phone numbers, and theme colors in real time!</p>
    </div>

    <!-- Section 1: Store Branding & Top Bar -->
    <div class="editor-section-card">
      <h4 class="editor-section-header">🏪 1. Store Branding & Announcements</h4>
      
      <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
        <div class="form-group">
          <label class="form-label">Store Main Name</label>
          <input type="text" class="form-input" value="${c.storeName}" oninput="updateConfigField('storeName', this.value)" />
        </div>
        <div class="form-group">
          <label class="form-label">Accent Name</label>
          <input type="text" class="form-input" value="${c.storeNameAccent}" oninput="updateConfigField('storeNameAccent', this.value)" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Top Announcement Banner</label>
        <input type="text" class="form-input" value="${c.announcementText}" oninput="updateConfigField('announcementText', this.value)" />
      </div>

      <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
        <div class="form-group">
          <label class="form-label">Helpline Phone</label>
          <input type="text" class="form-input" value="${c.helplinePhone}" oninput="updateConfigField('helplinePhone', this.value)" />
        </div>
        <div class="form-group">
          <label class="form-label">WhatsApp Order Number</label>
          <input type="text" class="form-input" value="${c.whatsappNumber}" oninput="updateConfigField('whatsappNumber', this.value)" />
        </div>
      </div>
    </div>

    <!-- Section 2: Hero Section & Banners -->
    <div class="editor-section-card">
      <h4 class="editor-section-header">🖼️ 2. Main Hero Banner & Headlines</h4>
      
      <div class="form-group">
        <label class="form-label">Hero Badge Tag</label>
        <input type="text" class="form-input" value="${c.heroTag}" oninput="updateConfigField('heroTag', this.value)" />
      </div>

      <div class="form-group">
        <label class="form-label">Hero Headline Title</label>
        <input type="text" class="form-input" value="${c.heroTitle}" oninput="updateConfigField('heroTitle', this.value)" />
      </div>

      <div class="form-group">
        <label class="form-label">Hero Subtitle</label>
        <textarea class="form-textarea" rows="2" oninput="updateConfigField('heroSubtitle', this.value)">${c.heroSubtitle}</textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Hero Button Text</label>
        <input type="text" class="form-input" value="${c.heroBtnText}" oninput="updateConfigField('heroBtnText', this.value)" />
      </div>

      <div class="form-group">
        <label class="form-label">Hero Background Image URL / Path</label>
        <input type="text" class="form-input" value="${c.heroImage}" oninput="updateConfigField('heroImage', this.value)" />
      </div>
    </div>

    <!-- Section 3: Promotional Side Cards -->
    <div class="editor-section-card">
      <h4 class="editor-section-header">🎯 3. Promo Side Cards</h4>
      
      <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
        <div class="form-group">
          <label class="form-label">Card #1 Title</label>
          <input type="text" class="form-input" value="${c.sideDeal1Title}" oninput="updateConfigField('sideDeal1Title', this.value)" />
        </div>
        <div class="form-group">
          <label class="form-label">Card #1 Subtitle</label>
          <input type="text" class="form-input" value="${c.sideDeal1Sub}" oninput="updateConfigField('sideDeal1Sub', this.value)" />
        </div>
      </div>

      <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
        <div class="form-group">
          <label class="form-label">Card #2 Title</label>
          <input type="text" class="form-input" value="${c.sideDeal2Title}" oninput="updateConfigField('sideDeal2Title', this.value)" />
        </div>
        <div class="form-group">
          <label class="form-label">Card #2 Subtitle</label>
          <input type="text" class="form-input" value="${c.sideDeal2Sub}" oninput="updateConfigField('sideDeal2Sub', this.value)" />
        </div>
      </div>
    </div>

    <!-- Section 4: Brand Theme Color -->
    <div class="editor-section-card">
      <h4 class="editor-section-header">🎨 4. Store Color Theme</h4>
      <div style="display: flex; gap: 0.75rem; align-items: center; margin-top: 0.5rem;">
        <label class="form-label" style="margin: 0;">Primary Accent Color:</label>
        <input type="color" value="${c.primaryColor || '#059669'}" onchange="updateConfigField('primaryColor', this.value)" style="width: 50px; height: 36px; border: none; cursor: pointer; border-radius: 6px;" />
        <button class="btn-secondary" style="font-size: 0.8rem;" onclick="updateConfigField('primaryColor', '#059669')">Emerald Green</button>
        <button class="btn-secondary" style="font-size: 0.8rem;" onclick="updateConfigField('primaryColor', '#0284c7')">Ocean Blue</button>
        <button class="btn-secondary" style="font-size: 0.8rem;" onclick="updateConfigField('primaryColor', '#8b5cf6')">Royal Purple</button>
      </div>
    </div>

    <!-- Actions -->
    <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
      <button class="btn-primary" style="flex: 1; padding: 0.85rem;" onclick="publishSiteConfigChanges()">
        💾 Save & Publish Changes
      </button>
      <button class="btn-secondary" style="color: var(--danger);" onclick="resetSiteConfigToDefault()">
        🔄 Reset Defaults
      </button>
    </div>
  `;
}

function updateConfigField(field, value) {
  currentSiteConfig[field] = value;
  applySiteConfigToDOM();
}

function publishSiteConfigChanges() {
  saveSiteConfigToStorage(currentSiteConfig);
  showToast('Website layout & content published successfully!', 'success');
  toggleSiteEditor();
}

function resetSiteConfigToDefault() {
  if (!confirm('Are you sure you want to reset all website content back to default settings?')) return;
  currentSiteConfig = { ...DEFAULT_SITE_CONFIG };
  saveSiteConfigToStorage(currentSiteConfig);
  applySiteConfigToDOM();
  renderSiteEditorPanelContent();
  showToast('Website configuration reset to default.', 'danger');
}
