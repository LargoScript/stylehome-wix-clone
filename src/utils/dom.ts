// DOM utilities

/**
 * Safe querySelector with types
 */
export function querySelector<T extends HTMLElement>(
  selector: string,
  parent: Document | HTMLElement = document
): T | null {
  return parent.querySelector<T>(selector);
}

/**
 * Safe querySelectorAll with types
 */
export function querySelectorAll<T extends HTMLElement>(
  selector: string,
  parent: Document | HTMLElement = document
): NodeListOf<T> {
  return parent.querySelectorAll<T>(selector);
}

/**
 * Check if element exists
 */
export function elementExists<T extends HTMLElement>(
  element: T | null
): element is T {
  return element !== null;
}

/**
 * Get numeric value from dataset
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
