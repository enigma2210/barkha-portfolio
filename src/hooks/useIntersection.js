import { useEffect, useState } from 'react';

export function useIntersection(ref, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08, ...options },
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, options]);

  return isIntersecting;
}
