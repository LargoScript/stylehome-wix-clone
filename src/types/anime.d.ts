// Типи для Anime.js

export interface AnimeConfig {
  targets: string | HTMLElement | HTMLElement[] | NodeList;
  opacity?: number | number[];
  translateX?: number | number[];
  translateY?: number | number[];
  scale?: number | number[];
  rotate?: number | string | number[] | string[];
  duration?: number;
  delay?: number | ((el: HTMLElement, index: number) => number);
  easing?: string;
  loop?: boolean | number;
  direction?: 'normal' | 'reverse' | 'alternate';
  autoplay?: boolean;
  begin?: (anim: any) => void;
  update?: (anim: any) => void;
  complete?: (anim: any) => void;
}

export interface AnimeInstance {
  play: () => void;
  pause: () => void;
  restart: () => void;
  reverse: () => void;
  seek: (time: number) => void;
  progress: number;
  paused: boolean;
  completed: boolean;
}

declare global {
  interface Window {
    anime: {
      (params: AnimeConfig): AnimeInstance;
      stagger: (value: number, options?: { from?: 'first' | 'last' | 'center' | number }) => number;
      random: (min: number, max: number) => number;
      timeline: (params?: Partial<AnimeConfig>) => AnimeTimeline;
    };
  }
}

export interface AnimeTimeline {
  add: (params: AnimeConfig) => AnimeTimeline;
  play: () => void;
  pause: () => void;
}
