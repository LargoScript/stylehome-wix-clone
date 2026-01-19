# Налаштування форми для роботи з бекендом

## Поточний стан

Форма налаштована для відправки даних на Spring Boot бекенд через REST API.

### Endpoint
- **URL**: `http://localhost:8080/api/consultations` (за замовчуванням)
- **Метод**: `POST`
- **Content-Type**: `application/json`

### Структура даних

Форма відправляє JSON, що відповідає `ConsultationRequest` DTO:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1 (503) 980 5216",
  "projectType": "kitchen",
  "projectLocation": "Portland, OR",
  "estimatedBudget": "10k-25k",
  "preferredTimeline": "1-2-months",
  "projectDetails": "I need a kitchen renovation",
  "photos": [
    {
      "filename": "photo1.jpg",
      "contentType": "image/jpeg",
      "data": "base64_encoded_string",
      "size": 123456
    }
  ]
}
```

## Налаштування URL бекенду

### Варіант 1: Через змінну window (для production)

Додайте в `index.html` перед закриттям `</body>`:

```html
<script>
  window.BACKEND_URL = 'https://your-backend-domain.com';
</script>
```

### Варіант 2: Через змінні середовища (для development)

Створіть файл `.env` в корені проекту:

```env
VITE_BACKEND_URL=http://localhost:8080
```

Потім оновіть `src/modules/form.ts`:

```typescript
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
```

## Підтримка фото

### Поточний стан
- Фото конвертуються в base64 і додаються до JSON payload
- Поле `photos` є опціональним - якщо бекенд не підтримує, воно буде проігноровано

### Для повної підтримки фото в бекенді

Потрібно оновити бекенд:

1. **Додати поле в `ConsultationRequest.java`:**
```java
private List<PhotoData> photos;
```

2. **Створити клас `PhotoData.java`:**
```java
@Data
public class PhotoData {
    private String filename;
    private String contentType;
    private String data; // base64
    private Long size;
}
```

3. **Оновити `Consultation` entity** для збереження фото в БД або файловій системі

4. **Оновити `EmailService`** для додавання фото до email-повідомлень

## Тестування

1. Запустіть бекенд:
```bash
cd backend
mvn spring-boot:run
```

2. Запустіть фронтенд:
```bash
npm run dev
```

3. Заповніть форму на сторінці та перевірте відправку

4. Перевірте логи бекенду для підтвердження отримання даних

## Помилки та вирішення

### CORS помилки
Якщо виникають CORS помилки, переконайтеся, що в `ConsultationController.java` є:
```java
@CrossOrigin(origins = "*")
```

### 404 Not Found
Перевірте, що:
- Бекенд запущений на порту 8080
- URL правильний (`/api/consultations` або `/consultations`)

### 400 Bad Request
Перевірте, що всі обов'язкові поля заповнені:
- `firstName` (required)
- `email` (required, valid email)
- `phone` (required, valid format)
- `projectDetails` (required)
