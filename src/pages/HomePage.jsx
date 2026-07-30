import { useEffect, useRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  Avatar,
  IconButton,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import Reveal from '../components/Reveal'
import TypewriterText from '../components/TypewriterText'
import usePageContent from '../hooks/usePageContent'
import MaterialSymbol from '../../shared/content/MaterialSymbol'
import { HOME_PAGE_ID, homeContentData } from '../../shared/content/homeContent'

// Small icon + title + copy unit, used by the hero highlight strip and the
// dark band beneath it. `onDark` is always light-on-dark; the default is
// responsive because the strip sits over the photo below md and on the light
// field from md up.
function HeroPoint({ item, onDark }) {
  const icon = onDark ? '#a8ffa8' : { xs: '#a8ffa8', md: '#024A01' }
  const title = onDark ? '#fff' : { xs: '#fff', md: '#0d1f0d' }
  const copy = onDark ? 'rgba(255,255,255,.72)' : { xs: 'rgba(255,255,255,.8)', md: 'rgba(3,40,3,.68)' }
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
      <MaterialSymbol name={item.icon} sx={{ fontSize: 26, color: icon, flexShrink: 0, mt: '2px' }} />
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: title }}>
          {item.title}
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: 12.5, lineHeight: 1.5, color: copy }}>
          {item.copy}
        </Typography>
      </Box>
    </Stack>
  )
}

// Width of the hero photo panel, and of the hairline arc that echoes it. Both
// shapes are right-anchored, so width is what positions their left edge — the
// two have to change together or the gap between the arcs drifts.
const HERO_PANEL_WIDTH = { xs: '100%', md: '52%', lg: '60%' }
const HERO_TRACE_WIDTH = { md: 'calc(52% + 34px)', lg: 'calc(60% + 34px)' }
// The hero runs edge to edge rather than inside the theme's lg container, so
// the copy can start near the viewport edge as the design does. These paddings
// are the left inset of every row in the hero.
const HERO_GUTTER = { xs: 3, sm: 5, md: 8, lg: 10 }

// Hero banner section. Split layout: copy on a light field at left, photo
// bleeding off the right edge behind a tall convex curve, an optional stat
// card floating on the seam and an optional dark band across the base.
function Hero({ hero }) {
  const bgRef = useRef(null)
  const contentRef = useRef(null)
  const cardRef = useRef(null)
  // Rendered only when the content document supplies them, so nothing shows
  // as placeholder copy while these slots are still empty.
  const highlights = hero.highlights || []
  const bottomBar = hero.bottomBar || []
  const statCard = hero.statCard

  // Scroll-driven parallax (matches the project-details hero): the image slowly
  // zooms while the foreground content lifts faster and fades —
  // giving the banner a layered sense of depth. Driven via rAF to avoid re-renders.
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
          // contentRef.current.style.opacity = String(1 - p * 1.3)
        }
        // if (cardRef.current) {
        //   cardRef.current.style.boxShadow =
        //     `0 ${8 + p * 24}px ${24 + p * 48}px rgba(0, 35, 0, ${0.08 + p * 0.24})`
        // }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  return (
    <Box
      id="home"
      sx={{
        position: 'relative',
        minHeight: { xs: '88vh', md: '92vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: '#f7f7f3',
        overflow: 'hidden',
      }}
    >
      {/* The photo panel. The curve lives on the wrapper so the parallax
          scale/translate happens inside it and the arc stays put while the
          image moves behind it. Below md there is no room for a split, so the
          panel goes full-bleed and the copy sits over it. */}
      <Box aria-hidden sx={{
        position: 'absolute', top: 0, bottom: 0,
        // Bleeds past the right edge from md so the panel reads as a slice of
        // something larger instead of a shape pinned to the viewport.
        right: { xs: 0, md: -48 },
        width: HERO_PANEL_WIDTH,
        overflow: 'hidden',
        zIndex: 1,
        // The first value is the arc's horizontal reach. Keep it well under
        // 50%: at 46% the mid-height bulge reached far enough left to sit
        // under the body copy.
        borderRadius: { xs: 0, md: '34% 0 0 34% / 50% 0 0 50%' },
        borderLeft: 10, borderColor: '#052905', borderStyle: 'solid',
      }}>
        <Box ref={bgRef} sx={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${hero.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#052905',
          transformOrigin: 'center 55%',
          willChange: 'transform',
        }} />
        {/* Tint over the photo only — a sibling of the parallax layer, so the
            curved wrapper clips it to exactly the photo's shape and it never
            reaches the light side. Raise or lower the two alphas to taste. */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: {
            xs: 'linear-gradient(180deg, rgba(3,40,3,.55) 0%, rgba(2,20,2,.72) 100%)',
            md: 'linear-gradient(180deg, rgba(3,40,3,.10) 0%, rgba(2,20,2,.26) 100%)',
          },
        }} />
      </Box>
      {/* Hairline arc echoing the photo curve. Same shape, but wider — it is
          right-anchored, so the extra width is what pushes the visible edge
          out onto the light field. Only the left border is drawn; the other
          three are 0-width, which makes the browser paint the whole top-left
          and bottom-left radius with the left border and gives one unbroken
          arc rather than horizontal lines at the hero's top and bottom. */}
      <Box aria-hidden sx={{
        display: { xs: 'none', md: 'block' },
        position: 'absolute', top: -24, bottom: -24, pointerEvents: 'none',
        // Sits above the photo so the arc stays visible where the two shapes
        // cross near the top and bottom; below the copy container.
        zIndex: 2,
        right: -48,
        width: HERO_TRACE_WIDTH,
        borderRadius: '34% 0 0 34% / 50% 0 0 50%',
        borderStyle: 'solid',
        borderColor: 'rgba(2,74,1,.28)',
        borderWidth: '0 0 0 1.5px',
      }} />
      <Box aria-hidden sx={{
        display: { xs: 'none', md: 'block' },
        position: 'absolute', top: -24, bottom: -24, pointerEvents: 'none',
        // Sits above the photo so the arc stays visible where the two shapes
        // cross near the top and bottom; below the copy container.
        zIndex: 2,
        right: -70,
        width: HERO_TRACE_WIDTH,
        borderRadius: '34% 0 0 34% / 50% 0 0 50%',
        borderStyle: 'solid',
        borderColor: 'rgba(2,74,1,.28)',
        borderWidth: '0 0 0 1.5px',
      }} />
      {/* Extra bottom padding from md so the copy clears the absolute band. */}
      <Container maxWidth={false} ref={contentRef} sx={{
        position: 'relative', zIndex: 2, willChange: 'transform',
        px: HERO_GUTTER,
        pt: { xs: 10, sm: 12, md: 14 },
        pb: { xs: 10, sm: 12, md: bottomBar.length > 0 ? 20 : 14 },
      }}>
        <Box ref={cardRef} sx={{
          // Percentage width, so the column always clears the curve's
          // mid-height bulge instead of being nudged left by a fixed margin —
          // that overflowed the viewport on narrow screens. The card styling is
          // gone; the copy now sits directly on the light field.
          maxWidth: { xs: '100%', md: '48%', lg: '46%' },
          color: { xs: '#fff', md: 'inherit' },
        }}>
          <Typography sx={{ textTransform: 'uppercase', letterSpacing: { xs: '2.5px', md: '4px' }, fontSize: { xs: 11.5, md: 13 }, fontWeight: 500, color: 'inherit', mb: 2 }}>
            <TypewriterText speed={50}>{hero.eyebrow}</TypewriterText>
          </Typography>
          {/* 68px only from lg. At md (900px) the column is already narrow, so
              a larger size overflows between 900px and roughly 1200px. */}
          <Typography variant="h1" sx={{ fontSize: { xs: 32, sm: 44, md: 52, lg: 68 }, lineHeight: 1.08 }}>
            <Box component="span" sx={{ display: 'block', overflow: 'hidden', pb: '.08em', mb: '-.08em' }}>
              <Box
                component="span"
                sx={{
                  // Below md the copy sits over the photo, where the brand
                  // green and blue have no contrast.
                  color: { xs: '#fff', md: '#024A01' },
                  display: 'block',
                  opacity: 0,
                  animation: 'heroTitleReveal 900ms cubic-bezier(.16, 1, .3, 1) 120ms forwards',
                  '@keyframes heroTitleReveal': {
                    from: { opacity: 0, transform: 'translateY(105%)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                  '@media (prefers-reduced-motion: reduce)': {
                    opacity: 1,
                    animation: 'none',
                    transform: 'none',
                  },
                }}
              >
                {hero.title}
              </Box>
            </Box>
            <Box component="span" sx={{ display: 'block', overflow: 'hidden', pb: '.08em', mb: '-.08em' }}>
              <Box
                component="span"
                sx={{
                  display: 'block',
                  color: { xs: '#a8ffa8', md: '#0000b4' },
                  fontWeight: 700,
                  opacity: 0,
                  animation: 'heroHighlightReveal 950ms cubic-bezier(.16, 1, .3, 1) 340ms forwards',
                  '@keyframes heroHighlightReveal': {
                    from: { opacity: 0, transform: 'translateY(105%) scale(.98)' },
                    to: { opacity: 1, transform: 'translateY(0) scale(1)' },
                  },
                  '@media (prefers-reduced-motion: reduce)': {
                    opacity: 1,
                    animation: 'none',
                    transform: 'none',
                  },
                }}
              >
                {hero.titleHighlight}
              </Box>
            </Box>
          </Typography>
          {/* Rule-and-dot separating the title from the supporting copy. */}
          <Stack direction="row" spacing={1} aria-hidden sx={{ mt: { xs: 2.5, md: 3.5 }, alignItems: 'center' }}>
            <Box sx={{ width: 84, height: 3, bgcolor: { xs: '#a8ffa8', md: '#024A01' } }} />
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: { xs: '#a8ffa8', md: '#024A01' } }} />
          </Stack>
          <Typography sx={{ mt: { xs: 2, md: 3 }, maxWidth: 560, fontSize: { xs: 15, sm: 16, md: 16.5 }, fontWeight: 300, lineHeight: 1.7, color: { xs: 'rgba(255,255,255,.9)', md: '#3a463a' } }}>
            {hero.subtitle}
          </Typography>
          {/* Full-width stacked buttons on phones — side by side they drop to
              roughly 140px each and the labels wrap. */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={0}
            sx={{ mt: { xs: 3, md: 4 }, flexWrap: 'wrap', gap: 1.5, alignItems: { xs: 'stretch', sm: 'center' } }}
          >
            <Button variant="contained" color="secondary" component={RouterLink} to="/projects" size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ width: { xs: '100%', sm: 'auto' }, borderRadius: 999, px: 3.5 }}>
              {hero.primaryCta}
            </Button>
            <Button variant="outlined" component={RouterLink} to="/about" size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                width: { xs: '100%', sm: 'auto' }, borderRadius: 999, px: 3.5,
                color: { xs: '#fff', md: '#032803' },
                bgcolor: { xs: 'transparent', md: '#fff' },
                borderColor: { xs: 'rgba(255,255,255,.7)', md: 'rgba(3,40,3,.25)' },
                '&:hover': { borderColor: { xs: '#fff', md: '#032803' }, bgcolor: 'rgba(3,40,3,.12)' },
              }}>
              {hero.secondaryCta}
            </Button>
          </Stack>
          {/* Highlight strip: hairline-divided columns under the buttons. */}
          {highlights.length > 0 && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              divider={<Box sx={{ alignSelf: 'stretch', width: { sm: '1px' }, height: { xs: '1px', sm: 'auto' }, bgcolor: { xs: 'rgba(255,255,255,.25)', md: 'rgba(3,40,3,.15)' } }} />}
              spacing={2.5}
              sx={{ mt: { xs: 4, md: 6 }, maxWidth: 640 }}
            >
              {highlights.map((h) => <HeroPoint key={h.title} item={h} />)}
            </Stack>
          )}
        </Box>
      </Container>
      {/* Stat card floating on the photo, just inside the curve. Only from md —
          on phones the photo is the copy's backdrop and there is no clear
          space for it. */}
      {statCard && (
        <Card elevation={0} sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute', zIndex: 3,
          right: { md: '9%', lg: '13%' }, bottom: { md: '9%' },
          width: 262, p: 3, borderRadius: 2,
          bgcolor: 'rgba(255,255,255,.96)',
          boxShadow: '0 24px 60px -24px rgba(2,40,2,.45)',
        }}>
          <Avatar variant="rounded" sx={{ bgcolor: 'secondary.main', width: 46, height: 46, borderRadius: '50%', mb: 2 }}>
            <MaterialSymbol name={statCard.icon} />
          </Avatar>
          <Typography sx={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1, color: '#0d1f0d' }}>
            {statCard.value}
          </Typography>
          <Typography sx={{ mt: 0.5, fontWeight: 700, fontSize: 14.5, color: '#0d1f0d' }}>
            {statCard.label}
          </Typography>
          <Typography sx={{ mt: 1.25, fontSize: 12.5, lineHeight: 1.6, color: 'rgba(3,40,3,.68)' }}>
            {statCard.copy}
          </Typography>
        </Card>
      )}
      {/* Scroll cue. It lands on the seam between the light field and the
          photo, so it needs to read against both: a solid white pill carries
          the green icon over either one. zIndex clears the arc (2) and the copy
          container (2); when the dark band is present it lifts to sit above it. */}
      <IconButton
        href="#projects"
        aria-label="Scroll to featured projects"
        sx={{
          // Hidden on phones, where the copy spans the full width and the
          // chevron would land on top of it rather than in open space.
          display: { xs: 'none', sm: 'inline-flex' },
          position: 'absolute', zIndex: 5,
          bottom: bottomBar.length > 0 ? { xs: 26, md: 104 } : 26,
          left: '50%', transform: 'translateX(-50%)',
          color: '#024A01',
          bgcolor: '#fff',
          border: '1.5px solid #024A01',
          boxShadow: '0 6px 18px -6px rgba(2,40,2,.45)',
          animation: 'bob 2s ease-in-out infinite',
          '@keyframes bob': { '0%,100%': { transform: 'translate(-50%,0)' }, '50%': { transform: 'translate(-50%,8px)' } },
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          '&:hover': { bgcolor: '#024A01', color: '#fff' },
        }}>
        <KeyboardArrowDownIcon />
      </IconButton>
      {/* Dark band across the base of the hero, running under the photo curve. */}
      {bottomBar.length > 0 && (
        <Box sx={{
          position: { xs: 'static', md: 'absolute' }, left: 0, right: 0, bottom: 0, zIndex: 4,
          bgcolor: '#0d3b0d', py: { xs: 3, md: 2.75 },
        }}>
          <Container maxWidth={false} sx={{ px: HERO_GUTTER }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              divider={<Box sx={{ alignSelf: 'stretch', width: { sm: '1px' }, height: { xs: '1px', sm: 'auto' }, bgcolor: 'rgba(255,255,255,.2)' }} />}
              spacing={2.5}
            >
              {bottomBar.map((b) => <HeroPoint key={b.title} item={b} onDark />)}
            </Stack>
          </Container>
        </Box>
      )}
    </Box>
  )
}

// Reusable section heading block.
function SectionHead({ eyebrow, title, sub, center, underline }) {
  return (
    <Box sx={{ mb: 5.5, textAlign: center ? 'center' : 'left', maxWidth: center ? 700 : 'none', mx: center ? 'auto' : 0 }}>
      {eyebrow && (
        <Typography sx={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: 12.5, fontWeight: 600, color: 'primary.main', mb: 1 }}>
          <TypewriterText speed={50}>{eyebrow}</TypewriterText>
        </Typography>
      )}
      <Typography variant="h2" sx={{
        fontSize: { xs: 28, md: 40 },
        display: underline ? 'inline-block' : 'block',
        pb: underline ? 1.5 : 0,
        borderBottom: underline ? '3px solid' : 'none',
        borderColor: 'primary.main',
      }}>
        {title}
      </Typography>
      {sub && (
        <Typography sx={{ mt: 2, color: 'text.secondary', fontSize: 16 }}>
          {sub}
        </Typography>
      )}
    </Box>
  )
}

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
}

// Featured properties showcase.
function FeaturedProjects({ featured }) {
  return (
    <Box component="section" id="projects" sx={{ py: { xs: 8, md: 12 } }}>
      <Container>
        <SectionHead
          eyebrow={featured.eyebrow}
          title={featured.title}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
            },
            gap: 3.5,
          }}
        >
          {featured.items.map((p) => (
            <Card
              key={p.slug || p.title}
              elevation={0}
              component={RouterLink}
              // A card with no slug would land on `?slug=undefined`, which the
              // details page silently resolves to the first project. Send it to
              // the projects list instead.
              to={p.slug ? `/project-details?slug=${encodeURIComponent(p.slug)}` : '/projects'}
              sx={{
                textDecoration: 'none',
                position: 'relative',
                minHeight: {
                  xs: 580,
                  md: 700,
                },
                display: 'flex',
                alignItems: 'flex-end',
                borderRadius: 1,
                overflow: 'hidden',
                color: '#fff',

                boxShadow:
                  '0 18px 40px -12px rgba(0, 0, 0, 0.28)',

                transition: 'transform .35s ease',

                backgroundColor: '#0c3d0c',

                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,

                  backgroundImage: `url(${p.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',

                  transition: 'transform .5s ease',
                },

                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,

                  background: `linear-gradient(
                    200deg,
                    ${p.tint}4d,
                    transparent 55%
                  )`,
                },

                '&:hover': {
                  transform: 'translateY(-6px)',
                },

                '&:hover::before': {
                  transform: 'scale(1.06)',
                },

                '&:hover .exploreLink': {
                  gap: 1.75,
                },
              }}
            >
              {p.tag && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    zIndex: 3,

                    bgcolor: 'rgba(255, 215, 0, 0.60)',
                    color: 'rgb(20, 30, 60)',

                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',

                    px: 1.75,
                    py: 0.75,

                    borderRadius: 1.5,
                  }}
                >
                  {p.tag}
                </Box>
              )}

              {/* Dark gradient overlay */}
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: 0,

                  background: `
                    linear-gradient(
                      to top,
                      #000 0%,
                      rgba(0,0,0,.88) 22%,
                      rgba(0,0,0,.55) 40%,
                      transparent 62%
                    )
                  `,
                }}
              />

              {/* Content */}
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 2,
                  p: 4,
                  width: '100%',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: 22,
                    textTransform: 'uppercase',
                    letterSpacing: '.4px',
                  }}
                >
                  {p.title}
                </Typography>

                <Typography
                  sx={{
                    mt: 1.25,
                    fontSize: 14.5,
                    color: 'rgba(255,255,255,.85)',
                    maxWidth: '90%',
                  }}
                >
                  {p.copy}
                </Typography>

                <Stack
                  className="exploreLink"
                  direction="row"
                  spacing={1}
                  sx={{
                    mt: 2.25,
                    ml: 'auto',
                    width: 'fit-content',

                    alignItems: 'center',

                    color: '#a8ffa8',
                    fontWeight: 600,
                    fontSize: 13,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',

                    transition: 'gap .2s ease',
                  }}
                >
                  <Typography component="span">
                    Explore
                  </Typography>

                  <ArrowForwardIcon
                    sx={{
                      fontSize: 16,
                    }}
                  />
                </Stack>
              </Box>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

// About section with trust-building points.
function WhyChooseUs({ whyChooseUs }) {
  return (
    <Box component="section" id="about" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'brand.surface' }}>
      <Container>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.05fr' }, gap: { xs: 5, md: 7 }, alignItems: 'center' }}>
          <Box>
            <Typography sx={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: 12.5, fontWeight: 600, color: 'primary.main', mb: 1 }}>
              <TypewriterText speed={50}>{whyChooseUs.eyebrow}</TypewriterText>
            </Typography>
            <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 16.5, maxWidth: 460 }}>
              {whyChooseUs.description}
            </Typography>
            <Stack spacing={2.75} sx={{ mt: 4.5 }}>
              {whyChooseUs.reasons.map((r) => {
                return (
                  <Stack key={r.title} direction="row" spacing={2} sx={{
                    alignItems: 'flex-start', p: 1.5, mx: -1.5, borderRadius: 2, cursor: 'default',
                    transition: 'background .25s ease, transform .25s ease, box-shadow .25s ease',
                    '&:hover': { bgcolor: '#fff', transform: 'translateX(6px)' },
                    '&:hover .reasonIcon': { transform: 'scale(1.08) rotate(-3deg)' },
                    '&:hover .reasonTitle': { color: 'primary.main' },
                  }}>
                    <Avatar className="reasonIcon" variant="rounded" sx={{ bgcolor: 'secondary.main', width: 48, height: 48, transition: 'transform .25s ease' }}>
                      <MaterialSymbol name={r.icon} />
                    </Avatar>
                    <Box>
                      <Typography className="reasonTitle" sx={{ fontWeight: 600, fontSize: 15, textTransform: 'uppercase', letterSpacing: '.6px', transition: 'color .25s ease' }}>
                        {r.title}
                      </Typography>
                      <Typography sx={{ fontSize: 14.5, color: 'text.secondary' }}>{r.copy}</Typography>
                    </Box>
                  </Stack>
                )
              })}
            </Stack>
          </Box>
          <Box sx={{
            position: 'relative',
            '&:hover .whyImage::before': { transform: 'scale(1.08)' },
            '&:hover .whyQuote': { transform: { md: 'translateY(-6px)' } },
          }}>
            <Box className="whyImage" aria-hidden sx={{
              height: { xs: 320, md: 420 }, borderRadius: 1, position: 'relative', overflow: 'hidden',
              backgroundColor: '#1c1712',
              '&::before': {
                content: '""', position: 'absolute', inset: 0,
                backgroundImage: `url(${whyChooseUs.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                transition: 'transform .6s ease',
              },
            }} />
            <Card className="whyQuote" elevation={0} sx={{
              mt: { xs: 2, md: 0 },
              position: { xs: 'static', md: 'absolute' }, right: 0, bottom: -28,
              maxWidth: { md: 320 }, p: 2.5, borderRadius: 2,
              borderLeft: '4px solid', borderColor: 'primary.main',
              transition: 'transform .3s ease',
            }}>
              <Typography sx={{ fontSize: 14, color: 'text.primary' }}>
                {whyChooseUs.quote}
              </Typography>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

// Feature-focused spotlight section.
function PropertyFeatures({ propertyFeatures }) {
  return (
    <Box component="section" sx={{
      position: 'relative', py: { xs: 9, md: 12.5 }, color: '#fff', overflow: 'hidden',
      background: 'linear-gradient(140deg, #006600 0%, #032803 48%, #021c02 100%)',
    }}>
      <Box aria-hidden sx={{
        position: 'absolute', left: '50%', bottom: '-4%', transform: 'translateX(-50%)',
        fontSize: { xs: 120, md: 300 }, fontWeight: 800, letterSpacing: '8px', lineHeight: 1,
        color: 'rgba(255,255,255,.06)', pointerEvents: 'none', userSelect: 'none',
      }}>
        {propertyFeatures.watermark}
      </Box>
      <Container sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr .85fr' }, gap: { xs: 5, md: 7 }, alignItems: 'center' }}>
          <Box>
            <Typography aria-hidden sx={{ color: '#8fe08f', letterSpacing: '3px', fontSize: 14 }}>/////////</Typography>
            <Typography variant="h2" sx={{ color: '#fff', fontSize: { xs: 34, md: 56 }, fontWeight: 800, mt: 1 }}>
              {propertyFeatures.title}
            </Typography>
            <Typography sx={{ mt: 2.5, maxWidth: 520, fontSize: 16.5, fontWeight: 300, color: 'rgba(255,255,255,.82)' }}>
              {propertyFeatures.description}
            </Typography>
            <Typography sx={{
              mt: 4.25, textTransform: 'uppercase', letterSpacing: '2px', fontSize: 12.5, fontWeight: 600,
              color: '#a8ffa8', pb: 1.5, borderBottom: '1px solid rgba(255,255,255,.18)',
            }}>
              {propertyFeatures.featuresLabel}
            </Typography>
            <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2.75 }}>
              {propertyFeatures.features.map((k) => (
                <Box key={k.title} sx={{
                  p: 1.5, mx: -1.5, borderRadius: 1.5, cursor: 'default',
                  transition: 'background .25s ease, transform .25s ease',
                  '&:hover': { bgcolor: 'rgba(255,255,255,.07)', transform: 'translateY(-4px)' },
                  '&:hover .keyTitle': { color: '#a8ffa8' },
                }}>
                  <Typography className="keyTitle" variant="h4" sx={{ color: '#fff', fontSize: 14, textTransform: 'uppercase', letterSpacing: '.5px', transition: 'color .25s ease' }}>
                    {k.title}
                  </Typography>
                  <Typography sx={{ mt: 1, fontSize: 13, color: 'rgba(255,255,255,.7)' }}>{k.copy}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Box aria-hidden sx={{
            height: { xs: 320, md: 460 }, borderRadius: 1, position: 'relative', overflow: 'hidden',
            backgroundColor: '#0f3d0f',
            '&::before': {
              content: '""', position: 'absolute', inset: 0,
              backgroundImage: `url(${propertyFeatures.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
              transition: 'transform .6s ease',
            },
            '&::after': {
              content: '""', position: 'absolute', inset: 0,
              background: 'linear-gradient(160deg, rgba(0,102,0,.15), rgba(3,40,3,.35))',
            },
            '&:hover::before': { transform: 'scale(1.08)' },
          }} />
        </Box>
      </Container>
    </Box>
  )
}

// Testimonial cards section.
function Testimonials({ testimonials }) {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container>
        <SectionHead center underline title={testimonials.title} sub={testimonials.subtitle} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3.25, mt: 9, rowGap: 8 }}>
          {testimonials.items.map((t) => (
            <Card key={t.name} elevation={0}
              sx={{
                position: 'relative', overflow: 'visible', minHeight: 440,
                display: 'flex', flexDirection: 'column',
                bgcolor: '#fafafa', border: '1px solid', borderColor: 'brand.line',
                borderRadius: 1.5, px: 3.5, pt: 7, pb: 3.75, textAlign: 'center',
                transition: 'transform .3s ease, box-shadow .3s ease, border-color .3s ease',
                '&:hover': {  bgcolor: '#fff',transform: 'translateY(-6px)', borderColor: 'transparent' },
              }}>
              <Avatar
                src={t.avatar}
                alt={t.name}
                sx={{
                  position: 'absolute', top: -32, left: '50%', transform: 'translateX(-50%)',
                  width: 94, height: 94, fontWeight: 700, border: '10px solid #fff',
                  background: t.avatar ? '#fff' : 'linear-gradient(150deg, #006600, #032803)',
                  color: t.avatar ? 'transparent' : '#fff',
                }}
              >
                {getInitials(t.name)}
              </Avatar>
              <FormatQuoteIcon sx={{ color: 'primary.main', fontSize: 42, transform: 'scaleX(-1)' }} />
              <Typography sx={{ fontSize: 14.5, color: 'text.secondary', lineHeight: 1.6 }}>{t.quote}</Typography>
              <FormatQuoteIcon sx={{ color: 'primary.main', fontSize: 42, ml: 'auto', transform: 'scaleX(-1) rotate(180deg)' }} />
              <Box sx={{ mt: 'auto', pt: 2.75 }}>
                <Typography sx={{ fontWeight: 600, color: '#e09e0d' }}>{t.name}</Typography>
                <Typography sx={{ fontSize: 12.5, color: 'text.secondary', letterSpacing: '.4px', fontStyle: 'italic' }}>{t.role}</Typography>
              </Box>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

// Contact call-to-action section.
function CallToAction({ cta }) {
  return (
    <Box component="section" id="contact" sx={{
      position: 'relative', py: { xs: 9, md: 11 }, color: '#fff', overflow: 'hidden', textAlign: 'center',
      background: 'linear-gradient(180deg, #006600 0%, #024A01 55%, #021c02 100%)',
    }}>
      <Box aria-hidden sx={{ position: 'absolute', left: -60, top: -60, width: 220, height: 220, bgcolor: 'rgba(255,255,255,.06)', borderRadius: 2.5, transform: 'rotate(15deg)' }} />
      <Box aria-hidden sx={{ position: 'absolute', right: -70, top: -70, width: 220, height: 220, bgcolor: 'rgba(255,255,255,.06)', borderRadius: 2.5, transform: 'rotate(15deg)' }} />
      <Container sx={{ position: 'relative', zIndex: 2, maxWidth: 720 }}>
        <Typography variant="h2" sx={{ color: '#fff', textTransform: 'none', fontSize: { xs: 24, md: 36 }, fontWeight: 700 }}>
          {cta.title}
        </Typography>
        <Typography sx={{ mt: 2, mb: 3.75, mx: 'auto', maxWidth: 540, fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,.85)' }}>
          {cta.text}
        </Typography>
        <Button variant="contained" component={RouterLink} to="/projects" size="large"
          sx={{ bgcolor: '#fff', color: 'primary.dark', '&:hover': { bgcolor: 'transparent', color: "#fff" } }}>
          {cta.button}
        </Button>
      </Container>
    </Box>
  )
}

// Main page assembly. Copy comes from the admin-editable content document;
// Navbar/Footer are provided by the shared Layout.
export default function HomePage() {
  const content = usePageContent(HOME_PAGE_ID, homeContentData)

  return (
    <Box>
      <Hero hero={content.hero} />
      <Reveal variant="up">
        <FeaturedProjects featured={content.featured} />
      </Reveal>
      <Reveal variant="left">
        <WhyChooseUs whyChooseUs={content.whyChooseUs} />
      </Reveal>
      <Reveal variant="right">
        <PropertyFeatures propertyFeatures={content.propertyFeatures} />
      </Reveal>
      <Reveal variant="zoom">
        <Testimonials testimonials={content.testimonials} />
      </Reveal>
      <Reveal variant="fade">
        <CallToAction cta={content.cta} />
      </Reveal>
    </Box>
  )
}
