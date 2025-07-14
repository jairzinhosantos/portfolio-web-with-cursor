/**
 * Formatear duración de segundos a mm:ss
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds === 0) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Formatear número de vistas
 */
export function formatViewCount(views: string): string {
  if (!views) return '0';
  
  // Remover comas y convertir a número
  const cleanViews = views.replace(/,/g, '');
  const num = parseInt(cleanViews);
  
  if (isNaN(num)) return views; // Si no es un número válido, devolver el string original
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString(); // Formatear con comas
}

/**
 * Truncar texto a una longitud específica
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (!text) return '';
  
  if (text.length <= maxLength) {
    return text;
  }
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
} 