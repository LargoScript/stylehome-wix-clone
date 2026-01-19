/**
 * Module for dynamic effects background
 */

import { querySelector } from '../utils/dom';

declare var anime: any;

/**
 * Initialize animated gradient for hero overlay
 * Works on main page and subpages with images
 */
export function initAnimatedGradient(): void {
    const hero = querySelector<HTMLElement>('.hero');
    const overlay = querySelector<HTMLElement>('.hero__overlay');
    
    if (!hero || !overlay) {
        return;
    }
    
    // For subpages with images, use animated gradient
    const hasImage = hero.querySelector('.hero__image-bg img');
    const isSubpage = hero.classList.contains('hero--subpage');
    
    // Skip animation only if it's subpage without image (shouldn't happen, but safety check)
    if (isSubpage && !hasImage) {
        return;
    }

    // Create анімований градієнт з дуже плавними переходами
    overlay.style.background = `
        linear-gradient(
            ${45 + Math.sin(Date.now() / 5000) * 15}deg,
            rgba(139, 0, 0, 0.2) 0%,
            rgba(139, 0, 0, 0.18) 15%,
            rgba(80, 0, 0, 0.25) 30%,
            rgba(40, 0, 0, 0.3) 45%,
            rgba(20, 0, 0, 0.35) 50%,
            rgba(40, 0, 0, 0.3) 55%,
            rgba(80, 0, 0, 0.25) 70%,
            rgba(139, 0, 0, 0.18) 85%,
            rgba(139, 0, 0, 0.2) 100%
        )
    `;

    // Animation gradient з дуже плавними переходами (без чорного кольору)
    let angle = 45;
    const animateGradient = (): void => {
        // Check, чи hero все ще існує
        if (!hero || !overlay) {
            return;
        }
        
        angle += 0.2; // Ще повільніше обертання
        const baseRed = 0.18 + Math.sin(angle * 0.01) * 0.08;
        const midRed1 = 0.22 + Math.cos(angle * 0.012) * 0.1;
        const midRed2 = 0.28 + Math.sin(angle * 0.015) * 0.12;
        const darkRed1 = 0.32 + Math.cos(angle * 0.01) * 0.1;
        const darkRed2 = 0.35 + Math.sin(angle * 0.008) * 0.08;
        
        // Використовуємо тільки відтінки червоного (темніші замість чорного)
        overlay.style.background = `
            linear-gradient(
                ${angle}deg,
                rgba(139, 0, 0, ${baseRed}) 0%,
                rgba(139, 0, 0, ${baseRed + 0.02}) 15%,
                rgba(100, 0, 0, ${midRed1}) 30%,
                rgba(60, 0, 0, ${midRed2}) 45%,
                rgba(30, 0, 0, ${darkRed1}) 50%,
                rgba(60, 0, 0, ${midRed2}) 55%,
                rgba(100, 0, 0, ${midRed1}) 70%,
                rgba(139, 0, 0, ${baseRed + 0.02}) 85%,
                rgba(139, 0, 0, ${baseRed}) 100%
            )
        `;
        
        requestAnimationFrame(animateGradient);
    };
    
    animateGradient();
}

/**
 * Створення canvas with particles for hero section
 * Works only на main сторінці, not на subpages
 * Function saved for future use в other sectionх
 */
export function initParticleBackground(): void {
    const hero = querySelector<HTMLElement>('.hero');
    // Not використовуємо particles на subpages
    if (!hero || hero.classList.contains('hero--subpage')) return;

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
    
    // Check, чи already exists canvas
    const existingCanvas = wrapper.querySelector('.hero__particles');
    if (existingCanvas) return;
    
    wrapper.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Settings canvas
    const resizeCanvas = (): void => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Class particles
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

            // Bounce from edges
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Ensure, that particles stay within bounds
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

    // Create масив частинок
    const particles: Particle[] = [];
    const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 15000));
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Function animation
    const animate = (): void => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update та draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw lines between close particles
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
 * Initialize parallax effect for hero video only
 * Images should be static (no parallax)
 */
export function initParallaxEffect(): void {
    const video = querySelector<HTMLVideoElement>('.hero__video');
    // Images are static, no parallax effect
    
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
 * Initialize allх effects background
 */
export function initBackgroundEffects(): void {
    initAnimatedGradient();
    initParticleBackground();
    initParallaxEffect();
}
