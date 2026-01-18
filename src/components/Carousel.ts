// Компонент каруселі - перевикористовуваний клас для роботи з каруселями

import { querySelector, querySelectorAll, getDatasetNumber } from '../utils/dom';
import type { CarouselTrack } from '../types/dom';

export interface CarouselOptions {
  /** Чи використовувати безкінечний цикл */
  infinite?: boolean;
  /** Тривалість анімації переходу в мс */
  transitionDuration?: number;
  /** Поріг для свайпу на мобільних пристроях */
  swipeThreshold?: number;
  /** Селектор для кнопки "Попереднє" */
  prevButtonSelector?: string;
  /** Селектор для кнопки "Наступне" */
  nextButtonSelector?: string;
  /** Селектор для треку каруселі */
  trackSelector?: string;
}

export class Carousel {
  private carousel: HTMLElement;
  private track: CarouselTrack;
  private prevBtn: HTMLElement | null;
  private nextBtn: HTMLElement | null;
  private slides: HTMLImageElement[];
  private originalCount: number;
  private currentIndex: number;
  private slideWidth: number;
  private isTransitioning: boolean = false;
  
  private options: Required<CarouselOptions>;
  
  // Обробники подій для видалення
  private clickHandler: (e: MouseEvent) => void;
  private resizeHandler: () => void;
  private touchStartHandler: (e: TouchEvent) => void;
  private touchMoveHandler: (e: TouchEvent) => void;
  private touchEndHandler: () => void;
  
  private touchStartX: number = 0;
  private touchEndX: number = 0;

  constructor(
    carouselElement: HTMLElement,
    options: CarouselOptions = {}
  ) {
    this.carousel = carouselElement;
    
    // Встановлюємо опції за замовчуванням
    this.options = {
      infinite: options.infinite ?? true,
      transitionDuration: options.transitionDuration ?? 500,
      swipeThreshold: options.swipeThreshold ?? 50,
      prevButtonSelector: options.prevButtonSelector ?? '.carousel-btn.prev',
      nextButtonSelector: options.nextButtonSelector ?? '.carousel-btn.next',
      trackSelector: options.trackSelector ?? '.carousel-track',
    };

    // Знаходимо елементи
    const track = querySelector<CarouselTrack>(this.options.trackSelector, this.carousel);
    if (!track) {
      throw new Error('Carousel track not found');
    }
    this.track = track;

    this.prevBtn = querySelector<HTMLElement>(this.options.prevButtonSelector, this.carousel);
    this.nextBtn = querySelector<HTMLElement>(this.options.nextButtonSelector, this.carousel);

    // Отримуємо слайди
    this.slides = Array.from(this.track.querySelectorAll<HTMLImageElement>('img'));
    if (this.slides.length === 0) {
      throw new Error('No slides found in carousel');
    }

    // Ініціалізуємо карусель
    this.originalCount = this.slides.length;
    this.currentIndex = 1;
    this.slideWidth = this.carousel.clientWidth;

    // Приховуємо кнопки, якщо є тільки 1 слайд
    if (this.originalCount <= 1) {
      if (this.prevBtn) {
        this.prevBtn.style.display = 'none';
      }
      if (this.nextBtn) {
        this.nextBtn.style.display = 'none';
      }
      // Якщо тільки 1 слайд, не додаємо слухачі подій
      return;
    }

    // Налаштовуємо безкінечний цикл, якщо потрібно
    if (this.options.infinite) {
      this.setupInfiniteLoop();
    }

    // Встановлюємо початкову позицію
    this.initializePosition();

    // Прив'язуємо обробники подій
    this.clickHandler = this.handleClick.bind(this);
    this.resizeHandler = this.handleResize.bind(this);
    this.touchStartHandler = this.handleTouchStart.bind(this);
    this.touchMoveHandler = this.handleTouchMove.bind(this);
    this.touchEndHandler = this.handleTouchEnd.bind(this);

    // Додаємо слухачі подій
    this.attachEventListeners();
  }

  /**
   * Налаштування безкінечного циклу (додавання дублікатів)
   */
  private setupInfiniteLoop(): void {
    const firstSlide = this.slides[0].cloneNode(true) as HTMLImageElement;
    const lastSlide = this.slides[this.slides.length - 1].cloneNode(true) as HTMLImageElement;
    
    this.track.insertBefore(lastSlide, this.slides[0]);
    this.track.appendChild(firstSlide);
    
    // Оновлюємо список слайдів
    this.slides = Array.from(this.track.querySelectorAll<HTMLImageElement>('img'));
  }

  /**
   * Ініціалізація початкової позиції
   */
  private initializePosition(): void {
    this.track.dataset.index = this.currentIndex.toString();
    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(-${this.currentIndex * this.slideWidth}px)`;
    
    setTimeout(() => {
      this.track.style.transition = `transform ${this.options.transitionDuration}ms ease`;
    }, 50);
  }

  /**
   * Обробка кліку на кнопки
   */
  private handleClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const prevBtn = target.closest(this.options.prevButtonSelector);
    const nextBtn = target.closest(this.options.nextButtonSelector);

    if (!prevBtn && !nextBtn) return;
    if (target.closest('.project-card__carousel') !== this.carousel) return;
    if (this.isTransitioning) return;

    if (prevBtn) {
      this.goToPrevious();
    } else if (nextBtn) {
      this.goToNext();
    }
  }

  /**
   * Перехід до попереднього слайду
   */
  public goToPrevious(): void {
    if (this.isTransitioning) return;
    
    this.currentIndex = this.currentIndex - 1;
    
    if (this.options.infinite) {
      if (this.currentIndex < 1) {
        this.currentIndex = 0;
      }
    } else {
      if (this.currentIndex < 0) {
        this.currentIndex = this.originalCount - 1;
      }
    }

    this.moveToIndex(this.currentIndex);
  }

  /**
   * Перехід до наступного слайду
   */
  public goToNext(): void {
    if (this.isTransitioning) return;
    
    this.currentIndex = this.currentIndex + 1;
    
    if (this.options.infinite) {
      const maxIndex = this.originalCount;
      if (this.currentIndex > maxIndex) {
        this.currentIndex = maxIndex + 1;
      }
    } else {
      if (this.currentIndex >= this.originalCount) {
        this.currentIndex = 0;
      }
    }

    this.moveToIndex(this.currentIndex);
  }

  /**
   * Перехід до конкретного індексу
   */
  public goToIndex(index: number): void {
    if (this.isTransitioning) return;
    
    if (this.options.infinite) {
      if (index < 0) index = 0;
      if (index > this.originalCount + 1) index = this.originalCount + 1;
    } else {
      if (index < 0) index = 0;
      if (index >= this.originalCount) index = this.originalCount - 1;
    }

    this.currentIndex = index;
    this.moveToIndex(this.currentIndex);
  }

  /**
   * Переміщення до індексу з анімацією
   */
  private moveToIndex(index: number): void {
    this.isTransitioning = true;
    this.track.dataset.index = index.toString();
    this.track.style.transition = `transform ${this.options.transitionDuration}ms ease`;
    this.track.style.transform = `translateX(-${index * this.slideWidth}px)`;

    if (this.options.infinite) {
      this.track.addEventListener('transitionend', this.handleTransitionEnd.bind(this), { once: true });
    } else {
      setTimeout(() => {
        this.isTransitioning = false;
      }, this.options.transitionDuration);
    }
  }

  /**
   * Обробка завершення анімації переходу (для безкінечного циклу)
   */
  private handleTransitionEnd(event: TransitionEvent): void {
    if (event.target !== this.track) return;
    
    const currentIndex = getDatasetNumber(this.track, 'index', 1);
    
    // Якщо ми на дублікаті останнього (індекс 0), переходимо на останнє оригінальне
    if (currentIndex === 0) {
      this.track.style.transition = 'none';
      this.track.dataset.index = this.originalCount.toString();
      this.track.style.transform = `translateX(-${this.originalCount * this.slideWidth}px)`;
      this.currentIndex = this.originalCount;
      setTimeout(() => {
        this.track.style.transition = `transform ${this.options.transitionDuration}ms ease`;
      }, 50);
    }
    // Якщо ми на дублікаті першого (індекс originalCount + 1), переходимо на перше оригінальне
    else if (currentIndex === this.originalCount + 1) {
      this.track.style.transition = 'none';
      this.track.dataset.index = '1';
      this.track.style.transform = `translateX(-${this.slideWidth}px)`;
      this.currentIndex = 1;
      setTimeout(() => {
        this.track.style.transition = `transform ${this.options.transitionDuration}ms ease`;
      }, 50);
    }
    
    this.isTransitioning = false;
  }

  /**
   * Обробка зміни розміру вікна
   */
  private handleResize(): void {
    this.slideWidth = this.carousel.clientWidth;
    const index = getDatasetNumber(this.track, 'index', 1);
    this.track.style.transform = `translateX(-${index * this.slideWidth}px)`;
  }

  /**
   * Обробка початку дотику (для свайпу)
   */
  private handleTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0].clientX;
  }

  /**
   * Обробка руху дотику
   */
  private handleTouchMove(e: TouchEvent): void {
    this.touchEndX = e.touches[0].clientX;
  }

  /**
   * Обробка завершення дотику (свайп)
   */
  private handleTouchEnd(): void {
    if (this.isTransitioning) return;
    
    const threshold = this.options.swipeThreshold;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Свайп вліво - наступний слайд
        this.goToNext();
      } else {
        // Свайп вправо - попередній слайд
        this.goToPrevious();
      }
    }

    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  /**
   * Додавання слухачів подій
   */
  private attachEventListeners(): void {
    // Кліки на кнопки (делегування подій)
    document.addEventListener('click', this.clickHandler);

    // Зміна розміру вікна
    window.addEventListener('resize', this.resizeHandler);

    // Touch події для свайпу
    this.carousel.addEventListener('touchstart', this.touchStartHandler);
    this.carousel.addEventListener('touchmove', this.touchMoveHandler);
    this.carousel.addEventListener('touchend', this.touchEndHandler);
  }

  /**
   * Видалення слухачів подій (для очищення)
   */
  public destroy(): void {
    document.removeEventListener('click', this.clickHandler);
    window.removeEventListener('resize', this.resizeHandler);
    this.carousel.removeEventListener('touchstart', this.touchStartHandler);
    this.carousel.removeEventListener('touchmove', this.touchMoveHandler);
    this.carousel.removeEventListener('touchend', this.touchEndHandler);
  }

  /**
   * Оновлення каруселі (наприклад, після додавання нових слайдів)
   */
  public update(): void {
    this.slides = Array.from(this.track.querySelectorAll<HTMLImageElement>('img'));
    this.originalCount = this.slides.length;
    this.slideWidth = this.carousel.clientWidth;
    
    if (this.options.infinite) {
      // Видаляємо старі дублікати, якщо вони є
      const allSlides = this.track.querySelectorAll('img');
      if (allSlides.length > this.originalCount) {
        // Логіка очищення дублікатів може бути додана за потреби
      }
      this.setupInfiniteLoop();
    }
    
    this.initializePosition();
  }

  /**
   * Отримати поточний індекс
   */
  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Отримати кількість слайдів
   */
  public getSlideCount(): number {
    return this.originalCount;
  }
}
