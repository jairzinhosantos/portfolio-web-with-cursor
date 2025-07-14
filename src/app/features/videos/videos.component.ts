import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  
  // Carousel config - usando la configuración específica de videos
  carouselConfig: CarouselConfig = {
    itemsPerPage: VIDEOS_CAROUSEL_CONFIG.itemsPerPage || 2,
    gap: VIDEOS_CAROUSEL_CONFIG.gap || 30,
    autoSlide: VIDEOS_CAROUSEL_CONFIG.autoSlide || false,
    autoSlideInterval: 5000,
    enableDrag: VIDEOS_CAROUSEL_CONFIG.enableDrag || true
  };
  
  private subscriptions = new Subscription();

  constructor(
    private youtubeService: YoutubeService,
    private staticVideosService: StaticVideosService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('🎬 Videos component initialized');
  }

  ngOnInit(): void {
    this.loadVideos();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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