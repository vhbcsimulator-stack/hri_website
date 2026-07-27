import contentSnapshot from '../../content/site-content.json'
import { supabase, isSupabaseConfigured, CONTENT_TABLE } from './supabaseClient'

// The public site's content backend. `shared/content/*.js` reaches this through
// the `@content-backend` alias declared in vite.config.js; the admin app aliases
// the same specifier to its own store, which is what keeps the two apps
// independent while they share the default content data.
//
// Read order:
//   1. Supabase   — the live content, once .env is filled in
//   2. localStorage — last known good copy, so a network blip isn't a blank page
//   3. /api/content — the dev-only Vite middleware over content/site-content.json
//   4. the JSON snapshot bundled at build time
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

// Rows are per page; the rest of the app still thinks in whole documents.
const rowsToDocument = (rows) => ({
  version: 1,
  updatedAt: rows.reduce((latest, row) => (row.updated_at > latest ? row.updated_at : latest), ''),
  pages: Object.fromEntries(rows.map((row) => [row.page_id, row.content])),
})

const loadFromSupabase = async () => {
  const { data, error } = await supabase
    .from(CONTENT_TABLE)
    .select('page_id, content, updated_at')
  if (error) throw new Error(error.message)
  return rowsToDocument(data || [])
}

const loadFromLocalApi = async () => {
  const response = await fetch('/api/content', { cache: 'no-store' })
  if (!response.ok) throw new Error('The local content service is unavailable.')
  return response.json()
}

// Newest available copy of the whole content document.
export const loadDocument = async () => {
  if (isSupabaseConfigured) {
    try {
      const document = await loadFromSupabase()
      writeLocal(document)
      return document
    } catch (error) {
      console.error('Failed to load site content from Supabase:', error)
      return readLocal() || contentSnapshot || emptyDocument()
    }
  }

  try {
    const document = await loadFromLocalApi()
    writeLocal(document)
    return document
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

// Present only so the shared content modules can export their save helpers
// unconditionally. The public site never writes — editing lives in admin/.
export const persistPageContent = async () => {
  throw new Error('The public site is read-only. Edit content in the admin app.')
}
