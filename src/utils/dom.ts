// DOM утиліти

/**
 * Беwithпечний querySelector with типами
 */
export function querySelector<T extends HTMLElement>(
  selector: string,
  parent: Document | HTMLElement = document
): T | null {
  return parent.querySelector<T>(selector);
}

/**
 * Беwithпечний querySelectorAll with типами
 */
export function querySelectorAll<T extends HTMLElement>(
  selector: string,
  parent: Document | HTMLElement = document
): NodeListOf<T> {
  return parent.querySelectorAll<T>(selector);
}

/**
 * Перевірка чи елемент існує
 */
export function elementExists<T extends HTMLElement>(
  element: T | null
): element is T {
  return element !== null;
}

/**
 * Get числове withначення with dataset
 */
export function getDatasetNumber(
  element: HTMLElement,
  key: string,
  defaultValue: number = 0
): number {
  const value = element.dataset[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}
