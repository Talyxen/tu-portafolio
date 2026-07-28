/**
 * Componente CustomCursorEffect
 * Controla el cursor personalizado con movimiento suave (LERP) e interactividad con enlaces/botones.
 */

import { CONFIG } from '../config.js';
import { prefersReducedMotion, DOMCache } from '../utils.js';

export class CustomCursorEffect {
  constructor(cursorElement) {
    this.cursor = cursorElement;
    this.mouseX = 0;
    this.mouseY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.animationFrameId = null;
    this.abortController = null;
    this.isRunning = false;
  }

  init() {
    if (!this.cursor) return;

    if (prefersReducedMotion()) {
      this.cursor.style.display = 'none';
      return;
    }

    this.abortController = new AbortController();
    const { signal } = this.abortController;

    document.addEventListener(
      'mousemove',
      (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      },
      { signal, passive: true }
    );

    this.setupInteractiveElements(signal);

    this.isRunning = true;
    this.animate();
  }

  setupInteractiveElements(signal) {
    const links = DOMCache.getAll(CONFIG.CURSOR.INTERACTIVE_SELECTORS);

    links.forEach((link) => {
      link.addEventListener(
        'mouseenter',
        () => {
          this.cursor.classList.add('grow', 'pulse');
        },
        { signal, passive: true }
      );

      link.addEventListener(
        'mouseleave',
        () => {
          this.cursor.classList.remove('grow', 'pulse');
        },
        { signal, passive: true }
      );
    });
  }

  animate() {
    if (!this.isRunning) return;

    this.cursorX += (this.mouseX - this.cursorX) / CONFIG.CURSOR.LERP_SPEED;
    this.cursorY += (this.mouseY - this.cursorY) / CONFIG.CURSOR.LERP_SPEED;

    this.cursor.style.left = `${this.cursorX}px`;
    this.cursor.style.top = `${this.cursorY}px`;

    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  destroy() {
    this.isRunning = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    if (this.cursor) {
      this.cursor.style.left = '0px';
      this.cursor.style.top = '0px';
      this.cursor.classList.remove('grow', 'pulse');
    }
  }
}
