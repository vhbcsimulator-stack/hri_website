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

function App() {
  return (
    <>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        {/* Static details page for now — no :id yet (frontend first). */}
        <Route path="/project-details" element={<ProjectDetailsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
        <Route path="/terms-of-service" element={<LegalPage type="terms" />} />
        <Route path="/cookie-policy" element={<LegalPage type="cookies" />} />
        <Route path="/sitemap" element={<SitemapPage />} />
      </Route>
    </Routes>
    <ContentManager />
    </>
  )
}

export default App
