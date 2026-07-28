/**
 * Módulo de Partículas Flotantes
 * Generador funcional sin estado para crear partículas de fondo en el DOM.
 */

import { CONFIG } from '../config.js';
import { prefersReducedMotion } from '../utils.js';

export function initFloatingParticles(container) {
  if (!container || prefersReducedMotion()) {
    return;
  }

  // Limpiamos por si se re-inicializa
  container.innerHTML = '';

  const fragment = document.createDocumentFragment();
  const { COUNT, COLORS, MIN_SIZE, MAX_SIZE, MIN_DURATION, MAX_DURATION } =
    CONFIG.FLOATING_PARTICLES;

  for (let i = 0; i < COUNT; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // Posición aleatoria
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;

    // Tamaño aleatorio
    const size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Color aleatorio
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    particle.style.backgroundColor = color;

    // Duración de animación aleatoria
    const duration = Math.random() * (MAX_DURATION - MIN_DURATION) + MIN_DURATION;
    particle.style.animationDuration = `${duration}s`;

    // Retraso aleatorio
    const delay = Math.random() * 5;
    particle.style.animationDelay = `${delay}s`;

    fragment.appendChild(particle);
  }

  container.appendChild(fragment);
}

export function destroyFloatingParticles(container) {
  if (container) {
    container.innerHTML = '';
  }
}
