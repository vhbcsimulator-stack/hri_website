import { Box } from '@mui/material'
import logo from '../assets/images/logo/hri_logo.png'

export default function BrandMark({ light = false }) {
  return (
    <Box component="a" href="/" sx={{ display: 'inline-flex', alignItems: 'center' }}>
      <Box
        component="img"
        src={logo}
        alt="Hermosa Residences Inc."
        sx={{
          height: { xs: 48, md: 56 },
          width: 'auto',
          display: 'block',
          ...(light && {
            bgcolor: '#fff',
            px: 1,
            py: 0.5,
          }),
        }}
      />
    </Box>
  )
}
