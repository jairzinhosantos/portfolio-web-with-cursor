import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialUrlsService, SocialUrlConfig } from '../../services/social-urls.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutComponent implements OnInit, AfterViewInit {
  // Personal info props - Required inputs
  @Input() nombre: string = '';
  @Input() titulo1: string = '';
  @Input() titulo2: string = '';
  @Input() titulo3: string = '';
  @Input() tagline: string = '';
  @Input() fotoPerfil: string = '';
  @Input() resumenProfesional: string = '';

  // Social media props - Input fallbacks (for compatibility)
  @Input() linkedin: string = '';
  @Input() twitter: string = '';
  @Input() github: string = '';
  @Input() youtube: string = '';
  @Input() tiktok: string = '';
  @Input() instagram: string = '';
  @Input() medium: string = '';
  @Input() email: string = '';

  // Internal social URLs - prioritized from centralized service
  private centralizedSocial: { [key: string]: string } = {};
  private socialConfig: SocialUrlConfig | null = null;

  constructor(
    private socialUrlsService: SocialUrlsService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.loadSocialConfig();
  }

  ngAfterViewInit() {
    // Setup contact link after view initialization
    setTimeout(() => this.setupContactLink(), 100);
  }

  private loadSocialConfig() {
    this.socialUrlsService.getSocialConfig().subscribe({
      next: (config) => {
        this.socialConfig = config;
        this.centralizedSocial = config.socialMedia;
        // Setup contact link functionality
        setTimeout(() => this.setupContactLink(), 200);
      },
      error: (error) => {
        console.error('Error loading social config:', error);
        // Fallback to input props if centralized config fails
      }
    });
  }

  // Getter methods that prioritize centralized data over input props
  get finalLinkedin(): string {
    return this.centralizedSocial['linkedin'] || this.linkedin;
  }

  get finalTwitter(): string {
    return this.centralizedSocial['twitter'] || this.twitter;
  }

  get finalGithub(): string {
    return this.centralizedSocial['github'] || this.github;
  }

  get finalYoutube(): string {
    return this.centralizedSocial['youtube'] || this.youtube;
  }

  get finalTiktok(): string {
    return this.centralizedSocial['tiktok'] || this.tiktok;
  }

  get finalInstagram(): string {
    return this.centralizedSocial['instagram'] || this.instagram;
  }

  get finalEmail(): string {
    return this.centralizedSocial['email'] || this.email;
  }

  private setupContactLink() {
    const contactLink = this.elementRef.nativeElement.querySelector('.contact-link');
    
    if (contactLink && this.socialConfig) {
      contactLink.onclick = (e: Event) => {
        e.preventDefault();
        this.onContactClick();
      };
    }
  }

  onContactClick() {
    if (this.socialConfig?.messages && this.finalEmail) {
      const { emailSubject, emailBody } = this.socialConfig.messages.contact;
      const emailLink = this.socialUrlsService.buildEmailLink(emailSubject, emailBody, this.finalEmail);
      window.location.href = emailLink;
    }
  }

  onDiscordClick() {
    if (this.socialConfig?.messages) {
      this.showDiscordModal();
    } else {
      alert('Discord server coming soon!');
    }
  }

  private showDiscordModal() {
    if (!this.socialConfig?.messages) return;

    const { discord } = this.socialConfig.messages;
    const modal = document.createElement('div');
    modal.className = 'discord-modal-overlay';
    modal.innerHTML = `
      <div class="discord-modal">
        <div class="discord-modal-header">
          <h3>${discord.popupTitle}</h3>
          <button class="discord-modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="discord-modal-body">
          <p>${discord.popupMessage}</p>
        </div>
        <div class="discord-modal-footer">
          <button class="discord-modal-button">${discord.popupButtonText}</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event handlers
    const closeModal = () => {
      modal.style.animation = 'fadeIn 0.3s ease reverse';
      setTimeout(() => document.body.removeChild(modal), 300);
    };

    // Close button
    modal.querySelector('.discord-modal-close')?.addEventListener('click', closeModal);
    
    // Footer button  
    modal.querySelector('.discord-modal-button')?.addEventListener('click', closeModal);
    
    // Background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }
} 