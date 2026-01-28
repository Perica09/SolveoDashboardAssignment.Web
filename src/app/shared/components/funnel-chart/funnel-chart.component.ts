import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunnelData } from '../../../core/models';

/**
 * Funnel chart component for visualizing conversion stages
 * Automatically calculates percentages and widths based on data
 */
@Component({
  selector: 'app-funnel-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './funnel-chart.component.html',
  styleUrls: ['./funnel-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FunnelChartComponent implements OnChanges {
  @Input() data: FunnelData[] = [];
  @Input() title: string = 'Conversion Funnel';
  @Input() loading: boolean = false;

  maxValue: number = 0;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data && this.data.length > 0) {
      this.maxValue = Math.max(...this.data.map(d => Number(d.value) || 0));
      this.data.forEach(d => d.percentage = this.maxValue > 0 ? (Number(d.value)/this.maxValue)*100 : 0);
    }
  }

  getWidth(value: number): number {
    return this.maxValue > 0 ? (Number(value) / this.maxValue) * 100 : 0;
  }

  getColor(index: number): string {
    const colors = ['#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107'];
    return this.data[index]?.color || colors[index % colors.length];
  }

}
