import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const gradientTextStyle = {
  background: 'var(--name-gradient)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export function SplitReveal({ text, className, delay = 0, gradient = false, style }) {
  const [ready, setReady] = useState(false);
  const chars = text.split('');

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <span className={className} style={{ perspective: '800px', ...style }}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          style={{
            display: 'inline-block',
            transformOrigin: 'bottom center',
            ...(gradient ? gradientTextStyle : undefined),
          }}
          initial={{ opacity: 0, y: 40, rotateX: 90 }}
          animate={ready ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 40, rotateX: 90 }}
          transition={{
            duration: 0.55,
            ease: [0.2, 0.8, 0.2, 1],
            delay: delay + i * 0.03,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}
