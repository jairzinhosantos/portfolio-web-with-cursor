import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PersonalInfo, AreaEspecializacion, AreaInvestigacion, Recomendacion } from '../core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StaticPortfolioService {

  private readonly cacheBuster = `?v=${Date.now()}`;

  constructor(private http: HttpClient) { }

  /**
   * Carga solo la información personal (sin social media que está centralizado)
   */
  getPersonalInfo(): Observable<any> {
    return this.http.get<any>(`assets/data/personal-info.json${this.cacheBuster}`).pipe(
      catchError(error => {
        console.error('Error loading personal info:', error);
        return of(this.getFallbackPersonalInfo());
      })
    );
  }

  /**
   * Carga las áreas de especialización desde JSON estático
   */
  getExpertise(): Observable<any> {
    return this.http.get<any>(`assets/data/expertise.json${this.cacheBuster}`).pipe(
      catchError(error => {
        console.error('Error loading expertise:', error);
        return of(this.getFallbackExpertise());
      })
    );
  }

  /**
   * Carga las áreas de investigación desde JSON estático
   */
  getResearchInterests(): Observable<any> {
    return this.http.get<any>(`assets/data/research-interests.json${this.cacheBuster}`).pipe(
      catchError(error => {
        console.error('Error loading research interests:', error);
        return of(this.getFallbackResearchInterests());
      })
    );
  }

  /**
   * Carga las recomendaciones desde JSON estático
   */
  getRecommendations(): Observable<any> {
    return this.http.get<any>(`assets/data/recommendations.json${this.cacheBuster}`).pipe(
      catchError(error => {
        console.error('Error loading recommendations:', error);
        return of(this.getFallbackRecommendations());
      })
    );
  }

  // Métodos de fallback limpios y sin redundancia
  private getFallbackPersonalInfo() {
    return {
      personalInfo: {
        nombre: 'Tu Nombre Completo',
        titulo1: 'Tu Título Principal',
        titulo2: 'Tu Especialidad • Tus Roles • Tu Enfoque',
        titulo3: 'Tu Título Académico',
        tagline: 'Una <strong>descripción</strong> breve que te defina profesionalmente.',
        fotoPerfil: 'assets/branding/profile.png',
        ubicacion: 'Tu Ciudad, Tu País',
        resumenProfesional: 'Cargando información profesional...'
      }
    };
  }

  private getFallbackExpertise() {
    return {
      areasEspecializacion: [
        {
          titulo: 'Tu Área de Especialización',
          descripcion: 'Descripción de tus habilidades y experiencia profesional',
          icono: 'fas fa-brain'
        }
      ]
    };
  }

  private getFallbackResearchInterests() {
    return {
      areasInvestigacion: [
        {
          titulo: 'Tu Área de Investigación',
          descripcion: 'Descripción de tus intereses de investigación y objetivos',
          icono: 'fas fa-search'
        }
      ]
    };
  }

  private getFallbackRecommendations() {
    return {
      recomendaciones: []
    };
  }
} 