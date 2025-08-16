# Portfolio Static Data System

This directory contains the JSON files that feed the static content of the personal portfolio.

## Data Files

### personal-info.json
Contains basic personal information.

Structure:
```json
{
  "personalInfo": {
    "nombre": "Full name",
    "titulo1": "Main title",
    "titulo2": "Secondary title", 
    "titulo3": "Tertiary title",
    "tagline": "Presentation phrase (accepts HTML)",
    "fotoPerfil": "Image path",
    "ubicacion": "City, Country",
    "resumenProfesional": "Professional description (multiple lines)"
  }
}
```

### social-urls.json
Social URLs, icon configuration and interaction messages.

Structure:
```json
{
  "socialMedia": { "platform": "url" },
  "iconMapping": { "platform": { "icon": "", "title": "", "customContent": "" } },
  "socialGroups": { "primary": [], "secondary": [] },
  "messages": {
    "contact": { "emailSubject": "", "emailBody": "", "contactLinkText": "" },
    "discord": { "popupTitle": "", "popupMessage": "", "popupButtonText": "" }
  }
}
```

### expertise.json
Defines areas of professional expertise.

Structure:
```json
{
  "areasEspecializacion": [
    {
      "titulo": "Area name",
      "descripcion": "Detailed description",
      "icono": "Font Awesome CSS class (e.g: 'fas fa-brain')"
    }
  ]
}
```

### research-interests.json
Defines research areas and academic interests.

Structure:
```json
{
  "areasInvestigacion": [
    {
      "titulo": "Research area",
      "descripcion": "Interest description",
      "icono": "Font Awesome CSS class"
    }
  ]
}
```

### recommendations.json
Contains LinkedIn recommendations and testimonials.

Structure:
```json
{
  "recomendaciones": [
    {
      "nombre": "Full name",
      "cargo": "Professional title",
      "empresa": "Company name",
      "fecha": "Recommendation date",
      "texto": "Full recommendation text",
      "foto": "Profile image URL or placeholder",
      "linkedinUrl": "LinkedIn profile URL"
    }
  ]
}
```

### static-videos.json
Static backup videos when YouTube API is not available.

Structure:
```json
{
  "videos": [
    {
      "id": "YOUTUBE_VIDEO_ID",
      "title": "Video title",
      "description": "Video description",
      "url": "https://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID",
      "thumbnail": "https://img.youtube.com/vi/YOUTUBE_VIDEO_ID/maxresdefault.jpg",
      "duration": 300,
      "viewCount": "1,234",
      "publishedAt": "2024-01-15T00:00:00Z"
    }
  ]
}
```

## How to Update

### To modify personal information:
1. Edit `personal-info.json`
2. The application will detect changes automatically

### To add/modify areas of expertise:
1. Edit `expertise.json`
2. Use available Font Awesome icons

### To update research:
1. Edit `research-interests.json`
2. Keep descriptions concise

### To add recommendations:
1. Edit `recommendations.json`
2. Use placeholders for photos: `https://via.placeholder.com/150x150/COLOR/ffffff?text=INITIALS`

### To configure static videos:
1. Edit `static-videos.json`
2. Extract YouTube video ID from URL
3. Thumbnail is generated automatically

## Fallback System

If any JSON file cannot be loaded, the system uses minimal fallback data defined in `StaticPortfolioService`.

## Important Notes

- JSON Format: Maintain exact structure to avoid errors
- URLs: All URLs must be absolute (include http/https)
- Icons: Use Font Awesome classes available in the project
- Images: Local image paths must point to `assets/`
- HTML: Only `tagline` accepts basic HTML (like `<strong>`)

## Related Services

- StaticPortfolioService: Loads and manages JSON data
- SocialUrlsService: Centralized service for social URLs and messages
- Components: AboutComponent, ExpertiseComponent, ResearchComponent, RecommendationsComponent consume this data

## Code Usage Example

```typescript
// In AppComponent
this.staticPortfolioService.getPersonalInfo().subscribe(data => {
  this.personalInfo = data.personalInfo;
});
```

## Applied Clean Code Principles

### Redundancy Elimination
- Before: `socialMedia` duplicated in separate files
- Now: Single centralized `social-urls.json` file

### Single Responsibility
- Each file has a specific and well-defined purpose
- Specialized services for each data type
- Robust fallbacks in case of loading errors

### Modularity
- Clear and consistent JSON structure
- Integrated documentation with examples
- Automatic cache-buster to prevent cache issues