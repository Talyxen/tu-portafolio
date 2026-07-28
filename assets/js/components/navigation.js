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
          const elementTop =
            targetElement.getBoundingClientRect().top +
            (window.pageYOffset || document.documentElement.scrollTop);

          window.scrollTo({
            top: elementTop - headerHeight,
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
    // Inicializar estado al cargar la página
    this.onScroll();
  }

  onScroll() {
    if (!this.header) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const threshold = CONFIG.NAVIGATION.SCROLL_THRESHOLD || 60;

    // Efecto Glassmorphism y cambio de altura al hacer scroll (estilo Apple/Vercel/Stripe)
    if (scrollTop > threshold) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }

    // Asegurar que el header siempre permanezca visible y en la parte superior
    this.header.style.transform = 'translateY(0)';

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    this.updateActiveNavLink();
  }

  updateActiveNavLink() {
    if (!this.navMenu) return;

    const navLinks = DOMCache.getAll('#navMenu a[href^="#"]');
    if (!navLinks.length) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || window.scrollY;
    const headerHeight = this.header ? this.header.offsetHeight : 80;
    const scrollBottom = scrollTop + window.innerHeight;

    const maxDocHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );

    // 1. Condición de final absoluto de página (prioridad máxima para Contáctanos)
    const atBottom = Math.ceil(scrollBottom) >= maxDocHeight - 20;
    if (atBottom) {
      this.setActiveNavLink(navLinks, '#contacto');
      return;
    }

    // 2. Evaluar qué sección ocupa la mayor parte del viewport visible
    let bestSectionId = '';
    let maxVisibleHeight = -1;

    navLinks.forEach((link) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const section = DOMCache.get(targetId);
      if (!section) return;

      const rect = section.getBoundingClientRect();

      // Al entrar en la sección Contáctanos, el estado activo debe cambiar inmediatamente
      if (targetId === '#contacto') {
        if (rect.top <= window.innerHeight * 0.75) {
          bestSectionId = '#contacto';
          maxVisibleHeight = Number.MAX_SAFE_INTEGER;
        }
        return;
      }

      // Calcular la altura visible de la sección dentro del viewport [headerHeight, window.innerHeight]
      const visibleTop = Math.max(headerHeight, rect.top);
      const visibleBottom = Math.min(window.innerHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      if (visibleHeight > maxVisibleHeight) {
        maxVisibleHeight = visibleHeight;
        bestSectionId = targetId;
      }
    });

    if (bestSectionId) {
      this.setActiveNavLink(navLinks, bestSectionId);
    }
  }

  setActiveNavLink(navLinks, targetId) {
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === targetId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
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
