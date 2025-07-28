import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener, PLATFORM_ID, Inject, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() activeSection: string = 'about';
  @Input() currentTheme: 'light' | 'dark' | 'auto' = 'light';
  @Input() isMenuOpen: boolean = false;
  @Input() themeMenuOpen: boolean = false;
  @Input() isDarkMode: boolean = false;

  @Output() sectionClick = new EventEmitter<string>();
  @Output() menuToggle = new EventEmitter<void>();
  @Output() themeMenuToggle = new EventEmitter<void>();
  @Output() themeChange = new EventEmitter<'light' | 'dark' | 'auto'>();

  isScrolled = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.checkScroll();
  }

  ngOnDestroy() {}

  @HostListener('window:scroll')
  checkScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 50;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Cerrar menú móvil al hacer click fuera del header
    if (isPlatformBrowser(this.platformId) && this.isMenuOpen) {
      const target = event.target as HTMLElement;
      if (!this.elementRef.nativeElement.contains(target)) {
        this.menuToggle.emit();
      }
    }
  }

  onSectionClick(section: string, event: Event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del link
    this.sectionClick.emit(section);
    // Cerrar menú móvil al hacer click en navegación (solo en mobile)
    if (isPlatformBrowser(this.platformId) && window.innerWidth <= 768) {
      this.menuToggle.emit();
    }
  }

  onMenuToggle() {
    this.menuToggle.emit();
  }

  onThemeMenuToggle() {
    this.themeMenuToggle.emit();
  }

  onThemeChange(theme: 'light' | 'dark' | 'auto') {
    this.themeChange.emit(theme);
  }

  getThemeIcon(): string {
    switch (this.currentTheme) {
      case 'light':
        return 'fa-sun';
      case 'dark':
        return 'fa-moon';
      case 'auto':
        return 'fa-desktop';
      default:
        return 'fa-sun';
    }
  }
} 