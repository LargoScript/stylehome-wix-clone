// Типи for каруселей

export interface CarouselConfig {
  infinite: boolean;
  transitionDuration: number;
  swipeThreshold: number;
}

export interface CarouselState {
  currentIndex: number;
  totalSlides: number;
  isTransitioning: boolean;
}

export interface CarouselElements {
  carousel: HTMLElement;
  track: HTMLElement;
  prevBtn: HTMLElement | null;
  nextBtn: HTMLElement | null;
  slides: HTMLImageElement[];
}
