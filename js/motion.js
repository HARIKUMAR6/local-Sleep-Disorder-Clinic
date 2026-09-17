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
    const heroItems = document.querySelectorAll('.hero-reveal-item');
    heroItems.forEach(item => {
      if (getComputedStyle(item).opacity === '0') {
        item.style.opacity = '1';
      }
    });
  }, 1200);
});
