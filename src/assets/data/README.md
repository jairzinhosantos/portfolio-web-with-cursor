# Sistema de Datos Estáticos del Portafolio

Este directorio contiene los archivos JSON que alimentan el contenido estático del portafolio personal de Jairzinho Santos.

## Archivos de Datos

### personal-info.json
Contiene información personal básica.

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
  }
}
```

### social-urls.json
URLs sociales, configuración de iconos y mensajes de interacción.

**Estructura:**
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

### expertise.json
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

### research-interests.json
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

### recommendations.json
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

### static-videos.json
Videos estáticos de respaldo cuando la API de YouTube no está disponible.

**Estructura:**
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

## Cómo Actualizar

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

### Para configurar videos estáticos:
1. Edita `static-videos.json`
2. Extrae el ID del video de YouTube de la URL
3. La thumbnail se genera automáticamente

## Sistema de Fallback

Si algún archivo JSON no se puede cargar, el sistema usa datos de fallback mínimos definidos en `StaticPortfolioService`.

## Notas Importantes

- Formato JSON: Mantén la estructura exacta para evitar errores
- URLs: Todas las URLs deben ser absolutas (incluir http/https)
- Iconos: Usa clases de Font Awesome disponibles en el proyecto
- Imágenes: Las rutas de imágenes locales deben apuntar a `assets/`
- HTML: Solo `tagline` acepta HTML básico (como `<strong>`)

## Servicios Relacionados

- StaticPortfolioService: Carga y maneja los datos JSON
- SocialUrlsService: Servicio centralizado para URLs sociales y mensajes
- Componentes: AboutComponent, ExpertiseComponent, ResearchComponent, RecommendationsComponent consumen estos datos

## Ejemplo de Uso en Código

```typescript
// En AppComponent
this.staticPortfolioService.getPersonalInfo().subscribe(data => {
  this.personalInfo = data.personalInfo;
});
```

## Principios de Clean Code Aplicados

### Eliminación de Redundancias
- Antes: `socialMedia` duplicado en archivos separados
- Ahora: Un solo archivo centralizado `social-urls.json`

### Responsabilidad Única
- Cada archivo tiene un propósito específico y bien definido
- Servicios especializados para cada tipo de dato
- Fallbacks robustos en caso de errores de carga

### Modularidad
- Estructura JSON clara y consistente
- Documentación integrada con ejemplos
- Cache-buster automático para prevenir problemas de caché