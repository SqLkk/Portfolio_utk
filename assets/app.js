'use strict';

(function initPortfolio() {
  const THEME_KEY = 'uk_theme';
  const ALLOWED_IMAGE_RE = /^[a-zA-Z0-9_./-]+\.(png|jpe?g|webp|svg)$/;

  function readStoredTheme() {
    try {
      const saved = window.localStorage.getItem(THEME_KEY);
      return saved === 'dark' || saved === 'light' ? saved : 'light';
    } catch (_err) {
      return 'light';
    }
  }

  function saveTheme(theme) {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (_err) {
      // Ignore storage errors in restricted browsing contexts.
    }
  }

  function applyTheme(theme) {
    const validTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', validTheme);
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      const nextThemeLabel = validTheme === 'dark' ? 'Light' : 'Dark';
      toggleBtn.textContent = nextThemeLabel;
      toggleBtn.setAttribute('aria-label', 'Switch to ' + nextThemeLabel.toLowerCase() + ' theme');
    }
  }

  let currentTheme = readStoredTheme();
  applyTheme(currentTheme);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function handleThemeToggle() {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
      saveTheme(currentTheme);
    });
  }

  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function handleMenuToggle() {
      const isOpen = mobileNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(function attachClose(link) {
      link.addEventListener('click', function closeMenu() {
        mobileNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  function closeLightbox() {
    if (!lightbox || !lightboxImg) {
      return;
    }
    if (lightbox.open) {
      lightbox.close();
    }
    lightboxImg.removeAttribute('src');
    lightboxImg.setAttribute('alt', '');
  }

  function openLightbox(trigger) {
    if (!lightbox || !lightboxImg || !lightboxCaption) {
      return;
    }
    const src = trigger.getAttribute('data-lightbox-src') || '';
    if (!ALLOWED_IMAGE_RE.test(src)) {
      return;
    }
    const altText = trigger.getAttribute('data-lightbox-alt') || 'Application screenshot preview';
    const captionText = trigger.getAttribute('data-lightbox-caption') || altText;

    lightboxImg.setAttribute('src', src);
    lightboxImg.setAttribute('alt', altText);
    lightboxCaption.textContent = captionText;
    lightbox.showModal();
  }

  const triggers = document.querySelectorAll('[data-lightbox-src]');
  triggers.forEach(function bindTrigger(trigger) {
    trigger.addEventListener('click', function onTriggerClick() {
      openLightbox(trigger);
    });
    trigger.addEventListener('keydown', function onTriggerKeydown(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(trigger);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function onBackdropClick(event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
    lightbox.addEventListener('cancel', closeLightbox);
  }
})();
