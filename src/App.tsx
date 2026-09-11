import { useEffect, useState } from 'react'
import './App.css'
import { ArticleModal } from './articles/ArticleModal'
import { ArticleSections } from './articles/ArticleSections'
import { contentByTab, navigationTabs } from './data/content'
import { MreowCarousel } from './mreow/mreow'
import type { ArticlesTabContent, SectionMarker, SocialTabContent, StandardTabContent, TabContent, TabId } from './types'

function isArticlesContent(content: TabContent): content is ArticlesTabContent {
  return content.id === 'larper'
}

function isSocialContent(content: TabContent): content is SocialTabContent {
  return content.id === 'social'
}

// Home is always a StandardTabContent at runtime; narrow it for init.
const homeContent = contentByTab.home as StandardTabContent
const EMPTY_MARKERS: SectionMarker[] = []

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [activeSection, setActiveSection] = useState(homeContent.markers[0].id)
  const [pageChangeCount, setPageChangeCount] = useState(0)
  const [openArticleId, setOpenArticleId] = useState<string | null>(null)
  const content = contentByTab[activeTab]
  const observedMarkers: SectionMarker[] = isArticlesContent(content) ? EMPTY_MARKERS : content.markers

  useEffect(() => {
    const sections = observedMarkers
      .map((marker) => document.getElementById(marker.id))
      .filter((section): section is HTMLElement => section !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-18% 0px -65% 0px', threshold: 0 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [activeTab, observedMarkers])

  const handleTabChange = (tab: TabId): void => {
    setActiveTab(tab)
    const next = contentByTab[tab]
    setActiveSection('markers' in next && next.markers.length > 0 ? next.markers[0].id : '')
    setOpenArticleId(null)
    setPageChangeCount((count) => count + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openArticle = isArticlesContent(content)
    ? content.articles.find((entry) => entry.id === openArticleId) ?? null
    : null
  const openArticleIndex = openArticle !== null && isArticlesContent(content)
    ? content.articles.indexOf(openArticle)
    : 0

  return (
    <div className="site-shell">
      <header className="site-header">
        <nav className="navigation" aria-label="Primary navigation">
          {navigationTabs.map((tab) => (
            <button className={activeTab === tab.id ? 'nav-tab nav-tab-active' : 'nav-tab'} key={tab.id} onClick={() => handleTabChange(tab.id)} type="button">
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="page-grid page-blink" key={`page-${pageChangeCount}`}>
        <div className="layout-spacer" aria-hidden="true" />
        <section className="main-column" aria-live="polite">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p className="summary">{content.summary}</p>
          <div className="content-list">
            {isArticlesContent(content)
              ? content.articles.map((article, index) => (
                <button className="content-section article-card" key={article.id} onClick={() => setOpenArticleId(article.id)} type="button">
                  <p className="section-label">{`${String(index + 1).padStart(2, '0')} // ${article.id.replace(/-/g, ' ')}`}</p>
                  <span className="article-card-title">{article.title}</span>
                  <span className="article-card-summary">{article.summary}</span>
                  <span className="article-card-meta">{`${article.sections.length} sections${article.updated ? ` · updated ${article.updated}` : ''}`}</span>
                </button>
              ))
              : isSocialContent(content)
              ? (
                <>
                  {content.instagram && content.instagram.handle !== '' && (
                    <article className="content-section instagram-entry" id={content.instagram.id} key={content.instagram.id}>
                      {content.instagram.posts.length > 0 && (
                        <MreowCarousel items={content.instagram.posts} mediaFolder="/media/social/instagram" sortOrder="desc" title="Instagram" visibleBoxes={5} />
                      )}
                    </article>
                  )}
                  {content.socials.map((friend) => (
                    <article className="content-section friend-entry" id={friend.id} key={friend.id}>
                      <h2>{friend.name}</h2>
                      <a href={friend.url} rel="noreferrer" target="_blank">↳ {friend.url}</a>
                      <p>↳ {friend.reason}</p>
                    </article>
                  ))}
                </>
              )
                : <ArticleSections sections={content.sections} />}
          </div>
        </section>

        <aside className="section-index" aria-label="Section index">
          <p className="index-heading">Index</p>
          {isArticlesContent(content)
            ? content.articles.map((article, index) => (
              <button className="index-link index-link-button" key={article.id} onClick={() => setOpenArticleId(article.id)} type="button">
                {`${String(index + 1).padStart(2, '0')} // ${article.id.replace(/-/g, ' ')}`}
              </button>
            ))
            : content.markers.map((marker) => (
              <a className={activeSection === marker.id ? 'index-link index-link-active' : 'index-link'} href={`#${marker.id}`} key={marker.id} onClick={() => setActiveSection(marker.id)}>
                {marker.label}
              </a>
            ))}
        </aside>
      </main>

      {openArticle && (
        <ArticleModal article={openArticle} index={openArticleIndex} onClose={() => setOpenArticleId(null)} />
      )}
    </div>
  )
}

export { App }
export default App
