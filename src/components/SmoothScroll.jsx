import { useEffect } from 'react'

function hasScrollableParent(target) {
  let element = target instanceof Element ? target : null

  while (element && element !== document.body) {
    const style = window.getComputedStyle(element)
    const canScroll = /(auto|scroll)/.test(style.overflowY)

    if (canScroll && element.scrollHeight > element.clientHeight) return true
    element = element.parentElement
  }

  return false
}

const EASING = 0.14

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined

    let targetY = window.scrollY
    let frame = 0
    // Where the loop last put the page. If a scroll event reports a position
    // other than this, something outside this component moved us — an anchor
    // jump, the keyboard, a scrollbar drag — and the loop has to let go rather
    // than drag the page back to its own target.
    let appliedY = window.scrollY
    const previousScrollBehavior = document.documentElement.style.scrollBehavior

    const restoreScrollBehavior = () => {
      document.documentElement.style.scrollBehavior = previousScrollBehavior
    }

    // Hand scrolling back to the browser, wherever the page currently sits.
    const release = () => {
      window.cancelAnimationFrame(frame)
      frame = 0
      targetY = window.scrollY
      appliedY = window.scrollY
      restoreScrollBehavior()
    }

    const animate = () => {
      frame = 0
      const currentY = window.scrollY
      const difference = targetY - currentY
      const step = difference * EASING

      // Snap home once the remaining distance — or the step it would take — is
      // under a pixel. Testing the distance alone let the loop spin forever: a
      // sub-pixel step rounds back to the same offset, so `currentY` never
      // moves, `difference` never shrinks, and the exit is never reached. A
      // loop stuck that way freezes `targetY` and fights every anchor jump.
      if (Math.abs(difference) < 1 || Math.abs(step) < 1) {
        window.scrollTo(0, targetY)
        appliedY = window.scrollY
        restoreScrollBehavior()
        return
      }

      window.scrollTo(0, currentY + step)
      appliedY = window.scrollY
      frame = window.requestAnimationFrame(animate)
    }

    const onWheel = (event) => {
      if (event.ctrlKey || event.metaKey || hasScrollableParent(event.target)) return

      event.preventDefault()
      document.documentElement.style.scrollBehavior = 'auto'

      const multiplier = event.deltaMode === 1
        ? 16
        : event.deltaMode === 2
          ? window.innerHeight
          : 1
      const maximumY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)

      // Continue from the live position when idle, so a wheel gesture after an
      // anchor jump picks up from the section the browser landed on.
      const from = frame ? targetY : window.scrollY

      targetY = Math.max(0, Math.min(maximumY, from + event.deltaY * multiplier))
      if (!frame) frame = window.requestAnimationFrame(animate)
    }

    const syncPosition = () => {
      if (!frame) {
        targetY = window.scrollY
        appliedY = window.scrollY
        return
      }
      // Mid-flight, but the page is somewhere the loop did not put it.
      if (Math.abs(window.scrollY - appliedY) > 2) release()
    }

    // Capture phase, so `scroll-behavior` is restored before the browser
    // performs the jump — otherwise in-page links land instantly instead of
    // gliding, and a live loop would yank them back.
    const onClickCapture = (event) => {
      const element = event.target instanceof Element ? event.target : null
      if (element?.closest('a[href*="#"], [data-scroll-anchor]')) release()
    }

    const resetToTop = () => {
      window.cancelAnimationFrame(frame)
      frame = 0
      targetY = 0
      appliedY = 0
      document.documentElement.style.scrollBehavior = 'auto'
      window.scrollTo(0, 0)
      restoreScrollBehavior()
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', syncPosition, { passive: true })
    window.addEventListener('hashchange', release)
    document.addEventListener('click', onClickCapture, true)
    window.addEventListener('site-scroll-to-top', resetToTop)
    window.addEventListener('site-cancel-smooth-scroll', release)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', syncPosition)
      window.removeEventListener('hashchange', release)
      document.removeEventListener('click', onClickCapture, true)
      window.removeEventListener('site-scroll-to-top', resetToTop)
      window.removeEventListener('site-cancel-smooth-scroll', release)
      window.cancelAnimationFrame(frame)
      restoreScrollBehavior()
    }
  }, [])

  return null
}
