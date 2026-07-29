import { Box, Container, Divider, Typography } from '@mui/material'
import PageBanner from '../components/PageBanner'
import ContentBlocks from '../components/ContentBlocks'
import usePageContent from '../hooks/usePageContent'
import { SITEMAP_PAGE_ID, sitemapContentData, normalizeSitemapContent } from '../../shared/content/sitemapContent'

export default function SitemapPage() {
  // Normalised so groups saved before the block model still render.
  const content = normalizeSitemapContent(usePageContent(SITEMAP_PAGE_ID, sitemapContentData))

  return (
    <Box>
      <PageBanner
        eyebrow={content.eyebrow}
        title={content.title}
        subtitle={content.subtitle}
        paragraphs={content.heroParagraphs}
        crumbs={[{ label: content.title }]}
      />
      <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'brand.surface' }}>
        <Container maxWidth="md">
          {/* Single document card with divider-separated sections, matching the
              legal pages. */}
          <Box sx={{ bgcolor: '#fff', border: '1px solid', borderColor: 'brand.line', borderRadius: 3, p: { xs: 3, sm: 5, md: 7 } }}>
            <Typography sx={{ color: 'text.secondary', fontSize: 15.5, lineHeight: 1.9, mb: 4 }}>
              {content.intro}
            </Typography>
            {content.groups.map((group, gi) => (
              <Box component="section" key={gi}>
                {gi > 0 && <Divider sx={{ my: { xs: 3.5, md: 4.5 }, borderColor: 'brand.line' }} />}
                <Typography component="h2" sx={{ color: 'primary.dark', fontSize: { xs: 20, md: 23 }, fontWeight: 700, mb: 1.5 }}>
                  {group.title}
                </Typography>
                {/* Plain text, not links — the legal pages' body treatment. */}
                <ContentBlocks blocks={group.blocks} />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
