import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PersonalInfo, SocialMedia, AreaEspecializacion, AreaInvestigacion, Publicacion, Recomendacion } from './core/interfaces';
import { StaticPortfolioService } from './services/static-portfolio.service';
import { SocialUrlsService } from './services/social-urls.service';
import { ThemeService, ThemeMode } from './services/theme.service';
import { GithubService, GitHubProject } from './services/github.service';
import { MediumService, MediumArticle } from './services/medium.service';

// Importar componentes
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AboutComponent } from './features/about/about.component';
import { ExpertiseComponent } from './features/expertise/expertise.component';
import { ResearchComponent } from './features/research/research.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { PublicationsComponent } from './features/publications/publications.component';
import { RecommendationsComponent } from './features/recommendations/recommendations.component';
import { VideosComponent } from './features/videos/videos.component';

interface NavigationConfig {
  readonly SECTIONS: readonly string[];
  readonly HEADER_OFFSET: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    ExpertiseComponent,
    ResearchComponent,
    ProjectsComponent,
    PublicationsComponent,
    RecommendationsComponent, 
    VideosComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  // OPTIMIZED NAVIGATION CONFIGURATION - Improved precision
  private readonly navigationConfig: NavigationConfig = {
    SECTIONS: ['about', 'expertise', 'research', 'projects', 'publications', 'videos', 'recommendations'],
    HEADER_OFFSET: 20  // Reduced offset for better title positioning
  };

  // Data Models
  personalInfo: PersonalInfo = this.createEmptyPersonalInfo();
  socialMedia: SocialMedia = this.createEmptySocialMedia();
  areasEspecializacion: AreaEspecializacion[] = [];
  areasInvestigacion: AreaInvestigacion[] = [];
  recomendaciones: Recomendacion[] = [];
  proyectos: GitHubProject[] = [];
  publicaciones: Publicacion[] = [];
  
  // UI State
  readonly currentYear = new Date().getFullYear();
  isMenuOpen = false;
  activeSection = 'about';
  
  // Theme State
  isDarkMode = false;
  themeMenuOpen = false;
  currentTheme: ThemeMode = 'light';

  constructor(
    private staticPortfolioService: StaticPortfolioService,
    private socialUrlsService: SocialUrlsService,
    private themeService: ThemeService,
    private githubService: GithubService,
    private mediumService: MediumService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cd: ChangeDetectorRef
  ) {}

  // Lifecycle Methods
  ngOnInit(): void {
    console.log('🚀 AppComponent initializing...');
    this.initializeApplication();
  }

  ngAfterViewInit(): void {
    console.log('🔍 AppComponent view initialized');
    if (isPlatformBrowser(this.platformId)) {
      this.setupBrowserFeatures();
      // Force theme re-application
      setTimeout(() => {
        console.log('🎨 Forcing theme re-application...');
        this.themeService.initializeTheme();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.cleanupResources();
  }

  // Public Template Getters (simplified)
  get nombre() { return this.personalInfo.nombre; }
  get titulo1() { return this.personalInfo.titulo1; }
  get titulo2() { return this.personalInfo.titulo2; }
  get titulo3() { return this.personalInfo.titulo3; }
  get tagline() { return this.personalInfo.tagline; }
  get fotoPerfil() { return this.personalInfo.fotoPerfil; }
  get resumenProfesional() { return this.personalInfo.resumenProfesional; }
  get ubicacion() { return this.personalInfo.ubicacion; }
  
  // Social Media Getters
  get linkedin() { return this.socialMedia.linkedin; }
  get github() { return this.socialMedia.github; }
  get twitter() { return this.socialMedia.twitter; }
  get youtube() { return this.socialMedia.youtube; }
  get tiktok() { return this.socialMedia.tiktok; }
  get instagram() { return this.socialMedia.instagram; }
  get medium() { return this.socialMedia.medium || ''; }
  get email() { return this.socialMedia.email; }

  // ** REFACTORED THEME MANAGEMENT **
  
  /**
   * Inicializa la aplicación completa
   */
  private initializeApplication(): void {
    this.initializeTheme();
    this.loadAllData();
    
    if (isPlatformBrowser(this.platformId)) {
      this.setupScrollListener();
    }
  }

  /**
   * Inicializa el sistema de temas
   */
  private initializeTheme(): void {
    console.log('🎨 Initializing theme system...');
    this.currentTheme = this.themeService.initializeTheme();
    this.isDarkMode = this.themeService.applyTheme(this.currentTheme);
    console.log('✅ Theme system initialized:', { theme: this.currentTheme, isDark: this.isDarkMode });
    this.cd.detectChanges();
  }

  /**
   * Maneja el cambio de tema desde el header
   */
  onThemeChange(theme: ThemeMode): void {
    console.log('🎨 Theme change requested:', theme);
    this.currentTheme = theme;
    this.isDarkMode = this.themeService.applyTheme(theme);
    this.themeMenuOpen = false;
    this.cd.detectChanges();
    console.log('✅ Theme changed to:', { theme, isDark: this.isDarkMode });
  }

  /**
   * Obtiene el ícono apropiado para el tema actual
   */
  getThemeIcon(): string {
    const iconMap: Record<ThemeMode, string> = {
      light: 'fa-sun',
      dark: 'fa-moon',
      auto: 'fa-desktop'
    };
    return iconMap[this.currentTheme] || 'fa-sun';
  }

  // ** OPTIMIZED NAVIGATION MANAGEMENT **

  /**
   * Configura el scroll listener para navegación optimizada
   */
  private setupScrollListener(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Throttled scroll listener for better performance
      let ticking = false;
      const scrollHandler = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            this.handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };
      
      window.addEventListener('scroll', scrollHandler, { passive: true });
    }
  }

  /**
   * Maneja el scroll para detectar sección activa - OPTIMIZED
   */
  private handleScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const header = document.querySelector('.header') as HTMLElement;
    const headerHeight = header?.offsetHeight || 72;
    const scrollPosition = window.scrollY + headerHeight + 50; // Better detection threshold
    
    let currentSection = 'about';
    
    // Improved section detection logic
    for (const sectionId of this.navigationConfig.SECTIONS) {
      const section = document.getElementById(sectionId);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        // Check if current scroll position is within this section
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSection = sectionId;
          break;
        }
      }
    }
    
    // Only update if section actually changed
    if (this.activeSection !== currentSection) {
      this.activeSection = currentSection;
      this.cd.detectChanges();
    }
  }

  /**
   * Navega a una sección específica - OPTIMIZED FOR PRECISE POSITIONING
   */
  private scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const element = document.getElementById(sectionId);
    if (element) {
      const header = document.querySelector('.header') as HTMLElement;
      const headerHeight = header?.offsetHeight || 72;
      
      // PRECISE POSITIONING: Title should be near the top after header
      const targetPosition = element.offsetTop - headerHeight - this.navigationConfig.HEADER_OFFSET;
      
      // Ensure we don't scroll past the top
      const finalPosition = Math.max(0, targetPosition);
      
      // Smooth scroll with precise positioning
      window.scrollTo({
        top: finalPosition,
        behavior: 'smooth'
      });
      
      // Update active section immediately for better UX
      this.activeSection = sectionId;
      this.cd.detectChanges();
    }
  }

  /**
   * Maneja el click en una sección del menú - IMPROVED UX
   */
  onSectionClick(sectionId: string): void {
    // Close mobile menu immediately
    this.isMenuOpen = false;
    
    // Scroll to section with precise positioning
    this.scrollToSection(sectionId);
  }

  /**
   * Toggle del menú móvil
   */
  onMenuToggle(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Toggle del menú de temas
   */
  onThemeMenuToggle(): void {
    this.themeMenuOpen = !this.themeMenuOpen;
  }

  // ** DATA LOADING METHODS **

  /**
   * Carga todos los datos necesarios
   */
  private loadAllData(): void {
    this.loadPersonalInfo();
    this.loadSocialUrls();
    this.loadExpertise();
    this.loadResearchInterests();
    this.loadRecommendations();
    this.loadMediumArticles();
    this.loadGitHubProjects();
  }

  private loadPersonalInfo(): void {
    this.staticPortfolioService.getPersonalInfo().subscribe({
      next: (data) => {
        // Extraer personalInfo del objeto wrapper
        this.personalInfo = data.personalInfo || data;
        console.log('✅ Personal info loaded:', this.personalInfo.nombre);
      },
      error: (error) => console.warn('⚠️ Failed to load personal info:', error)
    });
  }

  private loadSocialUrls(): void {
    this.socialUrlsService.getSocialUrls().subscribe({
      next: (data) => {
        this.socialMedia = {
          linkedin: data['linkedin'] || '',
          github: data['github'] || '',
          twitter: data['twitter'] || '',
          youtube: data['youtube'] || '',
          tiktok: data['tiktok'] || '',
          instagram: data['instagram'] || '',
          medium: data['medium'] || '',
          email: data['email'] || ''
        };
        console.log('✅ Social URLs loaded');
      },
      error: (error) => console.warn('⚠️ Failed to load social URLs:', error)
    });
  }

  private loadExpertise(): void {
    this.staticPortfolioService.getExpertise().subscribe({
      next: (data) => {
        // Extraer areasEspecializacion del objeto wrapper
        this.areasEspecializacion = data.areasEspecializacion || data;
        console.log('✅ Expertise loaded:', this.areasEspecializacion.length, 'areas');
      },
      error: (error) => console.warn('⚠️ Failed to load expertise:', error)
    });
  }

  private loadResearchInterests(): void {
    this.staticPortfolioService.getResearchInterests().subscribe({
      next: (data) => {
        // Extraer areasInvestigacion del objeto wrapper
        this.areasInvestigacion = data.areasInvestigacion || data;
        console.log('✅ Research interests loaded:', this.areasInvestigacion.length, 'areas');
      },
      error: (error) => console.warn('⚠️ Failed to load research interests:', error)
    });
  }

  private loadRecommendations(): void {
    this.staticPortfolioService.getRecommendations().subscribe({
      next: (data) => {
        // Extraer recomendaciones del objeto wrapper
        this.recomendaciones = data.recomendaciones || data;
        console.log('✅ Recommendations loaded:', this.recomendaciones.length, 'items');
      },
      error: (error) => console.warn('⚠️ Failed to load recommendations:', error)
    });
  }

  private loadMediumArticles(): void {
    this.mediumService.getLatestArticles().subscribe({
      next: (articles: MediumArticle[]) => {
        const validArticles = articles.filter(article => article.titulo && article.enlace);
        this.publicaciones = validArticles.map(article => ({
          titulo: article.titulo,
          enlace: article.enlace,
          descripcion: article.descripcion || '',
          imagen: article.imagen || 'https://via.placeholder.com/400x250/007acc/ffffff?text=Article'
        }));
      },
      error: (error) => console.warn('⚠️ Failed to load Medium articles:', error)
    });
  }

  private loadGitHubProjects(): void {
    this.githubService.getRepositories().subscribe({
      next: (repos: GitHubProject[]) => this.proyectos = repos.slice(0, 6),
      error: (error) => console.warn('⚠️ Failed to load GitHub projects:', error)
    });
  }

  // ** BROWSER FEATURES SETUP **

  /**
   * Configura características específicas del navegador
   */
  private setupBrowserFeatures(): void {
    this.setupEventListeners();
  }

  /**
   * Configura event listeners globales
   */
  private setupEventListeners(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Cierra menús al hacer click fuera
      document.addEventListener('click', (event) => {
        if (this.isMenuOpen || this.themeMenuOpen) {
          const target = event.target as HTMLElement;
          if (!target.closest('.header')) {
            this.isMenuOpen = false;
            this.themeMenuOpen = false;
            this.cd.detectChanges();
          }
        }
      });
    }
  }

  // ** CLEANUP **

  /**
   * Limpia recursos al destruir el componente
   */
  private cleanupResources(): void {
    this.themeService.cleanup();
  }

  // ** HELPER METHODS **

  private createEmptyPersonalInfo(): PersonalInfo {
    return {
      nombre: '',
      titulo1: '',
      titulo2: '',
      titulo3: '',
      tagline: '',
      fotoPerfil: '',
      ubicacion: '',
      resumenProfesional: ''
    };
  }

  private createEmptySocialMedia(): SocialMedia {
    return {
      linkedin: '',
      github: '',
      twitter: '',
      youtube: '',
      tiktok: '',
      instagram: '',
      medium: '',
      email: ''
    };
  }
} 