# Налаштування Email для Style Homes Backend

## Поточна конфігурація

Email адреса для отримання форм: **stylehomesusa@icloud.com**

## Як це працює

1. Користувач заповнює форму на сайті
2. Форма відправляє дані на бекенд API (`POST /api/consultations`)
3. Бекенд зберігає дані в базу даних
4. Бекенд відправляє **два email**:
   - **Підтвердження користувачу** - на email, який вказав користувач
   - **Сповіщення адміністратору** - на `stylehomesusa@icloud.com`

## Налаштування SMTP для iCloud

### Варіант 1: Використання iCloud SMTP (рекомендовано)

1. **Створіть App-Specific Password для iCloud:**
   - Перейдіть на https://appleid.apple.com
   - Увійдіть зі своїм Apple ID
   - Перейдіть до "App-Specific Passwords"
   - Створіть новий пароль для "Mail"

2. **Налаштуйте змінні середовища:**
```bash
export MAIL_HOST=smtp.mail.me.com
export MAIL_PORT=587
export MAIL_USERNAME=stylehomesusa@icloud.com
export MAIL_PASSWORD=your-app-specific-password
export MAIL_FROM=stylehomesusa@icloud.com
export ADMIN_EMAIL=stylehomesusa@icloud.com
```

3. **Або створіть файл `.env` в корені backend проекту:**
```env
MAIL_HOST=smtp.mail.me.com
MAIL_PORT=587
MAIL_USERNAME=stylehomesusa@icloud.com
MAIL_PASSWORD=your-app-specific-password
MAIL_FROM=stylehomesusa@icloud.com
ADMIN_EMAIL=stylehomesusa@icloud.com
```

### Варіант 2: Використання Gmail SMTP (альтернатива)

Якщо використовуєте Gmail:

```bash
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-specific-password
export MAIL_FROM=your-email@gmail.com
export ADMIN_EMAIL=stylehomesusa@icloud.com
```

**Примітка:** Для Gmail також потрібен App-Specific Password (не звичайний пароль).

### Варіант 3: Використання іншого SMTP сервісу

Можна використовувати будь-який SMTP сервер (SendGrid, Mailgun, AWS SES тощо).

## Тестування

1. Запустіть бекенд:
```bash
cd backend
mvn spring-boot:run
```

2. Заповніть форму на сайті

3. Перевірте логи бекенду - має з'явитися:
```
Admin notification email sent for consultation ID: 1
```

4. Перевірте пошту `stylehomesusa@icloud.com` - має прийти лист з даними форми

## Підтримка фото

Наразі фото конвертуються в base64 і додаються до JSON payload. Для повної підтримки фото в email потрібно:

1. Оновити `ConsultationRequest` для прийняття фото
2. Оновити `EmailService` для використання `MimeMessage` замість `SimpleMailMessage`
3. Додати фото як вкладення до email

Це можна зробити пізніше, якщо потрібно.

## Troubleshooting

### Помилка автентифікації
- Переконайтеся, що використовуєте App-Specific Password, а не звичайний пароль
- Перевірте, що `MAIL_USERNAME` та `MAIL_PASSWORD` встановлені правильно

### Помилка підключення
- Перевірте, що `MAIL_HOST` та `MAIL_PORT` правильні
- Для iCloud: `smtp.mail.me.com:587`
- Перевірте firewall/мережеві налаштування

### Email не приходить
- Перевірте логи бекенду на наявність помилок
- Перевірте папку "Спам" в поштовій скрийці
- Переконайтеся, що SMTP налаштування правильні
