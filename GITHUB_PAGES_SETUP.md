# Налаштування GitHub Pages

## Крок 1: Відкрити налаштування
1. Перейти: https://github.com/LargoScript/stylehome-wix-clone/settings/pages

## Крок 2: Вибрати метод деплою
1. В розділі **"Source"** вибрати: **"GitHub Actions"**
   - Опис: "Best for using frameworks and customizing your build process"
   - Це сучасний метод, який використовує наш workflow

## Крок 3: Зберегти
1. Натиснути **"Save"**

## Що відбувається далі

### Автоматично:
1. GitHub Pages використовує workflow `.github/workflows/deploy.yml`
2. При кожному push в `main`:
   - Запускається білд
   - Створюється artifact з `dist/` папкою
   - Деплоїться на GitHub Pages

### Переваги GitHub Actions:
✅ **Сучасний метод** - рекомендований GitHub
✅ **Автоматичний деплой** - при кожному push
✅ **Надійніше** - використовує GitHub Pages Environment
✅ **Краще для Vite** - правильно обробляє зібрані файли

## Після налаштування

1. Зачекати 2-5 хвилин на перший деплой
2. Перевірити сайт: https://largoscript.github.io/stylehome-wix-clone/
3. CSS, JS та іконки мають завантажуватися

## Якщо щось не працює

1. Перевірити логи: Actions → останній workflow run
2. Перевірити, чи правильно налаштований Source
3. Перевірити, чи є файли в `dist/` після білду
