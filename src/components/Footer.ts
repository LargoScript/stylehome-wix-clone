// Компоnotнт Footer section

export interface FooterLink {
  /** Текст reference */
  text: string;
  /** URL reference */
  href: string;
  /** Чи відкривати в новій вкладці */
  target?: '_blank' | '_self';
}

export interface FooterSocial {
  /** URL соціальної мережі */
  href: string;
  /** Шлях до іконки */
  iconSrc: string;
  /** Alt текст for іконки */
  alt: string;
  /** Чи відкривати в новій вкладці */
  target?: '_blank' | '_self';
}

export interface FooterContact {
  /** Текст контакту */
  text: string;
  /** URL (tel:, mailto:, або withвичайний URL) */
  href: string;
  /** Чи відкривати в новій вкладці */
  target?: '_blank' | '_self';
}

export interface FooterConfig {
  /** Логотип компанії */
  logo: {
    src: string;
    alt: string;
  };
  /** Контактна інформація */
  contacts: FooterContact[];
  /** Соціальні мережі */
  socials: FooterSocial[];
  /** Швидкі reference */
  quickLinks: FooterLink[];
  /** Withони обслуговування */
  serviceAreas: string[];
  /** Копірайт текст */
  copyright: string;
  /** Додаткові classи for footer */
  additionalClasses?: string;
}

/**
 * Геnotрація HTML for Footer section
 */
export function generateFooterHTML(config: FooterConfig): string {
  const {
    logo,
    contacts,
    socials,
    quickLinks,
    serviceAreas,
    copyright,
    additionalClasses = ''
  } = config;

  const footerClasses = ['footer', additionalClasses].filter(Boolean).join(' ');

  // Геnotрація контактних посилань
  const contactsHTML = contacts
    .map(
      contact => `
      <a class="footer__link" href="${contact.href}" ${contact.target ? `target="${contact.target}"` : ''}>
        ${contact.text}
      </a>`
    )
    .join('');

  // Геnotрація соціальних мереж
  const socialsHTML = socials
    .map(
      social => `
        <a href="${social.href}" ${social.target || '_blank' ? `target="${social.target || '_blank'}"` : ''} class="footer__icon">
          <img src="${social.iconSrc}" alt="${social.alt}" loading="lazy" decoding="async">
        </a>`
    )
    .join('');

  // Геnotрація швидких посилань
  const quickLinksHTML = quickLinks
    .map(
      link => `
            <li><a href="${link.href}" ${link.target ? `target="${link.target}"` : ''}>${link.text}</a></li>`
    )
    .join('');

  // Геnotрація withон обслуговування
  const serviceAreasHTML = serviceAreas
    .map(area => `<li>${area}</li>`)
    .join('');

  return `
    <footer class="${footerClasses}">
      <section class="footer__section">
        <div class="footer__container">
          <!-- Brand / Contacts -->
          <div class="footer__col footer__brand">
            <div class="footer__logo">
              <img src="${logo.src}" alt="${logo.alt}" loading="lazy" decoding="async">
            </div>
            ${contactsHTML}
            <div class="footer__socials">
              ${socialsHTML}
            </div>
          </div>

          <!-- Quick Links -->
          <div class="footer__col">
            <h4 class="footer__title">Quick Links</h4>
            <nav class="footer__nav">
              <ul>
                ${quickLinksHTML}
              </ul>
            </nav>
          </div>

          <!-- Service Areas -->
          <div class="footer__col">
            <h4 class="footer__title">Service Areas</h4>
            <ul class="footer__list">
              ${serviceAreasHTML}
            </ul>
          </div>
        </div>

        <div class="footer__bottom">
          <div class="footer__bottom-logo">
            <img src="${logo.src}" alt="${logo.alt}" loading="lazy" decoding="async">
          </div>
          <p>${copyright}</p>
        </div>
      </section>
    </footer>
  `.trim();
}

/**
 * Вставка Footer section в DOM
 */
export function insertFooter(
  container: HTMLElement | string,
  config: FooterConfig
): HTMLElement | null {
  const html = generateFooterHTML(config);

  let targetElement: HTMLElement | null = null;

  if (typeof container === 'string') {
    targetElement = document.querySelector<HTMLElement>(container);
  } else {
    targetElement = container;
  }

  if (!targetElement) {
    console.error('Footer container not found');
    return null;
  }

  // If контейnotр - body, replace only footer
  if (targetElement === document.body) {
    const existingFooter = targetElement.querySelector<HTMLElement>('.footer');
    if (existingFooter) {
      existingFooter.outerHTML = html;
      return targetElement.querySelector<HTMLElement>('.footer');
    } else {
      // If footer doesn't exist, add в кіnotць body
      targetElement.insertAdjacentHTML('beforeend', html);
      return targetElement.querySelector<HTMLElement>('.footer');
    }
  } else {
    // For other контейnotрів replace innerHTML
    targetElement.innerHTML = html;
    return targetElement.querySelector<HTMLElement>('.footer');
  }
}

/**
 * Оновлення існуючої Footer section
 */
export function updateFooter(
  footerElement: HTMLElement | string,
  config: Partial<FooterConfig>
): HTMLElement | null {
  let footer: HTMLElement | null = null;

  if (typeof footerElement === 'string') {
    footer = document.querySelector<HTMLElement>(footerElement);
  } else {
    footer = footerElement;
  }

  if (!footer) {
    console.error('Footer element not found');
    return null;
  }

  // Update логотип
  if (config.logo) {
    const logoImages = footer.querySelectorAll<HTMLImageElement>('.footer__logo img, .footer__bottom-logo img');
    logoImages.forEach(img => {
      img.src = config.logo!.src;
      img.alt = config.logo!.alt;
    });
  }

  // Update контакти
  if (config.contacts) {
    const contactsContainer = footer.querySelector<HTMLElement>('.footer__brand');
    if (contactsContainer) {
      const existingLinks = contactsContainer.querySelectorAll<HTMLElement>('.footer__link');
      existingLinks.forEach(link => link.remove());

      config.contacts.forEach(contact => {
        const link = document.createElement('a');
        link.className = 'footer__link';
        link.href = contact.href;
        link.textContent = contact.text;
        if (contact.target) {
          link.target = contact.target;
        }
        const logo = contactsContainer.querySelector('.footer__logo');
        if (logo) {
          logo.insertAdjacentElement('afterend', link);
        }
      });
    }
  }

  // Update соціальні мережі
  if (config.socials) {
    const socialsContainer = footer.querySelector<HTMLElement>('.footer__socials');
    if (socialsContainer) {
      socialsContainer.innerHTML = config.socials
        .map(
          social => `
            <a href="${social.href}" ${social.target || '_blank' ? `target="${social.target || '_blank'}"` : ''} class="footer__icon">
              <img src="${social.iconSrc}" alt="${social.alt}" loading="lazy" decoding="async">
            </a>`
        )
        .join('');
    }
  }

  // Update швидкі reference
  if (config.quickLinks) {
    const quickLinksContainer = footer.querySelector<HTMLElement>('.footer__nav ul');
    if (quickLinksContainer) {
      quickLinksContainer.innerHTML = config.quickLinks
        .map(
          link => `
            <li><a href="${link.href}" ${link.target ? `target="${link.target}"` : ''}>${link.text}</a></li>`
        )
        .join('');
    }
  }

  // Update withони обслуговування
  if (config.serviceAreas) {
    const serviceAreasContainer = footer.querySelector<HTMLElement>('.footer__list');
    if (serviceAreasContainer) {
      serviceAreasContainer.innerHTML = config.serviceAreas
        .map(area => `<li>${area}</li>`)
        .join('');
    }
  }

  // Update копірайт
  if (config.copyright) {
    const copyrightEl = footer.querySelector<HTMLElement>('.footer__bottom p');
    if (copyrightEl) {
      copyrightEl.textContent = config.copyright;
    }
  }

  return footer;
}
