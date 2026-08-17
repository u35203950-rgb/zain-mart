/* Zain Mart - Recipe Meal Planner Module */

const RECIPE_BUNDLES = [
  {
    id: 'recipe-biryani',
    title: 'Chicken Biryani Feast Kit',
    icon: '🍲',
    description: 'Everything you need to cook authentic aromatic Special Chicken Biryani for 4-6 persons.',
    servings: '4-6 Persons',
    prepTime: '45 mins',
    items: [
      { productId: 'prod-103', qty: 1, name: 'Super Kernel Basmati Rice (5kg)' },
      { productId: 'prod-104', qty: 1, name: 'Fresh Boneless Chicken Breast (1kg)' },
      { productId: 'prod-107', qty: 1, name: 'Pure Cold-Pressed Olive Oil (500ml)' }
    ]
  },
  {
    id: 'recipe-salad',
    title: 'Organic Garden Salad Kit',
    icon: '🥗',
    description: 'Crisp organic spinach greens, fresh apples, roasted almonds, and extra virgin dressing.',
    servings: '2-3 Persons',
    prepTime: '15 mins',
    items: [
      { productId: 'prod-105', qty: 2, name: 'Fresh Organic Spinach & Salad Greens' },
      { productId: 'prod-101', qty: 1, name: 'Farm Fresh Organic Red Apples (1kg)' },
      { productId: 'prod-109', qty: 1, name: 'Gourmet Roasted Salted Almonds (250g)' }
    ]
  },
  {
    id: 'recipe-breakfast',
    title: 'Healthy Morning Breakfast Kit',
    icon: '🍳',
    description: 'Whole fresh farm milk, artisan sourdough bread, raw mountain honey & natural orange juice.',
    servings: '3-4 Persons',
    prepTime: '10 mins',
    items: [
      { productId: 'prod-102', qty: 2, name: 'Fresh Farm Whole Milk (1 Litre)' },
      { productId: 'prod-106', qty: 1, name: 'Artisan Sourdough Sandwich Bread' },
      { productId: 'prod-111', qty: 1, name: 'Organic Honey Wildflower (500g)' },
      { productId: 'prod-108', qty: 1, name: 'Cold Pressed Orange Juice (1 Litre)' }
    ]
  }
];

function renderRecipePlanner() {
  const container = document.getElementById('recipe-cards-container');
  if (!container) return;

  const products = getStoredProducts();

  container.innerHTML = RECIPE_BUNDLES.map(bundle => {
    let bundlePricePKR = 0;
    const itemsListHtml = bundle.items.map(item => {
      const p = products.find(prod => prod.id === item.productId);
      const price = p ? p.price * item.qty : 0;
      bundlePricePKR += price;
      return `
        <li>
          <span>${item.qty}x ${p ? p.name : item.name}</span>
          <strong>${p ? formatCurrency(price) : ''}</strong>
        </li>
      `;
    }).join('');

    return `
      <div class="recipe-card">
        <div class="recipe-header">
          <span class="recipe-icon">${bundle.icon}</span>
          <div>
            <h3>${bundle.title}</h3>
            <p style="font-size: 0.8rem; color: var(--text-light); font-weight: 600;">
              ⏱️ ${bundle.prepTime} | 👥 ${bundle.servings}
            </p>
          </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">${bundle.description}</p>
        <ul class="recipe-ingredients-list">
          ${itemsListHtml}
        </ul>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 1rem;">
          <div>
            <span style="font-size: 0.75rem; color: var(--text-light); text-transform: uppercase;">Bundle Price</span>
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary);">${formatCurrency(bundlePricePKR)}</div>
          </div>
          <button class="btn-primary" onclick="addRecipeBundleToCart('${bundle.id}')">
            🛒 Add Kit to Cart
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function addRecipeBundleToCart(bundleId) {
  const bundle = RECIPE_BUNDLES.find(b => b.id === bundleId);
  if (!bundle) return;

  let addedCount = 0;
  bundle.items.forEach(item => {
    addToCart(item.productId, item.qty);
    addedCount += item.qty;
  });

  showToast(`Added ${bundle.title} (${addedCount} items) to your cart!`, 'success');
  openCartDrawer();
}
