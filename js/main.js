/**
 * SomnaClinic Sleep Disorder Clinic — Main Application Script
 * Theme toggle, RTL/LTR support, Desktop dropdown, Mobile drawer, Modals, FAQ accordion, Tabs
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. NAVBAR SCROLL EFFECT
  // =========================================================================
  const navbar = document.getElementById('navbarWrapper');
  const handleScroll = () => {
    if (!navbar) return;
    if (window.pageYOffset > 15) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // =========================================================================
  // 2. THEME TOGGLE (Light / Dark)
  // =========================================================================
  const themeBtns = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
  
  const updateThemeUI = (isDark) => {
    themeBtns.forEach(btn => {
      if (!btn) return;
      const moon = btn.querySelector('.fa-moon');
      const sun = btn.querySelector('.fa-sun');
      if (isDark) {
        moon?.classList.add('hidden');
        sun?.classList.remove('hidden');
      } else {
        moon?.classList.remove('hidden');
        sun?.classList.add('hidden');
      }
      btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    });
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('somna-theme', isDark ? 'dark' : 'light');
    updateThemeUI(isDark);
  };

  themeBtns.forEach(btn => {
    btn?.addEventListener('click', toggleTheme);
  });

  // Init theme
  const savedTheme = localStorage.getItem('somna-theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    updateThemeUI(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateThemeUI(false);
  }

  // =========================================================================
  // 3. RTL / LTR TOGGLE
  // =========================================================================
  const rtlBtns = document.querySelectorAll('#rtl-toggle, #rtl-toggle-mobile');
  
  const updateRtlUI = (isRtl) => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    rtlBtns.forEach(b => {
      if (b) {
        b.classList.toggle('active', isRtl);
        b.setAttribute('aria-pressed', isRtl ? 'true' : 'false');
      }
    });
  };

  const toggleRtl = () => {
    const isRtl = document.documentElement.dir !== 'rtl';
    localStorage.setItem('somna-dir', isRtl ? 'rtl' : 'ltr');
    updateRtlUI(isRtl);
  };

  rtlBtns.forEach(b => b?.addEventListener('click', toggleRtl));
  if (localStorage.getItem('somna-dir') === 'rtl') {
    updateRtlUI(true);
  } else {
    updateRtlUI(false);
  }

  // =========================================================================
  // 4. DESKTOP HOME DROPDOWN (Click-to-toggle, accessible, escape & outside close)
  // =========================================================================
  const homeDropdownWrapper = document.getElementById('home-dropdown-wrapper');
  const homeDropdownBtn = document.getElementById('home-dropdown-btn');
  const homeDropdownMenu = document.getElementById('home-dropdown-menu');

  if (homeDropdownBtn && homeDropdownWrapper) {
    const toggleDesktopDropdown = (forceState) => {
      const isOpen = forceState !== undefined ? forceState : !homeDropdownWrapper.classList.contains('open');
      homeDropdownWrapper.classList.toggle('open', isOpen);
      homeDropdownBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      const chev = homeDropdownBtn.querySelector('.fa-chevron-down');
      if (chev) {
        chev.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    };

    homeDropdownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDesktopDropdown();
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!homeDropdownWrapper.contains(e.target)) {
        toggleDesktopDropdown(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggleDesktopDropdown(false);
      }
    });

    // Close on clicking menu links
    if (homeDropdownMenu) {
      homeDropdownMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          toggleDesktopDropdown(false);
        });
      });
    }
  }

  // =========================================================================
  // 5. MOBILE NAVIGATION DRAWER & SUBMENU
  // =========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileHomeBtn = document.getElementById('mobile-home-btn');
  const mobileHomeSubmenu = document.getElementById('mobile-home-submenu');

  const closeMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'false');
      const icon = mobileToggle.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    }
    document.body.style.overflow = '';
  };
  window.closeMobileMenu = closeMobileMenu;

  const openMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'true');
      const icon = mobileToggle.querySelector('i');
      if (icon) icon.className = 'fas fa-times';
    }
    // Mandatory rule: Home 1 and Home 2 must NOT automatically appear when mobile menu opens
    if (mobileHomeSubmenu) {
      mobileHomeSubmenu.classList.remove('show');
    }
    if (mobileHomeBtn) {
      mobileHomeBtn.setAttribute('aria-expanded', 'false');
      const chev = mobileHomeBtn.querySelector('.fa-chevron-down');
      if (chev) chev.style.transform = 'rotate(0deg)';
    }
    document.body.style.overflow = 'hidden';
  };

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when clicking links inside mobile drawer
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on backdrop click (click outside inner menu)
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Close mobile menu on resize to desktop (>= 1024px)
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Ensure menu is cleanly closed and scroll restored on bfcache restore
    window.addEventListener('pageshow', () => {
      closeMobileMenu();
    });
  }

  // Mobile Home Accordion Submenu
  if (mobileHomeBtn && mobileHomeSubmenu) {
    mobileHomeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isShowing = mobileHomeSubmenu.classList.toggle('show');
      mobileHomeBtn.setAttribute('aria-expanded', isShowing ? 'true' : 'false');
      const chev = mobileHomeBtn.querySelector('.fa-chevron-down');
      if (chev) {
        chev.style.transform = isShowing ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });
  }

  // =========================================================================
  // 6. MODAL DIALOGS
  // =========================================================================
  window.openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Close modals on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Close buttons inside modals
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // =========================================================================
  // 7. TAB SYSTEM
  // =========================================================================
  document.querySelectorAll('[data-tab-group]').forEach(group => {
    const groupName = group.getAttribute('data-tab-group');
    const buttons = group.querySelectorAll('[data-tab-target]');
    const panes = document.querySelectorAll(`[data-tab-pane-group="${groupName}"]`);

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab-target');
        
        buttons.forEach(b => {
          b.classList.remove('active');
          b.classList.remove('bg-indigo-600');
          b.classList.remove('text-white');
        });
        btn.classList.add('active');

        panes.forEach(pane => {
          if (pane.getAttribute('data-tab-pane') === target) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        });
      });
    });
  });

  // =========================================================================
  // 8. TOAST NOTIFICATION UTILITY
  // =========================================================================
  window.showToast = (message, type = 'success') => {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.style.cssText = 'position:fixed;bottom:24px;left:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
      background: #0D1436;
      color: #FFFFFF;
      padding: 14px 22px;
      border-radius: 16px;
      box-shadow: 0 15px 35px rgba(13, 20, 54, 0.35);
      border-left: 4px solid #3B5BDB;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.9rem;
      font-weight: 500;
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: auto;
    `;
    toast.innerHTML = `<i class="fas fa-check-circle text-indigo-400 text-lg"></i><span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(10px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  };

  // =========================================================================
  // 9. DYNAMIC FOOTER YEAR
  // =========================================================================
  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
});
