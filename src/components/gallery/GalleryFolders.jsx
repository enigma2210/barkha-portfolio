import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { FOLDERS, getFolderImages } from '../../data/gallery';

function FolderPreview({ src, index }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      className={`folder-preview-img ${loaded ? 'is-loaded' : ''}`}
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      style={{ '--preview-index': index }}
      onLoad={() => setLoaded(true)}
    />
  );
}

function FolderCard({ folder, index, onOpen }) {
  const ref = useRef(null);
  const images = getFolderImages(folder.name).slice(0, 4);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [index % 2 ? 6 : -6, 0, index % 2 ? -4 : 4]);

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  return (
    <motion.button
      ref={ref}
      className="gal-folder"
      style={{ '--folder-delay': `${index * 80}ms`, rotateY }}
      onClick={() => onOpen(folder.name)}
      onMouseMove={handleMove}
      aria-label={`Open ${folder.name}`}
      initial={{ opacity: 0, y: 26, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.72, delay: index * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <span className="folder-aura" />
      <span className="folder-sheen" />
      <span className="folder-stack" aria-hidden="true">
        {images.map((item, previewIndex) => (
          <FolderPreview key={item.src} src={item.src} index={previewIndex} />
        ))}
      </span>
      <span className="folder-meta">
        <span className="folder-name">{folder.name}</span>
        <span className="folder-count">
          {folder.count} images
          {folder.subfolders.length ? ` / ${folder.subfolders.join(' · ')}` : ''}
        </span>
        <span className="folder-action">Open Gallery</span>
      </span>
    </motion.button>
  );
}

export function GalleryFolders({ onOpen }) {
  return (
    <div className="gallery-folders">
      {FOLDERS.map((folder, index) => (
        <FolderCard key={folder.name} folder={folder} index={index} onOpen={onOpen} />
      ))}
    </div>
  );
}
