import { Box, Button, Container, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import useSiteSettings from '../hooks/useSiteSettings'
import MaterialSymbol from '../../shared/content/MaterialSymbol'
import { isPageHidden } from '../../shared/content/pageLayout'

// Wraps a route: a page switched off in the admin shows a maintenance notice
// instead of its content (the URL stays valid, so links and bookmarks still
// land somewhere sensible).
export default function PageGate({ pageKey, children }) {
  const settings = useSiteSettings()
  if (!isPageHidden(settings, pageKey)) return children

  return (
    <Box component="section" sx={{
      minHeight: '78vh', display: 'grid', placeItems: 'center', textAlign: 'center',
      pt: { xs: 16, md: 18 }, pb: { xs: 10, md: 12 },
      background: 'linear-gradient(180deg, rgba(0,102,0,.06) 0%, #fff 70%)',
    }}>
      <Container maxWidth="sm">
        <Box sx={{ width: 76, height: 76, mx: 'auto', mb: 3, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: 'rgba(0,102,0,.1)', color: 'primary.main' }}>
          <MaterialSymbol name="construction" sx={{ fontSize: 38 }} />
        </Box>
        <Typography variant="h2" sx={{ color: 'primary.main', fontSize: { xs: 28, md: 38 }, mb: 2 }}>
          Under Maintenance
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 16, mb: 4 }}>
          We&rsquo;re making some improvements to this page. Please check back soon.
        </Typography>
        {pageKey !== 'home' && (
          <Button variant="contained" component={RouterLink} to="/">Back to Home</Button>
        )}
      </Container>
    </Box>
  )
}
