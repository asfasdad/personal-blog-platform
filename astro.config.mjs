import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import node from '@astrojs/node'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import remarkToc from 'remark-toc'
import remarkCollapse from 'remark-collapse'

const lifecycleEvent = process.env.npm_lifecycle_event ?? ''
const useLighthouseAdapter = process.env.LIGHTHOUSE_STATIC === '1'
const useCloudflareAdapter =
  lifecycleEvent !== 'dev' &&
  lifecycleEvent !== 'test:e2e' &&
  !useLighthouseAdapter

const adapter = useCloudflareAdapter
  ? cloudflare()
  : useLighthouseAdapter
    ? node({ mode: 'standalone' })
    : undefined

export default defineConfig({
  output: adapter ? 'server' : 'static',
  ...(adapter ? { adapter } : {}),
  site: 'https://blog.158247.xyz',
  integrations: [
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
  },
})
