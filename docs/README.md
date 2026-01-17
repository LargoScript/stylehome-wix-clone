# Документація бібліотек анімації

## Завантажені бібліотеки

### 1. AOS (Animate On Scroll)
- **Файли**: `js/libs/aos.css`, `js/libs/aos.js`
- **Документація**: [AOS_DOCUMENTATION.md](./AOS_DOCUMENTATION.md)
- **Офіційний сайт**: https://github.com/michalsnik/aos
- **Версія**: Latest (unpkg)

### 2. Anime.js
- **Файл**: `js/libs/anime.min.js`
- **Документація**: [ANIMEJS_DOCUMENTATION.md](./ANIMEJS_DOCUMENTATION.md)
- **Офіційний сайт**: https://animejs.com/
- **Версія**: 3.2.2

## Швидкий старт

### Підключення в HTML

Додайте в `index.html` перед закриттям `</body>`:

```html
<!-- AOS -->
<link rel="stylesheet" href="js/libs/aos.css" />
<script src="js/libs/aos.js"></script>

<!-- Anime.js -->
<script src="js/libs/anime.min.js"></script>

<!-- Ініціалізація -->
<script>
  // AOS
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
</script>
```

### Використання AOS

Просто додайте атрибут `data-aos` до елементів:

```html
<div data-aos="fade-up">Контент</div>
<div data-aos="zoom-in" data-aos-delay="200">Контент з затримкою</div>
```

### Використання Anime.js

```javascript
anime({
  targets: '.my-element',
  translateX: 250,
  opacity: [0, 1],
  duration: 1000
});
```

## Детальна документація

- [AOS - Повна документація](./AOS_DOCUMENTATION.md)
- [Anime.js - Повна документація](./ANIMEJS_DOCUMENTATION.md)

## Приклади інтеграції

### Приклад 1: AOS для секцій
```html
<section data-aos="fade-up" data-aos-duration="1000">
  <h2>Заголовок</h2>
  <p>Текст</p>
</section>
```

### Приклад 2: Anime.js для hero секції
```javascript
anime({
  targets: '.hero__content',
  opacity: [0, 1],
  translateY: [50, 0],
  duration: 1000,
  easing: 'easeOutExpo'
});
```

### Приклад 3: Комбінація обох
```javascript
// AOS виявляє появу елемента
document.addEventListener('aos:in', ({ detail }) => {
  // Anime.js робить складну анімацію
  anime({
    targets: detail,
    scale: [0.8, 1],
    rotate: [0, 360],
    duration: 600,
    easing: 'easeOutElastic(1, .6)'
  });
});
```

## Корисні посилання

### AOS
- GitHub: https://github.com/michalsnik/aos
- Демо: https://michalsnik.github.io/aos/
- NPM: https://www.npmjs.com/package/aos

### Anime.js
- Офіційний сайт: https://animejs.com/
- GitHub: https://github.com/juliangarnier/anime
- Демо: https://animejs.com/documentation/
