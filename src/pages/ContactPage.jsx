import { useState } from 'react'
import {
  Box, Container, Typography, Stack, TextField, MenuItem, Button, IconButton, Alert,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined'
import Reveal from '../components/Reveal'
import HeroTitleReveal from '../components/HeroTitleReveal'
import TypewriterText from '../components/TypewriterText'
import usePageContent from '../hooks/usePageContent'
import MaterialSymbol from '../../shared/content/MaterialSymbol'
import { CONTACT_PAGE_ID, contactContentData } from '../../shared/content/contactContent'

const PROPERTY_OPTIONS = ['Residential', 'Commercial']

// Social networks keep their brand logos (Material Symbols has no brand marks),
// so `network` from content maps to a fixed icon here.
const SOCIAL_ICONS = {
  facebook: <FacebookIcon fontSize="small" />,
  instagram: <InstagramIcon fontSize="small" />,
}
const socialIcon = (network) => SOCIAL_ICONS[network]

const EMPTY = { first: '', last: '', email: '', phone: '', interest: '', message: '' }

export default function ContactPage() {
  const content = usePageContent(CONTACT_PAGE_ID, contactContentData)
  const { hero, inquiry, map, faq } = content

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((err) => ({ ...err, [k]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.first.trim()) next.first = 'Required'
    if (!form.last.trim()) next.last = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email'
    if (!form.message.trim()) next.message = 'Required'
    setErrors(next)
    if (Object.keys(next).length) return
    setSent(true)
    setForm(EMPTY)
  }

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(150deg, #006600 0%, #024A01 60%, #032803 100%)', color: '#fff', pt: { xs: 14, md: 17 }, pb: { xs: 14, md: 10 }, textAlign: 'center' }}>
        <Container>
          <Typography sx={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: { xs: 13, md: 15 }, fontWeight: 600, color: '#a8ffa8', mb: 1.5 }}>
            <TypewriterText speed={50}>{hero.eyebrow}</TypewriterText>
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: 42, md: 72 }, fontWeight: 800 }}>
            <HeroTitleReveal>{hero.title}</HeroTitleReveal>
          </Typography>
          <Box sx={{ width: 90, height: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,.7)', mt: 3, mx: 'auto' }} />
          <Typography sx={{ mt: 3, maxWidth: 620, mx: 'auto', fontSize: { xs: 15, md: 17 }, fontWeight: 300, color: 'rgba(255,255,255,.9)' }}>
            {hero.subtitle}
          </Typography>
        </Container>
      </Box>

      {/* Inquiry — single elevated panel */}
      <Reveal variant="zoom-up">
      <Box component="section" sx={{ pb: { xs: 8, md: 12 } }}>
        <Container sx={{ mt: { xs: 8, md: 12 } }}>
          <Box sx={{
            display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.85fr 1.15fr' },
            bgcolor: '#fff', borderRadius: 4, overflow: 'hidden',
            boxShadow: '0 30px 70px -30px rgba(3, 3, 3, 0.5)',
          }}>
            {/* Info sidebar (brand green) */}
            <Box sx={{
              position: 'relative', color: '#fff', p: { xs: 4, md: 5 }, overflow: 'hidden',
              background: 'linear-gradient(160deg, #006600 0%, #024A01 55%, #021c02 100%)',
            }}>
              <Box aria-hidden sx={{ position: 'absolute', right: -50, bottom: -50, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(255,255,255,.06)' }} />
              <Box sx={{ position: 'relative' }}>
                <Typography variant="h2" sx={{ color: '#fff', textTransform: 'none', fontSize: { xs: 24, md: 28 }, mb: 1.5 }}>
                  {inquiry.heading}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,.85)', fontSize: 15, fontWeight: 300, mb: 4 }}>
                  {inquiry.description}
                </Typography>

                <Stack spacing={2.75}>
                  {inquiry.info.map((info, i) => (
                    <Stack key={i} direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
                      <Box sx={{ width: 40, height: 40, flexShrink: 0, borderRadius: 2, bgcolor: 'rgba(255,255,255,.14)', display: 'grid', placeItems: 'center' }}>
                        <MaterialSymbol name={info.icon} sx={{ fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.5px', color: '#a8ffa8' }}>{info.label}</Typography>
                        <Typography sx={{ fontSize: 15, fontWeight: 500 }}>{info.value}</Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>

                <Typography sx={{ mt: 4, mb: 1.5, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.5px', color: '#a8ffa8' }}>
                  {inquiry.socialsLabel}
                </Typography>
                <Stack direction="row" spacing={1.5}>
                  {inquiry.socials.filter((s) => s.network !== 'linkedin').map((s, i) => (
                    <IconButton key={i} href={s.href} aria-label={s.network}
                      sx={{ bgcolor: 'rgba(255,255,255,.14)', color: '#fff', width: 40, height: 40, transition: 'background .2s ease, transform .2s ease', '&:hover': { bgcolor: '#fff', color: 'primary.main', transform: 'translateY(-2px)' } }}>
                      {socialIcon(s.network)}
                    </IconButton>
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Form */}
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              {sent && (
                <Alert severity="success" onClose={() => setSent(false)} sx={{ mb: 3 }}>
                  Thank you! Your message has been received. A specialist will contact you soon.
                </Alert>
              )}
              <Box component="form" onSubmit={submit} noValidate>
                <Stack spacing={2.75}>
                    <TextField label="Full Name *" value={form.first} onChange={update('first')} error={!!errors.first} helperText={errors.first} fullWidth />               
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.75 }}>
                    <TextField label="Email Address *" value={form.email} onChange={update('email')} error={!!errors.email} helperText={errors.email} fullWidth />
                    <TextField label="Phone Number" value={form.phone} onChange={update('phone')} fullWidth />
                  </Box>
                  <TextField select label="Property Interest" value={form.interest} onChange={update('interest')} fullWidth>
                    <MenuItem value=""><em>Select a Property</em></MenuItem>
                    {PROPERTY_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </TextField>
                  <TextField label="Message *" value={form.message} onChange={update('message')} error={!!errors.message} helperText={errors.message} placeholder="How can we help you?" fullWidth multiline minRows={4} />
                  <Button type="submit" variant="contained" color="primary" size="large" sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' }, px: 4 }}>
                    Submit Message
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      </Reveal>

      {/* Google Map */}
      <Box component="section" sx={{ height: { xs: 320, md: 420 } }}>
        <Box
          component="iframe"
          title="Office location map"
          src={map.embedSrc}
          sx={{ width: '100%', height: '100%', border: 0, display: 'block' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Box>

      {/* FAQ */}
      <Reveal variant="zoom">
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'rgba(0,0,255,0.03)' }}>
        <Container maxWidth="md">
          <Stack sx={{ mb: 6, alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h2" sx={{ color: 'text.primary', textTransform: 'none', fontSize: { xs: 28, md: 38 } }}>
              {faq.title}
            </Typography>
            <Box sx={{ width: 260, maxWidth: '70%', height: 2, bgcolor: 'brand.line', mt: 2 }} />
          </Stack>

          <Stack spacing={2}>
            {faq.items.map((f, i) => (
              <Accordion key={i} disableGutters elevation={0}
                sx={{ borderRadius: '12px !important', border: '1px solid', borderColor: 'brand.line', '&:before': { display: 'none' }, overflow: 'hidden' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5, py: 1, '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1.5 } }}>
                  <HelpOutlineIcon sx={{ color: 'GREEN' }} />
                  <Typography sx={{ fontWeight: 500, fontSize: 16 }}>{f.q}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0, pl: 6 }}>
                  <Typography sx={{ color: 'text.secondary', fontSize: 15 }}>{f.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Container>
      </Box>
      </Reveal>
    </Box>
  )
}
