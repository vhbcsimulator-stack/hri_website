import { Box, Typography } from '@mui/material'
import { BULLETS } from '../../shared/content/blocks'

// Body type shared by paragraphs and bullets, matching the legal pages.
const bodySx = { color: 'text.secondary', fontSize: 15.5, lineHeight: 1.9 }

// Renders a section body — a mixed list of paragraph and bullet-list blocks.
// Used by both the legal pages and the sitemap so they stay identical.
export default function ContentBlocks({ blocks }) {
  return (blocks || []).map((block, index) => (
    block.type === BULLETS ? (
      <Box
        key={index}
        component="ul"
        sx={{ pl: 3, my: index > 0 ? 2 : 0, listStyleType: 'disc' }}
      >
        {(block.items || []).map((item, itemIndex) => (
          <Typography key={itemIndex} component="li" sx={{ ...bodySx, '&::marker': { color: 'primary.main' } }}>
            {item}
          </Typography>
        ))}
      </Box>
    ) : (
      <Typography key={index} sx={{ ...bodySx, mt: index > 0 ? 2 : 0 }}>
        {block.text}
      </Typography>
    )
  ))
}
