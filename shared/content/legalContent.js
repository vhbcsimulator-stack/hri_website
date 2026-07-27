import { fetchPageContent, persistPageContent } from '@content-backend'

export const LEGAL_PAGE_ID = 'legal'

// The three legal pages (Privacy, Terms, Cookies) share one editable document
// keyed by type. Each admin route edits its own branch; the public LegalPage
// renders the branch for its `type`. These are the fallbacks the site shows
// before (or without) any saved content.
export const legalContentData = {
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    updated: 'Lorem ipsum dolor sit amet',
    sections: [
      { heading: 'Information We Collect', copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
      { heading: 'How We Use Information', copy: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
      { heading: 'Information Sharing', copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
      { heading: 'Your Rights', copy: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
      { heading: 'Contact Us', copy: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    ],
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms of Service',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    updated: 'Lorem ipsum dolor sit amet',
    sections: [
      { heading: 'Acceptance of Terms', copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
      { heading: 'Use of Our Website', copy: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
      { heading: 'Property Information', copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
      { heading: 'Limitation of Liability', copy: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
      { heading: 'Changes to These Terms', copy: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    ],
  },
  cookies: {
    eyebrow: 'Legal',
    title: 'Cookie Policy',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    updated: 'Lorem ipsum dolor sit amet',
    sections: [
      { heading: 'What Are Cookies?', copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
      { heading: 'How We Use Cookies', copy: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
      { heading: 'Types of Cookies', copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
      { heading: 'Managing Cookies', copy: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
      { heading: 'Policy Updates', copy: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    ],
  },
}

export const getLegalContent = () => fetchPageContent(LEGAL_PAGE_ID, legalContentData)

export const saveLegalContent = (content) => persistPageContent(LEGAL_PAGE_ID, content)
