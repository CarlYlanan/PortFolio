import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const articlesFilesDir = fileURLToPath(new URL('./src/data/articles/files', import.meta.url))
const articlesScript = fileURLToPath(new URL('./src/data/articles/extract-articles.mjs', import.meta.url))

function runArticlesExtractor(): void {
  const result = spawnSync(process.execPath, [articlesScript], { stdio: 'inherit' })
  if (result.status !== 0) {
    console.error('[articles] extractor exited with a non-zero status')
  }
}

// Drop-in articles: regenerates src/data/articles/generatedArticles.ts from the
// *.txt files in src/data/articles/files, so saving a file hot-reloads the page.
function articlesExtractorPlugin(): Plugin {
  let command: 'build' | 'serve' = 'serve'

  return {
    name: 'articles-extractor',
    configResolved(config) {
      command = config.command
    },
    buildStart() {
      if (command === 'build') runArticlesExtractor()
    },
    configureServer(server) {
      runArticlesExtractor()

      const target = articlesFilesDir.split('\\').join('/')
      const isArticleSource = (file: string) => {
        const normalized = file.split('\\').join('/')
        return normalized.startsWith(target) && normalized.toLowerCase().endsWith('.txt')
      }

      const onChange = (file: string) => {
        if (isArticleSource(file)) runArticlesExtractor()
      }

      server.watcher.add(articlesFilesDir)
      server.watcher.on('add', onChange)
      server.watcher.on('change', onChange)
      server.watcher.on('unlink', onChange)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), articlesExtractorPlugin()],
  server: {
    allowedHosts: true,
  },
})
