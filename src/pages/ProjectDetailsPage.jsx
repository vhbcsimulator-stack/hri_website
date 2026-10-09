import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link as RouterLink } from 'react-router-dom'
import { Box, Container, Typography, Stack, Button, TextField, Chip, IconButton, Dialog } from '@mui/material'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import Reveal from '../components/Reveal'
import HeroTitleReveal from '../components/HeroTitleReveal'
import TypewriterText from '../components/TypewriterText'
import usePageContent from '../hooks/usePageContent'
import MaterialSymbol from '../../shared/content/MaterialSymbol'
import { PROJECTS_PAGE_ID, projectsContentData, findProjectBySlug, projectHouseTypes } from '../../shared/content/projectsContent'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import RichParagraph from '../../shared/content/RichParagraph'
import PageSection from '../components/PageSection'
import PageSections from '../components/PageSections'
import { getLayout, projectLayoutKey } from '../../shared/content/pageLayout'

// Underlined form field styled for the dark green enquiry section.
const whiteField = {
  '& .MuiInput-root': { color: '#fff', fontSize: 16 },
  '& .MuiInput-root:before': { borderBottomColor: 'rgba(255,255,255,.5)' },
  '& .MuiInput-root:hover:not(.Mui-disabled):before': { borderBottomColor: '#fff' },
  '& .MuiInput-root:after': { borderBottomColor: '#fff' },
  '& label': { color: 'rgba(255,255,255,.85)' },
  '& label.Mui-focused': { color: '#fff' },
}

export default function ProjectDetailsPage() {
  const [params] = useSearchParams()
  const slug = params.get('slug')
  const content = usePageContent(PROJECTS_PAGE_ID, projectsContentData)
  const projects = content.projects || []
  // Fall back to the first project so a missing/legacy link still renders.
  // A renamed project is still found by its old slug, so existing links work.
  const project = findProjectBySlug(projects, slug) || projects[0]
  const layout = getLayout(content, projectLayoutKey(project?.slug))

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const onForm = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const bgRef = useRef(null)
  const contentRef = useRef(null)

  // Scroll-driven parallax: the hero image slowly zooms while the foreground
  // content lifts faster and fades. Driven via rAF to avoid re-renders.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const p = Math.min(window.scrollY / window.innerHeight, 1)
        if (bgRef.current) bgRef.current.style.transform = `scale(${1 + p * 0.35}) translateY(${p * 50}px)`
        if (contentRef.current) {
          contentRef.current.style.transform = `translateY(${p * -80}px)`
          contentRef.current.style.opacity = String(1 - p * 1.3)
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  if (!project) {
    return (
      <Container sx={{ py: 20, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontSize: 30, mb: 2 }}>Project not found</Typography>
        <Button variant="contained" component={RouterLink} to="/projects">Back to Projects</Button>
      </Container>
    )
  }

  const { hero, intro, gallery, features, inquiry } = project
  const houseTypes = projectHouseTypes(project)

  return (
    <PageSections pageKey="project-details" layout={layout}>
      <PageSection id="hero" layout={layout}>
      {/* Hero */}
      <Box sx={{ position: 'relative', color: '#fff', pt: { xs: 14, md: 16 }, pb: { xs: 8, md: 10 }, textAlign: 'center', overflow: 'hidden' }}>
        <Box ref={bgRef} aria-hidden sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${project.cover || hero.image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#052905', transformOrigin: 'center 40%', willChange: 'transform' }} />
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,20,2,.6) 0%, rgba(2,20,2,.4) 50%, rgba(2,20,2,.72) 100%)' }} />
        <Container ref={contentRef} sx={{ position: 'relative', zIndex: 2, willChange: 'transform, opacity, filter' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', mb: 2.5 }}>
            <Stack direction="row" sx={{ gridColumn: 2, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1.25 }}>
              <Chip label={project.status} size="small" sx={{ bgcolor: 'primary.main', color: '#fff', fontWeight: 600 }} />
              <Chip icon={<PlaceOutlinedIcon sx={{ fontSize: 16, color: '#fff !important' }} />} label={project.location} size="small"
                sx={{ bgcolor: 'rgba(255,255,255,.16)', color: '#fff', fontWeight: 500, backdropFilter: 'blur(4px)' }} />
            </Stack>
          </Box>
          <Box sx={{ position: 'relative', mb: 2, minHeight: { xs: 40, md: 48 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button
              size="small"
              component={RouterLink}
              to="/projects"
              aria-label="Back to projects"
              sx={{
                position: 'absolute',
                left: { xs: -8, sm: 0, md: 100 },
                minWidth: 0,
                color: '#fff',
                '&:hover': { color: 'rgba(255,255,255,0.50)' },
              }}
            >
              <ArrowBackIosIcon sx={{ fontSize: { xs: 20, md: 35 } }} />
            </Button>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 28, sm: 34, md: 60 },
                fontWeight: 800,
                mb: 0,
                textAlign: 'center',
                px: { xs: 5, md: 0 },
                overflowWrap: 'anywhere',
              }}
            >
              <HeroTitleReveal>{project.title}</HeroTitleReveal>
            </Typography>
          </Box>
          <RichParagraph value={project.summary} sx={{ maxWidth: 640, mx: 'auto', fontSize: { xs: 14.5, md: 17 }, fontWeight: 300, color: 'rgba(255,255,255,.9)', mb: 4 }} />
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 1.5 }}>
            <Button variant="contained" color="primary" size="large" href="#inquire">
              {hero.primaryCta}
            </Button>
            <Button variant="outlined" size="large" href="#features"
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,.6)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.12)' } }}>
              {hero.secondaryCta}
            </Button>
          </Stack>
        </Container>
      </Box>
      </PageSection>

      <PageSection id="intro" layout={layout}>
      {/* A place to call home */}
      <Reveal variant="right">
      <Box component="section" sx={{ py: { xs: 7, md: 11 } }}>
        <Container>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 6, md: 8 }, alignItems: 'center' }}>
            <Box>
              <Typography sx={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: 13, fontWeight: 600, color: 'primary.main', mb: 2 }}>
                <TypewriterText speed={50}>{intro.eyebrow}</TypewriterText>
              </Typography>
              <RichParagraph value={intro.description} sx={{ color: 'text.secondary', fontSize: 16, mb: 3 }} />
              <RichParagraph value={intro.quote} sx={{ borderLeft: '3px solid', borderColor: 'primary.main', pl: 2, color: 'text.primary', fontStyle: 'italic', mb: 3.5 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                {intro.details.map((d, i) => (
                  <Box key={i} sx={{
                    p: 2, borderRadius: 2, cursor: 'default',
                    transition: 'transform .28s ease, background-color .28s ease, border-color .28s ease, box-shadow .28s ease',
                    '&:hover': { transform: 'translateY(-4px)', bgcolor: 'brand.surface' },
                  }}>
                    <Typography sx={{ color: 'secondary.main', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', mb: .75 }}>{d.title}</Typography>
                    <RichParagraph value={d.copy} sx={{ color: 'text.secondary', fontSize: 13.5 }} />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Framed image */}
            <Box sx={{ position: 'relative', px: { xs: 0, md: 3 }, py: 3 }}>
              <Box aria-hidden sx={{ position: 'absolute', top: 0, left: { xs: 0, md: 8 }, width: '62%', height: '58%', border: '2px solid', borderColor: 'text.primary', borderRadius: 2, display: { xs: 'none', md: 'block' } }} />
              <Box aria-hidden sx={{ position: 'absolute', bottom: 0, right: 8, width: '30%', height: '38%', bgcolor: 'secondary.main', borderRadius: 2, display: { xs: 'none', md: 'block' } }} />
              <Box sx={{
                position: 'relative', height: { xs: 260, md: 380 }, borderRadius: 2, overflow: 'hidden',
                '&::before': {
                  content: '""', position: 'absolute', inset: 0,
                  backgroundImage: `url(${intro.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  transition: 'transform .7s cubic-bezier(.2,.7,.2,1)',
                },
                '&:hover::before': { transform: 'scale(1.08)' },
              }} />
            </Box>
          </Box>
        </Container>
      </Box>
      </Reveal>
      </PageSection>

      <PageSection id="gallery" layout={layout}>
      {/* Gallery */}
      <Reveal variant="zoom">
      <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'brand.surface' }}>
        <Container>
          <Stack sx={{ mb: 5, alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h2" sx={{ color: 'primary.main', fontSize: { xs: 30, md: 40 } }}>{gallery.title}</Typography>
            <RichParagraph value={gallery.description} sx={{ mt: 1.5, color: 'text.secondary', fontSize: 15.5, maxWidth: 700 }} />
          </Stack>
          <ExpandingGallery items={gallery.items} />
        </Container>
      </Box>
      </Reveal>
      </PageSection>

      <PageSection id="features" layout={layout}>
      {/* Key Features */}
      <Reveal variant="up">
      <Box component="section" id="features" sx={{ py: { xs: 8, md: 12 } }}>
        <Container>
          <Typography variant="h2" sx={{ textAlign: 'center', color: 'text.primary', fontSize: { xs: 28, md: 38 }, mb: 6 }}>
            {features.title}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            {features.items.map((f, i) => (
              <Box key={i} sx={{
                position: 'relative', borderRadius: 2.5, p: { xs: 3, md: 4 }, cursor: 'default',
                bgcolor: f.dark ? 'brand.greenDark' : 'brand.surface',
                color: f.dark ? '#fff' : 'text.primary',
                border: f.dark ? '1px solid transparent' : '1px solid', borderColor: 'brand.line',
                transition: 'transform .3s ease, box-shadow .3s ease, border-color .3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  borderColor: f.dark ? 'transparent' : 'rgba(0,102,0,.3)',
                },
                '&:hover .featIcon': { transform: 'scale(1.12) rotate(-4deg)', bgcolor: f.dark ? '#fff' : 'primary.main', color: f.dark ? 'primary.main' : '#fff' },
              }}>
                <Box className="featIcon" sx={{
                  position: 'absolute', top: 24, right: 24, width: 40, height: 40, borderRadius: 1.5,
                  bgcolor: f.dark ? 'rgba(255,255,255,.15)' : '#fff', color: f.dark ? '#fff' : 'primary.main',
                  display: 'grid', placeItems: 'center',
                  transition: 'transform .3s ease, background-color .3s ease, color .3s ease',
                }}>
                  <MaterialSymbol name={f.icon} sx={{ fontSize: 24 }} />
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 21 }, textTransform: 'uppercase', letterSpacing: '.4px', mb: 1.5, pr: 6 }}>
                  {f.title}
                </Typography>
                <RichParagraph value={f.copy} sx={{ fontSize: 15, color: f.dark ? 'rgba(255,255,255,.82)' : 'text.secondary', maxWidth: '90%' }} />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
      </Reveal>
      </PageSection>

      <PageSection id="houseTypes" layout={layout}>
      {/* House Types */}
      <Reveal variant="up">
      <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'brand.surface' }}>
        <Container>
          <Stack sx={{ mb: 5, alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h2" sx={{ color: 'primary.main', fontSize: { xs: 28, md: 38 } }}>{houseTypes.title}</Typography>
            <RichParagraph value={houseTypes.description} sx={{ mt: 1.5, color: 'text.secondary', fontSize: 15.5, maxWidth: 700 }} />
          </Stack>
          <HouseTypesGallery items={houseTypes.items} />
        </Container>
      </Box>
      </Reveal>
      </PageSection>

      <PageSection id="inquiry" layout={layout}>
      {/* Begin your journey */}
      <Reveal variant="left">
      <Box component="section" id="inquire" sx={{ py: { xs: 8, md: 11 }, background: 'linear-gradient(180deg, #006600 0%, #024A01 55%, #021c02 100%)', color: '#fff' }}>
        <Container>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' }, gap: { xs: 5, md: 8 } }}>
            <Box>
              <Typography variant="h2" sx={{ color: '#fff', fontSize: { xs: 26, md: 34 }, mb: 2 }}>
                {inquiry.title}
              </Typography>
              <RichParagraph value={inquiry.description} sx={{ color: 'rgba(255,255,255,.82)', fontSize: 15.5, fontWeight: 300, maxWidth: 420 }} />
            </Box>
            <Box component="form" onSubmit={(e) => e.preventDefault()}>
              <Stack spacing={3.5}>
                <TextField variant="standard" label="Full Name" value={form.name} onChange={onForm('name')} fullWidth sx={whiteField} />
                <TextField variant="standard" label="Email Address *" value={form.email} onChange={onForm('email')} fullWidth sx={whiteField} />
                <TextField variant="standard" label="Contact Number *" value={form.phone} onChange={onForm('phone')} fullWidth sx={whiteField} />
                <TextField variant="standard" label="Message (optional)" value={form.message} onChange={onForm('message')} fullWidth multiline minRows={2} sx={whiteField} />
                <Button type="submit" variant="outlined" size="large"
                  sx={{ alignSelf: 'flex-start', color: '#fff', borderColor: 'rgba(255,255,255,.6)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.12)' } }}>
                  Submit
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
      </Reveal>
      </PageSection>
    </PageSections>
  )
}

// Expanding gallery: click a panel to enlarge it while the others shrink.
function ExpandingGallery({ items }) {
  const [active, setActive] = useState(0)

  return (
    <Box sx={{
      display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2,
      height: { md: 440 },
    }}>
      {items.map((it, i) => {
        const isActive = i === active
        return (
          <Box
            key={i}
            onClick={() => setActive(i)}
            role="button"
            aria-label={it.label}
            sx={{
              position: 'relative', overflow: 'hidden', borderRadius: 2, cursor: 'pointer',
              backgroundColor: '#0c3d0c', minWidth: 0,
              flexGrow: { xs: 0, md: isActive ? 3.4 : 1 },
              flexShrink: { xs: 0, md: 1 },
              flexBasis: { xs: 'auto', md: 0 },
              height: { xs: isActive ? 300 : 120, md: 'auto' },
              transition: 'flex-grow .6s cubic-bezier(.2,.7,.2,1), height .6s cubic-bezier(.2,.7,.2,1), box-shadow .5s ease',
              '&::before': {
                content: '""', position: 'absolute', inset: 0,
                backgroundImage: `url(${it.src})`, backgroundSize: 'cover', backgroundPosition: 'center',
                transition: 'transform .7s cubic-bezier(.2,.7,.2,1), filter .5s ease',
                filter: isActive ? 'none' : 'brightness(.7)',
              },
              '&::after': {
                content: '""', position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(3,40,3,.8))',
                opacity: isActive ? 1 : 0, transition: 'opacity .5s ease',
              },
              '&:hover::before': { transform: 'scale(1.06)', filter: 'none' },
            }}
          >
            {/* vertical label for collapsed panels */}
            <Typography aria-hidden sx={{
              position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
              writingMode: 'vertical-rl', color: '#fff', fontWeight: 600, fontSize: 12, letterSpacing: '1px',
              opacity: isActive ? 0 : 1, transition: 'opacity .3s ease',
              display: { xs: 'none', md: 'block' }, textShadow: '0 1px 6px rgba(0,0,0,.5)',
            }}>
              {it.label}
            </Typography>

            {/* caption for the active panel */}
            <Box sx={{
              position: 'absolute', left: 0, right: 0, bottom: 0, p: { xs: 2, md: 3 }, zIndex: 2, color: '#fff',
              opacity: isActive ? 1 : 0, transform: isActive ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity .5s ease .1s, transform .5s ease .1s',
            }}>
              <Typography sx={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#a8ffa8', mb: .5 }}>
                Gallery
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 } }}>{it.label}</Typography>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

const pad = (n) => String(n).padStart(2, '0')

// House-type showcase: a numbered selector beside a cross-fading photo stage,
// with a thumbnail strip for the selected type's photos.
function HouseTypesGallery({ items }) {
  const [active, setActive] = useState(0)
  const [photo, setPhoto] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  // Freeze the page behind the enlarged photo. The dialog's own scroll lock
  // isn't enough: the site's smooth-scroll handler and iOS Safari both still
  // move the page, so swallow wheel and one-finger touch scrolling before
  // anything else sees them. Pinch-zoom (two fingers) is left alone.
  useEffect(() => {
    if (!zoomed) return undefined
    const block = (e) => {
      if (e.type === 'touchmove' && e.touches.length > 1) return
      e.preventDefault()
      e.stopPropagation()
    }
    const opts = { capture: true, passive: false }
    window.addEventListener('wheel', block, opts)
    window.addEventListener('touchmove', block, opts)
    return () => {
      window.removeEventListener('wheel', block, opts)
      window.removeEventListener('touchmove', block, opts)
    }
  }, [zoomed])

  const type = items[Math.min(active, items.length - 1)]
  if (!type) return null
  const images = type.images
  const shown = Math.min(photo, Math.max(images.length - 1, 0))

  const select = (i) => { setActive(i); setPhoto(0) }
  const step = (d) => setPhoto((p) => (p + d + images.length) % images.length)
  const arrow = {
    bgcolor: 'rgba(255,255,255,.16)', color: '#fff', backdropFilter: 'blur(4px)',
    '&:hover': { bgcolor: 'rgba(255,255,255,.32)' },
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '360px 1fr' }, gap: { xs: 3, md: 5 }, alignItems: 'start' }}>
      {/* Selector */}
      <Stack>
        {items.map((it, i) => {
          const isActive = i === active
          return (
            <Box
              key={i}
              component="button"
              type="button"
              onClick={() => select(i)}
              aria-pressed={isActive}
              sx={{
                display: 'flex', gap: 2.5, alignItems: 'flex-start', width: '100%', textAlign: 'left',
                font: 'inherit', cursor: 'pointer', bgcolor: isActive ? '#fff' : 'transparent',
                border: 0, borderLeft: '3px solid', borderColor: isActive ? 'primary.main' : 'brand.line',
                borderRadius: '0 8px 8px 0', py: 2.25, px: 2.5,
                transition: 'background-color .3s ease, border-color .3s ease',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '.4px', color: isActive ? 'text.primary' : 'text.secondary' }}>
                  {it.title}
                </Typography>
                <Box sx={{
                  display: 'grid', gridTemplateRows: isActive ? '1fr' : '0fr', opacity: isActive ? 1 : 0,
                  transition: 'grid-template-rows .45s ease, opacity .45s ease',
                }}>
                  <Box sx={{ overflow: 'hidden' }}>
                    <RichParagraph value={it.copy} sx={{ fontSize: 14, color: 'text.secondary', mt: 1 }} />
                  </Box>
                </Box>
              </Box>
            </Box>
          )
        })}
      </Stack>

      {/* Stage */}
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ position: 'relative', height: { xs: 280, sm: 360, md: 460 }, borderRadius: 2, overflow: 'hidden', bgcolor: '#0c3d0c' }}>
          {images.map((src, i) => (
            <Box key={`${active}-${i}`} aria-hidden sx={{
              position: 'absolute', inset: 0, backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: i === shown ? 1 : 0, transform: i === shown ? 'scale(1)' : 'scale(1.06)',
              transition: 'opacity .7s ease, transform 1.4s cubic-bezier(.2,.7,.2,1)',
            }} />
          ))}
          <Box aria-hidden sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(3,40,3,.85))' }} />
          {images.length > 0 && (
            <IconButton aria-label={`Enlarge ${type.title} photo`} onClick={() => setZoomed(true)}
              sx={{ position: 'absolute', top: 12, left: 12, width: 36, height: 36, color: '#fff', bgcolor: 'rgba(0,0,0,.35)', backdropFilter: 'blur(4px)', '&:hover': { bgcolor: 'rgba(0,0,0,.55)' } }}>
              <OpenInFullIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
          {images.length > 0 && (
            <Typography sx={{ position: 'absolute', top: 16, right: 18, color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: '1px', textShadow: '0 1px 6px rgba(0,0,0,.5)' }}>
              {pad(shown + 1)} / {pad(images.length)}
            </Typography>
          )}
          <Box sx={{ position: 'absolute', left: 0, bottom: 0, p: { xs: 2, md: 3 }, color: '#fff' }}>
            <Typography sx={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#a8ffa8', mb: .5 }}>
              House Type {pad(active + 1)}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: 20, md: 28 } }}>{type.title}</Typography>
          </Box>
          {images.length > 1 && (
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', right: { xs: 12, md: 20 }, bottom: { xs: 12, md: 20 } }}>
              <IconButton aria-label="Previous photo" onClick={() => step(-1)} sx={arrow}><ChevronLeftIcon /></IconButton>
              <IconButton aria-label="Next photo" onClick={() => step(1)} sx={arrow}><ChevronRightIcon /></IconButton>
            </Stack>
          )}
        </Box>

        {images.length > 1 && (
          <Stack direction="row" spacing={1.5} sx={{ mt: 2, overflowX: 'auto', pb: .5 }}>
            {images.map((src, i) => (
              <Box
                key={`${active}-${i}`}
                component="button"
                type="button"
                onClick={() => setPhoto(i)}
                aria-label={`${type.title} photo ${i + 1}`}
                aria-pressed={i === shown}
                sx={{
                  flex: '0 0 auto', width: { xs: 76, md: 104 }, height: { xs: 52, md: 68 }, p: 0, cursor: 'pointer',
                  borderRadius: 1.5, border: '2px solid', borderColor: i === shown ? 'primary.main' : 'transparent',
                  backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  opacity: i === shown ? 1 : .6, transition: 'opacity .3s ease, border-color .3s ease',
                  '&:hover': { opacity: 1 },
                }}
              />
            ))}
          </Stack>
        )}
      </Box>

      {/* Enlarged view */}
      <Dialog
        open={zoomed && images.length > 0}
        onClose={() => setZoomed(false)}
        maxWidth={false}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') step(-1)
          if (e.key === 'ArrowRight') step(1)
        }}
        slotProps={{
          backdrop: { sx: { bgcolor: 'rgba(2,20,2,.92)' } },
          paper: { sx: { bgcolor: 'transparent', boxShadow: 'none', m: { xs: 1, md: 4 }, overflow: 'visible', alignItems: 'center' } },
        }}
      >
        <IconButton aria-label="Close" onClick={() => setZoomed(false)}
          sx={{ ...arrow, position: 'fixed', top: { xs: 12, md: 24 }, right: { xs: 12, md: 24 } }}>
          <CloseIcon />
        </IconButton>
        {/* Same cross-fade and settle-in zoom as the stage. */}
        <Box sx={{ position: 'relative', width: { xs: '94vw', md: '86vw' }, height: { xs: '70vh', md: '80vh' }, overflow: 'hidden' }}>
          {images.map((src, i) => (
            <Box key={`${active}-${i}`} component="img" src={src} alt={i === shown ? `${type.title} photo ${i + 1}` : ''} aria-hidden={i !== shown}
              sx={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain',
                opacity: i === shown ? 1 : 0, transform: i === shown ? 'scale(1)' : 'scale(1.06)',
                transition: 'opacity .7s ease, transform 1.4s cubic-bezier(.2,.7,.2,1)',
              }} />
          ))}
        </Box>
        <Stack direction="row" sx={{ mt: 2, alignItems: 'center', gap: 2, color: '#fff' }}>
          {images.length > 1 && <IconButton aria-label="Previous photo" onClick={() => step(-1)} sx={arrow}><ChevronLeftIcon /></IconButton>}
          <Typography sx={{ fontWeight: 600, fontSize: 15, textAlign: 'center' }}>
            {type.title}
            <Box component="span" sx={{ ml: 1.5, color: 'rgba(255,255,255,.65)', fontWeight: 400 }}>{pad(shown + 1)} / {pad(images.length)}</Box>
          </Typography>
          {images.length > 1 && <IconButton aria-label="Next photo" onClick={() => step(1)} sx={arrow}><ChevronRightIcon /></IconButton>}
        </Stack>
      </Dialog>
    </Box>
  )
}
