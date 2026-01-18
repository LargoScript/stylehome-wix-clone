// Компоnotнт carousel - reusable class for роботи with carousels

import { querySelector, querySelectorAll, getDatasetNumber } from '../utils/dom';
import type { CarouselTrack } from '../types/dom';

export interface CarouselOptions {
  /** Whether to use беwithкіnotчний cycle */
  infinite?: boolean;
  /** Duration animation transition in ms */
  transitionDuration?: number;
  /** Threshold for свайпу on mobile devices */
  swipeThreshold?: number;
  /** Selector for buttons "Поbeforeнє" */
  prevButtonSelector?: string;
  /** Selector for buttons "Наступnot" */
  nextButtonSelector?: string;
  /** Selector for track carousel */
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
  
  // Handlers events for removal
  private clickHandler!: (e: MouseEvent) => void;
  private resizeHandler!: () => void;
  private touchStartHandler!: (e: TouchEvent) => void;
  private touchMoveHandler!: (e: TouchEvent) => void;
  private touchEndHandler!: () => void;
  
  private touchStartX: number = 0;
  private touchEndX: number = 0;

  constructor(
    carouselElement: HTMLElement,
    options: CarouselOptions = {}
  ) {
    this.carousel = carouselElement;
    
    // Set опції default
    this.options = {
      infinite: options.infinite ?? true,
      transitionDuration: options.transitionDuration ?? 500,
      swipeThreshold: options.swipeThreshold ?? 50,
      prevButtonSelector: options.prevButtonSelector ?? '.carousel-btn.prev',
      nextButtonSelector: options.nextButtonSelector ?? '.carousel-btn.next',
      trackSelector: options.trackSelector ?? '.carousel-track',
    };

    // Find elements
    const track = querySelector<CarouselTrack>(this.options.trackSelector, this.carousel);
    if (!track) {
      throw new Error('Carousel track not found');
    }
    this.track = track;

    this.prevBtn = querySelector<HTMLElement>(this.options.prevButtonSelector, this.carousel);
    this.nextBtn = querySelector<HTMLElement>(this.options.nextButtonSelector, this.carousel);

    // Get slides
    this.slides = Array.from(this.track.querySelectorAll<HTMLImageElement>('img'));
    if (this.slides.length === 0) {
      throw new Error('No slides found in carousel');
    }

    // Initialize карусель
    this.originalCount = this.slides.length;
    this.currentIndex = 1;
    this.slideWidth = this.carousel.clientWidth;

    // Hide buttons, if є only 1 slide
    if (this.originalCount <= 1) {
      if (this.prevBtn) {
        this.prevBtn.style.display = 'none';
      }
      if (this.nextBtn) {
        this.nextBtn.style.display = 'none';
      }
      // If only 1 slide, not add listeners events
      return;
    }

    // Setup беwithкіnotчний cycle, if needed
    if (this.options.infinite) {
      this.setupInfiniteLoop();
    }

    // Set initial position
    this.initializePosition();

    // Прив'яwithуємо handlers events
    this.clickHandler = this.handleClick.bind(this);
    this.resizeHandler = this.handleResize.bind(this);
    this.touchStartHandler = this.handleTouchStart.bind(this);
    this.touchMoveHandler = this.handleTouchMove.bind(this);
    this.touchEndHandler = this.handleTouchEnd.bind(this);

    // Add listeners events
    this.attachEventListeners();
  }

  /**
   * Settings беwithкіnotчного cycleу (додавання дублікатів)
   */
  private setupInfiniteLoop(): void {
    const firstSlide = this.slides[0].cloneNode(true) as HTMLImageElement;
    const lastSlide = this.slides[this.slides.length - 1].cloneNode(true) as HTMLImageElement;
    
    this.track.insertBefore(lastSlide, this.slides[0]);
    this.track.appendChild(firstSlide);
    
    // Update список slideів
    this.slides = Array.from(this.track.querySelectorAll<HTMLImageElement>('img'));
  }

  /**
   * Initialize початкової поwithиції
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
   * Обробка кліку на buttons
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
   * Перехід до поbeforeнього slideу
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
   * Перехід до наступного slideу
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
   * Переміщення до індексу with анімацією
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
   * Обробка withавершення animation transition (for беwithкіnotчного cycleу)
   */
  private handleTransitionEnd(event: TransitionEvent): void {
    if (event.target !== this.track) return;
    
    const currentIndex = getDatasetNumber(this.track, 'index', 1);
    
    // If ми на дублікаті останнього (індекс 0), переходимо на останнє оригінальnot
    if (currentIndex === 0) {
      this.track.style.transition = 'none';
      this.track.dataset.index = this.originalCount.toString();
      this.track.style.transform = `translateX(-${this.originalCount * this.slideWidth}px)`;
      this.currentIndex = this.originalCount;
      setTimeout(() => {
        this.track.style.transition = `transform ${this.options.transitionDuration}ms ease`;
      }, 50);
    }
    // If ми на дублікаті першого (індекс originalCount + 1), переходимо на перше оригінальnot
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
   * Обробка withміни size window
   */
  private handleResize(): void {
    this.slideWidth = this.carousel.clientWidth;
    const index = getDatasetNumber(this.track, 'index', 1);
    this.track.style.transform = `translateX(-${index * this.slideWidth}px)`;
  }

  /**
   * Обробка початку дотику (for свайпу)
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
   * Обробка withавершення дотику (свайп)
   */
  private handleTouchEnd(): void {
    if (this.isTransitioning) return;
    
    const threshold = this.options.swipeThreshold;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Свайп вліво - наступний slide
        this.goToNext();
      } else {
        // Свайп вправо - поbeforeній slide
        this.goToPrevious();
      }
    }

    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  /**
   * Додавання listeners events
   */
  private attachEventListeners(): void {
    // Кліки на buttons (делегування events)
    document.addEventListener('click', this.clickHandler);

    // Withміна size window
    window.addEventListener('resize', this.resizeHandler);

    // Touch події for свайпу
    this.carousel.addEventListener('touchstart', this.touchStartHandler);
    this.carousel.addEventListener('touchmove', this.touchMoveHandler);
    this.carousel.addEventListener('touchend', this.touchEndHandler);
  }

  /**
   * Removal listeners events (for cleanup)
   */
  public destroy(): void {
    document.removeEventListener('click', this.clickHandler);
    window.removeEventListener('resize', this.resizeHandler);
    this.carousel.removeEventListener('touchstart', this.touchStartHandler);
    this.carousel.removeEventListener('touchmove', this.touchMoveHandler);
    this.carousel.removeEventListener('touchend', this.touchEndHandler);
  }

  /**
   * Оновлення carousel (наприклад, after додавання нових slideів)
   */
  public update(): void {
    this.slides = Array.from(this.track.querySelectorAll<HTMLImageElement>('img'));
    this.originalCount = this.slides.length;
    this.slideWidth = this.carousel.clientWidth;
    
    if (this.options.infinite) {
      // Видаляємо старі дублікати, if вони є
      const allSlides = this.track.querySelectorAll('img');
      if (allSlides.length > this.originalCount) {
        // Логіка cleanup дублікатів може бути додана withа потреби
      }
      this.setupInfiniteLoop();
    }
    
    this.initializePosition();
  }

  /**
   * Get current індекс
   */
  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Get кількість slideів
   */
  public getSlideCount(): number {
    return this.originalCount;
  }
}
