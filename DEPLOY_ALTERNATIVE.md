# 🔄 Альтернативний спосіб деплою

Якщо wget не працює, використайте цей варіант:

## Варіант 1: Клонувати репозиторій і запустити скрипт

```bash
# На VPS сервері
cd ~
git clone https://github.com/LargoScript/stylehome-wix-clone.git
cd stylehome-wix-clone
chmod +x deploy-vps.sh
bash deploy-vps.sh
```

## Варіант 2: Створити файл вручну

```bash
# На VPS сервері
cat > deploy-vps.sh << 'DEPLOYSCRIPT'
#!/bin/bash
# Style Homes VPS Deployment Script
# ... (вміст скрипту)
DEPLOYSCRIPT

chmod +x deploy-vps.sh
bash deploy-vps.sh
```

## Варіант 3: Завантажити через curl з правильним URL

```bash
curl -L https://raw.githubusercontent.com/LargoScript/stylehome-wix-clone/main/deploy-vps.sh -o deploy-vps.sh
chmod +x deploy-vps.sh
bash deploy-vps.sh
```

## Варіант 4: SCP з локальної машини

```bash
# На локальній машині (Windows)
scp deploy-vps.sh deploy@31.131.21.16:~/

# На VPS
ssh deploy@31.131.21.16
chmod +x deploy-vps.sh
bash deploy-vps.sh
```
