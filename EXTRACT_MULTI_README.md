# Інструкція з використання скрипта для витягування проектів з кількох сторінок

## Опис

Скрипт `extract_projects_multi.py` дозволяє одночасно обробити декілька сторінок сайту, витягуючи:
- Всі проекти з каруселями
- Всі фото з кожної каруселі (перегортаючи через кнопку Next)
- Описи проектів
- Hero фото для кожної сторінки

## Встановлення залежностей

```bash
pip install selenium
```

## Налаштування

Відкрийте `extract_projects_multi.py` і додайте URL сторінок, які потрібно обробити, в секцію `pages_config`:

```python
pages_config = [
    {
        'name': 'kitchen',
        'url': 'https://www.stylehomesusa.com/kitchen-renovation',
        'displayName': 'Kitchen Renovation'
    },
    {
        'name': 'bathroom',
        'url': 'https://www.stylehomesusa.com/bathroom-renovation',
        'displayName': 'Bathroom Renovation'
    },
    {
        'name': 'page3',
        'url': 'https://www.stylehomesusa.com/page3-url',
        'displayName': 'Page 3 Name'
    },
    {
        'name': 'page4',
        'url': 'https://www.stylehomesusa.com/page4-url',
        'displayName': 'Page 4 Name'
    },
]
```

## Запуск

```bash
python extract_projects_multi.py
```

## Як працює скрипт

1. **Паралельна обробка**: Кожна сторінка обробляється в окремому браузері одночасно
2. **Пошук каруселей**: Скрипт знаходить всі каруселі на сторінці
3. **Перегортання фото**: Для кожної каруселі скрипт:
   - Читає лічильник (наприклад, "1/6")
   - Клікає кнопку "Next" стільки разів, скільки потрібно
   - Збирає всі унікальні фото
4. **Hero фото**: Шукає велике зображення на початку сторінки для hero секції
5. **Описи**: Зберігає описи проектів

## Результати

Скрипт створює:

1. **Окремі JSON файли для кожної сторінки**:
   - `kitchen-projects-extracted-YYYY-MM-DD.json`
   - `bathroom-projects-extracted-YYYY-MM-DD.json`
   - і т.д.

2. **Загальний файл з усіма результатами**:
   - `all-projects-extracted-YYYY-MM-DD.json`

## Структура JSON файлу

```json
{
  "pageName": "Kitchen Renovation",
  "url": "https://www.stylehomesusa.com/kitchen-renovation",
  "heroImage": {
    "url": "https://static.wixstatic.com/media/...",
    "alt": "Kitchen Renovation Hero",
    "currentSrc": "..."
  },
  "totalProjects": 6,
  "projects": [
    {
      "projectNumber": 1,
      "title": "Project Title",
      "description": "Project description...",
      "foundPhotos": 6,
      "images": [
        {
          "index": 1,
          "url": "https://static.wixstatic.com/media/...",
          "alt": "Photo alt text",
          "currentSrc": "..."
        }
      ],
      "domPath": "comp-mfqwrx08__item1"
    }
  ]
}
```

## Примітки

- Скрипт відкриває браузери в headless режимі (за замовчуванням закоментовано)
- Для відлагодження розкоментуйте `chrome_options.add_argument('--headless')`
- Кожна сторінка обробляється в окремому процесі для швидкості
- Скрипт автоматично чекає завантаження контенту перед витягуванням
