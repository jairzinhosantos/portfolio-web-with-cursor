import { CarouselConfig } from '../interfaces';

export const DEFAULT_CAROUSEL_CONFIG: CarouselConfig = {
  itemsPerPage: 3,
  gap: 20,
  autoSlide: false,
  autoSlideInterval: 5000,
  enableDrag: true
};

// Configuraciones específicas y aisladas por sección
export const PROJECTS_CAROUSEL_CONFIG: Partial<CarouselConfig> = {
  itemsPerPage: 3,
  gap: 15,
  autoSlide: false,
  enableDrag: true
};

export const PUBLICATIONS_CAROUSEL_CONFIG: Partial<CarouselConfig> = {
  itemsPerPage: 2,
  gap: 20,
  autoSlide: false,
  enableDrag: true
};

export const VIDEOS_CAROUSEL_CONFIG: Partial<CarouselConfig> = {
  itemsPerPage: 2,
  gap: 20,
  autoSlide: false,
  enableDrag: true
};

export const RECOMMENDATIONS_CAROUSEL_CONFIG: Partial<CarouselConfig> = {
  itemsPerPage: 2,
  gap: 30,
  autoSlide: false,
  enableDrag: true
};

export const EXPERTISE_CAROUSEL_CONFIG: Partial<CarouselConfig> = {
  itemsPerPage: 4,
  gap: 15,
  autoSlide: false,
  enableDrag: true
};

export const RESEARCH_CAROUSEL_CONFIG: Partial<CarouselConfig> = {
  itemsPerPage: 4,
  gap: 15,
  autoSlide: false,
  enableDrag: true
};

export const TIKTOK_CAROUSEL_CONFIG: Partial<CarouselConfig> = {
  itemsPerPage: 3,
  gap: 20,
  autoSlide: false,
  enableDrag: true
};

// Función helper para obtener configuración específica por tipo
export function getCarouselConfigByType(type: string): Partial<CarouselConfig> {
  switch (type) {
    case 'projects':
      return PROJECTS_CAROUSEL_CONFIG;
    case 'publications':
      return PUBLICATIONS_CAROUSEL_CONFIG;
    case 'videos':
      return VIDEOS_CAROUSEL_CONFIG;
    case 'recommendations':
      return RECOMMENDATIONS_CAROUSEL_CONFIG;
    case 'expertise':
      return EXPERTISE_CAROUSEL_CONFIG;
    case 'research':
      return RESEARCH_CAROUSEL_CONFIG;
    case 'tiktok':
      return TIKTOK_CAROUSEL_CONFIG;
    default:
      return DEFAULT_CAROUSEL_CONFIG;
  }
}

// Configuración legacy mantenida para backward compatibility
export const CAROUSEL_CONFIGS: Record<string, Partial<CarouselConfig>> = {
  projects: PROJECTS_CAROUSEL_CONFIG,
  publications: PUBLICATIONS_CAROUSEL_CONFIG,
  videos: VIDEOS_CAROUSEL_CONFIG,
  tiktok: TIKTOK_CAROUSEL_CONFIG,
  recommendations: RECOMMENDATIONS_CAROUSEL_CONFIG,
  expertise: EXPERTISE_CAROUSEL_CONFIG,
  research: RESEARCH_CAROUSEL_CONFIG
};

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
};

export const MOBILE_ITEMS_PER_PAGE = 1;
export const TABLET_ITEMS_PER_PAGE = 2; 