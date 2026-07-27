import { createTheme } from '@mui/material/styles'

// Bright Hermosa Realty Inc. — brand palette & typography
const GREEN = '#006600'
const GREEN_DARK = '#032803'
const BLUE = '#0000FF'
const INK = '#0d1f0d'
const BUTTON = '#024A01' // primary button colour
const BUTTON_HOVER = '#013600'

const theme = createTheme({
  palette: {
    primary: { main: GREEN, dark: GREEN_DARK, contrastText: '#ffffff' },
    secondary: { main: BLUE, contrastText: '#ffffff' },
    text: { primary: INK, secondary: '#55605a' },
    background: { default: '#ffffff', paper: '#ffffff' },
    brand: {
      green: GREEN,
      greenDark: GREEN_DARK,
      greenDeep: '#021c02',
      blue: BLUE,
      surface: '#f4f6f4',
      line: '#e6e8e6',
    },
  },
  typography: {
    fontFamily: '"Poppins", system-ui, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.02 },
    h2: { fontWeight: 700, letterSpacing: '-0.5px', textTransform: 'uppercase' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.2px' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 26, paddingBlock: 12 },
        // All solid buttons use the brand green #024A01.
        contained: {
          backgroundColor: BUTTON,
          color: '#ffffff',
          '&:hover': { backgroundColor: BUTTON_HOVER },
        },
        // Outlined buttons follow the same green (except where overridden inline).
        outlinedPrimary: {
          color: BUTTON,
          borderColor: BUTTON,
          '&:hover': { borderColor: BUTTON_HOVER, backgroundColor: 'rgba(2,74,1,0.06)' },
        },
      },
    },
    MuiContainer: {
      defaultProps: { maxWidth: 'lg' },
    },
  },
})

export default theme
