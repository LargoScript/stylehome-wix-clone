#!/usr/bin/env python3
"""Завантажує hero image для panel-decor"""

import os
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

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
        print(f"Error downloading {url}: {e}")
        return False

def get_hero_image():
    """Отримує hero image зі сторінки"""
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
        
        # Шукаємо hero image
        hero_selectors = [
            'section[class*="hero"] img',
            'div[class*="hero"] img',
            'section[id*="hero"] img',
            'div[id*="hero"] img',
        ]
        
        hero_url = None
        for selector in hero_selectors:
            try:
                imgs = driver.find_elements(By.CSS_SELECTOR, selector)
                for img in imgs:
                    src = img.get_attribute('src') or img.get_attribute('data-src')
                    if src and 'wixstatic' in src:
                        # Отримуємо оригінальний URL
                        if '/v1/fill' in src:
                            hero_url = src.split('/v1/fill')[0]
                        else:
                            hero_url = src
                        
                        if not hero_url.endswith('.jpg') and not hero_url.endswith('.png'):
                            hero_url = hero_url.replace('~mv2', '~mv2.jpg')
                        
                        print(f"Found hero image: {hero_url}")
                        break
                if hero_url:
                    break
            except:
                continue
        
        if not hero_url:
            # Шукаємо великі зображення на початку сторінки
            all_imgs = driver.find_elements(By.TAG_NAME, 'img')
            for img in all_imgs[:10]:  # Перші 10 зображень
                src = img.get_attribute('src') or img.get_attribute('data-src')
                if src and 'wixstatic' in src:
                    width = img.get_attribute('width')
                    height = img.get_attribute('height')
                    if width and height:
                        try:
                            size = int(width) * int(height)
                            if size > 100000:  # Велике зображення
                                if '/v1/fill' in src:
                                    hero_url = src.split('/v1/fill')[0]
                                else:
                                    hero_url = src
                                
                                if not hero_url.endswith('.jpg') and not hero_url.endswith('.png'):
                                    hero_url = hero_url.replace('~mv2', '~mv2.jpg')
                                
                                print(f"Found large image: {hero_url}")
                                break
                        except:
                            continue
        
        if hero_url:
            # Завантажуємо
            save_path = 'img/wood-and-panel-wall-decor.jpg'
            print(f"Downloading to: {save_path}")
            if download_image(hero_url, save_path):
                print(f"✓ Hero image downloaded successfully")
                return hero_url
            else:
                print(f"✗ Failed to download hero image")
                return None
        else:
            print("Hero image not found")
            return None
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return None
    finally:
        if driver:
            driver.quit()

if __name__ == '__main__':
    get_hero_image()

