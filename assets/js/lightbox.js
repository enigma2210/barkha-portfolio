function getLightboxEls() {
  const lb = document.getElementById('lb');
  if (!lb) return {};
  return {
    lb,
    img: document.getElementById('lb-img'),
    cap: document.getElementById('lb-cap'),
    counter: document.getElementById('lb-counter')
  };
}

function preloadLightboxNeighbors() {
  if (!galFiltered.length) return;
  [-1, 1].forEach(offset => {
    const item = galFiltered[(lbIdx + offset + galFiltered.length) % galFiltered.length];
    if (!item) return;
    const image = new Image();
    image.src = item.src;
  });
}

function updateLightboxImage(direction = 0) {
  const { img, cap, counter } = getLightboxEls();
  const item = galFiltered[lbIdx];
  if (!img || !item) return;

  const caption = item.caption || item.event || 'Gallery';
  img.classList.remove('is-loaded');
  img.alt = caption;

  if (window.gsap && direction) {
    gsap.to(img, {
      autoAlpha: 0,
      x: direction > 0 ? -28 : 28,
      scale: 0.985,
      duration: 0.18,
      ease: 'power2.out',
      onComplete: () => {
        img.src = item.src;
        gsap.fromTo(img,
          { autoAlpha: 0, x: direction > 0 ? 28 : -28, scale: 0.985 },
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.34, ease: 'power3.out' }
        );
      }
    });
  } else {
    img.src = item.src;
  }

  if (cap) cap.textContent = caption;
  if (counter) counter.textContent = `${lbIdx + 1} / ${galFiltered.length}`;
  preloadLightboxNeighbors();
}

function openLb(idx) {
  if (!galFiltered.length) return;
  lbIdx = Math.max(0, Math.min(idx, galFiltered.length - 1));
  const { lb } = getLightboxEls();
  if (!lb) return;

  if (typeof resetGalleryScroll === 'function') resetGalleryScroll();
  updateLightboxImage();
  if (window.Motion && typeof Motion.stopScroll === 'function') Motion.stopScroll();
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
  document.body.classList.add('modal-open');
  document.documentElement.classList.add('lightbox-open');
  document.documentElement.classList.add('modal-open');
  lb.querySelector('[data-lightbox-close]')?.focus({ preventScroll: true });

  if (window.gsap) {
    gsap.fromTo(lb.querySelector('.lb-stage'),
      { autoAlpha: 0, y: 22, scale: 0.985 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.46, ease: 'power3.out' }
    );
  }
}

function closeLb() {
  const { lb } = getLightboxEls();
  if (!lb || !lb.classList.contains('open')) return;
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  document.body.classList.remove('modal-open');
  document.documentElement.classList.remove('lightbox-open');
  document.documentElement.classList.remove('modal-open');
  if (window.Motion && typeof Motion.startScroll === 'function') Motion.startScroll();
}

function navLb(direction) {
  const { lb } = getLightboxEls();
  if (!lb || !lb.classList.contains('open') || !galFiltered.length) return;
  lbIdx = (lbIdx + direction + galFiltered.length) % galFiltered.length;
  updateLightboxImage(direction);
}

document.addEventListener('keydown', event => {
  const { lb } = getLightboxEls();
  const isOpen = lb && lb.classList.contains('open');
  if (!isOpen) return;
  if (event.key === 'Escape') closeLb();
  if (event.key === 'ArrowRight') navLb(1);
  if (event.key === 'ArrowLeft') navLb(-1);
});

document.addEventListener('click', event => {
  const lb = event.target.closest('#lb.open');
  if (!lb) return;
  if (event.target.closest('.lb-img,.lb-close,.lb-nav')) return;
  closeLb();
});

let lbTouchStartX = 0;
let lbTouchStartY = 0;

document.addEventListener('touchstart', event => {
  const lb = event.target.closest('#lb.open');
  if (!lb || !event.changedTouches.length) return;
  lbTouchStartX = event.changedTouches[0].clientX;
  lbTouchStartY = event.changedTouches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', event => {
  const lb = event.target.closest('#lb.open');
  if (!lb || !event.changedTouches.length) return;
  const dx = event.changedTouches[0].clientX - lbTouchStartX;
  const dy = event.changedTouches[0].clientY - lbTouchStartY;
  if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.35) {
    navLb(dx < 0 ? 1 : -1);
  }
}, { passive: true });

window.openLb = openLb;
window.closeLb = closeLb;
window.navLb = navLb;
