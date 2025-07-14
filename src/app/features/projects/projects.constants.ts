// Constantes específicas para la sección Projects
// Esto evita conflictos con otras secciones

export const PROJECTS_CARD_CONFIG = {
  // Desktop configuration - Optimizado para 3 cards por ventana sin imágenes
  desktop: {
    width: 320, // Mantengo el ancho optimizado para 3 cards
    height: 220, // Reducido significativamente al eliminar la imagen
    maxWidth: 320,
    minWidth: 320
  },
  
  // Mobile configuration  
  mobile: {
    width: 280,
    height: 'auto',
    maxWidth: 280,
    minWidth: 280
  },
  
  // Layout configuration
  layout: {
    itemsPerPage: 3,
    gap: 15, // Mantengo el gap optimizado
    containerMaxWidth: 1200,
    containerPadding: '0 var(--section-padding-x)'
  }
} as const;

export const PROJECTS_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
} as const; 