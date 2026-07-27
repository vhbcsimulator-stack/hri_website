import { Box, Container, Typography, Stack, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import Reveal from '../components/Reveal'
import usePageContent from '../hooks/usePageContent'
import MaterialSymbol from '../../shared/content/MaterialSymbol'
import { getAboutContent, aboutContentData } from '../../shared/content/aboutContent'

// Brand accent: interlocking blue/green rings used above section titles.
function BrandCircles({ size = 52 }) {
  return (
    <Box component="svg" width={size} height={size * 0.66} viewBox="0 0 52 34" sx={{ display: 'block', overflow: 'visible' }}>
      <circle cx="10" cy="17" r="11" fill="#0000FF" stroke="#0000FF" strokeWidth="5" />
      <circle cx="40" cy="17" r="11" fill="#0000FF" stroke="#0000FF" strokeWidth="5" />
      <circle cx="26" cy="17" r="11" fill="none" stroke="#006600" strokeWidth="5" />
    </Box>
  )
}

// Small centered heading with the overlapping-circles brand accent.
function SectionTitle({ children, icon }) {
  return (
    <Stack sx={{ mb: 5, width: '100%', alignItems: 'center', textAlign: 'center' }}>
      {icon && <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'center', width: '100%' }}>{icon}</Box>}
      <Typography variant="h2" sx={{ color: 'primary.main', fontSize: { xs: 30, md: 40 }, textTransform: 'uppercase' }}>
        {children}
      </Typography>
    </Stack>
  )
}

// Copy comes from the admin-editable content document; Navbar/Footer are
// provided by the shared Layout.
export default function AboutPage() {
  const content = usePageContent(getAboutContent, aboutContentData)
  const { hero, coreValues, missionVision, whatWeDo, whyChoose, cta } = content

  return (
    <Box>
      {/* Hero */}
      <Box component="section" sx={{ pt: { xs: 13, md: 17 }, pb: { xs: 7, md: 11 }, position: 'relative', overflow: 'hidden' }}>
        {/* soft brand backdrop */}
        <Box aria-hidden sx={{ position: 'absolute', top: -120, right: -120, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,102,0,.08), transparent 70%)', display: { xs: 'none', md: 'block' } }} />
        <Container sx={{ position: 'relative' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' }, gap: { xs: 5, md: 8 }, alignItems: 'center' }}>
            <Box>
              {/* eyebrow */}
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ width: 34, height: 3, borderRadius: 2, background: 'linear-gradient(90deg,#0000FF,#006600)' }} />
                <Typography sx={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: 12.5, fontWeight: 600, color: 'primary.main' }}>
                  {hero.eyebrow}
                </Typography>
              </Stack>
              <Typography variant="h2" sx={{ color: 'primary.dark', fontSize: { xs: 34, md: 48 }, mb: 3, textTransform: 'none', lineHeight: 1.1 }}>
                {hero.titleLead}{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>{hero.titleHighlight}</Box>
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 16, mb: 2.5 }}>
                {hero.para1}
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 16, mb: 4 }}>
                {hero.para2}
              </Typography>

              <Stack direction="row" spacing={1.75} sx={{ flexWrap: 'wrap', gap: 1.5, mb: 5 }}>
                <Button variant="contained" color="primary" size="large" component={RouterLink} to="/projects">
                  {hero.primaryCta}
                </Button>
                <Button variant="outlined" color="primary" size="large" component={RouterLink} to="/contact">
                  {hero.secondaryCta}
                </Button>
              </Stack>
            </Box>

            {/* Framed image */}
            <Box sx={{ position: 'relative', px: { xs: 0, md: 2 }, py: { xs: 0, md: 2 } }}>
              {/* offset outline frame */}
              <Box aria-hidden sx={{
                position: 'absolute', top: 0, right: 0, bottom: 0, left: { xs: 0, md: 24 },
                border: '2px solid', borderColor: 'primary.main', borderRadius: 2, opacity: .35,
                display: { xs: 'none', md: 'block' },
              }} />
              <Box sx={{
                position: 'relative', height: { xs: 300, md: 420 }, borderRadius: 2, overflow: 'hidden',
                '&::before': {
                  content: '""', position: 'absolute', inset: 0,
                  backgroundImage: `url(${hero.image})`,
                  backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform .7s ease',
                },
                '&:hover::before': { transform: 'scale(1.06)' },
              }} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Core Values */}
      <Reveal variant="up">
      <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
        <Container>
          <SectionTitle>{coreValues.title}</SectionTitle>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2.5 }}>
            {coreValues.items.map((v, i) => (
              <Box key={i} sx={{
                bgcolor: 'rgba(0,0,255,0.035)',
                borderRadius: 2, p: 3, textAlign: 'center', cursor: 'default',
                transition: 'transform .28s ease, .28s ease, border-color .28s ease, background .28s ease',
                '&:hover': { transform: 'translateY(-6px)', bgcolor: '#fff', borderColor: 'secondary.main', },
                '&:hover .valueIcon': { transform: 'scale(1.12)' },
              }}>
                <Box className="valueIcon" sx={{ color: 'secondary.main', mb: 2, transition: 'transform .28s ease' }}>
                  <MaterialSymbol name={v.icon} sx={{ fontSize: 34 }} />
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: 15, textTransform: 'uppercase', letterSpacing: '.4px', color: 'primary.dark', mb: 1.25 }}>
                  {v.title}
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.55 }}>{v.copy}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
      </Reveal>

      {/* Mission / Vision */}
      <Reveal variant="zoom">
      <Box component="section" sx={{ py: { xs: 6, md: 9 } }}>
        <Container>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 6, md: 8 }, textAlign: 'center' }}>
            {missionVision.items.map((m, i) => (
              <Box key={i} sx={{
                bgcolor: '#fff', borderRadius: 3, p: { xs: 4, md: 5 }, cursor: 'default',
                border: '1px solid', borderColor: 'brand.line',
                transition: 'transform .35s cubic-bezier(.2,.7,.2,1),  .35s ease, border-color .35s ease',
                '&:hover': { transform: 'translateY(-6px)', borderColor: 'rgba(0,102,0,.25)' },
                '&:hover .mvBadge': { bgcolor: 'primary.main', color: '#fff', },
                '&:hover .mvRule': { width: 56 },
              }}>
                <Box className="mvBadge" sx={{
                  width: 72, height: 72, mx: 'auto', mb: 2.5, borderRadius: '50%',
                  bgcolor: 'rgba(0,102,0,.08)', color: 'primary.main',
                  display: 'grid', placeItems: 'center',
                  transition: 'background-color .35s ease, color .35s ease,  .35s ease',
                }}>
                  <MaterialSymbol name={m.icon} sx={{ fontSize: 36 }} />
                </Box>
                <Typography variant="h2" sx={{ color: 'primary.main', fontSize: { xs: 26, md: 32 }, mb: 1.5 }}>{m.title}</Typography>
                <Box className="mvRule" sx={{ height: 3, width: 32, borderRadius: 2, bgcolor: 'primary.main', mx: 'auto', mb: 2.5, transition: 'width .35s ease' }} />
                <Typography sx={{ color: 'text.secondary', fontSize: 16, maxWidth: 460, mx: 'auto', mb: 2.5 }}>{m.copy}</Typography>
                <Typography sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '.5px', fontSize: 14.5 }}>{m.tags}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
      </Reveal>

      {/* What We Do */}
      <Reveal variant="right">
      <Box component="section" sx={{ py: { xs: 8, md: 11 }, bgcolor: 'brand.surface' }}>
        <Container>
          <SectionTitle icon={<BrandCircles size={56} />}>{whatWeDo.title}</SectionTitle>
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 15.5, maxWidth: 780, mx: 'auto', mb: 6 }}>
            {whatWeDo.description}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2.5 }}>
            {whatWeDo.items.map((item, i) => (
              <Box key={i} tabIndex={0} sx={{
                height: { xs: 150, md: 350 }, borderRadius: 1.5, overflow: 'hidden', position: 'relative',
                boxShadow: '0 12px 28px -14px rgba(0, 0, 0, 0.4)',
                backgroundColor: '#0c3d0c',
                transition: ' .3s ease, transform .3s ease',
                '&::before': {
                  content: '""', position: 'absolute', inset: 0,
                  backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  transition: 'transform .6s ease',
                },
                '&::after': {
                  content: '""', position: 'absolute', inset: 0, opacity: 0,
                  background: 'linear-gradient(180deg, rgba(3,16,18,.62) 0%, rgba(3,16,18,.48) 45%, rgba(3,16,18,.68) 100%)',
                  transition: 'opacity .3s ease',
                },
                '&:hover': { transform: 'translateY(-4px)' },
                '&:hover::before': { transform: 'scale(1.1)' },
                '&:hover::after': { opacity: 1 },
                '&:hover .serviceLabel, &:focus-visible .serviceLabel': { opacity: 1, transform: 'translateY(0)', position: 'absolute', top: 20, },
                '&:focus-visible': { outline: '3px solid', outlineColor: 'secondary.main', outlineOffset: 3 },
                '&:focus-visible::before': { transform: 'scale(1.1)' },
                '&:focus-visible::after': { opacity: 1 },
              }}>
                <Typography className="serviceLabel" sx={{
                  position: 'absolute', zIndex: 2, top: 12, left: 10, right: 10,
                  color: '#fff', textAlign: 'center', textTransform: 'uppercase',
                  fontSize: { xs: 12, md: 14 }, fontWeight: 800, lineHeight: 1,
                  textShadow: '0 2px 6px rgba(0,0,0,.65)',
                  opacity: 0, transform: 'translateY(-7px)',
                  transition: 'opacity .25s ease, transform .25s ease',
                  pointerEvents: 'none',
                }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
      </Reveal>

      {/* Why Choose Us */}
      <Reveal variant="left">
      <Box component="section" sx={{ py: { xs: 8, md: 12, bgcolor: 'brand.line' } }}>
        <Container>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, alignItems: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography variant="h2" sx={{ color: 'primary.main', fontSize: { xs: 30, md: 42 } }}>
              {whyChoose.title}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 16.5 }}>
              {whyChoose.description}
            </Typography>
          </Box>

          <Box sx={{ position: 'relative' }}>
            {/* connecting line (desktop) */}
            <Box aria-hidden sx={{
              display: { xs: 'none', md: 'block' }, position: 'absolute', top: 18, left: '7%', right: '7%',
              height: 2, bgcolor: 'brand.line', zIndex: 0,
            }} />
            <Box sx={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(7, 1fr)' }, gap: { xs: 4, md: 2 } }}>
              {whyChoose.items.map((w, i) => (
                <Box key={i} sx={{
                  textAlign: 'center', px: .5, cursor: 'default',
                  '&:hover .stepCircle': { transform: 'scale(1.15)'},
                  '&:hover .stepTitle': { color: 'secondary.main' },
                }}>
                  <Box className="stepCircle" sx={{
                    width: 38, height: 38, borderRadius: '50%', bgcolor: 'secondary.main', color: '#fff',
                    display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13, mx: 'auto', mb: 2,
                    transition: 'transform .25s ease, background .25s ease, .25s ease',
                  }}>
                    {w.n}
                  </Box>
                  <Typography className="stepTitle" sx={{ fontWeight: 600, fontSize: 14, color: 'primary.dark', mb: 1, transition: 'color .25s ease' }}>{w.title}</Typography>
                  <Typography sx={{ fontSize: 12.5, color: 'text.secondary', lineHeight: 1.5 }}>{w.copy}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
      </Reveal>

      {/* CTA */}
      <Reveal variant="zoom-up">
      <Box component="section" sx={{
        position: 'relative', py: { xs: 9, md: 11 }, textAlign: 'center', color: '#fff', overflow: 'hidden',
        background: 'linear-gradient(180deg, #006600 0%, #024A01 55%, #021c02 100%)',
      }}>
        <Container sx={{ maxWidth: 760 }}>
          <Typography variant="h2" sx={{ color: '#fff', textTransform: 'none', fontSize: { xs: 24, md: 34 }, fontWeight: 700, mb: 2 }}>
            {cta.title}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,.85)', fontSize: 15.5, fontWeight: 300, maxWidth: 620, mx: 'auto', mb: 4 }}>
            {cta.text}
          </Typography>
          <Button
            variant="outlined" size="large" component={RouterLink} to="/contact"
            sx={{ color: '#fff', borderColor: 'rgba(255,255,255,.7)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.12)' } }}
          >
            {cta.button}
          </Button>
        </Container>
      </Box>
      </Reveal>
    </Box>
  )
}
