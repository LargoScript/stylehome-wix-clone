# Проблеми з деплоєм Vite на GitHub Pages

## Основні проблеми та рішення

### 1. Неправильне налаштування `base` в `vite.config.js`

**Проблема:** CSS/JS файли не завантажуються (404 помилки)

**Рішення:**
- Якщо сайт на `https://USERNAME.github.io/REPO/`, встановити `base: '/REPO/'`
- Якщо на кореневому домені `https://USERNAME.github.io/`, використовувати `base: '/'`

**Приклад:**
```js
export default defineConfig({
  base: '/stylehome-wix-clone/',
  // інші налаштування
});
```

---

### 2. Відсутність файлу `.nojekyll`

**Проблема:** GitHub Pages використовує Jekyll за замовчуванням, який ігнорує файли та папки, що починаються з `_`

**Рішення:**
- Створити порожній файл `.nojekyll` в корені папки `dist/` перед деплоєм
- Можна додати в Vite plugin або в GitHub Actions workflow

**Приклад в workflow:**
```yaml
- name: Add .nojekyll
  run: touch dist/.nojekyll
```

---

### 3. Неправильні шляхи до файлів (Asset paths)

**Проблема:** HTML містить абсолютні шляхи `/assets/...` замість `/REPO/assets/...`

**Рішення:**
- Переконатися, що `base` правильно налаштований
- Використовувати Vite plugin для автоматичного додавання base path до шляхів
- Перевірити в DevTools → Network, які URL запитуються

---

### 4. GitHub Actions workflow налаштування

**Проблема:** Build не виконується правильно або використовується неправильний HTML

**Рішення:**
- Переконатися, що виконується `npm run build` (не `npm run dev`)
- Використовувати `actions/upload-pages-artifact` з правильним `path: './dist'`
- Перевірити, що всі залежності встановлені через `npm ci`

**Приклад workflow:**
```yaml
- name: Install dependencies
  run: npm ci
  
- name: Build
  run: npm run build
  
- name: Add .nojekyll
  run: touch dist/.nojekyll
  
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: './dist'
```

---

### 5. HTML містить `<script src="/src/main.ts">` замість зібраного файлу

**Проблема:** Vite не інжектує зібрані CSS/JS файли в HTML під час збірки

**Рішення:**
- Переконатися, що в `index.html` є entry point: `<script type="module" src="/src/main.ts"></script>`
- Vite автоматично замінить його на зібраний файл під час build
- Перевірити, що в `dist/index.html` є правильні теги після збірки

---

### 6. Кешування старого HTML або CSS/JS

**Проблема:** Браузер показує старі версії файлів

**Рішення:**
- Очистити кеш браузера (Hard Refresh: Ctrl+Shift+R або Ctrl+F5)
- Перевірити через інкогніто режим
- Перевірити на інших пристроях

---

### 7. Відсутність `package-lock.json`

**Проблема:** GitHub Actions не може правильно встановити залежності

**Рішення:**
- Переконатися, що `package-lock.json` не в `.gitignore`
- Закомітити `package-lock.json` в репозиторій
- Використовувати `npm ci` замість `npm install` в CI/CD

---

### 8. MIME type помилки

**Проблема:** Браузер показує помилку "Expected a JavaScript module script but the server responded with a MIME type of 'text/html'"

**Рішення:**
- Це означає, що сервер повертає HTML замість JS/CSS файлу
- Перевірити шляхи до файлів - можливо, вони неправильні
- Перевірити, чи файли дійсно існують в `dist/assets/`

---

## Чек-лист для перевірки

- [ ] `base: '/stylehome-wix-clone/'` правильно налаштований в `vite.config.js`
- [ ] Файл `.nojekyll` створюється в `dist/` перед деплоєм
- [ ] В `dist/index.html` є правильні теги `<script>` та `<link>` з base path
- [ ] GitHub Actions workflow виконує `npm run build`
- [ ] `package-lock.json` присутній в репозиторії
- [ ] Всі файли з `dist/assets/` присутні після збірки
- [ ] Шляхи в HTML відповідають `base` налаштуванню

---

## Додаткові ресурси

- [Vite Static Deploy Guide](https://vite.dev/guide/static-deploy.html)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite GitHub Pages Deployer Action](https://github.com/marketplace/actions/vite-github-pages-deployer)

---

## Поточна конфігурація проекту

### vite.config.ts
- ✅ `base: '/stylehome-wix-clone/'` налаштовано
- ✅ Custom plugin `add-base-path` додає base path до шляхів
- ✅ Plugin створює `.nojekyll` файл

### .github/workflows/deploy.yml
- ✅ Виконується `npm ci` для встановлення залежностей
- ✅ Виконується `npm run build` для збірки
- ✅ Створюється `.nojekyll` файл
- ✅ Завантажується `dist/` як artifact
- ✅ Деплоїться через `actions/deploy-pages@v4`

### package.json
- ✅ `package-lock.json` присутній в репозиторії
- ✅ Entry point `<script type="module" src="/src/main.ts"></script>` в `index.html`

---

## Відомі проблеми

1. **HTML містить `<script src="/src/main.ts">` замість зібраного файлу на GitHub Pages**
   - Локально все працює правильно
   - На GitHub Pages HTML містить оригінальний тег
   - Можлива причина: GitHub Actions не виконує збірку правильно або використовує неправильний HTML
   - **Статус (2026-01-18 15:59):** Проблема все ще присутня
   - **Деталі:** Запит до `https://largoscript.github.io/src/main.ts` повертає 404
   - **Очікувано:** HTML має містити `<script src="/stylehome-wix-clone/assets/main-XXXXX.js">`

2. **CSS/JS файли не завантажуються (404)**
   - Можлива причина: неправильні шляхи або відсутність `.nojekyll`
   - Рішення: перевірити шляхи в HTML та наявність `.nojekyll`
   - **Статус (2026-01-18 15:59):** CSS файли завантажуються (200), але JS файл не завантажується через помилку в HTML

---

## Результати перевірки деплою (2026-01-18 15:59)

### Статус GitHub Pages:
- ✅ Сайт доступний на `https://largoscript.github.io/stylehome-wix-clone/`
- ✅ CSS файли завантажуються (200)
- ✅ Статичні ресурси (img, video) завантажуються (200)
- ❌ JS файл не завантажується - запит до `/src/main.ts` повертає 404
- ❌ HTML містить `<script type="module" src="/src/main.ts"></script>` замість зібраного файлу

### Network запити:
- `https://largoscript.github.io/src/main.ts` - **404** (має бути `/stylehome-wix-clone/assets/main-XXXXX.js`)
- `https://largoscript.github.io/stylehome-wix-clone/js/libs/aos.css` - **200** ✅
- `https://largoscript.github.io/stylehome-wix-clone/js/libs/aos.js` - **200** ✅
- `https://largoscript.github.io/stylehome-wix-clone/js/libs/anime.min.js` - **200** ✅

### Проблема:
HTML на GitHub Pages містить оригінальний `<script type="module" src="/src/main.ts"></script>` замість зібраного файлу, який має бути `<script type="module" crossorigin src="/stylehome-wix-clone/assets/main-C9ElwBAl.js"></script>`.

### Можливі причини:
1. GitHub Actions не виконує збірку правильно
2. Використовується неправильний HTML файл (оригінальний замість зібраного)
3. Vite не інжектує зібрані файли в HTML під час збірки на GitHub Actions

### Наступні кроки:
1. Перевірити логи GitHub Actions - чи правильно виконується `npm run build`
2. Перевірити, чи файли в `dist/` після збірки містять правильний HTML
3. Можливо, потрібно додати додаткові налаштування для Vite під час збірки

---

*Документ створено: 2026-01-18*
*Останнє оновлення: 2026-01-18 15:59*
