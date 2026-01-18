#!/usr/bin/env python3
"""
Скрипт для аналізу структури сторінки panel-decor
"""

import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def analyze_structure():
    """Аналізує структуру сторінки"""
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
        
        print("\n" + "="*60)
        print("ANALYZING PAGE STRUCTURE")
        print("="*60)
        
        # Шукаємо всі елементи з comp-mfqwt4ma__item
        print("\n1. Elements with comp-mfqwt4ma__item:")
        items = driver.find_elements(By.CSS_SELECTOR, '[id*="comp-mfqwt4ma__item"]')
        print(f"   Found {len(items)} items")
        
        for i, item in enumerate(items[:15], 1):  # Перші 15 для прикладу
            item_id = item.get_attribute('id')
            try:
                # Перевіряємо, чи є зображення
                imgs = item.find_elements(By.TAG_NAME, 'img')
                img_count = len([img for img in imgs if img.get_attribute('src') and 'wixstatic' in img.get_attribute('src')])
                
                # Перевіряємо, чи є текст
                text = item.text.strip()[:100] if item.text else ""
                
                # Перевіряємо, чи є карусель
                gallery_counter = item.find_elements(By.CSS_SELECTOR, '[data-testid="gallery-counter"]')
                next_button = item.find_elements(By.CSS_SELECTOR, 'button[data-testid="gallery-nextButton"]')
                
                print(f"   Item {i}: {item_id}")
                print(f"      Images: {img_count}, Text: {len(text)} chars, Gallery: {len(gallery_counter)}, Next button: {len(next_button)}")
                if text:
                    print(f"      Text preview: {text}")
            except Exception as e:
                print(f"   Item {i}: Error - {e}")
        
        # Шукаємо секції з заголовками
        print("\n2. Section headings:")
        headings = driver.find_elements(By.CSS_SELECTOR, 'h1, h2, h3, h4, h5, h6')
        for heading in headings[:20]:
            text = heading.text.strip()
            if text and len(text) > 10:
                print(f"   {heading.tag_name}: {text}")
        
        # Шукаємо контейнери з класом uYj0Sg
        print("\n3. Containers with class uYj0Sg:")
        containers = driver.find_elements(By.CSS_SELECTOR, 'div.uYj0Sg, div[class*="uYj0Sg"]')
        print(f"   Found {len(containers)} containers")
        
        for i, container in enumerate(containers[:5], 1):
            container_id = container.get_attribute('id') or 'no-id'
            container_class = container.get_attribute('class') or 'no-class'
            items_inside = container.find_elements(By.CSS_SELECTOR, '[id*="comp-mfqwt4ma__item"]')
            print(f"   Container {i}: id={container_id[:50]}, items={len(items_inside)}")
            print(f"      class={container_class[:100]}")
        
        # Шукаємо repeater елементи
        print("\n4. Repeater elements:")
        repeaters = driver.find_elements(By.CSS_SELECTOR, 'fluid-columns-repeater, [class*="repeater"]')
        print(f"   Found {len(repeaters)} repeaters")
        
        for i, repeater in enumerate(repeaters, 1):
            repeater_id = repeater.get_attribute('id') or 'no-id'
            items_inside = repeater.find_elements(By.CSS_SELECTOR, '[id*="comp-mfqwt4ma__item"]')
            print(f"   Repeater {i}: id={repeater_id}, items={len(items_inside)}")
        
        # Шукаємо всі елементи з data-testid
        print("\n5. Elements with data-testid:")
        testid_elements = driver.find_elements(By.CSS_SELECTOR, '[data-testid]')
        testid_counts = {}
        for el in testid_elements:
            testid = el.get_attribute('data-testid')
            testid_counts[testid] = testid_counts.get(testid, 0) + 1
        
        for testid, count in sorted(testid_counts.items()):
            print(f"   {testid}: {count}")
        
        # Шукаємо структуру з Pn компонентами
        print("\n6. Pn components (React components):")
        pn_elements = driver.find_elements(By.CSS_SELECTOR, 'Pn, [class*="Pn"]')
        print(f"   Found {len(pn_elements)} Pn elements")
        
        # Шукаємо елементи з containerId
        print("\n7. Elements with containerId attribute:")
        container_id_elements = driver.find_elements(By.XPATH, '//*[@containerId]')
        print(f"   Found {len(container_id_elements)} elements with containerId")
        
        for i, el in enumerate(container_id_elements[:12], 1):
            container_id = el.get_attribute('containerId')
            el_id = el.get_attribute('id') or 'no-id'
            print(f"   Element {i}: containerId={container_id}, id={el_id}")
        
        # Шукаємо реальні проекти з контентом
        print("\n8. Real project items (with images and text):")
        all_items = driver.find_elements(By.CSS_SELECTOR, '[id*="comp-mfqwt4ma__item"]')
        real_projects = []
        
        for item in all_items:
            try:
                # Перевіряємо наявність зображень
                imgs = item.find_elements(By.CSS_SELECTOR, 'img[src*="wixstatic"]')
                has_images = len(imgs) > 0
                
                # Перевіряємо наявність тексту (не просто порожній)
                text = item.text.strip()
                has_text = len(text) > 50  # Мінімум 50 символів
                
                # Перевіряємо наявність заголовків
                headings = item.find_elements(By.CSS_SELECTOR, 'h1, h2, h3, h4, h5, h6')
                has_heading = len(headings) > 0
                
                if has_images or (has_text and has_heading):
                    item_id = item.get_attribute('id')
                    title = headings[0].text.strip() if headings else "No title"
                    real_projects.append({
                        'id': item_id,
                        'title': title,
                        'images': len(imgs),
                        'text_length': len(text)
                    })
            except:
                pass
        
        print(f"   Found {len(real_projects)} real projects:")
        for i, proj in enumerate(real_projects, 1):
            print(f"   Project {i}: {proj['title'][:50]}")
            print(f"      ID: {proj['id']}, Images: {proj['images']}, Text: {proj['text_length']} chars")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if driver:
            input("\nPress Enter to close browser...")
            driver.quit()

if __name__ == '__main__':
    analyze_structure()

