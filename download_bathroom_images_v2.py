"""
Покращений скрипт для завантаження зображень з каруселей через DevTools Protocol
Використовує перехоплення мережевих запитів для отримання URL зображень
"""

import time
import logging
import re
from pathlib import Path
from typing import List, Dict, Set, Optional
from dataclasses import dataclass
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from webdriver_manager.chrome import ChromeDriverManager
import requests

# Налаштування логування
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('download_bathroom_images_v2.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


@dataclass
class CarouselInfo:
    index: int
    element: any
    total_images: int
    current_image: int
    title: str
    description: str


class ImageScraperV2:
    def __init__(self, url: str, output_dir: Path, delay: int = 2):
        self.url = url
        self.output_dir = output_dir
        self.delay = delay
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.log_file = output_dir / "download_bathroom_images_v2.log"
        self._setup_logging()
        self.image_urls: Set[str] = set()  # Зберігаємо всі знайдені URL

    def _setup_logging(self):
        """Налаштування логування"""
        pass  # Вже налаштовано вище

    def _init_driver(self) -> webdriver.Chrome:
        """Ініціалізація WebDriver з DevTools Protocol"""
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--start-maximized")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36")
        
        # Увімкнемо DevTools Protocol для перехоплення мережевих запитів
        options.set_capability('goog:loggingPrefs', {'performance': 'ALL'})
        
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        
        # Увімкнемо перехоплення мережевих запитів через DevTools
        driver.execute_cdp_cmd('Network.enable', {})
        
        return driver

    def _extract_image_urls_from_carousel(self, carousel_element, driver: webdriver.Chrome) -> Set[str]:
        """Витягуємо URL зображень ТІЛЬКИ з контейнера каруселі"""
        image_urls = set()
        
        try:
            # Використовуємо JavaScript для пошуку зображень ТІЛЬКИ в контейнері каруселі
            js_urls = driver.execute_script("""
                var container = arguments[0];
                var urls = [];
                
                // Шукаємо всі img в контейнері каруселі
                var images = container.querySelectorAll('img');
                for (var i = 0; i < images.length; i++) {
                    var img = images[i];
                    var src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
                    
                    if (src && src.startsWith('http')) {
                        // Перевіряємо, чи це зображення з Wix
                        if (src.includes('static.wixstatic.com') || src.includes('wixstatic.com')) {
                            // Перевіряємо розмір зображення (виключаємо маленькі іконки)
                            var width = img.naturalWidth || img.width || 0;
                            var height = img.naturalHeight || img.height || 0;
                            
                            // Включаємо тільки зображення розміром більше 100x100 (щоб виключити іконки)
                            if (width > 100 && height > 100) {
                                // Видаляємо параметри з URL для унікальності
                                var cleanUrl = src.split('?')[0].split('#')[0];
                                if (urls.indexOf(cleanUrl) === -1) {
                                    urls.push(cleanUrl);
                                }
                            }
                        }
                    }
                }
                
                return urls;
            """, carousel_element)
            
            for url in js_urls:
                # Фільтруємо тільки реальні зображення (не іконки, не SVG)
                if any(ext in url.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp', '.avif']):
                    # Виключаємо дублікати з різними розширеннями - залишаємо тільки jpg
                    base_url = url.rsplit('.', 1)[0] if '.' in url else url
                    # Якщо вже є jpg версія, пропускаємо avif/webp
                    if '.avif' in url.lower() or '.webp' in url.lower():
                        jpg_version = base_url + '.jpg'
                        if jpg_version not in image_urls:
                            image_urls.add(url)
                    else:
                        image_urls.add(url)
            
            logger.debug(f"Знайдено {len(image_urls)} унікальних зображень в каруселі")
        
        except Exception as e:
            logger.warning(f"Помилка витягування URL з каруселі: {e}")
        
        return image_urls

    def find_carousels(self, driver: webdriver.Chrome) -> List[CarouselInfo]:
        """Знаходження всіх каруселей на сторінці"""
        carousels = []
        try:
            driver.get(self.url)
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            time.sleep(3)  # Чекаємо завантаження JS
            
            # Знаходимо всі каруселі через nav.dfLxYI
            nav_containers = driver.find_elements(By.CSS_SELECTOR, 'nav.dfLxYI')
            logger.info(f"Знайдено {len(nav_containers)} nav контейнерів з кнопками")
            
            for idx, nav_container in enumerate(nav_containers):
                try:
                    # Знаходимо батьківський контейнер каруселі
                    carousel_container = None
                    xpath_variants = [
                        "./ancestor::div[contains(@id, 'comp-mfvffgj3__item-')]",
                        "./ancestor::div[contains(@id, 'comp-mfvffgj3')]",
                        "./parent::div",
                    ]
                    
                    for xpath in xpath_variants:
                        try:
                            carousel_container = nav_container.find_element(By.XPATH, xpath)
                            break
                        except:
                            continue
                    
                    if not carousel_container:
                        continue
                    
                    # Знаходимо індикатор каруселі
                    total = 1
                    try:
                        counter = carousel_container.find_element(By.CSS_SELECTOR, '[data-testid="gallery-counter"]')
                        counter_text = counter.text.strip()
                        match = re.search(r'(\d+)/(\d+)', counter_text)
                        if match:
                            total = int(match.group(2))
                            logger.info(f"Карусель {idx + 1}: знайдено {total} зображень")
                    except:
                        logger.warning(f"Індикатор не знайдено для каруселі {idx + 1}, вважаємо 1 зображення")
                    
                    # Знаходимо назву/опис
                    title = f"Bathroom Project {idx + 1}"
                    try:
                        parent_section = carousel_container.find_element(By.XPATH, "./ancestor::div[contains(@id, 'comp-mfqwsmaf__item-')]")
                        title_elements = parent_section.find_elements(By.TAG_NAME, "h1")
                        title_elements.extend(parent_section.find_elements(By.TAG_NAME, "h2"))
                        title_elements.extend(parent_section.find_elements(By.TAG_NAME, "h3"))
                        if title_elements:
                            title = title_elements[0].text.strip()
                    except:
                        pass
                    
                    carousel_info = CarouselInfo(
                        index=idx,
                        element=carousel_container,
                        total_images=total,
                        current_image=1,
                        title=title,
                        description=""
                    )
                    
                    carousels.append(carousel_info)
                    
                except Exception as e:
                    logger.warning(f"Помилка обробки каруселі {idx + 1}: {e}")
                    continue
            
        except Exception as e:
            logger.error(f"Помилка пошуку каруселей: {e}")
        
        return carousels

    def download_image(self, url: str, filepath: Path) -> bool:
        """Завантаження зображення"""
        try:
            response = requests.get(url, timeout=30, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            if response.status_code == 200:
                filepath.parent.mkdir(parents=True, exist_ok=True)
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                return True
        except Exception as e:
            logger.error(f"Помилка завантаження {url}: {e}")
        return False

    def process_carousel(self, carousel_info: CarouselInfo, driver: webdriver.Chrome) -> Dict:
        """Обробка однієї каруселі з перехопленням мережевих запитів"""
        results = {
            'carousel_index': carousel_info.index,
            'title': carousel_info.title,
            'total_images': carousel_info.total_images,
            'downloaded': 0,
            'failed': 0,
            'images': []
        }
        
        try:
            carousel_dir = self.output_dir / f"bathroom{carousel_info.index + 1}"
            carousel_dir.mkdir(parents=True, exist_ok=True)
            
            # Прокручуємо до каруселі
            driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", carousel_info.element)
            time.sleep(2)
            
            # Знаходимо кнопку next
            next_button = None
            try:
                nav_element = carousel_info.element.find_element(By.CSS_SELECTOR, 'nav.dfLxYI')
                next_button = nav_element.find_element(By.CSS_SELECTOR, 'button[data-testid="gallery-nextButton"]')
            except:
                try:
                    all_next_buttons = driver.find_elements(By.CSS_SELECTOR, 'button[data-testid="gallery-nextButton"]')
                    if carousel_info.index < len(all_next_buttons):
                        next_button = all_next_buttons[carousel_info.index]
                except:
                    pass
            
            if not next_button:
                logger.warning(f"Кнопка next не знайдена для каруселі {carousel_info.index + 1}")
                return results
            
            # Збираємо URL зображень, прокручуючи карусель
            carousel_image_urls = set()
            
            # Спочатку збираємо всі URL з поточної позиції
            time.sleep(1)
            carousel_urls = self._extract_image_urls_from_carousel(carousel_info.element, driver)
            carousel_image_urls.update(carousel_urls)
            
            # Прокручуємо карусель, якщо є кнопка next
            if next_button and carousel_info.total_images > 1:
                for img_idx in range(carousel_info.total_images - 1):  # -1 бо перше вже зібрали
                    try:
                        logger.info(f"Карусель {carousel_info.index + 1}: прокрутка {img_idx + 2}/{carousel_info.total_images}")
                        
                        # Клікаємо next
                        try:
                            driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", next_button)
                            time.sleep(0.5)
                            next_button.click()
                            time.sleep(self.delay)
                            
                            # Збираємо URL після кліку
                            time.sleep(1)
                            carousel_urls = self._extract_image_urls_from_carousel(carousel_info.element, driver)
                            carousel_image_urls.update(carousel_urls)
                            
                            # Оновлюємо посилання на кнопку
                            try:
                                nav_element = carousel_info.element.find_element(By.CSS_SELECTOR, 'nav.dfLxYI')
                                next_button = nav_element.find_element(By.CSS_SELECTOR, 'button[data-testid="gallery-nextButton"]')
                            except:
                                try:
                                    all_next_buttons = driver.find_elements(By.CSS_SELECTOR, 'button[data-testid="gallery-nextButton"]')
                                    if carousel_info.index < len(all_next_buttons):
                                        next_button = all_next_buttons[carousel_info.index]
                                except:
                                    pass
                        except Exception as e:
                            logger.warning(f"Помилка кліку next: {e}")
                            break
                    
                    except Exception as e:
                        logger.error(f"Помилка обробки зображення {img_idx + 1}: {e}")
                        continue
            
            # Фільтруємо дублікати (одне зображення в різних форматах)
            # Віддаємо перевагу jpg над avif/webp
            filtered_urls = []
            seen_bases = set()
            
            # Спочатку додаємо jpg версії
            for url in sorted(carousel_image_urls):
                base = url.rsplit('.', 1)[0] if '.' in url else url
                if base not in seen_bases:
                    if '.jpg' in url.lower() or '.jpeg' in url.lower():
                        filtered_urls.append(url)
                        seen_bases.add(base)
            
            # Потім додаємо інші формати, якщо немає jpg версії
            for url in sorted(carousel_image_urls):
                base = url.rsplit('.', 1)[0] if '.' in url else url
                if base not in seen_bases:
                    filtered_urls.append(url)
                    seen_bases.add(base)
            
            logger.info(f"Карусель {carousel_info.index + 1}: знайдено {len(carousel_image_urls)} URL, після фільтрації: {len(filtered_urls)}")
            
            # Завантажуємо всі знайдені зображення
            for img_idx, img_url in enumerate(filtered_urls, 1):
                if img_url not in self.image_urls:
                    # Визначаємо розширення з URL
                    ext = '.jpg'
                    if '.png' in img_url.lower():
                        ext = '.png'
                    elif '.avif' in img_url.lower():
                        ext = '.avif'
                    elif '.webp' in img_url.lower():
                        ext = '.webp'
                    
                    filename = f"bathroom{carousel_info.index + 1}_{img_idx}{ext}"
                    filepath = carousel_dir / filename
                    
                    if self.download_image(img_url, filepath):
                        self.image_urls.add(img_url)
                        results['downloaded'] += 1
                        results['images'].append(str(filepath))
                        logger.info(f"✓ Карусель {carousel_info.index + 1}, зображення {img_idx}: завантажено")
                    else:
                        results['failed'] += 1
            
            # Створюємо info.txt
            info_file = carousel_dir / "info.txt"
            with open(info_file, 'w', encoding='utf-8') as f:
                f.write(f"Назва: {carousel_info.title}\n\n")
                f.write(f"Всього зображень: {carousel_info.total_images}\n")
                f.write(f"Завантажено: {results['downloaded']}\n")
                f.write(f"Помилок: {results['failed']}\n\n")
                f.write("Зображення:\n")
                for img_path in results['images']:
                    f.write(f"- {img_path}\n")
        
        except Exception as e:
            logger.error(f"Загальна помилка обробки каруселі {carousel_info.index + 1}: {e}")
        
        return results

    def run(self):
        """Головна функція"""
        logger.info(f"Початок завантаження з {self.url}")
        driver = None
        
        try:
            driver = self._init_driver()
            
            # Знаходимо каруселі
            carousels = self.find_carousels(driver)
            logger.info(f"Знайдено {len(carousels)} каруселей")
            
            if not carousels:
                logger.error("Не знайдено каруселей на сторінці")
                return
            
            # Обробляємо кожну карусель
            total_downloaded = 0
            total_failed = 0
            
            for carousel in carousels:
                results = self.process_carousel(carousel, driver)
                total_downloaded += results['downloaded']
                total_failed += results['failed']
            
            # Підсумок
            logger.info("=" * 50)
            logger.info("ПІДСУМОК:")
            logger.info(f"Каруселей оброблено: {len(carousels)}")
            logger.info(f"Зображень завантажено: {total_downloaded}")
            logger.info(f"Помилок: {total_failed}")
            logger.info("=" * 50)
        
        except Exception as e:
            logger.error(f"Критична помилка: {e}")
        
        finally:
            if driver:
                driver.quit()


if __name__ == "__main__":
    output_dir = Path("img/projects/bathroom")
    scraper = ImageScraperV2(
        url="https://www.stylehomesusa.com/bathroom-renovation",
        output_dir=output_dir,
        delay=2
    )
    scraper.run()
