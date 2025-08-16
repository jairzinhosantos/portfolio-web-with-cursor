# Jairzinho Santos - Personal Portfolio

Un portafolio personal moderno construido con Angular 19 que muestra información profesional, proyectos, publicaciones y contenido multimedia.

## Características

- Angular 19 con Server-Side Rendering (SSR)
- Diseño Responsive optimizado para todos los dispositivos
- Integración con APIs externas:
  - GitHub (proyectos)
  - YouTube (videos)
  - Medium (artículos)
- Carruseles interactivos con soporte táctil
- Gestión de temas (claro/oscuro/automático)
- Variables de entorno para configuración segura
- Fallbacks robustos cuando las APIs fallan
- Animaciones suaves y transiciones
- SEO optimizado

## Requisitos Previos

- Node.js 20.x LTS (recomendado v20.19.3)
- npm (incluido con Node.js)
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
# Copia y configura los archivos de entorno
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts
```

Edita los archivos con tus credenciales reales:
- `src/environments/environment.ts` (desarrollo)
- `src/environments/environment.prod.ts` (producción)

#### Configurar datos personales:
```bash
# Copia y configura los archivos de datos personales
cp src/assets/data/personal-info.example.json src/assets/data/personal-info.json
cp src/assets/data/social-urls.example.json src/assets/data/social-urls.json
```

Edita los archivos JSON con tu información personal:
- `src/assets/data/personal-info.json` (información básica)
- `src/assets/data/social-urls.json` (redes sociales y contacto)

### 4. Agregar tu foto de perfil y CV
```bash
# Agrega tu foto de perfil (reemplaza el archivo existente)
# Archivo: src/assets/branding/profile.png

# Agrega tu CV en PDF (reemplaza el archivo existente)  
# Archivo: src/assets/resume/resume_tu_nombre-es.pdf
```

### 5. Ejecutar en desarrollo
```bash
npm start
```

El sitio estará disponible en `http://localhost:4200`

## Scripts Disponibles

```bash
# Desarrollo
npm start                # Inicia servidor de desarrollo
npm run dev             # Alias para npm start

# Construcción
npm run build           # Build para producción
npm run build:ssr       # Build con SSR

# Pruebas
npm test               # Ejecuta pruebas unitarias
npm run e2e            # Pruebas end-to-end

# Análisis
npm run analyze        # Analiza el bundle
```

## Variables de Entorno

### YouTube API
Para mostrar videos de YouTube, necesitas:
1. **API Key**: Obtén una en [Google Cloud Console](https://console.cloud.google.com/)
2. **Channel ID**: ID del canal de YouTube
3. **Channel Handle**: Handle del canal (ej: @jairzinho.santos)

### GitHub API
Para mostrar repositorios:
1. **Username**: Tu usuario de GitHub
2. **Token** (opcional): Token personal para evitar límites de rate

### Medium RSS
Para mostrar artículos:
1. **Username**: Tu usuario de Medium
2. **RSS API URL**: Servicio para convertir RSS a JSON

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
- Soporte para navegación táctil y mouse
- Carruseles responsivos que se adaptan al tamaño de pantalla
- Animaciones suaves con CSS transitions

### Gestión de Temas
- Tema claro, oscuro y automático (basado en preferencias del sistema)
- Persistencia en localStorage
- Transiciones suaves entre temas

### Optimización de Performance
- Lazy loading de imágenes
- Server-Side Rendering (SSR)
- Optimización de bundles con Angular

### Gestión de Errores
- Fallbacks cuando las APIs fallan
- Manejo robusto de errores de red
- Estados de carga informativos

## APIs Integradas

### GitHub API
- **Endpoint**: `https://api.github.com/users/{username}/repos`
- **Funcionalidad**: Obtiene repositorios públicos ordenados por última actualización
- **Fallback**: Array vacío si falla la API

### YouTube Data API v3
- **Endpoint**: `https://www.googleapis.com/youtube/v3/`
- **Funcionalidad**: Obtiene videos del canal
- **Fallback**: Estado "no disponible" si falla la API

### Medium RSS
- **Endpoint**: RSS convertido a JSON via `rss2json.com`
- **Funcionalidad**: Obtiene últimos artículos publicados
- **Fallback**: Artículos estáticos si falla la API

## Despliegue

### Construcción para producción
```bash
npm run build
```

Los archivos se generarán en `dist/portfolio/`

### Variables de entorno en producción
Configura las variables en tu plataforma de hosting:
- Vercel: En la sección "Environment Variables"
- Netlify: En "Site settings > Environment variables"
- Otros: Según documentación del proveedor

### SSR (Server-Side Rendering)
```bash
npm run build:ssr
npm run serve:ssr
```

## Seguridad

Este proyecto implementa múltiples capas de seguridad para proteger información sensible:

### Protección de Credenciales
- Variables de entorno en archivos separados del código fuente
- Archivos de configuración real excluidos del repositorio via `.gitignore`
- Archivos de ejemplo (`.example`) disponibles como plantillas
- Tokens de API con permisos mínimos necesarios

### Protección de Datos Personales
- Información personal en archivos JSON separados y excluidos del repositorio
- Archivos de ejemplo disponibles para configuración inicial
- CV y fotos de perfil excluidos del control de versiones

### Archivos Protegidos
Los siguientes archivos están excluidos del repositorio:
```
src/environments/environment.ts
src/environments/environment.prod.ts
src/assets/data/personal-info.json
src/assets/data/social-urls.json
src/assets/resume/*.pdf
src/assets/branding/profile.png
```

### Configuración Inicial
Para configurar el proyecto con tu información:
1. Copia los archivos `.example` y remueve el sufijo
2. Edita los archivos con tu información real
3. Agrega tu foto de perfil y CV
4. Nunca subas estos archivos al repositorio

### Validación de Datos
- Sanitización automática de datos de APIs externas
- Validación de URLs y contenido HTML
- Manejo seguro de errores sin exponer información sensible

## Actualizaciones Recientes

### v1.3.0 - Seguridad y Privacidad (Actual)
- Protección completa de información personal y credenciales
- Archivos sensibles excluidos del repositorio via `.gitignore`
- Archivos de ejemplo para configuración inicial
- Documentación de seguridad actualizada
- README minimalista sin emojis

### v1.2.0 - Variables de Entorno
- Migración a variables de entorno para todas las APIs
- Creación de archivos `.env` y `.env.example`
- Mejora en gestión de errores de servicios
- Documentación completa de configuración

### v1.1.0 - Mejoras de Performance
- Optimización con Node.js 20 LTS
- Resolución de errores de TypeScript
- Mejora en cargas de dependencias

## Compatibilidad

- **Navegadores**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Dispositivos**: Desktop, Tablet, Mobile
- **Node.js**: 20.x LTS (recomendado)
- **Angular**: 19.x

## Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## Contacto

Jairzinho Santos
- LinkedIn: [jairzinhosantos](https://www.linkedin.com/in/jairzinhosantos/)
- GitHub: [jairzinhosantos](https://github.com/jairzinhosantos)
- Email: jairzinho.santos@hotmail.com
- Portfolio: [jairzinhosantos.com](https://jairzinhosantos.com)

## Nota de Seguridad

Este repositorio utiliza archivos de ejemplo (`.example`) para proteger información sensible. Antes de usar el proyecto, asegúrate de:

1. Copiar los archivos `.example` y configurarlos con tu información real
2. Nunca subir archivos con credenciales o datos personales reales
3. Revisar el `.gitignore` para confirmar que tus archivos sensibles están protegidos
