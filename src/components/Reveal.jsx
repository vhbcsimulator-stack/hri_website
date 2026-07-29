import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'

// Hidden-state transform per variant. The element animates from this to none.
const VARIANTS = {
  up: 'translateY(32px)',
  down: 'translateY(-32px)',
  left: 'translateX(48px)',   // slides in from the right
  right: 'translateX(-48px)', // slides in from the left
  zoom: 'scale(.9)',
  'zoom-up': 'translateY(32px) scale(.94)',
  fade: 'none',
}

// Scroll-reveal wrapper: fades + transforms its children in when they enter the
// viewport. Respects prefers-reduced-motion. `variant` picks the motion,
// `delay` (ms) staggers items, `duration` (ms) tunes speed.
export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  duration = 700,
  once = true,
  postRevealMotion = true,
  sx,
}) {
  const ref = useRef(null)
  const contentRef = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
            if (once) io.unobserve(entry.target)
          } else if (!once) {
            setShown(false)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once])

  useEffect(() => {
    const element = ref.current
    const content = contentRef.current
    if (!element || !content || !shown || !postRevealMotion) return undefined
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined

    let frame = 0
    const update = () => {
      frame = 0
      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const distanceFromCenter = (elementCenter - viewportHeight / 2) / (viewportHeight / 2)
      // Only the approach from below drives the effect: positive means the
      // section still sits under the viewport centre. Once it passes the centre
      // the value clamps to 0, so scrolling further down keeps it fully zoomed
      // in — it only zooms back out when you scroll up past the centre again.
      const approach = Math.max(0, Math.min(1, distanceFromCenter))
      const translateY = approach * 18
      const scale = 1 - approach * 0.03

      content.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`
    }

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      window.cancelAnimationFrame(frame)
      content.style.transform = ''
    }
  }, [postRevealMotion, shown])

  const hidden = VARIANTS[variant] ?? VARIANTS.up

  return (
    <Box
      ref={ref}
      sx={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : hidden,
        transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms cubic-bezier(.2,.7,.2,1) ${delay}ms`,
        willChange: 'opacity, transform',
        ...sx,
      }}
    >
      <Box
        ref={contentRef}
        sx={{
          transform: 'translate3d(0, 0, 0)',
          transformOrigin: 'center center',
          transition: 'transform 70ms linear',
          willChange: shown && postRevealMotion ? 'transform' : 'auto',
          '@media (prefers-reduced-motion: reduce)': {
            transform: 'none !important',
            transition: 'none',
          },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
