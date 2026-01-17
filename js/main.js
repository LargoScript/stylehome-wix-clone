// Main JavaScript file
console.log('Style Homes website loaded');

// ===== HEADER SCROLL EFFECT =====
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check initial state
}

// ===== SERVICES SECTION DARKENING ON SCROLL =====
function initServicesDarkening() {
  const servicesSection = document.querySelector('.services');
  if (!servicesSection) return;

  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = servicesSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        
        // Розраховуємо прогрес затемнення
        // Починаємо затемнення, коли верх секції проходить через верх екрану
        // Завершуємо, коли секція повністю прокручена
        let scrollProgress = 0;
        
        if (sectionTop < windowHeight && sectionTop > -sectionHeight) {
          // Секція видима на екрані
          // Прогрес від 0 (коли верх секції на верхі екрану) до 1 (коли секція прокручена)
          scrollProgress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight * 0.5)));
        } else if (sectionTop <= -sectionHeight * 0.5) {
          // Секція повністю прокручена вгору
          scrollProgress = 1;
        }
        
        // Динамічно змінюємо прозорість затемнення (від 0 до 0.4)
        const opacity = scrollProgress * 0.4;
        servicesSection.style.setProperty('--darken-opacity', opacity);
        
        // Додаємо клас для плавного переходу
        if (opacity > 0.1) {
          servicesSection.classList.add('scrolled');
        } else {
          servicesSection.classList.remove('scrolled');
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check initial state
}

// ===== AUTO SHOW BURGER MENU WHEN ELEMENTS TOUCH =====
let checkElementsCollision = null; // Зберігаємо посилання на функцію

function initAutoBurgerMenu() {
  const nav = document.querySelector('.header__nav');
  const actions = document.querySelector('.header__actions');
  const burger = document.querySelector('.header__burger');
  const header = document.querySelector('.header');
  
  if (!nav || !actions || !burger || !header) return;

  checkElementsCollision = function() {
    // Не перевіряємо, якщо меню відкрите - дозволяємо користувачу взаємодіяти з меню
    const isMenuOpen = nav.classList.contains('active');
    if (isMenuOpen) {
      return; // Не перешкоджаємо відкритому меню
    }

    // Перевіряємо тільки на десктопі (ширина > 768px)
    if (window.innerWidth <= 768) {
      burger.style.display = 'flex';
      // На мобільних навігація має бути прихована за замовчуванням
      if (!isMenuOpen) {
        nav.style.display = 'none';
      }
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const actionsRect = actions.getBoundingClientRect();
    
    // Перевіряємо, чи елементи торкаються або перекриваються
    // nav закінчується на navRect.right, actions починається на actionsRect.left
    const gap = actionsRect.left - navRect.right;
    const isTouching = gap <= 0; // Якщо gap <= 0, елементи торкаються або перекриваються
    
    // Використовуємо requestAnimationFrame для миттєвого оновлення без затримок
    requestAnimationFrame(() => {
      // Перевіряємо ще раз, чи меню не відкрилося під час очікування
      if (nav.classList.contains('active')) {
        return; // Не змінюємо display, якщо меню відкрите
      }
      
      if (isTouching) {
        // Показуємо бургер-меню та ховаємо навігацію миттєво
        nav.style.display = 'none';
        burger.style.display = 'flex';
        header.classList.add('burger-mode');
      } else {
        // Ховаємо бургер-меню та показуємо навігацію миттєво
        burger.style.display = 'none';
        nav.style.display = 'flex';
        header.classList.remove('burger-mode');
      }
    });
  }

  // Перевіряємо при завантаженні
  checkElementsCollision();

  // Перевіряємо при resize без debounce для миттєвої реакції
  let resizeRequestId;
  window.addEventListener('resize', () => {
    if (resizeRequestId) {
      cancelAnimationFrame(resizeRequestId);
    }
    resizeRequestId = requestAnimationFrame(() => {
      checkElementsCollision();
    });
  });

  // Перевіряємо при scroll (на випадок зміни розмірів через scroll effects)
  // Але тільки якщо меню не відкрите
  let scrollRequestId;
  window.addEventListener('scroll', () => {
    // Не перевіряємо колізію під час скролу, якщо меню відкрите
    if (nav.classList.contains('active')) {
      return;
    }
    
    if (scrollRequestId) {
      cancelAnimationFrame(scrollRequestId);
    }
    scrollRequestId = requestAnimationFrame(() => {
      checkElementsCollision();
    });
  });
}

// ===== INITIALIZE ANIMATIONS =====
function initAnimations() {
  // Ініціалізуємо AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
      delay: 0,
      anchorPlacement: 'top-bottom'
    });
  }
  
  // Анімація Header елементів при завантаженні
  if (typeof anime !== 'undefined') {
    // Спочатку ховаємо елементи
    const headerLogo = document.querySelector('.header__logo');
    const headerNav = document.querySelector('.header__nav');
    const headerActions = document.querySelector('.header__actions');
    
    if (headerLogo) {
      headerLogo.style.opacity = '0';
      headerLogo.style.transform = 'translateX(-30px)';
    }
    if (headerNav) {
      headerNav.style.opacity = '0';
      headerNav.style.transform = 'translateY(-20px)';
    }
    if (headerActions) {
      headerActions.style.opacity = '0';
      headerActions.style.transform = 'translateX(30px)';
    }
    
    // Анімація logo (зліва)
    if (headerLogo) {
      anime({
        targets: headerLogo,
        opacity: [0, 1],
        translateX: [-30, 0],
        duration: 800,
        delay: 100,
        easing: 'easeOutCubic'
      });
    }
    
    // Анімація navigation (зверху)
    if (headerNav) {
      anime({
        targets: headerNav,
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 800,
        delay: 200,
        easing: 'easeOutCubic'
      });
      
      // Анімація nav links по черзі
      const navLinks = headerNav.querySelectorAll('.header__nav-link');
      navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        anime({
          targets: link,
          opacity: [0, 1],
          translateY: [-10, 0],
          duration: 400,
          delay: 300 + (index * 50),
          easing: 'easeOutCubic'
        });
      });
    }
    
    // Анімація actions (справа)
    if (headerActions) {
      anime({
        targets: headerActions,
        opacity: [0, 1],
        translateX: [30, 0],
        duration: 800,
        delay: 400,
        easing: 'easeOutCubic'
      });
    }
  }
  
  // Анімація Hero секції з anime.js
  if (typeof anime !== 'undefined') {
    // Анімація badge
    anime({
      targets: '.hero__badge',
      opacity: [0, 1],
      translateY: [-30, 0],
      duration: 1000,
      delay: 600,
      easing: 'easeOutCubic'
    });
    
    // Анімація hero card
    anime({
      targets: '.hero__card',
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 1200,
      delay: 900,
      easing: 'easeOutCubic'
    });
    
    // Анімація hero title
    anime({
      targets: '.hero__title',
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 1000,
      delay: 1100,
      easing: 'easeOutElastic(1, .6)'
    });
    
    // Видалено anime.js hover для service cards - використовуємо тільки CSS hover
    
    // Анімація project cards при hover
    document.querySelectorAll('.project-card').forEach((card) => {
      const carousel = card.querySelector('.project-card__carousel');
      if (carousel) {
        card.addEventListener('mouseenter', () => {
          anime({
            targets: carousel,
            scale: 1.05,
            duration: 400,
            easing: 'easeOutQuad'
          });
        });
        
        card.addEventListener('mouseleave', () => {
          anime({
            targets: carousel,
            scale: 1,
            duration: 400,
            easing: 'easeOutQuad'
          });
        });
      }
    });
    
    // Анімація кнопок форми при hover
    document.querySelectorAll('.form__submit').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        anime({
          targets: btn,
          scale: 1.05,
          duration: 200,
          easing: 'easeOutQuad'
        });
      });
      
      btn.addEventListener('mouseleave', () => {
        anime({
          targets: btn,
          scale: 1,
          duration: 200,
          easing: 'easeOutQuad'
        });
      });
    });
    
    // Анімація services-hero cards при hover
    document.querySelectorAll('.services-hero__card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        anime({
          targets: card,
          scale: 1.03,
          duration: 300,
          easing: 'easeOutQuad'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        anime({
          targets: card,
          scale: 1,
          duration: 300,
          easing: 'easeOutQuad'
        });
      });
    });
  }
}

// ===== SMOOTH SCROLL NAVIGATION =====
let closeMenuFunction = null; // Глобальна змінна для функції закриття меню

function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.header__nav-link[href^="#"]');
  const header = document.querySelector('.header');
  const nav = document.querySelector('.header__nav');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Пропускаємо порожні якорі
      if (href === '#' || href === '#hero') {
        e.preventDefault();
        
        // Закриваємо мобільне меню, якщо воно відкрите
        if (nav && nav.classList.contains('active') && closeMenuFunction) {
          closeMenuFunction();
        }
        
        // Невелика затримка для закриття меню перед прокруткою
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, nav && nav.classList.contains('active') ? 150 : 0);
        return;
      }
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Закриваємо мобільне меню, якщо воно відкрите
        if (nav && nav.classList.contains('active') && closeMenuFunction) {
          closeMenuFunction();
        }
        
        // Чекаємо трохи, щоб меню встигло закритися перед прокруткою
        setTimeout(() => {
          const headerHeight = header ? header.offsetHeight : 80;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }, nav && nav.classList.contains('active') ? 150 : 0);
      }
    });
  });
}

// ===== UPDATE ACTIVE NAV LINK ON SCROLL =====
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav-link[href^="#"]');
  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 80;
  
  const updateActiveLink = () => {
    let current = '';
    const scrollPosition = window.pageYOffset + headerHeight + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = sectionId;
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}` || (current === 'hero' && href === '#')) {
        link.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink(); // Check initial state
}

// ===== CAROUSEL FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize header scroll effect
  initHeaderScroll();
  
  // Initialize services darkening effect
  initServicesDarkening();
  
  // Initialize auto burger menu (має бути перед initSmoothScroll, щоб closeMenuFunction була доступна)
  initAutoBurgerMenu();
  
  // Initialize smooth scroll navigation (після initAutoBurgerMenu, щоб closeMenuFunction була встановлена)
  // Використовуємо setTimeout, щоб переконатися, що closeMenuFunction встановлена
  setTimeout(() => {
    initSmoothScroll();
  }, 0);
  
  // Initialize active nav link on scroll
  initActiveNavLink();
  
  // Initialize animations
  initAnimations();
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
  const header = document.querySelector('.header'); // Додаємо header тут
  
  if (burger && nav && header) {
    // Переконаємося, що меню завжди починає в закритому стані
    burger.classList.remove('active');
    nav.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    
    // Функція для закриття меню без анімації
    const closeMenuWithoutAnimation = () => {
      // Додаємо клас для блокування transition
      document.body.classList.add('no-transition');
      burger.classList.remove('active');
      nav.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      // Видаляємо клас після невеликої затримки
      setTimeout(() => {
        document.body.classList.remove('no-transition');
      }, 50);
    };
    
    burger.addEventListener('click', (e) => {
      e.stopPropagation(); // Зупиняємо поширення події
      e.preventDefault(); // Запобігаємо стандартній поведінці
      
      console.log('Burger clicked!'); // Дебаг
      
      const isActive = burger.classList.contains('active');
      console.log('Is active:', isActive); // Дебаг
      
      // Видаляємо burger-mode, щоб дозволити відкриття меню
      header.classList.remove('burger-mode');
      
      burger.classList.toggle('active');
      nav.classList.toggle('active');
      burger.setAttribute('aria-expanded', !isActive);
      
      console.log('Nav classes:', nav.className); // Дебаг
      console.log('Burger classes:', burger.className); // Дебаг
      
      // Коли меню відкривається, показуємо навігацію
      if (!isActive) {
        // Видаляємо всі inline стилі, які можуть блокувати відображення
        nav.style.display = '';
        nav.style.visibility = '';
        nav.style.opacity = '';
        nav.style.transform = '';
        
        // Примусово встановлюємо стилі для відображення
        nav.style.display = 'flex';
        nav.style.visibility = 'visible';
        nav.style.opacity = '1';
        nav.style.transform = 'translateX(0)';
        
        document.body.style.overflow = 'hidden';
        console.log('Menu opened, nav display:', nav.style.display); // Дебаг
      } else {
        // Закриваємо меню - скидаємо inline стилі для правильної анімації
        nav.style.transform = 'translateX(-100%)';
        nav.style.opacity = '0';
        nav.style.visibility = 'hidden';
        
        document.body.style.overflow = '';
        console.log('Menu closed'); // Дебаг
        
        // Після завершення анімації закриття, скидаємо display
        setTimeout(() => {
          if (!nav.classList.contains('active')) {
            nav.style.display = '';
          }
          // Після закриття меню, перевіряємо знову колізію
          if (checkElementsCollision && typeof checkElementsCollision === 'function') {
            checkElementsCollision();
          }
        }, 300);
      }
    });
    
    // Функція для закриття меню
    const closeMenu = () => {
      burger.classList.remove('active');
      nav.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      
      // Анімація закриття
      nav.style.transform = 'translateX(-100%)';
      nav.style.opacity = '0';
      nav.style.visibility = 'hidden';
      document.body.style.overflow = '';
      
      // Після анімації скидаємо display
      setTimeout(() => {
        if (!nav.classList.contains('active')) {
          nav.style.display = '';
        }
        if (checkElementsCollision && typeof checkElementsCollision === 'function') {
          checkElementsCollision();
        }
      }, 300);
    };
    
    // Зберігаємо функцію закриття меню для використання в initSmoothScroll
    closeMenuFunction = closeMenu;
    
    // Закриваємо меню при кліку на хрестик
    const navClose = nav.querySelector('.header__nav-close');
    if (navClose) {
      navClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
      });
    }
    
    // Видалено дублюючий обробник для nav links - вже є в initSmoothScroll()
    
    // Закриваємо меню при кліку поза меню
    nav.addEventListener('click', (e) => {
      if (e.target === nav) {
        closeMenu();
      }
    });
    
    // Використовуємо matchMedia для виявлення зміни медіа-запиту
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    // Функція для обробки зміни медіа-запиту
    const handleMediaChange = (e) => {
      // Якщо перейшли в desktop режим (ширина > 768px)
      if (!e.matches) {
        // Закриваємо меню без анімації, якщо воно відкрите
        if (nav.classList.contains('active')) {
          closeMenuWithoutAnimation();
        }
      }
    };
    
    // Слухаємо зміни медіа-запиту
    mediaQuery.addEventListener('change', handleMediaChange);
    
    // Також обробляємо resize для додаткової безпеки
    let resizeTimer;
    let isResizing = false;
    
    window.addEventListener('resize', () => {
      if (!isResizing) {
        // Додаємо клас для блокування transition під час resize
        document.body.classList.add('no-transition');
        isResizing = true;
      }
      
      // Перевіряємо, чи перейшли в desktop режим
      if (window.innerWidth > 768) {
        // Якщо меню відкрите, закриваємо його
        if (nav.classList.contains('active')) {
          burger.classList.remove('active');
          nav.classList.remove('active');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      }
      
      // Debounce для оптимізації
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Видаляємо клас після завершення resize
        document.body.classList.remove('no-transition');
        isResizing = false;
      }, 100);
    });
    
    // Перевіряємо початковий стан при завантаженні
    if (window.innerWidth > 768) {
      closeMenuWithoutAnimation();
    }
  }
});

