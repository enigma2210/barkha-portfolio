import { GalleryItem } from './GalleryItem';

export function GalleryMasonry({ images, onOpen }) {
  return (
    <div className="masonry is-open">
      {images.map((item, index) => (
        <GalleryItem key={`${item.src}-${index}`} item={item} index={index} onOpen={onOpen} />
      ))}
    </div>
  );
}
