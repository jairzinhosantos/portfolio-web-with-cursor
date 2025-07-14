export interface CarouselState {
  currentIndex: number;
  itemsPerPage: number;
  isDragging: boolean;
  startPos: number;
  currentTranslate: number;
  prevTranslate: number;
}

export interface CarouselConfig {
  itemsPerPage: number;
  gap: number;
  autoSlide: boolean;
  autoSlideInterval: number;
  enableDrag: boolean;
}

export type CarouselType = 
  | 'projects' 
  | 'publications' 
  | 'videos' 
  | 'tiktok' 
  | 'recommendations' 
  | 'expertise' 
  | 'research';

export interface DragEvent {
  startX: number;
  currentX: number;
  isDragging: boolean;
  type: CarouselType;
} 