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

// Hero banner section.
function Hero({ hero }) {
  const bgRef = useRef(null)
  const contentRef = useRef(null)

  // Scroll-driven parallax (matches the project-details hero): the image slowly
  // zooms while the foreground content lifts faster, fades, and softly blurs —
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
          contentRef.current.style.opacity = String(1 - p * 1.3)
          contentRef.current.style.filter = `blur(${p * 5}px)`
        }
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
        alignItems: 'center',
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      <Box ref={bgRef} aria-hidden sx={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${hero.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#052905',
        transformOrigin: 'center 55%',
        willChange: 'transform',
      }} />
      <Box aria-hidden sx={{
        position: 'absolute', inset: 0,
        background:
          'radial-gradient(120% 90% at 70% 10%, rgba(0,0,255,.30), transparent 55%),' +
          'linear-gradient(165deg, rgba(3,40,3,.72) 0%, rgba(2,20,2,.55) 45%, rgba(2,20,2,.9) 100%)',
      }} />
      <Container ref={contentRef} sx={{ position: 'relative', zIndex: 2, py: { xs: 14, md: 16 }, willChange: 'transform, opacity, filter' }}>
        <Box sx={{ maxWidth: 820 }}>
          <Typography sx={{ textTransform: 'uppercase', letterSpacing: '4px', fontSize: 13, fontWeight: 500, color: '#b7f0b7', mb: 2 }}>
            <TypewriterText speed={50}>{hero.eyebrow}</TypewriterText>
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: 40, sm: 56, md: 78 } }}>
            <Box component="span" sx={{ display: 'block', overflow: 'hidden', pb: '.08em', mb: '-.08em' }}>
              <Box
                component="span"
                sx={{
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
                  color: '#a8ffa8',
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
          <Typography sx={{ mt: 3, maxWidth: 640, fontSize: { xs: 16, md: 19 }, fontWeight: 300, color: 'rgba(255,255,255,.9)' }}>
            {hero.subtitle}
          </Typography>
          <Stack direction="row" spacing={1.75} sx={{ mt: 4.5, flexWrap: 'wrap', gap: 1.5 }}>
            <Button variant="contained" color="secondary" component={RouterLink} to="/projects" size="large">
              {hero.primaryCta}
            </Button>
            <Button variant="outlined" component={RouterLink} to="/about" size="large"
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,.6)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.12)' } }}>
              {hero.secondaryCta}
            </Button>
          </Stack>
        </Box>
      </Container>
      <IconButton href="#projects" 
        sx={{
          position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)', zIndex: 2,
          color: '#fff', border: '1.5px solid rgba(255,255,255,.5)',
          animation: 'bob 2s ease-in-out infinite',
          '@keyframes bob': { '0%,100%': { transform: 'translate(-50%,0)' }, '50%': { transform: 'translate(-50%,8px)' } },
        }}>
        <KeyboardArrowDownIcon />
      </IconButton>
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
