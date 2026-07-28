/**
 * Componente ScrollRevealObserver
 * Utiliza IntersectionObserver para revelar secciones con la clase animate-in al hacer scroll.
 */

import { CONFIG } from '../config.js';
import { prefersReducedMotion, DOMCache } from '../utils.js';

export class ScrollRevealObserver {
  constructor() {
    this.observer = null;
    this.sections = [];
  }

  init() {
    this.sections = DOMCache.getAll('section');
    if (!this.sections.length) return;

    if (prefersReducedMotion()) {
      // Si se solicita reducción de movimiento, mostramos todo sin animación de scroll
      this.sections.forEach((section) => section.classList.add('animate-in'));
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            // Opcional: dejar de observar si solo queremos animar una vez
            // this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: CONFIG.SCROLL_REVEAL.THRESHOLD,
      }
    );

    this.sections.forEach((section) => {
      this.observer.observe(section);
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
