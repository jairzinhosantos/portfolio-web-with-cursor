import { Component, OnInit, OnDestroy, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { SanitizeUrlPipe } from '../../shared/pipes/sanitize-url.pipe';
import { YoutubeService } from '../../services/youtube.service';
import { StaticVideosService } from '../../services/static-videos.service';
import { Video } from '../../core/interfaces';
import { CAROUSEL_CONFIGS } from '../../core/constants';
import { formatDuration, formatViewCount } from '../../core/utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, CarouselComponent, SanitizeUrlPipe],
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit, OnDestroy {
  videos: Video[] = [];
  isVideoModalOpen = false;
  currentModalVideo: Video | null = null;
  carouselConfig = CAROUSEL_CONFIGS['videos'];
  
  private subscriptions = new Subscription();
  private isYouTubeAttempted = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private youtubeService: YoutubeService,
    private staticVideosService: StaticVideosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🎬 Videos component initialized');
    this.loadVideos();
    if (isPlatformBrowser(this.platformId)) {
      this.setupModalEventListeners();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (isPlatformBrowser(this.platformId)) {
      this.removeModalEventListeners();
    }
  }

  private loadVideos(): void {
    console.log('📡 Attempting to load YouTube videos...');
    this.isYouTubeAttempted = true;
    
    const youtubeSub = this.youtubeService.getVideos().subscribe({
      next: (videos: any[]) => {
        console.log('✅ YouTube videos response received:', videos);
        
        if (videos && videos.length > 0) {
          console.log('🎯 Successfully loaded YouTube videos:', videos.length, 'videos');
          this.videos = this.transformVideosData(videos);
          console.log('🔄 Transformed YouTube videos:', this.videos);
          this.cdr.detectChanges();
        } else {
          console.log('📂 YouTube returned empty array, fallback to static videos...');
          this.loadStaticVideos();
        }
      },
      error: (error: any) => {
        console.warn('⚠️ YouTube API failed, using static videos fallback:', error);
        console.warn('📝 Error details:', {
          status: error?.status,
          message: error?.message,
          error: error?.error
        });
        this.loadStaticVideos();
      }
    });
    
    this.subscriptions.add(youtubeSub);
  }

  private loadStaticVideos(): void {
    console.log('📂 Loading static videos as fallback...');
    
    const staticSub = this.staticVideosService.getStaticVideos().subscribe({
      next: (videos: any[]) => {
        console.log('✅ Static videos loaded successfully:', videos);
        if (videos && videos.length > 0) {
          this.videos = this.transformVideosData(videos);
          console.log('🔄 Transformed static videos:', this.videos);
          console.log('📊 Final videos count:', this.videos.length);
        } else {
          console.warn('⚠️ No static videos found');
          this.videos = [];
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('❌ Critical error: Both YouTube and static videos failed');
        console.error('📝 Static videos error:', error);
        this.videos = [];
        this.cdr.detectChanges();
      }
    });
    
    this.subscriptions.add(staticSub);
  }

  private transformVideosData(videos: any[]): Video[] {
    if (!videos || !Array.isArray(videos)) {
      console.warn('⚠️ Invalid videos data provided to transform');
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
        
        console.log(`🔄 Transformed video ${index + 1}:`, {
          id: transformedVideo.id,
          title: transformedVideo.title.substring(0, 50) + '...',
          hasUrl: !!transformedVideo.url,
          hasThumbnail: !!transformedVideo.thumbnail
        });
        
        return transformedVideo;
      } catch (error) {
        console.error(`❌ Error transforming video ${index}:`, error);
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

  formatDuration(seconds: number): string {
    return formatDuration(seconds);
  }

  formatViewCount(views: string | number): string {
    return formatViewCount(String(views));
  }

  onVideoClick(video: Video): void {
    this.openVideoModal(video);
  }

  openVideoModal(video: Video): void {
    this.currentModalVideo = video;
    this.isVideoModalOpen = true;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
    this.cdr.detectChanges();
  }

  closeVideoModal(): void {
    this.isVideoModalOpen = false;
    this.currentModalVideo = null;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
    this.cdr.detectChanges();
  }

  private setupModalEventListeners(): void {
    document.addEventListener('keydown', this.handleModalEscape.bind(this));
    document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange.bind(this));
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange.bind(this));
  }

  private removeModalEventListeners(): void {
    document.removeEventListener('keydown', this.handleModalEscape.bind(this));
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange.bind(this));
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange.bind(this));
  }

  private handleModalEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isVideoModalOpen) {
      if (!isPlatformBrowser(this.platformId)) {
        this.closeVideoModal();
        return;
      }
      
      const isFullscreen = !!(document.fullscreenElement || 
                            (document as any).webkitFullscreenElement || 
                            (document as any).mozFullScreenElement || 
                            (document as any).msFullscreenElement);
      
      if (!isFullscreen) {
        this.closeVideoModal();
      }
    }
  }

  private handleFullscreenChange(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const isFullscreen = !!(document.fullscreenElement || 
                          (document as any).webkitFullscreenElement || 
                          (document as any).mozFullScreenElement || 
                          (document as any).msFullscreenElement);
    
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.position = '';
    }
  }

  onSlideChange(index: number): void {
    // Slide change handler
  }
} 