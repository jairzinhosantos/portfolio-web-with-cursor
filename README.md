# Personal Portfolio

Portafolio personal construido con Angular 19 que muestra información profesional, proyectos, publicaciones y contenido multimedia.

## Características

- Angular 19 con Server-Side Rendering
- Diseño responsive
- Integración con APIs externas (GitHub, YouTube, Medium)
- Carruseles interactivos
- Gestión de temas
- Variables de entorno
- Sistema de fallbacks
- SEO optimizado

## Requisitos Previos

- Node.js 20.x LTS
- npm
- Claves de API para servicios externos (opcional)

## Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/jairzinhosantos/portfolio.git
cd portfolio
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar archivos de entorno y datos personales

#### Configurar variables de entorno:
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts
```

Edita los archivos con tus credenciales:
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

#### Configurar datos personales:
```bash
cp src/assets/data/personal-info.example.json src/assets/data/personal-info.json
cp src/assets/data/social-urls.example.json src/assets/data/social-urls.json
```

Edita los archivos JSON con tu información:
- `src/assets/data/personal-info.json`
- `src/assets/data/social-urls.json`

### 4. Agregar archivos personales
- Foto de perfil: `src/assets/branding/profile.png`
- CV en PDF: `src/assets/resume/resume_tu_nombre-es.pdf`

### 5. Ejecutar en desarrollo
```bash
npm start
```

Disponible en `http://localhost:4200`

## Scripts Disponibles

```bash
npm start          # Servidor de desarrollo
npm run build      # Build para producción
npm run build:ssr  # Build con SSR
npm test           # Pruebas unitarias
npm run e2e        # Pruebas end-to-end
npm run analyze    # Análisis del bundle
```

## Variables de Entorno

### YouTube API
- API Key: Obtén una en Google Cloud Console
- Channel ID: ID del canal de YouTube
- Channel Handle: Handle del canal

### GitHub API
- Username: Tu usuario de GitHub
- Token (opcional): Token personal

### Medium RSS
- Username: Tu usuario de Medium
- RSS API URL: Servicio para convertir RSS a JSON

## Estructura del Proyecto

```
src/
├── app/
│   ├── services/          # Servicios para APIs externas
│   │   ├── github.service.ts    # Servicio de GitHub
│   │   ├── medium.service.ts    # Servicio de Medium
│   │   └── youtube.service.ts   # Servicio de YouTube
│   ├── app.component.ts   # Componente principal
│   ├── app.component.html # Template principal
│   └── app.component.scss # Estilos principales
├── assets/               # Recursos estáticos
│   ├── branding/        # Logos y marca personal
│   ├── icons/           # Iconos de tecnologías
│   ├── projects/        # Imágenes de proyectos
│   └── publications/    # Imágenes de publicaciones
├── environments/        # Configuración de entornos
└── styles.scss         # Estilos globales
```

## Características Técnicas

### Carruseles Interactivos
- Soporte táctil y mouse
- Responsive
- Animaciones CSS

### Gestión de Temas
- Tema claro, oscuro y automático
- Persistencia en localStorage
- Transiciones suaves

### Performance
- Lazy loading
- Server-Side Rendering
- Optimización de bundles

### Gestión de Errores
- Sistema de fallbacks
- Manejo robusto de errores
- Estados de carga

## APIs Integradas

### GitHub API
- Endpoint: `https://api.github.com/users/{username}/repos`
- Obtiene repositorios públicos
- Fallback: Array vacío

### YouTube Data API v3
- Endpoint: `https://www.googleapis.com/youtube/v3/`
- Obtiene videos del canal
- Fallback: Estado no disponible

### Medium RSS
- Endpoint: RSS convertido a JSON
- Obtiene últimos artículos
- Fallback: Artículos estáticos

## Despliegue

### Construcción para producción
```bash
npm run build
```

Los archivos se generan en `dist/portfolio/`

### Variables de entorno en producción
Configura las variables en tu plataforma de hosting:
- Vercel: Environment Variables
- Netlify: Site settings > Environment variables

### SSR
```bash
npm run build:ssr
npm run serve:ssr
```

## Seguridad

### Protección de Credenciales
- Variables de entorno separadas del código
- Archivos reales excluidos del repositorio
- Archivos ejemplo como plantillas
- Tokens con permisos mínimos

### Protección de Datos Personales
- Información personal en archivos separados
- CV y fotos excluidos del control de versiones

### Archivos Protegidos
```
src/environments/environment.ts
src/environments/environment.prod.ts
src/assets/data/personal-info.json
src/assets/data/social-urls.json
src/assets/resume/*.pdf
src/assets/branding/profile.png
```

### Configuración Inicial
1. Copia archivos `.example` y remueve el sufijo
2. Edita con tu información real
3. Agrega foto de perfil y CV
4. No subas estos archivos al repositorio

### Validación de Datos
- Sanitización automática de APIs
- Validación de URLs y HTML
- Manejo seguro de errores

## Actualizaciones Recientes

### v1.3.0 - Seguridad y Privacidad
- Protección de información personal y credenciales
- Archivos sensibles excluidos del repositorio
- Archivos de ejemplo para configuración
- Documentación de seguridad
- README minimalista

### v1.2.0 - Variables de Entorno
- Migración a variables de entorno
- Archivos `.env` y `.env.example`
- Mejora en gestión de errores
- Documentación de configuración

### v1.1.0 - Performance
- Optimización con Node.js 20 LTS
- Resolución de errores TypeScript
- Mejora en cargas de dependencias

## Compatibilidad

- Navegadores: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Dispositivos: Desktop, Tablet, Mobile
- Node.js: 20.x LTS
- Angular: 19.x

## Contribuciones

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## Licencia

MIT License. Ver `LICENSE` para más detalles.

## Nota de Seguridad

Este repositorio utiliza archivos de ejemplo para proteger información sensible:

1. Copia archivos `.example` y configúralos
2. No subas archivos con credenciales reales
3. Revisa el `.gitignore` para confirmar protección
