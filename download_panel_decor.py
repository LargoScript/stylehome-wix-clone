#!/usr/bin/env python3
"""
Скрипт для завантаження фотографій та витягування текстів зі сторінки panel-decor
"""

import json
import os
import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def download_image(url, save_path):
    """Завантажує зображення"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        with open(save_path, 'wb') as f:
            f.write(response.content)
        
        return True
    except Exception as e:
        print(f"    Error downloading {url}: {e}")
        return False

def extract_panel_decor_data():
    """Витягує дані зі сторінки panel-decor"""
    url = "https://www.stylehomesusa.com/panel-decor"
    
    chrome_options = Options()
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--window-size=1920,1080')
    
    driver = None
    try:
        print("Opening page...")
        driver = webdriver.Chrome(options=chrome_options)
        driver.get(url)
        
        print("Waiting for page to load...")
        time.sleep(5)
        
        print("Scrolling page...")
        for i in range(3):
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
        
        # Знаходимо всі проекти з трьох секцій
        projects = []
        
        # Секція 1: comp-mfqwt4me__item
        # Секція 2: comp-mfr6tkk31__item
        # Секція 3: comp-mfr6tmmo3__item
        
        selectors = [
            '[id^="comp-mfqwt4me__item"]',
            '[id^="comp-mfr6tkk31__item"]',
            '[id^="comp-mfr6tmmo3__item"]',
        ]
        
        all_items = []
        for selector in selectors:
            items = driver.find_elements(By.CSS_SELECTOR, selector)
            for item in items:
                item_id = item.get_attribute('id') or ''
                # Пропускаємо технічні елементи
                if item_id.startswith('bgLayers_') or item_id.startswith('bgMedia_'):
                    continue
                all_items.append(item)
        
        print(f"Found {len(all_items)} project items")
        
        # Витягуємо дані з кожного проекту
        for idx, item in enumerate(all_items, 1):
            print(f"\n{'='*50}")
            print(f"PROJECT {idx}")
            print('='*50)
            
            try:
                # Прокручуємо до елемента
                driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", item)
                time.sleep(1)
                
                # Знаходимо заголовок
                title = f"Project {idx}"
                title_selectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
                for selector in title_selectors:
                    try:
                        title_el = item.find_element(By.CSS_SELECTOR, selector)
                        title_text = title_el.text.strip()
                        if title_text and len(title_text) > 3:
                            title = title_text
                            break
                    except:
                        continue
                
                print(f"Title: {title}")
                
                # Знаходимо опис
                description = ''
                desc_selectors = ['p', '[class*="description"]', '[class*="text"]', '[class*="content"]']
                description_parts = []
                
                for selector in desc_selectors:
                    try:
                        desc_elements = item.find_elements(By.CSS_SELECTOR, selector)
                        for el in desc_elements:
                            text = el.text.strip()
                            if (len(text) > 30 and 
                                not text.startswith('Home') and
                                not text.startswith('Services') and
                                not text.startswith('Projects') and
                                not text.startswith('About') and
                                not text.startswith('Contact') and
                                not text.startswith('Get') and
                                not text.startswith('Fill') and
                                not text.startswith('Thanks') and
                                text not in description_parts):
                                description_parts.append(text)
                    except:
                        continue
                
                description = ' '.join(description_parts).strip()
                
                if description:
                    print(f"Description: {description[:150]}...")
                else:
                    print("Description not found")
                
                # Знаходимо зображення
                images = []
                img_elements = item.find_elements(By.CSS_SELECTOR, 'img[src*="wixstatic"], img[src*="static.wixstatic"]')
                
                for img in img_elements:
                    src = img.get_attribute('src') or img.get_attribute('data-src')
                    if src and 'wixstatic' in src:
                        # Отримуємо оригінальний URL
                        if '/v1/fill' in src:
                            original_url = src.split('/v1/fill')[0]
                        else:
                            original_url = src
                        
                        if not original_url.endswith('.jpg') and not original_url.endswith('.png'):
                            original_url = original_url.replace('~mv2', '~mv2.jpg')
                        
                        alt = img.get_attribute('alt') or ''
                        images.append({
                            'url': original_url,
                            'alt': alt,
                            'currentSrc': src
                        })
                
                print(f"Found {len(images)} images")
                
                # Завантажуємо зображення
                project_dir = f'downloaded_images/wood-and-panel-wall-decor/projects/project{idx:02d}_{title.replace("/", "_").replace("\\", "_")}'
                os.makedirs(project_dir, exist_ok=True)
                
                for img_idx, img_data in enumerate(images, 1):
                    img_url = img_data['url']
                    img_alt = img_data['alt'] or f'image_{img_idx}'
                    
                    # Створюємо ім'я файлу
                    if img_alt.endswith(('.jpg', '.jpeg', '.png')):
                        filename = img_alt
                    else:
                        filename = f'{img_alt}.jpg'
                    
                    filename = filename.replace('/', '_').replace('\\', '_')
                    save_path = os.path.join(project_dir, filename)
                    
                    print(f"  Downloading image {img_idx}: {filename}")
                    if download_image(img_url, save_path):
                        print(f"    ✓ Downloaded")
                    else:
                        print(f"    ✗ Failed")
                
                projects.append({
                    'projectNumber': idx,
                    'title': title,
                    'description': description,
                    'foundPhotos': len(images),
                    'images': images
                })
                
            except Exception as e:
                print(f"Error processing project {idx}: {e}")
                import traceback
                traceback.print_exc()
                continue
        
        # Зберігаємо JSON
        result = {
            'pageName': 'Wood and Panel Wall Decor',
            'url': url,
            'totalProjects': len(projects),
            'projects': projects
        }
        
        filename = 'wood-and-panel-wall-decor-projects-extracted-2026-01-18.json'
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print(f"\n{'='*60}")
        print("SUMMARY")
        print('='*60)
        print(f"Total projects: {len(projects)}")
        print(f"Total photos: {sum(p['foundPhotos'] for p in projects)}")
        print(f"Result saved to: {filename}")
        
        return result
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return None
    finally:
        if driver:
            driver.quit()
            print("\nBrowser closed")

if __name__ == '__main__':
    extract_panel_decor_data()

