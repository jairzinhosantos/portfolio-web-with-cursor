import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialUrlsService, SocialUrlConfig } from '../../../services/social-urls.service';

@Component({
  selector: 'app-social-links',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="social-links">
      <div class="social-row primary-social" *ngIf="primaryLinks.length > 0">
        <a *ngFor="let link of primaryLinks" 
           [href]="socialUrls[link] || '#'"
           [target]="shouldOpenInNewTab(link) ? '_blank' : '_self'"
           [rel]="shouldOpenInNewTab(link) ? 'noopener' : ''"
           [title]="iconConfig[link]?.title || link">
          <i *ngIf="iconConfig[link]?.icon && !iconConfig[link]?.customContent" 
             [class]="iconConfig[link].icon"></i>
          <span *ngIf="iconConfig[link]?.customContent" 
                class="x-icon">{{ iconConfig[link].customContent }}</span>
        </a>
      </div>
      <div class="social-row secondary-social" *ngIf="secondaryLinks.length > 0">
        <a *ngFor="let link of secondaryLinks"
           [href]="socialUrls[link] || '#'"
           [target]="shouldOpenInNewTab(link) ? '_blank' : '_self'"
           [rel]="shouldOpenInNewTab(link) ? 'noopener' : ''"
           [title]="iconConfig[link]?.title || link">
          <i *ngIf="iconConfig[link]?.icon && !iconConfig[link]?.customContent" 
             [class]="iconConfig[link].icon"></i>
          <span *ngIf="iconConfig[link]?.customContent" 
                class="x-icon">{{ iconConfig[link].customContent }}</span>
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./social-links.component.scss']
})
export class SocialLinksComponent implements OnInit {
  @Input() showPrimary: boolean = true;
  @Input() showSecondary: boolean = true;

  socialUrls: { [key: string]: string } = {};
  iconConfig: { [key: string]: any } = {};
  primaryLinks: string[] = [];
  secondaryLinks: string[] = [];

  constructor(private socialUrlsService: SocialUrlsService) {}

  ngOnInit(): void {
    this.loadSocialConfig();
  }

  private loadSocialConfig(): void {
    this.socialUrlsService.getSocialConfig().subscribe({
      next: (config: SocialUrlConfig) => {
        this.socialUrls = config.socialMedia;
        this.iconConfig = config.iconMapping;
        
        if (this.showPrimary) {
          this.primaryLinks = config.socialGroups.primary;
        }
        
        if (this.showSecondary) {
          this.secondaryLinks = config.socialGroups.secondary;
        }
      },
      error: (error) => {
        console.error('Error loading social config:', error);
      }
    });
  }

  shouldOpenInNewTab(link: string): boolean {
    return !['email', 'discord'].includes(link);
  }
} 