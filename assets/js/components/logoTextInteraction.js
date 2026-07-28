/**
 * Módulo de Interacción en Cascada para el Texto del Logo (Staggered Bounce)
 * Implementa el salto secuencial elástico de cada carácter de "JSVR" (J → S → V → R)
 * utilizando la Web Animations API a 60 FPS con aceleración por GPU.
 * Funciona de manera 100% independiente de LogoInteraction.js.
 */

import { LOGO_TEXT_CONFIG } from '../config.js';

export class LogoTextInteraction {
  constructor() {
    this.containers = [];
    this.abortController = null;
    this.isReducedMotion = false;
    this.isTouchDevice = false;
  }

  init() {
    if (!LOGO_TEXT_CONFIG || !LOGO_TEXT_CONFIG.enabled) return;

    // Respetar accesibilidad (prefers-reduced-motion) y pantallas táctiles
    if (typeof window !== 'undefined') {
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    }

    if (this.isReducedMotion || this.isTouchDevice) return;

    const textNodes = document.querySelectorAll('.logo-text');
    if (!textNodes.length) return;

    this.abortController = new AbortController();
    const { signal } = this.abortController;

    textNodes.forEach((container) => {
      const chars = Array.from(container.querySelectorAll('.char'));
      if (!chars.length) return;

      this.containers.push({ container, chars });

      // Configurar event listeners estrictamente sobre el contenedor del texto
      container.addEventListener('mouseenter', () => this.animateCascade(chars), { signal });
      container.addEventListener('focus', () => this.animateCascade(chars), { signal });
      container.addEventListener('mouseleave', () => this.animateReturn(chars), { signal });
      container.addEventListener('blur', () => this.animateReturn(chars), { signal });
    });
  }

  animateCascade(chars) {
    const jumpHeight = LOGO_TEXT_CONFIG.jumpHeight || -10;
    const scale = LOGO_TEXT_CONFIG.scale || 1.15;
    const staggerDelay = LOGO_TEXT_CONFIG.staggerDelay || 70;
    const duration = LOGO_TEXT_CONFIG.duration || 450;

    chars.forEach((char, index) => {
      // Cancelar cualquier animación previa en curso
      if (char._anim) {
        char._anim.cancel();
      }

      // Ejecutar animación de salto elástico en cascada mediante Web Animations API
      char._anim = char.animate(
        [
          { transform: 'translate3d(0, 0, 0) scale(1)' },
          {
            transform: `translate3d(0, ${jumpHeight}px, 0) scale(${scale})`,
            offset: 0.4,
          },
          { transform: 'translate3d(0, 0, 0) scale(1)' },
        ],
        {
          duration,
          delay: index * staggerDelay,
          easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Curva elástica tipo spring/bounce
          fill: 'both',
        }
      );

      char._anim.onfinish = () => {
        char._anim = null;
        char.style.transform = '';
      };
    });
  }

  animateReturn(chars) {
    chars.forEach((char) => {
      // Si la letra se encuentra en medio de un salto, suavizar su regreso desde la posición actual
      if (char._anim) {
        const computed = window.getComputedStyle(char).transform;
        char._anim.cancel();

        char._anim = char.animate(
          [
            {
              transform:
                computed && computed !== 'none' ? computed : 'translate3d(0, 0, 0) scale(1)',
            },
            { transform: 'translate3d(0, 0, 0) scale(1)' },
          ],
          {
            duration: 250,
            easing: 'ease-out',
            fill: 'both',
          }
        );

        char._anim.onfinish = () => {
          char._anim = null;
          char.style.transform = '';
        };
      }
    });
  }

  destroy() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    this.containers.forEach(({ chars }) => {
      chars.forEach((char) => {
        if (char._anim) {
          char._anim.cancel();
          char._anim = null;
        }
        char.style.transform = '';
      });
    });

    this.containers = [];
  }
}
