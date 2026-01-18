# Документація модулів конструктора

Цей документ містить опис всіх модулів конструктора, які використовуються на сайті.

## Структура проекту

```
src/
├── components/          # Перевикористовувані компоненти
│   ├── Carousel.ts      # Компонент каруселі
│   ├── Hero.ts          # Компонент Hero секції
│   ├── Footer.ts        # Компонент Footer секції
│   ├── index.ts         # Експорт всіх компонентів
│   └── README.md        # Детальна документація компонентів
├── modules/             # Модулі ініціалізації
│   ├── carousel.ts      # Ініціалізація каруселей
│   ├── hero.ts          # Ініціалізація Hero секцій
│   └── footer.ts        # Ініціалізація Footer секцій
└── main.ts              # Головний файл ініціалізації
```

## Компоненти

### 1. Carousel (Карусель)

**Призначення:** Компонент для відображення зображень у вигляді каруселі з безкінечним циклом.

**Місцезнаходження:** `src/components/Carousel.ts`

**Основні можливості:**
- Безкінечний цикл слайдів
- Навігація кнопками (попереднє/наступне)
- Підтримка свайпів на мобільних пристроях
- Адаптивність при зміні розміру вікна
- Програмне керування (goToNext, goToPrevious, goToIndex)

**Використання:**
```typescript
import { initCarousels } from './modules/carousel';

// Автоматична ініціалізація всіх каруселей на сторінці
initCarousels();
```

**HTML структура:**
```html
<div class="project-card__carousel">
  <div class="carousel-track">
    <img src="image1.jpg" alt="Image 1">
    <img src="image2.jpg" alt="Image 2">
  </div>
  <button class="carousel-btn prev">❮</button>
  <button class="carousel-btn next">❯</button>
</div>
```

**Детальна документація:** `src/components/README.md` (секція Carousel)

---

### 2. Hero (Головна секція)

**Призначення:** Компонент для створення головних секцій сторінок з відео або зображенням як фоном.

**Місцезнаходження:** `src/components/Hero.ts`

**Основні можливості:**
- Підтримка відео та зображень як фону
- Налаштування контенту (заголовок, підзаголовок, локація)
- Badge текст
- Режим підсторінки (менша висота)
- Динамічне оновлення контенту

**Використання:**
```typescript
import { initHero } from './modules/hero';

// Автоматична ініціалізація Hero на поточній сторінці
initHero();
```

**HTML структура:**
```html
<section class="hero" id="hero">
  <div class="hero__video-wrapper">
    <video class="hero__video" autoplay muted loop playsinline>
      <source src="/video/hero.mp4" type="video/mp4" />
    </video>
    <div class="hero__overlay"></div>
  </div>
  <div class="hero__content">
    <div class="hero__badge">You imagine it,<br><strong>STYLE HOMES</strong> creates it!</div>
    <div class="hero__card">
      <h1 class="hero__title">KITCHEN & BATH REMODELING</h1>
      <p class="hero__subtitle">Smart Investment • Quality Craftsmanship</p>
    </div>
  </div>
</section>
```

**Детальна документація:** `src/components/README.md` (секція Hero)

---

### 3. Footer (Підвал)

**Призначення:** Компонент для створення підвалу сайту з контактною інформацією, навігацією та соціальними мережами.

**Місцезнаходження:** `src/components/Footer.ts`

**Основні можливості:**
- Логотип компанії
- Контактна інформація (ліцензії, телефон, email)
- Соціальні мережі (Instagram, Thumbtack)
- Швидкі посилання (навігація)
- Зони обслуговування
- Копірайт
- Динамічне оновлення контенту

**Використання:**
```typescript
import { initFooter } from './modules/footer';

// Автоматична ініціалізація Footer з конфігурацією за замовчуванням
initFooter();
```

**HTML структура:**
```html
<footer class="footer">
  <section class="footer__section">
    <div class="footer__container">
      <div class="footer__col footer__brand">
        <div class="footer__logo">
          <img src="/img/logo-red.svg" alt="Style Homes Logo">
        </div>
        <a class="footer__link" href="...">Washington License: STYLEHL751CS</a>
        <a class="footer__link" href="tel:+15039805216">+1 (503) 980 5216</a>
        <div class="footer__socials">
          <a href="..." class="footer__icon">
            <img src="/img/social_ico/instagram.avif" alt="Instagram">
          </a>
        </div>
      </div>
      <div class="footer__col">
        <h4 class="footer__title">Quick Links</h4>
        <nav class="footer__nav">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#services">Services</a></li>
          </ul>
        </nav>
      </div>
      <div class="footer__col">
        <h4 class="footer__title">Service Areas</h4>
        <ul class="footer__list">
          <li>Portland, OR +50 miles</li>
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

**Детальна документація:** `src/components/README.md` (секція Footer)

---

## Модулі ініціалізації

### carousel.ts

**Призначення:** Модуль для автоматичної ініціалізації всіх каруселей на сторінці.

**Функції:**
- `initCarousels(options?: CarouselOptions): void` - ініціалізація всіх каруселей
- `destroyCarousels(): void` - видалення всіх каруселей
- `getCarouselInstances(): readonly Carousel[]` - отримання всіх екземплярів

### hero.ts

**Призначення:** Модуль для ініціалізації Hero секцій на різних сторінках.

**Функції:**
- `initHero(): void` - автоматична ініціалізація Hero на поточній сторінці
- `initHeroWithConfig(config: HeroConfig): void` - ініціалізація з кастомною конфігурацією

**Конфігурації для сторінок:**
- `index` - головна сторінка (відео)
- `kitchen` - сторінка кухні (зображення)
- `bathroom` - сторінка ванної (зображення)

### footer.ts

**Призначення:** Модуль для ініціалізації Footer секцій на сторінках.

**Функції:**
- `initFooter(): void` - автоматична ініціалізація Footer з конфігурацією за замовчуванням
- `initFooterWithConfig(config: FooterConfig): void` - ініціалізація з кастомною конфігурацією

**Конфігурація за замовчуванням:**
- Логотип: `/img/logo-red.svg`
- Контакти: ліцензії, телефон, email
- Соціальні мережі: Instagram, Thumbtack
- Швидкі посилання: Home, Services, Projects, About, Get Free Quote, FAQ
- Зони обслуговування: Portland OR, Vancouver WA
- Копірайт: © Style Homes 2025

---

## Ініціалізація в main.ts

Всі модулі ініціалізуються в `src/main.ts`:

```typescript
import { initCarousels } from './modules/carousel';
import { initHero } from './modules/hero';
import { initFooter } from './modules/footer';

document.addEventListener('DOMContentLoaded', () => {
  initCarousels();
  initHero();
  initFooter();
});
```

---

## Додавання нового компонента

### Крок 1: Створення компонента

1. Створіть файл компонента в `src/components/`
2. Визначте TypeScript інтерфейси для конфігурації
3. Створіть функції:
   - `generateComponentHTML(config): string` - генерація HTML
   - `insertComponent(container, config): HTMLElement | null` - вставка в DOM
   - `updateComponent(element, config): HTMLElement | null` - оновлення (опціонально)

### Крок 2: Експорт компонента

Додайте експорт в `src/components/index.ts`:

```typescript
export { ... } from './YourComponent';
```

### Крок 3: Створення модуля ініціалізації

Створіть файл модуля в `src/modules/`:

```typescript
import { insertComponent, type ComponentConfig } from '../components/YourComponent';

export function initComponent(): void {
  // Логіка ініціалізації
}
```

### Крок 4: Документація

1. Оновіть `src/components/README.md` з документацією про новий компонент
2. Оновіть `COMPONENTS_DOCUMENTATION.md` (цей файл) з описом нового компонента
3. Додайте приклади використання та HTML структуру

### Крок 5: Інтеграція

Додайте виклик ініціалізації в `src/main.ts`:

```typescript
import { initComponent } from './modules/yourComponent';

document.addEventListener('DOMContentLoaded', () => {
  // ...
  initComponent();
});
```

---

## Переваги модульної архітектури

1. **Перевикористання коду** - компоненти можна використовувати на різних сторінках
2. **Легке підтримування** - зміни в одному місці застосовуються скрізь
3. **Типобезпека** - TypeScript інтерфейси забезпечують правильне використання
4. **Тестування** - компоненти легко тестувати окремо
5. **Масштабованість** - легко додавати нові компоненти

---

## Важливі зауваження

1. **CSS файли:** Переконайтеся, що всі сторінки використовують правильні CSS файли з потрібними стилями для компонентів.

2. **Шляхи до ресурсів:** Використовуйте абсолютні шляхи від кореня (`/img/...`, `/video/...`) для забезпечення правильного відображення на всіх сторінках.

3. **Ініціалізація:** Компоненти повинні ініціалізуватися після завантаження DOM (`DOMContentLoaded`).

4. **Очищення:** При динамічному видаленні компонентів використовуйте методи `destroy()` для очищення слухачів подій.

---

## Оновлення документації

При додаванні нового компонента або зміні існуючого:

1. Оновіть `src/components/README.md`
2. Оновіть `COMPONENTS_DOCUMENTATION.md` (цей файл)
3. Перевірте, чи всі приклади коду актуальні
4. Додайте інформацію про breaking changes, якщо такі є

---

**Останнє оновлення:** 2025-01-XX  
**Версія:** 1.0.0
