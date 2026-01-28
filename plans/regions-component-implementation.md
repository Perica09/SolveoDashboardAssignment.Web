# RegionsComponent Implementation Guide

## Quick Reference

This guide provides the exact code needed to implement the RegionsComponent based on the [architecture plan](regions-component-architecture.md).

## Step 1: Extend RegionalMetrics Interface

**File**: [`src/app/core/models/metrics.models.ts`](../../src/app/core/models/metrics.models.ts:35)

Add these fields to the existing `RegionalMetrics` interface:

```typescript
export interface RegionalMetrics {
  // Existing fields
  region: string;
  country?: string;
  city?: string;
  totalTraffic?: number;
  totalConversions?: number;
  averageTrialToPaidRate?: number;
  trafficTrendPercentage?: number;
  cacLtvRatio?: number;
  averageCac?: number;
  averageLtv?: number;
  monthCount?: number;
  sessions?: number;
  conversions?: number;
  conversionRate?: number;
  revenue?: number;
  trialUsers?: number;
  paidUsers?: number;
  ratio?: number;

  // NEW FIELDS - Add these
  month?: string;              // Monthly tracking (e.g., "2024-01")
  organicTraffic?: number;     // Organic traffic count
  paidTraffic?: number;        // Paid traffic count
  trialsStarted?: number;      // Number of trials started
  paidConversions?: number;    // Number of paid conversions
  trialToPaidRate?: number;    // Trial to paid conversion rate (%)
  mrrUsd?: number;             // Monthly recurring revenue in USD
  cacUsd?: number;             // Customer acquisition cost in USD
  ltvUsd?: number;             // Lifetime value in USD

  [key: string]: any;
}
```

## Step 2: Component TypeScript Implementation

**File**: [`src/app/features/regions/regions.component.ts`](../../src/app/features/regions/regions.component.ts:1)

Key implementation patterns based on [`keywords.component.ts`](../../src/app/features/keywords/keywords.component.ts:1):

### Imports and Decorator
```typescript
import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MetricsService } from '../../core/services';
import { RegionalMetrics } from '../../core/models';
```

### Filter State Interface
```typescript
interface FilterState {
  search: string;
  region: string;
  country: string;
  city: string;
}
```

### Component Class Structure
```typescript
@Component({
  selector: 'app-regions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class RegionsComponent implements OnInit, AfterViewInit {
  // Table columns
  displayedColumns: string[] = [
    'region',
    'country',
    'city',
    'month',
    'organicTraffic',
    'paidTraffic',
    'totalTraffic',
    'trialsStarted',
    'paidConversions',
    'trialToPaidRate',
    'mrrUsd',
    'cacUsd',
    'ltvUsd'
  ];

  dataSource = new MatTableDataSource<RegionalMetrics>([]);
  loading = false;
  error: string | null = null;
  
  // Raw data for time period filtering
  private rawData: RegionalMetrics[] = [];
  
  // Filter options
  regions: string[] = [];
  countries: string[] = [];
  cities: string[] = [];

  // Form controls
  searchControl = new FormControl('');
  regionControl = new FormControl('all');
  countryControl = new FormControl('all');
  cityControl = new FormControl('all');
  timePeriodControl = new FormControl(12);
  
  private filterState: FilterState = {
    search: '',
    region: 'all',
    country: 'all',
    city: 'all'
  };

  private destroyRef = inject(DestroyRef);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private metricsService: MetricsService
  ) {}

  ngOnInit(): void {
    this.loadRegionalData();
    this.setupFilterListeners();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = 10;
    this.dataSource.filterPredicate = this.createFilterPredicate();
  }
}
```

### Data Loading Method
```typescript
loadRegionalData(): void {
  this.loading = true;
  this.error = null;

  this.metricsService.getAllRegionalPerformance()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
        this.rawData = data;
        this.applyTimePeriodFilter();
        this.extractFilterOptions(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load regional metrics';
        this.loading = false;
      }
    });
}
```

### Time Period Filtering
```typescript
private applyTimePeriodFilter(): void {
  const months = this.timePeriodControl.value || 12;
  const cutoffDate = this.getMonthsAgo(months);
  
  // Filter records within time period
  const filtered = this.rawData.filter(record => {
    if (!record.month) return true;
    const recordDate = new Date(record.month);
    return recordDate >= cutoffDate;
  });
  
  // Group and aggregate by location
  const aggregated = this.aggregateByLocation(filtered);
  
  // Update data source
  this.dataSource.data = aggregated;
}

private getMonthsAgo(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}

private aggregateByLocation(records: RegionalMetrics[]): RegionalMetrics[] {
  const grouped = new Map<string, RegionalMetrics[]>();
  
  // Group by region-country-city
  records.forEach(record => {
    const key = `${record.region || ''}-${record.country || ''}-${record.city || ''}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(record);
  });
  
  // Calculate averages for each group
  return Array.from(grouped.values()).map(group => {
    const first = group[0];
    const count = group.length;
    
    return {
      region: first.region,
      country: first.country,
      city: first.city,
      month: count > 1 ? `${count} months avg` : first.month,
      organicTraffic: this.average(group, 'organicTraffic'),
      paidTraffic: this.average(group, 'paidTraffic'),
      totalTraffic: this.average(group, 'totalTraffic'),
      trialsStarted: this.average(group, 'trialsStarted'),
      paidConversions: this.average(group, 'paidConversions'),
      trialToPaidRate: this.average(group, 'trialToPaidRate'),
      mrrUsd: this.average(group, 'mrrUsd'),
      cacUsd: this.average(group, 'cacUsd'),
      ltvUsd: this.average(group, 'ltvUsd')
    };
  });
}

private average(records: RegionalMetrics[], field: string): number | undefined {
  const values = records
    .map(r => r[field])
    .filter(v => v !== null && v !== undefined && typeof v === 'number') as number[];
  
  if (values.length === 0) return undefined;
  
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}
```

### Filter Setup
```typescript
private setupFilterListeners(): void {
  // Search with debounce
  this.searchControl.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(value => {
      this.filterState.search = value || '';
      this.applyFilters();
    });

  // Region filter
  this.regionControl.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(value => {
      this.filterState.region = value || 'all';
      this.applyFilters();
    });

  // Country filter
  this.countryControl.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(value => {
      this.filterState.country = value || 'all';
      this.applyFilters();
    });

  // City filter
  this.cityControl.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(value => {
      this.filterState.city = value || 'all';
      this.applyFilters();
    });

  // Time period filter
  this.timePeriodControl.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.applyTimePeriodFilter();
    });
}

private createFilterPredicate() {
  return (data: RegionalMetrics, filter: string): boolean => {
    const filterObj: FilterState = JSON.parse(filter);
    const searchTerm = filterObj.search.toLowerCase();

    // Search match across region, country, city
    const searchMatch = !searchTerm ||
      data.region?.toLowerCase().includes(searchTerm) ||
      data.country?.toLowerCase().includes(searchTerm) ||
      data.city?.toLowerCase().includes(searchTerm);

    // Dropdown filters
    const regionMatch = filterObj.region === 'all' || data.region === filterObj.region;
    const countryMatch = filterObj.country === 'all' || data.country === filterObj.country;
    const cityMatch = filterObj.city === 'all' || data.city === filterObj.city;

    return !!searchMatch && !!regionMatch && !!countryMatch && !!cityMatch;
  };
}

private applyFilters(): void {
  this.dataSource.filter = JSON.stringify(this.filterState);
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
```

### Extract Filter Options
```typescript
private extractFilterOptions(data: RegionalMetrics[]): void {
  this.regions = Array.from(new Set(data.map(d => d.region || ''))).filter(Boolean).sort();
  this.countries = Array.from(new Set(data.map(d => d.country || ''))).filter(Boolean).sort();
  this.cities = Array.from(new Set(data.map(d => d.city || ''))).filter(Boolean).sort();
}
```

### Formatting Methods
```typescript
formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null) return '-';
  return Math.round(value).toLocaleString('en-US');
}

formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) return '-';
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

formatPercentage(value: number | undefined | null): string {
  if (value === undefined || value === null) return '-';
  return `${value.toFixed(2)}%`;
}
```

### Action Methods
```typescript
clearSearch(): void {
  this.searchControl.setValue('');
}

resetFilters(): void {
  this.searchControl.setValue('');
  this.regionControl.setValue('all');
  this.countryControl.setValue('all');
  this.cityControl.setValue('all');
  this.timePeriodControl.setValue(12);
}

retry(): void {
  this.loadRegionalData();
}
```

## Step 3: HTML Template

**File**: [`src/app/features/regions/regions.component.html`](../../src/app/features/regions/regions.component.html:1)

Pattern based on [`keywords.component.html`](../../src/app/features/keywords/keywords.component.html:1):

```html
<div class="regions-container">
  <div class="header">
    <h1>Regional Performance</h1>
  </div>

  <!-- Loading overlay -->
  <div *ngIf="loading" class="loading-overlay">
    <mat-spinner></mat-spinner>
    <p>Loading regional data...</p>
  </div>

  <!-- Error state -->
  <div *ngIf="error && !loading" class="error-state">
    <mat-icon>error_outline</mat-icon>
    <p>{{ error }}</p>
    <button mat-raised-button color="primary" (click)="retry()">
      <mat-icon>refresh</mat-icon> Retry
    </button>
  </div>

  <!-- Content -->
  <div class="content" [class.hidden]="loading || error">

    <!-- Filters -->
    <div class="filters-section">
      <mat-form-field class="search-field" appearance="outline">
        <mat-icon matIconPrefix>search</mat-icon>
        <input matInput [formControl]="searchControl" 
               placeholder="Search by region, country, or city" 
               autocomplete="off">
        <button mat-icon-button matSuffix *ngIf="searchControl.value" (click)="clearSearch()">
          <mat-icon>close</mat-icon>
        </button>
      </mat-form-field>

      <div class="filter-controls">
        <mat-form-field appearance="outline">
          <mat-label>Region</mat-label>
          <mat-select [formControl]="regionControl">
            <mat-option value="all">All Regions</mat-option>
            <mat-option *ngFor="let region of regions" [value]="region">{{ region }}</mat-option>
          </mat-select>
          <mat-icon matPrefix>public</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Country</mat-label>
          <mat-select [formControl]="countryControl">
            <mat-option value="all">All Countries</mat-option>
            <mat-option *ngFor="let country of countries" [value]="country">{{ country }}</mat-option>
          </mat-select>
          <mat-icon matPrefix>flag</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>City</mat-label>
          <mat-select [formControl]="cityControl">
            <mat-option value="all">All Cities</mat-option>
            <mat-option *ngFor="let city of cities" [value]="city">{{ city }}</mat-option>
          </mat-select>
          <mat-icon matPrefix>location_city</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Time Period</mat-label>
          <mat-select [formControl]="timePeriodControl">
            <mat-option [value]="3">Last 3 Months</mat-option>
            <mat-option [value]="6">Last 6 Months</mat-option>
            <mat-option [value]="9">Last 9 Months</mat-option>
            <mat-option [value]="12">Last 12 Months</mat-option>
          </mat-select>
          <mat-icon matPrefix>date_range</mat-icon>
        </mat-form-field>

        <button mat-stroked-button (click)="resetFilters()" class="reset-button">
          <mat-icon>filter_alt_off</mat-icon> Reset Filters
        </button>
      </div>
    </div>

    <!-- Results info -->
    <div class="results-info">
      <p>
        <strong>{{ dataSource.filteredData.length }}</strong>
        <span *ngIf="dataSource.filteredData.length !== dataSource.data.length">
          of {{ dataSource.data.length }}
        </span>
        regions
      </p>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table mat-table [dataSource]="dataSource" matSort 
             matSortActive="totalTraffic" matSortDirection="desc" 
             class="regions-table">

        <!-- Region Column -->
        <ng-container matColumnDef="region">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Region</th>
          <td mat-cell *matCellDef="let row" class="region-cell">
            <strong>{{ row.region || '-' }}</strong>
          </td>
        </ng-container>

        <!-- Country Column -->
        <ng-container matColumnDef="country">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Country</th>
          <td mat-cell *matCellDef="let row">{{ row.country || '-' }}</td>
        </ng-container>

        <!-- City Column -->
        <ng-container matColumnDef="city">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>City</th>
          <td mat-cell *matCellDef="let row">{{ row.city || '-' }}</td>
        </ng-container>

        <!-- Month Column -->
        <ng-container matColumnDef="month">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Month</th>
          <td mat-cell *matCellDef="let row">{{ row.month || '-' }}</td>
        </ng-container>

        <!-- Organic Traffic Column -->
        <ng-container matColumnDef="organicTraffic">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Organic Traffic</th>
          <td mat-cell *matCellDef="let row">{{ formatNumber(row.organicTraffic) }}</td>
        </ng-container>

        <!-- Paid Traffic Column -->
        <ng-container matColumnDef="paidTraffic">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Paid Traffic</th>
          <td mat-cell *matCellDef="let row">{{ formatNumber(row.paidTraffic) }}</td>
        </ng-container>

        <!-- Total Traffic Column -->
        <ng-container matColumnDef="totalTraffic">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Total Traffic</th>
          <td mat-cell *matCellDef="let row">{{ formatNumber(row.totalTraffic) }}</td>
        </ng-container>

        <!-- Trials Started Column -->
        <ng-container matColumnDef="trialsStarted">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Trials Started</th>
          <td mat-cell *matCellDef="let row">{{ formatNumber(row.trialsStarted) }}</td>
        </ng-container>

        <!-- Paid Conversions Column -->
        <ng-container matColumnDef="paidConversions">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Paid Conversions</th>
          <td mat-cell *matCellDef="let row">{{ formatNumber(row.paidConversions) }}</td>
        </ng-container>

        <!-- Trial to Paid Rate Column -->
        <ng-container matColumnDef="trialToPaidRate">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Trial to Paid Rate</th>
          <td mat-cell *matCellDef="let row">{{ formatPercentage(row.trialToPaidRate) }}</td>
        </ng-container>

        <!-- MRR USD Column -->
        <ng-container matColumnDef="mrrUsd">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>MRR (USD)</th>
          <td mat-cell *matCellDef="let row">{{ formatCurrency(row.mrrUsd) }}</td>
        </ng-container>

        <!-- CAC USD Column -->
        <ng-container matColumnDef="cacUsd">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>CAC (USD)</th>
          <td mat-cell *matCellDef="let row">{{ formatCurrency(row.cacUsd) }}</td>
        </ng-container>

        <!-- LTV USD Column -->
        <ng-container matColumnDef="ltvUsd">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>LTV (USD)</th>
          <td mat-cell *matCellDef="let row">{{ formatCurrency(row.ltvUsd) }}</td>
        </ng-container>

        <!-- Header and rows -->
        <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>

        <!-- No data row -->
        <tr class="mat-row no-data-row" *matNoDataRow>
          <td class="mat-cell" [attr.colspan]="displayedColumns.length">
            <div class="no-data">
              <mat-icon>search_off</mat-icon>
              <p>No regions match your filters</p>
              <button mat-button color="primary" (click)="resetFilters()">Clear Filters</button>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Paginator -->
    <mat-paginator [pageSizeOptions]="[10,25,50,100]" 
                   [pageSize]="10" 
                   showFirstLastButtons 
                   aria-label="Select page of regions">
    </mat-paginator>
  </div>
</div>
```

## Step 4: CSS Styling

**File**: [`src/app/features/regions/regions.component.css`](../../src/app/features/regions/regions.component.css:1)

Copy the structure from [`keywords.component.css`](../../src/app/features/keywords/keywords.component.css:1) and adjust class names:

```css
/* Container */
.regions-container {
  padding: 24px;
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  margin-bottom: 24px;
}

.header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 500;
  color: #333;
}

/* Loading State */
.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.loading-overlay p {
  color: #666;
  font-size: 16px;
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  text-align: center;
}

.error-state mat-icon {
  font-size: 48px;
  width: 48px;
  height: 48px;
  color: #f44336;
}

.error-state p {
  color: #666;
  font-size: 16px;
  max-width: 500px;
}

/* Content */
.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content.hidden {
  display: none;
}

/* Filters Section */
.filters-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

.search-field {
  width: 100%;
}

.filter-controls {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-controls mat-form-field {
  flex: 1;
  min-width: 200px;
}

.reset-button {
  height: 56px;
}

/* Results Info */
.results-info {
  padding: 8px 0;
  color: #666;
  font-size: 14px;
}

.results-info p {
  margin: 0;
}

/* Table Container */
.table-container {
  overflow-x: auto;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

/* Table Styles */
.regions-table {
  width: 100%;
  background: white;
}

.regions-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
}

.regions-table td {
  color: #666;
}

.table-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #f5f5f5;
}

/* Region Cell */
.region-cell {
  font-weight: 500;
  color: #1976d2;
}

/* No Data State */
.no-data-row {
  height: 200px;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
}

.no-data mat-icon {
  font-size: 48px;
  width: 48px;
  height: 48px;
  color: #bdbdbd;
}

.no-data p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

/* Paginator */
mat-paginator {
  border-top: 1px solid #e0e0e0;
  background: white;
}

/* Responsive Styles */
@media (max-width: 1400px) {
  .table-container {
    overflow-x: auto;
  }
  
  .regions-table {
    min-width: 1400px;
  }
}

@media (max-width: 768px) {
  .regions-container {
    padding: 16px;
  }
  
  .header h1 {
    font-size: 24px;
  }
  
  .filters-section {
    padding: 16px;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .filter-controls mat-form-field {
    width: 100%;
  }
  
  .reset-button {
    width: 100%;
  }
}

/* Accessibility */
.mat-sort-header-button:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

button:focus-visible {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}
```

## Summary

The implementation follows these key patterns from [`KeywordsComponent`](../../src/app/features/keywords/keywords.component.ts:1):

1. **Standalone component** with all Material imports
2. **Reactive forms** for all filter controls
3. **Custom filter predicate** for complex filtering
4. **Debounced search** (300ms) for performance
5. **Loading and error states** with proper UX
6. **Sticky table header** for better scrolling
7. **Responsive design** for mobile devices
8. **Accessibility** with ARIA labels and focus styles

The unique addition is the **time period aggregation** logic that groups monthly records and calculates averages for the selected time range.
