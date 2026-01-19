#!/usr/bin/env python3
"""
Скрипт для завантаження всіх зображень з каруселей на сторінці bathroom-renovation.
Використовує Selenium для роботи з динамічним JavaScript контентом.
"""

import os
import time
import logging
import re
from pathlib import Path
from typing import List, Dict, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from selenium.common.exceptions import TimeoutException, NoSuchElementException
    SELENIUM_AVAILABLE = True
    
    # Спробуємо використати webdriver-manager для автоматичного завантаження ChromeDriver
    try:
        from selenium.webdriver.chrome.service import Service as ChromeService
        from webdriver_manager.chrome import ChromeDriverManager
        WEBDRIVER_MANAGER_AVAILABLE = True
    except ImportError:
        WEBDRIVER_MANAGER_AVAILABLE = False
        ChromeService = None
        ChromeDriverManager = None
except ImportError:
    SELENIUM_AVAILABLE = False
    WEBDRIVER_MANAGER_AVAILABLE = False
    print("Помилка: selenium не встановлено. Встановіть: pip install selenium")

try:
    import requests
    from curl_cffi import requests as curl_requests
    CURL_CFFI_AVAILABLE = True
except ImportError:
    CURL_CFFI_AVAILABLE = False
    print("Попередження: curl_cffi не встановлено. Встановіть: pip install curl-cffi requests")


# Налаштування логування
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('download_bathroom_images.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


@dataclass
class CarouselInfo:
    """Інформація про карусель"""
    index: int
    element: any  # WebElement
    total_images: int = 0
    current_image: int = 0
    title: str = ""
    description: str = ""
    images_downloaded: List[str] = None

    def __post_init__(self):
        if self.images_downloaded is None:
            self.images_downloaded = []


class BathroomImageDownloader:
    """Клас для завантаження зображень з каруселей"""
    
    def __init__(self, base_url: str, output_dir: str = "img/projects/bathroom", delay: float = 3.0):
        self.base_url = base_url
        self.output_dir = Path(output_dir)
        self.delay = delay
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.driver: Optional[webdriver.Chrome] = None
        self.carousels: List[CarouselInfo] = []
        
    def setup_driver(self) -> webdriver.Chrome:
        """Налаштування Selenium WebDriver"""
        chrome_options = Options()
        chrome_options.add_argument('--headless')  # Безголовий режим
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        
        try:
            # Використовуємо webdriver-manager якщо доступний
            if WEBDRIVER_MANAGER_AVAILABLE:
                service = ChromeService(ChromeDriverManager().install())
                driver = webdriver.Chrome(service=service, options=chrome_options)
            else:
                driver = webdriver.Chrome(options=chrome_options)
            
            driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            return driver
        except Exception as e:
            logger.error(f"Помилка створення WebDriver: {e}")
            logger.error("Переконайтеся, що Chrome встановлено і ChromeDriver доступний")
            raise
    
    def find_carousels(self, driver: webdriver.Chrome) -> List[CarouselInfo]:
        """Знаходження всіх каруселей на сторінці"""
        carousels = []
        
        try:
            # Чекаємо завантаження сторінки
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            time.sleep(2)  # Додаткова затримка для завантаження JS
            
            # Знаходимо всі каруселі через nav.dfLxYI (контейнери з кнопками)
            # Кожна карусель має nav.dfLxYI з кнопками next/prev
            nav_containers = driver.find_elements(By.CSS_SELECTOR, 'nav.dfLxYI')
            logger.info(f"Знайдено {len(nav_containers)} nav контейнерів з кнопками")
            
            # Для кожного nav контейнера знаходимо відповідну карусель
            for idx, nav_container in enumerate(nav_containers):
                try:
                    # Знаходимо батьківський контейнер каруселі (div з id comp-mfvffgj3__item-*)
                    # Спробуємо різні варіанти XPath
                    carousel_container = None
                    xpath_variants = [
                        "./ancestor::div[contains(@id, 'comp-mfvffgj3__item-')]",
                        "./ancestor::div[contains(@id, 'comp-mfvffgj3')]",
                        "./ancestor::div[contains(@class, 'NqU03H')]",
                        "./parent::div",
                        "./ancestor::div[position()=1]"
                    ]
                    
                    for xpath in xpath_variants:
                        try:
                            carousel_container = nav_container.find_element(By.XPATH, xpath)
                            break
                        except:
                            continue
                    
                    if not carousel_container:
                        logger.warning(f"Не вдалося знайти контейнер каруселі {idx + 1}")
                        continue
                    
                    # Знаходимо індикатор каруселі (gallery-counter) - спробуємо різні способи
                    total = 1
                    current = 1
                    try:
                        # Спочатку шукаємо в контейнері каруселі
                        counter = carousel_container.find_element(By.CSS_SELECTOR, '[data-testid="gallery-counter"]')
                        counter_text = counter.text.strip()
                        match = re.search(r'(\d+)/(\d+)', counter_text)
                        
                        if match:
                            current = int(match.group(1))
                            total = int(match.group(2))
                            logger.info(f"Карусель {idx + 1}: індикатор знайдено - {counter_text}")
                    except:
                        # Якщо не знайшли в контейнері, шукаємо поблизу nav
                        try:
                            # Шукаємо в батьківських елементах
                            counter = nav_container.find_element(By.XPATH, "./ancestor::*//div[@data-testid='gallery-counter']")
                            counter_text = counter.text.strip()
                            match = re.search(r'(\d+)/(\d+)', counter_text)
                            
                            if match:
                                current = int(match.group(1))
                                total = int(match.group(2))
                                logger.info(f"Карусель {idx + 1}: індикатор знайдено в батьківських елементах - {counter_text}")
                        except:
                            # Спробуємо знайти всі індикатори на сторінці і вибрати відповідний
                            try:
                                all_counters = driver.find_elements(By.CSS_SELECTOR, '[data-testid="gallery-counter"]')
                                if idx < len(all_counters):
                                    counter_text = all_counters[idx].text.strip()
                                    match = re.search(r'(\d+)/(\d+)', counter_text)
                                    if match:
                                        current = int(match.group(1))
                                        total = int(match.group(2))
                                        logger.info(f"Карусель {idx + 1}: індикатор знайдено через індекс - {counter_text}")
                            except:
                                logger.warning(f"Індикатор не знайдено для каруселі {idx + 1}, вважаємо 1 зображення")
                    
                    # Спробуємо знайти назву/опис каруселі
                    title = ""
                    description = ""
                    
                    try:
                        # Шукаємо заголовок поблизу каруселі
                        parent_section = carousel_container.find_element(By.XPATH, "./ancestor::div[contains(@id, 'comp-mfqwsmaf__item-')]")
                        title_elements = parent_section.find_elements(By.TAG_NAME, "h1")
                        title_elements.extend(parent_section.find_elements(By.TAG_NAME, "h2"))
                        title_elements.extend(parent_section.find_elements(By.TAG_NAME, "h3"))
                        
                        if title_elements:
                            title = title_elements[0].text.strip()
                        
                        # Шукаємо опис
                        desc_elements = parent_section.find_elements(By.TAG_NAME, "p")
                        if desc_elements:
                            description = " ".join([p.text.strip() for p in desc_elements[:3]])
                    except:
                        title = f"Carousel {idx + 1}"
                        description = ""
                    
                    carousel_info = CarouselInfo(
                        index=idx,
                        element=carousel_container,
                        total_images=total,
                        current_image=current,
                        title=title or f"Carousel {idx + 1}",
                        description=description
                    )
                    
                    carousels.append(carousel_info)
                    logger.info(f"Карусель {idx + 1}: {title} - {total} зображень (знайдено через nav.dfLxYI)")
                        
                except Exception as e:
                    logger.warning(f"Помилка обробки каруселі {idx + 1}: {e}")
                    continue
            
            # Якщо не знайшли через nav, спробуємо через gallery-counter
            if not carousels:
                logger.warning("Не знайдено каруселей через nav.dfLxYI, спробуємо через gallery-counter")
                gallery_counters = driver.find_elements(By.CSS_SELECTOR, '[data-testid="gallery-counter"]')
                logger.info(f"Знайдено {len(gallery_counters)} індикаторів каруселей")
                
                for idx, counter in enumerate(gallery_counters):
                    try:
                        counter_text = counter.text.strip()
                        match = re.search(r'(\d+)/(\d+)', counter_text)
                        
                        if match:
                            current = int(match.group(1))
                            total = int(match.group(2))
                            
                            # Знаходимо батьківський контейнер каруселі
                            carousel_container = counter.find_element(By.XPATH, "./ancestor::div[contains(@id, 'comp-mfvffgj3__item-')]")
                            
                            carousel_info = CarouselInfo(
                                index=idx,
                                element=carousel_container,
                                total_images=total,
                                current_image=current,
                                title=f"Carousel {idx + 1}",
                                description=""
                            )
                            
                            carousels.append(carousel_info)
                            logger.info(f"Карусель {idx + 1}: {total} зображень (знайдено через gallery-counter)")
                            
                    except Exception as e:
                        logger.warning(f"Помилка обробки каруселі {idx + 1}: {e}")
                        continue
            
            # Якщо не знайшли через gallery-counter, спробуємо інший спосіб
            if not carousels:
                logger.warning("Не знайдено каруселей через gallery-counter, спробуємо альтернативний метод")
                # Знаходимо всі кнопки next
                next_buttons = driver.find_elements(By.CSS_SELECTOR, '[data-testid="gallery-nextButton"]')
                logger.info(f"Знайдено {len(next_buttons)} кнопок next")
                
                for idx, button in enumerate(next_buttons):
                    try:
                        # Шукаємо батьківський контейнер каруселі різними способами
                        carousel_container = None
                        
                        # Спробуємо знайти через різні XPath
                        xpath_variants = [
                            "./ancestor::div[contains(@class, 'NqU03H')]",
                            "./ancestor::div[contains(@id, 'comp-mfvffgj3')]",
                            "./ancestor::div[contains(@class, 'gallery')]",
                            "./ancestor::div[contains(@class, 'carousel')]",
                            "./ancestor::div[contains(@data-testid, 'gallery')]",
                            "./ancestor::nav[contains(@class, 'dfLxYI')]/..",
                            "./ancestor::div[position()=1]",
                        ]
                        
                        for xpath in xpath_variants:
                            try:
                                carousel_container = button.find_element(By.XPATH, xpath)
                                break
                            except:
                                continue
                        
                        if not carousel_container:
                            # Якщо не знайшли, використовуємо батьківський елемент кнопки
                            try:
                                carousel_container = button.find_element(By.XPATH, "./ancestor::div[1]")
                            except:
                                logger.warning(f"Не вдалося знайти контейнер для каруселі {idx + 1}")
                                continue
                        
                        # Спробуємо знайти індикатор
                        total = 1
                        try:
                            counter = carousel_container.find_element(By.CSS_SELECTOR, '[data-testid="gallery-counter"]')
                            counter_text = counter.text.strip()
                            match = re.search(r'(\d+)/(\d+)', counter_text)
                            if match:
                                total = int(match.group(2))
                        except:
                            # Спробуємо знайти індикатор в усьому документі поблизу кнопки
                            try:
                                all_counters = driver.find_elements(By.CSS_SELECTOR, '[data-testid="gallery-counter"]')
                                if idx < len(all_counters):
                                    counter_text = all_counters[idx].text.strip()
                                    match = re.search(r'(\d+)/(\d+)', counter_text)
                                    if match:
                                        total = int(match.group(2))
                            except:
                                pass
                        
                        carousel_info = CarouselInfo(
                            index=idx,
                            element=carousel_container,
                            total_images=total,
                            current_image=1,
                            title=f"Carousel {idx + 1}",
                            description=""
                        )
                        carousels.append(carousel_info)
                        logger.info(f"Карусель {idx + 1} знайдено через кнопку next: {total} зображень")
                    except Exception as e:
                        logger.warning(f"Помилка обробки каруселі через кнопку {idx + 1}: {e}")
            
            return carousels
            
        except Exception as e:
            logger.error(f"Помилка пошуку каруселей: {e}")
            return []
    
    def download_image(self, url: str, filepath: Path) -> bool:
        """Завантаження зображення"""
        try:
            response = requests.get(url, timeout=30, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            response.raise_for_status()
            
            filepath.parent.mkdir(parents=True, exist_ok=True)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            return True
        except Exception as e:
            logger.error(f"Помилка завантаження {url}: {e}")
            return False
    
    def get_all_image_urls_from_carousel(self, carousel_element, driver: webdriver.Chrome) -> List[str]:
        """Отримання ВСІХ URL зображень з каруселі через JavaScript"""
        try:
            # Використовуємо JavaScript для отримання всіх зображень
            all_urls = driver.execute_script("""
                var container = arguments[0];
                var urls = [];
                
                // Шукаємо всі img в контейнері (включаючи приховані)
                var images = container.querySelectorAll('img');
                for (var i = 0; i < images.length; i++) {
                    var src = images[i].src || 
                              images[i].getAttribute('data-src') || 
                              images[i].getAttribute('data-lazy-src') ||
                              images[i].getAttribute('data-image-src');
                    if (src && src.startsWith('http') && urls.indexOf(src) === -1) {
                        urls.push(src);
                    }
                }
                
                // Шукаємо в carousel-track (якщо є)
                var tracks = container.querySelectorAll('.carousel-track, [class*="carousel"], [class*="track"]');
                for (var t = 0; t < tracks.length; t++) {
                    var trackImages = tracks[t].querySelectorAll('img');
                    for (var i = 0; i < trackImages.length; i++) {
                        var src = trackImages[i].src || trackImages[i].getAttribute('data-src');
                        if (src && src.startsWith('http') && urls.indexOf(src) === -1) {
                            urls.push(src);
                        }
                    }
                }
                
                // Шукаємо через background-image в computed style
                var divs = container.querySelectorAll('div');
                for (var i = 0; i < divs.length; i++) {
                    try {
                        var style = window.getComputedStyle(divs[i]);
                        var bg = style.backgroundImage;
                        if (bg && bg !== 'none') {
                            var match = bg.match(/url\\(["']?([^"']+)["']?\\)/);
                            if (match && match[1].startsWith('http') && urls.indexOf(match[1]) === -1) {
                                urls.push(match[1]);
                            }
                        }
                    } catch(e) {}
                }
                
                return urls;
            """, carousel_element)
            
            # Фільтруємо тільки зображення
            image_urls = []
            for url in all_urls:
                if url and (any(ext in url.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp', '.avif']) or 
                           'photo' in url.lower() or 'image' in url.lower() or 
                           'static.wixstatic.com' in url.lower() or 'wixstatic.com' in url.lower()):
                    image_urls.append(url)
            
            logger.info(f"Знайдено {len(image_urls)} унікальних URL зображень в каруселі")
            return image_urls
        except Exception as e:
            logger.warning(f"Помилка JavaScript пошуку зображень: {e}")
            return []
    
    def get_current_image_url(self, carousel_element, downloaded_urls: set, driver: webdriver.Chrome) -> Optional[str]:
        """Отримання URL поточного видимого зображення в каруселі"""
        # Метод 1: Шукаємо img теги (включаючи приховані)
        images = carousel_element.find_elements(By.TAG_NAME, "img")
        for img in images:
            # Перевіряємо, чи зображення видиме
            try:
                is_displayed = img.is_displayed()
            except:
                is_displayed = True  # Якщо не можемо перевірити, вважаємо видимим
            
            src = (img.get_attribute("src") or 
                   img.get_attribute("data-src") or 
                   img.get_attribute("data-lazy-src") or
                   img.get_attribute("data-image-src"))
            
            if src and src.startswith("http") and src not in downloaded_urls:
                # Перевіряємо, чи це реальне зображення
                if any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp', '.avif']) or 'photo' in src.lower() or 'static.wixstatic.com' in src.lower():
                    logger.debug(f"Знайдено зображення через img тег: {src[:80]}...")
                    return src
        
        # Метод 2: Шукаємо через JavaScript - отримуємо computed style та всі зображення
        try:
            visible_urls = driver.execute_script("""
                var container = arguments[0];
                var urls = [];
                
                // Шукаємо всі img, включаючи приховані
                var images = container.querySelectorAll('img');
                for (var i = 0; i < images.length; i++) {
                    var src = images[i].src || 
                              images[i].getAttribute('data-src') || 
                              images[i].getAttribute('data-lazy-src');
                    if (src && src.startsWith('http') && urls.indexOf(src) === -1) {
                        urls.push(src);
                    }
                }
                
                // Шукаємо через background-image в computed style
                var divs = container.querySelectorAll('div');
                for (var i = 0; i < divs.length; i++) {
                    try {
                        var style = window.getComputedStyle(divs[i]);
                        var bg = style.backgroundImage;
                        if (bg && bg !== 'none') {
                            var match = bg.match(/url\\(["']?([^"']+)["']?\\)/);
                            if (match && match[1].startsWith('http') && urls.indexOf(match[1]) === -1) {
                                urls.push(match[1]);
                            }
                        }
                    } catch(e) {}
                }
                
                return urls;
            """, carousel_element)
            
            # Вибираємо перше зображення, яке ще не завантажено
            for url in visible_urls:
                if url and url not in downloaded_urls:
                    if any(ext in url.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp', '.avif']) or 'photo' in url.lower() or 'static.wixstatic.com' in url.lower():
                        logger.debug(f"Знайдено зображення через JavaScript: {url[:80]}...")
                        return url
        except Exception as e:
            logger.debug(f"Помилка JavaScript пошуку: {e}")
        
        # Метод 3: Шукаємо через background-image в style атрибуті
        divs = carousel_element.find_elements(By.TAG_NAME, "div")
        for div in divs:
            style = div.get_attribute("style") or ""
            if "background-image" in style or "url(" in style:
                matches = re.findall(r'url\(["\']?([^"\']+)["\']?\)', style)
                for match in matches:
                    if match.startswith("http") and match not in downloaded_urls:
                        if any(ext in match.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp', '.avif']) or 'photo' in match.lower():
                            logger.debug(f"Знайдено зображення через style: {match[:80]}...")
                            return match
        
        return None
    
    def process_carousel(self, carousel_info: CarouselInfo, driver: webdriver.Chrome) -> Dict:
        """Обробка однієї каруселі"""
        results = {
            'carousel_index': carousel_info.index,
            'title': carousel_info.title,
            'total_images': carousel_info.total_images,
            'downloaded': 0,
            'failed': 0,
            'images': []
        }
        
        try:
            # Створюємо папку для каруселі
            carousel_dir = self.output_dir / f"bathroom{carousel_info.index + 1}"
            carousel_dir.mkdir(parents=True, exist_ok=True)
            
            # Прокручуємо до каруселі
            driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", carousel_info.element)
            time.sleep(2)  # Чекаємо прокрутку та завантаження
            
            downloaded_urls = set()
            
            # Знаходимо кнопку next - вона знаходиться в nav.dfLxYI всередині контейнера каруселі
            next_button = None
            try:
                # Шукаємо nav.dfLxYI в контейнері каруселі
                nav_element = carousel_info.element.find_element(By.CSS_SELECTOR, 'nav.dfLxYI')
                # Знаходимо кнопку next в nav
                next_button = nav_element.find_element(By.CSS_SELECTOR, 'button[data-testid="gallery-nextButton"]')
                logger.info(f"Карусель {carousel_info.index + 1}: кнопка next знайдена в nav.dfLxYI")
            except NoSuchElementException:
                try:
                    # Спробуємо знайти напряму в контейнері
                    next_button = carousel_info.element.find_element(
                        By.CSS_SELECTOR, 
                        'button[data-testid="gallery-nextButton"]'
                    )
                    logger.info(f"Карусель {carousel_info.index + 1}: кнопка next знайдена в контейнері")
                except:
                    try:
                        # Шукаємо всі кнопки next на сторінці і вибираємо відповідну за індексом
                        all_next_buttons = driver.find_elements(By.CSS_SELECTOR, 'button[data-testid="gallery-nextButton"]')
                        logger.info(f"Знайдено {len(all_next_buttons)} кнопок next на сторінці")
                        
                        if carousel_info.index < len(all_next_buttons):
                            next_button = all_next_buttons[carousel_info.index]
                            logger.info(f"Карусель {carousel_info.index + 1}: використовуємо кнопку {carousel_info.index} зі списку")
                    except Exception as e:
                        logger.warning(f"Помилка пошуку кнопок next: {e}")
            
            if not next_button:
                logger.error(f"Кнопка next не знайдена для каруселі {carousel_info.index + 1}")
                # Спробуємо продовжити без кнопки - можливо, це карусель з одним зображенням
                if carousel_info.total_images == 1:
                    logger.info(f"Карусель {carousel_info.index + 1} має тільки 1 зображення, продовжуємо без кнопки")
                else:
                    logger.warning(f"Карусель {carousel_info.index + 1} має {carousel_info.total_images} зображень, але кнопка не знайдена. Спробуємо завантажити перше зображення.")
            
            # Спочатку спробуємо зібрати всі зображення з каруселі через JavaScript
            all_carousel_urls = self.get_all_image_urls_from_carousel(carousel_info.element, driver)
            
            if all_carousel_urls and len(all_carousel_urls) >= carousel_info.total_images:
                # Якщо знайшли всі зображення, завантажуємо їх одразу
                logger.info(f"Карусель {carousel_info.index + 1}: знайдено {len(all_carousel_urls)} зображень в DOM, завантажуємо всі")
                for img_idx, img_url in enumerate(all_carousel_urls[:carousel_info.total_images], 1):
                    if img_url not in downloaded_urls:
                        filename = f"bathroom{carousel_info.index + 1}_{img_idx}.jpg"
                        filepath = carousel_dir / filename
                        
                        if self.download_image(img_url, filepath):
                            downloaded_urls.add(img_url)
                            results['downloaded'] += 1
                            results['images'].append(str(filepath))
                            logger.info(f"✓ Карусель {carousel_info.index + 1}, зображення {img_idx}/{carousel_info.total_images}: завантажено")
                        else:
                            results['failed'] += 1
            else:
                # Якщо не знайшли всі зображення, гортаємо карусель
                logger.info(f"Карусель {carousel_info.index + 1}: знайдено {len(all_carousel_urls) if all_carousel_urls else 0} зображень, гортаємо карусель")
                
                # Гортаємо карусель і завантажуємо зображення
                for img_idx in range(carousel_info.total_images):
                    try:
                        logger.info(f"Карусель {carousel_info.index + 1}: обробка зображення {img_idx + 1}/{carousel_info.total_images}")
                        
                        # Чекаємо завантаження зображення
                        time.sleep(2)  # Збільшена затримка для завантаження зображення
                        
                        # Отримуємо URL поточного зображення (спробуємо кілька разів)
                        img_url = None
                        for attempt in range(5):
                            img_url = self.get_current_image_url(carousel_info.element, downloaded_urls, driver)
                            if img_url:
                                break
                            time.sleep(0.5)  # Чекаємо ще трохи
                        
                        if not img_url:
                            # Спробуємо отримати всі URL з каруселі і вибрати новий
                            all_urls = self.get_all_image_urls_from_carousel(carousel_info.element, driver)
                            for url in all_urls:
                                if url and url not in downloaded_urls:
                                    img_url = url
                                    break
                        
                        if img_url:
                            # Завантажуємо зображення
                            filename = f"bathroom{carousel_info.index + 1}_{img_idx + 1}.jpg"
                            filepath = carousel_dir / filename
                            
                            if self.download_image(img_url, filepath):
                                downloaded_urls.add(img_url)
                                results['downloaded'] += 1
                                results['images'].append(str(filepath))
                                logger.info(f"✓ Карусель {carousel_info.index + 1}, зображення {img_idx + 1}/{carousel_info.total_images}: завантажено")
                            else:
                                logger.warning(f"✗ Не вдалося завантажити зображення {img_idx + 1}")
                                results['failed'] += 1
                        else:
                            logger.warning(f"✗ URL зображення {img_idx + 1} не знайдено")
                            results['failed'] += 1
                        
                        # Натискаємо кнопку next (якщо не останнє зображення)
                        if img_idx < carousel_info.total_images - 1 and next_button:
                            try:
                                # Прокручуємо до кнопки
                                driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", next_button)
                                time.sleep(0.5)
                                
                                # Зберігаємо поточну кількість зображень перед кліком
                                images_before = len(carousel_info.element.find_elements(By.TAG_NAME, "img"))
                                
                                # Клікаємо
                                next_button.click()
                                
                                # Чекаємо, поки з'явиться нове зображення (максимум 5 секунд)
                                for wait_attempt in range(10):
                                    time.sleep(0.5)
                                    images_after = len(carousel_info.element.find_elements(By.TAG_NAME, "img"))
                                    # Перевіряємо, чи з'явилося нове зображення або змінився src
                                    current_urls = self.get_all_image_urls_from_carousel(carousel_info.element, driver)
                                    if len(current_urls) > len(downloaded_urls) or images_after > images_before:
                                        logger.info(f"Карусель {carousel_info.index + 1}: нове зображення з'явилося після кліку")
                                        break
                                
                                time.sleep(1)  # Додаткова затримка для завантаження
                                
                                # Оновлюємо посилання на кнопку (може змінитися після кліку)
                                try:
                                    nav_element = carousel_info.element.find_element(By.CSS_SELECTOR, 'nav.dfLxYI')
                                    next_button = nav_element.find_element(By.CSS_SELECTOR, 'button[data-testid="gallery-nextButton"]')
                                except:
                                    # Якщо не знайшли через nav, спробуємо через індекс
                                    try:
                                        all_next_buttons = driver.find_elements(By.CSS_SELECTOR, 'button[data-testid="gallery-nextButton"]')
                                        if carousel_info.index < len(all_next_buttons):
                                            next_button = all_next_buttons[carousel_info.index]
                                    except:
                                        pass
                                    
                            except Exception as e:
                                logger.warning(f"Помилка кліку next для каруселі {carousel_info.index + 1}: {e}")
                                break
                    
                    except Exception as e:
                        logger.error(f"Помилка обробки зображення {img_idx + 1} каруселі {carousel_info.index + 1}: {e}")
                        results['failed'] += 1
                        continue
            
            # Створюємо txt файл з інформацією
            info_file = carousel_dir / "info.txt"
            with open(info_file, 'w', encoding='utf-8') as f:
                f.write(f"Назва: {carousel_info.title}\n\n")
                f.write(f"Опис:\n{carousel_info.description}\n\n")
                f.write(f"Всього зображень: {carousel_info.total_images}\n")
                f.write(f"Завантажено: {results['downloaded']}\n")
                f.write(f"Помилок: {results['failed']}\n\n")
                f.write("Зображення:\n")
                for img_path in results['images']:
                    f.write(f"{Path(img_path).name}\n")
            
            logger.info(f"Карусель {carousel_info.index + 1} завершено: {results['downloaded']}/{carousel_info.total_images}")
            
        except Exception as e:
            logger.error(f"Помилка обробки каруселі {carousel_info.index + 1}: {e}")
            results['error'] = str(e)
        
        return results
    
    def download_all(self):
        """Головний метод для завантаження всіх зображень"""
        if not SELENIUM_AVAILABLE:
            logger.error("Selenium не встановлено. Встановіть: pip install selenium")
            return
        
        logger.info(f"Початок завантаження з {self.base_url}")
        
        try:
            # Створюємо окремий драйвер для кожної каруселі (паралельна обробка)
            drivers = []
            carousels_info = []
            
            # Спочатку знаходимо всі каруселі
            main_driver = self.setup_driver()
            main_driver.get(self.base_url)
            carousels_info = self.find_carousels(main_driver)
            main_driver.quit()
            
            if not carousels_info:
                logger.error("Не знайдено каруселей на сторінці")
                return
            
            logger.info(f"Знайдено {len(carousels_info)} каруселей")
            
            # Обробляємо кожну карусель в окремому потоці
            all_results = []
            
            with ThreadPoolExecutor(max_workers=len(carousels_info)) as executor:
                futures = []
                
                for carousel_info in carousels_info:
                    driver = self.setup_driver()
                    driver.get(self.base_url)
                    # Знаходимо карусель знову в новому драйвері
                    time.sleep(2)
                    try:
                        # Знаходимо карусель за індексом
                        gallery_counters = driver.find_elements(By.CSS_SELECTOR, '[data-testid="gallery-counter"]')
                        if carousel_info.index < len(gallery_counters):
                            counter = gallery_counters[carousel_info.index]
                            carousel_container = counter.find_element(By.XPATH, "./ancestor::div[contains(@class, 'NqU03H')]")
                            carousel_info.element = carousel_container
                    except:
                        pass
                    
                    future = executor.submit(self.process_carousel, carousel_info, driver)
                    futures.append((future, driver))
                
                for future, driver in futures:
                    try:
                        result = future.result(timeout=600)  # 10 хвилин на карусель
                        all_results.append(result)
                    except Exception as e:
                        logger.error(f"Помилка обробки каруселі: {e}")
                    finally:
                        try:
                            driver.quit()
                        except:
                            pass
            
            # Підсумкова статистика
            total_downloaded = sum(r['downloaded'] for r in all_results)
            total_failed = sum(r['failed'] for r in all_results)
            
            logger.info("=" * 50)
            logger.info("ПІДСУМОК:")
            logger.info(f"Каруселей оброблено: {len(all_results)}")
            logger.info(f"Зображень завантажено: {total_downloaded}")
            logger.info(f"Помилок: {total_failed}")
            logger.info("=" * 50)
            
        except Exception as e:
            logger.error(f"Критична помилка: {e}", exc_info=True)


def main():
    """Головна функція"""
    url = "https://www.stylehomesusa.com/bathroom-renovation"
    output_dir = "img/projects/bathroom"
    
    downloader = BathroomImageDownloader(url, output_dir, delay=3.0)
    downloader.download_all()


if __name__ == "__main__":
    main()
