# Проблема з розтягуванням зображення в Hero секції

## ⚠️ ВИРІШЕНО ⚠️

**Проблема була виявлена та вирішена!**

**Коренева причина:** Підсторінки використовували інший CSS файл (`/src/style.css`), який не містив стилів для `.hero--subpage`. Стилі були тільки в `css/style.css`, який підключений до головної сторінки.

**Рішення:** Додано стилі для `.hero--subpage` в `src/style.css`.

**Детальна документація:** Див. `HERO_FIX_DOCUMENTATION.md`

---

## Історія проблеми (архів)

## Опис проблеми

На підсторінці з hero-секцією (клас `hero--subpage`) зображення не розтягується на весь екран. Залишається біла/сіра смуга справа. На головній сторінці відео працює правильно і заповнює весь екран.

**Очікувана поведінка:** Зображення має заповнювати весь екран по ширині, як відео на головній сторінці.

**Поточна поведінка:** Зображення не доходить до правого краю екрану, залишається біла/сіра смуга.

## СПРАВЖНЯ ПРИЧИНА (виявлено)

**Проблема НЕ в CSS hero секції, а в layout-і сторінки!**

Hero секція на підсторінці знаходиться всередині `<main class="main">`, який може мати обмеження ширини або знаходитися всередині контейнера з `max-width`.

**Ключовий факт:** На головній сторінці hero працює правильно, бо він може бути поза контейнером або контейнер має інші стилі.

**Спроба рішення:** Використано full-bleed hack для `.hero--subpage`, щоб витягнути hero з контейнера, але проблема залишилася.

## HTML структура

### Підсторінка (kitchen-renovation.html):
```html
<section class="hero hero--subpage" id="hero">
    <div class="hero__video-wrapper">
        <div class="hero__image-bg">
            <img src="/img/kitchen-renovation.jpg" alt="Kitchen Renovation" />
        </div>
        <div class="hero__overlay"></div>
    </div>
    <div class="hero__content">
        <div class="hero__badge">
            You imagine it,<br>
            <strong>STYLE HOMES</strong> creates it!
        </div>
        
        <div class="hero__card">
            <h1 class="hero__title">KITCHEN RENOVATION</h1>
            <p class="hero__subtitle">Smart Investment • Quality Craftsmanship</p>
            <p class="hero__location">Portland OR & Vancouver WA</p>
        </div>
    </div>
</section>
```

### Головна сторінка (index.html) - працює правильно:
```html
<section class="hero" id="hero">
    <div class="hero__video-wrapper">
        <video class="hero__video" autoplay muted loop playsinline>
            <source src="video/hero.mp4" type="video/mp4" />
        </video>
        <div class="hero__overlay"></div>
    </div>
    <div class="hero__content">
        <!-- контент -->
    </div>
</section>
```

## CSS стилі

### Базові стилі:
```css
html {
    scroll-behavior: smooth;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #333;
    overflow-x: hidden;
    width: 100%;
    margin: 0;
    padding: 0;
}

.main {
    min-height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}
```

### Hero секція:
```css
.hero {
    position: relative;
    width: 100vw;
    height: 100vh;
    min-height: 700px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    overflow: hidden;
    padding: 0;
    margin: 0;
    margin-top: 0;
    /* Override section spacing if any */
}

.hero__video-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
}

.hero__image-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
}

.hero__image-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    /* Так само, як відео */
    transition: transform 0.1s ease-out;
    will-change: transform;
}

.hero__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.1s ease-out;
    will-change: transform;
}

.hero__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(139, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(139, 0, 0, 0.2) 100%);
    /* Animated gradient will be applied via JavaScript */
    z-index: 1;
    transition: background 0.1s ease-out;
    pointer-events: none;
}
```

### Стилі для підсторінок (hero--subpage) - ПОТОЧНИЙ СТАН:

```css
/* Підсторінки Hero - менша висота */
.hero--subpage {
    height: 70vh;
    min-height: 500px;
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    padding: 0;
    overflow: hidden;
}

.hero--subpage .hero__video-wrapper {
    width: 100%;
    height: 100%;
}

.hero--subpage .hero__image-bg {
    width: 100%;
    height: 100%;
}

.hero--subpage .hero__overlay {
    width: 100%;
    height: 100%;
}
```

**Примітка:** Застосовано full-bleed hack (`left: 50%`, `margin-left: -50vw`, `width: 100vw`), але проблема залишилася.

## TypeScript компоненти

### Hero.ts (компонент):
```typescript
// Компонент Hero секції - підтримка video та image

export type HeroMediaType = 'video' | 'image';

export interface HeroConfig {
  /** Тип медіа: 'video' або 'image' */
  mediaType: HeroMediaType;
  /** Шлях до відео або зображення */
  mediaSrc: string;
  /** Заголовок */
  title: string;
  /** Підзаголовок */
  subtitle?: string;
  /** Локація */
  location?: string;
  /** Текст для badge */
  badgeText?: string;
  /** Чи це підсторінка (додає клас hero--subpage) */
  isSubpage?: boolean;
  /** Додаткові класи для секції */
  additionalClasses?: string;
  /** ID секції (за замовчуванням: 'hero') */
  sectionId?: string;
}

/**
 * Генерація HTML для Hero секції
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

  // Генерація медіа контенту
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

  // Генерація контенту
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
```

### hero.ts (модуль):
```typescript
// Модуль для ініціалізації Hero секцій

import { insertHero, type HeroConfig } from '../components/Hero';

/**
 * Конфігурації Hero для різних сторінок
 */
const heroConfigs: Record<string, HeroConfig> = {
  index: {
    mediaType: 'video',
    mediaSrc: '/video/hero.mp4',
    title: 'KITCHEN & BATH REMODELING',
    subtitle: 'Smart Investment • Quality Craftsmanship',
    location: 'Portland OR & Vancouver WA',
    badgeText: 'You imagine it,<br><strong>STYLE HOMES</strong> creates it!',
    isSubpage: false,
    sectionId: 'hero'
  },
  kitchen: {
    mediaType: 'image',
    mediaSrc: '/img/kitchen-renovation.jpg',
    title: 'KITCHEN RENOVATION',
    subtitle: 'Smart Investment • Quality Craftsmanship',
    location: 'Portland OR & Vancouver WA',
    badgeText: 'You imagine it,<br><strong>STYLE HOMES</strong> creates it!',
    isSubpage: true,
    sectionId: 'hero'
  },
  bathroom: {
    mediaType: 'image',
    mediaSrc: '/img/bathroom-renovation.jpg',
    title: 'BATHROOM RENOVATION',
    subtitle: 'Smart Investment • Quality Craftsmanship',
    location: 'Portland OR & Vancouver WA',
    badgeText: 'You imagine it,<br><strong>STYLE HOMES</strong> creates it!',
    isSubpage: true,
    sectionId: 'hero'
  }
};
```

## Спроби вирішення

### Перша спроба (НЕПРАВИЛЬНА - створювала проблему):
1. Використання `100vw` замість `100%` для всіх елементів
2. Додавання `transform: translateX(-50%)` для центрування
3. Додавання `max-width: none` для зображення
4. Додавання `min-width: 100vw` та `min-height: 100%` для img
5. Встановлення `width: 100vw` для html, body, main
6. Додавання `overflow-x: hidden` на різних рівнях

**Результат:** Це створило класичний баг з viewport та scrollbar - `100vw` включає ширину scrollbar, що призводить до переповнення.

### Друга спроба (ПРАВИЛЬНА - але проблема залишилася):
1. Видалено всі `100vw` - замінено на `100%`
2. Видалено `left: 50%` та `transform: translateX(-50%)` - замінено на `left: 0` та `transform: none`
3. Залишено простий підхід: `width: 100%`, `left: 0` для всіх елементів
4. Зображення має такі ж стилі, як відео

**Результат:** Проблема залишилася. Зображення все ще не розтягується на весь екран.

### Третя спроба (full-bleed hack - НЕ ПРАЦЮЄ):

Застосовано класичний full-bleed hack:

```css
.hero--subpage {
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    padding: 0;
    overflow: hidden;
}

.hero--subpage .hero__video-wrapper {
    width: 100%;
    height: 100%;
}

.hero--subpage .hero__image-bg {
    width: 100%;
    height: 100%;
}

.hero--subpage .hero__overlay {
    width: 100%;
    height: 100%;
}
```

**Результат:** Full-bleed hack не вирішив проблему. Зображення все ще не розтягується на весь екран.

## Запит

Потрібно знайти причину, чому зображення не розтягується на весь екран на підсторінці, хоча:
1. Відео на головній сторінці працює правильно
2. Використовуються правильні стилі (`100%` замість `100vw`, без `translateX`)
3. Зображення має такі ж стилі, як відео

### Справжня причина (виявлено):

**Hero секція на підсторінці знаходиться всередині `<main class="main">`, який може мати обмеження ширини.**

Навіть якщо `.main` має `width: 100%`, він може знаходитися всередині іншого контейнера або мати інші обмеження через CSS каскад.

**Чому відео "працює", а зображення ні:**
- На головній сторінці hero може бути поза контейнером або контейнер має інші стилі
- На підсторінці hero живе всередині `.main`, який обмежує ширину

**Спроби рішення:**
1. ✅ Видалено `100vw` + `translateX(-50%)` - правильно, але не вирішило
2. ✅ Застосовано full-bleed hack - не вирішило проблему

**Поточний стан:** Проблема залишається. Зображення не розтягується на весь екран навіть з full-bleed hack.

### Можливі додаткові причини:
- Можливо, є інші CSS правила, які обмежують ширину (медіа-запити, специфічні селектори)
- Можливо, проблема в тому, що `main` має якісь інші стилі, які не видно в базових правилах
- Можливо, є JavaScript, який динамічно змінює стилі
- Можливо, проблема в структурі HTML - потрібно перевірити, чи немає додаткових обгорток

### Додаткова інформація:
- Використовується Vite для збірки
- Файли знаходяться в `public/img/` і обслуговуються з кореня як `/img/`
- Зображення завантажується (статус 304 в network requests)
- Проблема виникає тільки на підсторінках з класом `hero--subpage`
- **Обидві сторінки мають однакову HTML структуру:** `<main class="main"><section class="hero">`
- `.main` має `width: 100%`, `margin: 0`, `padding: 0`, `overflow-x: hidden` - без обмежень ширини
- Full-bleed hack застосовано, але не вирішив проблему

### Що потрібно зробити:
1. Знайти справжню причину, чому full-bleed hack не працює
2. Перевірити, чи немає інших CSS правил, які можуть обмежувати ширину (медіа-запити, специфічні селектори)
3. Перевірити, чи немає JavaScript, який динамічно змінює стилі
4. Можливо, потрібно винести hero з `<main>` в HTML структурі (архітектурне рішення)
5. Або знайти інший спосіб зробити hero на всю ширину екрану

### Важливі спостереження:
- На головній сторінці відео працює правильно з такою ж структурою HTML
- Full-bleed hack зазвичай працює, але тут не спрацював
- Можливо, є якісь інші фактори, які не враховані (JavaScript, інші CSS правила, специфіка селекторів)