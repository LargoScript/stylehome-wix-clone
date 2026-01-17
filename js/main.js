// Main JavaScript file
console.log('Style Homes website loaded');

// ===== CAROUSEL FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize carousels with infinite loop
  document.querySelectorAll('.project-card__carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    if (!track) return;
    
    const slides = Array.from(track.querySelectorAll('img'));
    if (slides.length === 0) return;
    
    // Додаємо дублікати для безшовного циклу
    const firstSlide = slides[0].cloneNode(true);
    const lastSlide = slides[slides.length - 1].cloneNode(true);
    
    track.insertBefore(lastSlide, slides[0]);
    track.appendChild(firstSlide);
    
    // Встановлюємо початкову позицію на перше оригінальне зображення (не дублікат)
    const slideWidth = carousel.clientWidth;
    track.dataset.index = '1'; // Починаємо з першого оригінального (після дубліката останнього)
    track.style.transition = 'none';
    track.style.transform = `translateX(-${slideWidth}px)`;
    
    // Відновлюємо transition після встановлення початкової позиції
    setTimeout(() => {
      track.style.transition = 'transform 0.5s ease';
    }, 50);
  });

  // Click handlers for carousel buttons with infinite loop
  document.addEventListener('click', (e) => {
    const prevBtn = e.target.closest('.carousel-btn.prev');
    const nextBtn = e.target.closest('.carousel-btn.next');

    if (!prevBtn && !nextBtn) return;

    const carousel = e.target.closest('.project-card__carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const allSlides = Array.from(track.querySelectorAll('img'));
    if (allSlides.length === 0) return;
    
    // Кількість оригінальних зображень (без дублікатів)
    const originalCount = allSlides.length - 2;
    let index = parseInt(track.dataset.index || '1');
    const slideWidth = carousel.clientWidth;

    // Видаляємо попередні обробники transitionend для цього track
    const handleTransitionEnd = (event) => {
      if (event.target !== track) return;
      
      const currentIndex = parseInt(track.dataset.index || '1');
      
      // Якщо ми на дублікаті останнього (індекс 0), переходимо на останнє оригінальне
      if (currentIndex === 0) {
        track.style.transition = 'none';
        track.dataset.index = originalCount;
        track.style.transform = `translateX(-${originalCount * slideWidth}px)`;
        setTimeout(() => {
          track.style.transition = 'transform 0.5s ease';
        }, 50);
      }
      // Якщо ми на дублікаті першого (індекс originalCount + 1), переходимо на перше оригінальне
      else if (currentIndex === originalCount + 1) {
        track.style.transition = 'none';
        track.dataset.index = '1';
        track.style.transform = `translateX(-${slideWidth}px)`;
        setTimeout(() => {
          track.style.transition = 'transform 0.5s ease';
        }, 50);
      }
      
      track.removeEventListener('transitionend', handleTransitionEnd);
    };

    track.style.transition = 'transform 0.5s ease';
    track.addEventListener('transitionend', handleTransitionEnd);

    if (prevBtn) {
      index = index - 1;
      // Якщо досягли дубліката останнього (індекс 0), дозволяємо анімації дійти до нього
      if (index < 1) {
        index = 0; // Дублікат останнього
      }
    }
    
    if (nextBtn) {
      index = index + 1;
      // Якщо досягли дубліката першого (індекс originalCount + 1), дозволяємо анімації дійти до нього
      if (index > originalCount) {
        index = originalCount + 1; // Дублікат першого
      }
    }

    track.dataset.index = index;
    track.style.transform = `translateX(-${index * slideWidth}px)`;
  });

  // Resize handler
  window.addEventListener('resize', () => {
    document.querySelectorAll('.project-card__carousel').forEach(carousel => {
      const track = carousel.querySelector('.carousel-track');
      if (!track) return;
      const index = parseInt(track.dataset.index || '1');
      const slideWidth = carousel.clientWidth;
      track.style.transform = `translateX(-${index * slideWidth}px)`;
    });
  });

  // Touch/swipe support for mobile
  document.querySelectorAll('.project-card__carousel').forEach(carousel => {
    let startX = 0;
    let endX = 0;

    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.querySelectorAll('img'));

    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', () => {
      const allSlides = Array.from(track.querySelectorAll('img'));
      const originalCount = allSlides.length - 2;
      let index = parseInt(track.dataset.index || '1');
      const threshold = 50;
      const slideWidth = carousel.clientWidth;

      // Обробник для transitionend
      const handleTransitionEnd = (event) => {
        if (event.target !== track) return;
        
        const currentIndex = parseInt(track.dataset.index || '1');
        
        if (currentIndex === 0) {
          track.style.transition = 'none';
          track.dataset.index = originalCount;
          track.style.transform = `translateX(-${originalCount * slideWidth}px)`;
          setTimeout(() => {
            track.style.transition = 'transform 0.5s ease';
          }, 50);
        } else if (currentIndex === originalCount + 1) {
          track.style.transition = 'none';
          track.dataset.index = '1';
          track.style.transform = `translateX(-${slideWidth}px)`;
          setTimeout(() => {
            track.style.transition = 'transform 0.5s ease';
          }, 50);
        }
        
        track.removeEventListener('transitionend', handleTransitionEnd);
      };

      track.style.transition = 'transform 0.5s ease';
      track.addEventListener('transitionend', handleTransitionEnd);

      if (startX - endX > threshold) {
        // Свайп вліво - наступне зображення
        index = index + 1;
        if (index > originalCount) {
          index = originalCount + 1; // Дублікат першого
        }
      } else if (endX - startX > threshold) {
        // Свайп вправо - попереднє зображення
        index = index - 1;
        if (index < 1) {
          index = 0; // Дублікат останнього
        }
      }

      track.dataset.index = index;
      track.style.transform = `translateX(-${index * slideWidth}px)`;
      startX = 0;
      endX = 0;
    });
  });

  // ===== TESTIMONIALS CAROUSEL =====
  const testimonialsTrack = document.querySelector('.testimonials__track');
  const testimonialsCards = document.querySelectorAll('.testimonial-card');
  const testimonialsPrevBtn = document.querySelector('.testimonials__btn--prev');
  const testimonialsNextBtn = document.querySelector('.testimonials__btn--next');
  const testimonialsDots = document.querySelectorAll('.testimonials__dot');
  const carouselWrapper = document.querySelector('.testimonials__carousel-wrapper');
  
  if (testimonialsTrack && testimonialsCards.length > 0) {
    let currentTestimonialIndex = 0;
    
    const updateTestimonialsCarousel = () => {
      testimonialsTrack.style.transform = `translateX(-${currentTestimonialIndex * 100}%)`;
      
      // Скидаємо прокрутку картки при зміні
      if (carouselWrapper) {
        carouselWrapper.scrollTop = 0;
      }
      
      // Update dots
      testimonialsDots.forEach((dot, index) => {
        if (index === currentTestimonialIndex) {
          dot.classList.add('testimonials__dot--active');
        } else {
          dot.classList.remove('testimonials__dot--active');
        }
      });
    };
    
    if (testimonialsNextBtn) {
      testimonialsNextBtn.addEventListener('click', () => {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialsCards.length;
        updateTestimonialsCarousel();
      });
    }
    
    if (testimonialsPrevBtn) {
      testimonialsPrevBtn.addEventListener('click', () => {
        currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonialsCards.length) % testimonialsCards.length;
        updateTestimonialsCarousel();
      });
    }
    
    // Dot navigation
    testimonialsDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentTestimonialIndex = index;
        updateTestimonialsCarousel();
      });
    });
  }

  // ===== FAQ ACCORDION =====
  const faqItems = document.querySelectorAll('.faq__item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    
    if (!question || !answer) return;
    
    // Захист від подвійного навішування
    if (question.dataset.bound) return;
    question.dataset.bound = 'true';
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Закриваємо всі інші елементи одночасно
      faqItems.forEach(i => {
        if (i !== item) {
          const a = i.querySelector('.faq__answer');
          i.classList.remove('active');
          if (a) {
            a.style.maxHeight = '0';
          }
        }
      });
      
      // Перемикаємо поточний елемент
      if (!isActive) {
        // Відкриваємо обране
        item.classList.add('active');
        // Спочатку встановлюємо висоту на 0, потім на scrollHeight для плавної анімації
        answer.style.maxHeight = '0';
        // Використовуємо requestAnimationFrame для коректного встановлення висоти
        requestAnimationFrame(() => {
          // Враховуємо padding (15px зверху + 15px знизу = 30px)
          const height = answer.scrollHeight + 30;
          answer.style.maxHeight = height + 'px';
        });
      } else {
        // Якщо клікнули на вже відкрите - закриваємо
        const currentHeight = answer.scrollHeight + 30;
        answer.style.maxHeight = currentHeight + 'px';
        requestAnimationFrame(() => {
          answer.style.maxHeight = '0';
          item.classList.remove('active');
        });
      }
    });
  });
  
  // Оновлюємо висоту при зміні розміру вікна
  window.addEventListener('resize', () => {
    faqItems.forEach(item => {
      if (item.classList.contains('active')) {
        const answer = item.querySelector('.faq__answer');
        if (answer && answer.style.maxHeight && answer.style.maxHeight !== '0px') {
          const height = answer.scrollHeight + 30;
          answer.style.maxHeight = height + 'px';
        }
      }
    });
  });

  // ===== AUTO-RESIZE TEXTAREA =====
  const textarea = document.querySelector('.form__textarea');
  if (textarea) {
    // Встановлюємо початкову висоту
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    
    // Автоматично змінюємо висоту при введенні тексту
    textarea.addEventListener('input', function() {
      this.style.height = 'auto';
      const newHeight = Math.min(this.scrollHeight, 400); // Максимальна висота 400px
      this.style.height = newHeight + 'px';
    });
    
    // Також при завантаженні сторінки
    window.addEventListener('load', () => {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 400);
      textarea.style.height = newHeight + 'px';
    });
  }

  // ===== MOBILE NAVIGATION (BURGER MENU) =====
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');
  
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isActive = burger.classList.contains('active');
      
      burger.classList.toggle('active');
      nav.classList.toggle('active');
      burger.setAttribute('aria-expanded', !isActive);
      
      // Блокуємо прокрутку body коли меню відкрите
      if (!isActive) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // Закриваємо меню при кліку на посилання
    const navLinks = nav.querySelectorAll('.header__nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    
    // Закриваємо меню при кліку поза меню
    nav.addEventListener('click', (e) => {
      if (e.target === nav) {
        burger.classList.remove('active');
        nav.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
});

