/* Zain Mart - Products Database & Data Management */

const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: '🛒' },
  { id: 'fresh-produce', name: 'Fresh Fruits & Veggies', icon: '🍎' },
  { id: 'dairy-bakery', name: 'Dairy & Bakery', icon: '🥛' },
  { id: 'meat-poultry', name: 'Meat & Seafood', icon: '🥩' },
  { id: 'beverages', name: 'Beverages & Juices', icon: '🧃' },
  { id: 'snacks', name: 'Snacks & Sweets', icon: '🍿' },
  { id: 'pantry', name: 'Rice, Oils & Spices', icon: '🌾' },
  { id: 'household', name: 'Household & Cleaning', icon: '🧼' },
  { id: 'personal-care', name: 'Personal Care', icon: '🧴' }
];

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-101',
    name: 'Farm Fresh Organic Red Apples (1kg)',
    category: 'fresh-produce',
    subcategory: 'Fruits',
    price: 340,
    oldPrice: 400,
    rating: 4.8,
    reviewsCount: 142,
    badges: ['Sale', 'Organic', 'Halal'],
    inStock: true,
    stockQty: 45,
    unit: '1 kg',
    description: 'Crisp, sweet, and juicy hand-picked fresh organic red apples straight from local hill orchards.',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    ingredients: '100% Fresh Red Apples',
    dietary: ['Organic', 'Halal', 'Gluten-Free']
  },
  {
    id: 'prod-102',
    name: 'Fresh Farm Whole Milk (1 Litre)',
    category: 'dairy-bakery',
    subcategory: 'Dairy',
    price: 260,
    oldPrice: 280,
    rating: 4.9,
    reviewsCount: 230,
    badges: ['Halal', 'Sale'],
    inStock: true,
    stockQty: 80,
    unit: '1 L Pack',
    description: 'Pasteurized 100% pure cow milk rich in calcium and natural proteins. Daily fresh stock.',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
    ingredients: 'Pure Pasteurized Whole Milk',
    dietary: ['Halal', 'Gluten-Free']
  },
  {
    id: 'prod-103',
    name: 'Premium Super Kernel Basmati Rice (5kg)',
    category: 'pantry',
    subcategory: 'Grains',
    price: 1850,
    oldPrice: 2100,
    rating: 4.9,
    reviewsCount: 310,
    badges: ['Sale', 'Halal'],
    inStock: true,
    stockQty: 60,
    unit: '5 kg Bag',
    description: 'Aged extra long grain Basmati rice with rich aromatic flavor, perfect for Biryani and Pulao.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    ingredients: 'Super Kernel Aged Basmati Rice',
    dietary: ['Halal', 'Gluten-Free']
  },
  {
    id: 'prod-104',
    name: 'Fresh Boneless Chicken Breast (1kg)',
    category: 'meat-poultry',
    subcategory: 'Poultry',
    price: 950,
    oldPrice: 1050,
    rating: 4.7,
    reviewsCount: 95,
    badges: ['Halal'],
    inStock: true,
    stockQty: 30,
    unit: '1 kg Pack',
    description: 'Hygienically washed, skinless 100% Halal boneless chicken breast cuts.',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
    ingredients: 'Fresh Halal Chicken Breast',
    dietary: ['Halal', 'Gluten-Free']
  },
  {
    id: 'prod-105',
    name: 'Fresh Organic Spinach & Salad Greens',
    category: 'fresh-produce',
    subcategory: 'Vegetables',
    price: 120,
    oldPrice: 150,
    rating: 4.6,
    reviewsCount: 68,
    badges: ['Organic', 'Sale'],
    inStock: true,
    stockQty: 25,
    unit: '250g Bunch',
    description: 'Nutrient-packed leafy green spinach harvested daily.',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    ingredients: 'Fresh Organic Spinach Leaves',
    dietary: ['Organic', 'Halal', 'Gluten-Free']
  },
  {
    id: 'prod-106',
    name: 'Artisan Sourdough Sandwich Bread',
    category: 'dairy-bakery',
    subcategory: 'Bakery',
    price: 320,
    oldPrice: 350,
    rating: 4.8,
    reviewsCount: 88,
    badges: ['Fresh Baked'],
    inStock: true,
    stockQty: 20,
    unit: '400g Loaf',
    description: 'Freshly baked artisan sourdough bread with a crispy crust and soft airy interior.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    ingredients: 'Wheat Flour, Water, Natural Starter, Sea Salt',
    dietary: ['Halal']
  },
  {
    id: 'prod-107',
    name: 'Pure Cold-Pressed Extra Virgin Olive Oil (500ml)',
    category: 'pantry',
    subcategory: 'Oils',
    price: 2450,
    oldPrice: 2800,
    rating: 4.9,
    reviewsCount: 175,
    badges: ['Organic', 'Sale'],
    inStock: true,
    stockQty: 40,
    unit: '500ml Glass Bottle',
    description: 'First cold-pressed Mediterranean extra virgin olive oil high in healthy antioxidants.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    ingredients: '100% Extra Virgin Olive Oil',
    dietary: ['Organic', 'Halal', 'Gluten-Free']
  },
  {
    id: 'prod-108',
    name: 'Cold Pressed Orange Juice (1 Litre)',
    category: 'beverages',
    subcategory: 'Juices',
    price: 490,
    oldPrice: 550,
    rating: 4.7,
    reviewsCount: 112,
    badges: ['No Added Sugar', 'Sale'],
    inStock: true,
    stockQty: 35,
    unit: '1 L Bottle',
    description: '100% freshly squeezed natural Valencia oranges without added preservatives or sugar.',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    ingredients: '100% Squeezed Orange Juice',
    dietary: ['Organic', 'Halal', 'Sugar-Free', 'Gluten-Free']
  },
  {
    id: 'prod-109',
    name: 'Gourmet Roasted Salted Almonds (250g)',
    category: 'snacks',
    subcategory: 'Nuts',
    price: 890,
    oldPrice: 990,
    rating: 4.9,
    reviewsCount: 154,
    badges: ['Organic'],
    inStock: true,
    stockQty: 50,
    unit: '250g Pouch',
    description: 'Premium Californian roasted almonds lightly tossed with sea salt.',
    image: 'https://images.unsplash.com/photo-1508061252966-f72005a39774?auto=format&fit=crop&w=600&q=80',
    ingredients: 'Almonds, Himalayan Sea Salt',
    dietary: ['Organic', 'Halal', 'Gluten-Free']
  },
  {
    id: 'prod-110',
    name: 'Antibacterial Liquid Hand Wash (500ml)',
    category: 'household',
    subcategory: 'Hygiene',
    price: 380,
    oldPrice: 420,
    rating: 4.6,
    reviewsCount: 82,
    badges: ['Sale'],
    inStock: true,
    stockQty: 70,
    unit: '500ml Pump',
    description: 'Moisturizing antibacterial hand cleanser infused with aloe vera and tea tree oil.',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
    ingredients: 'Aqua, Sodium Laureth Sulfate, Aloe Vera Extract, Tea Tree Essential Oil',
    dietary: []
  },
  {
    id: 'prod-111',
    name: 'Organic Honey Wildflower (500g)',
    category: 'pantry',
    subcategory: 'Sweeteners',
    price: 1250,
    oldPrice: 1400,
    rating: 4.9,
    reviewsCount: 198,
    badges: ['Organic', 'Halal'],
    inStock: true,
    stockQty: 40,
    unit: '500g Jar',
    description: 'Unfiltered raw wildflower honey collected from mountain bee hives.',
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    ingredients: '100% Pure Raw Honey',
    dietary: ['Organic', 'Halal', 'Gluten-Free']
  },
  {
    id: 'prod-112',
    name: 'Dark Chocolate 70% Cocoa Bar (100g)',
    category: 'snacks',
    subcategory: 'Confectionery',
    price: 450,
    oldPrice: 500,
    rating: 4.8,
    reviewsCount: 215,
    badges: ['Organic'],
    inStock: true,
    stockQty: 90,
    unit: '100g Bar',
    description: 'Rich Belgian dark chocolate made with sustainably sourced single-origin cocoa beans.',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
    ingredients: 'Cocoa Mass, Cocoa Butter, Raw Cane Sugar',
    dietary: ['Halal', 'Gluten-Free']
  }
];

// Helper state storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'zain_mart_products_v1',
  CART: 'zain_mart_cart_v1',
  WISHLIST: 'zain_mart_wishlist_v1',
  ORDERS: 'zain_mart_orders_v1',
  CURRENCY: 'zain_mart_currency_v1',
  THEME: 'zain_mart_theme_v1'
};

// Initialize Products in LocalStorage
function getStoredProducts() {
  const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return DEFAULT_PRODUCTS;
  }
}

function saveProductsToStorage(products) {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

// Currency Conversion & Format
let currentCurrency = localStorage.getItem(STORAGE_KEYS.CURRENCY) || 'PKR';

function formatCurrency(amountPKR) {
  if (currentCurrency === 'USD') {
    const usd = (amountPKR / 280).toFixed(2);
    return `$${usd}`;
  }
  return `Rs. ${amountPKR.toLocaleString()}`;
}

function setCurrency(currency) {
  currentCurrency = currency;
  localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
}
