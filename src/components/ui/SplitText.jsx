import { motion } from 'framer-motion';

export function SplitText({ as: Tag = 'span', text, className = '', children }) {
  const source = text ?? children ?? '';
  const chars = String(source).split('');

  return (
    <Tag className={className} style={{ perspective: '800px' }}>
      {chars.map((char, index) => (
        <motion.span
          aria-hidden="true"
          className="split-char"
          key={`${char}-${index}`}
          initial={{ opacity: 0, y: 40, rotateX: 90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1], delay: index * 0.025 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
      <span className="sr-only">{source}</span>
    </Tag>
  );
}
