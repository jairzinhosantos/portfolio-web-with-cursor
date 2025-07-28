import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { YoutubeService } from '../../services/youtube.service';
import { StaticVideosService } from '../../services/static-videos.service';
import { SanitizeUrlPipe } from '../../shared/pipes/sanitize-url.pipe';
import { CarouselConfig } from '../../core/interfaces/carousel.interface';
import { VIDEOS_CAROUSEL_CONFIG } from '../../core/constants/carousel.constants';
import { Video } from '../../core/interfaces/portfolio.interface';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, CarouselComponent, SanitizeUrlPipe],
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit, OnDestroy {
  videos: Video[] = [];
  isLoading = true;
  showNoVideosMessage = false;
  isYouTubeAttempted = false;
  
  // Modal properties
  isVideoModalOpen = false;
  currentModalVideo: Video | null = null;
  
  // Carousel config responsive
  carouselConfig: CarouselConfig = {
    itemsPerPage: 1, // Mobile first approach
    gap: 15,
    autoSlide: false,
    autoSlideInterval: 5000,
    enableDrag: true
  };
  
  private subscriptions = new Subscription();
  private resizeTimeout?: NodeJS.Timeout;

  constructor(
    private youtubeService: YoutubeService,
    private staticVideosService: StaticVideosService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadVideos();
    this.updateCarouselConfig();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
      
      this.cdr.detectChanges();
    }
  }

  private loadVideos(): void {
    console.log('📡 Loading videos...');
    this.isYouTubeAttempted = true;
    
    const youtubeSub = this.youtubeService.getVideos().subscribe({
      next: (videos: any[]) => {
        if (videos && videos.length > 0) {
          console.log('🎯 YouTube videos loaded successfully');
          this.videos = this.transformVideosData(videos);
          this.cdr.detectChanges();
        } else {
          console.log('📂 YouTube unavailable, loading static videos...');
          this.loadStaticVideos();
        }
      },
      error: (error: any) => {
        console.warn('⚠️ YouTube API failed, using static videos');
        this.loadStaticVideos();
      }
    });
    
    this.subscriptions.add(youtubeSub);
  }

  private loadStaticVideos(): void {
    console.log('📂 Loading static videos...');
    
    const staticSub = this.staticVideosService.getStaticVideos().subscribe({
      next: (videos: any[]) => {
        if (videos && videos.length > 0) {
          console.log('✅ Static videos loaded successfully');
          this.videos = this.transformVideosData(videos);
        } else {
          console.warn('⚠️ No static videos found');
          this.videos = [];
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('❌ Failed to load static videos');
        this.videos = [];
        this.cdr.detectChanges();
      }
    });
    
    this.subscriptions.add(staticSub);
  }

  private transformVideosData(videos: any[]): Video[] {
    if (!videos || !Array.isArray(videos)) {
      console.warn('⚠️ Invalid videos data');
      return [];
    }
    
    return videos.map((video, index) => {
      try {
        const transformedVideo = {
          id: video.id || `video-${index}`,
          title: video.title || 'Sin título',
          thumbnail: video.thumbnail || '',
          description: video.description || '',
          duration: video.duration || 0,
          viewCount: video.viewCount || '0',
          publishedAt: video.publishedAt || new Date().toISOString(),
          url: video.url || `https://www.youtube.com/watch?v=${video.id}`
        };
        
        return transformedVideo;
      } catch (error) {
        console.error(`❌ Error transforming video ${index}`);
        return {
          id: `video-${index}`,
          title: 'Error loading video',
          thumbnail: '',
          description: '',
          duration: 0,
          viewCount: '0',
          publishedAt: new Date().toISOString(),
          url: ''
        };
      }
    });
  }

  onVideoClick(video: Video): void {
    this.openVideoModal(video);
  }

  // Modal methods
  openVideoModal(video: Video): void {
    this.currentModalVideo = video;
    this.isVideoModalOpen = true;
    document.body.style.overflow = 'hidden';
    this.cdr.detectChanges();
  }

  closeVideoModal(): void {
    this.isVideoModalOpen = false;
    this.currentModalVideo = null;
    document.body.style.overflow = 'auto';
    this.cdr.detectChanges();
  }

  // Carousel methods
  onSlideChange(index: number): void {
    // Handle slide change if needed
  }

  // Método para manejar errores de imágenes
  onImageError(event: any): void {
    const img = event.target;
    img.src = 'assets/branding/profile.png'; // Imagen por defecto
    img.alt = 'Video thumbnail not available';
  }

  // Método para formatear duración
  formatDuration(seconds: number): string {
    if (!seconds || seconds <= 0) return '';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  }

  // Método para formatear número de visualizaciones
  formatViewCount(viewCount: string): string {
    if (!viewCount || viewCount === '0') return '';
    
    const count = parseInt(viewCount);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    } else {
      return count.toString();
    }
  }
} 