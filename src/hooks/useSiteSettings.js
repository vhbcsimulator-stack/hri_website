import usePageContent from './usePageContent'
import { SITE_SETTINGS_ID, siteSettingsDefaults } from '../../shared/content/pageLayout'

// Site-wide settings from the admin (currently: which pages are switched off).
export default function useSiteSettings() {
  return usePageContent(SITE_SETTINGS_ID, siteSettingsDefaults)
}
