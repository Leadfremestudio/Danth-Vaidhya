/**
 * Danth Vaidhya - Responsive Nav Menu Scroll Lock
 * Prevents background website scrolling when the mobile navbar drawer is open.
 */
(function () {
  'use strict';

  function initNavScrollLock() {
    var navWrap = document.querySelector('.navbar_wrap');
    var navBtn = document.querySelector('.w-nav-button');
    var navMenu = document.querySelector('.navbar_menu');
    if (!navBtn) return;

    var isLocked = false;

    function lockScroll() {
      if (isLocked) return;
      isLocked = true;
      document.documentElement.classList.add('nav-is-open');
      document.body.classList.add('nav-is-open');
      if (navWrap) navWrap.classList.add('is-nav-open');
    }

    function unlockScroll() {
      if (!isLocked) return;
      isLocked = false;
      document.documentElement.classList.remove('nav-is-open');
      document.body.classList.remove('nav-is-open');
      if (navWrap) navWrap.classList.remove('is-nav-open');
    }

    // Observe class/aria changes on .w-nav-button (Webflow toggles 'w--open')
    var observer = new MutationObserver(function () {
      var isOpen = navBtn.classList.contains('w--open') || navBtn.getAttribute('aria-expanded') === 'true';
      if (isOpen && window.innerWidth < 992) {
        lockScroll();
      } else {
        unlockScroll();
      }
    });

    observer.observe(navBtn, {
      attributes: true,
      attributeFilter: ['class', 'aria-expanded']
    });

    // Also watch .navbar_menu for webflow 'data-nav-menu-open' or 'w--open'
    if (navMenu) {
      var menuObserver = new MutationObserver(function () {
        var isOpen = navMenu.classList.contains('w--open') || navMenu.hasAttribute('data-nav-menu-open');
        if (isOpen && window.innerWidth < 992) {
          lockScroll();
        } else if (!navBtn.classList.contains('w--open')) {
          unlockScroll();
        }
      });
      menuObserver.observe(navMenu, {
        attributes: true,
        attributeFilter: ['class', 'data-nav-menu-open', 'style']
      });
    }

    // Touch event guard: cancel touchmove if not inside scrollable menu
    document.addEventListener('touchmove', function (e) {
      if (!isLocked) return;
      var inMenu = e.target.closest('.navbar_menu, .w-nav-menu');
      if (!inMenu) {
        e.preventDefault();
      }
    }, { passive: false });

    // Wheel event guard: cancel wheel if not inside scrollable menu
    document.addEventListener('wheel', function (e) {
      if (!isLocked) return;
      var inMenu = e.target.closest('.navbar_menu, .w-nav-menu');
      if (!inMenu) {
        e.preventDefault();
      }
    }, { passive: false });

    // Unlock if window resized to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 992 && isLocked) {
        unlockScroll();
      }
    });
  }

  if (document.readyState !== 'loading') {
    initNavScrollLock();
  } else {
    document.addEventListener('DOMContentLoaded', initNavScrollLock);
  }
})();
