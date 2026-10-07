import DOMPurify from 'dompurify'

// Rich-text fields (written by the admin's Quill editor) are stored as HTML.
// Everything that renders one goes through sanitizeRichText first, so a saved
// row can only ever produce this small set of formatting tags.
const ALLOWED_TAGS = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'ul', 'ol', 'li']
const ALLOWED_ATTR = ['href', 'target', 'rel']

// Non-breaking spaces are swapped for normal ones: Quill's output used to store
// every space as &nbsp;, which stops paragraphs wrapping inside their card.
export const sanitizeRichText = (html) =>
  DOMPurify.sanitize(html || '', { ALLOWED_TAGS, ALLOWED_ATTR }).replace(/&nbsp;|\u00a0/g, ' ')

const escapeHtml = (text) => String(text)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Paragraph fields were plain text before the Quill editor; Quill always
// emits a leading <p>, <ul> or <ol>. Anything else is treated as plain text.
export const isRichHtml = (value) => /^\s*<(p|ul|ol)[\s>]/i.test(value || '')

// A paragraph field (plain text or rich HTML) as sanitized HTML. Plain text is
// escaped; blank lines become paragraph breaks and single newlines <br>.
export const richTextHtml = (value) => {
  if (!value) return ''
  if (isRichHtml(value)) return sanitizeRichText(value)
  return String(value)
    .split(/\n\s*\n/)
    .map((para) => `<p>${escapeHtml(para.trim()).replace(/\n/g, '<br>')}</p>`)
    .join('')
}

// A paragraph field as plain text, for one-line previews and search.
export const richTextToPlain = (value) => {
  if (!isRichHtml(value)) return value || ''
  const doc = new DOMParser().parseFromString(sanitizeRichText(value), 'text/html')
  return doc.body.textContent.replace(/\s+/g, ' ').trim()
}

// Formatting for a paragraph field rendered in place of its old Typography:
// size, colour and weight come from the surrounding sx, so the field looks the
// same on light sections and dark banners; only structure is added here.
export const inlineRichTextSx = {
  // Same base the replaced Typography had; the caller's sx overrides it.
  typography: 'body1',
  overflowWrap: 'anywhere',
  '& p': { m: 0 },
  '& > * + *': { mt: '.85em' },
  '& strong, & b': { fontWeight: 700 },
  '& a': { color: 'inherit', textDecoration: 'underline' },
  '& ul, & ol': { m: 0, pl: '1.4em' },
  '& li + li': { mt: '.35em' },
  '& li::marker': { color: 'currentColor' },
}

// Shared typography for rendered rich text, so the editor preview matches the
// public site. Bullet lists show the brand's green check icon (Material Symbols
// ligature); numbered lists keep green numerals.
export const richTextSx = {
  color: 'text.secondary',
  fontSize: 16,
  lineHeight: 1.75,
  overflowWrap: 'anywhere',
  '& p': { m: 0, mb: 2.25 },
  // The opening paragraph reads as a lead-in.
  '& > p:first-of-type': { fontSize: { xs: 16.5, md: 17.5 }, lineHeight: 1.65 },
  // An intro line ("We aim to:") sits close to the list it introduces.
  '& p:has(+ ul), & p:has(+ ol)': { mb: 1.25 },
  '& > :last-child': { mb: 0 },
  '& strong, & b': { color: 'primary.dark', fontWeight: 700 },
  '& a': { color: 'primary.main', textDecoration: 'underline' },
  '& ul, & ol': { m: 0, mb: 2.25, display: 'grid', gap: 1.5 },
  // Bullet lists sit on a soft tinted panel so the points read as one group.
  '& ul': {
    listStyle: 'none',
    p: { xs: 2, md: 2.5 },
    borderRadius: 2,
    bgcolor: 'rgba(0,102,0,.045)',
  },
  '& ul > li': { position: 'relative', pl: 3.5, fontSize: 15, lineHeight: 1.65 },
  '& ul > li::before': {
    content: '"check_circle"',
    fontFamily: '"Material Symbols Outlined"',
    fontFeatureSettings: '"liga"',
    position: 'absolute', left: 0, top: 3,
    fontSize: 19, lineHeight: 1, color: 'primary.main',
  },
  '& ol': { p: 0, pl: 3, listStyle: 'decimal' },
  '& ol > li': { fontSize: 15, lineHeight: 1.65 },
  '& ol > li::marker': { color: 'primary.main', fontWeight: 700 },
}
