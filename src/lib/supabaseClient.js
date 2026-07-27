import { createClient } from '@supabase/supabase-js'

// The public site's own Supabase client — read-only by design. The admin app
// has a separate client of its own (admin/src/lib/supabaseClient.js) so the two
// apps stay independently deployable and never share a session.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Until .env is filled in, this stays false and the content store falls back to
// the local JSON snapshot, so the site keeps rendering.
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        // Visitors never sign in — don't persist or refresh a session, and
        // don't try to read a token out of the URL.
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null

// Table holding one row per editable page, keyed by page id. See
// admin/sql/schema.sql for the schema and row-level security policies.
export const CONTENT_TABLE = 'site_content'
