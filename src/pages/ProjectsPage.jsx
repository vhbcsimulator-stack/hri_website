import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Box, Container, Typography, Stack, Button, TextField, MenuItem, InputAdornment, Chip,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import TuneIcon from '@mui/icons-material/Tune'
import Reveal from '../components/Reveal'
import HeroTitleReveal from '../components/HeroTitleReveal'
import usePageContent from '../hooks/usePageContent'
import { PROJECTS_PAGE_ID, projectsContentData } from '../../shared/content/projectsContent'

const HERO_IMG = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80'

const TYPES = ['All Types', 'Residential', 'Commercial']

// Rounded input styling for the search/filter bar, with hover + focus accents.
const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#fff', borderRadius: 2.5, transition: 'box-shadow .2s ease',
    '& fieldset': { borderColor: 'rgba(3,40,3,.15)', transition: 'border-color .2s ease' },
    '&:hover fieldset': { borderColor: 'primary.main' },
    '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 },
  },
}

// Project card used in the listing grid.
function ProjectCard({ project }) {
  return (
    <Box sx={{
      bgcolor: '#fff', borderRadius: 1, overflow: 'hidden', height: '100%',
      display: 'flex', flexDirection: 'column',
      border: '1px solid', borderColor: 'brand.line',
      transition: 'transform .35s ease, box-shadow .35s ease, border-color .35s ease',
      '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 20px -24px rgba(0, 0, 0, 0.5)', borderColor: 'transparent' },
      '&:hover .cardImg': { transform: 'scale(1.08)' },
      '&:hover .cardTitle': { color: 'primary.main' },
      '&:hover .cardExplore': { gap: 12 },
    }}>
      <Box sx={{ position: 'relative', height: { xs: 220, md: 300 }, overflow: 'hidden' }}>
        <Box className="cardImg" sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${project.cover})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform .6s ease' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.15) 0%, transparent 35%)' }} />
        <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 16, left: 16 }}>
          {project.status && (
            <Chip label={String(project.status).toUpperCase()} size="small"
              sx={{ bgcolor: 'primary.main', color: '#fff', fontWeight: 700, letterSpacing: '.5px', borderRadius: 1 }} />
          )}
        </Stack>
      </Box>
      <Box sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Stack direction="row" spacing={.75} sx={{ alignItems: 'center', color: 'text.secondary', mb: 1.25 }}>
          <PlaceOutlinedIcon sx={{ fontSize: 17, color: 'secondary.main' }} />
          <Typography sx={{ fontSize: 13.5, fontWeight: 500 }}>{project.location}</Typography>
        </Stack>
        <Typography className="cardTitle" variant="h3" sx={{ color: '#024A01', fontSize: { xs: 22, md: 28 }, fontWeight: 700, textTransform: 'uppercase', mb: 2, transition: 'color .3s ease' }}>
          {project.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 16, mb: 3 }}>{project.summary}</Typography>
        <Stack
          className="cardExplore"
          component={RouterLink} to={`/project-details?slug=${project.slug}`} direction="row" spacing={.75}
          sx={{
            mt: 'auto', alignItems: 'center',
            color: 'secondary.main', fontWeight: 700, fontSize: 15, letterSpacing: '.5px',
            textTransform: 'uppercase', textDecoration: 'underline', textUnderlineOffset: 4, width: 'fit-content',
            '&:hover': { gap: 1.5 }, transition: 'gap .25s ease',
          }}
        >
          <span>Explore Property</span>
          <ArrowForwardIcon sx={{ fontSize: 18 }} />
        </Stack>
      </Box>
    </Box>
  )
}

export default function ProjectsPage() {
  const content = usePageContent(PROJECTS_PAGE_ID, projectsContentData)
  const projects = useMemo(() => content.projects || [], [content.projects])
  const locations = useMemo(
    () => [
      'All Location',
      ...new Set(
        projects
          .map((project) => String(project.location || '').trim())
          .filter(Boolean),
      ),
    ],
    [projects],
  )

  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('All Location')
  const [type, setType] = useState('All Types')
  const bgRef = useRef(null)
  const headingRef = useRef(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return projects.filter((p) => {
      const matchesSearch = !q || [p.title, p.summary, p.location].some((f) => String(f).toLowerCase().includes(q))
      const matchesLocation = location === 'All Location' || String(p.location).trim() === location
      const matchesType = type === 'All Types' || p.type === type
      return matchesSearch && matchesLocation && matchesType
    })
  }, [projects, search, location, type])

  // Scroll-driven parallax: the hero image slowly zooms while the heading text
  // lifts faster and fades, giving the banner a layered sense of depth as you
  // scroll into the page. Driven via rAF to avoid re-renders.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const p = Math.min(window.scrollY / window.innerHeight, 1)
        if (bgRef.current) bgRef.current.style.transform = `scale(${1 + p * 0.35}) translateY(${p * 50}px)`
        if (headingRef.current) {
          headingRef.current.style.transform = `translateY(${p * -70}px)`
          headingRef.current.style.opacity = String(1 - p * 1.3)
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  return (
    <Box>
      {/* Hero + search */}
      <Box sx={{ position: 'relative', color: '#fff', pt: { xs: 14, md: 17 }, pb: { xs: 8, md: 11 }, overflow: 'hidden' }}>
        <Box ref={bgRef} aria-hidden sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${HERO_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#052905', transformOrigin: 'center 40%', willChange: 'transform' }} />
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,20,2,.6) 0%, rgba(2,20,2,.45) 50%, rgba(2,20,2,.7) 100%)' }} />
        <Container sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Box ref={headingRef} sx={{ willChange: 'transform, opacity' }}>
            <Typography variant="h1" sx={{ fontSize: { xs: 44, md: 84 }, fontWeight: 800, mb: 2 }}>
              <HeroTitleReveal>Our Projects</HeroTitleReveal>
            </Typography>
            <Typography sx={{ maxWidth: 760, mx: 'auto', fontSize: { xs: 15, md: 18 }, fontWeight: 300, color: 'rgba(255,255,255,.9)', mb: 5 }}>
              Explore thoughtfully planned residential, leisure, and commercial property developments designed
              to support different lifestyles, business goals, and long-term plans.
            </Typography>
          </Box>

          {/* Search bar */}
          <Box sx={{
            bgcolor: 'rgba(255,255,255,.96)', borderRadius: 4, p: { xs: 1.75, md: 2 },
            maxWidth: 980, mx: 'auto',
            border: '1px solid rgba(255,255,255,.5)',
            display: 'grid', gap: 1.5, alignItems: 'center',
            gridTemplateColumns: { xs: '1fr', md: '1.6fr 1fr 1fr auto' },
            ...fieldStyles,
          }}>
            <TextField
              placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)}
              size="small"
              slotProps={{ input: { startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: 'primary.main' }} /></InputAdornment>) } }}
            />
            <TextField select size="small" value={location} onChange={(e) => setLocation(e.target.value)}
              slotProps={{ input: { startAdornment: (<InputAdornment position="start"><PlaceOutlinedIcon sx={{ color: 'primary.main', fontSize: 20 }} /></InputAdornment>) } }}>
              {locations.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </TextField>
            <TextField select size="small" value={type} onChange={(e) => setType(e.target.value)}
              slotProps={{ input: { startAdornment: (<InputAdornment position="start"><HomeWorkOutlinedIcon sx={{ color: 'primary.main', fontSize: 20 }} /></InputAdornment>) } }}>
              {TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <Button variant="contained" color="primary" startIcon={<TuneIcon />}
              onClick={() => { setSearch(''); setLocation('All Location'); setType('All Types') }}
              sx={{ py: 1.4, px: 3.5, whiteSpace: 'nowrap', fontWeight: 700 }}>
              Reset Filters
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Listing */}
      <Reveal variant="up">
      <Box component="section" sx={{ py: { xs: 7, md: 11 } }}>
        <Container>
          {filtered.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant="h3" sx={{ color: 'primary.main', fontSize: 24, mb: 1 }}>No matching projects</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Try adjusting your search or filters.</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 4, md: 6 } }}>
              {filtered.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </Box>
          )}

          {/* Ready to invest CTA */}
          <Box sx={{ textAlign: 'center', mt: { xs: 8, md: 11 } }}>
            <Typography variant="h3" sx={{ color: 'primary.main', fontSize: 28, fontWeight: 700, mb: 1.5 }}>
              Ready to Invest?
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 16, maxWidth: 380, mx: 'auto', mb: 3 }}>
              Explore property opportunities that match your goals.
            </Typography>
            <Button variant="outlined" color="primary" size="large" component={RouterLink} to="/contact">
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>
      </Reveal>
    </Box>
  )
}
