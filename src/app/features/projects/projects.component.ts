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

  // Usar la configuración específica de projects
  carouselConfig: CarouselConfig = {
    itemsPerPage: PROJECTS_CARD_CONFIG.layout.itemsPerPage,
    gap: PROJECTS_CARD_CONFIG.layout.gap,
    autoSlide: false,
    autoSlideInterval: 5000,
    enableDrag: true
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private changeDetectorRef: ChangeDetectorRef,
    private githubService: GithubService
  ) {}

  ngOnInit(): void {
    this.updateCarouselConfig();
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateCarouselConfig();
  }

  private updateCarouselConfig(): void {
    // Solo ejecutar en el browser, no durante SSR
    if (isPlatformBrowser(this.platformId)) {
      const isMobile = window.innerWidth <= PROJECTS_CARD_CONFIG.mobile.width * 2; // Breakpoint basado en card width
      this.carouselConfig = {
        itemsPerPage: isMobile ? 1 : PROJECTS_CARD_CONFIG.layout.itemsPerPage,
        gap: isMobile ? 15 : PROJECTS_CARD_CONFIG.layout.gap,
        autoSlide: false,
        autoSlideInterval: 5000,
        enableDrag: true
      };
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