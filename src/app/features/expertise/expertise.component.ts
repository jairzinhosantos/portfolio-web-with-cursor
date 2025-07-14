import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaEspecializacion } from '../../core/interfaces/portfolio.interface';

@Component({
  selector: 'app-expertise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expertise.component.html',
  styleUrls: ['./expertise.component.scss']
})
export class ExpertiseComponent implements OnChanges {
  @Input() areas: AreaEspecializacion[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['areas'] && changes['areas'].currentValue) {
      // Areas updated - component will re-render automatically
    }
  }
} 