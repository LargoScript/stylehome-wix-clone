#!/usr/bin/env python3
"""
Фінальний скрипт для витягування фотографій та описів проектів кухонь
Використовує кнопку Next для перегортання всіх фото в галереї
"""

import json
import re
import time
from datetime import datetime

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.options import Options
except ImportError:
    print("Error: Need to install dependencies:")
    print("pip install selenium")
    exit(1)


def get_original_image_url(url):
    """Gets original image URL without resize parameters"""
    if not url:
        return None
    
    if '/v1/fill' in url:
        url = url.split('/v1/fill')[0]
    
    if not url.endswith('.jpg') and not url.endswith('.png'):
        url = re.sub(r'~mv2.*$', '~mv2.jpg', url)
    
    return url


def extract_all_gallery_images_by_clicking(driver, project_item):
    """Extracts all images by clicking Next button"""
    image_urls = []
    seen_urls = set()
    
    # Find gallery counter to know total photos
    try:
        gallery_counter = project_item.find_element(By.CSS_SELECTOR, '[data-testid="gallery-counter"]')
        counter_text = gallery_counter.text.strip()
        total_photos = 0
        if counter_text:
            match = re.search(r'\d+/(\d+)', counter_text)
            if match:
                total_photos = int(match.group(1))
        print(f"    Gallery counter shows: {total_photos} photos")
    except:
        total_photos = 0
        print("    Gallery counter not found")
    
    # Find Next button
    try:
        next_button = project_item.find_element(By.CSS_SELECTOR, 'button[data-testid="gallery-nextButton"]')
    except:
        print("    Next button not found")
        next_button = None
    
    # Click through all photos
    for click_num in range(max(total_photos, 10)):
        # Wait for images to load
        time.sleep(0.8)
        
        # Find all current images
        images = project_item.find_elements(By.CSS_SELECTOR, 'img[src*="wixstatic"], img[src*="static.wixstatic"]')
        
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


def extract_projects(driver, url):
    """Extracts projects from page"""
    print(f"Opening page: {url}")
    driver.get(url)
    
    print("Waiting for page to load...")
    time.sleep(5)
    
    print("Scrolling page to load all projects...")
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(3)
    
    # Find projects container
    try:
        projects_container = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "fluid-columns-repeater.GPmm8Z"))
        )
    except:
        print("Error: Projects container not found")
        return []
    
    # Find all project items
    project_items = driver.find_elements(By.CSS_SELECTOR, '[id^="comp-mfqwrx08__item"]')
    print(f"Found {len(project_items)} projects\n")
    
    projects = []
    
    for idx, project_item in enumerate(project_items, 1):
        print(f"{'='*50}")
        print(f"PROJECT {idx}")
        print('='*50)
        
        try:
            # Scroll project into view
            driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", project_item)
            time.sleep(2)
            
            # Extract all images by clicking through gallery
            print("Extracting images by clicking through gallery...")
            image_urls = extract_all_gallery_images_by_clicking(driver, project_item)
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
    
    return projects


def main():
    url = "https://www.stylehomesusa.com/kitchen-renovation"
    
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
        projects = extract_projects(driver, url)
        
        if not projects:
            print("No projects found!")
            return
        
        # Create result
        result = {
            'extractedAt': datetime.now().isoformat(),
            'sourceUrl': url,
            'totalProjects': len(projects),
            'projects': projects
        }
        
        # Save to JSON
        filename = f'kitchen-projects-extracted-{datetime.now().strftime("%Y-%m-%d")}.json'
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print(f"\n{'='*50}")
        print("SUMMARY")
        print('='*50)
        print(f"Total projects: {len(projects)}")
        print(f"Total photos: {sum(p['foundPhotos'] for p in projects)}")
        print(f"\nResult saved to: {filename}")
        
        # Print short overview
        for p in projects:
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
