# Dashboard Implementation Code Examples

## Table of Contents
1. [Installation Commands](#installation-commands)
2. [Model Definitions](#model-definitions)
3. [Shared Components](#shared-components)
4. [Dashboard Component](#dashboard-component)
5. [Styling Examples](#styling-examples)
6. [Configuration](#configuration)

---

## Installation Commands

```bash
# Install all required dependencies
npm install ng2-charts chart.js @angular/material @angular/cdk

# Verify installation
npm list ng2-charts chart.js @angular/material @angular/cdk
```

---

## Model Definitions

### Extended Dashboard Models
**File:** `src/app/core/models/dashboard.models.ts`

```typescript
import { MonthlyMetrics } from './metrics.models';

/**
 * Extended metrics interface for dashboard-specific fields
 */
export interface DashboardMetrics extends MonthlyMetrics {
  // Executive Summary Fields
  latestMrr: number;
  growthPercentageMoM: number;
  websiteTraffic: number;
  paidConversions: number;
  trialToPaidPercentage: number;
  churnRate: number;
  
  // Funnel Fields
  uniqueSignups: number;
  trialsStarted: number;
}

/**
 * Funnel stage data
 */
export interface FunnelData {
  stage: string;
  value: number;
  percentage: number;
  color?: string;
}

/**
 * Generic chart data point
 */
export interface ChartDataPoint {
  label: string;
  value: number;
}

/**
 * Alert threshold configuration
 */
export interface AlertThresholds {
  mrrDropThreshold: number;
  trafficDropThreshold: number;
  lowConversionThreshold: number;
  highChurnThreshold: number;
}

/**
 * Table column definition
 */
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'currency' | 'percentage';
  format?: (value: any) => string;
}

/**
 * Dashboard section state
 */
export interface SectionState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

/**
 * Complete dashboard state
 */
export interface DashboardState {
  executiveSummary: SectionState<DashboardMetrics>;
  monthlyMetrics: SectionState<MonthlyMetrics[]>;
  mrrGrowth: SectionState<any[]>;
  keywords: SectionState<any[]>;
  regions: SectionState<any[]>;
  channels: SectionState<any[]>;
  alerts: SectionState<any[]>;
}
```

### Update Index Barrel Export
**File:** `src/app/core/models/index.ts`

```typescript
// Add to existing exports
export * from './dashboard.models';
```

---

## Shared Components

### 1. Metric Card Component

**File:** `src/app/shared/components/metric-card/metric-card.component.ts`

```typescript
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

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
    
    switch (this.format) {
      case 'currency':
        return `$${Number(this.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'percentage':
        return `${Number(this.value).toFixed(2)}%`;
      default:
        return Number(this.value).toLocaleString('en-US');
    }
  }

  get growthClass(): string {
    if (!this.growth) return '';
    return this.growth >= 0 ? 'positive' : 'negative';
  }

  get trendIcon(): string {
    if (!this.trend) return '';
    switch (this.trend) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      default: return 'trending_flat';
    }
  }
}
```

**File:** `src/app/shared/components/metric-card/metric-card.component.html`

```html
<mat-card [class.alert]="alert" [class.loading]="loading">
  <mat-card-header>
    <mat-card-title>
      <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
      <span>{{ title }}</span>
    </mat-card-title>
  </mat-card-header>
  
  <mat-card-content>
    <div class="metric-value" *ngIf="!loading">
      {{ formattedValue }}
      <mat-icon *ngIf="trend" [class]="trend">{{ trendIcon }}</mat-icon>
    </div>
    
    <div class="skeleton" *ngIf="loading"></div>
    
    <div class="growth" *ngIf="growth !== undefined && !loading" [class]="growthClass">
      <span>{{ growth >= 0 ? '+' : '' }}{{ growth | number:'1.2-2' }}%</span>
      <span class="growth-label">vs last month</span>
    </div>
  </mat-card-content>
</mat-card>
```

**File:** `src/app/shared/components/metric-card/metric-card.component.css`

```css
mat-card {
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
}

mat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

mat-card.alert {
  border-left: 4px solid #f44336;
}

mat-card-header {
  margin-bottom: 16px;
}

mat-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
  font-weight: 500;
}

mat-card-title mat-icon {
  font-size: 20px;
  width: 20px;
  height: 20px;
}

.metric-value {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.metric-value mat-icon {
  font-size: 32px;
  width: 32px;
  height: 32px;
}

.metric-value mat-icon.up {
  color: #4caf50;
}

.metric-value mat-icon.down {
  color: #f44336;
}

.growth {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  width: fit-content;
}

.growth.positive {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.growth.negative {
  background-color: #ffebee;
  color: #c62828;
}

.growth-label {
  font-size: 11px;
  font-weight: normal;
  opacity: 0.8;
}

.skeleton {
  height: 36px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 768px) {
  .metric-value {
    font-size: 28px;
  }
}
```

---

### 2. Line Chart Component

**File:** `src/app/shared/components/line-chart/line-chart.component.ts`

```typescript
import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() labelKey: string = 'label';
  @Input() valueKey: string = 'value';
  @Input() title: string = '';
  @Input() color: string = '#3f51b5';
  @Input() loading: boolean = false;

  public lineChartType: ChartType = 'line';
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        }
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    const labels = this.data.map(item => item[this.labelKey]);
    const values = this.data.map(item => item[this.valueKey]);

    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          data: values,
          label: this.title,
          borderColor: this.color,
          backgroundColor: `${this.color}20`,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  }
}
```

**File:** `src/app/shared/components/line-chart/line-chart.component.html`

```html
<div class="chart-container">
  <h3 *ngIf="title">{{ title }}</h3>
  
  <div class="chart-wrapper" *ngIf="!loading && data.length > 0">
    <canvas baseChart
      [type]="lineChartType"
      [data]="lineChartData"
      [options]="lineChartOptions">
    </canvas>
  </div>
  
  <div class="skeleton" *ngIf="loading"></div>
  
  <div class="no-data" *ngIf="!loading && data.length === 0">
    <p>No data available</p>
  </div>
</div>
```

**File:** `src/app/shared/components/line-chart/line-chart.component.css`

```css
.chart-container {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  height: 100%;
}

h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 18px;
  font-weight: 500;
}

.chart-wrapper {
  position: relative;
  height: 300px;
}

.skeleton {
  height: 300px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.no-data {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

@media (max-width: 768px) {
  .chart-wrapper {
    height: 250px;
  }
}
```

---

### 3. Funnel Chart Component

**File:** `src/app/shared/components/funnel-chart/funnel-chart.component.ts`

```typescript
import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunnelData } from '../../../core/models';

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

  processedData: FunnelData[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.processData();
    }
  }

  private processData(): void {
    if (this.data.length === 0) return;

    const maxValue = Math.max(...this.data.map(d => d.value));
    
    this.processedData = this.data.map((item, index) => {
      const percentage = (item.value / maxValue) * 100;
      const dropoff = index > 0 
        ? ((this.data[index - 1].value - item.value) / this.data[index - 1].value) * 100 
        : 0;
      
      return {
        ...item,
        percentage,
        dropoff: dropoff > 0 ? dropoff : undefined
      } as FunnelData & { dropoff?: number };
    });
  }

  getWidth(percentage: number): string {
    return `${Math.max(percentage, 20)}%`;
  }
}
```

**File:** `src/app/shared/components/funnel-chart/funnel-chart.component.html`

```html
<div class="funnel-container">
  <h3 *ngIf="title">{{ title }}</h3>
  
  <div class="funnel" *ngIf="!loading && processedData.length > 0">
    <div class="funnel-stage" 
         *ngFor="let stage of processedData; let i = index"
         [style.width]="getWidth(stage.percentage)">
      <div class="stage-bar" [style.background-color]="stage.color || '#3f51b5'">
        <div class="stage-content">
          <span class="stage-name">{{ stage.stage }}</span>
          <span class="stage-value">{{ stage.value | number }}</span>
        </div>
      </div>
      <div class="stage-dropoff" *ngIf="stage['dropoff']">
        <span>-{{ stage['dropoff'] | number:'1.1-1' }}%</span>
      </div>
    </div>
  </div>
  
  <div class="skeleton" *ngIf="loading"></div>
  
  <div class="no-data" *ngIf="!loading && processedData.length === 0">
    <p>No funnel data available</p>
  </div>
</div>
```

**File:** `src/app/shared/components/funnel-chart/funnel-chart.component.css`

```css
.funnel-container {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
}

h3 {
  margin: 0 0 24px 0;
  color: #333;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
}

.funnel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 0;
}

.funnel-stage {
  transition: all 0.3s ease;
}

.stage-bar {
  padding: 16px 24px;
  border-radius: 4px;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.stage-bar:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.stage-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.stage-name {
  font-weight: 600;
  font-size: 16px;
}

.stage-value {
  font-size: 20px;
  font-weight: bold;
}

.stage-dropoff {
  text-align: center;
  padding: 4px 0;
  color: #f44336;
  font-size: 12px;
  font-weight: 600;
}

.skeleton {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.no-data {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

@media (max-width: 768px) {
  .stage-content {
    flex-direction: column;
    gap: 8px;
  }
  
  .stage-name {
    font-size: 14px;
  }
  
  .stage-value {
    font-size: 18px;
  }
}
```

---

### 4. Data Table Component

**File:** `src/app/shared/components/data-table/data-table.component.ts`

```typescript
import { Component, Input, ViewChild, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { TableColumn } from '../../../core/models';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() title: string = '';
  @Input() loading: boolean = false;
  @Input() pageSize: number = 10;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['columns']) {
      this.updateTable();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private updateTable(): void {
    this.dataSource.data = this.data;
    this.displayedColumns = this.columns.map(col => col.key);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  formatValue(value: any, column: TableColumn): string {
    if (value === null || value === undefined) return '-';
    
    if (column.format) {
      return column.format(value);
    }
    
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
}
```

**File:** `src/app/shared/components/data-table/data-table.component.html`

```html
<div class="table-container">
  <h3 *ngIf="title">{{ title }}</h3>
  
  <mat-form-field *ngIf="!loading && data.length > 0">
    <mat-label>Filter</mat-label>
    <input matInput (keyup)="applyFilter($event)" placeholder="Search...">
  </mat-form-field>
  
  <div class="table-wrapper" *ngIf="!loading && data.length > 0">
    <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z2">
      <ng-container *ngFor="let column of columns" [matColumnDef]="column.key">
        <th mat-header-cell *matHeaderCellDef [mat-sort-header]="column.sortable !== false ? column.key : ''">
          {{ column.label }}
        </th>
        <td mat-cell *matCellDef="let row">
          {{ formatValue(row[column.key], column) }}
        </td>
      </ng-container>
      
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    
    <mat-paginator 
      [pageSize]="pageSize"
      [pageSizeOptions]="[5, 10, 25, 50]"
      showFirstLastButtons>
    </mat-paginator>
  </div>
  
  <div class="skeleton" *ngIf="loading"></div>
  
  <div class="no-data" *ngIf="!loading && data.length === 0">
    <p>No data available</p>
  </div>
</div>
```

**File:** `src/app/shared/components/data-table/data-table.component.css`

```css
.table-container {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
}

h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 18px;
  font-weight: 500;
}

mat-form-field {
  width: 100%;
  margin-bottom: 16px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
}

th {
  font-weight: 600;
  color: #333;
}

td {
  color: #666;
}

.skeleton {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.no-data {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}
```

---

### 5. Alert Badge Component

**File:** `src/app/shared/components/alert-badge/alert-badge.component.ts`

```typescript
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Alert } from '../../../core/models';

@Component({
  selector: 'app-alert-badge',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  templateUrl: './alert-badge.component.html',
  styleUrls: ['./alert-badge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertBadgeComponent {
  @Input() alert!: Alert;
  @Input() compact: boolean = false;

  get severityClass(): string {
    return `severity-${this.alert.severity}`;
  }

  get severityIcon(): string {
    switch (this.alert.severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'check_circle';
      default: return 'info';
    }
  }
}
```

**File:** `src/app/shared/components/alert-badge/alert-badge.component.html`

```html
<mat-chip-set *ngIf="alert">
  <mat-chip [class]="severityClass" [class.compact]="compact">
    <mat-icon>{{ severityIcon }}</mat-icon>
    <span *ngIf="!compact">{{ alert.title }}</span>
  </mat-chip>
</mat-chip-set>
```

**File:** `src/app/shared/components/alert-badge/alert-badge.component.css`

```css
mat-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

mat-chip.compact {
  padding: 4px 8px;
}

mat-chip mat-icon {
  font-size: 18px;
  width: 18px;
  height: 18px;
}

.severity-critical {
  background-color: #f44336 !important;
  color: white !important;
}

.severity-high {
  background-color: #ff9800 !important;
  color: white !important;
}

.severity-medium {
  background-color: #ffc107 !important;
  color: #333 !important;
}

.severity-low {
  background-color: #4caf50 !important;
  color: white !important;
}
```

---

## Configuration

### Update Environment Configuration
**File:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5090/api',
  alertThresholds: {
    mrrDropThreshold: -5,        // Alert if MRR drops more than 5%
    trafficDropThreshold: -10,   // Alert if traffic drops more than 10%
    lowConversionThreshold: 2,   // Alert if conversion rate below 2%
    highChurnThreshold: 5        // Alert if churn rate above 5%
  },
  enableDebugSection: true
};
```

### Update Global Styles
**File:** `src/styles.css`

```css
/* Import Angular Material theme */
@import '@angular/material/prebuilt-themes/indigo-pink.css';

/* Global styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Roboto, "Helvetica Neue", sans-serif;
  background-color: #f5f5f5;
}

/* Utility classes */
.text-center {
  text-align: center;
}

.mt-1 { margin-top: 8px; }
.mt-2 { margin-top: 16px; }
.mt-3 { margin-top: 24px; }
.mt-4 { margin-top: 32px; }

.mb-1 { margin-bottom: 8px; }
.mb-2 { margin-bottom: 16px; }
.mb-3 { margin-bottom: 24px; }
.mb-4 { margin-bottom: 32px; }

.p-1 { padding: 8px; }
.p-2 { padding: 16px; }
.p-3 { padding: 24px; }
.p-4 { padding: 32px; }
```

---

## Next Steps

After creating these shared components, the next phase will be to:
1. Update the dashboard component to use these shared components
2. Implement the complete dashboard layout
3. Add responsive styling
4. Test with real API data

This modular approach ensures:
- **Reusability**: Components can be used across the application
- **Maintainability**: Each component has a single responsibility
- **Testability**: Components can be tested in isolation
- **Consistency**: Uniform design and behavior across the dashboard
