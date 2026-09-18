import type { Article } from '../types'
import { ArticleSections } from './ArticleSections'

export interface ArticlePageProps {
  article: Article
  index: number
  onBack: () => void
}

export function ArticlePage({ article, index, onBack }: ArticlePageProps) {
  const label = `${String(index + 1).padStart(2, '0')} // ${article.id.replace(/-/g, ' ')}`

  return (
    <>
      <button className="article-back" onClick={onBack} type="button">← articles</button>
      <p className="eyebrow">{label}</p>
      <h1>{article.title}</h1>
      <p className="summary">{article.summary}</p>
      {article.updated && <p className="article-page-updated">{`updated ${article.updated}`}</p>}
      <nav aria-label="Article sections" className="article-page-index">
        {article.sections.map((section) => (
          <button
            className="article-page-index-link"
            key={section.id}
            onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            type="button"
          >
            {section.title}
          </button>
        ))}
      </nav>
      <div className="article-page-body">
        <ArticleSections sections={article.sections} />
      </div>
    </>
  )
}
