# 🚀 Швидкий деплой на VPS

## Один рядок команди:

```bash
ssh deploy@31.131.21.16 'wget -O - https://raw.githubusercontent.com/LargoScript/stylehome-wix-clone/main/stylehome_new/deploy-vps.sh | bash'
```

**Пароль:** `deploy2`

---

## Або покроково:

```bash
# 1. Підключитися
ssh deploy@31.131.21.16
# Password: deploy2

# 2. Завантажити скрипт
wget https://raw.githubusercontent.com/LargoScript/stylehome-wix-clone/main/stylehome_new/deploy-vps.sh

# 3. Дозволити виконання
chmod +x deploy-vps.sh

# 4. Запустити
bash deploy-vps.sh
```

---

## Після деплою:

### 1. Оновити email налаштування:

```bash
sudo nano /opt/stylehomes/.env
```

**Оновити:**
- `MAIL_PASSWORD` - App-Specific Password від iCloud
- `CORS_ORIGINS` - ваш домен

### 2. Оновити домен в Nginx:

```bash
sudo nano /etc/nginx/sites-available/stylehomes
```

Замінити `server_name _;` на:
```nginx
server_name stylehomesusa.com www.stylehomesusa.com;
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 3. SSL сертифікат:

```bash
sudo certbot --nginx -d stylehomesusa.com -d www.stylehomesusa.com
```

---

## Перевірка:

```bash
# Статус
sudo systemctl status stylehomes
sudo systemctl status nginx

# Логи
sudo journalctl -u stylehomes -f

# Тест API
curl http://localhost:8080/api/consultations
```
