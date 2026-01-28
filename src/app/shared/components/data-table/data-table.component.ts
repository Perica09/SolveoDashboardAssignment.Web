import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from '../../../core/models';

/**
 * Reusable data table component with sorting and formatting capabilities
 * Supports dynamic row limiting and custom column types
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() title: string = '';
  @Input() loading: boolean = false;
  @Input() maxRows: number = 10;

  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  displayData: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['data'] || changes['maxRows']) && this.data) {
      this.displayData = [...this.data].slice(0, this.maxRows);
    }
  }

  sort(column: TableColumn): void {
    if (!column.sortable) return;

    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    const sortedData = [...this.data].sort((a, b) => {
      const aVal = a[column.key];
      const bVal = b[column.key];

      if (aVal === bVal) return 0;
      const comparison = aVal > bVal ? 1 : -1;
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.displayData = sortedData.slice(0, this.maxRows);
  }

  formatValue(value: unknown, column: TableColumn): string {
    if (value === null || value === undefined) return '-';
    if (column.format) return column.format(value);

    switch (column.type) {
      case 'currency':
        return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'percentage':
        return `${Number(value).toFixed(2)}%`;
      case 'number':
        return Number(value).toLocaleString('en-US');
      default:
        return String(value);
    }
  }

  getSortIcon(column: TableColumn): string {
    if (!column.sortable || this.sortColumn !== column.key) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }
}
