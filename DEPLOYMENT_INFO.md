# Інформація про деплой

## Поточний стан

### Деплой відбувається з:
- **Гілка:** `main`
- **Метод:** GitHub Actions → GitHub Pages Environment
- **Workflow файл:** `.github/workflows/deploy.yml`

### Альтернативний метод (не використовується):
- **Гілка:** `main` → `gh-pages` branch
- **Workflow файл:** `.github/workflows/deploy-gh-pages-branch.yml`

## Проблеми

1. **CSS та JS файли не завантажуються** (404)
   - Файли існують локально в `dist/assets/`
   - Але не доступні на GitHub Pages

2. **Facebook іконка не завантажується** (404)
   - Файл існує в `dist/img/facebook.svg`
   - Але не доступний на GitHub Pages

3. **Instagram та Thumbtack працюють** (200)
   - Файли доступні на GitHub Pages

## Рекомендація

**Використати окрему гілку `gh-pages` для деплою:**

### Переваги:
- ✅ Більш надійний метод деплою
- ✅ Можна перевірити вміст гілки перед деплоєм
- ✅ Легше відкотити зміни
- ✅ Менше конфліктів з основною гілкою

### Як перейти на gh-pages:

1. **Налаштувати GitHub Pages:**
   - Settings → Pages → Source: `gh-pages` branch

2. **Активувати альтернативний workflow:**
   - Видалити або перейменувати `.github/workflows/deploy.yml`
   - Використовувати `.github/workflows/deploy-gh-pages-branch.yml`

3. **Або створити нову гілку для деплою:**
   ```bash
   git checkout -b deploy
   git push origin deploy
   ```

## Файли для деплою

### Що копіюється:
- `dist/` - вся папка зібраного проекту
- Включає:
  - `index.html` та інші HTML файли
  - `assets/` - CSS, JS, зображення
  - `img/` - зображення з `public/img/`
  - `.nojekyll` - файл для GitHub Pages

### Проблемні файли:
- `assets/main-*.css` - не завантажуються
- `assets/main-*.js` - не завантажуються
- `img/facebook.svg` - не завантажується

## Наступні кроки

1. Перевірити налаштування GitHub Pages
2. Перейти на деплой через `gh-pages` branch
3. Перевірити, чи правильно завантажуються файли
