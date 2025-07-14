import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges, TemplateRef, ContentChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselConfig, CarouselState, CarouselType } from '../../../core/interfaces';
import { chunkArray, createDotsArray, getPositionX, isInteractiveElement, calculateValidIndex } from '../../../core/utils';
import { DEFAULT_CAROUSEL_CONFIG } from '../../../core/constants';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent<T> implements OnInit, OnDestroy, OnChanges {
  @Input() items: T[] = [];
  @Input() config: Partial<CarouselConfig> = {};
  @Input() type: CarouselType = 'projects';
  @Input() itemTemplate!: TemplateRef<any>;
  
  @Output() itemClick = new EventEmitter<T>();
  @Output() slideChange = new EventEmitter<number>();
  
  @ContentChild('itemTemplate') contentTemplate!: TemplateRef<any>;

  state: CarouselState = {
    currentIndex: 0,
    itemsPerPage: 3,
    isDragging: false,
    startPos: 0,
    currentTranslate: 0,
    prevTranslate: 0
  };

  fullConfig: CarouselConfig = DEFAULT_CAROUSEL_CONFIG;
  slides: T[][] = [];
  dots: number[] = [];
  animationId = 0;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fullConfig = { ...DEFAULT_CAROUSEL_CONFIG, ...this.config };
    this.state.itemsPerPage = this.fullConfig.itemsPerPage;
    this.updateSlides();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && changes['items'].currentValue) {
      this.updateSlides();
      this.cd.detectChanges();
    }
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private updateSlides(): void {
    this.slides = chunkArray(this.items, this.state.itemsPerPage);
    this.dots = createDotsArray(this.items.length, this.state.itemsPerPage);
  }

  onItemClick(item: T): void {
    this.itemClick.emit(item);
  }

  prevSlide(): void {
    if (this.state.currentIndex > 0) {
      this.state.currentIndex--;
      this.slideChange.emit(this.state.currentIndex);
    }
  }

  nextSlide(): void {
    const maxIndex = this.slides.length - 1;
    if (this.state.currentIndex < maxIndex) {
      this.state.currentIndex++;
      this.slideChange.emit(this.state.currentIndex);
    }
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.slides.length) {
      this.state.currentIndex = index;
      this.slideChange.emit(this.state.currentIndex);
    }
  }

  // Drag functionality
  onDragStart(event: MouseEvent | TouchEvent): void {
    if (!this.fullConfig.enableDrag) return;
    
    const target = event.target as HTMLElement;
    if (isInteractiveElement(target)) return;

    this.state.isDragging = true;
    this.state.startPos = getPositionX(event);
    this.state.prevTranslate = this.state.currentTranslate;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.animationId = requestAnimationFrame(() => this.animation());
  }

  onDrag(event: MouseEvent | TouchEvent): void {
    if (!this.state.isDragging || !this.fullConfig.enableDrag) return;
    
    event.preventDefault();
    const currentPosition = getPositionX(event);
    this.state.currentTranslate = this.state.prevTranslate + currentPosition - this.state.startPos;
  }

  onDragEnd(): void {
    if (!this.state.isDragging || !this.fullConfig.enableDrag) return;
    
    this.state.isDragging = false;
    cancelAnimationFrame(this.animationId);
    
    const movedBy = this.state.currentTranslate - this.state.prevTranslate;
    const threshold = 100;

    if (Math.abs(movedBy) > threshold) {
      if (movedBy < 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }

    this.state.currentTranslate = this.state.prevTranslate;
  }

  private animation(): void {
    this.setSliderPosition();
    if (this.state.isDragging) {
      this.animationId = requestAnimationFrame(() => this.animation());
    }
  }

  private setSliderPosition(): void {
    // Esta función será llamada por el template para actualizar la posición
  }

  get currentSlide(): T[] {
    return this.slides[this.state.currentIndex] || [];
  }

  get canGoPrev(): boolean {
    return this.state.currentIndex > 0;
  }

  get canGoNext(): boolean {
    return this.state.currentIndex < this.slides.length - 1;
  }

  get transform(): string {
    const translateX = this.state.isDragging 
      ? this.state.currentTranslate 
      : -this.state.currentIndex * 100;
    return `translateX(${translateX}%)`;
  }
} 