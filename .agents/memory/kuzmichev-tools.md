---
name: Kuzmichev Tools app pages
description: Conventions for /tools/* app landing pages (downloads, persistent counters, standalone layout, SEO) on the iansound.pro portfolio site.
---

# Kuzmichev Tools — app landing pages

"Kuzmichev Tools" is a line of small macOS apps promoted from this portfolio site. Each gets a bilingual standalone landing page (RU at `/tools/<app>`, EN at `/en/tools/<app>`). First app: Cue Sheets.

## Standalone layout
`/tools/*` and `/en/tools/*` are rendered without the site Header/Footer/AudioMixer — same mechanism as `/legal/*` via the `isStandalone` check in `client/src/components/Layout.tsx`. New /tools pages bring their own mini header/footer.

## Downloads (immediate DMG, not Yandex page)
- DMGs live on Yandex.Disk. The download button must start the file download immediately, NOT open the Yandex Disk web page.
- Pattern: client links to `GET /api/download/<appKey>`; the server resolves the Yandex direct href via `cloud-api.yandex.net/v1/disk/public/resources/download?public_key=` and returns a 302 to it. The Yandex public URL/key stays server-side in a `DOWNLOADABLE_APPS` allowlist in `server/routes.ts`. Do NOT stream the DMG through the server (the audio proxy has a 50MB cap and is unsuitable).
- **Why:** keeps the public key off the client and avoids large-file streaming; 302 to the signed `downloader.disk.yandex.ru` URL triggers a native browser download.

## Persistent download counter
- Counts are stored in PostgreSQL (`download_counters` table: `key` PK, `count`), NOT MemStorage — `server/storage.ts` defaults to MemStorage which does NOT survive restart/deploy, so any "must persist" requirement needs the DB + `npm run db:push`.
- `/api/download/<appKey>` increments inside a try/catch (a counter failure must never block the redirect/download); `/api/downloads/<appKey>` returns `{count}`.

## Hidden stats gesture
Press "k" 5x within 4s on the page → fetch `/api/downloads/<appKey>` and show "Скачано N раз / Downloaded N times". Implemented client-side in the page component.

## SEO
- `/tools/*` pages are INDEXABLE (no noIndex), unlike `/legal/*` (which is noIndex). Add a branch in `server/seo.ts` `getPageSEO` with `SoftwareApplication` + `BreadcrumbList` JSON-LD, `og:image` = app icon, RU+EN copy, and `hideSiteNav: true`. Also add both lang URLs to `client/public/sitemap.xml` (hreflang + `<image:image>`).
- App icons must be copied into `client/public/` (e.g. `cue-sheets-icon.png`) for absolute og:image URLs — `attached_assets/` is NOT web-served.
