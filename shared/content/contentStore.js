// SUPERSEDED — nothing imports this file any more; it is safe to delete.
//
// Each app now owns its content backend, resolved through the
// `@content-backend` alias in its own vite.config.js:
//   public site -> src/lib/contentStore.js        (Supabase, read-only)
//   admin       -> admin/src/lib/contentStore.js  (Supabase, read/write)
// Both keep the /api/content + JSON-snapshot fallbacks preserved below for use
// until VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set.

import contentSnapshot from '../../content/site-content.json'

// Shared content store used by both the public site and the admin editor.
// During local development the Vite middleware in vite.content-plugin.js serves
// /api/content from content/site-content.json. A static build has no such
// endpoint, so the JSON imported at build time acts as the snapshot and
// localStorage keeps any unsaved-to-disk edits usable in the browser.
const LS_KEY = 'hri_site_content'

// Fill any fields missing from stored content with the code defaults, so pages
// keep working when new sections are added after content was saved.
const mergeWithDefaults = (defaults, stored) => {
  if (stored === undefined || stored === null) return defaults
  if (Array.isArray(stored)) return stored
  if (typeof stored === 'object' && defaults && typeof defaults === 'object' && !Array.isArray(defaults)) {
    const merged = { ...defaults }
    for (const key of Object.keys(stored)) {
      merged[key] = mergeWithDefaults(defaults[key], stored[key])
    }
    return merged
  }
  return stored
}

const emptyDocument = () => ({ version: 1, updatedAt: null, pages: {} })

const readLocal = () => {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const writeLocal = (document) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(document))
  } catch (error) {
    console.error('Failed to cache site content in localStorage:', error)
  }
}

// Newest available copy of the whole content document.
export const loadDocument = async () => {
  try {
    const response = await fetch('/api/content', { cache: 'no-store' })
    if (response.ok) {
      const document = await response.json()
      writeLocal(document)
      return document
    }
  } catch {
    // No content service (static deployment) — fall through to the snapshot.
  }
  return readLocal() || contentSnapshot || emptyDocument()
}

export const fetchPageContent = async (pageId, defaults) => {
  try {
    const document = await loadDocument()
    return mergeWithDefaults(defaults, document.pages?.[pageId])
  } catch (error) {
    console.error(`Failed to load site content "${pageId}":`, error)
    return defaults
  }
}

export const persistPageContent = async (pageId, content) => {
  // Re-read first so saving one page never clobbers another page's content.
  const current = await loadDocument()
  const next = {
    ...emptyDocument(),
    ...current,
    pages: { ...(current.pages || {}), [pageId]: content },
  }

  writeLocal(next)

  const response = await fetch('/api/content', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(next),
  })
  if (!response.ok) throw new Error('The local content service is unavailable.')
  writeLocal(await response.json())
}
