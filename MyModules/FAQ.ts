// FAQ Component - accordion section
// Part of MyModules library

export interface FAQItem {
  /** Question text */
  question: string;
  /** Answer text */
  answer: string;
  /** AOS animation delay (optional) */
  aosDelay?: number;
}

export interface FAQConfig {
  /** Section title */
  title: string;
  /** Section subtitle */
  subtitle: string;
  /** Background image URL (optional) */
  backgroundImage?: string;
  /** FAQ items array */
  items: FAQItem[];
  /** Section ID (default: 'faq') */
  sectionId?: string;
  /** Additional CSS classes */
  additionalClasses?: string;
  /** Enable AOS animations (default: true) */
  enableAOS?: boolean;
}

/**
 * Generate HTML for FAQ section
 */
export function generateFAQHTML(config: FAQConfig): string {
  const {
    title,
    subtitle,
    backgroundImage,
    items,
    sectionId = 'faq',
    additionalClasses = '',
    enableAOS = true
  } = config;

  const sectionClasses = ['faq', additionalClasses].filter(Boolean).join(' ');
  const backgroundStyle = backgroundImage 
    ? `style="background: url('${backgroundImage}') center / cover no-repeat;"`
    : '';

  const aosAttr = enableAOS ? 'data-aos="fade-up"' : '';
  
  // Generate FAQ items HTML
  const itemsHTML = items.map((item, index) => {
    const delay = item.aosDelay ?? (100 + index * 50);
    const itemAOS = enableAOS ? `data-aos="fade-up" data-aos-delay="${delay}"` : '';
    
    return `
      <div class="faq__item" ${itemAOS}>
        <div class="faq__question">${item.question}</div>
        <div class="faq__answer">
          <p>${item.answer}</p>
        </div>
      </div>
    `.trim();
  }).join('\n');

  const titleAOS = enableAOS ? 'data-aos="fade-up"' : '';
  const subtitleAOS = enableAOS ? 'data-aos="fade-up" data-aos-delay="50"' : '';

  return `
    <section class="${sectionClasses}" id="${sectionId}" ${aosAttr} ${backgroundStyle}>
      <div class="faq__overlay">
        <div class="faq__container">
          <h2 class="faq__title" ${titleAOS}>${title}</h2>
          <h5 class="faq__subtitle" ${subtitleAOS}>${subtitle}</h5>
          <div class="faq__accordion">
            ${itemsHTML}
          </div>
        </div>
      </div>
    </section>
  `.trim();
}

/**
 * Insert FAQ section into DOM
 */
export function insertFAQ(
  container: HTMLElement | string,
  config: FAQConfig
): HTMLElement | null {
  const html = generateFAQHTML(config);
  
  let targetElement: HTMLElement | null = null;
  
  if (typeof container === 'string') {
    targetElement = document.querySelector<HTMLElement>(container);
  } else {
    targetElement = container;
  }

  if (!targetElement) {
    console.error('FAQ container not found');
    return null;
  }

  targetElement.innerHTML = html;
  
  // Initialize FAQ accordion functionality
  const faqSection = targetElement.querySelector<HTMLElement>('.faq');
  if (faqSection) {
    initFAQAccordion(faqSection);
  }
  
  return faqSection;
}

/**
 * Update existing FAQ section
 */
export function updateFAQ(
  faqElement: HTMLElement | string,
  config: Partial<FAQConfig>
): HTMLElement | null {
  let faq: HTMLElement | null = null;
  
  if (typeof faqElement === 'string') {
    faq = document.querySelector<HTMLElement>(faqElement);
  } else {
    faq = faqElement;
  }

  if (!faq) {
    console.error('FAQ element not found');
    return null;
  }

  // Update title
  if (config.title) {
    const titleEl = faq.querySelector<HTMLElement>('.faq__title');
    if (titleEl) titleEl.textContent = config.title;
  }

  // Update subtitle
  if (config.subtitle !== undefined) {
    const subtitleEl = faq.querySelector<HTMLElement>('.faq__subtitle');
    if (subtitleEl) {
      subtitleEl.textContent = config.subtitle;
    } else {
      const container = faq.querySelector<HTMLElement>('.faq__container');
      if (container) {
        const title = container.querySelector('.faq__title');
        const h5 = document.createElement('h5');
        h5.className = 'faq__subtitle';
        h5.textContent = config.subtitle;
        if (title) {
          title.insertAdjacentElement('afterend', h5);
        }
      }
    }
  }

  // Update background image
  if (config.backgroundImage !== undefined) {
    if (config.backgroundImage) {
      faq.style.background = `url('${config.backgroundImage}') center / cover no-repeat`;
    } else {
      faq.style.background = '';
    }
  }

  // Update items
  if (config.items) {
    const accordion = faq.querySelector<HTMLElement>('.faq__accordion');
    if (accordion) {
      const itemsHTML = config.items.map((item, index) => {
        const delay = item.aosDelay ?? (100 + index * 50);
        const itemAOS = config.enableAOS !== false 
          ? `data-aos="fade-up" data-aos-delay="${delay}"` 
          : '';
        
        return `
          <div class="faq__item" ${itemAOS}>
            <div class="faq__question">${item.question}</div>
            <div class="faq__answer">
              <p>${item.answer}</p>
            </div>
          </div>
        `.trim();
      }).join('\n');
      
      accordion.innerHTML = itemsHTML;
      
      // Re-initialize accordion for new items
      initFAQAccordion(faq);
    }
  }

  // Update classes
  if (config.additionalClasses !== undefined) {
    const baseClasses = ['faq'];
    const allClasses = config.additionalClasses 
      ? [...baseClasses, config.additionalClasses]
      : baseClasses;
    faq.className = allClasses.join(' ');
  }

  return faq;
}

/**
 * Initialize FAQ accordion functionality
 * This is the core accordion logic
 */
function initFAQAccordion(faqSection: HTMLElement): void {
  const faqItems = faqSection.querySelectorAll<HTMLElement>('.faq__item');
  
  faqItems.forEach(item => {
    const question = item.querySelector<HTMLElement>('.faq__question');
    const answer = item.querySelector<HTMLElement>('.faq__answer');
    
    if (!question || !answer) return;
    
    // Protection from double binding
    if ((question as any).dataset?.bound) return;
    (question as any).dataset.bound = 'true';
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other elements
      faqItems.forEach(i => {
        if (i !== item) {
          const a = i.querySelector<HTMLElement>('.faq__answer');
          i.classList.remove('active');
          if (a) {
            a.style.maxHeight = '0';
          }
        }
      });
      
      // Toggle current element
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = '0';
        requestAnimationFrame(() => {
          const height = answer.scrollHeight + 30;
          answer.style.maxHeight = `${height}px`;
        });
      } else {
        const currentHeight = answer.scrollHeight + 30;
        answer.style.maxHeight = `${currentHeight}px`;
        requestAnimationFrame(() => {
          answer.style.maxHeight = '0';
          item.classList.remove('active');
        });
      }
    });
  });
  
  // Update height on window resize
  window.addEventListener('resize', () => {
    faqItems.forEach(item => {
      if (item.classList.contains('active')) {
        const answer = item.querySelector<HTMLElement>('.faq__answer');
        if (answer && answer.style.maxHeight && answer.style.maxHeight !== '0px') {
          const height = answer.scrollHeight + 30;
          answer.style.maxHeight = `${height}px`;
        }
      }
    });
  });
}
