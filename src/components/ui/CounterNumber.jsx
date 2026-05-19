import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - 2 ** (-10 * t);
}

function parseValue(value) {
  const raw = String(value);
  const match = raw.match(/([\d.]+)/);
  return {
    target: match ? Number(match[1]) : 0,
    prefix: raw.startsWith('$') ? '$' : '',
    suffix: raw.replace(/^\$?[\d.]+/, ''),
    decimals: match && match[1].includes('.') ? 1 : 0,
  };
}

export function CounterNumber({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  const [display, setDisplay] = useState('0');
  const parsed = parseValue(value);

  useEffect(() => {
    if (!inView) return undefined;

    let raf;
    const start = performance.now();
    const duration = 1800;

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = easeOutExpo(progress);
      const next = parsed.target * eased;
      setDisplay(`${parsed.prefix}${next.toFixed(parsed.decimals)}${parsed.suffix}`);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, parsed.decimals, parsed.prefix, parsed.suffix, parsed.target]);

  return <span ref={ref}>{display}</span>;
}
