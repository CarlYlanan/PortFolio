import { useMemo, useState } from 'react'
import type { GalleryItem } from '../types'

export interface MreowCarouselProps {
  items: GalleryItem[]
  mediaFolder?: string
  visibleBoxes?: number
  title?: string
  sortOrder?: 'asc' | 'desc'
  sortBy?: 'date' | 'name' | 'custom'
}

function fileName(item: GalleryItem) {
  const source = item.src ?? ''
  return source.split('/').pop() ?? source
}

function publicAssetUrl(mediaFolder: string, src: string) {
  const root = mediaFolder.replace(/\/+$/, '')
  const file = src.replace(/^\/+/, '')
  return `${root}/${file}`
}

function displayTitle(item: GalleryItem) {
  if (item.title && item.title.trim().length > 0) {
    return item.title
  }

  const source = item.src ?? ''
  const base = source.split('/').pop() ?? source
  return base.replace(/\.[^/.]+$/, '') || 'Untitled media'
}

export function MreowCarousel({ items, mediaFolder = '/media', title = 'Gallery', sortOrder = 'asc', sortBy = 'date' }: MreowCarouselProps) {
  const [lightbox, setLightbox] = useState<{ mediaFolder: string; items: GalleryItem[] } | null>(null)
  const [focusedImage, setFocusedImage] = useState<{ mediaFolder: string; item: GalleryItem } | null>(null)

  const sortedItems = useMemo(() => {
    if (sortBy === 'custom') {
      return items
    }

    if (sortBy === 'name') {
      return [...items].sort((a, b) => fileName(a).localeCompare(fileName(b), undefined, { numeric: true, sensitivity: 'base' }))
    }

    const factor = sortOrder === 'desc' ? -1 : 1
    return [...items].sort((a, b) => {
      return factor * (new Date(a.capturedAt ?? '').getTime() - new Date(b.capturedAt ?? '').getTime())
    })
  }, [items, sortOrder, sortBy])

  return (
    <div className="mreow-carousel">
      <div className="mreow-track">
        {sortedItems.map((item) => {
          const src = publicAssetUrl(mediaFolder, item.src)
          const caption = displayTitle(item)
          return (
            <figure className="mreow-card" key={`${caption}-${item.src}`}>
              {item.link ? (
                <a className="mreow-open mreow-open-link" href={item.link} rel="noreferrer" target="_blank">
                  <div className="mreow-frame">
                    <img className="mreow-image" alt={item.alt ?? caption} src={src} />
                  </div>
                </a>
              ) : (
                <button className="mreow-open" onClick={() => setLightbox({ mediaFolder, items: sortedItems })} type="button">
                  <div className="mreow-frame">
                    <img className="mreow-image" alt={item.alt ?? caption} src={src} />
                  </div>
                </button>
              )}
            </figure>
          )
        })}
      </div>

      {lightbox && (
        <div className="mreow-modal" onClick={() => setLightbox(null)} role="dialog">
          <div className="mreow-modal-panel" onClick={(event) => event.stopPropagation()}>
            <div className="mreow-modal-head">
              <span className="mreow-modal-title">{title}</span>
              <button className="mreow-modal-close" onClick={() => setLightbox(null)} type="button">×</button>
            </div>
            <div className="mreow-modal-grid">
              {lightbox.items.map((image) => {
                const caption = displayTitle(image)
                return (
                  <figure className="mreow-modal-card" key={`${caption}-${image.src}`}>
                    {image.link ? (
                      <a href={image.link} rel="noreferrer" target="_blank">
                        <div className="mreow-modal-frame">
                          <img className="mreow-modal-image" alt={image.alt ?? caption} src={publicAssetUrl(lightbox.mediaFolder, image.src)} />
                        </div>
                      </a>
                    ) : (
                      <button className="mreow-modal-open" onClick={() => {
                        setFocusedImage({ mediaFolder: lightbox.mediaFolder, item: image })
                        setLightbox(null)
                      }} type="button">
                        <div className="mreow-modal-frame">
                          <img className="mreow-modal-image" alt={image.alt ?? caption} src={publicAssetUrl(lightbox.mediaFolder, image.src)} />
                        </div>
                      </button>
                    )}
                  </figure>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {focusedImage && (
        <div className="mreow-focus" onClick={() => setFocusedImage(null)} role="dialog">
          <div className="mreow-focus-panel" onClick={(event) => event.stopPropagation()}>
            <div className="mreow-focus-head">
              <span className="mreow-focus-title">{title}</span>
              <button className="mreow-focus-close" onClick={() => setFocusedImage(null)} type="button">×</button>
            </div>
            <div className="mreow-focus-stage">
              <div className="mreow-focus-frame">
                <img className="mreow-focus-image" alt={focusedImage.item.alt ?? displayTitle(focusedImage.item)} src={publicAssetUrl(focusedImage.mediaFolder, focusedImage.item.src)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
