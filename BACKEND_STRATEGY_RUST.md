# Backend Strategy for Style Homes - Rust

## Огляд проекту
Style Homes - веб-сайт для компанії з ремонту кухонь та ванних кімнат. Потрібен високопродуктивний бекенд для обробки форм, управління проектами, та інтеграцій.

## Рекомендований стек технологій

### Framework
- **Actix Web 4.x** - високопродуктивний, асинхронний веб-фреймворк
- **Tokio** - асинхронний runtime
- **Serde** - серіалізація/десеріалізація JSON
- **Validator** - валідація даних

### База даних
- **SQLx** - асинхронний SQL драйвер з compile-time перевіркою запитів
- **PostgreSQL** - основна база даних
- **Redis** - для кешування та сесій (через `redis` crate)
- **sqlx-cli** - для міграцій БД

### Додаткові технології
- **Cargo** - менеджер пакетів та система збірки
- **Docker** - для контейнеризації
- **cargo-test** - для тестування
- **utoipa** або **paperclip** - для OpenAPI документації
- **tracing** + **tracing-subscriber** - для логування

### Аутентифікація
- **jsonwebtoken** - для JWT токенів
- **bcrypt** - для хешування паролів
- **argon2** - альтернатива bcrypt (більш безпечна)

## Архітектура

### Структура проекту
```
stylehome-backend/
├── Cargo.toml
├── .env
├── migrations/
│   └── *.sql
├── src/
│   ├── main.rs
│   ├── config/          # Конфігурація
│   ├── handlers/        # HTTP handlers
│   ├── services/        # Бізнес-логіка
│   ├── models/          # Моделі даних
│   ├── db/              # Database connection pool
│   ├── middleware/      # Middleware (auth, cors, etc.)
│   ├── utils/           # Утиліти
│   └── error.rs         # Обробка помилок
└── tests/
```

### Основні модулі

#### 1. Consultation Module
- Обробка форм зворотного зв'язку
- Валідація даних
- Відправка email-повідомлень (через `lettre`)
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
GET    /api/consultations/{id}  - Отримати конкретний запит
PUT    /api/consultations/{id}  - Оновити статус запиту
DELETE /api/consultations/{id}  - Видалити запит
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

## Приклад коду

### Cargo.toml
```toml
[package]
name = "stylehome-backend"
version = "0.1.0"
edition = "2021"

[dependencies]
actix-web = "4.4"
actix-rt = "2.9"
tokio = { version = "1.35", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
sqlx = { version = "0.7", features = ["runtime-tokio-rustls", "postgres", "chrono", "uuid"] }
dotenv = "0.15"
validator = { version = "0.18", features = ["derive"] }
jsonwebtoken = "9.2"
bcrypt = "0.15"
lettre = "0.11"
redis = { version = "0.24", features = ["tokio-comp"] }
tracing = "0.1"
tracing-subscriber = "0.3"
chrono = { version = "0.4", features = ["serde"] }
uuid = { version = "1.6", features = ["v4", "serde"] }
anyhow = "1.0"
thiserror = "1.0"
```

### Приклад handler
```rust
use actix_web::{web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use validator::Validate;

#[derive(Deserialize, Validate)]
pub struct CreateConsultationRequest {
    #[validate(length(min = 1, max = 100))]
    pub first_name: String,
    #[validate(length(min = 1, max = 100))]
    pub last_name: String,
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 10, max = 20))]
    pub phone: String,
    pub project_type: Option<String>,
    pub project_location: Option<String>,
    pub estimated_budget: Option<String>,
    pub preferred_timeline: Option<String>,
    pub project_details: Option<String>,
}

#[derive(Serialize)]
pub struct ConsultationResponse {
    pub id: i64,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub status: String,
}

pub async fn create_consultation(
    pool: web::Data<PgPool>,
    req: web::Json<CreateConsultationRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    // Валідація
    req.validate()?;
    
    // Збереження в БД
    let consultation = sqlx::query_as!(
        ConsultationResponse,
        r#"
        INSERT INTO consultations 
        (first_name, last_name, email, phone, project_type, project_location, 
         estimated_budget, preferred_timeline, project_details)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, first_name, last_name, email, status
        "#,
        req.first_name,
        req.last_name,
        req.email,
        req.phone,
        req.project_type,
        req.project_location,
        req.estimated_budget,
        req.preferred_timeline,
        req.project_details
    )
    .fetch_one(pool.get_ref())
    .await?;
    
    // Відправка email (асинхронно)
    // TODO: implement email sending
    
    Ok(HttpResponse::Created().json(consultation))
}
```

## Безпека

### Аутентифікація
- JWT токени для API
- Middleware для перевірки токенів
- Password hashing з bcrypt або argon2

### CORS
- Налаштування CORS middleware
- Whitelist доменів

### Валідація
- Validator crate для валідації
- Custom validators для складних правил

## Email інтеграція

### Використання
- Lettre crate для відправки email
- HTML шаблони (через `askama` або `tera`)
- Асинхронна відправка через Tokio

### Email типи
1. Підтвердження отримання запиту (клієнту)
2. Сповіщення про новий запит (адміністратору)
3. Оновлення статусу проекту

## Деплоймент

### Docker
```dockerfile
FROM rust:1.75 as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=builder /app/target/release/stylehome-backend .
EXPOSE 8080
CMD ["./stylehome-backend"]
```

### CI/CD
- GitHub Actions для автоматичного деплою
- Тести перед деплоєм
- Автоматичні міграції БД

## Моніторинг та логування

- Tracing для структурованого логування
- Prometheus метрики (через `actix-web-prom`)
- Health checks для БД та зовнішніх сервісів

## Переваги Rust

1. **Висока продуктивність** - близька до C/C++
2. **Безпека пам'яті** - компілятор гарантує безпеку
3. **Асинхронність** - висока конкурентність
4. **Малі ресурси** - низьке споживання пам'яті
5. **Швидкий старт** - порівняно з JVM
6. **Compile-time гарантії** - менше помилок під час виконання

## Недоліки

1. **Крута крива навчання** - складніша мова
2. **Довша компіляція** - порівняно з інтерпретованими мовами
3. **Менша кількість розробників** - важче знайти команду
4. **Менше готових рішень** - менша екосистема порівняно з Java

## Рекомендації

1. Використовуйте Rust 1.70+ з актуальними crate
2. Застосовуйте принципи функціонального програмування
3. Пишіть unit та integration тести
4. Використовуйте типобезпеку Rust для безпеки
5. Додайте rate limiting (через `actix-ratelimit`)
6. Використовуйте connection pooling для БД
7. Налаштуйте кешування через Redis
8. Використовуйте `thiserror` для обробки помилок

## Наступні кроки

1. Створити Rust проект з Actix Web
2. Налаштувати підключення до PostgreSQL через SQLx
3. Реалізувати Consultation API
4. Додати email інтеграцію через Lettre
5. Налаштувати JWT аутентифікацію
6. Додати адмін панель
7. Налаштувати CI/CD
8. Оптимізувати продуктивність

## Порівняння з Java

| Критерій | Rust | Java |
|----------|------|------|
| Продуктивність | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Безпека | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Екосистема | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Навчання | ⭐⭐ | ⭐⭐⭐⭐ |
| Розробка | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Споживання ресурсів | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

## Висновок

Rust - відмінний вибір для високонавантажених систем, де важлива продуктивність та безпека. Якщо команда готова до вивчення Rust, це може дати значні переваги в довгостроковій перспективі.

