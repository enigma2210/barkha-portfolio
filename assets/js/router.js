/* --- SPA ROUTER --- */
let currentPage = 'home';
let prevPage = 'blogs';
let currentArtId = null;
let routeTransitioning = false;

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

function hardResetWindowScroll() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  } catch (error) {
    window.scrollTo(0, 0);
  }
}

function resetRouteScroll() {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';

  if (window.Motion && typeof Motion.scrollToTop === 'function') {
    Motion.scrollToTop({ immediate: true });
  }

  hardResetWindowScroll();

  requestAnimationFrame(() => {
    hardResetWindowScroll();
    root.style.scrollBehavior = previousScrollBehavior;
  });
}

function setActiveNav(page) {
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const nl = document.getElementById('nl-' + page);
  if (nl) nl.classList.add('active');
}

function revealRoute(page) {
  const nextPage = document.getElementById('page-' + page);
  if (!nextPage) {
    routeTransitioning = false;
    return;
  }

  resetRouteScroll();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active', 'route-entering', 'route-leaving'));
  nextPage.classList.add('active');
  setActiveNav(page);

  if (page === 'gallery') renderGalleryFolders();

  currentPage = page;
  resetRouteScroll();

  requestAnimationFrame(() => {
    resetRouteScroll();
    nextPage.classList.add('route-entering');
    setTimeout(() => nextPage.classList.remove('route-entering'), 480);
    setTimeout(initFade, 80);
    setTimeout(() => {
      resetRouteScroll();
      if (window.Motion) Motion.refresh();
      routeTransitioning = false;
    }, 120);
  });
}

function go(page) {
  const nextPage = document.getElementById('page-' + page);
  if (!nextPage || routeTransitioning) return false;

  if (typeof closeLb === 'function') closeLb();
  routeTransitioning = true;

  const activePage = document.querySelector('.page.active');
  if (activePage && activePage !== nextPage && window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    activePage.classList.add('route-leaving');
    gsap.to(activePage, {
      autoAlpha: 0,
      y: -10,
      duration: 0.16,
      ease: 'power2.out',
      onComplete: () => {
        gsap.set(activePage, { clearProps: 'opacity,visibility,transform' });
        revealRoute(page);
      }
    });
    return false;
  }

  revealRoute(page);
  return false;
}

window.resetRouteScroll = resetRouteScroll;
window.go = go;
