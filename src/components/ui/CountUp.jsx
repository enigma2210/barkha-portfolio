import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export function CountUp({ target, suffix = '', duration = 1800 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return undefined;

    const startTime = performance.now();
    let raf;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - 2 ** (-10 * t);
    }

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOutExpo(progress) * target);
      setCount(value);

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}
