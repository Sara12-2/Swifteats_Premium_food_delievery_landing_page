/* ============================================================
   SwiftEats — Premium JavaScript v2
   Fixes: nav smooth scroll, hero image picker, rich JS effects
   ============================================================ */
'use strict';

// ============= AOS INIT =============
AOS.init({ duration: 750, once: true, offset: 70 });

// ============= LOADER =============
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (!loader) return;
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 600);
  }, 900);
});

// ============= SMOOTH SCROLL UTILITY =============
// Named differently to avoid conflict with window.scrollTo
function navScrollTo(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const navH = document.getElementById('mainNav')?.offsetHeight || 80;
  const top = el.getBoundingClientRect().top + window.pageYOffset - navH;
  window.scrollTo({ top, behavior: 'smooth' });
}

// ============= NAV LINKS — ALL anchor clicks =============
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    const target = href && href.length > 1 ? href.slice(1) : null;
    if (!target) return;
    e.preventDefault();
    navScrollTo(target);
    // Close mobile menu
    const navMenu = document.getElementById('navMenu');
    if (navMenu && navMenu.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navMenu);
      bsCollapse.hide();
    }
  });
});

// ============= NAVBAR SCROLL EFFECT =============
const mainNav = document.getElementById('mainNav');
const backTopBtn = document.getElementById('backToTop');

function onScroll() {
  const y = window.pageYOffset;
  mainNav?.classList.toggle('scrolled', y > 60);
  backTopBtn?.classList.toggle('show', y > 350);
  highlightActiveNav();
}
window.addEventListener('scroll', onScroll, { passive: true });

// ============= ACTIVE NAV HIGHLIGHT =============
function highlightActiveNav() {
  const ids = ['home', 'menu', 'how-it-works', 'testimonials', 'faq', 'contact'];
  let current = 'home';
  const offset = (mainNav?.offsetHeight || 80) + 20;
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.pageYOffset >= el.offsetTop - offset) current = id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

// ============= BACK TO TOP =============
backTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ============= TOAST SYSTEM =============
let _toastEl = null, _toastTimer = null;
function showToast(msg, duration = 2600) {
  if (!_toastEl) {
    _toastEl = document.createElement('div');
    _toastEl.className = 'se-toast';
    document.body.appendChild(_toastEl);
  }
  _toastEl.innerHTML = msg;
  _toastEl.classList.add('visible');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => _toastEl.classList.remove('visible'), duration);
}

// ============= HERO IMAGE PICKER =============
// Users can click the hero bg to change image via URL or pick from presets
const HERO_PRESETS = [
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&h=900&fit=crop', // pizza
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&h=900&fit=crop', // burger
  'https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=1600&h=900&fit=crop', // sushi
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=900&fit=crop', // food spread
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=900&fit=crop', // restaurant
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&h=900&fit=crop', // chef
];
let heroPresetIdx = 0;
const heroBg = document.querySelector('.hero-bg');

function setHeroBg(url) {
  if (!heroBg) return;
  heroBg.style.transition = 'opacity 0.6s';
  heroBg.style.opacity = '0';
  setTimeout(() => {
    heroBg.style.backgroundImage = `url('${url}')`;
    heroBg.style.opacity = '1';
  }, 600);
}

// Build image picker panel
function buildImagePicker() {
  const panel = document.createElement('div');
  panel.id = 'imagePicker';
  panel.innerHTML = `
    <div class="ip-header">
      <span><i class="fas fa-image me-2"></i>Change Hero Image</span>
      <button id="ipClose"><i class="fas fa-times"></i></button>
    </div>
    <div class="ip-presets">
      ${HERO_PRESETS.map((url, i) => `<div class="ip-thumb${i===0?' active':''}" data-url="${url}" data-idx="${i}" style="background-image:url('${url}')"></div>`).join('')}
    </div>
    <div class="ip-divider">— or paste your own URL —</div>
    <div class="ip-url-row">
      <input type="text" id="ipUrlInput" placeholder="https://your-image-url.jpg" />
      <button id="ipApply"><i class="fas fa-check"></i> Apply</button>
    </div>
  `;
  document.body.appendChild(panel);

  panel.querySelector('#ipClose').addEventListener('click', () => {
    panel.classList.remove('open');
  });

  panel.querySelectorAll('.ip-thumb').forEach(thumb => {
    thumb.addEventListener('click', function () {
      panel.querySelectorAll('.ip-thumb').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      heroPresetIdx = +this.dataset.idx;
      setHeroBg(this.dataset.url);
      showToast('🖼️ Hero image updated!');
    });
  });

  panel.querySelector('#ipApply').addEventListener('click', () => {
    const url = panel.querySelector('#ipUrlInput').value.trim();
    if (url) {
      setHeroBg(url);
      showToast('🖼️ Custom image applied!');
      panel.classList.remove('open');
    } else {
      showToast('⚠️ Please paste a valid image URL');
    }
  });

  return panel;
}

let pickerPanel = null;

// Hero image change button (floating pencil on hero)
const heroEditBtn = document.createElement('button');
heroEditBtn.id = 'heroEditBtn';
heroEditBtn.innerHTML = '<i class="fas fa-camera"></i><span>Change Image</span>';
heroEditBtn.title = 'Change hero image';
document.querySelector('.hero-section')?.appendChild(heroEditBtn);

heroEditBtn.addEventListener('click', () => {
  if (!pickerPanel) pickerPanel = buildImagePicker();
  pickerPanel.classList.toggle('open');
});

// Cycle hero on a subtle timer (auto-slideshow)
let heroCycleTimer = setInterval(() => {
  heroPresetIdx = (heroPresetIdx + 1) % HERO_PRESETS.length;
  setHeroBg(HERO_PRESETS[heroPresetIdx]);
  if (pickerPanel) {
    pickerPanel.querySelectorAll('.ip-thumb').forEach((t, i) => t.classList.toggle('active', i === heroPresetIdx));
  }
}, 7000);

// Stop auto-cycle if user manually picks
document.addEventListener('click', e => {
  if (e.target.closest('.ip-thumb') || e.target.closest('#ipApply')) {
    clearInterval(heroCycleTimer);
  }
});

// ============= CART STATE =============
const cart = [];
const PRICES = {
  'Margherita Pizza': 12.99,
  'Pepperoni Feast': 14.49,
  'Smash Burger': 9.49,
  'California Rolls': 15.90,
  'Fettuccine Alfredo': 13.25,
  'Grilled Chicken Salad': 10.99,
  'Chocolate Lava Cake': 6.99,
  'Buffalo Wings': 11.49
};

function cartTotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function renderCart() {
  const itemsEl   = document.getElementById('cartItems');
  const emptyEl   = document.getElementById('cartEmpty');
  const footerEl  = document.getElementById('cartFooter');
  const totalEl   = document.getElementById('cartTotal');
  const countEl   = document.getElementById('cartCount');
  const fabEl     = document.getElementById('cartFab');

  const total = cart.length;
  countEl.textContent = total;
  fabEl.style.display = total > 0 ? 'block' : 'none';

  // Remove existing rows
  itemsEl.querySelectorAll('.cart-row').forEach(r => r.remove());

  if (total === 0) {
    emptyEl.style.display = 'flex';
    footerEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  footerEl.style.display = 'block';
  totalEl.textContent = `$${cartTotal().toFixed(2)}`;

  cart.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div class="cart-row-info">
        <span class="cart-row-name">${item.name}</span>
        <span class="cart-row-unit">$${item.price.toFixed(2)} each</span>
      </div>
      <div class="cart-row-controls">
        <button class="cqty-btn minus" data-idx="${idx}"><i class="fas fa-minus"></i></button>
        <span class="cqty-num">${item.qty}</span>
        <button class="cqty-btn plus" data-idx="${idx}"><i class="fas fa-plus"></i></button>
      </div>
      <span class="cart-row-price">$${(item.price * item.qty).toFixed(2)}</span>
      <button class="cart-row-del" data-idx="${idx}"><i class="fas fa-trash-alt"></i></button>
    `;
    row.querySelector('.minus').addEventListener('click', () => {
      if (cart[idx].qty > 1) cart[idx].qty--;
      else cart.splice(idx, 1);
      renderCart();
    });
    row.querySelector('.plus').addEventListener('click', () => {
      cart[idx].qty++;
      renderCart();
    });
    row.querySelector('.cart-row-del').addEventListener('click', () => {
      // Ripple delete animation
      row.style.animation = 'slideOutRight 0.3s forwards';
      setTimeout(() => { cart.splice(idx, 1); renderCart(); }, 280);
    });
    itemsEl.appendChild(row);
  });
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeCartFn() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('closeCart')?.addEventListener('click', closeCartFn);
document.getElementById('cartOverlay')?.addEventListener('click', closeCartFn);
document.getElementById('openCart')?.addEventListener('click', openCart);
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
  if (cart.length === 0) return;
  showToast('🚀 Proceeding to checkout…');
  setTimeout(() => {
    cart.length = 0;
    renderCart();
    closeCartFn();
    showToast('✅ Order placed! Estimated delivery: 28 min 🛵');
  }, 1800);
});

// ============= ADD TO CART =============
document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const name  = this.dataset.name;
    const price = PRICES[name] || 0;
    const existing = cart.find(i => i.name === name);
    if (existing) existing.qty++;
    else cart.push({ name, price, qty: 1 });
    renderCart();
    showToast(`✅ <strong>${name}</strong> added to cart!`);

    // Button animation
    this.classList.add('added');
    this.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
      this.classList.remove('added');
      this.innerHTML = '<i class="fas fa-plus"></i>';
    }, 1500);

    // Fly-to-cart animation
    flyToCart(this);
  });
});

// ============= FLY TO CART ANIMATION =============
function flyToCart(btn) {
  const fab = document.getElementById('cartFab');
  if (!fab) return;
  const from = btn.getBoundingClientRect();
  const to   = fab.getBoundingClientRect();
  const dot  = document.createElement('div');
  dot.className = 'fly-dot';
  dot.style.cssText = `left:${from.left + from.width/2}px;top:${from.top + from.height/2}px`;
  document.body.appendChild(dot);
  requestAnimationFrame(() => {
    dot.style.transform = `translate(${to.left - from.left + to.width/2 - from.width/2}px,
      ${to.top - from.top + to.height/2 - from.height/2}px) scale(0)`;
    dot.style.opacity = '0';
  });
  setTimeout(() => dot.remove(), 700);
  // Bounce cart count
  const cnt = document.getElementById('cartCount');
  cnt?.classList.remove('bounce');
  void cnt?.offsetWidth;
  cnt?.classList.add('bounce');
}

// ============= FAVOURITE TOGGLE =============
document.querySelectorAll('.dish-fav').forEach(fav => {
  fav.addEventListener('click', function (e) {
    e.stopPropagation();
    this.classList.toggle('active');
    showToast(this.classList.contains('active') ? '❤️ Saved to favourites!' : '💔 Removed from favourites');
  });
});

// ============= MENU FILTER TABS =============
document.querySelectorAll('.menu-tab').forEach(tab => {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    document.querySelectorAll('#menuGrid > [data-cat]').forEach((card, i) => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.style.transition = `opacity 0.35s ${i * 0.04}s, transform 0.35s ${i * 0.04}s`;
      card.style.opacity = show ? '1' : '0.15';
      card.style.transform = show ? 'scale(1)' : 'scale(0.96)';
      card.style.pointerEvents = show ? 'auto' : 'none';
    });
  });
});

// ============= FAQ ACCORDION =============
// Bootstrap collapse handles open/close; we animate the icon
document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(trigger => {
  trigger.addEventListener('click', function () {
    const targetId = this.getAttribute('data-bs-target');
    const target   = document.querySelector(targetId);
    const icon     = this.querySelector('.faq-icon');
    if (!target || !icon) return;
    // Slight delay lets BS toggle the class first
    setTimeout(() => {
      icon.style.transform = target.classList.contains('show') ? 'rotate(45deg)' : 'rotate(0)';
    }, 20);
  });
});

// ============= COUNTER ANIMATION (stats) =============
function animateCount(el, end, decimals = 0, suffix = '') {
  const start = 0, dur = 1400, step = 16;
  const steps = dur / step;
  let cur = 0;
  const timer = setInterval(() => {
    cur += end / steps;
    if (cur >= end) { cur = end; clearInterval(timer); }
    el.textContent = (decimals ? cur.toFixed(decimals) : Math.floor(cur)) + suffix;
  }, step);
}

// Intersection observer for stats
const statNums = document.querySelectorAll('.stat-num');
const statObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const raw = el.textContent;
    statObs.unobserve(el);
    if (raw.includes('500'))   animateCount(el, 500, 0, '+');
    else if (raw.includes('15K')) animateCount(el, 15, 0, 'K+');
    else if (raw.includes('~25')) animateCount(el, 25, 0, ' min~');
    else if (raw.includes('4.9')) animateCount(el, 4.9, 1, '★');
  });
}, { threshold: 0.5 });
statNums.forEach(el => statObs.observe(el));

// ============= PARALLAX HERO =============
window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const y = window.pageYOffset;
  heroBg.style.transform = `scale(1.08) translateY(${y * 0.18}px)`;
}, { passive: true });

// ============= BUTTON EVENTS =============
document.getElementById('signInBtn')?.addEventListener('click', () => showToast('🔐 Sign in for exclusive deals & offers!'));
document.getElementById('orderNowBtn')?.addEventListener('click', () => navScrollTo('menu'));
document.getElementById('googlePlayBtn')?.addEventListener('click', () => showToast('📲 Google Play — Coming soon!'));
document.getElementById('appStoreBtn')?.addEventListener('click', () => showToast('🍏 App Store — Coming soon!'));
document.getElementById('contactBtn')?.addEventListener('click', () => showToast('📧 Our team will respond within 2 hours!'));

document.getElementById('newsletterBtn')?.addEventListener('click', () => {
  const inp = document.querySelector('.footer-newsletter input');
  if (inp?.value.includes('@')) {
    showToast('🎉 Subscribed! Check your inbox for a welcome offer.');
    inp.value = '';
  } else {
    showToast('⚠️ Please enter a valid email address.');
  }
});

document.querySelector('.search-btn')?.addEventListener('click', () => {
  const inp = document.querySelector('.search-box input');
  const val = inp?.value.trim();
  showToast(val ? `🔍 Searching near "<strong>${val}</strong>"…` : '🍕 Browse our full menu below!');
  setTimeout(() => navScrollTo('menu'), 700);
});

// Enter key on search
document.querySelector('.search-box input')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') document.querySelector('.search-btn')?.click();
});

// ============= INIT =============
renderCart();
onScroll(); // run once for initial state
