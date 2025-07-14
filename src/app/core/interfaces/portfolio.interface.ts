export interface PersonalInfo {
  nombre: string;
  titulo1: string;
  titulo2: string;
  titulo3: string;
  tagline: string;
  fotoPerfil: string;
  ubicacion: string;
  resumenProfesional: string;
}

export interface SocialMedia {
  linkedin: string;
  github: string;
  twitter: string;
  youtube: string;
  tiktok: string;
  instagram: string;
  medium?: string;
  email: string;
}

export interface AreaEspecializacion {
  titulo: string;
  descripcion: string;
  icono: string;
}

export interface AreaInvestigacion {
  titulo: string;
  descripcion: string;
  icono: string;
}

export interface Publicacion {
  titulo: string;
  descripcion: string;
  enlace: string;
  imagen: string;
}

export interface Video {
  id: string;
  title: string;
  imagen?: string;
  thumbnail?: string;
  description?: string;
  duration?: number;
  viewCount?: string;
  publishedAt?: string;
  showIframe?: boolean;
  url?: string;
}

export interface Recomendacion {
  nombre: string;
  acronimo: string;
  cargo: string;
  empresa: string;
  fecha: string;
  texto: string;
  foto: string;
  linkedinUrl: string;
  expanded?: boolean;
} 