import { useEffect, useState } from 'react'

// Loads a page's editable content, rendering the code defaults until the saved
// content arrives so the page never flashes empty.
export default function usePageContent(getContent, defaults) {
  const [content, setContent] = useState(defaults)

  useEffect(() => {
    let cancelled = false
    getContent()
      .then((loaded) => { if (!cancelled) setContent(loaded) })
      .catch((error) => console.error('Failed to load page content:', error))
    return () => { cancelled = true }
  }, [getContent])

  return content
}
