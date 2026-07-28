/**
 * Módulo unificado de utilidades
 * Proporciona helpers de rendimiento (throttle, debounce), caché de selectores DOM
 * y detección de preferencias de accesibilidad.
 */

// Limita la frecuencia de ejecución de una función (ideal para scroll/resize)
export function throttle(func, limit = 100) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Retrasa la ejecución hasta que cese el evento por el tiempo especificado
export function debounce(func, delay = 200) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Comprueba si el usuario tiene activada la preferencia de reducción de movimiento en su SO
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Clase helper para cachear selectores DOM y evitar múltiples consultas del mismo elemento
 */
class DOMCacheManager {
  constructor() {
    this.cache = new Map();
  }

  // Obtiene un único elemento del DOM, guardándolo en caché
  get(selector) {
    if (!this.cache.has(selector)) {
      this.cache.set(selector, document.querySelector(selector));
    }
    return this.cache.get(selector);
  }

  // Obtiene una lista de elementos (NodeList / Array) sin cachear o cacheada bajo clave específica
  getAll(selector) {
    if (!this.cache.has(`all:${selector}`)) {
      this.cache.set(`all:${selector}`, Array.from(document.querySelectorAll(selector)));
    }
    return this.cache.get(`all:${selector}`);
  }

  // Limpia la caché si el DOM cambia dinámicamente
  clear() {
    this.cache.clear();
  }
}

export const DOMCache = new DOMCacheManager();
