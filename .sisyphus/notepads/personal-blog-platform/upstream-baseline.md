# Upstream Baseline Documentation

## Source
- **Upstream**: satnaing/astro-paper
- **License**: MIT License (Copyright 2023 Sat Naing)
- **Import Date**: 2025-03-15
- **Purpose**: Foundation Astro blog structure for personal-blog-platform

## Modules Retained

### Configuration
- `src/config.ts` - Site configuration (rewritten with neutral branding)
- `src/content.config.ts` - Content collections schema (adapted for project)
- `src/constants.ts` - Social/share constants (simplified)

### Layouts
- `src/layouts/Layout.astro` - Base HTML layout (simplified, removed Font component)
- `src/layouts/Main.astro` - Main content layout with breadcrumb
- `src/layouts/PostDetails.astro` - Blog post detail layout
- `src/layouts/AboutLayout.astro` - About page layout

### Components
- `src/components/Header.astro` - Site header with navigation
- `src/components/Footer.astro` - Site footer
- `src/components/Card.astro` - Post card component
- `src/components/Tag.astro` - Tag display component
- `src/components/Datetime.astro` - Date formatting component
- `src/components/LinkButton.astro` - Link button component
- `src/components/Socials.astro` - Social links component
- `src/components/ShareLinks.astro` - Share buttons component
- `src/components/Pagination.astro` - Pagination component
- `src/components/BackButton.astro` - Back navigation button
- `src/components/BackToTopButton.astro` - Scroll to top button
- `src/components/Breadcrumb.astro` - Breadcrumb navigation
- `src/components/EditPost.astro` - Edit post link

### Utilities
- `src/utils/getSortedPosts.ts` - Post sorting utility
- `src/utils/postFilter.ts` - Post filtering (drafts, scheduled)
- `src/utils/slugify.ts` - String slugification
- `src/utils/getPath.ts` - Post path generation
- `src/utils/getUniqueTags.ts` - Tag extraction utility
- `src/utils/getPostsByTag.ts` - Tag-based post filtering
- `src/utils/getPostsByGroupCondition.ts` - Grouped post retrieval

### Styles
- `src/styles/global.css` - Global styles with Tailwind v4
- `src/styles/typography.css` - Typography and prose styles

### Scripts
- `src/scripts/theme.ts` - Dark/light mode theme switching

### Assets
- `src/assets/icons/` - All SVG icons (24 icon files)

### Pages
- `src/pages/index.astro` - Homepage (rewritten with neutral content)
- `src/pages/posts/[...page].astro` - Post listing with pagination
- `src/pages/posts/[...slug]/index.astro` - Individual post pages
- `src/pages/tags/index.astro` - Tag index page
- `src/pages/tags/[tag]/[...page].astro` - Tag-specific post lists
- `src/pages/archives/index.astro` - Archives page
- `src/pages/search.astro` - Search page (Pagefind placeholder)
- `src/pages/about.md` - About page (neutral content)
- `src/pages/404.astro` - 404 error page
- `src/pages/rss.xml.ts` - RSS feed generation
- `src/pages/robots.txt.ts` - Robots.txt generation

## Modules Discarded/Not Imported

### OG Image Generation
- `src/utils/generateOgImages.ts` - OG image generation utility
- `src/utils/loadGoogleFont.ts` - Google font loading for OG
- `src/utils/og-templates/` - OG image templates
- `src/pages/og.png.ts` - OG image endpoint
- `src/pages/posts/[...slug]/index.png.ts` - Dynamic OG images
- **Reason**: Not required for baseline; will be implemented in later tasks if needed

### Content
- All upstream sample blog posts (12+ files)
- `src/data/blog/` - Sample content directory
- **Reason**: Removed upstream branding and sample identity

### Configuration
- `astro.config.ts` features:
  - Experimental font loading
  - Shiki transformers for code blocks
  - Custom environment variables
  - **Reason**: Simplified for baseline; advanced features to be added later

### Assets
- `src/assets/images/` - AstroPaper branding images
- `AstroPaper-v*.png` - Version announcement images
- `forrest-gump-quote.png` - Sample content image
- **Reason**: Removed upstream branding

### Documentation
- `README.md` - Upstream documentation
- `CHANGELOG.md` - Version history
- **Reason**: Project will have its own documentation

## Branding/Identity Changes

### Removed
- "AstroPaper" name and branding
- Author name "Sat Naing" and profile links
- Sample descriptions referencing AstroPaper theme
- Default social media links (replaced with placeholders)
- Feature images and screenshots

### Replaced With
- Neutral "Personal Blog" title
- Generic "Author Name" placeholder
- Neutral welcome message
- Minimal social links configuration
- Single sample post (hello-world.md)

## Dependencies Added
- `@astrojs/rss` - RSS feed generation
- `@astrojs/sitemap` - Sitemap generation
- `dayjs` - Date handling
- `lodash.kebabcase` - String kebab-casing
- `remark-collapse` - Markdown TOC collapse
- `remark-toc` - Markdown table of contents
- `slugify` - String slugification
- `tailwindcss` - Tailwind CSS v4
- `@tailwindcss/vite` - Tailwind Vite plugin
- `@tailwindcss/typography` - Typography plugin
- `pagefind` - Static search (placeholder)
- `@pagefind/default-ui` - Pagefind UI

## Build Compatibility
- pnpm package manager maintained
- Cloudflare adapter preserved (output: 'server')
- TypeScript strict mode enabled
- All scripts in package.json functional
