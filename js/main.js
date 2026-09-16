/**
 * StepWell Podiatry & Foot Care Clinic — Main Application Script
 * Theme toggle, RTL/LTR support, Mobile drawer, Modals, FAQ accordion, Tabs
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. NAVBAR SCROLL EFFECT
  // =========================================================================
  const navbar = document.getElementById('navbarWrapper');
  const handleScroll = () => {
    if (!navbar) return;
    if (window.pageYOffset > 25) {
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
    });
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('stepwell-theme', isDark ? 'dark' : 'light');
    updateThemeUI(isDark);
  };

  themeBtns.forEach(btn => {
    btn?.addEventListener('click', toggleTheme);
  });

  // Init theme
  const savedTheme = localStorage.getItem('stepwell-theme');
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
        b.style.color = isRtl ? '#2DD4BF' : '';
      }
    });
  };

  const toggleRtl = () => {
    const isRtl = document.documentElement.dir !== 'rtl';
    localStorage.setItem('stepwell-dir', isRtl ? 'rtl' : 'ltr');
    updateRtlUI(isRtl);
  };

  rtlBtns.forEach(b => b?.addEventListener('click', toggleRtl));
  if (localStorage.getItem('stepwell-dir') === 'rtl') {
    updateRtlUI(true);
  }

  // =========================================================================
  // 4. MOBILE NAVIGATION DRAWER
  // =========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const toggleIcon = mobileToggle?.querySelector('i');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      if (toggleIcon) {
        toggleIcon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
      }
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on navigation click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        if (toggleIcon) toggleIcon.className = 'fas fa-bars';
        document.body.style.overflow = '';
      });
    });
  }

  // =========================================================================
  // 5. MOBILE SUBMENU DROPDOWN
  // =========================================================================
  document.querySelectorAll('.mobile-dropdown-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const content = btn.nextElementSibling;
      if (!content) return;
      const isShowing = content.classList.toggle('show');
      const chev = btn.querySelector('.fa-chevron-down');
      if (chev) {
        chev.style.transform = isShowing ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });
  });

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
          b.classList.remove('bg-teal-600');
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
      background: #0A2540;
      color: #FFFFFF;
      padding: 14px 22px;
      border-radius: 16px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.3);
      border-left: 4px solid #2DD4BF;
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
    toast.innerHTML = `<i class="fas fa-check-circle text-teal-400 text-lg"></i><span>${message}</span>`;
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
});
