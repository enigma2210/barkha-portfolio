import { AnimatePresence, motion } from 'framer-motion';

export function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          className="toast-live"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          role="status"
          aria-live="polite"
        >
          <span className="toast-icon">✦</span>
          <span>{toast.message}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
