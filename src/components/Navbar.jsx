import { useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Typography,
  Button,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useMediaQuery,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import BrandMark from './BrandMark'
import SpecialistModal from './SpecialistModal'
import useScrollTrigger from '@mui/material/useScrollTrigger';

// Top navigation links (route paths).
const NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact Us', to: '/contact' },
]

// Sticky header with desktop and mobile navigation.
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const isMobile = useMediaQuery((t) => t.breakpoints.down('md'))
  const { pathname } = useLocation()

  // The specialist CTA is redundant on the Contact page, so hide it there.
  const showSpecialistCta = pathname !== '/contact'
  
  const trigger = useScrollTrigger({threshold: 50, disableHysteresis: true});

  const handleNavClick = (event, to, closeDrawer = false) => {
    window.dispatchEvent(new Event('site-scroll-to-top'))
    window.scrollTo({ top: 0, behavior: 'instant' })

    if (pathname === to) event.preventDefault()
    if (closeDrawer) setOpen(false)
  }

  return (
    <>
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          bgcolor: 'rgba(255,255,255)',
          width: trigger ? '70%' : '100%',
          left: '50%',
          right: 'auto',
          transform: 'translateX(-50%)',
          borderRadius: trigger ? '0 0 50px 50px' : '0 0 16px 16px',
          boxShadow: trigger ? 3 : 0,
          transition: theme => theme.transitions.create(
            ['width', 'max-width', 'top', 'border-radius', 'background-color', 'box-shadow'],
          ),
        }}

      >
        <Container>
          <Toolbar disableGutters sx={{ minHeight: { xs: 68, md: 76 }, gap: 2, }}>
            <BrandMark />
            {!isMobile && (
              <Stack direction="row" spacing={4} sx={{ ml: 'auto' }}>
                {NAV.map((n) => {
                  const active = n.to === pathname
                    || (n.to === '/projects' && pathname === '/project-details')
                  return (
                   <Typography
                      key={n.label}
                      component={RouterLink}
                      to={n.to}
                      onClick={(event) => handleNavClick(event, n.to)}
                      sx={{
                        textAlign: 'center',
                        color: 'text.primary',
                        textDecoration: 'none',
                        fontSize: 14,
                        fontWeight: active ? 700 : 500,
                        position: 'relative',
                        '&::after': {
                          content: '""', position: 'absolute', left: 0, bottom: -4, height: 2,
                          width: active ? '100%' : 0,
                          bgcolor: 'primary.main', transition: 'width .25s ease',
                        },
                        '&:hover::after': { width: '100%' },
                      }}
                    >
                      {n.label}
                    </Typography>
                  )
                })}
              </Stack>
            )}
            <Box sx={{ ml: isMobile ? 'auto' : 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isMobile && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setModalOpen(true)}
                  sx={{
                    fontSize: 13.5,
                    py: 1.1,
                    visibility: showSpecialistCta ? 'visible' : 'hidden',
                    pointerEvents: showSpecialistCta ? 'auto' : 'none',
                  }}
                >
                  Talk to a Property Specialist
                </Button>
              )}
              {isMobile && (
                <IconButton onClick={() => setOpen(true)} sx={{ color: 'text.primary' }}>
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { width: { xs: 300, sm: 320 }, maxWidth: 360 } } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <BrandMark />
          <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <List>
          {NAV.map((n) => (
            <ListItemButton key={n.label} component={RouterLink} to={n.to} onClick={(event) => handleNavClick(event, n.to, true)}
              selected={n.to === pathname || (n.to === '/projects' && pathname === '/project-details')}>
              <ListItemText primary={n.label} />
            </ListItemButton>
          ))}
        </List>
        {showSpecialistCta && (
          <Box sx={{ p: 2 }}>
            <Button fullWidth variant="contained" color="secondary"
              onClick={() => { setOpen(false); setModalOpen(true) }}>
              Talk to a Property Specialist
            </Button>
          </Box>
        )}
      </Drawer>

      <SpecialistModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
