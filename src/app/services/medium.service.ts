import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Interfaz que representa un artículo de Medium
 */
export interface MediumArticle {
  titulo: string;
  descripcion: string;
  enlace: string;
  imagen: string;
  fechaPublicacion?: string;
}

/**
 * Servicio para obtener artículos de Medium usando RSS
 */
@Injectable({
  providedIn: 'root'
})
export class MediumService {
  /**
   * URL del RSS de Medium convertido a JSON
   */
  private readonly RSS_URL = `${environment.medium.rssApiUrl}?rss_url=https://medium.com/feed/@${environment.medium.username}`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las cabeceras HTTP para las peticiones
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }

  /**
   * Obtiene los últimos artículos de Medium
   */
  getLatestArticles() {
    const headers = this.getHeaders();

    return this.http.get<any>(this.RSS_URL, { headers })
      .pipe(
        map(response => {
          const items = response.items || [];
          return items.slice(0, 3).map((item: any) => {
            // Extraer título
            const title = item.title || 'Sin título';

            // Extraer link
            const link = item.link || '#';

            // Extraer imagen del content
            const content = item.content || item.description || '';
            const imagen = this.extractThumbnail(content);

            // Extraer una breve descripción del content
            const breveDescripcion = this.extractBrief(content);

            // Extraer fecha de publicación
            const fechaPublicacion = item.pubDate || '';

            return {
              titulo: title,
              descripcion: breveDescripcion,
              enlace: link,
              imagen: imagen,
              fechaPublicacion: fechaPublicacion
            };
          });
        }),
        catchError(error => {
          console.error('Error fetching Medium articles:', error);
          return of(this.getFallbackArticles());
        })
      );
  }

  private extractThumbnail(content: string): string {
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
    return 'https://via.placeholder.com/400x250/007acc/ffffff?text=Medium+Article';
  }

  private extractBrief(content: string): string {
    const pMatch = content.match(/<p>(?!<img)([\s\S]*?)<\/p>/i);
    if (pMatch && pMatch[1]) {
      let brief = pMatch[1].replace(/<[^>]*>/g, '').trim();
      if (brief.length > 150) {
        brief = brief.substring(0, 150) + '...';
      }
      return brief;
    }
    
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    if (plainText.length > 0) {
      return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
    }
    
    return 'Artículo sobre AI, tecnología y desarrollo profesional';
  }

  private getFallbackArticles(): MediumArticle[] {
    return [
      {
        titulo: 'Tu Primer Artículo de Ejemplo',
        descripcion: 'Esta es la descripción de tu primer artículo. Habla sobre tecnología, desarrollo o tu área de especialización.',
        enlace: 'https://medium.com/@tu.usuario',
        imagen: 'https://via.placeholder.com/400x250/007acc/ffffff?text=Articulo+1'
      },
      {
        titulo: 'Tu Segundo Artículo de Ejemplo',
        descripcion: 'Descripción de tu segundo artículo. Puedes escribir sobre tendencias, experiencias o tutoriales.',
        enlace: 'https://medium.com/@tu.usuario',
        imagen: 'https://via.placeholder.com/400x250/00a8ff/ffffff?text=Articulo+2'
      }
    ];
  }
}
