import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function FadeIn({ children, delay = 0, className = '', direction = 'up', blur = true }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8% 0px' });

  const variants = {
    up: {
      hidden: { opacity: 0, y: 26, filter: blur ? 'blur(12px)' : 'blur(0px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    },
    left: {
      hidden: { opacity: 0, x: -24, filter: blur ? 'blur(8px)' : 'blur(0px)' },
      visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
    },
    right: {
      hidden: { opacity: 0, x: 24, filter: blur ? 'blur(8px)' : 'blur(0px)' },
      visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.94, filter: blur ? 'blur(10px)' : 'blur(0px)' },
      visible: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants[direction] || variants.up}
      transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
