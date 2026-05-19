import { useEffect } from 'react';

export function useCursorGlow(ref) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    if (reduce || mobile) return undefined;

    let cx = 0;
    let cy = 0;
    let tx = 0;
    let ty = 0;
    let raf;

    const onMove = (event) => {
      tx = event.clientX;
      ty = event.clientY;
    };

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${cx - 130}px, ${cy - 130}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}
