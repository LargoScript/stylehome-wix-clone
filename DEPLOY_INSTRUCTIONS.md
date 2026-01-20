# 🚀 VPS Deployment Instructions

## Швидкий старт

### Крок 1: Підключення до VPS

```bash
ssh deploy@31.131.21.16
# Password: deploy2
```

### Крок 2: Завантаження та запуск скрипту

```bash
# Завантажити скрипт на сервер
# Варіант 1: Через wget (з GitHub)
wget https://raw.githubusercontent.com/LargoScript/stylehome-wix-clone/main/deploy-vps.sh

# Варіант 2: Через SCP (з локальної машини)
# На локальній машині:
scp deploy-vps.sh deploy@31.131.21.16:~/

# На сервері:
chmod +x deploy-vps.sh
bash deploy-vps.sh
```

### Крок 3: Налаштування після деплою

#### 3.1 Оновити email налаштування

```bash
sudo nano /opt/stylehomes/.env
```

**Оновити:**
- `MAIL_PASSWORD` - App-Specific Password від iCloud
- `CORS_ORIGINS` - ваш домен (наприклад: `https://stylehomesusa.com,https://www.stylehomesusa.com`)

#### 3.2 Оновити Nginx конфігурацію з доменом

```bash
sudo nano /etc/nginx/sites-available/stylehomes
```

**Замінити:**
```nginx
server_name _;  # Замінити на:
server_name stylehomesusa.com www.stylehomesusa.com;
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```

#### 3.3 Отримати SSL сертифікат

```bash
sudo certbot --nginx -d stylehomesusa.com -d www.stylehomesusa.com
```

---

## 📧 Налаштування Email (iCloud)

### Створення App-Specific Password

1. Зайдіть на https://appleid.apple.com
2. **Sign-In and Security** → **App-Specific Passwords**
3. Натисніть **+** → "Style Homes Website"
4. Скопіюйте пароль (показується один раз!)

### Оновлення .env файлу

```bash
sudo nano /opt/stylehomes/.env
```

Встановіть:
```env
MAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx  # Ваш App-Specific Password
```

Перезапустіть сервіс:
```bash
sudo systemctl restart stylehomes
```

---

## ✅ Перевірка роботи

### Перевірка бекенду:

```bash
# Статус сервісу
sudo systemctl status stylehomes

# Логи
sudo journalctl -u stylehomes -f

# Тест API
curl http://localhost:8080/api/consultations
```

### Перевірка фронтенду:

```bash
# Перевірка файлів
ls -la /var/www/stylehomes/

# Перевірка Nginx
sudo nginx -t
sudo systemctl status nginx
```

### Тест форми:

Відкрийте сайт в браузері і спробуйте відправити тестову форму.

---

## 🔧 Корисні команди

### Перезапуск сервісів:

```bash
sudo systemctl restart stylehomes  # Backend
sudo systemctl reload nginx        # Nginx
```

### Перегляд логів:

```bash
# Backend логи
sudo journalctl -u stylehomes -n 100 --no-pager
sudo journalctl -u stylehomes -f

# Nginx логи
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Оновлення коду:

```bash
# Frontend
cd /tmp/stylehome-wix-clone
git pull
npm install
npm run build
sudo cp -r dist/* /var/www/stylehomes/
sudo chown -R www-data:www-data /var/www/stylehomes

# Backend
cd /tmp/stylehome-wix-clone/backend
git pull
mvn clean package -DskipTests
sudo systemctl stop stylehomes
sudo cp target/stylehome-backend-1.0.0.jar /opt/stylehomes/
sudo systemctl start stylehomes
```

---

## 🆘 Troubleshooting

### Бекенд не запускається:

```bash
# Перевірка логів
sudo journalctl -u stylehomes -n 50

# Перевірка Java
java -version  # Має бути 17+

# Перевірка .env файлу
sudo cat /opt/stylehomes/.env
```

### Email не відправляється:

1. Перевірте App-Specific Password
2. Перевірте логи: `sudo journalctl -u stylehomes | grep -i mail`
3. Тест з'єднання: `telnet smtp.mail.me.com 587`

### 502 Bad Gateway:

```bash
# Перевірка чи бекенд працює
curl http://localhost:8080/api/consultations

# Перевірка статусу
sudo systemctl status stylehomes
```

### Форма не відправляється:

1. Відкрийте DevTools → Network
2. Подивіться статус POST запиту
3. Перевірте CORS в `.env` файлі

---

## 📁 Структура файлів

```
/var/www/stylehomes/          # Frontend (static files)
├── index.html
├── assets/
└── ...

/opt/stylehomes/              # Backend
├── stylehome-backend-1.0.0.jar
└── .env                      # Environment variables

/etc/nginx/sites-available/  # Nginx config
└── stylehomes

/etc/systemd/system/          # Systemd service
└── stylehomes.service
```

---

## 🔐 Безпека

### Рекомендації:

1. **Не зберігайте паролі в скриптах**
2. **Обмежте доступ до .env файлу**: `sudo chmod 600 /opt/stylehomes/.env`
3. **Оновлюйте систему регулярно**: `sudo apt update && sudo apt upgrade`
4. **Налаштуйте fail2ban** для захисту від брутфорсу
5. **Регулярно робіть backup бази даних**

---

## 📞 Підтримка

Якщо виникли проблеми - перевірте логи і зверніться до розробника.
