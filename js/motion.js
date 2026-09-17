/**
 * SomnaClinic Sleep Disorder Clinic — Motion & Animation Controller
 * Coordinates IntersectionObserver scroll reveals, staggered animations,
 * counter transitions, and scroll interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =========================================================================
  // 1. SCROLL REVEAL (IntersectionObserver)
  // =========================================================================
  const reveals = document.querySelectorAll('.reveal, .reveal-fade, .reveal-scale, .reveal-left, .reveal-right');

  if (prefersReducedMotion) {
    reveals.forEach(el => el.classList.add('active'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optional: once revealed, stop observing for performance
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  }

  // =========================================================================
  // 2. AUTOMATIC STAGGER FOR GRIDS
  // =========================================================================
  if (!prefersReducedMotion) {
    document.querySelectorAll('.stagger-group').forEach(group => {
      const children = group.children;
      const baseDelay = 100; // ms
      Array.from(children).forEach((child, index) => {
        if (!child.classList.contains('delay-100') && 
            !child.classList.contains('delay-200') && 
            !child.classList.contains('delay-300') && 
            !child.classList.contains('delay-400')) {
          child.style.transitionDelay = `${(index % 6) * baseDelay}ms`;
        }
      });
    });
  }

  // =========================================================================
  // 3. STATS NUMBER COUNTER ANIMATION
  // =========================================================================
  const statElements = document.querySelectorAll('[data-counter-target]');
  
  if (statElements.length > 0) {
    const runCounter = (el) => {
      const target = parseInt(el.getAttribute('data-counter-target'), 10);
      const suffix = el.getAttribute('data-counter-suffix') || '';
      const prefix = el.getAttribute('data-counter-prefix') || '';
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing: easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = Math.floor(easeProgress * target);
        
        el.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
        }
      };

      requestAnimationFrame(updateCount);
    };

    if (prefersReducedMotion) {
      statElements.forEach(el => {
        const target = el.getAttribute('data-counter-target');
        const suffix = el.getAttribute('data-counter-suffix') || '';
        const prefix = el.getAttribute('data-counter-prefix') || '';
        el.textContent = `${prefix}${parseInt(target, 10).toLocaleString()}${suffix}`;
      });
    } else {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      statElements.forEach(el => counterObserver.observe(el));
    }
  }

  // =========================================================================
  // 4. SCROLL-TO-TOP BUTTON
  // =========================================================================
  let scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) {
    scrollBtn = document.createElement('button');
    scrollBtn.id = 'scrollTopBtn';
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollBtn);
  }

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 350) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });

  // =========================================================================
  // 5. HERO ENTRANCE FALLBACK
  // =========================================================================
  // Non-destructive fallback: only sets opacity if still unrevealed after timeout
  setTimeout(() => {
    const heroItems = document.querySelectorAll('.hero-reveal-item, .hero-reveal-badge');
    heroItems.forEach(item => {
      if (getComputedStyle(item).opacity === '0') {
        item.style.opacity = '1';
      }
    });
  }, 1200);

  // =========================================================================
  // 6. HOME 1 HERO SUBTLE MOUSE PARALLAX (Desktop only)
  // =========================================================================
  const heroSection = document.getElementById('hero');
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches && !('ontouchstart' in window);

  if (heroSection && !prefersReducedMotion && isDesktop) {
    const heroImg = heroSection.querySelector('.hero-panoramic-frame');
    const heroBadge = heroSection.querySelector('.hero-overlapping-badge');
    const heroBg = heroSection.querySelector('.hero-atmospheric-bg');

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId = null;
    let isMoving = false;

    const onHeroMouseMove = (e) => {
      const rect = heroSection.getBoundingClientRect();
      // Normalize from -0.5 to 0.5
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = (e.clientY - rect.top) / rect.height - 0.5;
      if (!isMoving) {
        isMoving = true;
        updateParallax();
      }
    };

    const updateParallax = () => {
      if (!isMoving) return;
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      // Image: max 4px
      if (heroImg) {
        heroImg.style.transform = `translate3d(${(currentX * 8).toFixed(2)}px, ${(currentY * 8).toFixed(2)}px, 0)`;
      }
      // Badge: max 6px
      if (heroBadge) {
        heroBadge.style.setProperty('--badge-offset-x', `${(currentX * 12).toFixed(2)}px`);
        heroBadge.style.setProperty('--badge-offset-y', `${(currentY * 12).toFixed(2)}px`);
      }
      // Background: max 2px
      if (heroBg) {
        heroBg.style.transform = `translate3d(${(currentX * 4).toFixed(2)}px, ${(currentY * 4).toFixed(2)}px, 0)`;
      }

      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        rafId = requestAnimationFrame(updateParallax);
      } else {
        isMoving = false;
      }
    };

    heroSection.addEventListener('mousemove', onHeroMouseMove, { passive: true });
    heroSection.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      if (!isMoving) {
        isMoving = true;
        updateParallax();
      }
    });
  }

  // =========================================================================
  // 7. HOME 1 HERO SUBTLE SCROLL INTERACTION
  // =========================================================================
  if (heroSection && !prefersReducedMotion) {
    const heroImgEl = heroSection.querySelector('.hero-panoramic-img');
    let ticking = false;

    const onHeroScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.pageYOffset;
          if (scrollY <= 650 && heroImgEl) {
            const factor = Math.min(scrollY / 650, 1);
            const opacity = 1 - factor * 0.04; // 1 -> 0.96
            const scale = 1 + factor * 0.015; // 1 -> 1.015
            heroImgEl.style.opacity = opacity.toFixed(3);
            heroImgEl.style.transform = `scale(${scale.toFixed(4)})`;
          } else if (heroImgEl && scrollY > 650) {
            heroImgEl.style.opacity = '0.96';
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onHeroScroll, { passive: true });
  }

  // =========================================================================
  // 8. HOME 1 — CLINICAL SLEEP HEALTH CARDS SEQUENTIAL ENTRANCE OBSERVER
  // =========================================================================
  const sleepCards = document.querySelectorAll('.sleep-indication-card');
  if (sleepCards.length > 0) {
    if (prefersReducedMotion) {
      sleepCards.forEach(card => card.classList.add('is-revealed'));
    } else {
      const sleepCardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            sleepCards.forEach(card => card.classList.add('is-revealed'));
            observer.disconnect();
          }
        });
      }, {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      const introSection = document.getElementById('sleep-intro') || sleepCards[0];
      sleepCardObserver.observe(introSection);
    }
  }

  // =========================================================================
  // 9. HOME 1 — EDITORIAL CLINICAL NAVIGATOR CONTROLLER
  // =========================================================================
  const scopeRows = document.querySelectorAll('.scope-nav-row');
  const scopeImgs = document.querySelectorAll('.scope-stage-img');
  const scopeBadgeLabel = document.getElementById('scope-badge-label');

  if (scopeRows.length > 0 && scopeImgs.length > 0) {
    const activateScope = (targetIndex) => {
      scopeRows.forEach(row => {
        const isMatch = row.getAttribute('data-scope-target') === String(targetIndex);
        row.classList.toggle('active', isMatch);
        row.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        row.setAttribute('tabindex', isMatch ? '0' : '-1');
        if (isMatch && scopeBadgeLabel) {
          const label = row.getAttribute('data-scope-label');
          if (label) scopeBadgeLabel.textContent = label;
        }
      });

      scopeImgs.forEach(img => {
        const isMatch = img.getAttribute('data-scope-img') === String(targetIndex);
        img.classList.toggle('active', isMatch);
      });
    };

    scopeRows.forEach((row, idx) => {
      // Hover activation on desktop
      row.addEventListener('mouseenter', () => {
        const target = row.getAttribute('data-scope-target');
        activateScope(target);
      });

      // Click / Tap activation (desktop + mobile)
      row.addEventListener('click', (e) => {
        e.preventDefault();
        const target = row.getAttribute('data-scope-target');
        activateScope(target);
      });

      // Keyboard accessibility (arrow up/down/left/right, Home, End)
      row.addEventListener('keydown', (e) => {
        let newIdx = -1;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          newIdx = (idx + 1) % scopeRows.length;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          newIdx = (idx - 1 + scopeRows.length) % scopeRows.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          newIdx = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          newIdx = scopeRows.length - 1;
        }

        if (newIdx !== -1) {
          scopeRows[newIdx].focus();
          const target = scopeRows[newIdx].getAttribute('data-scope-target');
          activateScope(target);
        }
      });
    });
  }
});
