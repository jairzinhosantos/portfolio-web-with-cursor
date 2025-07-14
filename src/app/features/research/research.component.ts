import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaInvestigacion } from '../../core/interfaces/portfolio.interface';

@Component({
  selector: 'app-research',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss']
})
export class ResearchComponent implements OnChanges {
  @Input() areas: AreaInvestigacion[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['areas'] && changes['areas'].currentValue) {
      // Areas updated - component will re-render automatically  
    }
  }
} 