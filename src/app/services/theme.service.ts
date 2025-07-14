import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeConfig {
  readonly STORAGE_KEY: string;
  readonly CSS_CLASS: string;
  readonly DEFAULT_THEME: ThemeMode;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly config: ThemeConfig = {
    STORAGE_KEY: 'theme-mode',
    CSS_CLASS: 'dark-mode',
    DEFAULT_THEME: 'light'
  };

  private systemThemeQuery: MediaQueryList | null = null;
  private systemThemeListener: ((e: MediaQueryListEvent) => void) | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Inicializa el tema desde localStorage o valor por defecto
   */
  initializeTheme(): ThemeMode {
    if (!isPlatformBrowser(this.platformId)) {
      return this.config.DEFAULT_THEME;
    }

    try {
      const savedTheme = localStorage.getItem(this.config.STORAGE_KEY) as ThemeMode;
      const theme = savedTheme || this.config.DEFAULT_THEME;
      console.log('🎨 Theme initialized:', theme);
      return theme;
    } catch (error) {
      console.warn('⚠️ Failed to load theme from localStorage:', error);
      return this.config.DEFAULT_THEME;
    }
  }

  /**
   * Aplica el tema especificado
   */
  applyTheme(theme: ThemeMode): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    try {
      this.removeSystemThemeListener();
      const shouldBeDark = this.determineThemeState(theme);
      this.setDarkModeClass(shouldBeDark);
      this.saveThemeToStorage(theme);
      
      console.log(`🎨 Theme applied: ${theme} (dark: ${shouldBeDark})`);
      return shouldBeDark;
    } catch (error) {
      console.error('❌ Failed to apply theme:', error);
      return false;
    }
  }

  /**
   * Determina si debe aplicarse el modo oscuro basado en el tema seleccionado
   */
  private determineThemeState(theme: ThemeMode): boolean {
    switch (theme) {
      case 'dark':
        return true;
      case 'light':
        return false;
      case 'auto':
        return this.setupAutoTheme();
      default:
        console.warn('⚠️ Unknown theme mode:', theme);
        return false;
    }
  }

  /**
   * Configura el tema automático basado en preferencias del sistema
   */
  private setupAutoTheme(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    try {
      this.systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const isDark = this.systemThemeQuery.matches;

      this.systemThemeListener = (e: MediaQueryListEvent) => {
        console.log('🌓 System theme changed:', e.matches ? 'dark' : 'light');
        this.setDarkModeClass(e.matches);
      };

      this.systemThemeQuery.addEventListener('change', this.systemThemeListener);
      console.log('🔄 Auto theme setup complete, system prefers:', isDark ? 'dark' : 'light');
      
      return isDark;
    } catch (error) {
      console.error('❌ Failed to setup auto theme:', error);
      return false;
    }
  }

  /**
   * Aplica o remueve las clases CSS de modo oscuro
   */
  private setDarkModeClass(isDark: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const html = document.documentElement;
    const body = document.body;
    
    // Remover clases existentes primero
    html.classList.remove(this.config.CSS_CLASS);
    body.classList.remove(this.config.CSS_CLASS);
    
    if (isDark) {
      html.classList.add(this.config.CSS_CLASS);
      body.classList.add(this.config.CSS_CLASS);
      console.log('✅ Dark mode classes applied to:', {
        html: html.classList.contains(this.config.CSS_CLASS),
        body: body.classList.contains(this.config.CSS_CLASS)
      });
    } else {
      console.log('✅ Light mode classes applied');
    }
    
    // Force re-paint
    html.style.visibility = 'hidden';
    html.offsetHeight; // trigger reflow
    html.style.visibility = 'visible';
  }

  /**
   * Guarda el tema en localStorage
   */
  private saveThemeToStorage(theme: ThemeMode): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      localStorage.setItem(this.config.STORAGE_KEY, theme);
    } catch (error) {
      console.warn('⚠️ Failed to save theme to localStorage:', error);
    }
  }

  /**
   * Remueve el listener del tema del sistema
   */
  private removeSystemThemeListener(): void {
    if (this.systemThemeListener && this.systemThemeQuery && isPlatformBrowser(this.platformId)) {
      this.systemThemeQuery.removeEventListener('change', this.systemThemeListener);
      this.systemThemeListener = null;
      this.systemThemeQuery = null;
    }
  }

  /**
   * Obtiene el estado actual del modo oscuro
   */
  isDarkMode(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return document.body.classList.contains(this.config.CSS_CLASS);
  }

  /**
   * Limpia resources cuando se destruye el servicio
   */
  cleanup(): void {
    this.removeSystemThemeListener();
  }
} 