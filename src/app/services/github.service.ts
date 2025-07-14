import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Interfaz que representa la estructura de un proyecto de GitHub.
 */
export interface GitHubProject {
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  topics: string[];
  language: string;
  stargazers_count: number;
  updated_at: string;
  pushed_at: string;
}

/**
 * Servicio para interactuar con la API de GitHub y obtener información de los repositorios públicos de un usuario.
 * Permite obtener tanto los repositorios propios como los repositorios marcados con estrella.
 */
@Injectable({
  providedIn: 'root'
})
export class GithubService {
  /**
   * URL base de la API de GitHub
   */
  private apiUrl = environment.github.apiUrl;

  /**
   * Nombre de usuario de GitHub del que se obtendrán los repositorios
   */
  private username = environment.github.username;

  /**
   * Token de GitHub para autenticación (opcional)
   */
  private token = environment.github.token;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene las cabeceras HTTP con autenticación si hay token disponible
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Accept': 'application/vnd.github.v3+json'
    });

    if (this.token) {
      headers = headers.set('Authorization', `token ${this.token}`);
    }

    return headers;
  }

  /**
   * Obtiene los repositorios públicos del usuario configurado.
   * @returns Observable con la lista de proyectos de GitHub
   */
  getRepositories(): Observable<GitHubProject[]> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/users/${this.username}/repos?sort=pushed&direction=desc&per_page=20`;
    
    return this.http.get<GitHubProject[]>(url, { headers }).pipe(
      map(repos => {
        const filteredRepos = repos.filter(repo => !repo.name.includes('.github.io') && repo.name !== this.username);
        return filteredRepos.map(repo => ({
          ...repo,
          image: `https://via.placeholder.com/400x250/007acc/ffffff?text=${encodeURIComponent(repo.name)}`
        }));
      }),
      catchError(error => {
        console.error('Error fetching GitHub repositories:', error);
        return of([]); // Retorna array vacío en caso de error
      })
    );
  }

  /**
   * Obtiene los repositorios marcados con estrella por el usuario configurado.
   * @returns Observable con la lista de proyectos destacados
   */
  getStarredRepositories(): Observable<GitHubProject[]> {
    const headers = this.getHeaders();
    
    return this.http.get<GitHubProject[]>(
      `${this.apiUrl}/users/${this.username}/starred`,
      { headers }
    ).pipe(
      map(repos => repos.map(repo => ({
        ...repo,
        image: `https://via.placeholder.com/400x250/007acc/ffffff?text=${encodeURIComponent(repo.name)}`
      }))),
      catchError(error => {
        console.error('Error fetching starred repositories:', error);
        return of([]); // Retorna array vacío en caso de error
      })
    );
  }
} 