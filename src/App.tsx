import { useEffect, useState } from 'react'
import './App.css'
import { contentByTab, navigationTabs } from './data/content'
import type { FriendsTabContent, StandardTabContent, TabId } from './types'

function isFriendsContent(content: StandardTabContent | FriendsTabContent): content is FriendsTabContent {
  return content.id === 'friends'
}

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [activeSection, setActiveSection] = useState(contentByTab.home.markers[0].id)
  const content = contentByTab[activeTab]

  useEffect(() => {
    const sections = content.markers
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
  }, [activeTab, content.markers])

  const handleTabChange = (tab: TabId): void => {
    setActiveTab(tab)
    setActiveSection(contentByTab[tab].markers[0].id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

      <main className="page-grid">
        <div className="layout-spacer" aria-hidden="true" />
        <section className="main-column" aria-live="polite">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p className="summary">{content.summary}</p>
          <div className="content-list">
            {isFriendsContent(content)
              ? content.friends.map((friend) => (
                <article className="content-section friend-entry" id={friend.id} key={friend.id}>
                  <h2>{friend.name}</h2>
                  <a href={friend.url} rel="noreferrer" target="_blank">↳ {friend.url}</a>
                  <p>↳ {friend.reason}</p>
                </article>
              ))
              : content.sections.map((section) => (
                <article className="content-section" id={section.id} key={section.id}>
                  <p className="section-label">{section.title}</p>
                  <p>{section.body}</p>
                </article>
              ))}
          </div>
        </section>

        <aside className="section-index" aria-label="Section index">
          <p className="index-heading">Index</p>
          {content.markers.map((marker) => (
            <a className={activeSection === marker.id ? 'index-link index-link-active' : 'index-link'} href={`#${marker.id}`} key={marker.id} onClick={() => setActiveSection(marker.id)}>
              {marker.label}
            </a>
          ))}
        </aside>
      </main>
    </div>
  )
}

export { App }
export default App
