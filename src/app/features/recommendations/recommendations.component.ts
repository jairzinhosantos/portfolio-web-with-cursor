import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { Recomendacion } from '../../core/interfaces';
import { RECOMMENDATIONS_CAROUSEL_CONFIG } from '../../core/constants/carousel.constants';
import { RECOMMENDATIONS_CARD_CONFIG } from './recommendations.constants';
import { truncateText } from '../../core/utils';
import { StaticPortfolioService } from '../../services/static-portfolio.service';
import { CarouselConfig } from '../../core/interfaces/carousel.interface';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, CarouselComponent],
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit, OnChanges {
  @Input() recommendations: Recomendacion[] = [];
  
  // Configuración específica de recommendations - aislada de otras secciones
  carouselConfig: CarouselConfig = {
    itemsPerPage: RECOMMENDATIONS_CARD_CONFIG.layout.itemsPerPage,
    gap: RECOMMENDATIONS_CARD_CONFIG.layout.gap,
    autoSlide: false,
    autoSlideInterval: 5000,
    enableDrag: true
  };
  
  truncateText = truncateText;
  currentYear = new Date().getFullYear();

  constructor(
    private portfolioService: StaticPortfolioService,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.updateCarouselConfig();
    this.loadRecommendations();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recommendations']) {
      this.cd.detectChanges();
    }
  }

  private updateCarouselConfig(): void {
    // Solo ejecutar en el browser, no durante SSR
    if (isPlatformBrowser(this.platformId)) {
      const isMobile = window.innerWidth <= RECOMMENDATIONS_CARD_CONFIG.mobile.width * 2;
      this.carouselConfig = {
        itemsPerPage: isMobile ? 1 : RECOMMENDATIONS_CARD_CONFIG.layout.itemsPerPage,
        gap: isMobile ? 20 : RECOMMENDATIONS_CARD_CONFIG.layout.gap,
        autoSlide: false,
        autoSlideInterval: 5000,
        enableDrag: true
      };
    }
  }

  getInitials(recommendation: Recomendacion): string {
    // Usar el acrónimo del JSON directamente
    return recommendation.acronimo || 'XX';
  }

  onRecommendationClick(recommendation: Recomendacion): void {
    // Abrir enlace de LinkedIn
    if (recommendation.linkedinUrl) {
      if (isPlatformBrowser(this.platformId)) {
        window.open(recommendation.linkedinUrl, '_blank', 'noopener,noreferrer');
      }
    }
  }

  onSlideChange(index: number): void {
    // Slide change handler
  }

  private loadRecommendations(): void {
    this.portfolioService.getRecommendations().subscribe({
      next: (data) => {
        this.recommendations = data.recomendaciones || [];
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading recommendations:', error);
      }
    });
  }
} 