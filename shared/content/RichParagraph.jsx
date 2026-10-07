import { Box } from '@mui/material'
import { richTextHtml, inlineRichTextSx } from './richText'

// Renders a paragraph field — plain text from older saves or rich HTML from
// the admin's Quill editor — sanitized. Pass the same sx the field used to get
// as a Typography; it renders as a <div> because the HTML carries its own <p>s.
export default function RichParagraph({ value, sx, component = 'div', ...props }) {
  return (
    <Box
      component={component}
      sx={[inlineRichTextSx, ...(Array.isArray(sx) ? sx : [sx])]}
      dangerouslySetInnerHTML={{ __html: richTextHtml(value) }}
      {...props}
    />
  )
}
