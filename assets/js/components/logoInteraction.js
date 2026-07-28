/**
 * Módulo de Interacción Avanzada para el Logo (3D LERP & Magnetic Effect)
 * Implementa rotación 3D, magnetismo e iluminación glow a 60 FPS.
 * Optimizado para evitar consumo innecesario de CPU/GPU y respetar accesibilidad.
 */

import { LOGO_CONFIG } from '../config.js';

export class LogoInteraction {
  constructor() {
    this.trackers = [];
    this.abortController = null;
    this.isReducedMotion = false;
    this.isTouchDevice = false;
  }

  init() {
    if (!LOGO_CONFIG || !LOGO_CONFIG.enabled) return;

    // Detectar preferencias de accesibilidad y dispositivos táctiles
    if (typeof window !== 'undefined') {
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    }

    const logoNodes = document.querySelectorAll('.logo, .profile-img');
    if (!logoNodes.length) return;

    this.abortController = new AbortController();
    const { signal } = this.abortController;

    logoNodes.forEach((el) => {
      const wrapper =
        el.querySelector('.logo-img-wrapper') || el.querySelector('.profile-img-wrapper');
      const glow = el.querySelector('.logo-glow');

      // Si la estructura no está presente, omitir
      if (!wrapper) return;

      const tracker = {
        el,
        wrapper,
        glow,
        isHovered: false,
        rafId: null,
        current: {
          x: 0,
          y: 0,
          rotX: 0,
          rotY: 0,
          scale: 1,
          glowX: 0,
          glowY: 0,
          glowOpacity: 0,
        },
        target: {
          x: 0,
          y: 0,
          rotX: 0,
          rotY: 0,
          scale: 1,
          glowX: 0,
          glowY: 0,
          glowOpacity: 0,
        },
      };

      this.trackers.push(tracker);

      // Si es dispositivo táctil o reduced motion, solo habilitar interacción visual básica (CSS)
      if (this.isReducedMotion || this.isTouchDevice) {
        return;
      }

      // Configurar event listeners circunscritos estrictamente al contenedor circular (.logo-img-wrapper)
      wrapper.addEventListener('mouseenter', (e) => this.onEnter(tracker, e), { signal });
      wrapper.addEventListener('mousemove', (e) => this.onMove(tracker, e), { signal });
      wrapper.addEventListener('mouseleave', () => this.onLeave(tracker), { signal });
      wrapper.addEventListener('focus', () => this.onEnter(tracker), { signal });
      wrapper.addEventListener('blur', () => this.onLeave(tracker), { signal });
    });
  }

  onEnter(tracker, e = null) {
    tracker.isHovered = true;
    tracker.target.scale = LOGO_CONFIG.scale || 1.05;
    tracker.target.glowOpacity = 1;

    if (e && e.clientX) {
      this.updateTargetsFromEvent(tracker, e);
    }

    if (!tracker.rafId) {
      this.startLoop(tracker);
    }
  }

  onMove(tracker, e) {
    if (!tracker.isHovered) return;
    this.updateTargetsFromEvent(tracker, e);
    if (!tracker.rafId) {
      this.startLoop(tracker);
    }
  }

  onLeave(tracker) {
    tracker.isHovered = false;
    tracker.target.x = 0;
    tracker.target.y = 0;
    tracker.target.rotX = 0;
    tracker.target.rotY = 0;
    tracker.target.scale = 1;
    tracker.target.glowX = 0;
    tracker.target.glowY = 0;
    tracker.target.glowOpacity = 0;

    if (!tracker.rafId) {
      this.startLoop(tracker);
    }
  }

  updateTargetsFromEvent(tracker, e) {
    const rect = tracker.wrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Coordenadas normalizadas [-1, 1] respecto al centro
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    const maxTrans = LOGO_CONFIG.maxTranslate || 10;
    const maxRot = LOGO_CONFIG.maxRotate || 12;

    // Físicas magnéticas y tilt 3D
    tracker.target.x = deltaX * maxTrans;
    tracker.target.y = deltaY * maxTrans;
    tracker.target.rotY = deltaX * maxRot;
    tracker.target.rotX = -deltaY * maxRot;

    // Posición del foco de luz glow respecto al centro del contenedor
    tracker.target.glowX = e.clientX - centerX;
    tracker.target.glowY = e.clientY - centerY;
  }

  startLoop(tracker) {
    const animate = () => {
      const lerpFactor = LOGO_CONFIG.lerp || 0.12;
      const { current, target } = tracker;

      // Interpolación lineal LERP para transiciones ultrasuaves
      current.x += (target.x - current.x) * lerpFactor;
      current.y += (target.y - current.y) * lerpFactor;
      current.rotX += (target.rotX - current.rotX) * lerpFactor;
      current.rotY += (target.rotY - current.rotY) * lerpFactor;
      current.scale += (target.scale - current.scale) * lerpFactor;
      current.glowX += (target.glowX - current.glowX) * lerpFactor;
      current.glowY += (target.glowY - current.glowY) * lerpFactor;
      current.glowOpacity += (target.glowOpacity - current.glowOpacity) * lerpFactor;

      // Verificar si está cerca del reposo para cancelar el bucle y ahorrar CPU/GPU
      const isAtRest =
        !tracker.isHovered &&
        Math.abs(current.x) < 0.001 &&
        Math.abs(current.y) < 0.001 &&
        Math.abs(current.rotX) < 0.001 &&
        Math.abs(current.rotY) < 0.001 &&
        Math.abs(current.scale - 1) < 0.001 &&
        Math.abs(current.glowOpacity) < 0.001;

      if (isAtRest) {
        // Encajar exactamente en 0
        current.x = 0;
        current.y = 0;
        current.rotX = 0;
        current.rotY = 0;
        current.scale = 1;
        current.glowOpacity = 0;

        this.applyTransforms(tracker);
        tracker.rafId = null;
        return; // Detener bucle
      }

      this.applyTransforms(tracker);
      tracker.rafId = requestAnimationFrame(animate);
    };

    tracker.rafId = requestAnimationFrame(animate);
  }

  applyTransforms(tracker) {
    const { wrapper, glow, current } = tracker;

    // Transformación 3D del icono con aceleración por GPU
    if (wrapper) {
      wrapper.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) rotateX(${current.rotX}deg) rotateY(${current.rotY}deg) scale(${current.scale})`;
    }

    // Variables CSS para iluminación dinámica
    if (glow) {
      glow.style.setProperty('--glow-x', `${current.glowX}px`);
      glow.style.setProperty('--glow-y', `${current.glowY}px`);
      glow.style.setProperty('--glow-opacity', current.glowOpacity);
    }
  }

  destroy() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    this.trackers.forEach((tracker) => {
      if (tracker.rafId) {
        cancelAnimationFrame(tracker.rafId);
        tracker.rafId = null;
      }
      if (tracker.wrapper) tracker.wrapper.style.transform = '';
      if (tracker.glow) {
        tracker.glow.style.removeProperty('--glow-x');
        tracker.glow.style.removeProperty('--glow-y');
        tracker.glow.style.removeProperty('--glow-opacity');
      }
    });

    this.trackers = [];
  }
}
