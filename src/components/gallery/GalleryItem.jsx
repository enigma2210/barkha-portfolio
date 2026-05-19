import { motion } from 'framer-motion';
import { useState } from 'react';

export function getImageClass(index) {
  if (index === 0) return 'gal-item gal-item-hero';
  if (index === 1) return 'gal-item gal-item-tall';
  if (index === 4) return 'gal-item gal-item-wide';
  return 'gal-item';
}

export function GalleryItem({ item, index, onOpen }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.button
      className={`${getImageClass(index)} ${loaded ? 'is-loaded' : ''}`}
      style={{ '--photo-delay': `${index * 34}ms` }}
      onClick={() => onOpen(index)}
      aria-label={`Open ${item.cat} image ${index + 1}`}
      initial={{ opacity: 0, y: 22, scale: 0.985, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.66, delay: index * 0.035, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <span className="gal-shimmer" aria-hidden="true" />
      <img
        className={`gal-img ${loaded ? 'is-loaded' : ''}`}
        src={item.src}
        alt={`${item.cat} - ${item.sub}`}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
      <span className="gal-overlay">
        <span className="gal-label">{item.cat}</span>
      </span>
    </motion.button>
  );
}
