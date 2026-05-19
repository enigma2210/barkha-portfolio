'use strict';

const Motion = (() => {
  let lenis = null;
  let gsapReady = false;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initCursorGlow() {
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    window.addEventListener('pointermove', event => {
      tx = event.clientX;
      ty = event.clientY;
    }, { passive: true });

    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      glow.style.transform = `translate3d(${x - 130}px,${y - 130}px,0)`;
      requestAnimationFrame(tick);
    };
    tick();
  }

  function initLenis() {
    if (prefersReducedMotion() || !window.Lenis) return;
    lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.05,
      smoothWheel: true
    });

    const raf = time => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  function initMagneticButtons(root = document) {
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;
    root.querySelectorAll('.btn,.gal-folder,.contact-link').forEach(el => {
      if (el.dataset.magneticReady) return;
      el.dataset.magneticReady = 'true';
      el.classList.add('magnetic');

      el.addEventListener('pointermove', event => {
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
        el.style.transform = `translate3d(${x}px,${y}px,0)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  function initGsap() {
    gsapReady = Boolean(window.gsap);
    if (!gsapReady || prefersReducedMotion()) return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    gsap.set('.hero-badge,.hero-name,.hero-deva,.hero-quote,.hero-bio,.hero-pills,.hero-ctas', {
      y: 28,
      autoAlpha: 0
    });
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to('.hero-badge', { y: 0, autoAlpha: 1, duration: .8 })
      .to('.hero-name', { y: 0, autoAlpha: 1, duration: 1.05 }, '-=.45')
      .to('.hero-deva,.hero-quote,.hero-bio,.hero-pills,.hero-ctas', {
        y: 0,
        autoAlpha: 1,
        duration: .85,
        stagger: .08
      }, '-=.55')
      .fromTo('.hero-main-image', { scale: 1.08, xPercent: 3 }, { scale: 1.02, xPercent: 0, duration: 1.6 }, 0);

    if (window.ScrollTrigger) {
      gsap.utils.toArray('.section,.affil-band,.page-hero,.footer').forEach(section => {
        gsap.fromTo(section,
          { y: 36, autoAlpha: .82 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 82%' }
          }
        );
      });

      gsap.to('.hero-main-image', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to('.hero-blob-1', {
        yPercent: -14,
        xPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to('.hero-blob-2', {
        yPercent: 18,
        xPercent: -5,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.utils.toArray('.about-img-frame img,.folder-stack').forEach(item => {
        gsap.to(item, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
    }
  }

  function refresh() {
    initMagneticButtons();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  function scrollToTop(options = {}) {
    const immediate = options.immediate !== false;
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    if (lenis) {
      lenis.scrollTo(0, { immediate, force: true });
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    requestAnimationFrame(() => {
      root.style.scrollBehavior = previousScrollBehavior;
    });
  }

  function stopScroll() {
    if (lenis) lenis.stop();
  }

  function startScroll() {
    if (lenis) lenis.start();
  }

  function init() {
    initCursorGlow();
    initLenis();
    initMagneticButtons();
    initGsap();
  }

  return { init, refresh, scrollToTop, stopScroll, startScroll };
})();

window.Motion = Motion;
window.addEventListener('load', Motion.init);
