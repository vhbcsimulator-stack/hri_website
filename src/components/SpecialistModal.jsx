import { useState } from 'react'
import {
  Dialog, Box, Typography, Stack, TextField, Button, IconButton, Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import MailOutlineIcon from '@mui/icons-material/MailOutlineOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const EMPTY = { name: '', email: '', phone: '', message: '' }

// Field label shown above each input.
function FieldLabel({ children }) {
  return (
    <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary', mb: 0.75 }}>
      {children}
    </Typography>
  )
}

const roundedInput = { sx: { borderRadius: 1 } }

export default function SpecialistModal({ open, onClose }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((err) => ({ ...err, [k]: undefined }))
  }

  const handleClose = () => {
    onClose()
    // Reset after the closing animation.
    setTimeout(() => { setForm(EMPTY); setErrors({}); setSent(false) }, 200)
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email'
    if (!form.message.trim()) next.message = 'Required'
    setErrors(next)
    if (Object.keys(next).length) return
    setSent(true)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 4, position: 'relative', overflow: 'hidden' } }}>

      <IconButton onClick={handleClose} aria-label="Close"
        sx={{ position: 'absolute', top: 20, right: 20, color: 'text.secondary', bgcolor: 'rgba(0,0,0,.04)', '&:hover': { bgcolor: 'rgba(0,0,0,.1)' } }}>
        <CloseIcon fontSize="small" />
      </IconButton>

      <Box sx={{ p: { xs: 3, sm: 6 } }}>
        {/* Header */}
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 1, pr: 4 }}>
          <Box sx={{ width: 48, height: 48, flexShrink: 0, borderRadius: 2.5, bgcolor: 'rgba(2, 2, 2, 0.05)', color: 'GREEN', display: 'grid', placeItems: 'center' }}>
            <MailOutlineIcon />
          </Box>
          <Box>
            <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 700, fontSize: { xs: 20, sm: 24 }, lineHeight: 1.2 }}>
              We're here to Assist You
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 14.5 }}>
              Have questions about our residential communities?
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {sent ? (
          <Stack sx={{ alignItems: 'center', textAlign: 'center', py: 3 }}>
            <CheckCircleOutlinedIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, fontSize: 22, color: 'primary.dark', mb: 1 }}>
              Request Received
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 15, maxWidth: 380, mb: 3 }}>
              Thank you! A property specialist will reach out to you shortly.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleClose} sx={{ px: 4 }}>
              Close
            </Button>
          </Stack>
        ) : (
          <Box component="form" onSubmit={submit} noValidate>
            <Stack spacing={2.25}>
              <Box>
                <FieldLabel>Full Name*</FieldLabel>
                <TextField placeholder="eg. Juan Dela Cruz" value={form.name} onChange={update('name')}
                  error={!!errors.name} helperText={errors.name} size="small" fullWidth slotProps={{ input: roundedInput }} />
              </Box>
              <Box>
                <FieldLabel>Email Address*</FieldLabel>
                <TextField placeholder="eg. juan@example.com" value={form.email} onChange={update('email')}
                  error={!!errors.email} helperText={errors.email} size="small" fullWidth slotProps={{ input: roundedInput }} />
              </Box>
              <Box>
                <FieldLabel>Mobile Number</FieldLabel>
                <TextField placeholder="+63 9xx xxx xxxx" value={form.phone} onChange={update('phone')}
                  size="small" fullWidth slotProps={{ input: roundedInput }} />
              </Box>
              <Box>
                <FieldLabel>How can we help?*</FieldLabel>
                <TextField placeholder="Concern.." value={form.message} onChange={update('message')}
                  error={!!errors.message} helperText={errors.message} fullWidth multiline minRows={4}
                  slotProps={{ input: roundedInput }} />
              </Box>
              <Button type="submit" variant="contained" color="primary" size="large" fullWidth
                sx={{ borderRadius: 2, py: 1.4, fontWeight: 700, letterSpacing: '.5px', mt: 0.5 }}>
                Submit Request
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Dialog>
  )
}
