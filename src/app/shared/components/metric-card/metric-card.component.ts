import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/**
 * Reusable metric card component for displaying KPIs with optional trends and growth indicators
 */
@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricCardComponent {
  @Input() title: string = '';
  @Input() value: number | string | null = null;
  @Input() growth?: number;
  @Input() icon?: string;
  @Input() loading: boolean = false;
  @Input() trend?: 'up' | 'down' | 'neutral';
  @Input() format: 'number' | 'currency' | 'percentage' = 'number';
  @Input() alert?: boolean = false;

  get formattedValue(): string {
    if (this.value === null || this.value === undefined) return '-';

    const val = Number(this.value);
    switch (this.format) {
      case 'currency': return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'percentage': return `${val.toFixed(2)}%`;
      default: return val.toLocaleString('en-US');
    }
  }

  get growthClass(): string {
    if (this.growth === undefined || this.growth === null) return '';
    return this.growth >= 0 ? 'positive' : 'negative';
  }

  get trendIcon(): string {
    switch (this.trend) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      default: return 'trending_flat';
    }
  }
}
