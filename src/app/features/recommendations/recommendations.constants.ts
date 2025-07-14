// Constantes específicas para la sección Recommendations
// Esto evita conflictos con otras secciones

export const RECOMMENDATIONS_CARD_CONFIG = {
  // Desktop configuration
  desktop: {
    width: 480,
    height: 420,
    maxWidth: 480,
    minWidth: 480
  },
  
  // Mobile configuration  
  mobile: {
    width: 300,
    height: 380,
    maxWidth: 300,
    minWidth: 300
  },
  
  // Layout configuration
  layout: {
    itemsPerPage: 2,
    gap: 30,
    containerMaxWidth: 1200,
    containerPadding: '0 var(--section-padding-x)'
  },
  
  // Content configuration
  content: {
    maxLines: 10,
    avatarSize: 50,
    headerHeight: 70
  }
} as const;

export const RECOMMENDATIONS_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
} as const;

// Constantes para recomendaciones - Configuración optimizada para 3 tarjetas por vista
export const RECOMMENDATIONS_CONFIG = {
  // Configuración del carousel
  carousel: {
    itemsPerView: 3,
    spaceBetween: 20,
    loop: false,
    autoplay: false,
    containerPadding: '0 var(--section-padding-x)'
  },
  
  // Configuración de las tarjetas
  card: {
    width: 320,
    minHeight: 280,
    padding: 20,
    borderRadius: 12
  },
  
  // Configuración responsive
  responsive: {
    mobile: {
      itemsPerView: 1,
      spaceBetween: 15,
      containerPadding: '0 var(--section-padding-x)'
    },
    tablet: {
      itemsPerView: 2,
      spaceBetween: 18,
      containerPadding: '0 var(--section-padding-x)'
    }
  }
} as const; 