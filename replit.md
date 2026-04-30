# Overview

This is a personal portfolio website for Ian Kuzmichev (Ян Кузьмичёв), a composer, sound designer, and sound engineer with 14+ years of experience. The site showcases his work across theatre, film, and audio productions, featuring project galleries, detailed work descriptions, and contact information. Built as a modern full-stack web application with a focus on visual presentation and user experience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom CSS variables for theming, using a dark neon aesthetic
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Animations**: Framer Motion for smooth page transitions and component animations
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Development**: Hot reload with Vite integration in development mode
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

## Project Structure
- **Monorepo**: Client, server, and shared code in single repository
- **Client**: React frontend in `/client` directory
- **Server**: Express backend in `/server` directory  
- **Shared**: Common types and schemas in `/shared` directory
- **Component Organization**: Atomic design with reusable UI components
- **Project page modules** (extracted from the formerly 1775-line `ProjectPage.tsx`):
  - `client/src/lib/petrovyParallax.ts` — Canvas-анимация бесконечной ленты для «Петровых».
  - `client/src/components/project/ProjectMedia.tsx` — `NeonTitle` («Идиот»), `MayakTitle`, `PhotoCarousel`, `ComicImageCarousel`, `Equalizer`.
  - `client/src/data/projectTracks.ts` — функции `getIdiotTracks/getMayakTracks/getPetrovyTracks` для плейлистов отдельных проектов (RU/EN).

## Key Features
- **Portfolio Showcase**: Project galleries organized by category (theatre, film, audio)
- **Auto-slider**: Custom carousel component for project presentations
- **SEO Optimization**: React Helmet for meta tags and structured data; server-side SEO middleware for bots
- **Responsive Design**: Mobile-first approach with glass morphism effects
- **Contact Form**: Validated contact form with toast notifications
- **Timeline View**: Chronological work history display
- **Audio Persistence**: Consent-based localStorage persistence for audio settings and mixer volumes (first-time visitors: audio off, returning users: restore preferences)
- **Bilingual (RU/EN)**: URL-based i18n system — Russian at `/`, English at `/en/`. Language switcher in header. All UI text, project data, SEO metadata, and sitemap support both languages with proper hreflang tags.

## i18n Architecture
- **Language detection**: `client/src/i18n/useLanguage.ts` hook reads URL path (`/en/*` = English, else Russian). Returns `{ lang, t, prefix }`.
- **Translations**: `client/src/i18n/translations.ts` — all UI strings in RU and EN.
- **All projects (full list)**: `client/src/data/allProjects.ts` — single bilingual source. Each field that varies by language uses `BiLangText` shape `{ ru: string; en: string }`. Helper `tr(field)` in `Projects.tsx` picks the right language.
- **Featured projects (homepage + detail pages)**: `client/src/data/projects.ts` (RU) + `client/src/i18n/projectsEn.ts` (EN translations by id) — still split, kept for the hand-curated case studies on `/project/*` pages.
- **Routes**: Duplicate routes in App.tsx — Russian at `/`, `/about`, etc.; English at `/en/`, `/en/about`, etc.
- **Audio routing**: `HowlerAudioEngine.normalizeRoute()` strips `/en` prefix so the route→track map works for both languages.
- **SEO middleware**: `server/seo.ts` detects language from URL, serves translated bot HTML with hreflang tags. All dynamic plain-text fields go through `escapeHtml()`; JSON-LD goes through `safeJsonLd()`.
- **Sitemap**: `client/public/sitemap.xml` includes all pages in both languages with xhtml:link hreflang annotations.
- **Data sync**: When adding a new project, update: `client/src/data/allProjects.ts` (always — bilingual entry). For featured projects with a `/project/*` detail page also update: `client/src/data/projects.ts`, `client/src/i18n/projectsEn.ts`, `server/seo.ts` projectsData.

# External Dependencies

## Database
- **PostgreSQL**: Primary database with Neon serverless PostgreSQL
- **Drizzle Kit**: Database migrations and schema management

## UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **Lucide React**: Icon library

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with Autoprefixer

## Form and Validation
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation and schema definition
- **@hookform/resolvers**: Zod integration for form validation

## Routing and State
- **Wouter**: Minimalist router for React
- **TanStack Query**: Server state management and caching

## Assets and Media
- **WebP Images**: Optimized image formats for better performance
- **Google Fonts**: Inter font family for typography
- **Custom Icons**: PNG icons for social media links