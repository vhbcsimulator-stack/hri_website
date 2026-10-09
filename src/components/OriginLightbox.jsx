import { useEffect, useState } from 'react'
import { Box, IconButton, Modal, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const DURATION = 750
// Slow-in, slow-out: a measured, formal glide rather than a springy pop.
const EASE = 'cubic-bezier(.77,0,.175,1)'
const CAPTION_SPACE = 84

// Where the photo lands: a centred 16:10-ish frame that fits the viewport,
// leaving room for the caption underneath.
function targetRect() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const width = Math.min(vw * (vw < 900 ? 0.92 : 0.8), 1100)
  const height = Math.min(width * 0.62, vh - CAPTION_SPACE - 96)
  return { top: (vh - height - CAPTION_SPACE) / 2, left: (vw - width) / 2, width, height }
}

// A photo that grows out of the thumbnail that opened it, then returns into it
// on close. `item` is { src, title, eyebrow, origin } where `origin` is the
// thumbnail's DOMRect; pass null to close. `onExited` fires once it's gone.
export default function OriginLightbox({ item, onClose, onExited }) {
  // `current` outlives `item` long enough to play the closing animation; it is
  // adjusted during render so the frame first paints at the thumbnail.
  const [current, setCurrent] = useState(null)
  const [grown, setGrown] = useState(null)
  const [, setViewport] = useState(0)
  if (item && item !== current) setCurrent(item)
  const expanded = item != null && grown === item

  useEffect(() => {
    if (item) {
      // Two frames: paint at the thumbnail first so the flight transitions.
      let inner = 0
      const outer = requestAnimationFrame(() => { inner = requestAnimationFrame(() => setGrown(item)) })
      return () => { cancelAnimationFrame(outer); cancelAnimationFrame(inner) }
    }
    const timer = setTimeout(() => { setCurrent(null); onExited?.() }, DURATION)
    return () => clearTimeout(timer)
  }, [item]) // eslint-disable-line react-hooks/exhaustive-deps

  // Freeze the page behind it (the modal's lock alone doesn't stop the site's
  // smooth-scroll handler or iOS Safari), and re-fit on resize.
  useEffect(() => {
    if (!current) return undefined
    const block = (e) => {
      if (e.type === 'touchmove' && e.touches.length > 1) return
      e.preventDefault()
      e.stopPropagation()
    }
    const onResize = () => setViewport((n) => n + 1)
    const opts = { capture: true, passive: false }
    window.addEventListener('wheel', block, opts)
    window.addEventListener('touchmove', block, opts)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('wheel', block, opts)
      window.removeEventListener('touchmove', block, opts)
      window.removeEventListener('resize', onResize)
    }
  }, [current])

  if (!current) return null

  const { origin } = current
  const target = targetRect()
  const rect = expanded || !origin ? target : origin
  const reduced = { '@media (prefers-reduced-motion: reduce)': { transition: 'none !important' } }
  // The caption arrives after the photo lands and leaves before it flies back.
  const captionDelay = (open) => (open ? `${DURATION * 0.6}ms` : '0ms')

  return (
    <Modal open onClose={onClose} hideBackdrop aria-label={current.title}>
      <Box sx={{ position: 'fixed', inset: 0, outline: 'none' }}>
        <Box onClick={onClose} sx={{
          position: 'absolute', inset: 0, bgcolor: 'rgba(2,20,2,.94)', backdropFilter: expanded ? 'blur(6px)' : 'blur(0px)',
          opacity: expanded ? 1 : 0, transition: `opacity ${DURATION}ms ease, backdrop-filter ${DURATION}ms ease`, ...reduced,
        }} />

        {/* Photo frame: flies from the thumbnail's box to the centre. */}
        <Box sx={{
          position: 'fixed', top: rect.top, left: rect.left, width: rect.width, height: rect.height,
          borderRadius: expanded ? '6px' : '8px', overflow: 'hidden', bgcolor: '#0c3d0c',
          boxShadow: expanded ? '0 40px 90px rgba(0,0,0,.55)' : '0 6px 18px rgba(0,0,0,.35)',
          transition: ['top', 'left', 'width', 'height', 'border-radius', 'box-shadow'].map((p) => `${p} ${DURATION}ms ${EASE}`).join(', '),
          ...reduced,
        }}>
          {/* Counter-zoom: the photo settles inward while the frame grows. */}
          <Box component="img" src={current.src} alt={current.title} sx={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            transform: expanded ? 'scale(1)' : 'scale(1.35)',
            transition: `transform ${DURATION * 1.3}ms ${EASE}`, ...reduced,
          }} />
          {/* Fine inner rule that fades in once landed. */}
          <Box aria-hidden sx={{
            position: 'absolute', inset: 14, border: '1px solid rgba(255,255,255,.45)', borderRadius: '2px', pointerEvents: 'none',
            opacity: expanded ? 1 : 0, transform: expanded ? 'scale(1)' : 'scale(1.03)',
            transition: `opacity 500ms ease ${captionDelay(expanded)}, transform 700ms ${EASE} ${captionDelay(expanded)}`, ...reduced,
          }} />
        </Box>

        {/* Caption */}
        <Box sx={{
            position: 'fixed', left: 0, right: 0, top: target.top + target.height + 22,
            textAlign: 'center', color: '#fff', pointerEvents: 'none',
            opacity: expanded ? 1 : 0, transform: expanded ? 'translateY(0)' : 'translateY(10px)',
            transition: `opacity 450ms ease ${captionDelay(expanded)}, transform 600ms ${EASE} ${captionDelay(expanded)}`, ...reduced,
          }}>
            {current.eyebrow && (
              <Typography sx={{ fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', color: '#a8ffa8' }}>
                {current.eyebrow}
              </Typography>
            )}
            <Box aria-hidden sx={{
              width: 56, height: '1px', bgcolor: 'rgba(168,255,168,.7)', mx: 'auto', my: 1,
              transform: expanded ? 'scaleX(1)' : 'scaleX(0)',
              transition: `transform 600ms ${EASE} ${expanded ? `${DURATION * 0.8}ms` : '0ms'}`, ...reduced,
            }} />
            <Typography sx={{
              fontWeight: 700, fontSize: { xs: 17, md: 22 }, textTransform: 'uppercase',
              letterSpacing: expanded ? '1px' : '6px', transition: `letter-spacing 800ms ${EASE} ${captionDelay(expanded)}`, ...reduced,
            }}>
              {current.title}
            </Typography>
          </Box>

        <IconButton aria-label="Close" onClick={onClose} sx={{
          position: 'absolute', top: { xs: 12, md: 24 }, right: { xs: 12, md: 24 },
          color: '#fff', border: '1px solid rgba(255,255,255,.35)', '&:hover': { bgcolor: 'rgba(255,255,255,.12)' },
          opacity: expanded ? 1 : 0, transition: `opacity 400ms ease ${captionDelay(expanded)}`,
        }}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Modal>
  )
}
