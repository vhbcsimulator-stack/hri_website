import { Children, Fragment, isValidElement } from 'react'
import { Box } from '@mui/material'
import Reveal from './Reveal'
import CustomSection from '../../shared/content/CustomSection'
import { isSectionHidden, sectionOrder } from '../../shared/content/pageLayout'

// Renders a page's sections in the order arranged in the admin. Children are
// the page's built-in sections, each wrapped in <PageSection id="…">; custom
// sections come from the layout. Hidden sections are left out.
export default function PageSections({ pageKey, layout, children }) {
  const builtIn = {}
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.props.id) builtIn[child.props.id] = child
  })
  const custom = new Map((layout.custom || []).map((section) => [section.id, section]))

  return (
    <Box>
      {sectionOrder(pageKey, layout).map((id) => {
        if (builtIn[id]) return isSectionHidden(layout, id) ? null : <Fragment key={id}>{builtIn[id]}</Fragment>
        const section = custom.get(id)
        if (!section || section.hidden) return null
        return (
          <Reveal key={id} variant="up">
            <CustomSection section={section} />
          </Reveal>
        )
      })}
    </Box>
  )
}
