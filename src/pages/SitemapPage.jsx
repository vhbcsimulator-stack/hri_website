import { Box, Container, Link as MuiLink, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import PageBanner from '../components/PageBanner'
import usePageContent from '../hooks/usePageContent'
import { getSitemapContent, sitemapContentData } from '../../shared/content/sitemapContent'

export default function SitemapPage() {
  const content = usePageContent(getSitemapContent, sitemapContentData)

  return (
    <Box>
      <PageBanner
        eyebrow={content.eyebrow}
        title={content.title}
        subtitle={content.subtitle}
        crumbs={[{ label: content.title }]}
      />
      <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'brand.surface' }}>
        <Container maxWidth="md">
          <Typography sx={{ color: 'text.secondary', lineHeight: 1.9, maxWidth: 720, mb: 5 }}>
            {content.intro}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
            {content.groups.map((group, gi) => (
              <Box key={gi} sx={{ bgcolor: '#fff', border: '1px solid', borderColor: 'brand.line', borderRadius: 3, p: { xs: 3, md: 4 } }}>
                <Typography component="h2" sx={{ color: 'primary.dark', fontSize: 22, fontWeight: 700, mb: 2.5 }}>
                  {group.title}
                </Typography>
                <Box component="nav" aria-label={`${group.title} sitemap links`}>
                  {group.links.map((link, li) => (
                    <MuiLink key={li} component={RouterLink} to={link.to} underline="none" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.25, color: 'text.secondary', fontSize: 15, borderBottom: '1px solid', borderColor: 'brand.line', transition: 'color .2s ease, padding-left .2s ease', '&:hover': { color: 'primary.main', pl: 0.75 }, '&:last-child': { borderBottom: 0 } }}>
                      {link.label}
                      <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
                    </MuiLink>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
