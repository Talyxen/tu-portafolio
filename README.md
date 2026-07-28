# Portafolio Web - Juan Sebastian Velasquez Rodriguez

Portafolio personal web moderno, dinámico y modular, diseñado para exhibir proyectos de desarrollo de software, currículum y artículos de blog. El proyecto destaca por su estética visual avanzada y una arquitectura frontend basada en buenas prácticas de ingeniería de software.

---

## 🌟 Características Principales

- **Diseño Dinámico y Premium**: Efectos visuales con partículas en Canvas, cursor personalizado interpolado (LERP) y animaciones fluidas al hacer scroll.
- **Arquitectura Modular ES6**: Estructura de código JavaScript organizada en componentes sin acoplamiento innecesario, fácil de mantener y escalar.
- **Rendimiento Optimizado**: Eventos de `scroll` y `resize` controlados mediante `throttle` y `debounce`, con event listeners pasivos (`passive: true`). Carga diferida en imágenes secundarias (`loading="lazy"`).
- **Accesibilidad (`prefers-reduced-motion`)**: Respeto automático por las preferencias de reducción de movimiento del sistema operativo del usuario.
- **Gestión Limpia de Memoria**: Componentes equipados con métodos de ciclo de vida (`init()` / `destroy()`) usando `AbortController` para la cancelación atómica y limpia de eventos, temporizadores y observadores.

---

## 📁 Estructura del Proyecto

```
tu-portafolio/
├── index.html              # Página principal del portafolio
├── blogs/                  # Artículos integrados en el blog
│   ├── react-hooks.html
│   ├── ia-desarrolladores.html
│   └── despliegue-nube.html
├── assets/
│   ├── css/
│   │   └── style.css       # Sistema de estilos y tokens CSS
│   ├── img/                # Imágenes estáticas
│   └── js/
│       ├── config.js       # Constantes y parámetros centralizados
│       ├── utils.js        # Utilidades (throttle, debounce, DOMCache, accesibilidad)
│       ├── main.js         # Bootstrap e inicializador del App Controller
│       └── components/     # Módulos de componentes frontend
│           ├── waveCanvas.js
│           ├── customCursor.js
│           ├── floatingParticles.js
│           ├── navigation.js
│           └── scrollReveal.js
├── package.json            # Scripts de desarrollo y linters
├── eslint.config.js        # Configuración de ESLint en formato flat config
└── .prettierrc             # Configuración de formateo Prettier
```

---

## 🚀 Instalación y Uso Local

Para desarrollar o ejecutar localmente el proyecto con herramientas de linter y formateo:

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/Talyxen/tu-portafolio.git
   cd tu-portafolio
   ```

2. **Instalar dependencias de desarrollo**:
   ```bash
   npm install
   ```

3. **Iniciar servidor local de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Comprobar y formatear el código**:
   ```bash
   npm run lint        # Ejecutar linter ES6
   npm run lint:fix    # Corregir errores automáticamente
   npm run format      # Formatear archivos con Prettier
   ```

---

## 👨‍💻 Autor

**Juan Sebastian Velasquez Rodriguez**
- **Email**: jsvr4303@gmail.com
- **Institución**: UNIMINUTO (4° Semestre - Desarrollo de Software)

---

## 📄 Licencia

Este proyecto se encuentra bajo la Licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más detalles.
