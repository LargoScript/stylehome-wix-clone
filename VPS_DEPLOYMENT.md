# Style Homes - VPS Deployment Guide

## 📋 Огляд архітектури

```
┌─────────────────────────────────────────────────────────────┐
│                         VPS SERVER                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐     ┌──────────────┐     ┌─────────────┐  │
│  │   Nginx     │────▶│   Frontend   │     │  PostgreSQL │  │
│  │  (reverse   │     │   (static)   │     │  (database) │  │
│  │   proxy)    │     │   /var/www   │     │             │  │
│  │  port 80/443│     └──────────────┘     └──────┬──────┘  │
│  │             │                                  │         │
│  │             │     ┌──────────────┐            │         │
│  │             │────▶│   Backend    │◀───────────┘         │
│  │             │     │ (Spring Boot)│                      │
│  │             │     │  port 8080   │──────▶ SMTP Server   │
│  └─────────────┘     └──────────────┘       (email)        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Як працює форма відправки

### Процес обробки заявки:

```
1. Клієнт заповнює форму на сайті
         │
         ▼
2. Frontend відправляє POST на /api/consultations
   (JSON з даними + фото в base64)
         │
         ▼
3. Backend приймає запит:
   - Зберігає в PostgreSQL
   - Відправляє 2 emails:
         │
    ┌────┴────┐
    ▼         ▼
4a. EMAIL    4b. EMAIL
   КЛІЄНТУ       АДМІНУ
   (confirmation) (notification + фото)
```

### Два листи відправляються:

| Лист | Кому | Що містить |
|------|------|------------|
| **Confirmation** | Клієнту (email з форми) | Підтвердження що заявка прийнята |
| **Notification** | Адміну (stylehomesusa@icloud.com) | Повна інформація + прикріплені фото |

> ⚠️ **Чи потрібен лист клієнту?** 
> 
> **Рекомендую залишити** - це:
> - Підтверджує клієнту що заявка отримана
> - Виглядає професійно
> - Клієнт знає що його не проігнорували
>
> Якщо хочете вимкнути - закоментуйте рядок в `EmailService.java`:
> ```java
> // emailService.sendConsultationConfirmation(saved);
> ```

---

## 🖥️ Вимоги до VPS

### Мінімальні:
- **OS**: Ubuntu 20.04+ / Debian 11+
- **RAM**: 1 GB
- **CPU**: 1 vCPU
- **Disk**: 20 GB SSD
- **Java**: 17+
- **Node.js**: 18+ (для білда)

### Рекомендовані:
- **RAM**: 2 GB
- **CPU**: 2 vCPU
- **Disk**: 40 GB SSD

---

## 📦 Крок 1: Підготовка VPS

```bash
# Оновлення системи
sudo apt update && sudo apt upgrade -y

# Встановлення необхідних пакетів
sudo apt install -y nginx postgresql postgresql-contrib openjdk-17-jdk maven git ufw certbot python3-certbot-nginx

# Перевірка версій
java -version   # має бути 17+
mvn -version    # Maven
nginx -v        # Nginx
psql --version  # PostgreSQL
```

---

## 📦 Крок 2: Налаштування PostgreSQL

```bash
# Вхід в PostgreSQL
sudo -u postgres psql

# Створення бази даних і користувача
CREATE DATABASE stylehomes;
CREATE USER stylehomes_user WITH ENCRYPTED PASSWORD 'ВАШ_СИЛЬНИЙ_ПАРОЛЬ';
GRANT ALL PRIVILEGES ON DATABASE stylehomes TO stylehomes_user;
\q
```

---

## 📦 Крок 3: Деплой Frontend

```bash
# Створення директорії для сайту
sudo mkdir -p /var/www/stylehomes
sudo chown -R $USER:$USER /var/www/stylehomes

# Клонування репозиторію (або завантаження білда)
cd /tmp
git clone https://github.com/YOUR_USERNAME/stylehome-wix-clone.git
cd stylehome-wix-clone/stylehome_new

# Білд фронтенду (якщо ще не зібрано)
npm install
npm run build

# Копіювання білда
cp -r dist/* /var/www/stylehomes/
```

**Або просто завантажте готовий `dist/` folder через SCP:**
```bash
scp -r dist/* user@your-vps-ip:/var/www/stylehomes/
```

---

## 📦 Крок 4: Деплой Backend

```bash
# Створення директорії для бекенду
sudo mkdir -p /opt/stylehomes
sudo chown -R $USER:$USER /opt/stylehomes

# Копіювання бекенду
cd /tmp/stylehome-wix-clone/stylehome_new/backend

# Білд бекенду
mvn clean package -DskipTests

# Копіювання JAR
cp target/stylehome-backend-1.0.0.jar /opt/stylehomes/
```

### Створення конфігурації:

```bash
# Створення файлу з environment variables
sudo nano /opt/stylehomes/.env
```

```env
# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/stylehomes
SPRING_DATASOURCE_USERNAME=stylehomes_user
SPRING_DATASOURCE_PASSWORD=ВАШ_СИЛЬНИЙ_ПАРОЛЬ

# Email (iCloud)
MAIL_HOST=smtp.mail.me.com
MAIL_PORT=587
MAIL_USERNAME=stylehomesusa@icloud.com
MAIL_PASSWORD=ВАШ_APP_SPECIFIC_PASSWORD
MAIL_FROM=stylehomesusa@icloud.com
ADMIN_EMAIL=stylehomesusa@icloud.com

# CORS (замініть на свій домен)
CORS_ORIGINS=https://stylehomesusa.com,https://www.stylehomesusa.com

# Server
PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

### Створення systemd service:

```bash
sudo nano /etc/systemd/system/stylehomes.service
```

```ini
[Unit]
Description=Style Homes Backend
After=syslog.target network.target postgresql.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/stylehomes
EnvironmentFile=/opt/stylehomes/.env
ExecStart=/usr/bin/java -jar /opt/stylehomes/stylehome-backend-1.0.0.jar
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
# Встановлення прав
sudo chown -R www-data:www-data /opt/stylehomes
sudo chmod 600 /opt/stylehomes/.env

# Запуск сервісу
sudo systemctl daemon-reload
sudo systemctl enable stylehomes
sudo systemctl start stylehomes

# Перевірка статусу
sudo systemctl status stylehomes
sudo journalctl -u stylehomes -f  # логи
```

---

## 📦 Крок 5: Налаштування Nginx

```bash
sudo nano /etc/nginx/sites-available/stylehomes
```

```nginx
server {
    listen 80;
    server_name stylehomesusa.com www.stylehomesusa.com;
    
    # Frontend (static files)
    root /var/www/stylehomes;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|svg|mp4|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy to backend
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # For file uploads (photos)
        client_max_body_size 50M;
    }
    
    # SPA routing (all routes to index.html)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Активація сайту
sudo ln -s /etc/nginx/sites-available/stylehomes /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # видалити default

# Перевірка конфігурації
sudo nginx -t

# Перезапуск Nginx
sudo systemctl reload nginx
```

---

## 📦 Крок 6: SSL сертифікат (HTTPS)

```bash
# Отримання SSL сертифіката від Let's Encrypt
sudo certbot --nginx -d stylehomesusa.com -d www.stylehomesusa.com

# Автоматичне оновлення
sudo systemctl enable certbot.timer
```

---

## 📦 Крок 7: Firewall

```bash
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw enable
sudo ufw status
```

---

## 📧 Налаштування Email (iCloud)

### Крок 1: Створити App-Specific Password

1. Зайдіть на https://appleid.apple.com
2. **Sign-In and Security** → **App-Specific Passwords**
3. Натисніть **+** і створіть пароль для "Style Homes Website"
4. Скопіюйте пароль (він покажеться один раз!)

### Крок 2: Оновіть `.env` файл

```env
MAIL_HOST=smtp.mail.me.com
MAIL_PORT=587
MAIL_USERNAME=stylehomesusa@icloud.com
MAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx    # App-Specific Password
MAIL_FROM=stylehomesusa@icloud.com
ADMIN_EMAIL=stylehomesusa@icloud.com
```

### Альтернатива: Gmail

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your.email@gmail.com
MAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx    # App Password
```

---

## 🔧 Оновлення Frontend URL для бекенду

Перед білдом фронтенду, оновіть URL бекенду:

**Варіант 1: Через window.BACKEND_URL**

Додайте в `index.html` перед закриваючим `</head>`:
```html
<script>
  window.BACKEND_URL = '';  // Порожній = той самий домен (через Nginx proxy)
</script>
```

**Варіант 2: Напряму в коді** (якщо не використовуєте proxy)

В `src/modules/form.ts` змініть:
```typescript
const backendUrl = (window as any).BACKEND_URL || '';  // Порожній для proxy
```

> 💡 **Рекомендація**: Використовуйте Nginx proxy (як в конфігурації вище), тоді фронтенд звертається до `/api/...` на тому ж домені.

---

## ✅ Перевірка деплою

### 1. Перевірка бекенду:
```bash
curl http://localhost:8080/api/consultations
# Має повернути [] або список заявок
```

### 2. Перевірка через Nginx:
```bash
curl https://stylehomesusa.com/api/consultations
```

### 3. Тест форми:
```bash
curl -X POST https://stylehomesusa.com/api/consultations \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "email": "test@example.com",
    "projectDetails": "Test message"
  }'
```

### 4. Перевірка логів:
```bash
sudo journalctl -u stylehomes -f
```

---

## 🔄 Оновлення сайту

### Frontend:
```bash
cd /tmp
git pull
npm install
npm run build
cp -r dist/* /var/www/stylehomes/
```

### Backend:
```bash
cd /tmp/backend
git pull
mvn clean package -DskipTests
sudo systemctl stop stylehomes
cp target/stylehome-backend-1.0.0.jar /opt/stylehomes/
sudo systemctl start stylehomes
```

---

## 🆘 Troubleshooting

### Бекенд не запускається:
```bash
sudo journalctl -u stylehomes -n 100 --no-pager
```

### Email не відправляється:
1. Перевірте App-Specific Password
2. Перевірте логи: `sudo journalctl -u stylehomes | grep -i mail`
3. Тест з'єднання: `telnet smtp.mail.me.com 587`

### 502 Bad Gateway:
```bash
# Перевірте чи бекенд працює
curl http://localhost:8080/api/consultations
sudo systemctl status stylehomes
```

### Форма не відправляється:
1. Відкрийте DevTools → Network
2. Подивіться статус POST запиту
3. Перевірте CORS налаштування в `.env`

---

## 📁 Структура файлів на VPS

```
/var/www/stylehomes/          # Frontend (static)
├── index.html
├── assets/
│   ├── entry-xxx.js
│   ├── entry-xxx.css
│   └── images/
├── kitchen-renovation.html
├── bathroom-renovation.html
└── ...

/opt/stylehomes/              # Backend
├── stylehome-backend-1.0.0.jar
└── .env                      # Environment variables

/etc/nginx/sites-available/   # Nginx config
└── stylehomes

/etc/systemd/system/          # Systemd service
└── stylehomes.service
```

---

## 📞 Контакти для питань

Якщо виникли проблеми з деплоєм - зверніться до розробника.
