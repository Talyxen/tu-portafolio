/**
 * Componente NavigationManager
 * Controla el menú móvil hamburguesa, la navegación por scroll suave y el ocultamiento
 * automático del header al hacer scroll hacia abajo.
 */

import { CONFIG } from '../config.js';
import { throttle, DOMCache } from '../utils.js';

export class NavigationManager {
  constructor() {
    this.header = null;
    this.menuToggle = null;
    this.navMenu = null;
    this.lastScrollTop = 0;
    this.abortController = null;
    this.handleScroll = throttle(this.onScroll.bind(this), 100);
  }

  init() {
    this.header = DOMCache.get('header');
    this.menuToggle = DOMCache.get('#menuToggle');
    this.navMenu = DOMCache.get('#navMenu');

    this.abortController = new AbortController();
    const { signal } = this.abortController;

    this.setupMobileMenu(signal);
    this.setupSmoothScroll(signal);
    this.setupHeaderScroll(signal);
  }

  setupMobileMenu(signal) {
    if (!this.menuToggle || !this.navMenu) return;

    this.menuToggle.addEventListener(
      'click',
      () => {
        this.navMenu.classList.toggle('active');
      },
      { signal }
    );

    const navLinks = DOMCache.getAll('#navMenu a');
    navLinks.forEach((link) => {
      link.addEventListener(
        'click',
        () => {
          this.navMenu.classList.remove('active');
        },
        { signal }
      );
    });
  }

  setupSmoothScroll(signal) {
    const anchors = DOMCache.getAll('a[href^="#"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener(
        'click',
        (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#') return;

          e.preventDefault();
          const targetElement = DOMCache.get(targetId);
          if (!targetElement) return;

          const headerHeight = this.header ? this.header.offsetHeight : 0;
          window.scrollTo({
            top: targetElement.offsetTop - headerHeight,
            behavior: 'smooth',
          });

          if (this.navMenu) {
            this.navMenu.classList.remove('active');
          }
        },
        { signal }
      );
    });
  }

  setupHeaderScroll(signal) {
    if (!this.header) return;

    window.addEventListener('scroll', this.handleScroll, { signal, passive: true });
  }

  onScroll() {
    if (!this.header) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > this.lastScrollTop && scrollTop > CONFIG.NAVIGATION.SCROLL_HIDE_THRESHOLD) {
      this.header.style.transform = 'translateY(-100%)';
    } else {
      this.header.style.transform = 'translateY(0)';
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  destroy() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    if (this.header) {
      this.header.style.transform = 'translateY(0)';
    }

    if (this.navMenu) {
      this.navMenu.classList.remove('active');
    }
  }
}
