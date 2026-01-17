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

## Додавання нових компонентів

При додаванні нового компонента:

1. Створіть файл компонента в цій теці
2. Додайте експорт в `index.ts`
3. Оновіть цей README з документацією
