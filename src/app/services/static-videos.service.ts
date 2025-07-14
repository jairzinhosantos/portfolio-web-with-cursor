import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface StaticVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  viewCount: string;
  publishedAt: string;
}

export interface StaticVideosData {
  videos: StaticVideo[];
}

@Injectable({
  providedIn: 'root'
})
export class StaticVideosService {

  constructor(private http: HttpClient) {}

  getStaticVideos(): Observable<StaticVideo[]> {
    const cacheBuster = `?v=${Date.now()}`;
    const url = `assets/data/static-videos.json${cacheBuster}`;
    
    console.log('📂 Loading static videos from:', url);
    
    return this.http.get<StaticVideosData>(url).pipe(
      map((data: any) => {
        console.log('📊 Raw static videos data:', data);
        
        if (!data) {
          throw new Error('No data received from static-videos.json');
        }
        
        if (!data.videos) {
          throw new Error('No videos property found in static-videos.json');
        }
        
        if (!Array.isArray(data.videos)) {
          throw new Error('Videos property is not an array in static-videos.json');
        }
        
        console.log('✅ Static videos data validated:', data.videos);
        return data.videos;
      }),
      catchError(error => {
        console.error('❌ Error loading static videos:', error);
        console.error('📄 Error details:', {
          message: error.message,
          status: error.status,
          url: error.url
        });
        return of([]);
      })
    );
  }
} 