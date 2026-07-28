/**
 * Punto de entrada principal (App Controller)
 * Inicializa de forma condicional y segura cada módulo del portafolio,
 * gestionando el ciclo de vida de la aplicación.
 */

import { DOMCache } from './utils.js';
import { WaveCanvasEffect } from './components/waveCanvas.js';
import { CustomCursorEffect } from './components/customCursor.js';
import { initFloatingParticles, destroyFloatingParticles } from './components/floatingParticles.js';
import { NavigationManager } from './components/navigation.js';
import { ScrollRevealObserver } from './components/scrollReveal.js';
import { LogoInteraction } from './components/logoInteraction.js';
import { LogoTextInteraction } from './components/logoTextInteraction.js';

class PortfolioApp {
  constructor() {
    this.components = {
      waveCanvas: null,
      customCursor: null,
      navigation: null,
      scrollReveal: null,
      logoInteraction: null,
      logoTextInteraction: null,
    };
    this.particlesContainer = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    // 1. Inicializar Navegación (Header y Menú Móvil)
    this.components.navigation = new NavigationManager();
    this.components.navigation.init();

    // 2. Inicializar Interacción 3D de la Imagen y Salto en Cascada del Texto del Logo
    this.components.logoInteraction = new LogoInteraction();
    this.components.logoInteraction.init();

    this.components.logoTextInteraction = new LogoTextInteraction();
    this.components.logoTextInteraction.init();

    // 3. Inicializar Revelado al Scroll
    this.components.scrollReveal = new ScrollRevealObserver();
    this.components.scrollReveal.init();

    // 3. Inicializar Efecto de Onda en Canvas (si existe en la página)
    const waveCanvasElement = DOMCache.get('#waveCanvas');
    if (waveCanvasElement) {
      this.components.waveCanvas = new WaveCanvasEffect(waveCanvasElement);
      this.components.waveCanvas.init();
    }

    // 4. Inicializar Cursor Personalizado (si existe en la página)
    const cursorElement = DOMCache.get('.cursor-effect');
    if (cursorElement) {
      this.components.customCursor = new CustomCursorEffect(cursorElement);
      this.components.customCursor.init();
    }

    // 5. Inicializar Partículas Flotantes de Fondo (si existe en la página)
    this.particlesContainer = DOMCache.get('#particles');
    if (this.particlesContainer) {
      initFloatingParticles(this.particlesContainer);
    }

    this.isInitialized = true;
  }

  destroy() {
    if (!this.isInitialized) return;

    // Destruir componentes con clases de ciclo de vida
    Object.values(this.components).forEach((component) => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });

    // Destruir partículas funcionales sin estado
    if (this.particlesContainer) {
      destroyFloatingParticles(this.particlesContainer);
    }

    // Limpiar caché de selectores DOM
    DOMCache.clear();
    this.isInitialized = false;
  }
}

// Inicializar la aplicación cuando el DOM esté listo
const app = new PortfolioApp();

function bootstrap() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
  } else {
    app.init();
  }
}

bootstrap();

// Exponemos la instancia para facilitar depuración y pruebas
if (typeof window !== 'undefined') {
  window.portfolioApp = app;
}

export default app;
