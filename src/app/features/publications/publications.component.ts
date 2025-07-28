import { Component, Input, OnInit, HostListener, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { Publicacion } from '../../core/interfaces/portfolio.interface';
import { CarouselConfig } from '../../core/interfaces/carousel.interface';
import { PUBLICATIONS_CAROUSEL_CONFIG } from '../../core/constants/carousel.constants';
import { PUBLICATIONS_CARD_CONFIG } from './publications.constants';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [CommonModule, CarouselComponent],
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})
export class PublicationsComponent implements OnInit {
  @Input() publications: Publicacion[] = [];

  // Configuración responsive del carousel
  carouselConfig: CarouselConfig = {
    itemsPerPage: 1, // Mobile first approach
    gap: 15,
    autoSlide: false,
    autoSlideInterval: 5000,
    enableDrag: true
  };

  private resizeTimeout?: NodeJS.Timeout;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updateCarouselConfig();
  }

  ngOnDestroy(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    // Debounce para optimizar performance
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.updateCarouselConfig();
    }, 250);
  }

  private updateCarouselConfig(): void {
    if (isPlatformBrowser(this.platformId)) {
      const screenWidth = window.innerWidth;
      
      // Configuración responsive modular
      let itemsPerPage = 1; // Mobile first
      let gap = 15;
      
      if (screenWidth >= 1366) {
        // Desktop/Laptop grande
        itemsPerPage = 2;
        gap = 25;
      } else if (screenWidth >= 1024) {
        // Tablet horizontal/Laptop pequeño
        itemsPerPage = 2;
        gap = 20;
      } else if (screenWidth >= 768) {
        // Tablet vertical
        itemsPerPage = 1;
        gap = 15;
      }
      
      this.carouselConfig = {
        ...this.carouselConfig,
        itemsPerPage,
        gap
      };
      
      this.changeDetectorRef.detectChanges();
    }
  }

  onPublicationClick(publication: any): void {
    if (publication.enlace) {
      window.open(publication.enlace, '_blank');
    }
  }

  onSlideChange(index: number): void {
    // Slide change handler
  }
} 