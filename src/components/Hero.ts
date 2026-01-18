// Компоnotнт Hero section - підтримка video та image

export type HeroMediaType = 'video' | 'image';

export interface HeroConfig {
  /** Тип медіа: 'video' або 'image' */
  mediaType: HeroMediaType;
  /** Шлях до video або withображення */
  mediaSrc: string;
  /** Withаголовок */
  title: string;
  /** Підwithаголовок */
  subtitle?: string;
  /** Локація */
  location?: string;
  /** Текст for badge */
  badgeText?: string;
  /** Чи це підсторінка (додає class hero--subpage) */
  isSubpage?: boolean;
  /** Додаткові classи for section */
  additionalClasses?: string;
  /** ID section (default: 'hero') */
  sectionId?: string;
}

/**
 * Геnotрація HTML for Hero section
 */
export function generateHeroHTML(config: HeroConfig): string {
  const {
    mediaType,
    mediaSrc,
    title,
    subtitle,
    location,
    badgeText = "You imagine it,<br><strong>STYLE HOMES</strong> creates it!",
    isSubpage = false,
    additionalClasses = '',
    sectionId = 'hero'
  } = config;

  const heroClasses = [
    'hero',
    isSubpage ? 'hero--subpage' : '',
    additionalClasses
  ].filter(Boolean).join(' ');

  // Геnotрація медіа контенту
  let mediaHTML = '';
  if (mediaType === 'video') {
    mediaHTML = `
      <video class="hero__video" autoplay muted loop playsinline>
        <source src="${mediaSrc}" type="video/mp4" />
      </video>`;
  } else {
    mediaHTML = `<div class="hero__image-bg">
      <img src="${mediaSrc}" alt="${title}" />
    </div>`;
  }

  // Геnotрація контенту
  const subtitleHTML = subtitle ? `<p class="hero__subtitle">${subtitle}</p>` : '';
  const locationHTML = location ? `<p class="hero__location">${location}</p>` : '';

  return `
    <section class="${heroClasses}" id="${sectionId}">
      <div class="hero__video-wrapper">
        ${mediaHTML}
        <div class="hero__overlay"></div>
      </div>
      <div class="hero__content">
        ${badgeText ? `<div class="hero__badge">${badgeText}</div>` : ''}
        <div class="hero__card">
          <h1 class="hero__title">${title}</h1>
          ${subtitleHTML}
          ${locationHTML}
        </div>
      </div>
    </section>
  `.trim();
}

/**
 * Вставка Hero section в DOM
 */
export function insertHero(
  container: HTMLElement | string,
  config: HeroConfig
): HTMLElement | null {
  const html = generateHeroHTML(config);
  
  let targetElement: HTMLElement | null = null;
  
  if (typeof container === 'string') {
    targetElement = document.querySelector<HTMLElement>(container);
  } else {
    targetElement = container;
  }

  if (!targetElement) {
    console.error('Hero container not found');
    return null;
  }

  targetElement.innerHTML = html;
  
  return targetElement.querySelector<HTMLElement>('.hero');
}

/**
 * Оновлення існуючої Hero section
 */
export function updateHero(
  heroElement: HTMLElement | string,
  config: Partial<HeroConfig>
): HTMLElement | null {
  let hero: HTMLElement | null = null;
  
  if (typeof heroElement === 'string') {
    hero = document.querySelector<HTMLElement>(heroElement);
  } else {
    hero = heroElement;
  }

  if (!hero) {
    console.error('Hero element not found');
    return null;
  }

  // Update медіа
  const videoWrapper = hero.querySelector<HTMLElement>('.hero__video-wrapper');
  if (videoWrapper && config.mediaType && config.mediaSrc) {
    if (config.mediaType === 'video') {
      const existingVideo = videoWrapper.querySelector('video');
      if (existingVideo) {
        const source = existingVideo.querySelector('source');
        if (source) {
          source.src = config.mediaSrc;
          existingVideo.load();
        }
      } else {
        // Replace image на video
        const imageBg = videoWrapper.querySelector('.hero__image-bg');
        if (imageBg) {
          imageBg.remove();
        }
        const video = document.createElement('video');
        video.className = 'hero__video';
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        const source = document.createElement('source');
        source.src = config.mediaSrc;
        source.type = 'video/mp4';
        video.appendChild(source);
        videoWrapper.insertBefore(video, videoWrapper.querySelector('.hero__overlay'));
      }
    } else {
      const existingImage = videoWrapper.querySelector('.hero__image-bg');
      if (existingImage) {
        const img = existingImage.querySelector('img');
        if (img) {
          img.src = config.mediaSrc;
        } else {
          const newImg = document.createElement('img');
          newImg.src = config.mediaSrc;
          newImg.alt = config.title || 'Hero image';
          existingImage.appendChild(newImg);
        }
      } else {
        // Replace video на image
        const video = videoWrapper.querySelector('video');
        if (video) {
          video.remove();
        }
        const imageBg = document.createElement('div');
        imageBg.className = 'hero__image-bg';
        const img = document.createElement('img');
        img.src = config.mediaSrc;
        img.alt = config.title || 'Hero image';
        imageBg.appendChild(img);
        videoWrapper.insertBefore(imageBg, videoWrapper.querySelector('.hero__overlay'));
      }
    }
  }

  // Update контент
  if (config.title) {
    const titleEl = hero.querySelector<HTMLElement>('.hero__title');
    if (titleEl) titleEl.textContent = config.title;
  }

  if (config.subtitle !== undefined) {
    const subtitleEl = hero.querySelector<HTMLElement>('.hero__subtitle');
    if (config.subtitle) {
      if (subtitleEl) {
        subtitleEl.textContent = config.subtitle;
      } else {
        const card = hero.querySelector<HTMLElement>('.hero__card');
        if (card) {
          const title = card.querySelector('.hero__title');
          const p = document.createElement('p');
          p.className = 'hero__subtitle';
          p.textContent = config.subtitle;
          if (title) {
            title.insertAdjacentElement('afterend', p);
          }
        }
      }
    } else if (subtitleEl) {
      subtitleEl.remove();
    }
  }

  if (config.location !== undefined) {
    const locationEl = hero.querySelector<HTMLElement>('.hero__location');
    if (config.location) {
      if (locationEl) {
        locationEl.textContent = config.location;
      } else {
        const card = hero.querySelector<HTMLElement>('.hero__card');
        if (card) {
          const p = document.createElement('p');
          p.className = 'hero__location';
          p.textContent = config.location;
          card.appendChild(p);
        }
      }
    } else if (locationEl) {
      locationEl.remove();
    }
  }

  if (config.badgeText !== undefined) {
    const badgeEl = hero.querySelector<HTMLElement>('.hero__badge');
    if (config.badgeText) {
      if (badgeEl) {
        badgeEl.innerHTML = config.badgeText;
      } else {
        const content = hero.querySelector<HTMLElement>('.hero__content');
        if (content) {
          const badge = document.createElement('div');
          badge.className = 'hero__badge';
          badge.innerHTML = config.badgeText;
          content.insertBefore(badge, content.querySelector('.hero__card'));
        }
      }
    } else if (badgeEl) {
      badgeEl.remove();
    }
  }

  // Update classи
  if (config.isSubpage !== undefined) {
    if (config.isSubpage) {
      hero.classList.add('hero--subpage');
    } else {
      hero.classList.remove('hero--subpage');
    }
  }

  return hero;
}
