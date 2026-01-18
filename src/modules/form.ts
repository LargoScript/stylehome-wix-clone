// Form module - auto-resize textarea

import { querySelector } from '../utils/dom';

/**
 * Initialize automatic textarea resize
 */
export function initForm(): void {
  const textarea = querySelector<HTMLTextAreaElement>('.form__textarea');
  if (!textarea) return;
  
  // Set initial height
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
  
  // Automatically change height on text input
  textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    const newHeight = Math.min(this.scrollHeight, 400); // Maximum height 400px
    this.style.height = `${newHeight}px`;
  });
  
  // Also on page load
  window.addEventListener('load', () => {
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 400);
    textarea.style.height = `${newHeight}px`;
  });
}
