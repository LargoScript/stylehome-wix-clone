// Phone dropdown module for mobile devices
// Replaces phone number text with icon + dropdown on small screens

/**
 * Phone contact configuration
 */
interface PhoneContact {
  number: string;
  label: string;
  href: string;
}

/**
 * Default phone contacts
 */
const phoneContacts: PhoneContact[] = [
  {
    number: '+1 (360) 859 6482',
    label: 'Call us',
    href: 'tel:+13608596482'
  }
];

/**
 * Create phone dropdown HTML
 */
function createPhoneDropdown(contacts: PhoneContact[]): string {
  const dropdownItems = contacts.map(contact => `
    <a href="${contact.href}">
      <svg viewBox="0 0 24 24">
        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
      </svg>
      ${contact.number}
    </a>
  `).join('');

  return `
    <button class="header__phone-btn" aria-label="Phone menu" aria-expanded="false">
      <svg viewBox="0 0 24 24">
        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
      </svg>
    </button>
    <div class="header__phone-dropdown">
      ${dropdownItems}
    </div>
  `;
}

/**
 * Initialize phone dropdown functionality
 */
export function initPhoneDropdown(): void {
  // Find all phone links in header
  const phoneLinks = document.querySelectorAll<HTMLAnchorElement>('.header__phone');
  
  phoneLinks.forEach(phoneLink => {
    // Check if already wrapped
    if (phoneLink.parentElement?.classList.contains('header__phone-wrapper')) {
      return;
    }
    
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'header__phone-wrapper';
    
    // Insert wrapper before phone link
    phoneLink.parentNode?.insertBefore(wrapper, phoneLink);
    
    // Move phone link into wrapper
    wrapper.appendChild(phoneLink);
    
    // Add dropdown HTML
    wrapper.insertAdjacentHTML('beforeend', createPhoneDropdown(phoneContacts));
    
    // Get button reference
    const btn = wrapper.querySelector<HTMLButtonElement>('.header__phone-btn');
    
    // Toggle dropdown on button click
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isActive = wrapper.classList.contains('active');
      
      // Close all other dropdowns
      document.querySelectorAll('.header__phone-wrapper.active').forEach(w => {
        w.classList.remove('active');
        w.querySelector('.header__phone-btn')?.setAttribute('aria-expanded', 'false');
      });
      
      // Toggle current
      if (!isActive) {
        wrapper.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target as Node)) {
        wrapper.classList.remove('active');
        btn?.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && wrapper.classList.contains('active')) {
        wrapper.classList.remove('active');
        btn?.setAttribute('aria-expanded', 'false');
      }
    });
  });
}
