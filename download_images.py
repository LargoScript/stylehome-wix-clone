#!/usr/bin/env python3
"""
Скрипт для завантаження всіх зображень з витягнутих проектів
"""

import json
import os
import sys
import time
from pathlib import Path
from urllib.parse import urlparse
import requests
from datetime import datetime

def sanitize_filename(filename):
    """Очищає ім'я файлу від небезпечних символів"""
    # Замінюємо небезпечні символи
    filename = filename.replace('/', '_').replace('\\', '_')
    filename = filename.replace(':', '_').replace('*', '_')
    filename = filename.replace('?', '_').replace('"', '_')
    filename = filename.replace('<', '_').replace('>', '_')
    filename = filename.replace('|', '_')
    return filename

def get_filename_from_url(url, alt_text=None):
    """Отримує ім'я файлу з URL або alt тексту"""
    if alt_text:
        # Використовуємо alt текст якщо він є
        filename = alt_text
        if not filename.endswith(('.jpg', '.jpeg', '.png', '.webp', '.avif')):
            filename += '.jpg'
        return sanitize_filename(filename)
    
    # Якщо немає alt, беремо з URL
    parsed = urlparse(url)
    path = parsed.path
    filename = os.path.basename(path)
    
    # Якщо немає розширення, додаємо .jpg
    if '.' not in filename or not filename.split('.')[-1].lower() in ['jpg', 'jpeg', 'png', 'webp', 'avif']:
        filename += '.jpg'
    
    return sanitize_filename(filename)

def download_image(url, save_path, max_retries=3):
    """Завантажує зображення з URL"""
    for attempt in range(max_retries):
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            # Створюємо директорію якщо не існує
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            
            # Зберігаємо файл
            with open(save_path, 'wb') as f:
                f.write(response.content)
            
            return True
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"    Retry {attempt + 1}/{max_retries} for {url}")
                time.sleep(1)
            else:
                print(f"    Error downloading {url}: {e}")
                return False
    return False

def process_json_file(json_path, output_base_dir='downloaded_images'):
    """Обробляє один JSON файл і завантажує всі зображення"""
    print(f"\n{'='*60}")
    print(f"Processing: {json_path}")
    print('='*60)
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading JSON file: {e}")
        return
    
    page_name = data.get('pageName', 'unknown')
    page_name_safe = sanitize_filename(page_name.lower().replace(' ', '-'))
    
    # Створюємо структуру папок
    page_dir = os.path.join(output_base_dir, page_name_safe)
    hero_dir = os.path.join(page_dir, 'hero')
    projects_dir = os.path.join(page_dir, 'projects')
    
    os.makedirs(hero_dir, exist_ok=True)
    os.makedirs(projects_dir, exist_ok=True)
    
    total_downloaded = 0
    total_failed = 0
    
    # Завантажуємо hero image
    if data.get('heroImage') and data['heroImage'].get('url'):
        hero_url = data['heroImage']['url']
        hero_alt = data['heroImage'].get('alt', 'hero')
        hero_filename = get_filename_from_url(hero_url, hero_alt)
        hero_path = os.path.join(hero_dir, hero_filename)
        
        print(f"\nDownloading hero image...")
        print(f"  URL: {hero_url}")
        print(f"  Save to: {hero_path}")
        
        if download_image(hero_url, hero_path):
            print(f"  ✓ Downloaded")
            total_downloaded += 1
        else:
            print(f"  ✗ Failed")
            total_failed += 1
    
    # Завантажуємо зображення з проектів
    projects = data.get('projects', [])
    print(f"\nDownloading images from {len(projects)} projects...")
    
    for project in projects:
        project_num = project.get('projectNumber', 0)
        project_title = project.get('title', f'Project {project_num}')
        project_title_safe = sanitize_filename(project_title)
        
        # Створюємо папку для проекту
        project_dir = os.path.join(projects_dir, f"project{project_num:02d}_{project_title_safe}")
        os.makedirs(project_dir, exist_ok=True)
        
        images = project.get('images', [])
        print(f"\n  Project {project_num}: {project_title} ({len(images)} images)")
        
        for img in images:
            img_url = img.get('url')
            if not img_url:
                continue
            
            img_index = img.get('index', 1)
            img_alt = img.get('alt', '')
            img_filename = get_filename_from_url(img_url, img_alt or f'image_{img_index}')
            
            # Якщо файл вже існує, пропускаємо
            img_path = os.path.join(project_dir, img_filename)
            if os.path.exists(img_path):
                print(f"    [{img_index}] ✓ Already exists: {img_filename}")
                total_downloaded += 1
                continue
            
            print(f"    [{img_index}] Downloading: {img_filename}")
            print(f"         URL: {img_url}")
            
            if download_image(img_url, img_path):
                print(f"         ✓ Downloaded")
                total_downloaded += 1
            else:
                print(f"         ✗ Failed")
                total_failed += 1
            
            # Невелика затримка між завантаженнями
            time.sleep(0.5)
    
    print(f"\n{'='*60}")
    print(f"SUMMARY for {page_name}")
    print('='*60)
    print(f"Total downloaded: {total_downloaded}")
    print(f"Total failed: {total_failed}")
    print(f"Images saved to: {page_dir}")

def main():
    """Головна функція"""
    if len(sys.argv) > 1:
        # Якщо передано конкретний файл
        json_files = [sys.argv[1]]
    else:
        # Знаходимо всі JSON файли з проектами
        json_files = [
            'wood-and-panel-wall-decor-projects-extracted-2026-01-18.json',
            'whole-home-transformation-projects-extracted-2026-01-18.json',
            'kitchen-renovation-projects-extracted-2026-01-18.json',
            'bathroom-renovation-projects-extracted-2026-01-18.json',
        ]
        
        # Перевіряємо, які файли існують
        existing_files = [f for f in json_files if os.path.exists(f)]
        if not existing_files:
            print("No JSON files found!")
            return
        
        json_files = existing_files
    
    print("="*60)
    print("IMAGE DOWNLOADER")
    print("="*60)
    print(f"Found {len(json_files)} JSON file(s) to process")
    
    total_downloaded = 0
    total_failed = 0
    
    for json_file in json_files:
        if not os.path.exists(json_file):
            print(f"\nFile not found: {json_file}, skipping...")
            continue
        
        process_json_file(json_file)
    
    print(f"\n{'='*60}")
    print("ALL FILES PROCESSED")
    print('='*60)

if __name__ == '__main__':
    main()

