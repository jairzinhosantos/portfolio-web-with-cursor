import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, catchError, retry, timeout } from 'rxjs';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class YoutubeService {
  private apiKey = environment.youtube.apiKey;
  private channelHandle = environment.youtube.channelHandle;
  private channelId = environment.youtube.channelId;

  constructor(private http: HttpClient) {}

  getShorts(maxResults = 50) {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&channelId=${this.channelId}&part=snippet,id&order=date&maxResults=${maxResults}`;
    return this.http.get<any>(searchUrl).pipe(
      timeout(10000), // 10 segundos de timeout
      retry(1),
      map(res => res.items.filter((item: any) => item.id.kind === 'youtube#video')),
      switchMap((videos: any[]) => {
        const ids = videos.map(v => v.id.videoId).join(',');
        const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${this.apiKey}&id=${ids}&part=contentDetails,snippet,statistics`;
        return this.http.get<any>(detailsUrl).pipe(
          timeout(10000), // 10 segundos de timeout
          map(res2 => res2.items
            .filter((item: any) => {
              // Filtramos por duración (menos de 10 minutos para incluir más contenido)
              const duration = this.parseDuration(item.contentDetails.duration);
              return duration <= 600;
            })
            .map((item: any) => ({
              id: item.id,
              title: item.snippet.title,
              description: item.snippet.description,
              thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
              publishedAt: item.snippet.publishedAt,
              viewCount: item.statistics.viewCount,
              duration: this.parseDuration(item.contentDetails.duration),
              showIframe: false
            }))
          )
        );
      }),
      catchError(error => {
        console.warn('⚠️ YouTube Shorts API error');
        return of([]);
      })
    );
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Método para obtener todos los videos del canal
  getVideos(maxResults = 20) {
    console.log('📺 Loading YouTube videos...');
    
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&channelId=${this.channelId}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;
    
    return this.http.get<any>(searchUrl).pipe(
      timeout(8000), // 8 segundos de timeout
      retry(1),
      map(res => {
        if (!res || !res.items) {
          throw new Error('Invalid YouTube API response');
        }
        console.log(`📺 Found ${res.items.length} videos`);
        return res.items.filter((item: any) => item.id.kind === 'youtube#video');
      }),
      switchMap((videos: any[]) => {
        if (videos.length === 0) {
          console.log('📭 No videos found');
          return of([]);
        }
        
        console.log(`🎯 Processing ${videos.length} videos...`);
        const ids = videos.map(v => v.id.videoId).join(',');
        const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${this.apiKey}&id=${ids}&part=contentDetails,snippet,statistics`;
        
        return this.http.get<any>(detailsUrl).pipe(
          timeout(8000), // 8 segundos de timeout
          map(res2 => {
            if (!res2.items || res2.items.length === 0) {
              console.log('📭 No video details received');
              return [];
            }

            const processedVideos = res2.items.map((item: any) => {
              const duration = this.parseDuration(item.contentDetails.duration);
              
              return {
                id: item.id,
                title: item.snippet.title,
                url: `https://www.youtube.com/watch?v=${item.id}`,
                thumbnail: item.snippet.thumbnails.maxresdefault?.url || 
                          item.snippet.thumbnails.high?.url || 
                          item.snippet.thumbnails.medium?.url || 
                          item.snippet.thumbnails.default?.url,
                duration: duration,
                viewCount: item.statistics.viewCount || '0',
                publishedAt: item.snippet.publishedAt,
                description: item.snippet.description || ''
              };
            });
            
            console.log(`✅ Successfully processed ${processedVideos.length} videos`);
            return processedVideos;
          })
        );
      }),
      catchError(error => {
        console.warn('📺 YouTube API error');
        if (error.status === 403 && error.error?.error?.reason === 'quotaExceeded') {
          console.warn('⚠️ YouTube API quota exceeded');
        } else if (error.status === 403) {
          console.warn('🔒 YouTube API access forbidden');
        } else if (error.name === 'TimeoutError') {
          console.warn('⏰ YouTube API timeout');
        } else {
          console.warn('❌ YouTube API error');
        }
        return of([]); // Retorna array vacío en caso de error
      })
    );
  }
} 