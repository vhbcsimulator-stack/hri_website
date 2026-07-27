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
  children, variant = 'up', delay = 0, duration = 700, once = true, sx,
}) {
  const ref = useRef(null)
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
      {children}
    </Box>
  )
}
