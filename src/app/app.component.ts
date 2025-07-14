import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

// Layout Components
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

// Feature Components
import { AboutComponent } from './features/about/about.component';
import { ExpertiseComponent } from './features/expertise/expertise.component';
import { ResearchComponent } from './features/research/research.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { PublicationsComponent } from './features/publications/publications.component';
import { RecommendationsComponent } from './features/recommendations/recommendations.component';
import { VideosComponent } from './features/videos/videos.component';

// Services
import { StaticPortfolioService } from './services/static-portfolio.service';
import { ThemeService, ThemeMode } from './services/theme.service';
import { SocialUrlsService } from './services/social-urls.service';
import { GithubService } from './services/github.service';
import { MediumService } from './services/medium.service';

// Interfaces
import { PersonalInfo, AreaEspecializacion, AreaInvestigacion, Recomendacion, Publicacion } from './core/interfaces';

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
  title = 'portfolio';
  
  // Estados de datos
  personalInfo: PersonalInfo = {
    nombre: 'Cargando...',
    titulo1: 'Cargando...',
    titulo2: 'Cargando...',
    titulo3: 'Cargando...',
    tagline: 'Cargando...',
    fotoPerfil: 'assets/branding/profile.png',
    ubicacion: 'Cargando...',
    resumenProfesional: 'Cargando...'
  };
  
  socialMedia: any = {};
  areasEspecializacion: AreaEspecializacion[] = [];
  areasInvestigacion: AreaInvestigacion[] = [];
  recomendaciones: Recomendacion[] = [];
  proyectos: any[] = [];
  publicaciones: Publicacion[] = [];
  
  // Estados de carga
  isPersonalInfoLoaded = false;
  isExpertiseLoaded = false;
  isResearchLoaded = false;
  isRecommendationsLoaded = false;
  
  // Theme state
  currentTheme: ThemeMode = 'light';
  isDarkModeActive = false;
  
  // UI state
  activeSection = 'about';
  isMenuOpen = false;
  themeMenuOpen = false;
  
  private subscriptions = new Subscription();

  constructor(
    private staticPortfolioService: StaticPortfolioService,
    private themeService: ThemeService,
    private socialUrlsService: SocialUrlsService,
    private githubService: GithubService,
    private mediumService: MediumService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('🚀 AppComponent initializing...');
  }

  ngOnInit(): void {
    this.initializeTheme();
    this.loadAllData();
  }

  ngAfterViewInit(): void {
    console.log('🔍 AppComponent view initialized');
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.themeService.cleanup();
  }

  private initializeTheme(): void {
    console.log('🎨 Initializing theme system...');
    this.currentTheme = this.themeService.initializeTheme();
    this.isDarkModeActive = this.themeService.applyTheme(this.currentTheme);
    console.log('✅ Theme system initialized:', { theme: this.currentTheme, isDark: this.isDarkModeActive });
    this.cdr.detectChanges();
  }

  private loadAllData(): void {
    // Cargar datos estáticos
    this.loadPersonalInfo();
    this.loadSocialUrls();
    this.loadExpertise();
    this.loadResearchInterests();
    this.loadRecommendations();
    
    // Cargar datos dinámicos
    this.loadGitHubProjects();
    this.loadMediumPublications();
  }

  private loadPersonalInfo(): void {
    this.staticPortfolioService.getPersonalInfo().subscribe({
      next: (data) => {
        // Extraer personalInfo del objeto wrapper
        this.personalInfo = data.personalInfo || data;
        this.isPersonalInfoLoaded = true;
        console.log('✅ Personal info loaded');
      },
      error: (error) => console.warn('⚠️ Failed to load personal info')
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
      error: (error) => console.warn('⚠️ Failed to load social URLs')
    });
  }

  private loadExpertise(): void {
    this.staticPortfolioService.getExpertise().subscribe({
      next: (data) => {
        // Extraer areasEspecializacion del objeto wrapper
        this.areasEspecializacion = data.areasEspecializacion || data;
        this.isExpertiseLoaded = true;
        console.log('✅ Expertise loaded');
      },
      error: (error) => console.warn('⚠️ Failed to load expertise')
    });
  }

  private loadResearchInterests(): void {
    this.staticPortfolioService.getResearchInterests().subscribe({
      next: (data) => {
        // Extraer areasInvestigacion del objeto wrapper
        this.areasInvestigacion = data.areasInvestigacion || data;
        console.log('✅ Research interests loaded');
      },
      error: (error) => console.warn('⚠️ Failed to load research interests')
    });
  }

  private loadRecommendations(): void {
    this.staticPortfolioService.getRecommendations().subscribe({
      next: (data) => {
        // Extraer recomendaciones del objeto wrapper
        this.recomendaciones = data.recomendaciones || data;
        this.isRecommendationsLoaded = true;
        console.log('✅ Recommendations loaded');
      },
      error: (error) => console.warn('⚠️ Failed to load recommendations')
    });
  }

  private loadGitHubProjects(): void {
    const projectsSub = this.githubService.getRepositories().subscribe({
      next: (projects) => {
        this.proyectos = projects;
        console.log('✅ GitHub projects loaded');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.warn('⚠️ Failed to load GitHub projects');
        this.proyectos = [];
      }
    });
    this.subscriptions.add(projectsSub);
  }

  private loadMediumPublications(): void {
    const publicationsSub = this.mediumService.getLatestArticles().subscribe({
      next: (articles) => {
        this.publicaciones = articles;
        console.log('✅ Medium publications loaded');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.warn('⚠️ Failed to load Medium publications');
        this.publicaciones = [];
      }
    });
    this.subscriptions.add(publicationsSub);
  }

  // Theme methods
  onThemeChange(theme: ThemeMode): void {
    this.currentTheme = theme;
    this.isDarkModeActive = this.themeService.applyTheme(theme);
    this.themeMenuOpen = false;
    this.cdr.detectChanges();
  }

  onThemeMenuToggle(): void {
    this.themeMenuOpen = !this.themeMenuOpen;
  }

  // Navigation methods
  onSectionClick(sectionId: string): void {
    this.activeSection = sectionId;
    this.isMenuOpen = false;
    // El navegador se encarga del scroll automáticamente usando scroll-padding-top
  }

  onMenuToggle(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Métodos para acceder a las propiedades del tema
  get currentThemeMode(): ThemeMode {
    return this.currentTheme;
  }

  get isDarkMode(): boolean {
    return this.isDarkModeActive;
  }

  get isAutoMode(): boolean {
    return this.currentTheme === 'auto';
  }

  get isLightMode(): boolean {
    return this.currentTheme === 'light';
  }

  // Personal info getters
  get nombre(): string {
    return this.personalInfo.nombre;
  }

  get titulo1(): string {
    return this.personalInfo.titulo1;
  }

  get titulo2(): string {
    return this.personalInfo.titulo2;
  }

  get titulo3(): string {
    return this.personalInfo.titulo3;
  }

  get tagline(): string {
    return this.personalInfo.tagline;
  }

  get fotoPerfil(): string {
    return this.personalInfo.fotoPerfil;
  }

  get resumenProfesional(): string {
    return this.personalInfo.resumenProfesional;
  }

  // Social media getters
  get linkedin(): string {
    return this.socialMedia.linkedin || '';
  }

  get github(): string {
    return this.socialMedia.github || '';
  }

  get twitter(): string {
    return this.socialMedia.twitter || '';
  }

  get youtube(): string {
    return this.socialMedia.youtube || '';
  }

  get tiktok(): string {
    return this.socialMedia.tiktok || '';
  }

  get instagram(): string {
    return this.socialMedia.instagram || '';
  }

  get medium(): string {
    return this.socialMedia.medium || '';
  }

  get email(): string {
    return this.socialMedia.email || '';
  }

  // Utility getters
  get currentYear(): number {
    return new Date().getFullYear();
  }

  // Método para obtener el estado de carga general
  get isDataLoaded(): boolean {
    return this.isPersonalInfoLoaded && this.isExpertiseLoaded && this.isRecommendationsLoaded;
  }

  // Método para scroll suave a sección con offset para header
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      // Usar el scroll-padding-top definido en CSS para el comportamiento nativo
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Método para manejar errores de imagen
  onImageError(event: any): void {
    event.target.src = 'assets/branding/profile.png';
    event.target.alt = 'Profile image not available';
  }

  // Método para formatear texto con saltos de línea
  formatTextWithLineBreaks(text: string): string {
    if (!text) return '';
    return text.replace(/\n/g, '<br>');
  }

  // Método para verificar si una URL es válida
  isValidUrl(url: string): boolean {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Método para obtener iniciales de un nombre
  getInitials(name: string): string {
    if (!name) return '';
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
  }
} 