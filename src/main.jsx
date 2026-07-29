import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './styles/theme.js'
import './index.css'
import App from './App.jsx'
import SmoothScroll from './components/SmoothScroll.jsx'
import { queryClient } from './lib/queryClient.js'
import { QueryClientProvider } from '@tanstack/react-query'
import { siteContentQuery } from './hooks/usePageContent.js'

// Start the one content request now rather than after React's first commit.
queryClient.prefetchQuery(siteContentQuery)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <SmoothScroll />
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
