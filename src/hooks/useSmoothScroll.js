import { useEffect } from 'react';

export function useSmoothScroll(rootRef) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;
    const enableSmoothScroll = !prefersReducedMotion && !isMobile;
    if (!enableSmoothScroll || !rootRef.current) return undefined;

    let current = window.scrollY;
    let target = window.scrollY;
    let raf;

    const onScroll = () => {
      target = window.scrollY;
    };

    const tick = () => {
      current += (target - current) * 0.1;
      const delta = target - current;
      if (rootRef.current) {
        rootRef.current.style.transform = `translate3d(0, ${delta}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    document.documentElement.classList.add('smooth-virtual');
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove('smooth-virtual');
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      if (rootRef.current) rootRef.current.style.transform = '';
    };
  }, [rootRef]);
}
