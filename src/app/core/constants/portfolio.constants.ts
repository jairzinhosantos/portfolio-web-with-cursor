import { PersonalInfo, SocialMedia, AreaEspecializacion, AreaInvestigacion, Recomendacion } from '../interfaces';

/**
 * Valores de fallback mínimos que se muestran durante la carga inicial.
 * Los datos reales se cargan dinámicamente desde archivos JSON en src/assets/data/
 * usando el StaticPortfolioService.
 * 
 * @description Estos valores solo deben usarse como placeholder inicial
 * y serán reemplazados automáticamente cuando se carguen los datos JSON.
 */
export const FALLBACK_PERSONAL_INFO: PersonalInfo = {
  nombre: 'Loading...',
  titulo1: 'Loading...',
  titulo2: 'Loading...',
  titulo3: 'Loading...',
  tagline: 'Loading personal information...',
  fotoPerfil: 'assets/branding/profile.png',
  ubicacion: 'Loading...',
  resumenProfesional: 'Loading personal information...'
};

/**
 * URLs sociales de fallback durante la carga inicial.
 * Los valores reales se cargan desde social-urls.json
 */
export const FALLBACK_SOCIAL_MEDIA: SocialMedia = {
  linkedin: '',
  github: '',
  twitter: '',
  youtube: '',
  tiktok: '',
  instagram: '',
  medium: '',
  email: ''
};

/**
 * Arrays vacíos como fallback para contenido dinámico
 */
export const FALLBACK_AREAS_ESPECIALIZACION: AreaEspecializacion[] = [];
export const FALLBACK_AREAS_INVESTIGACION: AreaInvestigacion[] = [];
export const FALLBACK_RECOMENDACIONES: Recomendacion[] = []; 