import { AnimatePresence, motion } from 'framer-motion';
import { X as CloseIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function Lightbox({ images = [], index, onClose, onPrev, onNext }) {
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const currentImage = images[index];

  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrev();
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNext();
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function handleTouchStart(event) {
    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;
  }

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return;

    const dx = event.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(event.changedTouches[0].clientY - touchStartY.current);

    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
      if (dx < 0) onNext();
      else onPrev();
    }

    touchStartX.current = null;
    touchStartY.current = null;
  }

  if (!currentImage) return null;

  const src = typeof currentImage === 'string' ? currentImage : currentImage.src;
  const alt = typeof currentImage === 'object'
    ? (currentImage.alt || `${currentImage.cat || 'Gallery'} - ${currentImage.sub || `photo ${index + 1}`}`)
    : `Gallery photo ${index + 1}`;

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: 'var(--viewport-height, 100vh)',
          minHeight: 'var(--viewport-height, 100vh)',
          zIndex: 9998,
          background: 'rgba(3, 7, 18, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          margin: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          key={`image-${index}`}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          onClick={(event) => event.stopPropagation()}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 'min(92vw, 1200px)',
            maxHeight: 'calc(var(--viewport-height, 100vh) - 140px)',
            width: 'auto',
            height: 'auto',
            overflow: 'hidden',
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              display: 'block',
              maxWidth: '100%',
              maxHeight: 'calc(var(--viewport-height, 100vh) - 160px)',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '10px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              pointerEvents: 'none',
            }}
            onLoad={(event) => {
              if (window.CSS?.supports?.('height', '100dvh')) return;
              const maxHeight = window.innerHeight - 160;
              if (event.target.naturalHeight > 0) {
                event.target.style.maxHeight = `${Math.max(maxHeight, 260)}px`;
              }
            }}
            draggable={false}
          />
        </motion.div>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          aria-label="Close image viewer"
          title="Close"
          style={{
            position: 'fixed',
            top: 'max(0.875rem, env(safe-area-inset-top, 0.875rem))',
            right: 'max(0.875rem, env(safe-area-inset-right, 0.875rem))',
            zIndex: 10000,
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'rgba(8,13,24,0.78)',
            border: '1px solid rgba(255,255,255,0.34)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 14px 36px rgba(0,0,0,0.42)',
            transition: 'background 0.18s, border-color 0.18s, transform 0.18s',
            lineHeight: 1,
            padding: 0,
            touchAction: 'manipulation',
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = 'rgba(255,255,255,0.18)';
            event.currentTarget.style.borderColor = 'rgba(255,255,255,0.48)';
            event.currentTarget.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = 'rgba(8,13,24,0.78)';
            event.currentTarget.style.borderColor = 'rgba(255,255,255,0.34)';
            event.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <CloseIcon size={24} strokeWidth={2.6} aria-hidden="true" />
        </button>

        {images.length > 1 ? (
          <button
            onClick={(event) => {
              event.stopPropagation();
              onPrev();
            }}
            aria-label="Previous image"
            style={{
              position: 'fixed',
              left: 'max(0.75rem, env(safe-area-inset-left, 0.75rem))',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 9999,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: 'white',
              fontSize: '1.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              transition: 'background 0.18s',
              padding: 0,
              lineHeight: 1,
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = 'rgba(255,255,255,0.22)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = 'rgba(255,255,255,0.10)';
            }}
          >
            {'\u2039'}
          </button>
        ) : null}

        {images.length > 1 ? (
          <button
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
            aria-label="Next image"
            style={{
              position: 'fixed',
              right: 'max(0.75rem, env(safe-area-inset-right, 0.75rem))',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 9999,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: 'white',
              fontSize: '1.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              transition: 'background 0.18s',
              padding: 0,
              lineHeight: 1,
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = 'rgba(255,255,255,0.22)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = 'rgba(255,255,255,0.10)';
            }}
          >
            {'\u203a'}
          </button>
        ) : null}

        <div
          onClick={(event) => event.stopPropagation()}
          style={{
            position: 'fixed',
            bottom: 'max(1.25rem, env(safe-area-inset-bottom, 1.25rem))',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '0.35rem 1.1rem',
            borderRadius: '9999px',
            color: 'rgba(255,255,255,0.72)',
            fontSize: '0.8rem',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {index + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
