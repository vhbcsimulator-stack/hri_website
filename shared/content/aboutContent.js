import { fetchPageContent, persistPageContent } from '@content-backend'

export const ABOUT_PAGE_ID = 'about'

// Editable copy for the public About page. Icons are Google Material Symbols
// names (see fonts.google.com/icons); these are the fallback values the site
// renders before (or without) any saved content.
export const aboutContentData = {
  hero: {
    eyebrow: 'Who We Are',
    titleLead: 'Helping you find a place to',
    titleHighlight: 'call home.',
    para1:
      'At Hermosa Residences Inc. (HRI), we are committed to helping individuals and families find property opportunities that match their lifestyle, priorities, and long-term goals — guiding our clients through every step with professionalism, trust, and personalized service.',
    para2:
      'Whether you are exploring a future home, an investment property, or a space for your next business venture, HRI aims to make the experience clear, reliable, and rewarding.',
    primaryCta: 'View Our Projects',
    secondaryCta: 'Contact Us',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
  },
  purpose: {
    eyebrow: 'Our Purpose',
    titleLead: "We don't simply build houses.",
    titleHighlight: 'We help Filipino families build a future.',
    para1:
      'At Hermosa Residence Inc., we believe that owning a home can provide more than shelter. It can create stability for families, opportunities for progress, stronger communities, and a legacy for future generations.',
    para2:
      'Our purpose is to bring affordable homeownership closer to more Filipinos—one home, one family, and one community at a time.',
  },
  coreValues: {
    title: 'Core Values',
    items: [
      { icon: 'verified', title: 'Integrity', copy: 'We uphold honesty, transparency, and accountability in every client interaction and business transaction.' },
      { icon: 'groups', title: 'Client-Focused', copy: 'We put our clients at the center of what we do by understanding their needs and offering tailored property solutions.' },
      { icon: 'shield', title: 'Reliability', copy: 'We are committed to providing dependable service, timely communication, and consistent support throughout the process.' },
      { icon: 'workspace_premium', title: 'Excellence', copy: 'We strive for high standards in service, presentation, and execution to deliver a quality experience in every engagement.' },
      { icon: 'verified_user', title: 'Professionalism', copy: 'We conduct our work with competence, respect, and dedication, ensuring every client receives the attention they deserve.' },
    ],
  },
  // Each card's `background` / `textColor` are optional hex colours (see
  // missionVisionCardVars). Its `body` is rich-text HTML from the admin's Quill editor
  // (paragraphs, bold/italic/underline, lists, links). Render it through
  // missionVisionBodyHtml() + a sanitizer, never directly.
  missionVision: {
    items: [
      {
        icon: 'visibility',
        title: 'Vision',
        background: '#eef5ee',
        textColor: '#032803',
        body:
          '<p>To be a trusted and transformative housing developer that helps bridge the housing gap in the Philippines by making safe, quality, and affordable homes accessible to every Filipino family.</p>'
          + '<p>We envision thriving communities where homeownership is not merely a dream, but an achievable foundation for security, dignity, stability, and a better future.</p>',
      },
      {
        icon: 'track_changes',
        title: 'Mission',
        background: '#ffffff',
        textColor: '#0d1f0d',
        body:
          "<p>Hermosa Residence Inc. is committed to helping address the country's housing backlog through the development of affordable, quality, and sustainable socialized and economic housing communities.</p>"
          + '<p><strong>We aim to:</strong></p>'
          + '<ul>'
          + '<li>Make homeownership more accessible and attainable for Filipino families, particularly low- to middle-income households.</li>'
          + '<li>Develop socialized and economic housing projects that balance affordability, quality, functionality, and long-term value.</li>'
          + '<li>Build safe, well-planned, and sustainable communities where families can live, grow, and prosper.</li>'
          + '<li>Establish responsible partnerships with government agencies, financial institutions, landowners, contractors, and communities to expand housing opportunities.</li>'
          + '<li>Conduct our business with integrity, accountability, excellence, and genuine concern for the families we serve.</li>'
          + '</ul>',
      },
    ],
  },
  whatWeDo: {
    title: 'What We Do',
    description:
      'At HRI, we help clients explore property opportunities that align with their personal and financial goals. Our team provides assistance from initial inquiry to property selection, helping make the process more convenient, informative, and client-friendly.',
    items: [
      { image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80', label: 'Client Relations' },
      { image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80', label: 'Property Consultation' },
      { image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', label: 'Site Viewing Assistance' },
      { image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=600&q=80', label: 'Sales Support' },
      { image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80', label: 'Project Presentation' },
    ],
  },
  whyChoose: {
    title: 'Why Choose Us?',
    description:
      "HRI is committed to delivering a property experience built on trust, guidance, and client care. Here's why clients choose to work with us:",
    items: [
      { n: '01', title: 'Trusted Assistance', copy: 'We provide dependable guidance every step of the way.' },
      { n: '02', title: 'Clear Communication', copy: 'We keep clients informed with timely and straightforward updates.' },
      { n: '03', title: 'Professional Service', copy: 'Our team is committed to delivering respectful and efficient support.' },
      { n: '04', title: 'Client-Centered Approach', copy: 'We listen carefully and recommend options based on client needs.' },
      { n: '05', title: 'Quality Property Options', copy: 'We present property opportunities with value, purpose, and potential.' },
      { n: '06', title: 'Smooth Process', copy: 'We help make the property journey more organized and manageable.' },
      { n: '07', title: 'Long-Term Commitment', copy: 'We aim to build lasting relationships through reliable service and trust.' },
    ],
  },
  cta: {
    title: 'Let us help you find the right property for your goals.',
    text:
      'Whether you are looking for a future home, an investment opportunity, or a property for business use, HRI is here to guide you every step of the way.',
    button: 'Contact Us Today',
  },
}

const escapeHtml = (text) => String(text)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// A Mission/Vision card's body as HTML. Cards saved before the rich-text editor
// carry plain `copy`, or `paragraphs` + `listIntro` + `points`; those are
// converted (escaped) so older Supabase rows keep rendering.
export const missionVisionBodyHtml = (item) => {
  if (typeof item?.body === 'string') return item.body
  const paragraphs = item?.paragraphs ?? (item?.copy ? [item.copy] : [])
  let html = paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')
  if (item?.listIntro) html += `<p><strong>${escapeHtml(item.listIntro)}</strong></p>`
  if (item?.points?.length) html += `<ul>${item.points.map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul>`
  return html
}

// Desktop column template for the Mission/Vision row. With two cards, the one
// with more text gets a wider column (up to 3:2), so the longer card isn't
// tall and narrow next to a mostly empty short one. Any other count: even grid.
export const missionVisionColumns = (items = []) => {
  if (items.length !== 2) return 'repeat(2, 1fr)'
  const lengths = items.map((item) => missionVisionBodyHtml(item).replace(/<[^>]+>/g, '').length || 1)
  const ratio = Math.min(1.5, Math.max(1 / 1.5, lengths[0] / lengths[1]))
  return ratio >= 1 ? `${ratio}fr 1fr` : `1fr ${1 / ratio}fr`
}

// A stored card colour, accepted only as a hex value (it lands in CSS).
const hexColor = (value) => (/^#[0-9a-f]{3,8}$/i.test(value ?? '') ? value : null)

const mix = (color, percent, base) => `color-mix(in srgb, ${color} ${percent}%, ${base})`

// Each Mission/Vision card can carry its own `background` and `textColor`
// (hex). These CSS variables drive the card and its children; a card without
// them keeps the original white card with green headings and grey copy.
export const missionVisionCardVars = (item) => {
  const bg = hexColor(item?.background)
  const fg = hexColor(item?.textColor)
  const surface = bg || '#ffffff'
  return {
    '--mv-bg': surface,
    '--mv-heading': fg || '#006600',
    '--mv-text': fg ? mix(fg, 80, surface) : '#55605a',
    '--mv-strong': fg || '#032803',
    '--mv-tint': mix(fg || '#006600', fg ? 10 : 8, surface),
    '--mv-line': fg || bg ? mix(fg || '#006600', 14, surface) : '#e6e8e6',
  }
}

// Rich-text overrides so the card body follows the card's text colour.
export const missionVisionBodySx = {
  textAlign: 'left',
  color: 'var(--mv-text)',
  '& strong, & b': { color: 'var(--mv-strong)' },
  '& a': { color: 'var(--mv-heading)' },
  '& ul': { bgcolor: 'var(--mv-tint)' },
  '& ul > li::before, & ol > li::marker': { color: 'var(--mv-heading)' },
}

// Desktop column count for the Core Values cards: 3 or 4, whichever leaves the
// fullest last row (6 → 3+3, 7 → 4+3, 8 → 4+4). Short rows are centered.
export const coreValuesColumns = (count = 0) => {
  if (count <= 4) return Math.max(count, 1)
  const fill = (cols) => (count % cols || cols) / cols
  return fill(4) > fill(3) ? 4 : 3
}

// Width of one Core Values card at each breakpoint, for a centered flex-wrap
// row. `gap` is the row gap in px and must match the container's.
export const coreValuesCardWidth = (count, gap = 24) => {
  const cols = coreValuesColumns(count)
  const width = (n) => (n === 1 ? '100%' : `calc((100% - ${(n - 1) * gap}px) / ${n})`)
  return { xs: '100%', sm: width(Math.min(cols, 2)), md: width(cols) }
}

export const getAboutContent =() => fetchPageContent(ABOUT_PAGE_ID, aboutContentData)

export const saveAboutContent = (content) => persistPageContent(ABOUT_PAGE_ID, content)
