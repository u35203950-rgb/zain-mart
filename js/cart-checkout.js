/* Zain Mart - Cart & Checkout System */

let activeCart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
let activeCoupon = null; // { code: 'ZAIN10', discountPercent: 10 } or { code: 'FREEDEL', freeShipping: true }
let activeOrderForTracking = null;

function saveCart() {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(activeCart));
  updateCartBadgeUI();
}

function updateCartBadgeUI() {
  const totalCount = activeCart.reduce((sum, item) => sum + item.qty, 0);
  const badgeEls = document.querySelectorAll('.cart-badge-count');
  badgeEls.forEach(el => {
    el.innerText = totalCount;
  });

  const subtotalPKR = calculateCartSubtotal();
  const cartTotalSummaryEl = document.getElementById('nav-cart-total-price');
  if (cartTotalSummaryEl) {
    cartTotalSummaryEl.innerText = formatCurrency(subtotalPKR);
  }
}

function addToCart(productId, quantity = 1) {
  const products = getStoredProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = activeCart.find(item => item.productId === productId);
  if (existing) {
    existing.qty += quantity;
  } else {
    activeCart.push({ productId, qty: quantity });
  }

  saveCart();
  renderProductsCatalog(); // Re-render to update card quantity counters
  renderCartDrawer();
}

function updateCartItemQty(productId, delta) {
  const itemIndex = activeCart.findIndex(item => item.productId === productId);
  if (itemIndex > -1) {
    activeCart[itemIndex].qty += delta;
    if (activeCart[itemIndex].qty <= 0) {
      activeCart.splice(itemIndex, 1);
    }
  }
  saveCart();
  renderProductsCatalog();
  renderCartDrawer();
}

function removeFromCart(productId) {
  activeCart = activeCart.filter(item => item.productId !== productId);
  saveCart();
  renderProductsCatalog();
  renderCartDrawer();
}

function calculateCartSubtotal() {
  const products = getStoredProducts();
  return activeCart.reduce((total, item) => {
    const prod = products.find(p => p.id === item.productId);
    return total + (prod ? prod.price * item.qty : 0);
  }, 0);
}

function applyCouponCode() {
  const inputEl = document.getElementById('coupon-input');
  if (!inputEl) return;

  const code = inputEl.value.trim().toUpperCase();
  if (code === 'ZAIN10') {
    activeCoupon = { code: 'ZAIN10', discountPercent: 10, freeShipping: false };
    showToast('Promo code ZAIN10 applied! 10% Discount applied.', 'success');
  } else if (code === 'FREEDEL') {
    activeCoupon = { code: 'FREEDEL', discountPercent: 0, freeShipping: true };
    showToast('Promo code FREEDEL applied! Free Delivery unlocked.', 'success');
  } else {
    showToast('Invalid Coupon Code! Try ZAIN10 or FREEDEL.', 'danger');
    return;
  }

  renderCartDrawer();
  if (document.getElementById('checkout-modal')?.classList.contains('active')) {
    renderCheckoutSummary();
  }
}

function renderCartDrawer() {
  const bodyContainer = document.getElementById('cart-drawer-body');
  const footerContainer = document.getElementById('cart-drawer-footer');
  if (!bodyContainer || !footerContainer) return;

  if (activeCart.length === 0) {
    bodyContainer.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h3>Your Shopping Cart is Empty</h3>
        <p>Explore our fresh fruits, dairy, and grocery items to start shopping!</p>
        <button class="btn-primary" style="margin-top: 1rem;" onclick="closeCartDrawer()">Start Shopping</button>
      </div>
    `;
    footerContainer.style.display = 'none';
    return;
  }

  footerContainer.style.display = 'block';
  const products = getStoredProducts();

  bodyContainer.innerHTML = activeCart.map(item => {
    const prod = products.find(p => p.id === item.productId);
    if (!prod) return '';
    const itemTotal = prod.price * item.qty;

    return `
      <div class="cart-item">
        <img src="${prod.image}" alt="${prod.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <div class="cart-item-title">${prod.name}</div>
          <div class="cart-item-price">${formatCurrency(prod.price)} / ${prod.unit}</div>
          <div class="cart-item-actions">
            <div class="cart-qty-ctrl">
              <button onclick="updateCartItemQty('${prod.id}', -1)">-</button>
              <span>${item.qty}</span>
              <button onclick="updateCartItemQty('${prod.id}', 1)">+</button>
            </div>
            <strong style="color: var(--primary);">${formatCurrency(itemTotal)}</strong>
            <button class="remove-item-btn" onclick="removeFromCart('${prod.id}')">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const subtotal = calculateCartSubtotal();
  let discountAmount = 0;
  if (activeCoupon && activeCoupon.discountPercent > 0) {
    discountAmount = Math.round((subtotal * activeCoupon.discountPercent) / 100);
  }

  let shippingFee = subtotal > 2000 ? 0 : 150;
  if (activeCoupon && activeCoupon.freeShipping) {
    shippingFee = 0;
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  footerContainer.innerHTML = `
    <div class="coupon-box">
      <input type="text" id="coupon-input" class="coupon-input" placeholder="Promo code (e.g. ZAIN10)" value="${activeCoupon ? activeCoupon.code : ''}" />
      <button class="btn-secondary" onclick="applyCouponCode()">Apply</button>
    </div>
    <div class="cart-summary-line">
      <span>Subtotal</span>
      <strong>${formatCurrency(subtotal)}</strong>
    </div>
    ${discountAmount > 0 ? `
      <div class="cart-summary-line" style="color: var(--success);">
        <span>Discount (${activeCoupon.code})</span>
        <strong>-${formatCurrency(discountAmount)}</strong>
      </div>
    ` : ''}
    <div class="cart-summary-line">
      <span>Express Delivery Fee</span>
      <strong>${shippingFee === 0 ? '<span style="color: var(--success); font-weight: 800;">FREE</span>' : formatCurrency(shippingFee)}</strong>
    </div>
    <div class="cart-summary-line cart-summary-total">
      <span>Total Amount</span>
      <strong>${formatCurrency(finalTotal)}</strong>
    </div>
    <button class="btn-primary btn-checkout" onclick="openCheckoutModal()">
      🔒 Proceed to Checkout (${formatCurrency(finalTotal)})
    </button>
  `;
}

function openCartDrawer() {
  document.getElementById('cart-drawer-backdrop')?.classList.add('active');
  document.getElementById('cart-drawer')?.classList.add('active');
  renderCartDrawer();
}

function closeCartDrawer() {
  document.getElementById('cart-drawer-backdrop')?.classList.remove('active');
  document.getElementById('cart-drawer')?.classList.remove('active');
}

/* Checkout Modal */
function openCheckoutModal() {
  closeCartDrawer();
  const modalBackdrop = document.getElementById('checkout-modal');
  if (!modalBackdrop) return;
  modalBackdrop.classList.add('active');
  renderCheckoutSummary();
}

function closeCheckoutModal() {
  document.getElementById('checkout-modal')?.classList.remove('active');
}

function renderCheckoutSummary() {
  const container = document.getElementById('checkout-order-summary');
  if (!container) return;

  const products = getStoredProducts();
  const subtotal = calculateCartSubtotal();
  let discountAmount = 0;
  if (activeCoupon && activeCoupon.discountPercent > 0) {
    discountAmount = Math.round((subtotal * activeCoupon.discountPercent) / 100);
  }
  let shippingFee = (subtotal > 2000 || (activeCoupon && activeCoupon.freeShipping)) ? 0 : 150;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  container.innerHTML = `
    <div style="background: var(--bg-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem;">
      <h4 style="margin-bottom: 0.75rem;">Order Items (${activeCart.reduce((a,b)=>a+b.qty,0)})</h4>
      <div style="max-height: 160px; overflow-y: auto; margin-bottom: 0.75rem;">
        ${activeCart.map(item => {
          const p = products.find(prod => prod.id === item.productId);
          return `
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.35rem;">
              <span>${item.qty}x ${p ? p.name : 'Product'}</span>
              <strong>${formatCurrency(p ? p.price * item.qty : 0)}</strong>
            </div>
          `;
        }).join('')}
      </div>
      <div class="cart-summary-line"><span>Subtotal</span><strong>${formatCurrency(subtotal)}</strong></div>
      ${discountAmount > 0 ? `<div class="cart-summary-line" style="color: var(--success);"><span>Discount</span><strong>-${formatCurrency(discountAmount)}</strong></div>` : ''}
      <div class="cart-summary-line"><span>Delivery Fee</span><strong>${shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}</strong></div>
      <div class="cart-summary-line cart-summary-total"><span>Grand Total</span><strong>${formatCurrency(finalTotal)}</strong></div>
    </div>
  `;
}

function selectPaymentMethod(element, method) {
  document.querySelectorAll('.payment-option-card').forEach(el => el.classList.remove('active'));
  element.classList.add('active');
  element.querySelector('input').checked = true;
}

function handleCheckoutSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('checkout-name').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();
  const address = document.getElementById('checkout-address').value.trim();
  const city = document.getElementById('checkout-city').value.trim();
  const slot = document.getElementById('checkout-slot').value;
  const payment = document.querySelector('input[name="payment_method"]:checked')?.value || 'COD';

  if (!name || !phone || !address || !city) {
    showToast('Please fill out all required shipping details.', 'danger');
    return;
  }

  const subtotal = calculateCartSubtotal();
  let discountAmount = 0;
  if (activeCoupon && activeCoupon.discountPercent > 0) {
    discountAmount = Math.round((subtotal * activeCoupon.discountPercent) / 100);
  }
  let shippingFee = (subtotal > 2000 || (activeCoupon && activeCoupon.freeShipping)) ? 0 : 150;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const orderId = 'ZM-' + Math.floor(100000 + Math.random() * 900000);
  const products = getStoredProducts();

  const newOrder = {
    id: orderId,
    date: new Date().toLocaleString(),
    customer: { name, phone, address, city },
    items: activeCart.map(item => {
      const p = products.find(prod => prod.id === item.productId);
      return {
        productId: item.productId,
        name: p ? p.name : 'Item',
        price: p ? p.price : 0,
        qty: item.qty,
        total: p ? p.price * item.qty : 0
      };
    }),
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    slot,
    paymentMethod: payment,
    status: 'Placed',
    timelineStep: 1
  };

  // Save to Orders LocalStorage
  const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
  orders.unshift(newOrder);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

  // Reset Cart
  activeCart = [];
  activeCoupon = null;
  saveCart();
  closeCheckoutModal();

  // Show Confirmation Receipt Modal
  activeOrderForTracking = newOrder;
  showOrderReceiptModal(newOrder);
  showToast(`Order #${newOrder.id} placed successfully!`, 'success');
}

/* Receipt & Order Confirmation Modal */
function showOrderReceiptModal(order) {
  const modal = document.getElementById('receipt-modal');
  if (!modal) return;

  const content = document.getElementById('receipt-modal-content');
  if (content) {
    content.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🎉</div>
        <h2 style="color: var(--primary);">Thank You For Your Order!</h2>
        <p style="color: var(--text-muted);">Your order <strong>#${order.id}</strong> has been confirmed.</p>
      </div>

      <div class="timeline">
        <div class="timeline-progress" style="width: 0%;"></div>
        <div class="timeline-step completed">
          <div class="timeline-dot">✓</div>
          <div class="timeline-label">Order Placed</div>
        </div>
        <div class="timeline-step active">
          <div class="timeline-dot">2</div>
          <div class="timeline-label">Packing</div>
        </div>
        <div class="timeline-step">
          <div class="timeline-dot">3</div>
          <div class="timeline-label">Out for Delivery</div>
        </div>
        <div class="timeline-step">
          <div class="timeline-dot">4</div>
          <div class="timeline-label">Delivered</div>
        </div>
      </div>

      <div style="background: var(--bg-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 0.75rem; font-weight: 700;">
          <span>Deliver To</span>
          <span>Payment: ${order.paymentMethod}</span>
        </div>
        <p style="font-size: 0.9rem;"><strong>${order.customer.name}</strong> (${order.customer.phone})</p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">${order.customer.address}, ${order.customer.city}</p>
        <p style="font-size: 0.85rem; color: var(--primary); font-weight: 600; margin-top: 0.35rem;">⏱️ Delivery Slot: ${order.slot}</p>
      </div>

      <h4 style="margin-bottom: 0.5rem;">Summary</h4>
      <table class="custom-table" style="margin-bottom: 1rem;">
        <thead>
          <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.qty}</td>
              <td>${formatCurrency(item.total)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="cart-summary-line cart-summary-total">
        <span>Total Paid</span>
        <strong style="color: var(--primary); font-size: 1.3rem;">${formatCurrency(order.totalAmount)}</strong>
      </div>

      <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
        <button class="btn-primary" style="flex: 1;" onclick="closeReceiptModal(); switchTab('track');">
          🚚 Track Order Progress
        </button>
        <button class="btn-secondary" onclick="window.print()">
          🖨️ Print Invoice
        </button>
      </div>
    `;
  }
  modal.classList.add('active');
}

function closeReceiptModal() {
  document.getElementById('receipt-modal')?.classList.remove('active');
}

/* Order Tracker Tab Page */
function renderOrderTrackerPage() {
  const container = document.getElementById('order-tracker-content');
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
  if (orders.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">📦</div>
        <h3>No Active Orders Found</h3>
        <p>You haven't placed any orders yet. Start shopping at Zain Mart to track your express delivery!</p>
        <button class="btn-primary" style="margin-top: 1rem;" onclick="switchTab('shop')">Explore Shop</button>
      </div>
    `;
    return;
  }

  const latestOrder = orders[0];

  let progressPercent = 0;
  if (latestOrder.status === 'Placed') progressPercent = 0;
  else if (latestOrder.status === 'Packing') progressPercent = 33;
  else if (latestOrder.status === 'Out for Delivery') progressPercent = 66;
  else if (latestOrder.status === 'Delivered') progressPercent = 100;

  container.innerHTML = `
    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-md);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
        <div>
          <h2>Tracking Order #${latestOrder.id}</h2>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Placed on: ${latestOrder.date}</p>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span style="font-size: 0.85rem; font-weight: 700;">Simulate Status:</span>
          <select class="select-control" onchange="simulateOrderStatus('${latestOrder.id}', this.value)">
            <option value="Placed" ${latestOrder.status === 'Placed' ? 'selected' : ''}>1. Order Placed</option>
            <option value="Packing" ${latestOrder.status === 'Packing' ? 'selected' : ''}>2. Packing Items</option>
            <option value="Out for Delivery" ${latestOrder.status === 'Out for Delivery' ? 'selected' : ''}>3. Out for Delivery</option>
            <option value="Delivered" ${latestOrder.status === 'Delivered' ? 'selected' : ''}>4. Delivered</option>
          </select>
        </div>
      </div>

      <div class="timeline">
        <div class="timeline-progress" style="width: ${progressPercent}%;"></div>
        <div class="timeline-step ${progressPercent >= 0 ? 'completed' : ''}">
          <div class="timeline-dot">✓</div>
          <div class="timeline-label">Order Placed</div>
        </div>
        <div class="timeline-step ${progressPercent >= 33 ? 'completed' : progressPercent === 0 ? 'active' : ''}">
          <div class="timeline-dot">📦</div>
          <div class="timeline-label">Packing</div>
        </div>
        <div class="timeline-step ${progressPercent >= 66 ? 'completed' : progressPercent === 33 ? 'active' : ''}">
          <div class="timeline-dot">🚚</div>
          <div class="timeline-label">Out for Delivery</div>
        </div>
        <div class="timeline-step ${progressPercent === 100 ? 'completed' : progressPercent === 66 ? 'active' : ''}">
          <div class="timeline-dot">🏠</div>
          <div class="timeline-label">Delivered</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2rem;">
        <div style="background: var(--bg-subtle); padding: 1.25rem; border-radius: var(--radius-md);">
          <h4 style="margin-bottom: 0.75rem;">Delivery Destination</h4>
          <p><strong>Name:</strong> ${latestOrder.customer.name}</p>
          <p><strong>Contact:</strong> ${latestOrder.customer.phone}</p>
          <p><strong>Address:</strong> ${latestOrder.customer.address}, ${latestOrder.customer.city}</p>
          <p style="color: var(--primary); font-weight: 700; margin-top: 0.5rem;">⏱️ Slot: ${latestOrder.slot}</p>
        </div>
        <div style="background: var(--bg-subtle); padding: 1.25rem; border-radius: var(--radius-md);">
          <h4 style="margin-bottom: 0.75rem;">Order Summary</h4>
          ${latestOrder.items.map(item => `
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
              <span>${item.qty}x ${item.name}</span>
              <strong>${formatCurrency(item.total)}</strong>
            </div>
          `).join('')}
          <div class="cart-summary-line cart-summary-total" style="margin-top: 0.5rem; padding-top: 0.5rem;">
            <span>Grand Total</span>
            <strong>${formatCurrency(latestOrder.totalAmount)}</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}

function simulateOrderStatus(orderId, newStatus) {
  const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
  const target = orders.find(o => o.id === orderId);
  if (target) {
    target.status = newStatus;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    renderOrderTrackerPage();
    showToast(`Order #${orderId} status updated to "${newStatus}"`, 'success');
  }
}
