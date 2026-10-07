import Reveal from './Reveal'
import CustomSection from '../../shared/content/CustomSection'
import { customSectionsAfter, isSectionHidden } from '../../shared/content/pageLayout'

// One built-in page section plus the admin-added sections placed after it.
// A section hidden in the admin renders nothing; its custom sections still show.
export default function PageSection({ id, layout, children }) {
  const custom = customSectionsAfter(layout, id).filter((section) => !section.hidden)
  return (
    <>
      {!isSectionHidden(layout, id) && children}
      {custom.map((section) => (
        <Reveal key={section.id} variant="up">
          <CustomSection section={section} />
        </Reveal>
      ))}
    </>
  )
}
