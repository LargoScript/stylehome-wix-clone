# Style Homes Backend API

Spring Boot backend для веб-сайту Style Homes.

## Технології

- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database (development) / PostgreSQL (production)
- Flyway (міграції БД)
- Spring Mail
- Lombok

## Структура проекту

```
backend/
├── src/main/java/com/stylehomes/
│   ├── StyleHomesApplication.java
│   ├── config/          # Конфігурації (CORS, Async, Mail)
│   ├── controller/      # REST контролери
│   ├── service/         # Бізнес-логіка
│   ├── repository/      # JPA репозиторії
│   ├── model/           # Entity моделі
│   ├── dto/             # Data Transfer Objects
│   └── exception/       # Обробка помилок
└── src/main/resources/
    ├── application.yml
    └── db/migration/    # SQL міграції
```

## Запуск проекту

### Вимоги
- Java 17+
- Maven 3.6+ (або використати Maven Wrapper)

### Локальний запуск (з Maven)

```bash
# Збірка проекту
mvn clean install

# Запуск
mvn spring-boot:run
```

### Без Maven (використовуючи Java)

Якщо Maven не встановлено, можна використати Maven Wrapper або завантажити залежності вручну.

## API Endpoints

### Consultation API

- `POST /api/consultations` - Створити новий запит
- `GET /api/consultations` - Отримати всі запити
- `GET /api/consultations/{id}` - Отримати конкретний запит
- `PUT /api/consultations/{id}/status?status=PROCESSED` - Оновити статус
- `DELETE /api/consultations/{id}` - Видалити запит

### Приклад запиту

```bash
POST http://localhost:8080/api/consultations
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1 (503) 980 5216",
  "projectType": "kitchen",
  "projectLocation": "Portland, OR",
  "estimatedBudget": "10k-25k",
  "preferredTimeline": "1-2-months",
  "projectDetails": "I need a kitchen renovation"
}
```

## Конфігурація

### Development (application-dev.yml)
- H2 in-memory database
- Автоматичне створення таблиць
- Детальне логування

### Production (application-prod.yml)
- PostgreSQL database
- Міграції через Flyway
- Мінімальне логування

### Email налаштування

Додайте змінні оточення:
- `MAIL_USERNAME` - SMTP username
- `MAIL_PASSWORD` - SMTP password
- `MAIL_FROM` - Email відправника
- `ADMIN_EMAIL` - Email адміністратора

## База даних

### H2 Console (development)
Доступна за адресою: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:stylehomesdb`
- Username: `sa`
- Password: (порожній)

### Міграції
Міграції знаходяться в `src/main/resources/db/migration/` та виконуються автоматично при старті.

## ✅ Photo Attachments

The backend fully supports photo attachments:

- Frontend converts photos to base64 and sends them in JSON payload
- Backend decodes base64 and attaches photos to the admin notification email
- Admin receives email with all photos attached (not just links!)

See `EMAIL_SETUP.md` for detailed email configuration.

## Deployment on Render.com

1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Set build command: `mvn clean install`
4. Set start command: `java -jar target/stylehome-backend-1.0.0.jar --spring.profiles.active=prod`
5. Add environment variables (see `EMAIL_SETUP.md`)
6. Add PostgreSQL database

## Next Steps

1. Add Projects API
2. Add Testimonials API
3. Configure Spring Security for admin panel
4. Add file upload for project images
5. Configure CI/CD
