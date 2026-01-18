# Компоненти (Components)

Ця тека містить перевикористовувані компоненти для сайту.

## Структура

```
components/
├── Carousel.ts      # Компонент каруселі з безкінечним циклом
├── Hero.ts          # Компонент Hero секції (video/image)
├── index.ts         # Експорт всіх компонентів
└── README.md        # Документація
```

## Carousel

Компонент каруселі для відображення зображень з підтримкою:
- Безкінечного циклу
- Кліків на кнопки навігації
- Свайпів на мобільних пристроях
- Адаптивності при зміні розміру вікна

### Використання

#### Автоматична ініціалізація (через модуль)

```typescript
import { initCarousels } from '../modules/carousel';

// Ініціалізує всі каруселі на сторінці з опціями за замовчуванням
initCarousels();

// Або з кастомними опціями
initCarousels({
  infinite: true,
  transitionDuration: 300,
  swipeThreshold: 50
});
```

#### Програмне створення

```typescript
import { Carousel } from '../components/Carousel';

const carouselElement = document.querySelector('.my-carousel');
if (carouselElement) {
  const carousel = new Carousel(carouselElement, {
    infinite: true,
    transitionDuration: 500,
    swipeThreshold: 50
  });
  
  // Програмне керування
  carousel.goToNext();
  carousel.goToPrevious();
  carousel.goToIndex(3);
  
  // Отримання інформації
  const currentIndex = carousel.getCurrentIndex();
  const slideCount = carousel.getSlideCount();
  
  // Очищення при необхідності
  carousel.destroy();
}
```

### Опції (CarouselOptions)

```typescript
interface CarouselOptions {
  /** Чи використовувати безкінечний цикл (за замовчуванням: true) */
  infinite?: boolean;
  
  /** Тривалість анімації переходу в мс (за замовчуванням: 500) */
  transitionDuration?: number;
  
  /** Поріг для свайпу на мобільних пристроях в пікселях (за замовчуванням: 50) */
  swipeThreshold?: number;
  
  /** Селектор для кнопки "Попереднє" (за замовчуванням: '.carousel-btn.prev') */
  prevButtonSelector?: string;
  
  /** Селектор для кнопки "Наступне" (за замовчуванням: '.carousel-btn.next') */
  nextButtonSelector?: string;
  
  /** Селектор для треку каруселі (за замовчуванням: '.carousel-track') */
  trackSelector?: string;
}
```

### HTML Структура

```html
<div class="project-card__carousel">
  <div class="carousel-track">
    <img src="image1.jpg" alt="Image 1">
    <img src="image2.jpg" alt="Image 2">
    <img src="image3.jpg" alt="Image 3">
  </div>
  <button class="carousel-btn prev" aria-label="Previous image">❮</button>
  <button class="carousel-btn next" aria-label="Next image">❯</button>
</div>
```

### Методи

- `goToNext()` - перехід до наступного слайду
- `goToPrevious()` - перехід до попереднього слайду
- `goToIndex(index: number)` - перехід до конкретного індексу
- `update()` - оновлення каруселі (після додавання нових слайдів)
- `destroy()` - видалення слухачів подій та очищення
- `getCurrentIndex()` - отримання поточного індексу
- `getSlideCount()` - отримання кількості слайдів

## Hero

Компонент Hero секції для створення головних секцій сторінок з підтримкою:
- Відео або зображення як фон
- Налаштування контенту (заголовок, підзаголовок, локація)
- Badge текст
- Режим підсторінки (менша висота)

### Використання

#### Генерація HTML (статичне використання)

```typescript
import { generateHeroHTML } from '../components/Hero';

// Hero з відео (головна сторінка)
const heroHTML = generateHeroHTML({
  mediaType: 'video',
  mediaSrc: '/video/hero.mp4',
  title: 'KITCHEN & BATH REMODELING',
  subtitle: 'Smart Investment • Quality Craftsmanship',
  location: 'Portland OR & Vancouver WA',
  badgeText: 'You imagine it,<br><strong>STYLE HOMES</strong> creates it!'
});

// Hero з зображенням (підсторінка)
const heroHTML = generateHeroHTML({
  mediaType: 'image',
  mediaSrc: '/public/img/kitchen-renovation.jpg',
  title: 'KITCHEN RENOVATION',
  subtitle: 'Smart Investment • Quality Craftsmanship',
  location: 'Portland OR & Vancouver WA',
  isSubpage: true
});

// Вставка в DOM
document.querySelector('.main')!.innerHTML = heroHTML;
```

#### Динамічна вставка

```typescript
import { insertHero } from '../components/Hero';

// Вставка Hero в контейнер
const heroElement = insertHero('.main', {
  mediaType: 'video',
  mediaSrc: '/video/hero.mp4',
  title: 'KITCHEN & BATH REMODELING',
  subtitle: 'Smart Investment • Quality Craftsmanship',
  location: 'Portland OR & Vancouver WA'
});
```

#### Оновлення існуючої Hero

```typescript
import { updateHero } from '../components/Hero';

// Оновлення тільки заголовка
updateHero('.hero', {
  title: 'NEW TITLE'
});

// Зміна медіа з відео на зображення
updateHero('.hero', {
  mediaType: 'image',
  mediaSrc: '/public/img/new-image.jpg'
});
```

### Опції (HeroConfig)

```typescript
interface HeroConfig {
  /** Тип медіа: 'video' або 'image' */
  mediaType: HeroMediaType;
  
  /** Шлях до відео або зображення */
  mediaSrc: string;
  
  /** Заголовок (обов'язково) */
  title: string;
  
  /** Підзаголовок (опціонально) */
  subtitle?: string;
  
  /** Локація (опціонально) */
  location?: string;
  
  /** Текст для badge (за замовчуванням: стандартний текст) */
  badgeText?: string;
  
  /** Чи це підсторінка (додає клас hero--subpage) */
  isSubpage?: boolean;
  
  /** Додаткові класи для секції */
  additionalClasses?: string;
  
  /** ID секції (за замовчуванням: 'hero') */
  sectionId?: string;
}
```

### HTML Структура

```html
<section class="hero" id="hero">
  <div class="hero__video-wrapper">
    <!-- Для video -->
    <video class="hero__video" autoplay muted loop playsinline>
      <source src="/video/hero.mp4" type="video/mp4" />
    </video>
    
    <!-- Або для image -->
    <div class="hero__image-bg" style="background-image: url('/img/hero.jpg');"></div>
    
    <div class="hero__overlay"></div>
  </div>
  <div class="hero__content">
    <div class="hero__badge">You imagine it,<br><strong>STYLE HOMES</strong> creates it!</div>
    <div class="hero__card">
      <h1 class="hero__title">KITCHEN & BATH REMODELING</h1>
      <p class="hero__subtitle">Smart Investment • Quality Craftsmanship</p>
      <p class="hero__location">Portland OR & Vancouver WA</p>
    </div>
  </div>
</section>
```

### Функції

- `generateHeroHTML(config: HeroConfig): string` - генерація HTML рядка
- `insertHero(container: HTMLElement | string, config: HeroConfig): HTMLElement | null` - вставка Hero в DOM
- `updateHero(heroElement: HTMLElement | string, config: Partial<HeroConfig>): HTMLElement | null` - оновлення існуючої Hero

## Footer

Компонент Footer секції для створення підвалу сайту з підтримкою:
- Логотипу компанії
- Контактної інформації (ліцензії, телефон, email)
- Соціальних мереж
- Швидких посилань (навігація)
- Зон обслуговування
- Копірайту

### Використання

#### Автоматична ініціалізація (через модуль)

```typescript
import { initFooter } from '../modules/footer';

// Ініціалізує Footer з конфігурацією за замовчуванням
initFooter();

// Або з кастомною конфігурацією
import { initFooterWithConfig } from '../modules/footer';

initFooterWithConfig({
  logo: {
    src: '/img/logo-red.svg',
    alt: 'Style Homes Logo'
  },
  contacts: [
    { text: 'Phone: +1 (503) 980 5216', href: 'tel:+15039805216' }
  ],
  // ... інші опції
});
```

#### Генерація HTML (статичне використання)

```typescript
import { generateFooterHTML } from '../components/Footer';

const footerHTML = generateFooterHTML({
  logo: {
    src: '/img/logo-red.svg',
    alt: 'Style Homes Logo'
  },
  contacts: [
    { text: 'Washington License: STYLEHL751CS', href: '...', target: '_blank' },
    { text: '+1 (503) 980 5216', href: 'tel:+15039805216' }
  ],
  socials: [
    { href: 'https://instagram.com/...', iconSrc: '/img/social_ico/instagram.avif', alt: 'Instagram', target: '_blank' }
  ],
  quickLinks: [
    { text: 'Home', href: '/' },
    { text: 'Services', href: '#services' }
  ],
  serviceAreas: ['Portland, OR +50 miles', 'Vancouver, WA +50 miles'],
  copyright: '© Style Homes 2025'
});

// Вставка в DOM
document.querySelector('body')!.innerHTML += footerHTML;
```

#### Динамічна вставка

```typescript
import { insertFooter } from '../components/Footer';

// Вставка Footer в body
const footerElement = insertFooter('body', {
  logo: { src: '/img/logo-red.svg', alt: 'Logo' },
  contacts: [],
  socials: [],
  quickLinks: [],
  serviceAreas: [],
  copyright: '© 2025'
});
```

#### Оновлення існуючого Footer

```typescript
import { updateFooter } from '../components/Footer';

// Оновлення тільки копірайту
updateFooter('.footer', {
  copyright: '© Style Homes 2026'
});

// Оновлення контактів
updateFooter('.footer', {
  contacts: [
    { text: 'New Phone', href: 'tel:+1234567890' }
  ]
});
```

### Опції (FooterConfig)

```typescript
interface FooterConfig {
  /** Логотип компанії */
  logo: {
    src: string;
    alt: string;
  };
  
  /** Контактна інформація */
  contacts: FooterContact[];
  
  /** Соціальні мережі */
  socials: FooterSocial[];
  
  /** Швидкі посилання */
  quickLinks: FooterLink[];
  
  /** Зони обслуговування */
  serviceAreas: string[];
  
  /** Копірайт текст */
  copyright: string;
  
  /** Додаткові класи для footer */
  additionalClasses?: string;
}

interface FooterContact {
  text: string;
  href: string;
  target?: '_blank' | '_self';
}

interface FooterSocial {
  href: string;
  iconSrc: string;
  alt: string;
  target?: '_blank' | '_self';
}

interface FooterLink {
  text: string;
  href: string;
  target?: '_blank' | '_self';
}
```

### HTML Структура

```html
<footer class="footer">
  <section class="footer__section">
    <div class="footer__container">
      <!-- Brand / Contacts -->
      <div class="footer__col footer__brand">
        <div class="footer__logo">
          <img src="/img/logo-red.svg" alt="Style Homes Logo">
        </div>
        <a class="footer__link" href="...">Washington License: STYLEHL751CS</a>
        <a class="footer__link" href="...">Oregon CCB: 259642</a>
        <a class="footer__link" href="tel:+15039805216">+1 (503) 980 5216</a>
        <a class="footer__link" href="mailto:...">chaikataras@icloud.com</a>
        <div class="footer__socials">
          <a href="..." class="footer__icon">
            <img src="/img/social_ico/instagram.avif" alt="Instagram">
          </a>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="footer__col">
        <h4 class="footer__title">Quick Links</h4>
        <nav class="footer__nav">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#services">Services</a></li>
          </ul>
        </nav>
      </div>

      <!-- Service Areas -->
      <div class="footer__col">
        <h4 class="footer__title">Service Areas</h4>
        <ul class="footer__list">
          <li>Portland, OR +50 miles</li>
          <li>Vancouver, WA +50 miles</li>
        </ul>
      </div>
    </div>

    <div class="footer__bottom">
      <div class="footer__bottom-logo">
        <img src="/img/logo-red.svg" alt="Style Homes Logo">
      </div>
      <p>© Style Homes 2025</p>
    </div>
  </section>
</footer>
```

### Функції

- `generateFooterHTML(config: FooterConfig): string` - генерація HTML рядка
- `insertFooter(container: HTMLElement | string, config: FooterConfig): HTMLElement | null` - вставка Footer в DOM
- `updateFooter(footerElement: HTMLElement | string, config: Partial<FooterConfig>): HTMLElement | null` - оновлення існуючого Footer

## Додавання нових компонентів

При додаванні нового компонента:

1. Створіть файл компонента в цій теці
2. Додайте експорт в `index.ts`
3. Створіть модуль для ініціалізації в `../modules/`
4. Оновіть цей README з документацією
