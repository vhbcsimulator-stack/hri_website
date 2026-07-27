import { fetchPageContent, persistPageContent } from '@content-backend'

export const SITEMAP_PAGE_ID = 'sitemap'

// Editable content for the Sitemap page. Link groups list the site's pages;
// `to` is the route each link points at. These are the fallbacks the site
// renders before (or without) any saved content.
export const sitemapContentData = {
  eyebrow: 'Explore',
  title: 'Sitemap',
  subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  groups: [
    {
      title: 'Main Pages',
      links: [
        { label: 'Home', to: '/' },
        { label: 'About Us', to: '/about' },
        { label: 'Projects', to: '/projects' },
        { label: 'Contact Us', to: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', to: '/privacy-policy' },
        { label: 'Terms of Service', to: '/terms-of-service' },
        { label: 'Cookie Policy', to: '/cookie-policy' },
      ],
    },
  ],
}

export const getSitemapContent = () => fetchPageContent(SITEMAP_PAGE_ID, sitemapContentData)

export const saveSitemapContent = (content) => persistPageContent(SITEMAP_PAGE_ID, content)
