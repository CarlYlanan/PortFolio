import { MreowCarousel } from '../mreow/mreow'
import type { BulletEntry, ContentSection } from '../types'

export interface ArticleSectionsProps {
  sections: ContentSection[]
}

export function ArticleSections({ sections }: ArticleSectionsProps) {
  return (
    <>
      {sections.map((section) => (
        <article className="content-section" id={section.id} key={section.id}>
          <p className="section-label">{section.title}</p>
          <p>{section.body}</p>
          {section.galleries && section.galleries.length > 0 && (
            <div className="gallery-groups">
              {section.galleries.map((group) => (
                <div className="gallery-group" key={group.id}>
                  <p className="gallery-heading">{group.title}</p>
                  <MreowCarousel
                    items={group.items}
                    mediaFolder={group.mediaFolder ?? '/media'}
                    sortBy={group.sortBy}
                    title={group.title}
                    visibleBoxes={5}
                  />
                </div>
              ))}
            </div>
          )}
          {section.bullets && section.bullets.length > 0 && (
            <ul className="section-bullets">
              {section.bullets.map((bullet: BulletEntry, index: number) => {
                if (typeof bullet === 'string') {
                  return <li key={`${section.id}-${bullet}`}>{bullet}</li>
                }

                return (
                  <li key={`${section.id}-${bullet.item}-${index}`}>
                    {bullet.url
                      ? <a className="bullet-link" href={bullet.url} rel="noreferrer" target="_blank">{bullet.item}</a>
                      : <span>{bullet.item}</span>}
                    <span className="bullet-separator"> : </span>
                    <span>{bullet.usage}</span>
                  </li>
                )
              })}
            </ul>
          )}
          {section.references && section.references.length > 0 && (
            <div className="reference-section">
              <p className="reference-heading">References</p>
              <ul className="reference-list">
                {section.references.map((reference) => (
                  <li key={reference.url}>
                    <a className="reference-link" href={reference.url} rel="noreferrer" target="_blank">{reference.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {section.rootLink && (
            <div className="root-link-section">
              <a className="root-link" href={section.rootLink.url} rel="noreferrer" target="_blank">{section.rootLink.title}</a>
            </div>
          )}
        </article>
      ))}
    </>
  )
}
