import { useEffect } from 'react'
import type { Article } from '../types'
import { ArticleSections } from './ArticleSections'

export interface ArticleModalProps {
  article: Article
  index: number
  onClose: () => void
}

export function ArticleModal({ article, index, onClose }: ArticleModalProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const label = `${String(index + 1).padStart(2, '0')} // ${article.id.replace(/-/g, ' ')}`

  return (
    <div aria-label={article.title} aria-modal="true" className="article-modal" onClick={onClose} role="dialog">
      <div className="article-modal-panel" onClick={(event) => event.stopPropagation()}>
        <div className="article-modal-head">
          <div>
            <p className="section-label">{label}</p>
            <h2 className="article-modal-title">{article.title}</h2>
            <p className="article-modal-summary">{article.summary}</p>
            {article.updated && <p className="article-modal-updated">{`updated ${article.updated}`}</p>}
          </div>
          <button aria-label="Close article" className="article-modal-close" onClick={onClose} type="button">×</button>
        </div>
        <nav aria-label="Article sections" className="article-modal-index">
          {article.sections.map((section) => (
            <button
              className="article-modal-index-link"
              key={section.id}
              onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              type="button"
            >
              {section.title}
            </button>
          ))}
        </nav>
        <div className="article-modal-body">
          <ArticleSections sections={article.sections} />
        </div>
      </div>
    </div>
  )
}
