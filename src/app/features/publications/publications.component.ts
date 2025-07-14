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

  // Configuración específica de publications - aislada de otras secciones
  carouselConfig: CarouselConfig = {
    itemsPerPage: PUBLICATIONS_CARD_CONFIG.layout.itemsPerPage,
    gap: PUBLICATIONS_CARD_CONFIG.layout.gap,
    autoSlide: false,
    autoSlideInterval: 5000,
    enableDrag: true
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updateCarouselConfig();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateCarouselConfig();
  }

  private updateCarouselConfig(): void {
    // Solo ejecutar en el browser, no durante SSR
    if (isPlatformBrowser(this.platformId)) {
      const isMobile = window.innerWidth <= PUBLICATIONS_CARD_CONFIG.mobile.width * 2;
      this.carouselConfig = {
        itemsPerPage: isMobile ? 1 : PUBLICATIONS_CARD_CONFIG.layout.itemsPerPage,
        gap: isMobile ? 15 : PUBLICATIONS_CARD_CONFIG.layout.gap,
        autoSlide: false,
        autoSlideInterval: 5000,
        enableDrag: true
      };
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