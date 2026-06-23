import styles from './ImageStack.module.css'

// Vertical editorial stack: images are laid out full-width, one above the next,
// at their natural aspect ratio. No paging, no animation to fight — you scroll.
// Each image lazy-loads as it nears the viewport; clicking opens the full-res
// version in the lightbox.
export default function ImageStack({ images, onZoom }) {
  // A slide may be a plain src string or a { thumb, full } pair — the thumb is
  // shown in-page, the full-res version opens on click.
  const slides = images.map((img) =>
    typeof img === 'string' ? { thumb: img, full: img } : img,
  )

  return (
    <div className={styles.stack}>
      {slides.map((slide, i) => (
        <figure key={i} className={styles.item}>
          <img
            src={slide.thumb}
            alt={`Image ${i + 1} of ${slides.length}`}
            loading="lazy"
            className={onZoom ? styles.clickable : ''}
            onClick={onZoom ? () => onZoom(slide.full) : undefined}
          />
        </figure>
      ))}
    </div>
  )
}
