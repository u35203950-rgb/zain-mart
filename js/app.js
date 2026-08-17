/* Zain Mart - Core Application Logic & UI Router */

let activeCategory = 'all';
let activeSort = 'featured';
let isListView = false;
let wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavEvents();
  renderCategoryPills();
  renderProductsCatalog();
  updateCartBadgeUI();
  updateWishlistBadgeUI();
  renderRecipePlanner();

  // Search input listeners
  const searchInput = document.getElementById('main-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('focus', handleSearchInput);
  }

  // Hide search dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      document.getElementById('search-dropdown')?.classList.remove('active');
    }
  });
});

/* Navigation & Tabs Router */
function switchTab(tabName) {
  document.querySelectorAll('.tab-section').forEach(section => {
    section.style.display = 'none';
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.tab === tabName);
  });

  const targetSection = document.getElementById(`section-${tabName}`);
  if (targetSection) {
    targetSection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (tabName === 'admin') {
    initAdminDashboard();
  } else if (tabName === 'track') {
    renderOrderTrackerPage();
  } else if (tabName === 'wishlist') {
    renderWishlistPage();
  }
}

function initNavEvents() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(link.dataset.tab);
    });
  });
}

/* Category Pills Renderer */
function renderCategoryPills() {
  const container = document.getElementById('categories-grid-container');
  if (!container) return;

  container.innerHTML = CATEGORIES.map(cat => `
    <div class="category-card ${cat.id === activeCategory ? 'active' : ''}" onclick="selectCategory('${cat.id}')">
      <div class="category-icon">${cat.icon}</div>
      <div class="category-title">${cat.name}</div>
    </div>
  `).join('');
}

function selectCategory(catId) {
  activeCategory = catId;
  renderCategoryPills();
  renderProductsCatalog();
  switchTab('shop');
}

/* Products Catalog Renderer */
function renderProductsCatalog() {
  const gridContainer = document.getElementById('products-grid-container');
  if (!gridContainer) return;

  let products = getStoredProducts();

  // Apply Category Filter
  if (activeCategory !== 'all') {
    products = products.filter(p => p.category === activeCategory);
  }

  // Apply Sorting
  if (activeSort === 'price-low') {
    products.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'price-high') {
    products.sort((a, b) => b.price - a.price);
  } else if (activeSort === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  }

  if (products.length === 0) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🔍</div>
        <h3>No Products Found</h3>
        <p>Try clearing filters or searching for another category.</p>
      </div>
    `;
    return;
  }

  gridContainer.className = `products-grid ${isListView ? 'list-view' : ''}`;

  gridContainer.innerHTML = products.map(product => {
    const isWishlisted = wishlist.includes(product.id);
    const cartItem = activeCart.find(item => item.productId === product.id);
    const cartQty = cartItem ? cartItem.qty : 0;

    return `
      <div class="product-card">
        <div class="product-badge-group">
          ${product.oldPrice ? `<span class="product-badge badge-sale">SALE</span>` : ''}
          ${product.dietary?.includes('Organic') ? `<span class="product-badge badge-organic">Organic</span>` : ''}
          ${product.dietary?.includes('Halal') ? `<span class="product-badge badge-halal">Halal</span>` : ''}
        </div>

        <button class="wishlist-btn-card ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${product.id}')" title="Add to Wishlist">
          ${isWishlisted ? '❤️' : '🤍'}
        </button>

        <div class="product-img-wrapper" onclick="openQuickViewModal('${product.id}')" style="cursor: pointer;">
          <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />
          <button class="quick-view-overlay-btn">👁️ Quick View</button>
        </div>

        <div class="product-body">
          <span class="product-category-sub">${product.category.replace('-', ' ')}</span>
          <h4 class="product-title" onclick="openQuickViewModal('${product.id}')" style="cursor: pointer;">${product.name}</h4>
          
          <div class="product-rating">
            <span>★ ${product.rating}</span>
            <span class="rating-count">(${product.reviewsCount})</span>
          </div>

          <div class="product-footer">
            <div class="price-box">
              <span class="price-current">${formatCurrency(product.price)}</span>
              ${product.oldPrice ? `<span class="price-old">${formatCurrency(product.oldPrice)}</span>` : ''}
            </div>

            ${cartQty > 0 ? `
              <div class="card-qty-control">
                <button class="card-qty-btn" onclick="updateCartItemQty('${product.id}', -1)">-</button>
                <span class="card-qty-num">${cartQty}</span>
                <button class="card-qty-btn" onclick="updateCartItemQty('${product.id}', 1)">+</button>
              </div>
            ` : `
              <button class="add-cart-btn" onclick="addToCart('${product.id}', 1)">
                <span>+</span> Add
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function handleSortChange(sortValue) {
  activeSort = sortValue;
  renderProductsCatalog();
}

function setViewMode(mode) {
  isListView = mode === 'list';
  document.getElementById('btn-view-grid')?.classList.toggle('active', !isListView);
  document.getElementById('btn-view-list')?.classList.toggle('active', isListView);
  renderProductsCatalog();
}

/* Real-time Live Search */
function handleSearchInput(e) {
  const query = e.target.value.trim().toLowerCase();
  const dropdown = document.getElementById('search-dropdown');
  if (!dropdown) return;

  if (query.length < 2) {
    dropdown.classList.remove('active');
    return;
  }

  const products = getStoredProducts();
  const matches = products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    (p.description && p.description.toLowerCase().includes(query))
  );

  if (matches.length === 0) {
    dropdown.innerHTML = `
      <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
        No matching products found for "${query}"
      </div>
    `;
  } else {
    dropdown.innerHTML = matches.map(p => `
      <div class="search-item" onclick="openQuickViewModal('${p.id}'); document.getElementById('search-dropdown').classList.remove('active');">
        <img src="${p.image}" alt="${p.name}" class="search-item-img" />
        <div class="search-item-info">
          <h5>${p.name}</h5>
          <p>${formatCurrency(p.price)} / ${p.unit}</p>
        </div>
      </div>
    `).join('');
  }

  dropdown.classList.add('active');
}

/* Quick View Modal Renderer */
function openQuickViewModal(productId) {
  const products = getStoredProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quick-view-modal');
  const container = document.getElementById('quick-view-modal-content');
  if (!modal || !container) return;

  const isWishlisted = wishlist.includes(product.id);

  container.innerHTML = `
    <div class="quick-view-grid">
      <div>
        <img src="${product.image}" alt="${product.name}" class="quick-view-img" />
      </div>
      <div>
        <span class="product-category-sub">${product.category}</span>
        <h2 style="margin-bottom: 0.5rem;">${product.name}</h2>
        <div class="product-rating" style="font-size: 1rem; margin-bottom: 1rem;">
          <span>★ ${product.rating}</span>
          <span class="rating-count">(${product.reviewsCount} customer reviews)</span>
        </div>
        <div class="price-box" style="margin-bottom: 1rem;">
          <span class="price-current" style="font-size: 1.6rem;">${formatCurrency(product.price)}</span>
          ${product.oldPrice ? `<span class="price-old" style="font-size: 1rem;">${formatCurrency(product.oldPrice)}</span>` : ''}
        </div>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem;">${product.description}</p>
        
        <div style="background: var(--bg-subtle); padding: 0.85rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem; font-size: 0.85rem;">
          <p><strong>Ingredients:</strong> ${product.ingredients || 'Natural'}</p>
          <p><strong>Dietary:</strong> ${product.dietary?.join(', ') || 'Halal Standard'}</p>
          <p><strong>Stock Availability:</strong> <span style="color: var(--success); font-weight: 700;">In Stock (${product.stockQty} items left)</span></p>
        </div>

        <div style="display: flex; gap: 1rem; align-items: center;">
          <button class="btn-primary" style="flex: 1;" onclick="addToCart('${product.id}', 1); closeQuickViewModal(); openCartDrawer();">
            🛒 Add to Cart
          </button>
          <button class="icon-btn" onclick="toggleWishlist('${product.id}'); openQuickViewModal('${product.id}');" title="Wishlist">
            ${isWishlisted ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeQuickViewModal() {
  document.getElementById('quick-view-modal')?.classList.remove('active');
}

/* Wishlist Manager */
function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast('Item removed from Wishlist', 'danger');
  } else {
    wishlist.push(productId);
    showToast('Added to your Wishlist!', 'success');
  }
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  updateWishlistBadgeUI();
  renderProductsCatalog();
}

function updateWishlistBadgeUI() {
  document.querySelectorAll('.wishlist-badge-count').forEach(el => {
    el.innerText = wishlist.length;
  });
}

function renderWishlistPage() {
  const container = document.getElementById('wishlist-content');
  if (!container) return;

  const products = getStoredProducts();
  const wishlistedItems = products.filter(p => wishlist.includes(p.id));

  if (wishlistedItems.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">🤍</div>
        <h3>Your Wishlist is Empty</h3>
        <p>Save items you love by clicking the heart icon on any product!</p>
        <button class="btn-primary" style="margin-top: 1rem;" onclick="switchTab('shop')">Explore Shop</button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <h2 style="margin-bottom: 1.5rem;">Your Wishlist (${wishlistedItems.length})</h2>
    <div class="products-grid">
      ${wishlistedItems.map(product => `
        <div class="product-card">
          <button class="wishlist-btn-card active" onclick="toggleWishlist('${product.id}'); renderWishlistPage();">❤️</button>
          <div class="product-img-wrapper" onclick="openQuickViewModal('${product.id}')">
            <img src="${product.image}" alt="${product.name}" class="product-img" />
          </div>
          <div class="product-body">
            <h4 class="product-title">${product.name}</h4>
            <div class="product-footer">
              <div class="price-box">
                <span class="price-current">${formatCurrency(product.price)}</span>
              </div>
              <button class="add-cart-btn" onclick="addToCart('${product.id}', 1); openCartDrawer();">
                🛒 Add
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/* Toast System */
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : '⚠️'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

/* Theme Switcher */
function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.innerText = savedTheme === 'dark' ? '☀️' : '🌙';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(STORAGE_KEYS.THEME, next);
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.innerText = next === 'dark' ? '☀️' : '🌙';
  }
}

/* Currency Switcher */
function toggleCurrency() {
  const next = currentCurrency === 'PKR' ? 'USD' : 'PKR';
  setCurrency(next);
  document.querySelectorAll('.currency-toggle').forEach(el => el.innerText = next);
  renderProductsCatalog();
  renderCartDrawer();
  updateCartBadgeUI();
  renderRecipePlanner();
  showToast(`Currency changed to ${next}`, 'success');
}
