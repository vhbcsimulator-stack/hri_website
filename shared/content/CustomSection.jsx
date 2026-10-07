import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import { Link as RouterLink } from 'react-router-dom'
import RichParagraph from './RichParagraph'
import MaterialSymbol from './MaterialSymbol'
import { customSectionTheme, customSectionType } from './pageLayout'

// Admin-added page sections, one layout per template. Every editable piece is
// drawn through `ui`, so the public site (plain output, the default below) and
// the admin editor (editable fields + add/remove controls) share one design.
//
// ui.text / ui.rich   — a plain or rich-text field at `path` within the section
// ui.icon             — the icon picker for a Material Symbol at `path`
// ui.imageButton      — a "change image" control laid over an image at `path`
// ui.removeItem       — a delete control for item `index` of the list at `path`
// ui.addItem          — an "add" button appending `template` to the list at `path`
// ui.editing          — true while the admin is in edit mode
const plainUi = {
  editing: false,
  text: ({ value, sx, variant, component }) => (value
    ? <Typography variant={variant} component={component} sx={sx}>{value}</Typography>
    : null),
  rich: ({ value, sx }) => (value ? <RichParagraph value={value} sx={sx} /> : null),
  icon: () => null,
  imageButton: () => null,
  removeItem: () => null,
  addItem: () => null,
}

const headingSx = (t, center) => ({ color: t.heading, fontSize: { xs: 28, md: 38 }, textAlign: center ? 'center' : 'left' })

// Title + optional intro, shared by the list-style templates.
function SectionHeading({ section, ui, t, center = true }) {
  return (
    <Box sx={{ mb: { xs: 4, md: 5.5 }, textAlign: center ? 'center' : 'left' }}>
      {ui.text({ value: section.title, path: 'title', variant: 'h2', placeholder: 'Section heading', sx: headingSx(t, center) })}
      {(ui.editing || section.intro) && (
        <Box sx={{ mt: 1.5, maxWidth: 680, mx: center ? 'auto' : 0 }}>
          {ui.rich({ value: section.intro, path: 'intro', placeholder: 'Intro text (optional)', sx: { color: t.color, fontSize: 16 } })}
        </Box>
      )}
    </Box>
  )
}

function ItemBox({ ui, path, index, sx, children }) {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      {ui.removeItem({ path, index })}
      {children}
    </Box>
  )
}

function TextTemplate({ section, ui, t }) {
  const hasImage = Boolean(section.image)
  return (
    <Box sx={{
      display: 'grid', alignItems: 'center', gap: { xs: 4, md: 7 },
      gridTemplateColumns: { xs: '1fr', md: hasImage ? '1fr 1fr' : '1fr' },
      maxWidth: hasImage ? 'none' : 820, mx: 'auto',
    }}>
      <Box sx={{ order: { md: section.imageSide === 'left' ? 2 : 1 } }}>
        {ui.text({ value: section.title, path: 'title', variant: 'h2', placeholder: 'Section heading', sx: { ...headingSx(t, false), mb: 2.5 } })}
        {ui.rich({ value: section.body, path: 'body', placeholder: 'Section text', sx: { color: t.color, fontSize: 16, lineHeight: 1.75 } })}
      </Box>
      {hasImage && (
        <Box sx={{ position: 'relative', order: { md: section.imageSide === 'left' ? 1 : 2 } }}>
          <Box component="img" src={section.image} alt="" loading="lazy"
            sx={{ display: 'block', width: '100%', height: { xs: 260, md: 380 }, objectFit: 'cover', borderRadius: 2 }} />
          {ui.imageButton({ value: section.image, path: 'image' })}
        </Box>
      )}
    </Box>
  )
}

function CardsTemplate({ section, ui, t }) {
  const items = section.items || []
  return (
    <>
      <SectionHeading section={section} ui={ui} t={t} />
      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: `repeat(${Math.min(Math.max(items.length, 1), 4)}, 1fr)` } }}>
        {items.map((item, i) => (
          <ItemBox key={i} ui={ui} path="items" index={i}
            sx={{ ...t.card, borderRadius: 2, p: 3.5, textAlign: 'center', transition: 'transform .28s ease', '&:hover': { transform: 'translateY(-6px)' } }}>
            <Box sx={{ color: t.heading === '#fff' ? '#a8ffa8' : 'primary.main', mb: 1.5 }}>
              <MaterialSymbol name={item.icon} sx={{ fontSize: 36 }} />
            </Box>
            {ui.text({ value: item.title, path: `items.${i}.title`, placeholder: 'Card title',
              sx: { fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '.4px', color: t.card.heading, mb: 1 } })}
            {ui.rich({ value: item.copy, path: `items.${i}.copy`, placeholder: 'Card text', sx: { fontSize: 14, color: t.card.color, lineHeight: 1.6 } })}
            {ui.icon({ value: item.icon, path: `items.${i}.icon` })}
          </ItemBox>
        ))}
      </Box>
      {ui.addItem({ path: 'items', label: 'Add card', template: { icon: 'star', title: 'New Card', copy: 'Describe this.' } })}
    </>
  )
}

function ImageCardsTemplate({ section, ui, t }) {
  const items = section.items || []
  return (
    <>
      <SectionHeading section={section} ui={ui} t={t} />
      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: `repeat(${Math.min(Math.max(items.length, 1), 4)}, 1fr)` } }}>
        {items.map((item, i) => (
          <ItemBox key={i} ui={ui} path="items" index={i} sx={{
            height: { xs: 320, md: 400 }, borderRadius: 1.5, overflow: 'hidden', bgcolor: '#0c3d0c',
            display: 'flex', alignItems: 'flex-end', color: '#fff',
            boxShadow: '0 12px 28px -14px rgba(0,0,0,.4)',
            '&::before': {
              content: '""', position: 'absolute', inset: 0,
              backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
              transition: 'transform .6s ease',
            },
            '&::after': {
              content: '""', position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.35) 45%, transparent 70%)',
            },
            '&:hover::before': { transform: 'scale(1.08)' },
          }}>
            {ui.imageButton({ value: item.image, path: `items.${i}.image`, sx: { top: 12, right: 'auto', left: 12 } })}
            <Box sx={{ position: 'relative', zIndex: 2, p: 3, width: '100%' }}>
              {ui.text({ value: item.label, path: `items.${i}.label`, placeholder: 'Label',
                sx: { fontWeight: 800, fontSize: { xs: 16, md: 18 }, textTransform: 'uppercase', letterSpacing: '.5px', color: '#fff' } })}
              {(ui.editing || item.copy) && (
                <Box sx={{ mt: .75 }}>
                  {ui.rich({ value: item.copy, path: `items.${i}.copy`, placeholder: 'Short text (optional)', sx: { fontSize: 14, color: 'rgba(255,255,255,.85)' } })}
                </Box>
              )}
            </Box>
          </ItemBox>
        ))}
      </Box>
      {ui.addItem({ path: 'items', label: 'Add photo card', template: { image: items[0]?.image || '', label: 'New Card', copy: '' } })}
    </>
  )
}

function StepsTemplate({ section, ui, t }) {
  const items = section.items || []
  return (
    <>
      <SectionHeading section={section} ui={ui} t={t} />
      <Box sx={{ display: 'grid', gap: { xs: 4, md: 3 }, gridTemplateColumns: { xs: '1fr 1fr', md: `repeat(${Math.min(Math.max(items.length, 1), 6)}, 1fr)` } }}>
        {items.map((item, i) => (
          <ItemBox key={i} ui={ui} path="items" index={i} sx={{ textAlign: 'center', px: 1 }}>
            <Box sx={{
              width: 44, height: 44, borderRadius: '50%', mx: 'auto', mb: 2, display: 'grid', placeItems: 'center',
              bgcolor: t.heading === '#fff' ? '#fff' : 'secondary.main', color: t.heading === '#fff' ? 'primary.dark' : '#fff',
              fontWeight: 700, fontSize: 14,
            }}>
              {String(i + 1).padStart(2, '0')}
            </Box>
            {ui.text({ value: item.title, path: `items.${i}.title`, placeholder: 'Step title', sx: { fontWeight: 700, fontSize: 15, color: t.card.heading, mb: .75 } })}
            {ui.rich({ value: item.copy, path: `items.${i}.copy`, placeholder: 'Step text', sx: { fontSize: 13.5, color: t.color, lineHeight: 1.55 } })}
          </ItemBox>
        ))}
      </Box>
      {ui.addItem({ path: 'items', label: 'Add step', template: { title: 'New Step', copy: 'Describe this step.' } })}
    </>
  )
}

function StatsTemplate({ section, ui, t }) {
  const items = section.items || []
  return (
    <>
      {(ui.editing || section.title) && <SectionHeading section={section} ui={ui} t={t} />}
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr 1fr', md: `repeat(${Math.min(Math.max(items.length, 1), 5)}, 1fr)` } }}>
        {items.map((item, i) => (
          <ItemBox key={i} ui={ui} path="items" index={i} sx={{ textAlign: 'center', py: 1 }}>
            {ui.text({ value: item.value, path: `items.${i}.value`, placeholder: '100+',
              sx: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontSize: { xs: 40, md: 54 }, lineHeight: 1.1, color: t.heading } })}
            {ui.text({ value: item.label, path: `items.${i}.label`, placeholder: 'Label',
              sx: { mt: .5, fontSize: 13, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: t.color } })}
          </ItemBox>
        ))}
      </Box>
      {ui.addItem({ path: 'items', label: 'Add stat', template: { value: '0', label: 'New Stat' } })}
    </>
  )
}

function QuoteTemplate({ section, ui, t }) {
  return (
    <Box sx={{ maxWidth: 820, mx: 'auto', textAlign: 'center' }}>
      <FormatQuoteIcon sx={{ fontSize: 56, color: t.heading === '#fff' ? '#a8ffa8' : 'primary.main', opacity: .8 }} />
      {ui.rich({ value: section.quote, path: 'quote', placeholder: 'Quote',
        sx: { fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: { xs: 22, md: 28 }, lineHeight: 1.45, color: t.heading === '#fff' ? '#fff' : 'text.primary', mb: 3 } })}
      {ui.text({ value: section.author, path: 'author', placeholder: 'Name', sx: { fontWeight: 700, color: t.heading } })}
      {ui.text({ value: section.role, path: 'role', placeholder: 'Role (optional)', sx: { fontSize: 14, color: t.color } })}
    </Box>
  )
}

function CtaTemplate({ section, ui, t }) {
  const link = section.buttonLink || '/contact'
  const internal = link.startsWith('/')
  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', textAlign: 'center' }}>
      {ui.text({ value: section.title, path: 'title', variant: 'h2', placeholder: 'Headline',
        sx: { ...headingSx(t, true), textTransform: 'none', fontWeight: 700, mb: 2 } })}
      <Box sx={{ mb: 4, maxWidth: 620, mx: 'auto' }}>
        {ui.rich({ value: section.text, path: 'text', placeholder: 'Supporting text', sx: { color: t.color, fontSize: 16 } })}
      </Box>
      <Button
        variant={t.heading === '#fff' ? 'outlined' : 'contained'}
        size="large"
        {...(ui.editing ? {} : internal ? { component: RouterLink, to: link } : { href: link, target: '_blank', rel: 'noreferrer' })}
        sx={t.heading === '#fff'
          ? { color: '#fff', borderColor: 'rgba(255,255,255,.7)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.12)' } }
          : undefined}
      >
        {ui.text({ value: section.buttonLabel, path: 'buttonLabel', component: 'span', placeholder: 'Button label', sx: { fontSize: 'inherit', fontWeight: 'inherit' } })}
      </Button>
      {ui.editing && (
        <Box sx={{ mt: 2, mx: 'auto', maxWidth: 360, p: 1.5, borderRadius: 1.5, bgcolor: '#fff', color: 'text.primary', textAlign: 'left' }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', mb: .5 }}>BUTTON LINK</Typography>
          {ui.text({ value: section.buttonLink, path: 'buttonLink', placeholder: '/contact or https://…', sx: { fontSize: 14, fontFamily: 'monospace' } })}
        </Box>
      )}
    </Box>
  )
}

function FaqTemplate({ section, ui, t }) {
  const items = section.items || []
  return (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      <SectionHeading section={section} ui={ui} t={t} />
      {items.map((item, i) => (
        <ItemBox key={i} ui={ui} path="items" index={i} sx={{ mb: 1.5 }}>
          <Accordion
            disableGutters
            elevation={0}
            defaultExpanded={ui.editing}
            sx={{ ...t.card, borderRadius: '10px !important', '&::before': { display: 'none' } }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: t.card.heading }} />} sx={{ px: 2.5 }}>
              {ui.text({ value: item.q, path: `items.${i}.q`, placeholder: 'Question', sx: { fontWeight: 700, color: t.card.heading, pr: ui.editing ? 4 : 0 } })}
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2.5, pt: 0 }}>
              {ui.rich({ value: item.a, path: `items.${i}.a`, placeholder: 'Answer', sx: { color: t.card.color, fontSize: 15 } })}
            </AccordionDetails>
          </Accordion>
        </ItemBox>
      ))}
      {ui.addItem({ path: 'items', label: 'Add question', template: { q: 'New question?', a: '<p>Answer.</p>' } })}
    </Box>
  )
}

const TEMPLATES = {
  text: TextTemplate,
  cards: CardsTemplate,
  imageCards: ImageCardsTemplate,
  steps: StepsTemplate,
  stats: StatsTemplate,
  quote: QuoteTemplate,
  cta: CtaTemplate,
  faq: FaqTemplate,
}

export default function CustomSection({ section, ui = plainUi }) {
  const t = customSectionTheme(section.background)
  const Template = TEMPLATES[customSectionType(section)] || TextTemplate
  return (
    <Box component="section" sx={{ py: { xs: 7, md: 10 }, ...t.surface }}>
      <Container>
        <Template section={section} ui={ui} t={t} />
      </Container>
    </Box>
  )
}
