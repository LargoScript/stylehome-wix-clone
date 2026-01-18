// Модуль для ініціалізації Footer секцій

import { insertFooter, updateFooter, type FooterConfig } from '../components/Footer';

/**
 * Конфігурація Footer за замовчуванням
 */
const defaultFooterConfig: FooterConfig = {
  logo: {
    src: '/img/logo-red.svg',
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
      iconSrc: '/img/social_ico/instagram.avif',
      alt: 'Instagram',
      target: '_blank'
    },
    {
      href: 'https://www.thumbtack.com/wa/vancouver/general-contractors/style-homes-llc/service/542227943368220678',
      iconSrc: '/img/social_ico/thumbtack.avif',
      alt: 'Thumbtack',
      target: '_blank'
    }
  ],
  quickLinks: [
    { text: 'Home', href: '/' },
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
  copyright: '© Style Homes 2025'
};

/**
 * Ініціалізація Footer секції на поточній сторінці
 */
export function initFooter(): void {
  const existingFooter = document.querySelector<HTMLElement>('.footer');
  
  if (existingFooter) {
    // Якщо footer вже є, оновлюємо його через updateFooter
    updateFooter(existingFooter, defaultFooterConfig);
  } else {
    // Якщо footer немає, вставляємо новий
    const body = document.querySelector<HTMLElement>('body');
    if (body) {
      insertFooter(body, defaultFooterConfig);
    }
  }
}

/**
 * Ініціалізація Footer з кастомною конфігурацією
 */
export function initFooterWithConfig(config: FooterConfig): void {
  const body = document.querySelector<HTMLElement>('body');
  if (body) {
    insertFooter(body, config);
  }
}
