import { Box, Container, Typography } from '@mui/material'
import RichParagraph from './RichParagraph'
import { customSectionTheme } from './pageLayout'

// An admin-added page section: heading, rich text and an optional image beside
// it. The admin passes editable versions of the heading/body/image through the
// slots; the public site renders the plain defaults.
export default function CustomSection({ section, titleSlot, bodySlot, imageSlot }) {
  const { heading, color, surface } = customSectionTheme(section.background)
  const hasImage = Boolean(section.image) || Boolean(imageSlot)

  return (
    <Box component="section" sx={{ py: { xs: 7, md: 10 }, ...surface }}>
      <Container>
        <Box sx={{
          display: 'grid', alignItems: 'center', gap: { xs: 4, md: 7 },
          gridTemplateColumns: { xs: '1fr', md: hasImage ? '1fr 1fr' : '1fr' },
          maxWidth: hasImage ? 'none' : 820, mx: 'auto',
        }}>
          <Box sx={{ order: { md: section.imageSide === 'left' ? 2 : 1 } }}>
            {titleSlot ?? (
              <Typography variant="h2" sx={{ color: heading, fontSize: { xs: 28, md: 38 }, mb: 2.5 }}>
                {section.title}
              </Typography>
            )}
            {bodySlot ?? <RichParagraph value={section.body} sx={{ color, fontSize: 16, lineHeight: 1.75 }} />}
          </Box>
          {hasImage && (
            <Box sx={{ order: { md: section.imageSide === 'left' ? 1 : 2 } }}>
              {imageSlot ?? (
                <Box
                  component="img"
                  src={section.image}
                  alt=""
                  loading="lazy"
                  sx={{ display: 'block', width: '100%', height: { xs: 260, md: 380 }, objectFit: 'cover', borderRadius: 2 }}
                />
              )}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}
