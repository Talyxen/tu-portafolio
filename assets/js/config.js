/**
 * Módulo de configuración centralizada
 * Centraliza constantes para evitar valores "mágicos" repartidos por el código.
 */

export const CONFIG = {
  // Configuración de Canvas y Ondas
  WAVE_CANVAS: {
    MAX_PARTICLES: 100,
    PARTICLES_PER_MOVE: 5,
    SIZE_DECAY: 0.97,
    MIN_SIZE: 0.5,
  },

  // Configuración del Cursor Personalizado
  CURSOR: {
    LERP_SPEED: 8,
    INTERACTIVE_SELECTORS: 'a, .btn, .project-card, .tech-item, .blog-card',
  },

  // Configuración de Partículas Flotantes de Fondo
  FLOATING_PARTICLES: {
    COUNT: 100,
    COLORS: ['#00f7ff', '#ff00c8', '#00ff9d'],
    MIN_SIZE: 1,
    MAX_SIZE: 4,
    MIN_DURATION: 10,
    MAX_DURATION: 30,
  },

  // Configuración de Navegación y Scroll
  NAVIGATION: {
    SCROLL_HIDE_THRESHOLD: 200,
  },

  // Configuración de Observadores (IntersectionObserver)
  SCROLL_REVEAL: {
    THRESHOLD: 0.1,
  },
};

export const LOGO_CONFIG = {
  enabled: true,
  maxTranslate: 10,
  maxRotate: 12,
  scale: 1.05,
  lerp: 0.12,
};

export const LOGO_TEXT_CONFIG = {
  enabled: true,
  jumpHeight: -10,
  scale: 1.15,
  staggerDelay: 70,
  duration: 450,
};
