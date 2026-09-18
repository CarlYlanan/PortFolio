import { useEffect, useState } from 'react'
import { contentByTab } from './data/content'
import type { TabId } from './types'

export type Route = { kind: 'tab'; tab: TabId } | { kind: 'article'; articleId: string }

const TAB_SLUGS: Record<TabId, string> = {
  home: 'home',
  gallery: 'gallery',
  larper: 'articles',
  setup: 'setup',
  social: 'social',
}

const SLUG_TO_TAB = Object.fromEntries(
  Object.entries(TAB_SLUGS).map(([tab, slug]) => [slug, tab as TabId]),
) as Record<string, TabId>

const HOME_ROUTE: Route = { kind: 'tab', tab: 'home' }

function articleIds(): string[] {
  const content = contentByTab.larper
  return content.id === 'larper' ? content.articles.map((article) => article.id) : []
}

export function routeToHash(route: Route): string {
  return route.kind === 'article'
    ? `#/articles/${route.articleId}`
    : `#/${TAB_SLUGS[route.tab]}`
}

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '').replace(/\/+$/, '')
  if (path === '') return HOME_ROUTE

  const [segment, detail] = path.split('/')

  if (segment === 'articles') {
    if (detail && articleIds().includes(detail)) {
      return { kind: 'article', articleId: detail }
    }
    return { kind: 'tab', tab: 'larper' }
  }

  return SLUG_TO_TAB[segment] ? { kind: 'tab', tab: SLUG_TO_TAB[segment] } : HOME_ROUTE
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return route
}

export function navigate(route: Route): void {
  const hash = routeToHash(route)
  if (window.location.hash !== hash) window.location.hash = hash
}
