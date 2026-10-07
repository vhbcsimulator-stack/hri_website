import { Box, Container, Divider, Typography } from '@mui/material'
import PageBanner from '../components/PageBanner'
import ContentBlocks from '../components/ContentBlocks'
import usePageContent from '../hooks/usePageContent'
import { LEGAL_PAGE_ID, legalContentData, normalizeLegalDoc } from '../../shared/content/legalContent'
import PageSection from '../components/PageSection'
import PageSections from '../components/PageSections'
import { getLayout, LEGAL_LAYOUT_KEYS } from '../../shared/content/pageLayout'

// Renders whichever legal document matches `type` (privacy | terms | cookies).
// Copy comes from the admin-editable content document.
export default function LegalPage({ type }) {
  const content = usePageContent(LEGAL_PAGE_ID, legalContentData)
  const layout = getLayout(content, LEGAL_LAYOUT_KEYS[type])
  // Normalised so sections saved before the block model still render.
  const page = normalizeLegalDoc(content[type] || legalContentData[type])

  return (
    <PageSections pageKey={LEGAL_LAYOUT_KEYS[type]} layout={layout}>
      <PageSection id="banner" layout={layout}>
      <PageBanner
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.subtitle}
        paragraphs={page.heroParagraphs}
        crumbs={[{ label: page.title }]}
      />
      </PageSection>

      <PageSection id="body" layout={layout}>
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
                <ContentBlocks blocks={section.blocks} />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
      </PageSection>
    </PageSections>
  )
}
