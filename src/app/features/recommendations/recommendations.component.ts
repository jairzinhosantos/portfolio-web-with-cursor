import { Component, OnInit, Input, OnChanges, OnDestroy, SimpleChanges, ChangeDetectorRef, PLATFORM_ID, Inject, HostListener } from '@angular/core';
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
export class RecommendationsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() recommendations: Recomendacion[] = [];
  
  // Configuración responsive del carousel - Mobile first estricto
  carouselConfig: CarouselConfig = {
    itemsPerPage: 1, // Siempre 1 card por vez
    gap: 15,
    autoSlide: false,
    autoSlideInterval: 5000,
    enableDrag: true
  };
  
  truncateText = truncateText;
  currentYear = new Date().getFullYear();
  private resizeTimeout?: NodeJS.Timeout;

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
      
      // Configuración responsive modular - EXACTA como Videos
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
      
      this.cd.detectChanges();
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