# MyModules - Component Library

Reusable TypeScript components library for building modern web interfaces.

## 📦 Components

### FAQ Component

Accordion-style FAQ section with smooth animations and responsive design.

#### Features

- ✅ Smooth accordion animations
- ✅ Auto-close other items when opening one
- ✅ Responsive design
- ✅ AOS (Animate On Scroll) support
- ✅ Customizable styling
- ✅ Background image support

#### Usage

```typescript
import { generateFAQHTML, insertFAQ, updateFAQ, type FAQConfig } from './MyModules';

// Example 1: Generate HTML string
const faqConfig: FAQConfig = {
  title: 'FAQ',
  subtitle: 'Frequently Asked Questions',
  backgroundImage: 'img/background/form_background.jpg',
  items: [
    {
      question: 'How long does a renovation take?',
      answer: 'Typically, a kitchen or bathroom renovation takes 2 to 4 weeks, depending on the scope of work and project complexity.',
      aosDelay: 100
    },
    {
      question: 'Do you help with material selection and design?',
      answer: 'Yes, we offer design services and assist in selecting the best materials to match your budget and style.',
      aosDelay: 150
    }
  ],
  sectionId: 'faq',
  enableAOS: true
};

const html = generateFAQHTML(faqConfig);
document.querySelector('#faq-container')!.innerHTML = html;

// Example 2: Insert directly into DOM
const faqSection = insertFAQ('#faq-container', faqConfig);

// Example 3: Update existing FAQ
updateFAQ('#faq', {
  title: 'Updated Title',
  items: [
    {
      question: 'New Question?',
      answer: 'New Answer!'
    }
  ]
});
```

#### API Reference

##### `FAQItem`

```typescript
interface FAQItem {
  question: string;      // Question text
  answer: string;       // Answer text
  aosDelay?: number;    // AOS animation delay (optional)
}
```

##### `FAQConfig`

```typescript
interface FAQConfig {
  title: string;                    // Section title
  subtitle: string;                 // Section subtitle
  backgroundImage?: string;         // Background image URL (optional)
  items: FAQItem[];                // FAQ items array
  sectionId?: string;              // Section ID (default: 'faq')
  additionalClasses?: string;      // Additional CSS classes
  enableAOS?: boolean;             // Enable AOS animations (default: true)
}
```

##### Functions

- **`generateFAQHTML(config: FAQConfig): string`**
  - Generates HTML string for FAQ section
  - Returns: HTML string

- **`insertFAQ(container: HTMLElement | string, config: FAQConfig): HTMLElement | null`**
  - Inserts FAQ section into DOM
  - Automatically initializes accordion functionality
  - Returns: FAQ section element or null

- **`updateFAQ(faqElement: HTMLElement | string, config: Partial<FAQConfig>): HTMLElement | null`**
  - Updates existing FAQ section
  - Re-initializes accordion for new items
  - Returns: Updated FAQ element or null

#### CSS Classes

The component uses the following CSS classes (should be defined in your stylesheet):

- `.faq` - Main section container
- `.faq__overlay` - Overlay wrapper
- `.faq__container` - Content container
- `.faq__title` - Section title
- `.faq__subtitle` - Section subtitle
- `.faq__accordion` - Accordion container
- `.faq__item` - Individual FAQ item
- `.faq__item.active` - Active FAQ item
- `.faq__question` - Question button/text
- `.faq__answer` - Answer container

#### Example HTML Output

```html
<section class="faq" id="faq" data-aos="fade-up" style="background: url('img/background/form_background.jpg') center / cover no-repeat;">
  <div class="faq__overlay">
    <div class="faq__container">
      <h2 class="faq__title" data-aos="fade-up">FAQ</h2>
      <h5 class="faq__subtitle" data-aos="fade-up" data-aos-delay="50">Frequently Asked Questions</h5>
      <div class="faq__accordion">
        <div class="faq__item" data-aos="fade-up" data-aos-delay="100">
          <div class="faq__question">How long does a renovation take?</div>
          <div class="faq__answer">
            <p>Typically, a kitchen or bathroom renovation takes 2 to 4 weeks...</p>
          </div>
        </div>
        <!-- More items... -->
      </div>
    </div>
  </div>
</section>
```

## 🚀 Installation

Simply copy the `MyModules` folder to your project and import components:

```typescript
import { generateFAQHTML, insertFAQ } from './MyModules';
```

## 📝 Notes

- The accordion automatically handles opening/closing items
- Only one item can be open at a time
- Height is automatically calculated and updated on window resize
- AOS animations are optional and can be disabled

## 🔄 Future Components

More components will be added to this library:
- Hero Component
- Footer Component
- Carousel Component
- Form Component
- And more...
