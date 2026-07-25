// ====================================
// LUXE STORE — Main Application Logic
// ====================================

(function () {
  'use strict';

  // ── State ──
  const state = {
    cart: JSON.parse(localStorage.getItem('luxe_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('luxe_wishlist') || '[]'),
    activeCategory: 'All',
    sortBy: 'featured',
    maxPrice: 1000,
    searchQuery: '',
    modalProduct: null,
    modalQty: 1,
    checkoutStep: 0,
    promoApplied: false,
    promoDiscount: 0,
    theme: localStorage.getItem('luxe_theme') || 'dark'
  };

  // ── Categories ──
  const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Accessories'];

  // ══════════════════════════════════
  // INITIALIZATION
  // ══════════════════════════════════
  function init() {
    applyTheme();
    renderCategories();
    renderProducts();
    updateCartBadge();
    updateWishlistBadge();
    bindEvents();
    lucide.createIcons();
  }

  // ══════════════════════════════════
  // THEME
  // ══════════════════════════════════
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcon();
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('luxe_theme', state.theme);
    applyTheme();
  }

  function updateThemeIcon() {
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.setAttribute('data-lucide', state.theme === 'dark' ? 'moon' : 'sun');
      lucide.createIcons();
    }
  }

  // ══════════════════════════════════
  // CATEGORIES
  // ══════════════════════════════════
  function renderCategories() {
    const bar = document.getElementById('categories-bar');
    bar.innerHTML = CATEGORIES.map(cat => `
      <button class="category-chip ${cat === state.activeCategory ? 'active' : ''}"
              data-category="${cat}">${cat}</button>
    `).join('');
  }

  // ══════════════════════════════════
  // FILTERING & SORTING
  // ══════════════════════════════════
  function getFilteredProducts() {
    let filtered = [...PRODUCTS];

    // Category
    if (state.activeCategory !== 'All') {
      filtered = filtered.filter(p => p.category === state.activeCategory);
    }

    // Search
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Max price
    filtered = filtered.filter(p => p.price <= state.maxPrice);

    // Sort
    switch (state.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default: // featured — keep hot/new on top
        filtered.sort((a, b) => {
          const badgeOrder = { hot: 0, new: 1, sale: 2 };
          const aO = a.badge ? (badgeOrder[a.badge] ?? 3) : 3;
          const bO = b.badge ? (badgeOrder[b.badge] ?? 3) : 3;
          return aO - bO;
        });
    }

    return filtered;
  }

  // ══════════════════════════════════
  // RENDER PRODUCTS
  // ══════════════════════════════════
  function renderProducts() {
    const grid = document.getElementById('product-grid');
    const products = getFilteredProducts();
    document.getElementById('product-count-num').textContent = products.length;

    if (products.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-tertiary);">
          <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;">🔍</div>
          <p style="font-size: 1.1rem;">No products found matching your criteria.</p>
          <p style="font-size: 0.88rem; margin-top: 0.5rem;">Try adjusting your filters or search query.</p>
        </div>`;
      return;
    }

    grid.innerHTML = products.map((product, i) => {
      const isWished = state.wishlist.includes(product.id);
      const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

      return `
        <article class="product-card fade-in" style="animation-delay: ${i * 0.05}s" data-id="${product.id}">
          <div class="product-image-wrap">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${product.badge ? `
              <div class="product-badges">
                <span class="product-badge ${product.badge}">${product.badge === 'sale' ? `${discount}% OFF` : product.badge.toUpperCase()}</span>
              </div>` : ''}
            <button class="wishlist-btn ${isWished ? 'active' : ''}" data-wishlist-id="${product.id}" aria-label="Toggle wishlist">
              <i data-lucide="${isWished ? 'heart' : 'heart'}" style="width:18px;height:18px;${isWished ? 'fill:currentColor;' : ''}"></i>
            </button>
            <div class="product-actions-overlay">
              <button class="btn btn-primary btn-sm" data-quick-view="${product.id}">
                <i data-lucide="eye" style="width:16px;height:16px"></i> Quick View
              </button>
              <button class="btn btn-accent btn-sm" data-add-cart="${product.id}">
                <i data-lucide="shopping-bag" style="width:16px;height:16px"></i> Add
              </button>
            </div>
          </div>
          <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">
              <div class="stars">${renderStars(product.rating)}</div>
              <span class="rating-count">(${product.reviews.toLocaleString()})</span>
            </div>
            <div class="product-price-row">
              <span class="product-price">$${product.price.toFixed(2)}</span>
              ${product.originalPrice ? `<span class="product-price-old">$${product.originalPrice.toFixed(2)}</span>` : ''}
              ${discount ? `<span class="product-discount">-${discount}%</span>` : ''}
            </div>
          </div>
        </article>`;
    }).join('');

    lucide.createIcons();
  }

  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }

  // ══════════════════════════════════
  // PRODUCT MODAL
  // ══════════════════════════════════
  function openProductModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    state.modalProduct = product;
    state.modalQty = 1;

    const discount = product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-image').alt = product.name;
    document.getElementById('modal-category').textContent = product.category;
    document.getElementById('modal-name').textContent = product.name;
    document.getElementById('modal-description').textContent = product.description;
    document.getElementById('modal-price').textContent = `$${product.price.toFixed(2)}`;

    const oldEl = document.getElementById('modal-price-old');
    const discEl = document.getElementById('modal-discount');
    oldEl.textContent = product.originalPrice ? `$${product.originalPrice.toFixed(2)}` : '';
    discEl.textContent = discount ? `-${discount}%` : '';

    // Rating
    document.getElementById('modal-rating').innerHTML = `
      <div class="stars">${renderStars(product.rating)}</div>
      <span class="rating-count">${product.rating} · ${product.reviews.toLocaleString()} reviews</span>`;

    // Specs
    document.getElementById('modal-specs').innerHTML = Object.entries(product.specs).map(([k, v]) => `
      <div class="spec-item"><span class="spec-label">${k}</span><span class="spec-value">${v}</span></div>`).join('');

    // Quantity
    document.getElementById('qty-display').textContent = '1';

    // Stock
    const stockEl = document.getElementById('stock-indicator');
    if (product.stock > 10) {
      stockEl.className = 'stock-indicator in-stock';
      stockEl.innerHTML = `<i data-lucide="check-circle" style="width:16px;height:16px"></i> In Stock (${product.stock})`;
    } else if (product.stock > 0) {
      stockEl.className = 'stock-indicator low-stock';
      stockEl.innerHTML = `<i data-lucide="alert-circle" style="width:16px;height:16px"></i> Only ${product.stock} left`;
    } else {
      stockEl.className = 'stock-indicator out-of-stock';
      stockEl.innerHTML = `<i data-lucide="x-circle" style="width:16px;height:16px"></i> Out of Stock`;
    }

    // Wishlist button state
    const isWished = state.wishlist.includes(product.id);
    const wishBtn = document.getElementById('modal-add-wishlist');
    wishBtn.innerHTML = `<i data-lucide="heart" style="width:18px;height:18px;${isWished ? 'fill:currentColor;color:var(--danger);' : ''}"></i>`;

    document.getElementById('product-modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
  }

  function closeProductModal() {
    document.getElementById('product-modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
    state.modalProduct = null;
  }

  // ══════════════════════════════════
  // CART
  // ══════════════════════════════════
  function addToCart(productId, qty = 1) {
    const existing = state.cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      state.cart.push({ id: productId, qty });
    }
    saveCart();
    updateCartBadge();
    renderCartItems();
    showToast('success', 'Added to cart!');
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveCart();
    updateCartBadge();
    renderCartItems();
    showToast('info', 'Removed from cart');
  }

  function updateCartQty(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    saveCart();
    updateCartBadge();
    renderCartItems();
  }

  function saveCart() {
    localStorage.setItem('luxe_cart', JSON.stringify(state.cart));
  }

  function updateCartBadge() {
    const total = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cart-badge');
    badge.textContent = total;
    badge.classList.toggle('show', total > 0);
  }

  function openCart() {
    renderCartItems();
    document.getElementById('cart-overlay').classList.add('open');
    document.getElementById('cart-drawer').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    document.getElementById('cart-overlay').classList.remove('open');
    document.getElementById('cart-drawer').classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderCartItems() {
    const container = document.getElementById('cart-items');
    const footer = document.getElementById('cart-footer');

    document.getElementById('cart-count-label').textContent =
      `(${state.cart.reduce((s, i) => s + i.qty, 0)} items)`;

    if (state.cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <p>Your cart is empty</p>
          <button class="btn btn-primary btn-sm" onclick="document.getElementById('cart-overlay').click()">Start Shopping</button>
        </div>`;
      footer.style.display = 'none';
      return;
    }

    footer.style.display = '';

    container.innerHTML = state.cart.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) return '';
      return `
        <div class="cart-item" data-cart-id="${product.id}">
          <div class="cart-item-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
          </div>
          <div class="cart-item-info">
            <span class="cart-item-name">${product.name}</span>
            <span class="cart-item-price">$${(product.price * item.qty).toFixed(2)}</span>
            <div class="cart-item-controls">
              <button class="cart-qty-btn" data-cart-minus="${product.id}" aria-label="Decrease">−</button>
              <span class="cart-item-qty">${item.qty}</span>
              <button class="cart-qty-btn" data-cart-plus="${product.id}" aria-label="Increase">+</button>
              <button class="cart-item-remove" data-cart-remove="${product.id}" aria-label="Remove">
                <i data-lucide="trash-2" style="width:14px;height:14px"></i>
              </button>
            </div>
          </div>
        </div>`;
    }).join('');

    // Calculate totals
    const subtotal = state.cart.reduce((sum, item) => {
      const p = PRODUCTS.find(pr => pr.id === item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);

    const shipping = subtotal > 100 ? 0 : 9.99;
    const discountAmount = state.promoApplied ? subtotal * state.promoDiscount : 0;
    const taxable = subtotal - discountAmount;
    const tax = taxable * 0.08;
    const total = taxable + shipping + tax;

    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;

    const discountRow = document.getElementById('discount-row');
    if (state.promoApplied) {
      discountRow.style.display = '';
      document.getElementById('cart-discount').textContent = `-$${discountAmount.toFixed(2)}`;
    } else {
      discountRow.style.display = 'none';
    }

    lucide.createIcons();
  }

  // ══════════════════════════════════
  // WISHLIST
  // ══════════════════════════════════
  function toggleWishlist(productId) {
    const idx = state.wishlist.indexOf(productId);
    if (idx >= 0) {
      state.wishlist.splice(idx, 1);
      showToast('info', 'Removed from wishlist');
    } else {
      state.wishlist.push(productId);
      showToast('success', 'Added to wishlist! ♥');
    }
    localStorage.setItem('luxe_wishlist', JSON.stringify(state.wishlist));
    updateWishlistBadge();
    renderProducts();
  }

  function updateWishlistBadge() {
    const badge = document.getElementById('wishlist-badge');
    badge.textContent = state.wishlist.length;
    badge.classList.toggle('show', state.wishlist.length > 0);
  }

  // ══════════════════════════════════
  // PROMO CODE
  // ══════════════════════════════════
  function applyPromo() {
    const code = document.getElementById('promo-input').value.trim().toUpperCase();
    const promoCodes = { 'LUXE10': 0.10, 'SAVE20': 0.20, 'VIP15': 0.15 };

    if (promoCodes[code]) {
      state.promoApplied = true;
      state.promoDiscount = promoCodes[code];
      showToast('success', `Promo applied! ${Math.round(state.promoDiscount * 100)}% off`);
      renderCartItems();
    } else {
      showToast('error', 'Invalid promo code. Try LUXE10, VIP15, or SAVE20');
    }
  }

  // ══════════════════════════════════
  // CHECKOUT
  // ══════════════════════════════════
  const CHECKOUT_STEPS = ['Shipping', 'Payment', 'Review'];

  function openCheckout() {
    if (state.cart.length === 0) {
      showToast('error', 'Your cart is empty!');
      return;
    }
    closeCart();
    state.checkoutStep = 0;
    renderCheckout();
    document.getElementById('checkout-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    document.getElementById('checkout-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderCheckout() {
    // Steps indicator
    const stepsEl = document.getElementById('checkout-steps');
    stepsEl.innerHTML = CHECKOUT_STEPS.map((step, i) => {
      const cls = i < state.checkoutStep ? 'completed' : i === state.checkoutStep ? 'active' : '';
      const connectorCls = i < state.checkoutStep ? 'active' : '';
      return `
        <div class="checkout-step ${cls}">
          <span class="step-number">${i < state.checkoutStep ? '✓' : i + 1}</span>
          <span>${step}</span>
        </div>
        ${i < CHECKOUT_STEPS.length - 1 ? `<div class="step-connector ${connectorCls}"></div>` : ''}`;
    }).join('');

    // Body content
    const body = document.getElementById('checkout-body');

    if (state.checkoutStep === 0) {
      body.innerHTML = `
        <form class="checkout-form" id="shipping-form">
          <div class="form-row">
            <div class="form-group">
              <label for="first-name">First Name</label>
              <input class="form-input" id="first-name" type="text" placeholder="John" required>
            </div>
            <div class="form-group">
              <label for="last-name">Last Name</label>
              <input class="form-input" id="last-name" type="text" placeholder="Doe" required>
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input class="form-input" id="email" type="email" placeholder="john@example.com" required>
          </div>
          <div class="form-group">
            <label for="address">Street Address</label>
            <input class="form-input" id="address" type="text" placeholder="123 Main St" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="city">City</label>
              <input class="form-input" id="city" type="text" placeholder="New York" required>
            </div>
            <div class="form-group">
              <label for="zip">ZIP Code</label>
              <input class="form-input" id="zip" type="text" placeholder="10001" required>
            </div>
          </div>
          <div class="checkout-nav">
            <button type="button" class="btn btn-secondary" id="checkout-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Continue to Payment</button>
          </div>
        </form>`;
    } else if (state.checkoutStep === 1) {
      body.innerHTML = `
        <form class="checkout-form" id="payment-form">
          <div class="form-group">
            <label for="card-number">Card Number</label>
            <input class="form-input" id="card-number" type="text" placeholder="1234 5678 9012 3456" maxlength="19" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="card-expiry">Expiry Date</label>
              <input class="form-input" id="card-expiry" type="text" placeholder="MM/YY" maxlength="5" required>
            </div>
            <div class="form-group">
              <label for="card-cvv">CVV</label>
              <input class="form-input" id="card-cvv" type="text" placeholder="123" maxlength="4" required>
            </div>
          </div>
          <div class="form-group">
            <label for="card-name">Cardholder Name</label>
            <input class="form-input" id="card-name" type="text" placeholder="JOHN DOE" required>
          </div>
          <div class="checkout-nav">
            <button type="button" class="btn btn-secondary" id="checkout-back">Back</button>
            <button type="submit" class="btn btn-primary">Review Order</button>
          </div>
        </form>`;
    } else if (state.checkoutStep === 2) {
      const subtotal = state.cart.reduce((sum, item) => {
        const p = PRODUCTS.find(pr => pr.id === item.id);
        return sum + (p ? p.price * item.qty : 0);
      }, 0);
      const shipping = subtotal > 100 ? 0 : 9.99;
      const discountAmount = state.promoApplied ? subtotal * state.promoDiscount : 0;
      const taxable = subtotal - discountAmount;
      const tax = taxable * 0.08;
      const total = taxable + shipping + tax;

      body.innerHTML = `
        <div class="checkout-form">
          <h4 style="font-family:var(--font-heading);margin-bottom:var(--space-md);">Order Summary</h4>
          ${state.cart.map(item => {
            const p = PRODUCTS.find(pr => pr.id === item.id);
            return p ? `<div class="cart-summary-row"><span class="label">${p.name} × ${item.qty}</span><span class="value">$${(p.price * item.qty).toFixed(2)}</span></div>` : '';
          }).join('')}
          <div class="cart-summary-row" style="margin-top:var(--space-md);padding-top:var(--space-md);border-top:1px solid var(--border-color);">
            <span class="label">Subtotal</span><span class="value">$${subtotal.toFixed(2)}</span>
          </div>
          ${state.promoApplied ? `<div class="cart-summary-row discount"><span class="label">Discount</span><span class="value">-$${discountAmount.toFixed(2)}</span></div>` : ''}
          <div class="cart-summary-row"><span class="label">Shipping</span><span class="value">${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span></div>
          <div class="cart-summary-row"><span class="label">Tax (8%)</span><span class="value">$${tax.toFixed(2)}</span></div>
          <div class="cart-summary-row total"><span class="label">Total</span><span class="value">$${total.toFixed(2)}</span></div>
          <div class="checkout-nav">
            <button class="btn btn-secondary" id="checkout-back">Back</button>
            <button class="btn btn-accent" id="place-order">
              <i data-lucide="check-circle" style="width:18px;height:18px"></i>
              Place Order
            </button>
          </div>
        </div>`;
      lucide.createIcons();
    }

    bindCheckoutEvents();
  }

  function showOrderSuccess() {
    const orderId = 'LXS-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    document.getElementById('checkout-steps').style.display = 'none';
    document.getElementById('checkout-title').textContent = '';
    document.getElementById('checkout-body').innerHTML = `
      <div class="order-success">
        <div class="success-icon">✓</div>
        <h2>Order Confirmed!</h2>
        <p>Thank you for your purchase. Your order has been placed successfully.</p>
        <p>Your order ID is:</p>
        <div class="order-id">${orderId}</div>
        <p style="font-size:0.82rem;color:var(--text-tertiary);">A confirmation email has been sent to your address.</p>
        <button class="btn btn-primary" id="order-done" style="margin-top:var(--space-xl);">
          <i data-lucide="shopping-bag" style="width:18px;height:18px"></i> Continue Shopping
        </button>
      </div>`;

    // Clear cart
    state.cart = [];
    state.promoApplied = false;
    state.promoDiscount = 0;
    saveCart();
    updateCartBadge();

    lucide.createIcons();

    document.getElementById('order-done').addEventListener('click', () => {
      closeCheckout();
      document.getElementById('checkout-steps').style.display = '';
      document.getElementById('checkout-title').textContent = 'Checkout';
    });
  }

  function bindCheckoutEvents() {
    const shippingForm = document.getElementById('shipping-form');
    const paymentForm = document.getElementById('payment-form');
    const backBtn = document.getElementById('checkout-back');
    const cancelBtn = document.getElementById('checkout-cancel');
    const placeOrderBtn = document.getElementById('place-order');

    if (shippingForm) {
      shippingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        state.checkoutStep = 1;
        renderCheckout();
      });
    }
    if (paymentForm) {
      paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        state.checkoutStep = 2;
        renderCheckout();
      });
    }
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        state.checkoutStep = Math.max(0, state.checkoutStep - 1);
        renderCheckout();
      });
    }
    if (cancelBtn) {
      cancelBtn.addEventListener('click', closeCheckout);
    }
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', showOrderSuccess);
    }
  }

  // ══════════════════════════════════
  // TOAST NOTIFICATIONS
  // ══════════════════════════════════
  function showToast(type, message) {
    const container = document.getElementById('toast-container');
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ'}</span>
      <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // ══════════════════════════════════
  // EVENT BINDINGS
  // ══════════════════════════════════
  function bindEvents() {
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Search
    let searchTimeout;
    document.getElementById('search-input').addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        state.searchQuery = e.target.value;
        renderProducts();
      }, 300);
    });

    // Categories
    document.getElementById('categories-bar').addEventListener('click', (e) => {
      const chip = e.target.closest('.category-chip');
      if (!chip) return;
      state.activeCategory = chip.dataset.category;
      renderCategories();
      renderProducts();
    });

    // Sort
    document.getElementById('sort-select').addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderProducts();
    });

    // Price slider
    const priceSlider = document.getElementById('price-slider');
    priceSlider.addEventListener('input', (e) => {
      state.maxPrice = parseInt(e.target.value);
      document.getElementById('price-value').textContent = `$${state.maxPrice}`;
      renderProducts();
    });

    // Product grid click delegation
    document.getElementById('product-grid').addEventListener('click', (e) => {
      // Quick View
      const quickView = e.target.closest('[data-quick-view]');
      if (quickView) {
        openProductModal(parseInt(quickView.dataset.quickView));
        return;
      }
      // Add to cart
      const addCart = e.target.closest('[data-add-cart]');
      if (addCart) {
        addToCart(parseInt(addCart.dataset.addCart));
        return;
      }
      // Wishlist
      const wishBtn = e.target.closest('[data-wishlist-id]');
      if (wishBtn) {
        toggleWishlist(parseInt(wishBtn.dataset.wishlistId));
        return;
      }
      // Click on card
      const card = e.target.closest('.product-card');
      if (card) {
        openProductModal(parseInt(card.dataset.id));
      }
    });

    // Modal close
    document.getElementById('modal-close').addEventListener('click', closeProductModal);
    document.getElementById('product-modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeProductModal();
    });

    // Modal quantity
    document.getElementById('qty-minus').addEventListener('click', () => {
      state.modalQty = Math.max(1, state.modalQty - 1);
      document.getElementById('qty-display').textContent = state.modalQty;
    });
    document.getElementById('qty-plus').addEventListener('click', () => {
      if (state.modalProduct) {
        state.modalQty = Math.min(state.modalProduct.stock, state.modalQty + 1);
        document.getElementById('qty-display').textContent = state.modalQty;
      }
    });

    // Modal add to cart
    document.getElementById('modal-add-cart').addEventListener('click', () => {
      if (state.modalProduct) {
        addToCart(state.modalProduct.id, state.modalQty);
        closeProductModal();
      }
    });

    // Modal wishlist
    document.getElementById('modal-add-wishlist').addEventListener('click', () => {
      if (state.modalProduct) {
        toggleWishlist(state.modalProduct.id);
        // Refresh icon
        const isWished = state.wishlist.includes(state.modalProduct.id);
        const btn = document.getElementById('modal-add-wishlist');
        btn.innerHTML = `<i data-lucide="heart" style="width:18px;height:18px;${isWished ? 'fill:currentColor;color:var(--danger);' : ''}"></i>`;
        lucide.createIcons();
      }
    });

    // Cart drawer
    document.getElementById('cart-toggle').addEventListener('click', openCart);
    document.getElementById('cart-close').addEventListener('click', closeCart);
    document.getElementById('cart-overlay').addEventListener('click', closeCart);

    // Cart item interactions (delegation)
    document.getElementById('cart-items').addEventListener('click', (e) => {
      const minus = e.target.closest('[data-cart-minus]');
      if (minus) { updateCartQty(parseInt(minus.dataset.cartMinus), -1); return; }
      const plus = e.target.closest('[data-cart-plus]');
      if (plus) { updateCartQty(parseInt(plus.dataset.cartPlus), 1); return; }
      const remove = e.target.closest('[data-cart-remove]');
      if (remove) { removeFromCart(parseInt(remove.dataset.cartRemove)); return; }
    });

    // Promo code
    document.getElementById('promo-apply').addEventListener('click', applyPromo);
    document.getElementById('promo-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); applyPromo(); }
    });

    // Checkout
    document.getElementById('checkout-btn').addEventListener('click', openCheckout);
    document.getElementById('checkout-close').addEventListener('click', closeCheckout);
    document.getElementById('checkout-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeCheckout();
    });

    // Hero buttons
    document.getElementById('shop-now-btn').addEventListener('click', () => {
      document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('explore-btn').addEventListener('click', () => {
      document.getElementById('categories-section').scrollIntoView({ behavior: 'smooth' });
    });

    // Wishlist header button — filter to wishlisted items
    document.getElementById('wishlist-toggle').addEventListener('click', () => {
      if (state.searchQuery === '__wishlist__') {
        state.searchQuery = '';
        document.getElementById('search-input').value = '';
        renderProducts();
        showToast('info', 'Showing all products');
      } else {
        state.searchQuery = '__wishlist__';
        state.activeCategory = 'All';
        renderCategories();
        renderWishlistView();
        document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Keyboard: Escape closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeProductModal();
        closeCart();
        closeCheckout();
      }
    });
  }

  function renderWishlistView() {
    const grid = document.getElementById('product-grid');
    const products = PRODUCTS.filter(p => state.wishlist.includes(p.id));
    document.getElementById('product-count-num').textContent = products.length;

    if (products.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-tertiary);">
          <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;">♥</div>
          <p style="font-size: 1.1rem;">Your wishlist is empty</p>
          <p style="font-size: 0.88rem; margin-top: 0.5rem;">Browse products and tap the heart to save your favorites.</p>
        </div>`;
      return;
    }

    grid.innerHTML = products.map((product, i) => {
      const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

      return `
        <article class="product-card fade-in" style="animation-delay: ${i * 0.05}s" data-id="${product.id}">
          <div class="product-image-wrap">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${product.badge ? `
              <div class="product-badges">
                <span class="product-badge ${product.badge}">${product.badge === 'sale' ? `${discount}% OFF` : product.badge.toUpperCase()}</span>
              </div>` : ''}
            <button class="wishlist-btn active" data-wishlist-id="${product.id}" aria-label="Remove from wishlist">
              <i data-lucide="heart" style="width:18px;height:18px;fill:currentColor;"></i>
            </button>
            <div class="product-actions-overlay">
              <button class="btn btn-primary btn-sm" data-quick-view="${product.id}">
                <i data-lucide="eye" style="width:16px;height:16px"></i> Quick View
              </button>
              <button class="btn btn-accent btn-sm" data-add-cart="${product.id}">
                <i data-lucide="shopping-bag" style="width:16px;height:16px"></i> Add
              </button>
            </div>
          </div>
          <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">
              <div class="stars">${renderStars(product.rating)}</div>
              <span class="rating-count">(${product.reviews.toLocaleString()})</span>
            </div>
            <div class="product-price-row">
              <span class="product-price">$${product.price.toFixed(2)}</span>
              ${product.originalPrice ? `<span class="product-price-old">$${product.originalPrice.toFixed(2)}</span>` : ''}
              ${discount ? `<span class="product-discount">-${discount}%</span>` : ''}
            </div>
          </div>
        </article>`;
    }).join('');

    lucide.createIcons();
  }

  // ── Start App ──
  document.addEventListener('DOMContentLoaded', init);
})();
