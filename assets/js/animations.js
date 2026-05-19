/* --- FADE IN OBSERVER --- */
function initFade() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fi:not(.vis)').forEach(el => obs.observe(el));
}
