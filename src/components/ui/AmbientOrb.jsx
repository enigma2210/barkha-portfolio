import { useEffect, useRef } from 'react';

export function AmbientOrb({ tone = 'sky' }) {
  const ref = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    let tx = window.innerWidth * 0.62;
    let ty = window.innerHeight * 0.38;
    let x = tx;
    let y = ty;
    let raf;

    const onMove = (event) => {
      tx = event.clientX;
      ty = event.clientY;
    };

    const tick = () => {
      x += (tx - x) * 0.045;
      y += (ty - y) * 0.045;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${x - 200}px, ${y - 200}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className={`ambient-orb ambient-orb-${tone}`} aria-hidden="true" />;
}
