import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { loadDocument, cachedDocument, mergeWithDefaults } from '../lib/contentStore'

// There is only ever one resource here: the whole content document. Every page
// shares this single cached copy and selects its own slice out of it, so a
// visit costs one Supabase request no matter how many pages are viewed.
export const siteContentQuery = {
  queryKey: ['site-content'],
  queryFn: loadDocument,
  // Render the last known good copy immediately; the fetch still runs once and
  // swaps in the live content when it lands.
  placeholderData: cachedDocument,
}

// Loads a page's editable content, rendering the code defaults until the saved
// content arrives so the page never flashes empty.
export default function usePageContent(pageId, defaults) {
  // Memoised: react-query re-runs `select` whenever the function identity
  // changes, and an inline arrow would rebuild the merged content every render.
  const select = useCallback(
    (document) => mergeWithDefaults(defaults, document.pages?.[pageId]),
    [pageId, defaults],
  )

  const { data } = useQuery({ ...siteContentQuery, select })

  return data ?? defaults
}
