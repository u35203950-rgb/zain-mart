/* Zain Mart - Admin Store Management Dashboard */

let currentAdminTab = 'products'; // 'products' | 'orders' | 'analytics'

function initAdminDashboard() {
  renderAdminContent();
}

function switchAdminTab(tabName) {
  currentAdminTab = tabName;
  document.querySelectorAll('.admin-nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tabName);
  });
  renderAdminContent();
}

function renderAdminContent() {
  const container = document.getElementById('admin-content-body');
  if (!container) return;

  const products = getStoredProducts();
  const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];

  // Calculate Key Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const lowStockCount = products.filter(p => p.stockQty <= 25).length;

  const statsHeaderHtml = `
    <div class="admin-stats-grid">
      <div class="stat-card">
        <div class="stat-label">💰 Total Store Revenue</div>
        <div class="stat-value">${formatCurrency(totalRevenue)}</div>
        <span style="font-size: 0.75rem; color: var(--success); font-weight: 700;">↑ 18.5% this week</span>
      </div>
      <div class="stat-card">
        <div class="stat-label">📦 Total Customer Orders</div>
        <div class="stat-value">${totalOrders}</div>
        <span style="font-size: 0.75rem; color: var(--text-muted);">Active Store Sales</span>
      </div>
      <div class="stat-card">
        <div class="stat-label">🛍️ Active Products</div>
        <div class="stat-value">${products.length}</div>
        <span style="font-size: 0.75rem; color: var(--text-muted);">In Inventory</span>
      </div>
      <div class="stat-card" style="border-left: 4px solid var(--danger);">
        <div class="stat-label">⚠️ Low Stock Items</div>
        <div class="stat-value" style="color: var(--danger);">${lowStockCount}</div>
        <span style="font-size: 0.75rem; color: var(--danger); font-weight: 700;">Action Required</span>
      </div>
    </div>
  `;

  if (currentAdminTab === 'products') {
    container.innerHTML = statsHeaderHtml + `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
        <h3>Product Inventory Management</h3>
        <button class="btn-primary" onclick="openAddProductModal()">
          ➕ Add New Product
        </button>
      </div>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock Qty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td><img src="${p.image}" alt="${p.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px;" /></td>
                <td><strong>${p.name}</strong><br/><small style="color: var(--text-light);">${p.unit}</small></td>
                <td><span style="background: var(--bg-subtle); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${p.category}</span></td>
                <td style="color: var(--primary); font-weight: 700;">${formatCurrency(p.price)}</td>
                <td><strong>${p.stockQty}</strong> units</td>
                <td>
                  ${p.stockQty > 20 ? '<span style="color: var(--success); font-weight: 700;">In Stock</span>' : '<span style="color: var(--danger); font-weight: 700;">Low Stock</span>'}
                </td>
                <td>
                  <button class="btn-secondary" style="padding: 2px 8px; font-size: 0.8rem;" onclick="openEditProductModal('${p.id}')">✏️ Edit</button>
                  <button class="btn-secondary" style="padding: 2px 8px; font-size: 0.8rem; color: var(--danger);" onclick="deleteAdminProduct('${p.id}')">🗑️ Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (currentAdminTab === 'orders') {
    container.innerHTML = statsHeaderHtml + `
      <h3 style="margin-bottom: 1rem;">Customer Orders List</h3>
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${orders.length === 0 ? `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No orders placed yet.</td></tr>` : ''}
            ${orders.map(o => `
              <tr>
                <td><strong>#${o.id}</strong></td>
                <td><small>${o.date}</small></td>
                <td><strong>${o.customer.name}</strong><br/><small>${o.customer.phone}</small></td>
                <td>${o.items.length} items</td>
                <td style="color: var(--primary); font-weight: 700;">${formatCurrency(o.totalAmount)}</td>
                <td><span style="font-size: 0.8rem; font-weight: 700;">${o.paymentMethod}</span></td>
                <td>
                  <select class="select-control" style="font-size: 0.8rem; padding: 2px 6px;" onchange="simulateOrderStatus('${o.id}', this.value)">
                    <option value="Placed" ${o.status === 'Placed' ? 'selected' : ''}>Order Placed</option>
                    <option value="Packing" ${o.status === 'Packing' ? 'selected' : ''}>Packing</option>
                    <option value="Out for Delivery" ${o.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
                    <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                  </select>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (currentAdminTab === 'analytics') {
    container.innerHTML = statsHeaderHtml + `
      <h3 style="margin-bottom: 1rem;">Category Sales Performance & Revenue Analytics</h3>
      <div style="background: var(--bg-subtle); border-radius: var(--radius-md); padding: 1.5rem; text-align: center;">
        <p style="margin-bottom: 1rem; color: var(--text-muted); font-size: 0.9rem;">Visual Breakdown of Store Revenue by Product Category</p>
        <div id="analytics-svg-chart"></div>
      </div>
    `;
    renderRevenueSVGChart();
  }
}

function renderRevenueSVGChart() {
  const chartEl = document.getElementById('analytics-svg-chart');
  if (!chartEl) return;

  const data = [
    { category: 'Fresh Produce', revenue: 45000, color: '#059669' },
    { category: 'Dairy & Bakery', revenue: 32000, color: '#f59e0b' },
    { category: 'Meat & Poultry', revenue: 58000, color: '#ef4444' },
    { category: 'Rice & Oils', revenue: 64000, color: '#8b5cf6' },
    { category: 'Beverages', revenue: 21000, color: '#0284c7' },
    { category: 'Snacks', revenue: 18000, color: '#ec4899' }
  ];

  const maxRevenue = Math.max(...data.map(d => d.revenue));

  const svgBars = data.map((d, index) => {
    const height = Math.round((d.revenue / maxRevenue) * 160);
    const x = 50 + index * 85;
    const y = 200 - height;

    return `
      <g class="bar-group">
        <rect x="${x}" y="${y}" width="45" height="${height}" fill="${d.color}" rx="6" />
        <text x="${x + 22}" y="${y - 8}" text-anchor="middle" fill="var(--text-main)" font-weight="bold" font-size="11">
          Rs.${(d.revenue / 1000).toFixed(0)}k
        </text>
        <text x="${x + 22}" y="220" text-anchor="middle" fill="var(--text-muted)" font-size="10">
          ${d.category.split(' ')[0]}
        </text>
      </g>
    `;
  }).join('');

  chartEl.innerHTML = `
    <svg width="100%" height="240" viewBox="0 0 600 240" style="max-width: 600px; margin: 0 auto; display: block;">
      <line x1="40" y1="200" x2="560" y2="200" stroke="var(--border-color)" stroke-width="2" />
      ${svgBars}
    </svg>
  `;
}

/* Add / Edit Product Modal Handlers */
function openAddProductModal() {
  document.getElementById('admin-product-modal-title').innerText = 'Add New Product';
  document.getElementById('admin-product-id').value = '';
  document.getElementById('admin-product-name').value = '';
  document.getElementById('admin-product-category').value = 'fresh-produce';
  document.getElementById('admin-product-price').value = '';
  document.getElementById('admin-product-unit').value = '1 kg';
  document.getElementById('admin-product-stock').value = '50';
  document.getElementById('admin-product-image').value = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
  document.getElementById('admin-product-desc').value = '';

  document.getElementById('admin-product-modal').classList.add('active');
}

function openEditProductModal(productId) {
  const products = getStoredProducts();
  const p = products.find(prod => prod.id === productId);
  if (!p) return;

  document.getElementById('admin-product-modal-title').innerText = `Edit: ${p.name}`;
  document.getElementById('admin-product-id').value = p.id;
  document.getElementById('admin-product-name').value = p.name;
  document.getElementById('admin-product-category').value = p.category;
  document.getElementById('admin-product-price').value = p.price;
  document.getElementById('admin-product-unit').value = p.unit;
  document.getElementById('admin-product-stock').value = p.stockQty;
  document.getElementById('admin-product-image').value = p.image;
  document.getElementById('admin-product-desc').value = p.description || '';

  document.getElementById('admin-product-modal').classList.add('active');
}

function closeAdminProductModal() {
  document.getElementById('admin-product-modal').classList.remove('active');
}

function handleSaveProductForm(event) {
  event.preventDefault();
  const id = document.getElementById('admin-product-id').value;
  const name = document.getElementById('admin-product-name').value.trim();
  const category = document.getElementById('admin-product-category').value;
  const price = parseFloat(document.getElementById('admin-product-price').value);
  const unit = document.getElementById('admin-product-unit').value.trim();
  const stockQty = parseInt(document.getElementById('admin-product-stock').value, 10);
  const image = document.getElementById('admin-product-image').value.trim();
  const description = document.getElementById('admin-product-desc').value.trim();

  let products = getStoredProducts();

  if (id) {
    // Edit Mode
    const index = products.findIndex(p => p.id === id);
    if (index > -1) {
      products[index] = {
        ...products[index],
        name, category, price, unit, stockQty, image, description
      };
      showToast(`Updated product "${name}"`, 'success');
    }
  } else {
    // Create Mode
    const newProduct = {
      id: 'prod-' + Date.now(),
      name, category, subcategory: 'General',
      price, oldPrice: Math.round(price * 1.15),
      rating: 5.0, reviewsCount: 1,
      badges: ['New'], inStock: true, stockQty,
      unit, description, image,
      ingredients: name, dietary: ['Halal']
    };
    products.unshift(newProduct);
    showToast(`Added new product "${name}" to store!`, 'success');
  }

  saveProductsToStorage(products);
  closeAdminProductModal();
  renderProductsCatalog();
  renderAdminContent();
}

function deleteAdminProduct(productId) {
  if (!confirm('Are you sure you want to delete this product from Zain Mart?')) return;
  let products = getStoredProducts();
  products = products.filter(p => p.id !== productId);
  saveProductsToStorage(products);
  renderProductsCatalog();
  renderAdminContent();
  showToast('Product deleted from inventory.', 'danger');
}
