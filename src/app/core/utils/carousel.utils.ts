import { CarouselType } from '../interfaces';

/**
 * Obtener posición X de un evento de mouse o touch
 */
export function getPositionX(event: MouseEvent | TouchEvent): number {
  return event instanceof MouseEvent ? event.pageX : event.touches[0].pageX;
}

/**
 * Dividir array en chunks para carrusel
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  if (!array || array.length === 0 || chunkSize <= 0) {
    return [];
  }
  
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Crear array de puntos para navegación
 */
export function createDotsArray(totalItems: number, itemsPerPage: number): number[] {
  const totalSlides = Math.ceil(totalItems / itemsPerPage);
  return Array.from({ length: totalSlides }, (_, i) => i);
}

/**
 * Verificar si un elemento es interactivo (no debe activar drag)
 */
export function isInteractiveElement(target: HTMLElement): boolean {
  const interactiveTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'H3', 'IFRAME'];
  const interactiveClasses = [
    'read-more-link',
    'project-link',
    'video-thumbnail',
    'play-button',
    'card-content',
    'video-iframe',
    'video-title-no-click'
  ];
  
  // Verificar tag
  if (interactiveTags.includes(target.tagName)) {
    return true;
  }
  
  // Verificar clases
  if (interactiveClasses.some(className => target.classList.contains(className))) {
    return true;
  }
  
  // Verificar elementos padre
  if (target.closest('a') || target.closest('.video-thumbnail') || target.closest('.play-button')) {
    return true;
  }
  
  return false;
}

/**
 * Calcular índice válido para carrusel
 */
export function calculateValidIndex(
  currentIndex: number, 
  direction: 'next' | 'prev', 
  maxIndex: number
): number {
  if (direction === 'next') {
    return Math.min(currentIndex + 1, maxIndex);
  } else {
    return Math.max(currentIndex - 1, 0);
  }
} 