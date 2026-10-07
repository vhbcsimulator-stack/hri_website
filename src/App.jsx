import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailsPage from './pages/ProjectDetailsPage'
import ContactPage from './pages/ContactPage'
import LegalPage from './pages/LegalPage'
import SitemapPage from './pages/SitemapPage'
import ContentManager from './content/ContentManager'
import PageGate from './components/PageGate'

function App() {
  return (
    <>
    <Routes>
      <Route element={<Layout />}>
        {/* PageGate swaps a page the admin switched off for a maintenance notice. */}
        <Route path="/" element={<PageGate pageKey="home"><HomePage /></PageGate>} />
        <Route path="/about" element={<PageGate pageKey="about"><AboutPage /></PageGate>} />
        <Route path="/projects" element={<PageGate pageKey="projects"><ProjectsPage /></PageGate>} />
        {/* Static details page for now — no :id yet (frontend first). */}
        <Route path="/project-details" element={<PageGate pageKey="project-details"><ProjectDetailsPage /></PageGate>} />
        <Route path="/contact" element={<PageGate pageKey="contact"><ContactPage /></PageGate>} />
        <Route path="/privacy-policy" element={<PageGate pageKey="privacy-policy"><LegalPage type="privacy" /></PageGate>} />
        <Route path="/terms-of-service" element={<PageGate pageKey="terms-of-service"><LegalPage type="terms" /></PageGate>} />
        <Route path="/cookie-policy" element={<PageGate pageKey="cookie-policy"><LegalPage type="cookies" /></PageGate>} />
        <Route path="/sitemap" element={<PageGate pageKey="sitemap"><SitemapPage /></PageGate>} />
      </Route>
    </Routes>
    {/* Dev-only: the overlay editor reads /api/content, which exists only
        behind the Vite middleware. In a production build it can never load
        anything but the snapshot the pages already render. */}
    {import.meta.env.DEV && <ContentManager />}
    </>
  )
}

export default App
