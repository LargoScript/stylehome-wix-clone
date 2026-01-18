// Типи for navigation

export interface NavigationConfig {
  headerHeight: number;
  scrollOffset: number;
  smoothScrollDelay: number;
}

export type CloseMenuFunction = () => void;
export type CheckCollisionFunction = () => void;

export interface NavigationElements {
  header: HTMLElement | null;
  nav: HTMLElement | null;
  burger: HTMLElement | null;
  actions: HTMLElement | null;
  navLinks: NodeListOf<HTMLAnchorElement>;
}
