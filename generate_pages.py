#!/usr/bin/env python3
"""
Скрипт для генерації HTML сторінок з JSON даних
"""

import json
import os
import re
from pathlib import Path

def sanitize_filename(filename):
    """Очищає ім'я файлу від небезпечних символів"""
    filename = filename.replace('/', '_').replace('\\', '_')
    filename = filename.replace(':', '_').replace('*', '_')
    filename = filename.replace('?', '_').replace('"', '_')
    filename = filename.replace('<', '_').replace('>', '_')
    filename = filename.replace('|', '_')
    return filename

def get_image_paths(project_dir, images_data):
    """Отримує шляхи до завантажених зображень"""
    image_paths = []
    
    if not os.path.exists(project_dir):
        # Якщо папка не існує, використовуємо URL з JSON
        for img in images_data:
            image_paths.append({
                'src': img.get('url', ''),
                'alt': img.get('alt', '')
            })
        return image_paths
    
    # Знаходимо всі зображення в папці проекту
    image_files = []
    for file in os.listdir(project_dir):
        if file.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.avif')):
            image_files.append(file)
    
    # Сортуємо за іменами файлів
    image_files.sort()
    
    # Створюємо шляхи відносно кореня проекту
    for img_file in image_files:
        # Знаходимо відповідний alt з JSON
        alt = ''
        for img_data in images_data:
            if img_data.get('alt', '').endswith(img_file) or img_file in img_data.get('alt', ''):
                alt = img_data.get('alt', '')
                break
        
        # Шлях відносно кореня проекту (всі HTML файли в корені)
        # downloaded_images/wood-and-panel-wall-decor/projects/...
        rel_path = project_dir.replace('\\', '/') + '/' + img_file
        # Перетворюємо на відносний шлях від кореня
        if not rel_path.startswith('/'):
            rel_path = '/' + rel_path
    
        image_paths.append({
            'src': rel_path,
            'alt': alt or img_file
        })
    
    # Якщо не знайшли файли, використовуємо URL
    if not image_paths:
        for img in images_data:
            image_paths.append({
                'src': img.get('url', ''),
                'alt': img.get('alt', '')
            })
    
    return image_paths

def generate_html_page(json_file, template_file='kitchen-renovation.html'):
    """Генерує HTML сторінку з JSON даних"""
    
    # Читаємо JSON
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Читаємо шаблон
    with open(template_file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    page_name = data.get('pageName', '')
    page_name_safe = sanitize_filename(page_name.lower().replace(' ', '-'))
    
    # Замінюємо заголовки
    html = html.replace('Kitchen Renovation', page_name)
    html = html.replace('kitchen-renovation', page_name_safe)
    html = html.replace('KITCHEN RENOVATION', page_name.upper())
    html = html.replace('Kitchen Projects', f'{page_name} Projects')
    html = html.replace('Our Kitchen Renovations', f'Our {page_name} Projects')
    html = html.replace('Get Your Free Kitchen Consultation Today', f'Get Your Free {page_name} Consultation Today')
    html = html.replace('kitchen renovation project', f'{page_name.lower()} project')
    
    # Замінюємо hero image
    hero_image = data.get('heroImage')
    if hero_image:
        hero_url = hero_image.get('url', '')
        hero_alt = hero_image.get('alt', page_name)
        
        # Перевіряємо, чи є локальний файл
        hero_dir = f'downloaded_images/{page_name_safe}/hero'
        hero_local_path = None
        if os.path.exists(hero_dir):
            for file in os.listdir(hero_dir):
                if file.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.avif')):
                    hero_local_path = f'/downloaded_images/{page_name_safe}/hero/{file}'
                    break
        
        if hero_local_path:
            html = html.replace(
                '<img src="/img/kitchen-renovation.jpg" alt="Kitchen Renovation" />',
                f'<img src="{hero_local_path}" alt="{hero_alt}" />'
            )
        else:
            html = html.replace(
                '<img src="/img/kitchen-renovation.jpg" alt="Kitchen Renovation" />',
                f'<img src="{hero_url}" alt="{hero_alt}" />'
            )
    
    # Генеруємо проекти
    projects_html = ''
    projects = data.get('projects', [])
    
    # Фільтруємо проекти: тільки ті, що мають зображення
    valid_projects = []
    seen_urls = set()  # Для видалення дублікатів
    
    for project in projects:
        images = project.get('images', [])
        found_photos = project.get('foundPhotos', 0)
        
        # Пропускаємо проекти без зображень
        if not images or found_photos == 0:
            continue
        
        # Перевіряємо на дублікати за URL першого зображення
        if images:
            first_url = images[0].get('url', '')
            if first_url in seen_urls:
                continue
            seen_urls.add(first_url)
        
        valid_projects.append(project)
    
    print(f"  Filtered: {len(projects)} -> {len(valid_projects)} valid projects")
    
    for idx, project in enumerate(valid_projects, 1):
        project_num = project.get('projectNumber', idx)
        title = project.get('title', f'Project {project_num}')
        description = project.get('description', '').strip()
        images = project.get('images', [])
        
        # Знаходимо папку з завантаженими зображеннями
        # Спочатку шукаємо за новою назвою, потім за старою
        project_dir_new = f'downloaded_images/{page_name_safe}/projects/project{project_num:02d}_{sanitize_filename(title)}'
        project_dir_old = f'downloaded_images/{page_name_safe}/projects/project{project_num:02d}_Project {project_num}'
        
        # Перевіряємо, яка папка існує
        if os.path.exists(project_dir_new):
            project_dir = project_dir_new
        elif os.path.exists(project_dir_old):
            project_dir = project_dir_old
        else:
            project_dir = project_dir_new
        
        # Отримуємо шляхи до зображень
        image_paths = get_image_paths(project_dir, images)
        
        # Генеруємо HTML для каруселі
        carousel_images_html = ''
        for img_path in image_paths:
            carousel_images_html += f'                                <img src="{img_path["src"]}" alt="{img_path["alt"]}" loading="lazy" decoding="async">\n'
        
        # Генеруємо HTML для проекту
        delay = idx * 100
        project_html = f'''                    <!-- Project {project_num}: {title} -->
                    <div class="project-card" data-aos="fade-up" data-aos-delay="{delay}">
                        <div class="project-card__carousel">
                            <div class="carousel-track">
{carousel_images_html}                            </div>
                            <button class="carousel-btn prev" aria-label="Previous image">&#10094;</button>
                            <button class="carousel-btn next" aria-label="Next image">&#10095;</button>
                        </div>
                        <h3 class="project-card__name">{title}</h3>
                        <p class="project-card__description">
                            {description if description else 'No description available.'}
                        </p>
                    </div>

'''
        projects_html += project_html
    
    # Замінюємо секцію проектів
    # Знаходимо початок projects__grid
    grid_start = html.find('<div class="projects__grid">')
    if grid_start != -1:
        # Знаходимо Consultation Form Section
        consultation_start = html.find('<!-- Consultation Form Section -->')
        if consultation_start == -1:
            consultation_start = html.find('<section class="consultation"')
        
        if consultation_start != -1:
            # Знаходимо закриваючий </div> для projects__grid перед consultation
            # Шукаємо останній </div> перед consultation, який закриває projects__grid
            pos = consultation_start - 1
            grid_end = consultation_start
            
            # Шукаємо назад до знаходження правильного закриваючого </div>
            while pos > grid_start:
                if html[pos:pos+6] == '</div>':
                    # Перевіряємо, чи це закриває projects__grid
                    # Рахуємо вкладені div від цього місця назад до grid_start
                    temp_pos = pos - 1
                    depth = 1
                    
                    while temp_pos > grid_start and depth > 0:
                        if html[temp_pos:temp_pos+6] == '</div>':
                            depth += 1
                        elif html[temp_pos:temp_pos+4] == '<div':
                            depth -= 1
                            if depth == 0:
                                # Це початок projects__grid, значить pos - це правильний кінець
                                grid_end = pos + 6
                                break
                        temp_pos -= 1
                    
                    if depth == 0:
                        break
                pos -= 1
            
            # Якщо не знайшли, використовуємо простий підхід - останній </div> перед consultation
            if grid_end == consultation_start:
                grid_end = html.rfind('</div>', grid_start, consultation_start)
                if grid_end != -1:
                    grid_end += 6
            
            # Замінюємо весь блок
            html = html[:grid_start] + f'<div class="projects__grid">\n{projects_html}                </div>' + html[grid_end:]
        else:
            # Якщо не знайшли consultation, рахуємо вкладені div
            pos = grid_start + len('<div class="projects__grid">')
            depth = 1
            grid_end = pos
            
            while depth > 0 and grid_end < len(html):
                if html[grid_end:grid_end+4] == '<div':
                    depth += 1
                elif html[grid_end:grid_end+5] == '</div':
                    depth -= 1
                    if depth == 0:
                        grid_end += 6
                        break
                grid_end += 1
            
            html = html[:grid_start] + f'<div class="projects__grid">\n{projects_html}                </div>' + html[grid_end:]
    
    # Оновлюємо title в head
    html = html.replace(
        '<title>Kitchen Renovation - Style Homes | Portland OR & Vancouver WA</title>',
        f'<title>{page_name} - Style Homes | Portland OR & Vancouver WA</title>'
    )
    
    # Зберігаємо файл
    output_file = f'{page_name_safe}.html'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"Generated: {output_file}")
    print(f"  Projects: {len(valid_projects)}")
    print(f"  Total images: {sum(len(p.get('images', [])) for p in valid_projects)}")
    
    return output_file

def main():
    """Головна функція"""
    json_files = [
        ('wood-and-panel-wall-decor-projects-extracted-2026-01-18.json', 'Wood and Panel Wall Decor'),
        ('whole-home-transformation-projects-extracted-2026-01-18.json', 'Whole-Home Transformation'),
        ('bathroom-renovation-projects-extracted-2026-01-18.json', 'Bathroom Renovation'),
    ]
    
    print("="*60)
    print("HTML PAGE GENERATOR")
    print("="*60)
    
    for json_file, page_name in json_files:
        if not os.path.exists(json_file):
            print(f"\nFile not found: {json_file}, skipping...")
            continue
        
        print(f"\nProcessing: {page_name}")
        try:
            output_file = generate_html_page(json_file)
            print(f"  ✓ Success: {output_file}")
        except Exception as e:
            print(f"  ✗ Error: {e}")
            import traceback
            traceback.print_exc()
    
    print(f"\n{'='*60}")
    print("ALL PAGES GENERATED")
    print('='*60)

if __name__ == '__main__':
    main()

