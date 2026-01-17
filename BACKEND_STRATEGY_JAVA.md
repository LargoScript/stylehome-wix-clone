# Backend Strategy for Style Homes - Java

## Огляд проекту
Style Homes - веб-сайт для компанії з ремонту кухонь та ванних кімнат. Потрібен бекенд для обробки форм, управління проектами, та інтеграцій.

## Рекомендований стек технологій

### Framework
- **Spring Boot 3.x** - сучасний, продуктивний фреймворк з підтримкою реактивного програмування
- **Spring Web** - для REST API
- **Spring Data JPA** - для роботи з базою даних
- **Spring Security** - для аутентифікації та авторизації
- **Spring Mail** - для відправки email-повідомлень

### База даних
- **PostgreSQL** - основна база даних (надійна, масштабована)
- **Redis** - для кешування та сесій
- **Flyway** або **Liquibase** - для міграцій БД

### Додаткові технології
- **Maven** або **Gradle** - система збірки
- **Docker** - для контейнеризації
- **JUnit 5** + **Mockito** - для тестування
- **Swagger/OpenAPI** - для документації API
- **Logback** - для логування

## Архітектура

### Структура проекту
```
stylehome-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/stylehomes/
│   │   │       ├── StyleHomesApplication.java
│   │   │       ├── config/          # Конфігурації
│   │   │       ├── controller/      # REST контролери
│   │   │       ├── service/         # Бізнес-логіка
│   │   │       ├── repository/      # Доступ до даних
│   │   │       ├── model/           # Entity моделі
│   │   │       ├── dto/             # Data Transfer Objects
│   │   │       ├── exception/       # Обробка помилок
│   │   │       └── security/        # Security конфігурація
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/        # SQL міграції
│   └── test/
└── pom.xml (або build.gradle)
```

### Основні модулі

#### 1. Consultation Module
- Обробка форм зворотного зв'язку
- Валідація даних
- Відправка email-повідомлень
- Збереження запитів в БД

#### 2. Project Management Module
- CRUD операції для проектів
- Управління фотографіями проектів
- Категорізація проектів

#### 3. Testimonials Module
- Управління відгуками
- Модерація відгуків
- API для отримання відгуків

#### 4. Admin Panel Module
- Адміністративний інтерфейс
- Управління контентом
- Статистика та аналітика

## API Endpoints

### Consultation API
```
POST   /api/consultations        - Створити новий запит
GET    /api/consultations        - Отримати всі запити (admin)
GET    /api/consultations/{id}   - Отримати конкретний запит
PUT    /api/consultations/{id}   - Оновити статус запиту
DELETE /api/consultations/{id}   - Видалити запит
```

### Projects API
```
GET    /api/projects             - Отримати всі проекти
GET    /api/projects/{id}        - Отримати конкретний проект
GET    /api/projects/{id}/images - Отримати фотографії проекту
POST   /api/projects             - Створити проект (admin)
PUT    /api/projects/{id}        - Оновити проект (admin)
DELETE /api/projects/{id}        - Видалити проект (admin)
```

### Testimonials API
```
GET    /api/testimonials         - Отримати всі відгуки
GET    /api/testimonials/{id}    - Отримати конкретний відгук
POST   /api/testimonials         - Створити відгук
PUT    /api/testimonials/{id}    - Оновити відгук (admin)
DELETE /api/testimonials/{id}    - Видалити відгук (admin)
```

## База даних

### Основні таблиці

#### consultations
```sql
CREATE TABLE consultations (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    project_type VARCHAR(50),
    project_location VARCHAR(255),
    estimated_budget VARCHAR(50),
    preferred_timeline VARCHAR(50),
    project_details TEXT,
    status VARCHAR(20) DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### projects
```sql
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_images (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### testimonials
```sql
CREATE TABLE testimonials (
    id BIGSERIAL PRIMARY KEY,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Безпека

### Аутентифікація
- JWT токени для API
- Spring Security з JWT фільтром
- Password hashing з BCrypt

### CORS
- Налаштування CORS для фронтенду
- Whitelist доменів

### Валідація
- Bean Validation (JSR-303)
- Custom validators для складних правил

## Email інтеграція

### Використання
- Spring Mail з SMTP
- HTML шаблони для email (Thymeleaf)
- Асинхронна відправка (Spring Async)

### Email типи
1. Підтвердження отримання запиту (клієнту)
2. Сповіщення про новий запит (адміністратору)
3. Оновлення статусу проекту

## Деплоймент

### Docker
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/stylehome-backend-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### CI/CD
- GitHub Actions для автоматичного деплою
- Тести перед деплоєм
- Автоматичні міграції БД

## Моніторинг та логування

- Spring Boot Actuator для метрик
- Logback для структурованого логування
- Health checks для БД та зовнішніх сервісів

## Переваги Java/Spring Boot

1. **Зріла екосистема** - багато готових рішень
2. **Велика спільнота** - легко знайти розробників
3. **Enterprise-ready** - підходить для великих проектів
4. **Багато документації** - легко навчитися
5. **Інтеграції** - багато готових інтеграцій з сервісами

## Недоліки

1. **Великий розмір** - більше споживання пам'яті
2. **Повільніший старт** - порівняно з легшими фреймворками
3. **Складніша конфігурація** - багато налаштувань

## Рекомендації

1. Використовуйте Spring Boot 3.x з Java 17+
2. Застосовуйте принципи SOLID та Clean Architecture
3. Пишіть unit та integration тести
4. Використовуйте DTO для API відповідей
5. Додайте rate limiting для захисту від DDoS
6. Використовуйте connection pooling для БД
7. Налаштуйте кешування для часто запитуваних даних

## Наступні кроки

1. Створити Spring Boot проект
2. Налаштувати підключення до PostgreSQL
3. Реалізувати Consultation API
4. Додати email інтеграцію
5. Налаштувати Spring Security
6. Додати адмін панель
7. Налаштувати CI/CD

