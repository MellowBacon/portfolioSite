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

export default function VideoBlock({ id, params, title }) {
  return (
    <IframeWrap>
      <iframe
        src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0${params ? '&' + params : ''}`}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        title={title}
      />
    </IframeWrap>
  )
}
