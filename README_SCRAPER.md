# Скрипт для завантаження зображень з bathroom-renovation

## Встановлення

1. Встановіть Python 3.9+ (якщо ще не встановлено)

2. Встановіть залежності:
```bash
pip install -r requirements_scraper.txt
```

3. Встановіть ChromeDriver:
   - Автоматично через `webdriver-manager` (якщо додати до requirements)
   - Або вручну: https://chromedriver.chromium.org/downloads
   - Або використовуйте `selenium-manager` (вбудовано в Selenium 4.6+)

## Використання

```bash
python download_bathroom_images.py
```

## Як працює скрипт

1. **Знаходить всі каруселі** на сторінці через селектор `[data-testid="gallery-counter"]`
2. **Для кожної каруселі**:
   - Створює окрему папку `bathroom1/`, `bathroom2/`, тощо
   - Визначає кількість зображень з індикатора (наприклад, "1/8")
   - Гортає карусель, натискаючи кнопку `[data-testid="gallery-nextButton"]`
   - Завантажує кожне зображення з затримкою 3 секунди між кліками
   - Створює файл `info.txt` з назвою, описом та списком зображень
3. **Паралельна обробка**: кожна карусель обробляється в окремому потоці зі своїм браузером
4. **Логування**: всі дії записуються в `download_bathroom_images.log`

## Структура результатів

```
img/projects/bathroom/
├── bathroom1/
│   ├── info.txt
│   ├── bathroom1_1.jpg
│   ├── bathroom1_2.jpg
│   └── ...
├── bathroom2/
│   ├── info.txt
│   ├── bathroom2_1.jpg
│   └── ...
└── ...
```

## Налаштування

У файлі `download_bathroom_images.py` можна змінити:
- `delay` - затримка між кліками (за замовчуванням 3 секунди)
- `output_dir` - папка для збереження зображень
- `headless` - режим браузера (True/False)

## Примітки

- Скрипт використовує Selenium, оскільки `curl_cffi` не може виконувати JavaScript
- Для роботи потрібен Chrome/Chromium браузер
- В headless режимі браузер працює без вікна
- Якщо сайт має захист від ботів, може знадобитися додаткове налаштування
