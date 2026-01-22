// Lightbox component for viewing images in fullscreen

export interface LightboxOptions {
  /** Animation duration in ms */
  animationDuration?: number;
  /** Enable swipe navigation */
  enableSwipe?: boolean;
  /** Enable keyboard navigation */
  enableKeyboard?: boolean;
  /** Close on background click */
  closeOnBackdrop?: boolean;
}

export class Lightbox {
  private overlay: HTMLElement | null = null;
  private content: HTMLElement | null = null;
  private image: HTMLImageElement | null = null;
  private closeBtn: HTMLElement | null = null;
  private prevBtn: HTMLElement | null = null;
  private nextBtn: HTMLElement | null = null;
  private counter: HTMLElement | null = null;
  
  private images: string[] = [];
  private currentIndex: number = 0;
  private isOpen: boolean = false;
  
  private options: Required<LightboxOptions>;
  
  // Touch handling
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  
  // Bound handlers for cleanup
  private keydownHandler: (e: KeyboardEvent) => void;
  private touchStartHandler: (e: TouchEvent) => void;
  private touchEndHandler: (e: TouchEvent) => void;

  constructor(options: LightboxOptions = {}) {
    this.options = {
      animationDuration: options.animationDuration ?? 300,
      enableSwipe: options.enableSwipe ?? true,
      enableKeyboard: options.enableKeyboard ?? true,
      closeOnBackdrop: options.closeOnBackdrop ?? true,
    };
    
    this.keydownHandler = this.handleKeydown.bind(this);
    this.touchStartHandler = this.handleTouchStart.bind(this);
    this.touchEndHandler = this.handleTouchEnd.bind(this);
    
    this.createLightbox();
  }

  /**
   * Create lightbox DOM elements
   */
  private createLightbox(): void {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'lightbox-overlay';
    this.overlay.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <button class="lightbox-nav lightbox-prev" aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="lightbox-image-container">
          <img class="lightbox-image" src="" alt="Fullscreen image">
        </div>
        <button class="lightbox-nav lightbox-next" aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        <div class="lightbox-counter"></div>
      </div>
    `;
    
    document.body.appendChild(this.overlay);
    
    // Get references
    this.content = this.overlay.querySelector('.lightbox-content');
    this.image = this.overlay.querySelector('.lightbox-image');
    this.closeBtn = this.overlay.querySelector('.lightbox-close');
    this.prevBtn = this.overlay.querySelector('.lightbox-prev');
    this.nextBtn = this.overlay.querySelector('.lightbox-next');
    this.counter = this.overlay.querySelector('.lightbox-counter');
    
    // Add event listeners
    this.closeBtn?.addEventListener('click', () => this.close());
    this.prevBtn?.addEventListener('click', () => this.showPrevious());
    this.nextBtn?.addEventListener('click', () => this.showNext());
    
    if (this.options.closeOnBackdrop) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }
  }

  /**
   * Open lightbox with images
   */
  public open(images: string[], startIndex: number = 0): void {
    if (this.isOpen || !this.overlay) return;
    
    this.images = images;
    this.currentIndex = startIndex;
    this.isOpen = true;
    
    // Show overlay
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Show current image
    this.showImage(this.currentIndex);
    
    // Update navigation visibility
    this.updateNavigation();
    
    // Add event listeners
    if (this.options.enableKeyboard) {
      document.addEventListener('keydown', this.keydownHandler);
    }
    
    if (this.options.enableSwipe && this.content) {
      this.content.addEventListener('touchstart', this.touchStartHandler);
      this.content.addEventListener('touchend', this.touchEndHandler);
    }
  }

  /**
   * Close lightbox
   */
  public close(): void {
    if (!this.isOpen || !this.overlay) return;
    
    this.isOpen = false;
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Remove event listeners
    document.removeEventListener('keydown', this.keydownHandler);
    
    if (this.content) {
      this.content.removeEventListener('touchstart', this.touchStartHandler);
      this.content.removeEventListener('touchend', this.touchEndHandler);
    }
  }

  /**
   * Show specific image
   */
  private showImage(index: number): void {
    if (!this.image || !this.counter) return;
    
    // Add loading state
    this.image.classList.add('loading');
    
    const img = new Image();
    img.onload = () => {
      if (this.image) {
        this.image.src = this.images[index];
        this.image.classList.remove('loading');
      }
    };
    img.src = this.images[index];
    
    // Update counter
    this.counter.textContent = `${index + 1} / ${this.images.length}`;
  }

  /**
   * Show previous image
   */
  public showPrevious(): void {
    if (this.images.length <= 1) return;
    
    this.currentIndex = this.currentIndex > 0 
      ? this.currentIndex - 1 
      : this.images.length - 1;
    
    this.showImage(this.currentIndex);
  }

  /**
   * Show next image
   */
  public showNext(): void {
    if (this.images.length <= 1) return;
    
    this.currentIndex = this.currentIndex < this.images.length - 1 
      ? this.currentIndex + 1 
      : 0;
    
    this.showImage(this.currentIndex);
  }

  /**
   * Update navigation buttons visibility
   */
  private updateNavigation(): void {
    const shouldShowNav = this.images.length > 1;
    
    if (this.prevBtn) {
      this.prevBtn.style.display = shouldShowNav ? 'flex' : 'none';
    }
    if (this.nextBtn) {
      this.nextBtn.style.display = shouldShowNav ? 'flex' : 'none';
    }
    if (this.counter) {
      this.counter.style.display = shouldShowNav ? 'block' : 'none';
    }
  }

  /**
   * Handle keyboard events
   */
  private handleKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowLeft':
        this.showPrevious();
        break;
      case 'ArrowRight':
        this.showNext();
        break;
    }
  }

  /**
   * Handle touch start
   */
  private handleTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0].clientX;
  }

  /**
   * Handle touch end
   */
  private handleTouchEnd(e: TouchEvent): void {
    this.touchEndX = e.changedTouches[0].clientX;
    const diff = this.touchStartX - this.touchEndX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.showNext();
      } else {
        this.showPrevious();
      }
    }
  }

  /**
   * Destroy lightbox
   */
  public destroy(): void {
    this.close();
    this.overlay?.remove();
  }
}

// Singleton instance for global use
let lightboxInstance: Lightbox | null = null;

/**
 * Get or create global lightbox instance
 */
export function getLightbox(): Lightbox {
  if (!lightboxInstance) {
    lightboxInstance = new Lightbox();
  }
  return lightboxInstance;
}

/**
 * Initialize lightbox for carousel images
 * Adds click handlers to all carousel images
 */
export function initCarouselLightbox(): void {
  const lightbox = getLightbox();
  
  // Add click handlers to all carousel images
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    // Check if clicked on carousel image
    if (target.tagName === 'IMG' && target.closest('.carousel-track')) {
      e.preventDefault();
      e.stopPropagation();
      
      const carousel = target.closest('.project-card__carousel');
      if (!carousel) return;
      
      // Get all original images (exclude clones for infinite loop)
      const track = carousel.querySelector('.carousel-track');
      if (!track) return;
      
      const allImages = Array.from(track.querySelectorAll('img'));
      
      // Filter out duplicate images (clones for infinite loop)
      // Clone images have same src, we need unique ones
      const seenSrcs = new Set<string>();
      const uniqueImages: string[] = [];
      
      allImages.forEach(img => {
        const src = (img as HTMLImageElement).src;
        if (!seenSrcs.has(src)) {
          seenSrcs.add(src);
          uniqueImages.push(src);
        }
      });
      
      // Find clicked image index
      const clickedSrc = (target as HTMLImageElement).src;
      let startIndex = uniqueImages.indexOf(clickedSrc);
      if (startIndex === -1) startIndex = 0;
      
      // Open lightbox
      lightbox.open(uniqueImages, startIndex);
    }
  });
}
