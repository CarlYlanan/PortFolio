import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const splash = document.getElementById('splash')
if (splash) {
  let dismissed = false
  const dismiss = () => {
    if (dismissed) {
      return
    }
    dismissed = true

    // A missing gif skips the splash entirely - no blank overlay, no fade.
    const img = splash.querySelector('img')
    if (!img || (img.complete && img.naturalWidth === 0)) {
      splash.remove()
      return
    }

    splash.classList.add('splash-hide')
    window.setTimeout(() => splash.remove(), 700)
  }

  // Never trap the user behind the splash.
  window.setTimeout(dismiss, 4000)

  // Fade once the app has painted and the page's initial resources are in.
  if (document.readyState === 'complete') {
    window.requestAnimationFrame(() => window.requestAnimationFrame(dismiss))
  } else {
    window.addEventListener('load', () => window.requestAnimationFrame(dismiss), { once: true })
  }
}
