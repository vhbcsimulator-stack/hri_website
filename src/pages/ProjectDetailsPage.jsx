import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link as RouterLink } from 'react-router-dom'
import { Box, Container, Typography, Stack, Button, TextField, Chip } from '@mui/material'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import Reveal from '../components/Reveal'
import HeroTitleReveal from '../components/HeroTitleReveal'
import TypewriterText from '../components/TypewriterText'
import usePageContent from '../hooks/usePageContent'
import MaterialSymbol from '../../shared/content/MaterialSymbol'
import { PROJECTS_PAGE_ID, projectsContentData } from '../../shared/content/projectsContent'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

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
  const project = projects.find((p) => p.slug === slug) || projects[0]

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

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ position: 'relative', color: '#fff', pt: { xs: 14, md: 16 }, pb: { xs: 8, md: 10 }, textAlign: 'center', overflow: 'hidden' }}>
        <Box ref={bgRef} aria-hidden sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${hero.image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#052905', transformOrigin: 'center 40%', willChange: 'transform' }} />
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
          <Typography sx={{ maxWidth: 640, mx: 'auto', fontSize: { xs: 14.5, md: 17 }, fontWeight: 300, color: 'rgba(255,255,255,.9)', mb: 4 }}>
            {hero.subtitle}
          </Typography>
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

      {/* A place to call home */}
      <Reveal variant="right">
      <Box component="section" sx={{ py: { xs: 7, md: 11 } }}>
        <Container>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 6, md: 8 }, alignItems: 'center' }}>
            <Box>
              <Typography sx={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: 13, fontWeight: 600, color: 'primary.main', mb: 2 }}>
                <TypewriterText speed={50}>{intro.eyebrow}</TypewriterText>
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 16, mb: 3 }}>
                {intro.description}
              </Typography>
              <Typography sx={{ borderLeft: '3px solid', borderColor: 'primary.main', pl: 2, color: 'text.primary', fontStyle: 'italic', mb: 3.5 }}>
                {intro.quote}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                {intro.details.map((d, i) => (
                  <Box key={i} sx={{
                    p: 2, borderRadius: 2, cursor: 'default',
                    transition: 'transform .28s ease, background-color .28s ease, border-color .28s ease, box-shadow .28s ease',
                    '&:hover': { transform: 'translateY(-4px)', bgcolor: 'brand.surface' },
                  }}>
                    <Typography sx={{ color: 'secondary.main', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', mb: .75 }}>{d.title}</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 13.5 }}>{d.copy}</Typography>
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

      {/* Gallery */}
      <Reveal variant="zoom">
      <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'brand.surface' }}>
        <Container>
          <Stack sx={{ mb: 5, alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h2" sx={{ color: 'primary.main', fontSize: { xs: 30, md: 40 } }}>{gallery.title}</Typography>
            <Typography sx={{ mt: 1.5, color: 'text.secondary', fontSize: 15.5, maxWidth: 700 }}>
              {gallery.description}
            </Typography>
          </Stack>
          <ExpandingGallery items={gallery.items} />
        </Container>
      </Box>
      </Reveal>

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
                <Typography sx={{ fontSize: 15, color: f.dark ? 'rgba(255,255,255,.82)' : 'text.secondary', maxWidth: '90%' }}>
                  {f.copy}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
      </Reveal>

      {/* Begin your journey */}
      <Reveal variant="left">
      <Box component="section" id="inquire" sx={{ py: { xs: 8, md: 11 }, background: 'linear-gradient(180deg, #006600 0%, #024A01 55%, #021c02 100%)', color: '#fff' }}>
        <Container>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' }, gap: { xs: 5, md: 8 } }}>
            <Box>
              <Typography variant="h2" sx={{ color: '#fff', fontSize: { xs: 26, md: 34 }, mb: 2 }}>
                {inquiry.title}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,.82)', fontSize: 15.5, fontWeight: 300, maxWidth: 420 }}>
                {inquiry.description}
              </Typography>
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
    </Box>
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
