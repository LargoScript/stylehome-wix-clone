# Anime.js - Документація

## Офіційні ресурси
- **GitHub**: https://github.com/juliangarnier/anime
- **Офіційний сайт**: https://animejs.com/
- **Демо**: https://animejs.com/documentation/

## Встановлення

### Через CDN
```html
<script src="https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js"></script>
```

### Через npm
```bash
npm install animejs
```

### Локально (як у нашому проекті)
```html
<script src="js/libs/anime.min.js"></script>
```

## Базове використання

### Проста анімація
```javascript
anime({
  targets: '.my-element',
  translateX: 250,
  duration: 1000
});
```

### Анімація кількох елементів
```javascript
anime({
  targets: '.my-elements',
  translateX: 250,
  duration: 1000,
  delay: anime.stagger(100) // Затримка між елементами
});
```

## Основні параметри

### targets
Елементи для анімації (селектор, NodeList, масив елементів)
```javascript
targets: '.my-class'
targets: '#my-id'
targets: document.querySelectorAll('.my-elements')
targets: [element1, element2]
```

### Властивості для анімації

#### CSS властивості
```javascript
anime({
  targets: '.box',
  translateX: 250,      // Переміщення по X
  translateY: 250,      // Переміщення по Y
  rotate: '1turn',      // Обертання
  scale: 2,             // Масштаб
  opacity: 0.5,         // Прозорість
  width: '100%',        // Ширина
  height: '100%'        // Висота
});
```

#### SVG атрибути
```javascript
anime({
  targets: 'svg circle',
  cx: 250,
  cy: 250,
  r: 100,
  fill: '#ff0000'
});
```

#### DOM атрибути
```javascript
anime({
  targets: '.element',
  value: 1000,
  round: 1
});
```

### Таймінги

#### duration
Тривалість анімації в мілісекундах
```javascript
duration: 1000  // 1 секунда
duration: 2000  // 2 секунди
```

#### delay
Затримка перед початком анімації
```javascript
delay: 500  // 0.5 секунди
delay: anime.stagger(100)  // Затримка між елементами
```

#### easing
Тип плавності анімації
```javascript
easing: 'linear'
easing: 'easeInQuad'
easing: 'easeOutQuad'
easing: 'easeInOutQuad'
easing: 'easeInCubic'
easing: 'easeOutCubic'
easing: 'easeInOutCubic'
easing: 'easeInElastic(1, .6)'
easing: 'easeOutElastic(1, .6)'
easing: [0.5, 0, 0.5, 1]  // Custom cubic-bezier
```

### Налаштування

#### loop
Кількість повторень (true = безкінечно)
```javascript
loop: true
loop: 3
```

#### direction
Напрямок анімації
```javascript
direction: 'normal'   // Звичайна
direction: 'reverse'  // Зворотна
direction: 'alternate' // Змінна
```

#### autoplay
Автоматичний запуск
```javascript
autoplay: true   // За замовчуванням
autoplay: false  // Не запускати автоматично
```

## Спеціальні функції

### anime.stagger()
Затримка між елементами
```javascript
delay: anime.stagger(100)           // 100ms між кожним
delay: anime.stagger(100, {from: 'center'})  // З центру
delay: anime.stagger(100, {from: 'first'})   // З першого
delay: anime.stagger(100, {from: 'last'})    // З останнього
delay: anime.stagger(100, {grid: [10, 10], from: 'center'})  // Сітка
```

### anime.random()
Випадкове значення
```javascript
translateX: anime.random(-100, 100)
rotate: anime.random(0, 360)
```

### anime.timeline()
Послідовність анімацій
```javascript
var tl = anime.timeline({
  easing: 'easeOutExpo',
  duration: 750
});

tl.add({
  targets: '.box1',
  translateX: 250
}).add({
  targets: '.box2',
  translateX: 250
}).add({
  targets: '.box3',
  translateX: 250
});
```

## Callbacks (зворотні виклики)

### begin
Викликається на початку анімації
```javascript
begin: function(anim) {
  console.log('Анімація почалася');
}
```

### update
Викликається під час анімації
```javascript
update: function(anim) {
  console.log('Прогрес:', anim.progress);
}
```

### complete
Викликається після завершення
```javascript
complete: function(anim) {
  console.log('Анімація завершена');
}
```

## Приклади використання

### Fade in елементів
```javascript
anime({
  targets: '.fade-in',
  opacity: [0, 1],
  translateY: [50, 0],
  duration: 1000,
  delay: anime.stagger(100)
});
```

### Анімація при скролі
```javascript
window.addEventListener('scroll', () => {
  anime({
    targets: '.scroll-element',
    translateY: window.scrollY * 0.5,
    rotate: window.scrollY * 0.1
  });
});
```

### Анімація при наведенні
```javascript
document.querySelector('.hover-element').addEventListener('mouseenter', () => {
  anime({
    targets: '.hover-element',
    scale: 1.2,
    rotate: 5,
    duration: 300
  });
});
```

### Послідовна анімація
```javascript
var timeline = anime.timeline({
  easing: 'easeOutExpo',
  duration: 750
});

timeline
  .add({
    targets: '.title',
    translateY: [-100, 0],
    opacity: [0, 1]
  })
  .add({
    targets: '.subtitle',
    translateY: [50, 0],
    opacity: [0, 1]
  }, '-=500')
  .add({
    targets: '.button',
    scale: [0, 1],
    opacity: [0, 1]
  }, '-=300');
```

### Анімація SVG
```javascript
anime({
  targets: 'svg path',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutSine',
  duration: 2000,
  delay: anime.stagger(100),
  direction: 'alternate',
  loop: true
});
```

## Інтеграція в наш проект

Додати в `index.html` перед закриттям `</body>`:
```html
<script src="js/libs/anime.min.js"></script>
```

Або використовувати в `main.js`:
```javascript
// Простий приклад
anime({
  targets: '.hero__content',
  opacity: [0, 1],
  translateY: [50, 0],
  duration: 1000,
  easing: 'easeOutExpo'
});
```

## Комбінація з AOS

Можна комбінувати AOS для тригера при скролі та Anime.js для складних анімацій:
```javascript
// Використовуємо AOS для виявлення появи елемента
document.addEventListener('aos:in', ({ detail }) => {
  // Коли елемент з'являється, запускаємо Anime.js анімацію
  anime({
    targets: detail,
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutElastic(1, .6)'
  });
});
```
