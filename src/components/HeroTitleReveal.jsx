import { Box } from '@mui/material'

export default function HeroTitleReveal({ children, delay = 140 }) {
  return (
    <Box component="span" sx={{ display: 'block', overflow: 'hidden', pb: '.08em', mb: '-.08em' }}>
      <Box
        component="span"
        sx={{
          display: 'block',
          opacity: 0,
          animation: `pageHeroTitleReveal 900ms cubic-bezier(.16, 1, .3, 1) ${delay}ms forwards`,
          '@keyframes pageHeroTitleReveal': {
            from: { opacity: 0, transform: 'translateY(105%) scale(.985)' },
            to: { opacity: 1, transform: 'translateY(0) scale(1)' },
          },
          '@media (prefers-reduced-motion: reduce)': {
            opacity: 1,
            animation: 'none',
            transform: 'none',
          },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
