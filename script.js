/* ===========================
   SwiftEats — script.js
   =========================== */

// Init Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  // ---- Loader ----
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
    }, 800);
  });

  // ---- Navbar scroll ----
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    backTop.classList.toggle('show', window.scrollY > 300);
    highlightNav();
  });

  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---- Mobile hamburger ----
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    lucide.createIcons(); // re-init after DOM toggle
  });

  // ---- Smooth scroll nav ----
  document.querySelectorAll('a.nav-link, a.footer-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          navLinks.classList.remove('open');
        }
      }
    });
  });

  // ---- Active nav highlight ----
  function highlightNav() {
    const sections = ['home', 'menu', 'how-it-works', 'faq', 'contact-page'];
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  }

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });

  // ---- Menu filter ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const dishCards = document.querySelectorAll('.dish-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      dishCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ---- Add to cart ----
  document.querySelectorAll('.dishOrder').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = btn.dataset.name;
      showToast(`✅ ${name} added to cart!`);
      const original = btn.innerHTML;
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Added!';
      btn.style.background = 'var(--orange)';
      btn.style.color = 'white';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.style.color = '';
        lucide.createIcons();
      }, 1800);
    });
  });

  // ---- Button actions ----
  document.getElementById('orderNowBtn')?.addEventListener('click', () => scrollTo('menu'));
  document.getElementById('signInBtn')?.addEventListener('click', () => showToast('🔐 Sign in for exclusive deals & offers!'));
  document.getElementById('googlePlayBtn')?.addEventListener('click', () => showToast('📲 Google Play — coming very soon!'));
  document.getElementById('appStoreBtn')?.addEventListener('click', () => showToast('🍏 App Store — coming very soon!'));
  document.getElementById('contactBtn')?.addEventListener('click', () => showToast('📧 Our team will respond within 24 hours!'));
  document.getElementById('aboutLink')?.addEventListener('click', () => showToast('⭐ SwiftEats — Fastest delivery since 2025'));
  document.getElementById('careersLink')?.addEventListener('click', () => showToast('💼 Join us! Email careers@swifteats.com'));
  document.getElementById('privacyLink')?.addEventListener('click', () => showToast('🔒 Your data is safe with SwiftEats'));
  document.getElementById('termsLink')?.addEventListener('click', () => showToast('📜 Standard terms & conditions apply'));

  // ---- Hero category tags scroll ----
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => scrollTo('menu'));
  });

  // ---- Intersection Observer for entrance animations ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .dish-card, .testi-card, .step-card, .contact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
});

// ---- Helpers ----
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}
