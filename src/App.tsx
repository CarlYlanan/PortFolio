import { useEffect, useState } from 'react'
import './App.css'
import { ArticlePage } from './articles/ArticlePage'
import { ArticleSections } from './articles/ArticleSections'
import { contentByTab, navigationTabs } from './data/content'
import { navigate, useRoute } from './router'
import type { ArticlesTabContent, SectionMarker, SocialTabContent, StandardTabContent, TabContent, TabId } from './types'

function isArticlesContent(content: TabContent): content is ArticlesTabContent {
  return content.id === 'larper'
}

function isSocialContent(content: TabContent): content is SocialTabContent {
  return content.id === 'social'
}

// Home is always a StandardTabContent at runtime; narrow it for init.
const homeContent = contentByTab.home as StandardTabContent
const articlesContent = contentByTab.larper as ArticlesTabContent
const EMPTY_MARKERS: SectionMarker[] = []

function App() {
  const route = useRoute()
  const [sectionState, setSectionState] = useState<{ tab: TabId; id: string }>({ tab: 'home', id: homeContent.markers[0].id })
  const activeTab: TabId = route.kind === 'article' ? 'larper' : route.tab
  const content = contentByTab[activeTab]
  const firstMarkerId = 'markers' in content && content.markers.length > 0 ? content.markers[0].id : ''
  const activeSection = sectionState.tab === activeTab ? sectionState.id : firstMarkerId
  const article = route.kind === 'article'
    ? articlesContent.articles.find((entry) => entry.id === route.articleId) ?? null
    : null
  const articleIndex = article ? articlesContent.articles.indexOf(article) : 0
  const routeKey = route.kind === 'article' ? `article-${route.articleId}` : `tab-${route.tab}`
  const observedMarkers: SectionMarker[] = article !== null || isArticlesContent(content) ? EMPTY_MARKERS : content.markers

  useEffect(() => {
    const sections = observedMarkers
      .map((marker) => document.getElementById(marker.id))
      .filter((section): section is HTMLElement => section !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setSectionState({ tab: activeTab, id: visible.target.id })
      },
      { rootMargin: '-18% 0px -65% 0px', threshold: 0 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [activeTab, observedMarkers])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [route])

  return (
    <div className="site-shell">
      <header className="site-header">
        <nav className="navigation" aria-label="Primary navigation">
          {navigationTabs.map((tab) => (
            <button className={activeTab === tab.id ? 'nav-tab nav-tab-active' : 'nav-tab'} key={tab.id} onClick={() => navigate({ kind: 'tab', tab: tab.id })} type="button">
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="page-grid page-blink" key={routeKey}>
        <div className="layout-spacer" aria-hidden="true" />
        <section className="main-column" aria-live="polite">
          {article
            ? (
              <ArticlePage
                article={article}
                index={articleIndex}
                onBack={() => navigate({ kind: 'tab', tab: 'larper' })}
              />
            )
            : (
              <>
                <p className="eyebrow">{content.eyebrow}</p>
                <h1>{content.title}</h1>
                <p className="summary">{content.summary}</p>
                <div className="content-list">
                  {isArticlesContent(content)
                    ? content.articles.map((entry, index) => (
                      <button className="content-section article-card" key={entry.id} onClick={() => navigate({ kind: 'article', articleId: entry.id })} type="button">
                        <p className="section-label">{`${String(index + 1).padStart(2, '0')} // ${entry.id.replace(/-/g, ' ')}`}</p>
                        <span className="article-card-title">{entry.title}</span>
                        <span className="article-card-summary">{entry.summary}</span>
                        <span className="article-card-meta">{`${entry.sections.length} sections${entry.updated ? ` · updated ${entry.updated}` : ''}`}</span>
                      </button>
                    ))
                    : isSocialContent(content)
                    ? (
                      <>
                        {content.socials.map((entry) => (
                          <article className="content-section friend-entry" id={entry.id} key={entry.id}>
                            <h2>{entry.name}</h2>
                            {entry.url && (
                              <a href={entry.url} rel="noreferrer" target="_blank">↳ {entry.url}</a>
                            )}
                            {entry.links?.map((link) => (
                              <a href={link.url} key={link.url} rel="noreferrer" target="_blank">↳ {link.title}</a>
                            ))}
                            {entry.body && entry.body.trim() !== '' && (
                              <p>{entry.body}</p>
                            )}
                          </article>
                        ))}
                      </>
                    )
                      : <ArticleSections sections={content.sections} />}
                </div>
              </>
            )}
        </section>

        <aside className="section-index" aria-label="Section index">
          <p className="index-heading">Index</p>
          {article
            ? article.sections.map((section) => (
              <button className="index-link index-link-button" key={section.id} onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })} type="button">
                {section.title}
              </button>
            ))
            : isArticlesContent(content)
            ? content.articles.map((entry, index) => (
              <button className="index-link index-link-button" key={entry.id} onClick={() => navigate({ kind: 'article', articleId: entry.id })} type="button">
                {`${String(index + 1).padStart(2, '0')} // ${entry.id.replace(/-/g, ' ')}`}
              </button>
            ))
            : content.markers.map((marker) => (
              <button
                className={activeSection === marker.id ? 'index-link index-link-button index-link-active' : 'index-link index-link-button'}
                key={marker.id}
                onClick={() => {
                  setSectionState({ tab: activeTab, id: marker.id })
                  document.getElementById(marker.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                type="button"
              >
                {marker.label}
              </button>
            ))}
        </aside>
      </main>
    </div>
  )
}

export { App }
export default App
