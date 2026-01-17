# AOS (Animate On Scroll) - Документація

## Офіційні ресурси
- **GitHub**: https://github.com/michalsnik/aos
- **NPM**: https://www.npmjs.com/package/aos
- **Демо**: https://michalsnik.github.io/aos/

## Встановлення

### Через CDN
```html
<link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
<script src="https://unpkg.com/aos@next/dist/aos.js"></script>
```

### Через npm
```bash
npm install aos
```

### Локально (як у нашому проекті)
```html
<link rel="stylesheet" href="js/libs/aos.css" />
<script src="js/libs/aos.js"></script>
```

## Ініціалізація

```javascript
AOS.init({
  // Налаштування
  offset: 120,        // Зміщення (в пікселях) від початку екрану
  delay: 0,           // Затримка (в мілісекундах)
  duration: 400,      // Тривалість анімації (в мілісекундах)
  easing: 'ease',     // Тип анімації
  once: false,        // Анімація тільки один раз
  mirror: false,      // Анімація при прокрутці назад
  anchorPlacement: 'top-bottom', // Точка тригера анімації
});
```

## Використання в HTML

### Базове використання
```html
<div data-aos="fade-up">
  Контент, який анімується
</div>
```

### Доступні анімації
- `fade-up` / `fade-down` / `fade-left` / `fade-right`
- `fade-up-right` / `fade-up-left` / `fade-down-right` / `fade-down-left`
- `zoom-in` / `zoom-in-up` / `zoom-in-down` / `zoom-in-left` / `zoom-in-right`
- `zoom-out` / `zoom-out-up` / `zoom-out-down` / `zoom-out-left` / `zoom-out-right`
- `slide-up` / `slide-down` / `slide-left` / `slide-right`
- `flip-up` / `flip-down` / `flip-left` / `flip-right`

### Додаткові атрибути
```html
<div 
  data-aos="fade-up"
  data-aos-offset="200"      <!-- Зміщення в пікселях -->
  data-aos-duration="600"    <!-- Тривалість анімації -->
  data-aos-easing="ease-in-out" <!-- Тип анімації -->
  data-aos-delay="100"       <!-- Затримка -->
  data-aos-anchor-placement="top-center" <!-- Точка тригера -->
  data-aos-once="true"       <!-- Анімація тільки один раз -->
  data-aos-mirror="true"     <!-- Анімація при прокрутці назад -->
>
  Контент
</div>
```

## Типи easing (плавність анімації)
- `linear`
- `ease`
- `ease-in`
- `ease-out`
- `ease-in-out`
- `ease-in-back`
- `ease-out-back`
- `ease-in-out-back`
- `ease-in-sine`
- `ease-out-sine`
- `ease-in-out-sine`
- `ease-in-quad`
- `ease-out-quad`
- `ease-in-out-quad`
- `ease-in-cubic`
- `ease-out-cubic`
- `ease-in-out-cubic`
- `ease-in-quart`
- `ease-out-quart`
- `ease-in-out-quart`

## Anchor Placement (точка тригера)
- `top-bottom` - коли верх елемента досягає низ екрану
- `top-center` - коли верх елемента досягає центр екрану
- `top-top` - коли верх елемента досягає верх екрану
- `center-bottom` - коли центр елемента досягає низ екрану
- `center-center` - коли центр елемента досягає центр екрану
- `center-top` - коли центр елемента досягає верх екрану
- `bottom-bottom` - коли низ елемента досягає низ екрану
- `bottom-center` - коли низ елемента досягає центр екрану
- `bottom-top` - коли низ елемента досягає верх екрану

## API методи

### AOS.init(options)
Ініціалізує AOS з налаштуваннями

### AOS.refresh()
Оновлює позиції елементів (корисно після додавання динамічного контенту)

### AOS.refreshHard()
Повністю перезавантажує AOS (видаляє та додає знову всі обробники)

## Приклади використання

### Простий приклад
```html
<section data-aos="fade-up">
  <h2>Заголовок</h2>
  <p>Текст</p>
</section>
```

### З затримкою
```html
<div data-aos="fade-up" data-aos-delay="100">Елемент 1</div>
<div data-aos="fade-up" data-aos-delay="200">Елемент 2</div>
<div data-aos="fade-up" data-aos-delay="300">Елемент 3</div>
```

### Анімація тільки один раз
```html
<div data-aos="zoom-in" data-aos-once="true">
  Цей елемент анімується тільки один раз
</div>
```

### Різні анімації для різних елементів
```html
<div data-aos="fade-left">Зліва</div>
<div data-aos="fade-right">Справа</div>
<div data-aos="zoom-in">Збільшення</div>
```

## Інтеграція в наш проект

Додати в `index.html` перед закриттям `</body>`:
```html
<link rel="stylesheet" href="js/libs/aos.css" />
<script src="js/libs/aos.js"></script>
<script>
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
</script>
```

Або в `main.js`:
```javascript
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
});
```
