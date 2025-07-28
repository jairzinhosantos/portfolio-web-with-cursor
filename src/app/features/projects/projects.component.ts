import { Component, Input, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { GitHubProject, GithubService } from '../../services/github.service';
import { CarouselConfig } from '../../core/interfaces/carousel.interface';
import { PROJECTS_CAROUSEL_CONFIG } from '../../core/constants/carousel.constants';
import { PROJECTS_CARD_CONFIG } from './projects.constants';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, CarouselComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  @Input() projects: GitHubProject[] = [];

  // Configuración responsive del carousel - Mobile first estricto
  carouselConfig: CarouselConfig = {
    itemsPerPage: 1, // Siempre 1 card por vez
    gap: 15,
    autoSlide: false,
    autoSlideInterval: 5000,
    enableDrag: true
  };

  private resizeTimeout?: NodeJS.Timeout;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private changeDetectorRef: ChangeDetectorRef,
    private githubService: GithubService
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
      
      this.changeDetectorRef.detectChanges();
    }
  }

  onProjectClick(project: any): void {
    if (project.url) {
      window.open(project.url, '_blank');
    }
  }

  onSlideChange(index: number): void {
    // Slide change handler
  }
} 