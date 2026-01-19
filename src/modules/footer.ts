// Module for initializing Footer sections

import { insertFooter, updateFooter, type FooterConfig, type FooterLink } from '../components/Footer';

/**
 * Get current page name (e.g., 'index.html', 'kitchen-renovation.html')
 */
function getCurrentPage(): string {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  return page;
}

/**
 * Check if current page is the main index page
 */
function isMainPage(): boolean {
  const currentPage = getCurrentPage();
  return currentPage === 'index.html' || currentPage === '' || currentPage === '/';
}

/**
 * Normalize Quick Links hrefs - add index.html prefix for anchor links on non-main pages
 */
function normalizeQuickLinks(quickLinks: FooterLink[]): FooterLink[] {
  const isMain = isMainPage();
  
  return quickLinks.map(link => {
    // If it's an anchor link (starts with #) and we're not on main page, add index.html
    if (link.href.startsWith('#') && !isMain) {
      return {
        ...link,
        href: `index.html${link.href}`
      };
    }
    return link;
  });
}

/**
 * Default Footer configuration
 */
const defaultFooterConfig: FooterConfig = {
  logo: {
    src: 'img/logo-red.svg',
    alt: 'Style Homes Logo'
  },
  contacts: [
    {
      text: 'Washington License: STYLEHL751CS',
      href: 'https://secure.lni.wa.gov/verify/Detail.aspx?UBI=605394148&LIC=STYLEHL751CS&SAW=',
      target: '_blank'
    },
    {
      text: 'Oregon CCB: 259642',
      href: 'https://search.ccb.state.or.us/search/list_results.aspx',
      target: '_blank'
    },
    {
      text: '+1 (503) 980 5216',
      href: 'tel:+15039805216'
    },
    {
      text: 'chaikataras@icloud.com',
      href: 'mailto:chaikataras@icloud.com'
    }
  ],
  socials: [
    {
      href: 'https://www.instagram.com/style_homes_usa',
      iconSrc: 'img/social_ico/instagram.avif',
      alt: 'Instagram',
      target: '_blank'
    },
    {
      href: 'https://www.thumbtack.com/wa/vancouver/general-contractors/style-homes-llc/service/542227943368220678',
      iconSrc: 'img/social_ico/thumbtack.avif',
      alt: 'Thumbtack',
      target: '_blank'
    }
  ],
  quickLinks: [
    { text: 'Home', href: '#hero' },
    { text: 'Services', href: '#services' },
    { text: 'Projects', href: '#projects' },
    { text: 'About', href: '#about' },
    { text: 'Get Free Quote', href: '#consultation' },
    { text: 'FAQ', href: '#faq' }
  ],
  serviceAreas: [
    'Portland, OR +50 miles',
    'Vancouver, WA +50 miles'
  ],
  ourServices: [
    { text: 'Wood and Panel Wall Decor', href: 'wood-and-panel-wall-decor.html' },
    { text: 'Kitchen Renovation', href: 'kitchen-renovation.html' },
    { text: 'Bathroom Renovation', href: 'bathroom-renovation.html' },
    { text: 'Whole-Home Transformation', href: 'whole-home-transformation.html' }
  ],
  copyright: '© Style Homes 2025'
};

/**
 * Initialize Footer section on current page
 */
export function initFooter(): void {
  const existingFooter = document.querySelector<HTMLElement>('.footer');
  
  // Normalize quick links based on current page
  const normalizedConfig: FooterConfig = {
    ...defaultFooterConfig,
    quickLinks: normalizeQuickLinks(defaultFooterConfig.quickLinks)
  };
  
  if (existingFooter) {
    // If footer already exists, update it via updateFooter
    updateFooter(existingFooter, normalizedConfig);
  } else {
    // If footer doesn't exist, insert new one
    const body = document.querySelector<HTMLElement>('body');
    if (body) {
      insertFooter(body, normalizedConfig);
    }
  }
}

/**
 * Initialize Footer with custom configuration
 */
export function initFooterWithConfig(config: FooterConfig): void {
  const body = document.querySelector<HTMLElement>('body');
  if (body) {
    insertFooter(body, config);
  }
}
