import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ContactMessages {
  emailSubject: string;
  emailBody: string;
  contactLinkText: string;
}

export interface DiscordMessages {
  popupTitle: string;
  popupMessage: string;
  popupButtonText: string;
}

export interface MessagesConfig {
  contact: ContactMessages;
  discord: DiscordMessages;
}

export interface SocialUrlConfig {
  socialMedia: { [key: string]: string };
  iconMapping: { 
    [key: string]: {
      icon: string;
      title: string;
      customContent?: string;
    }
  };
  socialGroups: {
    primary: string[];
    secondary: string[];
  };
  messages: MessagesConfig;
}

@Injectable({
  providedIn: 'root'
})
export class SocialUrlsService {

  private readonly cacheBuster = `?v=${Date.now()}`;

  constructor(private http: HttpClient) {}

  /**
   * Carga la configuración completa desde el archivo consolidado
   */
  getSocialConfig(): Observable<SocialUrlConfig> {
    return this.http.get<SocialUrlConfig>(`assets/data/social-urls.json${this.cacheBuster}`).pipe(
      catchError(error => {
        console.error('Error loading social URLs config:', error);
        return of(this.getFallbackConfig());
      })
    );
  }

  /**
   * Obtiene solo las URLs de redes sociales
   */
  getSocialUrls(): Observable<{ [key: string]: string }> {
    return this.getSocialConfig().pipe(
      map(config => config.socialMedia)
    );
  }

  /**
   * Obtiene la configuración de iconos
   */
  getIconMapping(): Observable<{ [key: string]: any }> {
    return this.getSocialConfig().pipe(
      map(config => config.iconMapping)
    );
  }

  /**
   * Obtiene los grupos de redes sociales (primary/secondary)
   */
  getSocialGroups(): Observable<{ primary: string[], secondary: string[] }> {
    return this.getSocialConfig().pipe(
      map(config => config.socialGroups)
    );
  }

  /**
   * Obtiene la configuración de mensajes (contact y discord)
   */
  getMessages(): Observable<MessagesConfig> {
    return this.getSocialConfig().pipe(
      map(config => config.messages)
    );
  }

  /**
   * Construye el link de email con subject y body
   */
  buildEmailLink(subject: string, body: string, email: string): string {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
  }

  /**
   * Configuración de fallback consolidada
   */
  private getFallbackConfig(): SocialUrlConfig {
    return {
      socialMedia: {
        linkedin: 'https://www.linkedin.com/in/jairzinhosantos/',
        github: 'https://github.com/jairzinhosantos',
        twitter: 'https://x.com/_jairzinho_',
        email: 'jairzinho.santos@hotmail.com'
      },
      iconMapping: {
        linkedin: { icon: 'fab fa-linkedin', title: 'LinkedIn' },
        github: { icon: 'fab fa-github', title: 'GitHub' },
        twitter: { icon: 'x-icon', title: 'X', customContent: '𝕏' },
        email: { icon: 'fas fa-envelope', title: 'Email' }
      },
      socialGroups: {
        primary: ['linkedin', 'twitter', 'github', 'email'],
        secondary: []
      },
      messages: {
        contact: {
          emailSubject: "Let's Connect - Professional Inquiry",
          emailBody: "Hello Jairzinho,\n\nI'm reaching out regarding your expertise in AI Solutions Architecture.\n\nBest regards",
          contactLinkText: "you can write me"
        },
        discord: {
          popupTitle: "Discord Server",
          popupMessage: "The Discord server will be available soon! We're currently working on setting up an amazing community space.",
          popupButtonText: "Got it!"
        }
      }
    };
  }
} 