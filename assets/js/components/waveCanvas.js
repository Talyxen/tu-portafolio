/**
 * Componente WaveCanvasEffect
 * Gestiona el canvas para crear una onda interactiva de partículas al mover el ratón.
 * Incluye limpieza integral en destroy() y respeto por prefers-reduced-motion.
 */

import { CONFIG } from '../config.js';
import { throttle, prefersReducedMotion } from '../utils.js';

class WaveParticle {
  constructor(x, y, ctx) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 2;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    this.life = 100;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 1;
    this.size *= CONFIG.WAVE_CANVAS.SIZE_DECAY;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.globalAlpha = Math.max(0, this.life / 100);
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
    this.ctx.fill();
  }
}

export class WaveCanvasEffect {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = null;
    this.particles = [];
    this.animationFrameId = null;
    this.abortController = null;
    this.isRunning = false;
    this.handleResize = throttle(this.resizeCanvas.bind(this), 100);
    this.handleMouseMove = throttle(this.onMouseMove.bind(this), 20);
  }

  init() {
    if (!this.canvas || prefersReducedMotion()) {
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.abortController = new AbortController();
    const { signal } = this.abortController;

    this.resizeCanvas();
    window.addEventListener('resize', this.handleResize, { signal, passive: true });
    document.addEventListener('mousemove', this.handleMouseMove, { signal, passive: true });

    this.isRunning = true;
    this.animate();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  onMouseMove(e) {
    if (!this.isRunning) return;
    this.createParticles(e.clientX, e.clientY);
  }

  createParticles(x, y) {
    for (let i = 0; i < CONFIG.WAVE_CANVAS.PARTICLES_PER_MOVE; i++) {
      if (this.particles.length < CONFIG.WAVE_CANVAS.MAX_PARTICLES) {
        this.particles.push(new WaveParticle(x, y, this.ctx));
      }
    }
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.update();
      p.draw();

      if (p.life <= 0 || p.size <= CONFIG.WAVE_CANVAS.MIN_SIZE) {
        this.particles.splice(i, 1);
        i--;
      }
    }

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

    this.particles = [];
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
