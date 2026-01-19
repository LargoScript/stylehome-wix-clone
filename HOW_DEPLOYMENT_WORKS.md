# Як працює деплой

## Поточний процес

### 1. Локальні зміни
- Ви (або я) змінюєте файли локально
- Комітите зміни в гілку `main`
- Пушите в GitHub: `git push origin main`

### 2. Автоматичний деплой
- GitHub Actions автоматично запускається при push в `main`
- Workflow `.github/workflows/deploy-gh-pages-branch.yml` виконується:
  1. Checkout коду з `main`
  2. Встановлює Node.js
  3. Встановлює залежності (`npm ci`)
  4. Білдить проект (`npm run build`)
  5. **Автоматично пушить результат в гілку `gh-pages`**

### 3. GitHub Pages
- GitHub Pages читає файли з гілки `gh-pages`
- Відображає сайт на `https://largoscript.github.io/stylehome-wix-clone/`

## Відповідь на питання

**"Ти локально змінюєш файли і заливаєш в main і в цей бранч? Тобто тобі треба декілька змін робити?"**

**НІ!** Потрібно робити зміни тільки в `main`:

1. ✅ Змінюєш файли локально
2. ✅ Комітиш в `main`: `git commit`
3. ✅ Пушиш в `main`: `git push origin main`
4. ✅ GitHub Actions автоматично:
   - Білдить проект
   - Пушить результат в `gh-pages` branch

**Тобто ти робиш зміни тільки в `main`, а GitHub Actions автоматично оновлює `gh-pages`!**

## Проблема зараз

Сайт не працює, тому що:
1. GitHub Pages все ще використовує **старий метод деплою** (GitHub Pages Environment)
2. Потрібно налаштувати GitHub Pages на використання **gh-pages branch**

## Рішення

### Крок 1: Налаштувати GitHub Pages
1. Відкрити: https://github.com/LargoScript/stylehome-wix-clone/settings/pages
2. **Source:** вибрати `gh-pages` branch
3. **Folder:** `/ (root)`
4. **Save**

### Крок 2: Зачекати на деплой
- Workflow автоматично запуститься після налаштування
- Або запустити вручну: Actions → "Deploy to gh-pages branch" → Run workflow

### Крок 3: Перевірити результат
- Після деплою файли мають бути доступні
- CSS, JS та іконки мають завантажуватися

## Переваги цього підходу

✅ **Одна зміна** - змінюєш тільки `main`
✅ **Автоматичний деплой** - GitHub Actions все робить сам
✅ **Надійніше** - `gh-pages` branch - стандартний метод для GitHub Pages
✅ **Легше відкотити** - можна просто відкотити коміт в `gh-pages`
