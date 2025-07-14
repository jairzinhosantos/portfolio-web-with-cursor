# Estructura de Datos del Portafolio

Esta carpeta contiene todos los archivos JSON que alimentan el portafolio de Jairzinho Santos, siguiendo principios de **Clean Code** y **modularidad**.

## Arquitectura Centralizada

### 📋 `personal-info.json`
**Propósito**: Información personal básica (sin datos sociales)
```json
{
  "personalInfo": {
    "nombre": "string",
    "titulo1": "string", 
    "titulo2": "string",
    "titulo3": "string",
    "tagline": "string (HTML permitido)",
    "fotoPerfil": "string (ruta del asset)",
    "ubicacion": "string",
    "resumenProfesional": "string (HTML permitido, saltos de línea con \\n)"
  }
}
```

### 🔗 `social-urls.json` (Archivo Centralizado)
**Propósito**: URLs sociales, configuración de iconos, agrupaciones Y mensajes de interacción
- ✅ **Single Source of Truth** para todas las redes sociales
- ✅ **Configuración modular** de iconos y grupos
- ✅ **Mensajes parametrizados** para contacto y Discord
```json
{
  "socialMedia": { "plataforma": "url" },
  "iconMapping": { "plataforma": { "icon": "", "title": "", "customContent": "" } },
  "socialGroups": { "primary": [], "secondary": [] },
  "messages": {
    "contact": { "emailSubject": "", "emailBody": "", "contactLinkText": "" },
    "discord": { "popupTitle": "", "popupMessage": "", "popupButtonText": "" }
  }
}
```

### 🎯 `expertise.json`
**Propósito**: Áreas de especialización profesional
```json
{
  "areasEspecializacion": [
    {
      "titulo": "string",
      "descripcion": "string", 
      "icono": "string (clase FontAwesome)"
    }
  ]
}
```

### 🔬 `research-interests.json`
**Propósito**: Intereses de investigación académica
```json
{
  "areasInvestigacion": [
    {
      "titulo": "string",
      "descripcion": "string",
      "icono": "string (clase FontAwesome)"
    }
  ]
}
```

### 💬 `recommendations.json`
**Propósito**: Testimonios y recomendaciones profesionales
```json
{
  "recomendaciones": [
    {
      "nombre": "string",
      "posicion": "string", 
      "empresa": "string",
      "testimonio": "string",
      "foto": "string (ruta del asset)"
    }
  ]
}
```

### 🎥 `static-videos.json`
**Propósito**: Videos estáticos de respaldo
```json
{
  "videos": [
    {
      "titulo": "string",
      "descripcion": "string",
      "url": "string (URL de YouTube)",
      "thumbnail": "string (URL de imagen)"
    }
  ]
}
```

## Principios de Clean Code Aplicados

### ✅ Eliminación de Redundancias
- **Antes**: `socialMedia` duplicado en `personal-info.json` y `social-urls.json`
- **Ahora**: Un solo archivo centralizado `social-urls.json`

### ✅ Responsabilidad Única
- **Antes**: `messages.json` separado innecesariamente
- **Ahora**: Mensajes integrados en `social-urls.json` (ambos manejan interacciones sociales)

### ✅ Modularidad
- Cada archivo tiene un propósito específico y bien definido
- Servicios especializados para cada tipo de dato
- Fallbacks robustos en caso de errores de carga

### ✅ Mantenibilidad
- Estructura JSON clara y consistente
- Documentación integrada con ejemplos
- Cache-buster automático para prevenir problemas de caché

## Servicios Asociados

- **`StaticPortfolioService`**: Maneja datos estáticos básicos (personal, expertise, research, recommendations)
- **`SocialUrlsService`**: Servicio centralizado para URLs sociales y mensajes de interacción
- **`MediumService`**: Artículos dinámicos de Medium
- **`GithubService`**: Repositorios dinámicos de GitHub
- **`YoutubeService`**: Videos dinámicos de YouTube

## Notas de Implementación

- Todos los archivos usan cache-buster para forzar recarga: `?v=${timestamp}`
- Los servicios incluyen fallbacks para garantizar que la aplicación funcione siempre
- El HTML embebido en JSON es sanitizado automáticamente por Angular
- Los saltos de línea en textos largos se manejan con `\n` y `white-space: pre-line` en CSS

# 📂 Sistema de Datos Estáticos del Portafolio

Este directorio contiene los archivos JSON que alimentan el contenido estático del portafolio personal de Jairzinho Santos.

## 📋 Archivos de Datos

### `personal-info.json`
Contiene información personal y redes sociales.

**Estructura:**
```json
{
  "personalInfo": {
    "nombre": "Nombre completo",
    "titulo1": "Título principal",
    "titulo2": "Título secundario", 
    "titulo3": "Título terciario",
    "tagline": "Frase de presentación (acepta HTML)",
    "fotoPerfil": "Ruta a la imagen",
    "ubicacion": "Ciudad, País",
    "resumenProfesional": "Descripción profesional (múltiples líneas)"
  },
  "socialMedia": {
    "linkedin": "URL de LinkedIn",
    "github": "URL de GitHub",
    "twitter": "URL de Twitter/X",
    "youtube": "URL de YouTube",
    "tiktok": "URL de TikTok",
    "instagram": "URL de Instagram",
    "medium": "URL de Medium",
    "email": "Email con formato mailto:"
  }
}
```

### `expertise.json`
Define las áreas de especialización profesional.

**Estructura:**
```json
{
  "areasEspecializacion": [
    {
      "titulo": "Nombre del área",
      "descripcion": "Descripción detallada",
      "icono": "Clase CSS de Font Awesome (ej: 'fas fa-brain')"
    }
  ]
}
```

### `research-interests.json`
Define las áreas de investigación y intereses académicos.

**Estructura:**
```json
{
  "areasInvestigacion": [
    {
      "titulo": "Área de investigación",
      "descripcion": "Descripción del interés",
      "icono": "Clase CSS de Font Awesome"
    }
  ]
}
```

### `recommendations.json`
Contiene las recomendaciones de LinkedIn y testimonios.

**Estructura:**
```json
{
  "recomendaciones": [
    {
      "nombre": "Nombre completo",
      "cargo": "Título profesional",
      "empresa": "Nombre de la empresa",
      "fecha": "Fecha de la recomendación",
      "texto": "Texto completo de la recomendación",
      "foto": "URL de la imagen de perfil o placeholder",
      "linkedinUrl": "URL del perfil de LinkedIn"
    }
  ]
}
```

## 🔧 Cómo Actualizar

### Para modificar información personal:
1. Edita `personal-info.json`
2. La aplicación detectará los cambios automáticamente

### Para agregar/modificar áreas de especialización:
1. Edita `expertise.json`
2. Usa iconos de Font Awesome disponibles

### Para actualizar investigación:
1. Edita `research-interests.json`
2. Mantén las descripciones concisas

### Para agregar recomendaciones:
1. Edita `recommendations.json`
2. Usa placeholders para fotos: `https://via.placeholder.com/150x150/COLOR/ffffff?text=INICIALES`

## 🚀 Sistema de Fallback

Si algún archivo JSON no se puede cargar, el sistema usa datos de fallback mínimos definidos en `StaticPortfolioService`.

## 📝 Notas Importantes

- **Formato JSON:** Mantén la estructura exacta para evitar errores
- **URLs:** Todas las URLs deben ser absolutas (incluir http/https)
- **Iconos:** Usa clases de Font Awesome disponibles en el proyecto
- **Imágenes:** Las rutas de imágenes locales deben apuntar a `assets/`
- **HTML:** Solo `tagline` acepta HTML básico (como `<strong>`)

## 🛠️ Servicios Relacionados

- **`StaticPortfolioService`**: Carga y maneja los datos JSON
- **Componentes**: `AboutComponent`, `ExpertiseComponent`, `ResearchComponent`, `RecommendationsComponent` consumen estos datos

## 📊 Ejemplo de Uso en Código

```typescript
// En AppComponent
this.staticPortfolioService.getPersonalInfo().subscribe(data => {
  this.personalInfo = data.personalInfo;
  this.socialMedia = data.socialMedia;
});
```

# Videos Estáticos - Configuración

Este archivo JSON permite configurar videos estáticos que se mostrarán cuando la API de YouTube no esté disponible (por ejemplo, cuando se excede la cuota diaria).

## Ubicación
`src/assets/data/static-videos.json`

## Estructura del JSON

```json
{
  "videos": [
    {
      "id": "VIDEO_ID_DE_YOUTUBE",
      "title": "Título del video",
      "description": "Descripción del video",
      "url": "https://www.youtube.com/watch?v=VIDEO_ID_DE_YOUTUBE",
      "thumbnail": "https://img.youtube.com/vi/VIDEO_ID_DE_YOUTUBE/maxresdefault.jpg",
      "duration": 300,
      "viewCount": "1,234",
      "publishedAt": "2024-01-15T00:00:00Z"
    }
  ]
}
```

## Campos Explicados

- **id**: ID del video de YouTube (extraído de la URL)
- **title**: Título personalizado para el video
- **description**: Descripción personalizada
- **url**: URL completa del video (puede incluir timestamp con `&t=80s`)
- **thumbnail**: URL de la imagen de previsualización
- **duration**: Duración en segundos
- **viewCount**: Número de visualizaciones (formato string)
- **publishedAt**: Fecha de publicación en formato ISO

## Cómo Agregar Videos

1. Abre el archivo `src/assets/data/static-videos.json`
2. Agrega un nuevo objeto al array `videos`
3. Extrae el ID del video de YouTube de la URL
4. La thumbnail se genera automáticamente con: `https://img.youtube.com/vi/ID_DEL_VIDEO/maxresdefault.jpg`

## Ejemplo Práctico

Para el video: `https://www.youtube.com/watch?v=9MS_XSm2b4A&t=80s`

- **ID del video**: `9MS_XSm2b4A`
- **Thumbnail**: `https://img.youtube.com/vi/9MS_XSm2b4A/maxresdefault.jpg`

## Funcionamiento

- Si la API de YouTube funciona: Se muestran los videos reales del canal
- Si la API falla: Se cargan automáticamente los videos de este archivo JSON
- Si el archivo JSON no existe o está vacío: Se muestra el mensaje "Los videos se cargarán pronto"

## Notas Importantes

- Los videos deben ser públicos en YouTube
- Los cambios en este archivo se aplican inmediatamente al recargar la página
- El modal de video y la funcionalidad de pantalla completa funcionan normalmente con estos videos 