import { useState, Suspense, lazy } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import PageTransition from '../../components/PageTransition/PageTransition'
import StaggerText from '../../components/motion/StaggerText'
import Reveal from '../../components/motion/Reveal'
import Lightbox from '../../components/Lightbox/Lightbox'
import Carousel from '../../components/Carousel/Carousel'
import ProjectNav from '../../components/ProjectNav/ProjectNav'
import VideoBlock from './blocks/VideoBlock'
import { getProject, MEDIUM_LABELS } from '../../data/projects'
import styles from './Project.module.css'

// Lazy so three.js stays off the Work-index path
const ModelViewer = lazy(() => import('../../three/ModelViewer'))

function Block({ block, onZoom }) {
  switch (block.type) {
    case 'statement':
      return (
        <div className={styles.statement}>
          {block.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p>{p}</p>
            </Reveal>
          ))}
        </div>
      )

    case 'captions':
      return (
        <Reveal>
          <div className={styles.captions}>
            {block.items.map((c, i) => <span key={i}>{c}</span>)}
          </div>
        </Reveal>
      )

    case 'image':
      return (
        <Reveal>
          <figure className={styles.imageBlock}>
            <img
              src={block.src}
              alt={block.alt}
              className={block.lightbox ? styles.clickable : ''}
              onClick={block.lightbox ? () => onZoom(block.src, block.caption) : undefined}
            />
            {block.caption && <figcaption>{block.caption}</figcaption>}
          </figure>
        </Reveal>
      )

    case 'carousel':
      return (
        <Reveal>
          <div className={styles.carouselBlock}>
            {block.label && <p className={styles.blockLabel}>{block.label}</p>}
            <Carousel images={block.images} />
          </div>
        </Reveal>
      )

    case 'vimeo':
      return (
        <Reveal>
          <VideoBlock id={block.id} params={block.params} title={block.title} />
        </Reveal>
      )

    case 'gallery':
      return (
        <div className={styles.gallery}>
          {block.items.map((item, i) => (
            <Reveal key={item.full} delay={i * 0.08}>
              <figure
                className={styles.galleryItem}
                onClick={() => onZoom(item.full, item.caption)}
              >
                <img src={item.thumb} alt={item.caption} loading="lazy" />
                <figcaption>{item.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      )

    case 'modelViewer':
      return (
        <Reveal>
          <Suspense fallback={<div className={styles.viewerLoading}>Loading 3D viewer&hellip;</div>}>
            <ModelViewer models={block.models} emotions={block.emotions} />
          </Suspense>
        </Reveal>
      )

    default:
      return null
  }
}

export default function Project() {
  const { slug } = useParams()
  const project = getProject(slug)
  const [lightbox, setLightbox] = useState({ src: null, caption: null })

  if (!project) return <Navigate to="/work" replace />

  return (
    <PageTransition>
      <div className={`page ${styles.page}`}>
        <Lightbox
          src={lightbox.src}
          caption={lightbox.caption}
          onClose={() => setLightbox({ src: null, caption: null })}
        />

        <div className="container">
          <header className={styles.header}>
            <span className="section-label">{MEDIUM_LABELS[project.medium]}</span>
            <StaggerText text={project.title} className={styles.title} />
            <div className={styles.metaRow}>
              <span className={styles.year}>{project.year}</span>
              {project.meta?.map(m => (
                <span key={m.label} className={styles.metaItem}>
                  <span className={styles.metaLabel}>{m.label}</span> {m.value}
                </span>
              ))}
            </div>
          </header>

          <div className={styles.blocks}>
            {project.blocks.map((block, i) => (
              <Block
                key={i}
                block={block}
                onZoom={(src, caption) => setLightbox({ src, caption })}
              />
            ))}
          </div>
        </div>

        <ProjectNav slug={project.slug} />
      </div>
    </PageTransition>
  )
}
