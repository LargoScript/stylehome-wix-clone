#!/usr/bin/env python3
"""
Скрипт для пошуку всіх сторінок з проектами на сайті
"""

import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def find_project_pages():
    """Знаходить всі сторінки з проектами на сайті"""
    url = "https://www.stylehomesusa.com"
    
    chrome_options = Options()
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--window-size=1920,1080')
    
    driver = None
    try:
        print("Opening main page...")
        driver = webdriver.Chrome(options=chrome_options)
        driver.get(url)
        
        print("Waiting for page to load...")
        time.sleep(5)
        
        print("Scrolling page...")
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(3)
        
        # Шукаємо елемент з класом uYj0Sg wixui-box
        print("\nLooking for container with class 'uYj0Sg wixui-box'...")
        containers = driver.find_elements(By.CSS_SELECTOR, 'div.uYj0Sg.wixui-box, div[class*="uYj0Sg"][class*="wixui-box"]')
        
        if not containers:
            # Спробуємо знайти за data-testid
            containers = driver.find_elements(By.CSS_SELECTOR, 'div[data-testid="container-bg"]')
        
        print(f"Found {len(containers)} containers")
        
        all_links = set()
        
        for container in containers:
            # Шукаємо всі посилання в контейнері
            links = container.find_elements(By.TAG_NAME, 'a')
            for link in links:
                href = link.get_attribute('href')
                if href and 'stylehomesusa.com' in href and href not in all_links:
                    text = link.text.strip()
                    all_links.add((href, text))
                    print(f"  Found link: {text} -> {href}")
        
        # Також шукаємо в навігації
        print("\nLooking in navigation...")
        nav_links = driver.find_elements(By.CSS_SELECTOR, 'nav a, header a, .header a')
        for link in nav_links:
            href = link.get_attribute('href')
            if href and 'stylehomesusa.com' in href and '/kitchen-renovation' not in href and '/bathroom-renovation' not in href:
                text = link.text.strip()
                if text and href not in [l[0] for l in all_links]:
                    all_links.add((href, text))
                    print(f"  Found nav link: {text} -> {href}")
        
        print(f"\n{'='*60}")
        print("ALL FOUND LINKS:")
        print('='*60)
        for href, text in sorted(all_links):
            print(f"{text:30} -> {href}")
        
        # Фільтруємо тільки сторінки з проектами (не головну, не контакти)
        project_pages = []
        exclude = ['/', '/contact', '/about', '/home', '/services', '/testimonials', '#']
        
        for href, text in all_links:
            if any(ex in href for ex in exclude):
                continue
            if '/kitchen-renovation' in href or '/bathroom-renovation' in href:
                continue
            if href.count('/') >= 2:  # Має бути підсторінка
                project_pages.append((href, text))
        
        print(f"\n{'='*60}")
        print("PROJECT PAGES (excluding kitchen and bathroom):")
        print('='*60)
        for href, text in project_pages:
            print(f"{text:30} -> {href}")
        
        return project_pages
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return []
    finally:
        if driver:
            driver.quit()
            print("\nBrowser closed")

if __name__ == '__main__':
    find_project_pages()

