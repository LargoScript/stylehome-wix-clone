// Form module - auto-resize textarea and form validation

import { querySelector, querySelectorAll } from '../utils/dom';

/**
 * Initialize automatic textarea resize
 */
function initTextareaResize(): void {
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

/**
 * Validate form field
 */
function validateField(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
  const isValid = field.checkValidity();
  
  if (!isValid) {
    field.classList.add('error');
  } else {
    field.classList.remove('error');
  }
  
  return isValid;
}

/**
 * Validate entire form
 */
function validateForm(form: HTMLFormElement): boolean {
  const requiredFields = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    'input[required], select[required], textarea[required]'
  );
  
  let isFormValid = true;
  
  requiredFields.forEach(field => {
    const isValid = validateField(field);
    if (!isValid) {
      isFormValid = false;
    }
  });
  
  return isFormValid;
}

/**
 * Add required class to labels and make asterisks red
 */
function markRequiredLabels(): void {
  const form = querySelector<HTMLFormElement>('.consultation__form');
  if (!form) return;
  
  const requiredFields = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    'input[required], select[required], textarea[required]'
  );
  
  requiredFields.forEach(field => {
    const label = form.querySelector<HTMLLabelElement>(`label[for="${field.id}"]`);
    if (label) {
      // Replace asterisk in label text with red styled span
      const labelText = label.innerHTML;
      // Check if asterisk exists and not already wrapped in span
      if (labelText.includes('*') && !labelText.includes('<span')) {
        label.innerHTML = labelText.replace(/\s*\*\s*$/, ' <span style="color: #8b0000; font-weight: 700;">*</span>');
      }
      label.classList.add('required');
    }
  });
}

/**
 * Initialize form validation
 */
function initFormValidation(): void {
  const form = querySelector<HTMLFormElement>('.consultation__form');
  if (!form) return;
  
  // Mark required labels
  markRequiredLabels();
  
  // Remove error class on input/change
  const fields = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    'input, select, textarea'
  );
  
  fields.forEach(field => {
    field.addEventListener('input', () => {
      if (field.hasAttribute('required')) {
        validateField(field);
      }
    });
    
    field.addEventListener('change', () => {
      if (field.hasAttribute('required')) {
        validateField(field);
      }
    });
  });
  
  // Validate on form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const isValid = validateForm(form);
    
    if (isValid) {
      // Form is valid, you can submit it here
      console.log('Form is valid, submitting...');
      // form.submit(); // Uncomment when backend is ready
    } else {
      // Scroll to first error field
      const firstError = form.querySelector<HTMLElement>('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  });
}

/**
 * Initialize form module
 */
export function initForm(): void {
  initTextareaResize();
  initFormValidation();
}
