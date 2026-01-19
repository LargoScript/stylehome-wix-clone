// Types for AOS (Animate On Scroll)

export interface AOSOptions {
  offset?: number;
  delay?: number;
  duration?: number;
  easing?: string;
  once?: boolean;
  mirror?: boolean;
  anchorPlacement?: 'top-bottom' | 'top-center' | 'top-top' | 'center-bottom' | 'center-center' | 'center-top' | 'bottom-bottom' | 'bottom-center' | 'bottom-top';
  disable?: boolean | 'mobile' | 'phone' | 'tablet' | function;
  startEvent?: string;
  animatedClassName?: string;
  initClassName?: string;
  useClassNames?: boolean;
  disableMutationObserver?: boolean;
  debounceDelay?: number;
  throttleDelay?: number;
}

declare global {
  interface Window {
    AOS: {
      init: (options?: AOSOptions) => void;
      refresh: () => void;
      refreshHard: () => void;
    };
  }
}
