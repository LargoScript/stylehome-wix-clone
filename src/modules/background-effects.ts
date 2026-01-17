/**
 * Модуль для динамічних ефектів фону
 */

import { querySelector } from '../utils/dom';

declare var anime: any;

/**
 * Ініціалізація анімованого градієнта для hero overlay
 */
export function initAnimatedGradient(): void {
    const overlay = querySelector<HTMLElement>('.hero__overlay');
    if (!overlay) return;

    // Створюємо анімований градієнт через CSS змінні
    overlay.style.background = `
        linear-gradient(
            ${45 + Math.sin(Date.now() / 5000) * 15}deg,
            rgba(139, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.5) 50%,
            rgba(139, 0, 0, 0.3) 100%
        )
    `;

    // Анімація градієнта
    let angle = 45;
    const animateGradient = (): void => {
        angle += 0.5;
        const redOpacity1 = 0.3 + Math.sin(angle * 0.01) * 0.2;
        const redOpacity2 = 0.2 + Math.cos(angle * 0.015) * 0.15;
        
        overlay.style.background = `
            linear-gradient(
                ${angle}deg,
                rgba(139, 0, 0, ${redOpacity1}) 0%,
                rgba(0, 0, 0, 0.6) 50%,
                rgba(139, 0, 0, ${redOpacity2}) 100%
            )
        `;
        
        requestAnimationFrame(animateGradient);
    };
    
    animateGradient();
}

/**
 * Створення canvas з частинками для hero секції
 */
export function initParticleBackground(): void {
    const hero = querySelector<HTMLElement>('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'hero__particles';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none';
    
    const wrapper = querySelector<HTMLElement>('.hero__video-wrapper');
    if (!wrapper) return;
    
    // Перевіряємо, чи вже є canvas
    const existingCanvas = wrapper.querySelector('.hero__particles');
    if (existingCanvas) return;
    
    wrapper.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Налаштування canvas
    const resizeCanvas = (): void => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Клас частинки
    class Particle {
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        opacity: number;
        color: string;

        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = Math.random() > 0.7 ? 'rgba(139, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.3)';
        }

        update(): void {
            this.x += this.speedX;
            this.y += this.speedY;

            // Відскок від країв
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Забезпечуємо, що частинки залишаються в межах
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }

        draw(): void {
            if (!ctx) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            const colorValue = this.color.includes('139, 0, 0') 
                ? `rgba(139, 0, 0, ${this.opacity})` 
                : `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fillStyle = colorValue;
            ctx.fill();
        }
    }

    // Створюємо масив частинок
    const particles: Particle[] = [];
    const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 15000));
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Функція анімації
    const animate = (): void => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Оновлюємо та малюємо частинки
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Малюємо лінії між близькими частинками
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    };

    animate();
}

/**
 * Ініціалізація parallax ефекту для hero відео
 */
export function initParallaxEffect(): void {
    const video = querySelector<HTMLVideoElement>('.hero__video');
    if (!video) return;

    let ticking = false;

    const handleScroll = (): void => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.5;
                
                if (video) {
                    video.style.transform = `translateY(${rate}px)`;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Ініціалізація всіх ефектів фону
 */
export function initBackgroundEffects(): void {
    initAnimatedGradient();
    initParticleBackground();
    initParallaxEffect();
}
