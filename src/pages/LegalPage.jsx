import { Box, Container, Divider, Typography } from '@mui/material'
import PageBanner from '../components/PageBanner'
import usePageContent from '../hooks/usePageContent'
import { getLegalContent, legalContentData } from '../../shared/content/legalContent'

// Renders whichever legal document matches `type` (privacy | terms | cookies).
// Copy comes from the admin-editable content document.
export default function LegalPage({ type }) {
  const content = usePageContent(getLegalContent, legalContentData)
  const page = content[type] || legalContentData[type]

  return (
    <Box>
      <PageBanner
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.subtitle}
        crumbs={[{ label: page.title }]}
      />
      <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'brand.surface' }}>
        <Container maxWidth="md">
          <Box sx={{ bgcolor: '#fff', border: '1px solid', borderColor: 'brand.line', borderRadius: 3, p: { xs: 3, sm: 5, md: 7 } }}>
            <Typography sx={{ color: 'text.secondary', fontSize: 13, textTransform: 'uppercase', letterSpacing: '1.2px', mb: 4 }}>
              Last updated: {page.updated}
            </Typography>
            {page.sections.map((section, index) => (
              <Box component="section" key={index}>
                {index > 0 && <Divider sx={{ my: { xs: 3.5, md: 4.5 }, borderColor: 'brand.line' }} />}
                <Typography component="h2" sx={{ color: 'primary.dark', fontSize: { xs: 20, md: 23 }, fontWeight: 700, mb: 1.5 }}>
                  {section.heading}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 15.5, lineHeight: 1.9 }}>
                  {section.copy}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
