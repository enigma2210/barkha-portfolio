import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 14, scale: 0.998, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.46, ease: [0.2, 0.8, 0.2, 1] },
  },
  exit: {
    opacity: 0, y: -8, scale: 0.998, filter: 'blur(2px)',
    transition: { duration: 0.22 },
  },
};

export function PageTransition({ children, pageKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
        className="page active"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
