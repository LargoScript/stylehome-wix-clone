#!/usr/bin/env python3
"""
Скрипт для витягування фотографій та описів проектів з однієї сторінки
Використовує кнопку Next для перегортання всіх фото в галереї
"""

import json
import re
import sys
import time
from datetime import datetime

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.options import Options
    from selenium.common.exceptions import TimeoutException, NoSuchElementException
except ImportError:
    print("Error: Need to install dependencies:")
    print("pip install selenium")
    exit(1)


def get_original_image_url(url: str) -> str:
    """Gets original image URL without resize parameters"""
    if not url:
        return None
    
    if '/v1/fill' in url:
        url = url.split('/v1/fill')[0]
    
    if not url.endswith('.jpg') and not url.endswith('.png'):
        url = re.sub(r'~mv2.*$', '~mv2.jpg', url)
    
    return url


def find_hero_image(driver, page_name: str):
    """Знаходить фото для hero секції на сторінці"""
    try:
        # Спочатку шукаємо в hero секціях
        hero_selectors = [
            'section[class*="hero"] img',
            'div[class*="hero"] img',
            'section[id*="hero"] img',
            'div[id*="hero"] img',
            'img[alt*="hero"]',
            'img[alt*="Hero"]',
        ]
        
        hero_image = None
        
        # Шукаємо в hero секціях
        for selector in hero_selectors:
            try:
                hero_imgs = driver.find_elements(By.CSS_SELECTOR, selector)
                for img in hero_imgs:
                    src = img.get_attribute('src') or img.get_attribute('data-src')
                    if src and 'wixstatic' in src:
                        original_url = get_original_image_url(src)
                        if original_url:
                            hero_image = {
                                'url': original_url,
                                'alt': img.get_attribute('alt') or f'{page_name} Hero',
                                'currentSrc': src
                            }
                            break
                if hero_image:
                    break
            except:
                continue
        
        # Якщо не знайшли в hero, шукаємо великі зображення на початку сторінки
        if not hero_image:
            all_images = driver.find_elements(By.TAG_NAME, 'img')
            max_size = 0
            candidate = None
            
            for img in all_images:
                try:
                    src = img.get_attribute('src') or img.get_attribute('data-src')
                    if not src or 'wixstatic' not in src:
                        continue
                    
                    # Перевіряємо розмір зображення
                    width = img.get_attribute('width')
                    height = img.get_attribute('height')
                    
                    if width and height:
                        try:
                            size = int(width) * int(height)
                            if size > max_size and size > 100000:  # Мінімальний розмір для hero
                                max_size = size
                                original_url = get_original_image_url(src)
                                if original_url:
                                    candidate = {
                                        'url': original_url,
                                        'alt': img.get_attribute('alt') or f'{page_name} Hero',
                                        'width': width,
                                        'height': height,
                                        'currentSrc': src
                                    }
                        except ValueError:
                            continue
                except:
                    continue
            
            if candidate:
                hero_image = candidate
        
        return hero_image
    except Exception as e:
        print(f"    Error finding hero image: {e}")
        return None


def extract_all_gallery_images_by_clicking(driver, project_item, project_num: int):
    """Extracts all images by clicking Next button"""
    image_urls = []
    seen_urls = set()
    
    # Зберігаємо ID елемента для перешукування
    project_id = None
    try:
        project_id = project_item.get_attribute('id')
    except:
        pass
    
    # Find gallery counter to know total photos
    total_photos = 0
    try:
        gallery_counter = project_item.find_element(By.CSS_SELECTOR, '[data-testid="gallery-counter"]')
        counter_text = gallery_counter.text.strip()
        if counter_text:
            match = re.search(r'\d+/(\d+)', counter_text)
            if match:
                total_photos = int(match.group(1))
        print(f"    Gallery counter shows: {total_photos} photos")
    except:
        print("    Gallery counter not found")
    
    # Find Next button
    next_button = None
    try:
        next_button = project_item.find_element(By.CSS_SELECTOR, 'button[data-testid="gallery-nextButton"]')
    except:
        print("    Next button not found")
    
    # Click through all photos
    max_clicks = max(total_photos, 10) if total_photos > 0 else 10
    for click_num in range(max_clicks):
        # Wait for images to load
        time.sleep(0.8)
        
        # Перешукуємо project_item перед використанням
        try:
            if project_id:
                project_item = driver.find_element(By.ID, project_id)
            else:
                # Якщо немає ID, шукаємо за індексом
                # Збираємо всі проекти з усіх секцій
                all_project_items = []
                for selector in [
                    '[id^="comp-mfqwrx08__item"]', 
                    '[id^="comp-mfqwt4me__item"]', 
                    '[id^="comp-mfr6tkk31__item"]', 
                    '[id^="comp-mfr6tmmo3__item"]',
                    '[id^="comp-mfqwt4ma__item"]', 
                    '[id*="comp-"][id*="__item"]', 
                    '[id*="__item"]'
                ]:
                    try:
                        items = driver.find_elements(By.CSS_SELECTOR, selector)
                        # Фільтруємо технічні елементи
                        for item in items:
                            item_id = item.get_attribute('id') or ''
                            if not (item_id.startswith('bgLayers_') or item_id.startswith('bgMedia_')):
                                all_project_items.append(item)
                    except:
                        continue
                
                if all_project_items and project_num <= len(all_project_items):
                    project_item = all_project_items[project_num - 1]
        except:
            print(f"    Warning: Could not refresh project item")
            break
        
        # Find all current images
        try:
            images = project_item.find_elements(By.CSS_SELECTOR, 'img[src*="wixstatic"], img[src*="static.wixstatic"]')
        except:
            print(f"    Warning: Could not find images")
            break
        
        # Extract image URLs
        for img in images:
            try:
                src = img.get_attribute('src') or img.get_attribute('data-src')
                if src and 'wixstatic' in src:
                    original_url = get_original_image_url(src)
                    if original_url and original_url not in seen_urls:
                        seen_urls.add(original_url)
                        alt = img.get_attribute('alt') or ''
                        image_urls.append({
                            'index': len(image_urls) + 1,
                            'url': original_url,
                            'alt': alt,
                            'currentSrc': src
                        })
            except:
                pass
        
        # Check current counter
        try:
            current_counter = project_item.find_element(By.CSS_SELECTOR, '[data-testid="gallery-counter"]')
            current_text = current_counter.text.strip()
            match = re.search(r'(\d+)/(\d+)', current_text)
            if match:
                current = int(match.group(1))
                total = int(match.group(2))
                print(f"    Current: {current}/{total}, Found images: {len(image_urls)}")
                
                # If we're at the last photo, stop
                if current >= total:
                    break
        except:
            pass
        
        # Click Next button if available
        if next_button and click_num < total_photos - 1:
            try:
                # Перешукуємо кнопку перед кліком
                try:
                    if project_id:
                        project_item_refresh = driver.find_element(By.ID, project_id)
                        next_button = project_item_refresh.find_element(By.CSS_SELECTOR, 'button[data-testid="gallery-nextButton"]')
                except:
                    pass
                
                # Scroll button into view
                driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", next_button)
                time.sleep(0.3)
                
                # Click using JavaScript
                driver.execute_script("arguments[0].click();", next_button)
                print(f"    Clicked Next button ({click_num + 1}/{total_photos - 1})")
                time.sleep(0.5)
            except Exception as e:
                print(f"    Error clicking Next: {e}")
                break
        else:
            if click_num >= total_photos - 1:
                break
    
    return image_urls


def extract_projects_from_page(driver, url: str, page_name: str):
    """Extracts all projects from a single page"""
    print(f"\n{'='*60}")
    print(f"Processing page: {page_name}")
    print(f"URL: {url}")
    print('='*60)
    
    try:
        driver.get(url)
        print("Waiting for page to load...")
        time.sleep(5)
        
        print("Scrolling page to load all content...")
        # Прокручуємо кілька разів для завантаження всього контенту
        for i in range(3):
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
            # Прокручуємо назад трохи і знову вниз
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight * 0.7);")
            time.sleep(1)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(3)
        
        # Find hero image
        print("Looking for hero image...")
        hero_image = find_hero_image(driver, page_name)
        if hero_image:
            print(f"  Found hero image: {hero_image['url']}")
        else:
            print("  Hero image not found")
        
        # Find the projects container
        try:
            projects_container = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "fluid-columns-repeater.GPmm8Z"))
            )
        except TimeoutException:
            print("Warning: Projects container not found, trying alternative selectors...")
            # Try alternative selectors
            projects_container = None
            for selector in [
                'fluid-columns-repeater',
                '[class*="repeater"]',
                '[id*="repeater"]',
                'section[class*="projects"]',
                'div[class*="projects"]'
            ]:
                try:
                    projects_container = driver.find_element(By.CSS_SELECTOR, selector)
                    if projects_container:
                        break
                except:
                    continue
        
        if not projects_container:
            print("Error: Projects container not found")
            return {
                'pageName': page_name,
                'url': url,
                'heroImage': hero_image,
                'projects': [],
                'error': 'Projects container not found'
            }
        
        # Find all project items - автоматично знаходимо правильний селектор
        project_items = []
        project_selector = None
        
        # Спочатку прокручуємо до кінця ще раз після завантаження
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
        
        # Спробуємо різні селектори
        selectors_to_try = [
            '[id^="comp-mfqwrx08__item"]',  # Kitchen/Bathroom
            '[id^="comp-mfqwt4me__item"]',  # Panel decor секція 1
            '[id^="comp-mfr6tkk31__item"]',  # Panel decor секція 2
            '[id^="comp-mfr6tmmo3__item"]',  # Panel decor секція 3
            '[id^="comp-mfqwt4ma__item"]',  # Panel decor (старий)
            '[id*="comp-"][id*="__item"]',  # Будь-який comp-*__item
            '[id*="__item"]',  # Будь-який __item
        ]
        
        # Збираємо проекти з усіх секцій одночасно
        all_candidates = []
        found_selectors = []
        
        # Спочатку шукаємо специфічні селектори для panel-decor
        panel_decor_selectors = [
            '[id^="comp-mfqwt4me__item"]',  # Секція 1
            '[id^="comp-mfr6tkk31__item"]',  # Секція 2
            '[id^="comp-mfr6tmmo3__item"]',  # Секція 3
        ]
        
        for selector in panel_decor_selectors:
            try:
                items = driver.find_elements(By.CSS_SELECTOR, selector)
                if items:
                    all_candidates.extend(items)
                    found_selectors.append(selector)
            except:
                continue
        
        # Якщо не знайшли panel-decor проекти, шукаємо інші
        if not all_candidates:
            for selector in selectors_to_try:
                try:
                    items = driver.find_elements(By.CSS_SELECTOR, selector)
                    if len(items) > len(all_candidates):
                        all_candidates = items
                        found_selectors = [selector]
                except:
                    continue
        
        if found_selectors:
            project_selector = ', '.join(found_selectors) if len(found_selectors) > 1 else found_selectors[0]
            print(f"Found projects using selectors: {project_selector}")
        else:
            project_selector = None
        
        # Фільтруємо реальні проекти (не технічні елементи)
        for item in all_candidates:
            item_id = item.get_attribute('id') or ''
            # Пропускаємо технічні елементи (bgLayers_, bgMedia_)
            if item_id.startswith('bgLayers_') or item_id.startswith('bgMedia_'):
                continue
            
            # Перевіряємо, чи є контент (зображення або текст)
            try:
                imgs = item.find_elements(By.CSS_SELECTOR, 'img[src*="wixstatic"]')
                text = item.text.strip()
                
                # Беремо тільки елементи з контентом
                if len(imgs) > 0 or len(text) > 50:
                    project_items.append(item)
            except:
                pass
        
        if not project_items:
            # Якщо не знайшли, спробуємо альтернативні
            project_items = driver.find_elements(By.CSS_SELECTOR, '[class*="project"], [id*="item"]')
            if not project_selector:
                project_selector = '[class*="project"], [id*="item"]'
        
        print(f"Filtered from {len(all_candidates)} to {len(project_items)} real projects")
        print(f"Found {len(project_items)} projects\n")
        
        projects = []
        
        for idx in range(1, len(project_items) + 1):
            print(f"{'='*50}")
            print(f"PROJECT {idx}")
            print('='*50)
            
            try:
                # Перешукуємо елемент перед використанням (щоб уникнути StaleElementReferenceException)
                try:
                    # Використовуємо знайдений селектор і фільтруємо
                    project_items_refreshed = []
                    
                    # Якщо є кілька селекторів (для panel-decor), використовуємо всі
                    if project_selector and ',' in project_selector:
                        # Множинні селектори
                        selectors = [s.strip() for s in project_selector.split(',')]
                    elif project_selector:
                        selectors = [project_selector]
                    else:
                        # Спробуємо всі можливі селектори
                        selectors = [
                            '[id^="comp-mfqwrx08__item"]', 
                            '[id^="comp-mfqwt4me__item"]', 
                            '[id^="comp-mfr6tkk31__item"]', 
                            '[id^="comp-mfr6tmmo3__item"]',
                            '[id^="comp-mfqwt4ma__item"]', 
                            '[id*="comp-"][id*="__item"]', 
                            '[id*="__item"]'
                        ]
                    
                    # Збираємо всі елементи з усіх селекторів
                    all_items = []
                    for selector in selectors:
                        try:
                            items = driver.find_elements(By.CSS_SELECTOR, selector)
                            all_items.extend(items)
                        except:
                            continue
                    
                    # Фільтруємо реальні проекти
                    for item in all_items:
                        item_id = item.get_attribute('id') or ''
                        if item_id.startswith('bgLayers_') or item_id.startswith('bgMedia_'):
                            continue
                        try:
                            imgs = item.find_elements(By.CSS_SELECTOR, 'img[src*="wixstatic"]')
                            text = item.text.strip()
                            if len(imgs) > 0 or len(text) > 50:
                                project_items_refreshed.append(item)
                        except:
                            pass
                    
                    if not project_items_refreshed:
                        project_items_refreshed = driver.find_elements(By.CSS_SELECTOR, '[class*="project"], [id*="item"]')
                    
                    if idx > len(project_items_refreshed):
                        print(f"Project {idx} not found (only {len(project_items_refreshed)} projects available)")
                        continue
                    
                    project_item = project_items_refreshed[idx - 1]
                except:
                    print(f"Error finding project {idx}")
                    continue
                
                # Scroll project into view
                try:
                    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", project_item)
                    time.sleep(2)
                except Exception as scroll_error:
                    print(f"    Warning: Could not scroll to project: {scroll_error}")
                    time.sleep(1)
                
                # Extract all images by clicking through gallery
                print("Extracting images by clicking through gallery...")
                image_urls = extract_all_gallery_images_by_clicking(driver, project_item, idx)
                print(f"Found {len(image_urls)} unique images")
                
                # Find project title
                title = f"Project {idx}"
                title_selectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', '[class*="title"]', '[class*="heading"]']
                for selector in title_selectors:
                    try:
                        title_el = project_item.find_element(By.CSS_SELECTOR, selector)
                        title_text = title_el.text.strip()
                        if title_text and len(title_text) > 3:
                            title = title_text
                            break
                    except:
                        continue
                
                print(f"Title: {title}")
                
                # Find project description
                description = ''
                desc_selectors = ['p', '[class*="description"]', '[class*="text"]', '[class*="content"]']
                description_parts = []
                
                for selector in desc_selectors:
                    try:
                        desc_elements = project_item.find_elements(By.CSS_SELECTOR, selector)
                        for el in desc_elements:
                            text = el.text.strip()
                            if (len(text) > 30 and 
                                not re.match(r'^(Home|Services|Projects|About|Contact)', text, re.I) and
                                not re.match(r'^\d+/\d+$', text) and
                                text not in description_parts):
                                description_parts.append(text)
                    except:
                        continue
                
                description = ' '.join(description_parts).strip()
                
                if description:
                    print(f"Description: {description[:150]}...")
                else:
                    print("Description not found")
                
                # Save project
                project_data = {
                    'projectNumber': idx,
                    'title': title,
                    'description': description,
                    'foundPhotos': len(image_urls),
                    'images': image_urls,
                    'domPath': project_item.get_attribute('id') or f'project-{idx}'
                }
                
                projects.append(project_data)
                print()
                
            except Exception as e:
                print(f"Error processing project {idx}: {e}\n")
                import traceback
                traceback.print_exc()
                continue
        
        return {
            'pageName': page_name,
            'url': url,
            'heroImage': hero_image,
            'totalProjects': len(projects),
            'projects': projects
        }
        
    except Exception as e:
        print(f"Error processing page {page_name}: {e}")
        import traceback
        traceback.print_exc()
        return {
            'pageName': page_name,
            'url': url,
            'heroImage': None,
            'projects': [],
            'error': str(e)
        }


def main():
    # Отримуємо URL з аргументів командного рядка
    if len(sys.argv) < 2:
        print("Usage: python extract_single_page.py <URL> [page_name]")
        print("\nExample:")
        print("  python extract_single_page.py https://www.stylehomesusa.com/kitchen-renovation 'Kitchen Renovation'")
        sys.exit(1)
    
    url = sys.argv[1]
    page_name = sys.argv[2] if len(sys.argv) > 2 else url.split('/')[-1].replace('-', ' ').title()
    
    # Chrome settings
    chrome_options = Options()
    # chrome_options.add_argument('--headless')  # Uncomment for headless mode
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
    
    driver = None
    try:
        print("Starting browser...")
        driver = webdriver.Chrome(options=chrome_options)
        
        # Extract projects
        result = extract_projects_from_page(driver, url, page_name)
        
        if not result.get('projects'):
            print("No projects found!")
            return
        
        # Save to JSON
        page_name_safe = page_name.lower().replace(' ', '-')
        filename = f'{page_name_safe}-projects-extracted-{datetime.now().strftime("%Y-%m-%d")}.json'
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print(f"\n{'='*60}")
        print("SUMMARY")
        print('='*60)
        print(f"Page: {page_name}")
        print(f"Total projects: {result.get('totalProjects', len(result.get('projects', [])))}")
        print(f"Total photos: {sum(p['foundPhotos'] for p in result.get('projects', []))}")
        if result.get('heroImage'):
            print(f"Hero image: Yes")
        else:
            print(f"Hero image: No")
        print(f"\nResult saved to: {filename}")
        
        # Print short overview
        for p in result.get('projects', []):
            print(f"\nProject {p['projectNumber']}: \"{p['title']}\"")
            print(f"  - Photos: {p['foundPhotos']}")
            print(f"  - Description: {'Yes' if p['description'] else 'No'}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if driver:
            driver.quit()
            print("\nBrowser closed")


if __name__ == '__main__':
    main()

