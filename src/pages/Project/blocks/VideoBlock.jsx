import { useRef, useEffect } from 'react'
import styles from './VideoBlock.module.css'

// IframeWrap: overlay that disables pointer events while scrolling over the
// iframe, preventing Lenis-vs-iframe scroll jitter. Moved from VideoArt.jsx.
function IframeWrap({ children }) {
  const overlay = useRef()
  useEffect(() => {
    function restore() {
      if (overlay.current) overlay.current.style.pointerEvents = ''
    }
    window.addEventListener('mouseup', restore)
    window.addEventListener('touchend', restore)
    return () => {
      window.removeEventListener('mouseup', restore)
      window.removeEventListener('touchend', restore)
    }
  }, [])
  return (
    <div className={styles.videoWrap}>
      {children}
      <div
        ref={overlay}
        className={styles.iframeOverlay}
        onMouseDown={() => { overlay.current.style.pointerEvents = 'none' }}
        onTouchStart={() => { overlay.current.style.pointerEvents = 'none' }}
      />
    </div>
  )
}

export default function VideoBlock({ id, title }) {
  return (
    <IframeWrap>
      <iframe
        src={`https://www.youtube.com/embed/${id}?rel=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        title={title}
      />
    </IframeWrap>
  )
}
