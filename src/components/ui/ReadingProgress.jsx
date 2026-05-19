import { useScroll, useSpring, motion } from 'framer-motion';

export function ReadingProgress({ articleRef }) {
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ['start 74px', 'end end'],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: '0% 50%',
        position: 'fixed',
        top: '74px',
        left: 0,
        width: '100%',
        height: '3px',
        background: 'linear-gradient(90deg, var(--sky-400), var(--teal-500))',
        zIndex: 999,
        pointerEvents: 'none',
      }}
    />
  );
}
