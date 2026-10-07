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
    { id: 'inquiry', label: 'Inquiry' },
  ],
  'privacy-policy': BANNER_AND_BODY,
  'terms-of-service': BANNER_AND_BODY,
  'cookie-policy': BANNER_AND_BODY,
  sitemap: BANNER_AND_BODY,
}

export const sectionLabel = (pageKey, sectionId) =>
  PAGE_SECTIONS[pageKey]?.find((s) => s.id === sectionId)?.label ?? sectionId

const EMPTY_LAYOUT = Object.freeze({ hidden: {}, custom: [] })

export const getLayout = (content, layoutKey) => {
  const layout = content?.pageLayouts?.[layoutKey]
  return layout ? { hidden: layout.hidden || {}, custom: layout.custom || [] } : EMPTY_LAYOUT
}

export const isSectionHidden = (layout, sectionId) => Boolean(layout?.hidden?.[sectionId])

export const customSectionsAfter = (layout, sectionId) =>
  (layout?.custom || []).filter((section) => section.after === sectionId)

export const CUSTOM_SECTION_BACKGROUNDS = [
  { value: 'white', label: 'White' },
  { value: 'light', label: 'Light' },
  { value: 'green', label: 'Green' },
]

// Surface + text colours for each custom-section background.
const CUSTOM_SECTION_THEMES = {
  white: { surface: { bgcolor: '#fff' }, color: 'text.secondary', heading: 'primary.main' },
  light: { surface: { bgcolor: 'brand.surface' }, color: 'text.secondary', heading: 'primary.main' },
  green: {
    surface: { background: 'linear-gradient(180deg, #006600 0%, #024A01 55%, #021c02 100%)' },
    color: 'rgba(255,255,255,.85)',
    heading: '#fff',
  },
}

export const customSectionTheme = (background) => CUSTOM_SECTION_THEMES[background] || CUSTOM_SECTION_THEMES.white

export const newCustomSection = (after) => ({
  id: `section-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
  after,
  title: 'New Section',
  body: '<p>Write this section’s text here.</p>',
  image: '',
  imageSide: 'right',
  background: 'white',
  hidden: false,
})
