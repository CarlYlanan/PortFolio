import { generatedInstagramPosts, instagramProfile } from '../data/social/generatedInstagramPosts'

function tileSrc(src: string): string {
  const file = src.replace(/^\/+/, '')
  return `/media/social/instagram/${file}`
}

export function InstagramFeed() {
  const handle = instagramProfile.handle?.trim() ?? ''
  const profileUrl = instagramProfile.profileUrl ?? 'https://www.instagram.com/'
  const posts = generatedInstagramPosts
  const title = handle !== '' ? `@${handle}` : 'Instagram'

  return (
    <article className="content-section instagram-feed-section" id="instagram-feed">
      <p className="section-label">Instagram</p>
      <a className="ig-feed-handle" href={profileUrl} rel="noreferrer" target="_blank">
        {title}
      </a>
      {posts.length === 0 ? (
        <p className="ig-feed-empty">No posts synced yet — run `pnpm fetch:instagram &lt;username&gt;` to fill this feed.</p>
      ) : (
        <>
          <div className="ig-feed-scroll">
            <div className="ig-feed-grid">
              {posts.map((post) => {
                const caption = post.title?.trim() !== '' ? post.title! : post.src
                const img = (
                  <img className="ig-feed-img" alt={post.alt ?? caption} loading="lazy" src={tileSrc(post.src)} />
                )
                return post.link ? (
                  <a className="ig-feed-tile" href={post.link} key={post.src} rel="noreferrer" target="_blank">
                    {img}
                  </a>
                ) : (
                  <span className="ig-feed-tile" key={post.src}>
                    {img}
                  </span>
                )
              })}
            </div>
          </div>
          <p className="ig-feed-note">{`${posts.length} posts · snapshot from last sync`}</p>
        </>
      )}
    </article>
  )
}
