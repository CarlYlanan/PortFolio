import { useMemo, useState } from 'react'
import type { GalleryItem } from '../types'

export interface MreowCarouselProps {
  items: GalleryItem[]
  mediaFolder?: string
  visibleBoxes?: number
}

function publicAssetUrl(mediaFolder: string, src: string) {
  const root = mediaFolder.replace(/\/+$/, '')
  const file = src.replace(/^\/+/, '')
  return `${root}/${file}`
}

export function MreowCarousel({ items, mediaFolder = '/media', visibleBoxes = 5 }: MreowCarouselProps) {
  const [lightbox, setLightbox] = useState<{ mediaFolder: string; items: GalleryItem[] } | null>(null)

  const cardWidth = `calc((100% - ${(visibleBoxes - 1) * 12}px) / ${visibleBoxes})`

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      return new Date(a.capturedAt ?? '').getTime() - new Date(b.capturedAt ?? '').getTime()
    })
  }, [items])

  return (
    <div className="mreow-carousel">
      <div className="mreow-track">
        {sortedItems.map((item) => {
          const src = publicAssetUrl(mediaFolder, item.src)
          return (
            <figure className="mreow-card" key={item.title} style={{ flexBasis: cardWidth }}>
              <button className="mreow-open" onClick={() => setLightbox({ mediaFolder, items: sortedItems })} type="button">
                <div className="mreow-frame" style={{ aspectRatio: item.aspectRatio ?? '4 / 3' }}>
                  <img className="mreow-image" alt={item.alt ?? item.title} src={src} />
                </div>
                <figcaption className="mreow-caption">{item.title}</figcaption>
              </button>
            </figure>
          )
        })}
      </div>

      {lightbox && (
        <div className="mreow-modal" onClick={() => setLightbox(null)} role="dialog">
          <div className="mreow-modal-panel" onClick={(event) => event.stopPropagation()}>
            <div className="mreow-modal-head">
              <span className="mreow-modal-title">Location Gallery</span>
              <button className="mreow-modal-close" onClick={() => setLightbox(null)} type="button">×</button>
            </div>
            <div className="mreow-modal-grid">
              {lightbox.items.map((image) => (
                <figure className="mreow-modal-card" key={`${image.title}-${image.src}`}>
                  <div className="mreow-modal-frame" style={{ aspectRatio: image.aspectRatio ?? '4 / 3' }}>
                    <img className="mreow-modal-image" alt={image.alt ?? image.title} src={publicAssetUrl(lightbox.mediaFolder, image.src)} />
                  </div>
                  <figcaption className="mreow-modal-caption">{image.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
