import { useEffect, useMemo, useState } from 'react';
import { GalleryFolders } from '../components/gallery/GalleryFolders';
import { GalleryMasonry } from '../components/gallery/GalleryMasonry';
import { Lightbox } from '../components/gallery/Lightbox';
import { SEO } from '../components/seo/SEO';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SplitText } from '../components/ui/SplitText';
import { getFolderImages } from '../data/gallery';

function resetGalleryViewport() {
  const reset = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.getElementById('scroll-root')?.scrollTo?.({ top: 0, left: 0, behavior: 'auto' });
  };

  reset();
  window.requestAnimationFrame(reset);
}

export function Gallery() {
  const [view, setView] = useState('folders');
  const [activeFolder, setActiveFolder] = useState(null);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const [lbImages, setLbImages] = useState([]);

  const images = useMemo(() => (activeFolder ? getFolderImages(activeFolder) : []), [activeFolder]);

  const openFolder = (folder) => {
    resetGalleryViewport();
    setActiveFolder(folder);
    setView('grid');
    window.setTimeout(resetGalleryViewport, 0);
  };

  const openLightbox = (index) => {
    resetGalleryViewport();
    setLbImages(images);
    setLbIndex(index);
    setLbOpen(true);
  };

  const closeLightbox = () => setLbOpen(false);

  const showPreviousImage = () => {
    if (!lbImages.length) return;
    setLbIndex((value) => (value - 1 + lbImages.length) % lbImages.length);
  };

  const showNextImage = () => {
    if (!lbImages.length) return;
    setLbIndex((value) => (value + 1) % lbImages.length);
  };

  const backToFolders = () => {
    resetGalleryViewport();
    setView('folders');
    setActiveFolder(null);
    setLbOpen(false);
    window.setTimeout(resetGalleryViewport, 0);
  };

  useEffect(() => {
    if (lbOpen) {
      document.body.classList.add('lightbox-open');
    } else {
      document.body.classList.remove('lightbox-open');
    }

    return () => document.body.classList.remove('lightbox-open');
  }, [lbOpen]);

  return (
    <>
      <SEO
        title="Media"
        description="Photo gallery and media archive from Barkha Manral's Internet governance forums, community workshops, and global engagements."
        path="/media"
      />
      <div className="page-hero">
        <div className="page-hero-inner">
          <Eyebrow className="u-justify-center">Visual Chronicle</Eyebrow>
          <h1 className="heading-xl">
            <SplitText text="Photo Gallery" />
          </h1>
          <p className="subtext u-subtext-center">
            A visual journey through global engagements - ICANN stages, youth forums, community
            workshops, and more.
          </p>
        </div>
      </div>

      <section className="section gallery-page">
        <div className="container">
          <div className="gallery-orbit-head">
            <div>
              <Eyebrow>Archive</Eyebrow>
              <h2 className="section-h2 heading-md">{view === 'folders' ? 'Choose a Collection' : activeFolder}</h2>
            </div>
            <div className="gallery-meta-pill" aria-live="polite">
              {view === 'folders' ? '9 collections / 39 images' : `${images.length} images`}
            </div>
          </div>

          <div className="gallery-surface">
            {view === 'grid' ? (
              <div className="gallery-crumb">
                <button className="crumb-link" type="button" onClick={backToFolders}>
                  Gallery
                </button>
                <span className="crumb-separator">/</span>
                <span className="crumb-current">{activeFolder}</span>
              </div>
            ) : null}

            {view === 'folders' ? (
              <GalleryFolders onOpen={openFolder} />
            ) : (
              <GalleryMasonry images={images} onOpen={openLightbox} />
            )}
          </div>
        </div>
      </section>

      {lbOpen ? (
        <Lightbox
          images={lbImages}
          index={lbIndex}
          onClose={closeLightbox}
          onPrev={showPreviousImage}
          onNext={showNextImage}
        />
      ) : null}
    </>
  );
}
