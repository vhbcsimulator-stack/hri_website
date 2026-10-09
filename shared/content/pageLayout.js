// Page visibility and per-page section layout, shared by the public site and
// the admin.
//
// Site settings live in their own content row (`settings`):
//   { hiddenPages: { [pageKey]: true } }
//
// Each page's own content row carries `pageLayouts`, keyed by layout key (a
// page key, or `project-details:<slug>` for one project's details page):
//   { hidden: { [sectionId]: true },
//     custom: [{ id, after, title, body, image, imageSide, background, hidden }] }
// `after` is the built-in section a custom section follows; custom sections
// sharing an anchor render in array order.

export const SITE_SETTINGS_ID = 'settings'
// hiddenPages: page is offline (maintenance notice, dropped from menu + footer).
// hiddenNav:   page stays live but its button is left out of the top navbar.
export const siteSettingsDefaults = { hiddenPages: {}, hiddenNav: {} }

// Every public page that can be taken offline. `path` is the public route;
// `nav` marks the pages that have a button in the top navbar.
export const SITE_PAGES = [
  { key: 'home', label: 'Home', path: '/', nav: true },
  { key: 'about', label: 'About Us', path: '/about', nav: true },
  { key: 'projects', label: 'Projects', path: '/projects', nav: true },
  { key: 'project-details', label: 'Project Details', path: '/project-details' },
  { key: 'contact', label: 'Contact Us', path: '/contact', nav: true },
  { key: 'privacy-policy', label: 'Privacy Policy', path: '/privacy-policy' },
  { key: 'terms-of-service', label: 'Terms of Service', path: '/terms-of-service' },
  { key: 'cookie-policy', label: 'Cookie Policy', path: '/cookie-policy' },
  { key: 'sitemap', label: 'Sitemap', path: '/sitemap' },
]

// The legal routes share one content row; this maps each document `type` to its
// page/layout key.
export const LEGAL_LAYOUT_KEYS = { privacy: 'privacy-policy', terms: 'terms-of-service', cookies: 'cookie-policy' }

export const projectLayoutKey = (slug) => `project-details:${slug}`

export const isPageHidden =(settings, pageKey) => Boolean(settings?.hiddenPages?.[pageKey])

export const isPathHidden = (settings, path) => {
  const page = SITE_PAGES.find((p) => p.path === path)
  return page ? isPageHidden(settings, page.key) : false
}

export const isNavHidden = (settings, pageKey) => Boolean(settings?.hiddenNav?.[pageKey])

// Whether a navbar button should be left out: its page is offline, or the
// admin removed just the button.
export const isNavPathHidden = (settings, path) => {
  const page = SITE_PAGES.find((p) => p.path === path)
  return page ? isPageHidden(settings, page.key) || isNavHidden(settings, page.key) : false
}

// Built-in sections per page, in page order. The ids are what `hidden` and a
// custom section's `after` refer to, so never rename one that has shipped.
const BANNER_AND_BODY = [{ id: 'banner', label: 'Banner' }, { id: 'body', label: 'Page Content' }]
export const PAGE_SECTIONS = {
  home: [
    { id: 'hero', label: 'Hero' },
    { id: 'featured', label: 'Featured Projects' },
    { id: 'whyChooseUs', label: 'Why Choose Us' },
    { id: 'propertyFeatures', label: 'Property Features' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'cta', label: 'Call to Action' },
  ],
  about: [
    { id: 'hero', label: 'Hero' },
    { id: 'purpose', label: 'Our Purpose' },
    { id: 'coreValues', label: 'Core Values' },
    { id: 'missionVision', label: 'Mission & Vision' },
    { id: 'whatWeDo', label: 'What We Do' },
    { id: 'whyChoose', label: 'Why Choose Us' },
    { id: 'cta', label: 'Call to Action' },
  ],
  contact: [
    { id: 'hero', label: 'Hero' },
    { id: 'inquiry', label: 'Inquiry Form' },
    { id: 'map', label: 'Map' },
    { id: 'faq', label: 'FAQ' },
  ],
  'project-details': [
    { id: 'hero', label: 'Hero' },
    { id: 'intro', label: 'Introduction' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'features', label: 'Key Features' },
    { id: 'houseTypes', label: 'House Types' },
    { id: 'inquiry', label: 'Inquiry' },
  ],
  'privacy-policy': BANNER_AND_BODY,
  'terms-of-service': BANNER_AND_BODY,
  'cookie-policy': BANNER_AND_BODY,
  sitemap: BANNER_AND_BODY,
}

export const sectionLabel = (pageKey, sectionId) =>
  PAGE_SECTIONS[pageKey]?.find((s) => s.id === sectionId)?.label ?? sectionId

const EMPTY_LAYOUT = Object.freeze({ hidden: {}, custom: [], order: null })

export const getLayout = (content, layoutKey) => {
  const layout = content?.pageLayouts?.[layoutKey]
  return layout
    ? { hidden: layout.hidden || {}, custom: layout.custom || [], order: layout.order || null }
    : EMPTY_LAYOUT
}

export const isSectionHidden = (layout, sectionId) => Boolean(layout?.hidden?.[sectionId])

const insertAfter = (list, anchor, id) => {
  const at = anchor === undefined ? -1 : list.indexOf(anchor)
  if (anchor !== undefined && at < 0) list.push(id)
  else list.splice(at + 1, 0, id)
}

// The page's sections in display order: ids of built-in sections and custom
// sections mixed. A saved `order` wins; anything it doesn't mention (a built-in
// section added to the code later, or a custom section saved before ordering
// existed) slots in after its natural neighbour. Without a saved order, built-in
// sections keep their code order and custom sections follow their `after` anchor.
export const sectionOrder = (pageKey, layout) => {
  const builtins = (PAGE_SECTIONS[pageKey] || []).map((s) => s.id)
  const customs = layout?.custom || []
  const known = new Set([...builtins, ...customs.map((c) => c.id)])

  if (layout?.order?.length) {
    const order = layout.order.filter((id) => known.has(id))
    builtins.forEach((id, i) => {
      if (order.includes(id)) return
      if (i === 0) order.unshift(id)
      else insertAfter(order, builtins[i - 1], id)
    })
    customs.forEach((c) => {
      if (order.includes(c.id)) return
      if (c.after && order.includes(c.after)) insertAfter(order, c.after, c.id)
      else order.push(c.id)
    })
    return order
  }

  const order = []
  builtins.forEach((id) => {
    order.push(id)
    customs.filter((c) => c.after === id).forEach((c) => order.push(c.id))
  })
  customs.filter((c) => !builtins.includes(c.after)).forEach((c) => order.push(c.id))
  return order
}

export const CUSTOM_SECTION_BACKGROUNDS = [
  { value: 'white', label: 'White' },
  { value: 'light', label: 'Light' },
  { value: 'green', label: 'Green' },
]

// Surface + text colours for each custom-section background. `card` styles the
// tiles inside card-based templates so they read on any background.
const CUSTOM_SECTION_THEMES = {
  white: {
    surface: { bgcolor: '#fff' }, color: 'text.secondary', heading: 'primary.main',
    card: { bgcolor: 'rgba(0,102,0,.04)', color: 'text.secondary', heading: 'primary.dark' },
  },
  light: {
    surface: { bgcolor: 'brand.surface' }, color: 'text.secondary', heading: 'primary.main',
    card: { bgcolor: '#fff', color: 'text.secondary', heading: 'primary.dark' },
  },
  green: {
    surface: { background: 'linear-gradient(180deg, #006600 0%, #024A01 55%, #021c02 100%)' },
    color: 'rgba(255,255,255,.85)',
    heading: '#fff',
    card: { bgcolor: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.82)', heading: '#fff' },
  },
}

export const customSectionTheme = (background) => CUSTOM_SECTION_THEMES[background] || CUSTOM_SECTION_THEMES.white

const PHOTO = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`

// Ready-made section designs the admin can add, modelled on the site's own
// sections. `create` returns the template's starting content.
export const SECTION_TEMPLATES = [
  {
    type: 'text',
    label: 'Text & Image',
    description: 'A heading and formatted text, with an optional photo beside it.',
    icon: 'article',
    create: () => ({
      title: 'New Section',
      body: '<p>Write this section’s text here.</p>',
      image: '',
      imageSide: 'right',
    }),
  },
  {
    type: 'cards',
    label: 'Icon Cards',
    description: 'A grid of cards with an icon, title and text — like Core Values.',
    icon: 'grid_view',
    create: () => ({
      title: 'Our Highlights',
      intro: '',
      items: [
        { icon: 'verified', title: 'Quality', copy: 'Describe this highlight.' },
        { icon: 'groups', title: 'Community', copy: 'Describe this highlight.' },
        { icon: 'eco', title: 'Sustainability', copy: 'Describe this highlight.' },
      ],
    }),
  },
  {
    type: 'imageCards',
    label: 'Photo Cards',
    description: 'Tall photo cards with a label — like What We Do and Featured Projects.',
    icon: 'photo_library',
    create: () => ({
      title: 'Explore',
      intro: '',
      items: [
        { image: PHOTO('photo-1600585154340-be6161a56a0c'), label: 'Model Homes', copy: '' },
        { image: PHOTO('photo-1512917774080-9991f1c4c750'), label: 'Amenities', copy: '' },
        { image: PHOTO('photo-1564013799919-ab600027ffc6'), label: 'Community', copy: '' },
      ],
    }),
  },
  {
    type: 'steps',
    label: 'Numbered Steps',
    description: 'A numbered sequence of steps or reasons — like Why Choose Us.',
    icon: 'format_list_numbered',
    create: () => ({
      title: 'How It Works',
      intro: '',
      items: [
        { title: 'Inquire', copy: 'Reach out to our team.' },
        { title: 'Visit', copy: 'Schedule a site viewing.' },
        { title: 'Reserve', copy: 'Secure your preferred unit.' },
        { title: 'Move In', copy: 'Welcome to your new home.' },
      ],
    }),
  },
  {
    type: 'stats',
    label: 'Stats Band',
    description: 'A row of big numbers with labels, on a bold background.',
    icon: 'bar_chart',
    background: 'green',
    create: () => ({
      title: '',
      items: [
        { value: '500+', label: 'Families Served' },
        { value: '12', label: 'Communities' },
        { value: '10', label: 'Years of Service' },
      ],
    }),
  },
  {
    type: 'quote',
    label: 'Quote / Testimonial',
    description: 'A large pull quote with the person’s name and role.',
    icon: 'format_quote',
    background: 'light',
    create: () => ({
      quote: '<p>Write a quote or testimonial here.</p>',
      author: 'Name',
      role: 'Homeowner',
    }),
  },
  {
    type: 'cta',
    label: 'Call to Action',
    description: 'A bold band with a headline, short text and a button.',
    icon: 'campaign',
    background: 'green',
    create: () => ({
      title: 'Ready to find your home?',
      text: '<p>Our team is ready to help you take the next step.</p>',
      buttonLabel: 'Contact Us',
      buttonLink: '/contact',
    }),
  },
  {
    type: 'faq',
    label: 'FAQ',
    description: 'Questions with expandable answers.',
    icon: 'help',
    create: () => ({
      title: 'Frequently Asked Questions',
      items: [
        { q: 'Write a question here?', a: '<p>Write the answer here.</p>' },
        { q: 'Another question?', a: '<p>Write the answer here.</p>' },
      ],
    }),
  },
]

export const sectionTemplate = (type) =>
  SECTION_TEMPLATES.find((t) => t.type === type) || SECTION_TEMPLATES[0]

// Custom sections saved before templates existed have no `type`: they're text.
export const customSectionType = (section) => section?.type || 'text'

export const newCustomSection = (type = 'text') => {
  const template = sectionTemplate(type)
  return {
    id: `section-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    type: template.type,
    background: template.background || 'white',
    hidden: false,
    ...template.create(),
  }
}

// What the arrange panel calls a section.
export const sectionDisplayName = (pageKey, layout, id) => {
  const custom = layout?.custom?.find((c) => c.id === id)
  if (!custom) return sectionLabel(pageKey, id)
  const name = String(custom.title || custom.author || '').replace(/<[^>]+>/g, '').trim()
  return name || sectionTemplate(customSectionType(custom)).label
}
