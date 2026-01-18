# Виправлення проблеми з розтягуванням зображення в Hero секції на підсторінках

## Опис проблеми

На підсторінках (`kitchen-renovation.html`, `bathroom-renovation.html`) зображення в hero-секції не розтягувалося на весь екран — залишалася біла смуга справа.

## Виявлена коренева причина

**Проблема НЕ в CSS властивостях, а в тому, що підсторінки і головна сторінка використовували РІЗНІ CSS файли:**

| Сторінка | CSS файл | Є стилі `.hero--subpage`? |
|----------|----------|---------------------------|
| `index.html` | `css/style.css` | ✅ Так |
| `kitchen-renovation.html` | `/src/style.css` | ❌ Ні |
| `bathroom-renovation.html` | `/src/style.css` | ❌ Ні |

Стилі для `.hero--subpage` були тільки в `css/style.css`, тому на підсторінках вони не застосовувалися.

### Важливе зауваження

Це **НЕ** проблема CSS властивостей (`100vw`, `translateX`, `full-bleed hack` тощо) — це проблема **відсутності потрібних стилів у файлі, який підключено до підсторінок**.

## Рішення

Додати стилі для `.hero--subpage` з `css/style.css` в `src/style.css`:

```css
/* Підсторінки Hero - менша висота */
.hero--subpage {
    height: 70vh;
    min-height: 500px;
    width: 100%;
    position: relative;
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

.hero--subpage .hero__image-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
}

.hero--subpage .hero__overlay {
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(139, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(139, 0, 0, 0.2) 100%);
    transition: none;
}

/* Вирівнювання контенту для підсторінок */
.hero--subpage .hero__content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 40px 20px;
}

.hero--subpage .hero__badge {
    background: rgba(255, 255, 255, 0.9);
    padding: 14px 28px;
    border-radius: 12px;
    font-size: 20px;
    color: #333;
    font-weight: 500;
    text-align: center;
    line-height: 1.6;
}

.hero--subpage .hero__badge strong {
    color: #8b0000;
    font-weight: 700;
}

.hero--subpage .hero__card {
    background: rgba(255, 255, 255, 0.95);
    padding: 40px 48px;
    border-radius: 16px;
    max-width: 800px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    text-align: center;
}

.hero--subpage .hero__title {
    font-size: 36px;
    font-weight: 700;
    color: #8b0000;
    margin-bottom: 12px;
    letter-spacing: 0.5px;
}

.hero--subpage .hero__subtitle {
    font-size: 18px;
    color: #555;
    margin-bottom: 8px;
    font-weight: 500;
}

.hero--subpage .hero__location {
    font-size: 14px;
    color: #777;
}
```

### Примітка про `width: 100%` замість `100vw` + full-bleed hack

Використовується `width: 100%` замість `width: 100vw` + full-bleed hack, оскільки:

1. Це простіший та надійніший підхід
2. Уникає проблем з шириною scrollbar
3. Hero-секція вже займає повну ширину батьківського контейнера

## Уроки на майбутнє

### Що перевіряти при виникненні подібних проблем:

1. **Перевірити, які CSS файли підключені до сторінки**
   - Відкрити DevTools → Network → перевірити завантажені CSS файли
   - Перевірити `<link>` теги в HTML

2. **Перевірити, чи є потрібні стилі в підключеному CSS файлі**
   - Використати DevTools → Elements → перевірити computed styles
   - Перевірити, чи застосовуються потрібні класи

3. **Переконатися, що всі сторінки використовують однакові CSS файли**
   - Або що потрібні стилі є в усіх використовуваних CSS файлах

4. **Не поспішати з складними CSS рішеннями**
   - Спочатку перевірити базові речі: чи підключені потрібні файли?
   - Чи є потрібні класи в HTML?
   - Чи є потрібні стилі в CSS?

### Чеклист для перевірки CSS проблем:

- [ ] Перевірити, які CSS файли підключені до сторінки
- [ ] Перевірити, чи є потрібні стилі в підключеному CSS файлі
- [ ] Перевірити computed styles в DevTools
- [ ] Перевірити, чи застосовуються потрібні класи в HTML
- [ ] Перевірити, чи немає конфліктуючих стилів
- [ ] Перевірити медіа-запити
- [ ] Перевірити специфічність селекторів

## Висновок

Проблема була не в CSS властивостях, а в тому, що підсторінки використовували інший CSS файл, який не містив потрібних стилів. Це класичний приклад того, як важливо перевіряти базові речі перед застосуванням складних рішень.

**Головне правило:** Завжди перевіряйте, які файли підключені до сторінки, перед тим як шукати проблеми в CSS властивостях.
