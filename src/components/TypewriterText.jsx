import { isValidElement, useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'

function getTextContent(value) {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (Array.isArray(value)) return value.map(getTextContent).join('')
  if (isValidElement(value)) return getTextContent(value.props.children)

  if (value && typeof value === 'object') {
    return getTextContent(value.text ?? value.label ?? value.value ?? '')
  }

  return ''
}

export default function TypewriterText({
  children,
  delay = 150,
  speed = 24,
  cursor = true,
  sx,
}) {
  const ref = useRef(null)
  const text = getTextContent(children)
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined'
      && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches),
  )
  const [characters, setCharacters] = useState(() => reducedMotion ? text.length : 0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (reducedMotion) return undefined

    const element = ref.current
    if (!element) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setCharacters(0)
        setStarted(true)
        observer.disconnect()
      }
    }, { threshold: 0.35 })

    observer.observe(element)
    return () => observer.disconnect()
  }, [reducedMotion, text])

  useEffect(() => {
    if (!started || reducedMotion) return undefined

    let typeTimer
    const startTimer = window.setTimeout(() => {
      let index = 0
      typeTimer = window.setInterval(() => {
        index += 1
        setCharacters(index)
        if (index >= text.length) window.clearInterval(typeTimer)
      }, speed)
    }, delay)

    return () => {
      window.clearTimeout(startTimer)
      window.clearInterval(typeTimer)
    }
  }, [delay, reducedMotion, speed, started, text])

  const typing = characters < text.length

  return (
    <Box
      ref={ref}
      component="span"
      aria-label={text}
      sx={{ position: 'relative', display: 'inline', ...sx }}
    >
      <Box component="span" aria-hidden>
        {text.slice(0, characters)}
      </Box>
      {cursor && !reducedMotion && (
        <Box
          component="span"
          aria-hidden
          sx={{
            display: 'inline-block',
            width: '0.08em',
            height: '1em',
            ml: '0.1em',
            verticalAlign: '-0.12em',
            bgcolor: 'currentColor',
            opacity: typing ? 1 : 0,
            animation: typing ? 'typewriterBlink .75s steps(1) infinite' : 'none',
            '@keyframes typewriterBlink': {
              '0%, 45%': { opacity: 1 },
              '46%, 100%': { opacity: 0 },
            },
          }}
        />
      )}
    </Box>
  )
}
