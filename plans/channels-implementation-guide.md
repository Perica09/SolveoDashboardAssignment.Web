# Channels Table Implementation Guide

## Step-by-Step Implementation

This guide provides detailed code examples for implementing the channels table component.

---

## Step 1: Update ChannelMetrics Interface

**File**: [`src/app/core/models/metrics.models.ts`](../src/app/core/models/metrics.models.ts)

Update the existing `ChannelMetrics` interface to include all fields from the API:

```typescript
export interface ChannelMetrics {
  // Core identification
  channel: string;
  
  // Time tracking
  month?: string;              // Format: "YYYY-MM" (e.g., "2024-01")
  
  // Traffic metrics
  sessions: number;            // Total sessions
  signups?: number;            // Number of signups (from API)
  
  // Engagement metrics
  conversionRate: number;      // Conversion rate percentage
  avgSessionDurationSec?: number;  // Average session duration in seconds
  bounceRate?: number;         // Bounce rate (0-1 decimal, e.g., 0.56 = 56%)
  pagesPerSession?: number;    // Average pages per session
  
  // Legacy/alternative field names (for backward compatibility)
  conversions?: number;        // Alternative to signups
  totalSessions?: number;
  totalSignups?: number;
  averageSessionDuration?: number;
  monthCount?: number;
  cost?: number;
  roi?: number;
  
  // Formatted display values (computed in component)
  formattedSessions?: string;
  formattedSignups?: string;
  formattedConversionRate?: string;
  formattedDuration?: string;
  formattedBounceRate?: string;
  formattedPagesPerSession?: string;
  
  [key: string]: any;
}
```

---

## Step 2: Add Service Method

**File**: [`src/app/core/services/metrics.service.ts`](../src/app/core/services/metrics.service.ts)

Add the new method in the "Channel Metrics" section:

```typescript
// ========== Channel Metrics ==========

getChannelMetrics(params?: ChannelMetricsParams): Observable<ChannelMetrics[]> {
  const httpParams = this.buildParams(params);
  return this.http.get<ChannelMetrics[]>(`${this.baseUrl}/channels`, { params: httpParams });
}

/**
 * Get all channel metrics with monthly breakdown
 * Endpoint: /api/Metrics/channels/all
 */
getAllChannelMetrics(): Observable<ChannelMetrics[]> {
  return this.http.get<ChannelMetrics[]>(`${this.baseUrl}/channels/all`);
}

getChannelConversionRates(params?: DateRangeParams): Observable<ChannelConversionRates[]> {
  const httpParams = this.buildParams(params);
  return this.http.get<ChannelConversionRates[]>(`${this.baseUrl}/channels/conversion-rates`, { params: httpParams });
}
```

---

## Step 3: Update Component TypeScript

**File**: [`src/app/features/channels/channels.component.ts`](../src/app/features/channels/channels.component.ts)

Replace the entire file content:

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
import { ChannelMetrics } from '../../core/models';

interface FilterState {
  search: string;
  year: string;
  month: string;
  channel: string;
}

interface MonthOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-channels',
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
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChannelsComponent implements OnInit, AfterViewInit {
  
  // Table columns
  displayedColumns: string[] = [
    'month',
    'channel',
    'sessions',
    'signups',
    'conversionRate',
    'avgSessionDurationSec',
    'bounceRate',
    'pagesPerSession'
  ];

  dataSource = new MatTableDataSource<ChannelMetrics>([]);
  loading = false;
  error: string | null = null;
  
  // Raw data for filtering
  private rawData: ChannelMetrics[] = [];
  
  // Filter options
  years: string[] = [];
  months: MonthOption[] = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];
  channels: string[] = [];

  // Form controls
  searchControl = new FormControl('');
  yearControl = new FormControl('all');
  monthControl = new FormControl('all');
  channelControl = new FormControl('all');
  
  private filterState: FilterState = {
    search: '',
    year: 'all',
    month: 'all',
    channel: 'all'
  };

  private destroyRef = inject(DestroyRef);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.loadChannelData();
    this.setupFilterListeners();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = 10;
    this.dataSource.filterPredicate = this.createFilterPredicate();
  }

  // ------------------ Data Loading ------------------
  loadChannelData(): void {
    this.loading = true;
    this.error = null;

    this.metricsService.getAllChannelMetrics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.rawData = data;
          const mapped = this.mapChannelData(data);
          this.dataSource.data = mapped;
          this.extractFilterOptions(data);
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load channel metrics';
          this.loading = false;
        }
      });
  }

  private mapChannelData(data: ChannelMetrics[]): ChannelMetrics[] {
    return data.map(item => ({
      ...item,
      formattedSessions: this.formatNumber(item.sessions),
      formattedSignups: this.formatNumber(item.signups),
      formattedConversionRate: this.formatPercentage(item.conversionRate),
      formattedDuration: this.formatDuration(item.avgSessionDurationSec),
      formattedBounceRate: this.formatPercentage(item.bounceRate ? item.bounceRate * 100 : null),
      formattedPagesPerSession: this.formatDecimal(item.pagesPerSession)
    }));
  }

  // ------------------ Filter Setup ------------------
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

    // Year filter
    this.yearControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.filterState.year = value || 'all';
        this.applyFilters();
      });

    // Month filter
    this.monthControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.filterState.month = value || 'all';
        this.applyFilters();
      });

    // Channel filter
    this.channelControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.filterState.channel = value || 'all';
        this.applyFilters();
      });
  }

  private createFilterPredicate() {
    return (data: ChannelMetrics, filter: string): boolean => {
      const filterObj: FilterState = JSON.parse(filter);
      const searchTerm = filterObj.search.toLowerCase();

      // Search match across all text fields
      const searchMatch = !searchTerm ||
        data.channel?.toLowerCase().includes(searchTerm) ||
        data.month?.toLowerCase().includes(searchTerm) ||
        data.sessions?.toString().includes(searchTerm) ||
        data.signups?.toString().includes(searchTerm);

      // Year filter
      let yearMatch = filterObj.year === 'all';
      if (!yearMatch && data.month) {
        const year = data.month.split('-')[0];
        yearMatch = year === filterObj.year;
      }

      // Month filter
      let monthMatch = filterObj.month === 'all';
      if (!monthMatch && data.month) {
        const month = data.month.split('-')[1];
        monthMatch = month === filterObj.month;
      }

      // Channel filter
      const channelMatch = filterObj.channel === 'all' || data.channel === filterObj.channel;

      return !!searchMatch && !!yearMatch && !!monthMatch && !!channelMatch;
    };
  }

  private applyFilters(): void {
    this.dataSource.filter = JSON.stringify(this.filterState);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // ------------------ Extract Filter Options ------------------
  private extractFilterOptions(data: ChannelMetrics[]): void {
    // Extract unique years from month field
    const yearSet = new Set<string>();
    data.forEach(item => {
      if (item.month) {
        const year = item.month.split('-')[0];
        yearSet.add(year);
      }
    });
    this.years = Array.from(yearSet).sort();

    // Extract unique channels
    this.channels = Array.from(new Set(data.map(d => d.channel || ''))).filter(Boolean).sort();
  }

  // ------------------ Formatting Methods ------------------
  formatNumber(value: number | undefined | null): string {
    if (value === undefined || value === null) return '-';
    return Math.round(value).toLocaleString('en-US');
  }

  formatPercentage(value: number | undefined | null): string {
    if (value === undefined || value === null) return '-';
    return `${value.toFixed(2)}%`;
  }

  formatDuration(seconds: number | undefined | null): string {
    if (seconds === undefined || seconds === null) return '-';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  formatDecimal(value: number | undefined | null): string {
    if (value === undefined || value === null) return '-';
    return value.toFixed(1);
  }

  formatMonth(value: string | undefined | null): string {
    if (!value) return '-';
    return value; // Already in YYYY-MM format
  }

  // ------------------ Action Methods ------------------
  clearSearch(): void {
    this.searchControl.setValue('');
  }

  resetFilters(): void {
    this.searchControl.setValue('');
    this.yearControl.setValue('all');
    this.monthControl.setValue('all');
    this.channelControl.setValue('all');
  }

  retry(): void {
    this.loadChannelData();
  }

  trackByChannel(index: number, item: ChannelMetrics) {
    return `${item.channel}-${item.month}`;
  }
}
```

---

## Step 4: Create HTML Template

**File**: [`src/app/features/channels/channels.component.html`](../src/app/features/channels/channels.component.html)

Replace the entire file content:

```html
<div class="channels-container">
  <div class="header">
    <h1>Channel Performance</h1>
  </div>

  <!-- Loading overlay -->
  <div *ngIf="loading" class="loading-overlay">
    <mat-spinner></mat-spinner>
    <p>Loading channel data...</p>
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
               placeholder="Search channels" 
               autocomplete="off">
        <button mat-icon-button matSuffix 
                *ngIf="searchControl.value" 
                (click)="clearSearch()">
          <mat-icon>close</mat-icon>
        </button>
      </mat-form-field>

      <div class="filter-controls">
        <mat-form-field appearance="outline">
          <mat-label>Year</mat-label>
          <mat-select [formControl]="yearControl">
            <mat-option value="all">All Years</mat-option>
            <mat-option *ngFor="let year of years" [value]="year">{{ year }}</mat-option>
          </mat-select>
          <mat-icon matPrefix>calendar_today</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Month</mat-label>
          <mat-select [formControl]="monthControl">
            <mat-option value="all">All Months</mat-option>
            <mat-option *ngFor="let month of months" [value]="month.value">{{ month.label }}</mat-option>
          </mat-select>
          <mat-icon matPrefix>date_range</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Channel</mat-label>
          <mat-select [formControl]="channelControl">
            <mat-option value="all">All Channels</mat-option>
            <mat-option *ngFor="let channel of channels" [value]="channel">{{ channel }}</mat-option>
          </mat-select>
          <mat-icon matPrefix>campaign</mat-icon>
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
        records
      </p>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table mat-table [dataSource]="dataSource" matSort 
             matSortActive="sessions" matSortDirection="desc" 
             class="channels-table">

        <!-- Month Column -->
        <ng-container matColumnDef="month">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Month</th>
          <td mat-cell *matCellDef="let row">{{ formatMonth(row.month) }}</td>
        </ng-container>

        <!-- Channel Column -->
        <ng-container matColumnDef="channel">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Channel</th>
          <td mat-cell *matCellDef="let row" class="channel-cell">
            <strong>{{ row.channel }}</strong>
          </td>
        </ng-container>

        <!-- Sessions Column -->
        <ng-container matColumnDef="sessions">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Sessions</th>
          <td mat-cell *matCellDef="let row">{{ row.formattedSessions }}</td>
        </ng-container>

        <!-- Signups Column -->
        <ng-container matColumnDef="signups">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Signups</th>
          <td mat-cell *matCellDef="let row">{{ row.formattedSignups }}</td>
        </ng-container>

        <!-- Conversion Rate Column -->
        <ng-container matColumnDef="conversionRate">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Conversion Rate</th>
          <td mat-cell *matCellDef="let row">{{ row.formattedConversionRate }}</td>
        </ng-container>

        <!-- Avg Session Duration Column -->
        <ng-container matColumnDef="avgSessionDurationSec">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Avg Duration</th>
          <td mat-cell *matCellDef="let row">{{ row.formattedDuration }}</td>
        </ng-container>

        <!-- Bounce Rate Column -->
        <ng-container matColumnDef="bounceRate">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Bounce Rate</th>
          <td mat-cell *matCellDef="let row">{{ row.formattedBounceRate }}</td>
        </ng-container>

        <!-- Pages Per Session Column -->
        <ng-container matColumnDef="pagesPerSession">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Pages/Session</th>
          <td mat-cell *matCellDef="let row">{{ row.formattedPagesPerSession }}</td>
        </ng-container>

        <!-- Header and rows -->
        <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
            class="table-row"
            [attr.data-channel]="row.channel"></tr>

        <!-- No data row -->
        <tr class="mat-row no-data-row" *matNoDataRow>
          <td class="mat-cell" [attr.colspan]="displayedColumns.length">
            <div class="no-data">
              <mat-icon>search_off</mat-icon>
              <p>No channels match your filters</p>
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
                   aria-label="Select page of channels">
    </mat-paginator>
  </div>
</div>
```

---

## Step 5: Add CSS Styling

**File**: [`src/app/features/channels/channels.component.css`](../src/app/features/channels/channels.component.css)

Replace the entire file content:

```css
.channels-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  margin-bottom: 24px;
}

.header h1 {
  font-size: 28px;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0;
}

/* Loading overlay */
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
  font-size: 14px;
}

/* Error state */
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
  color: #d32f2f;
}

.error-state p {
  color: #d32f2f;
  font-size: 16px;
  margin: 0;
}

/* Content */
.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content.hidden {
  display: none;
}

/* Filters section */
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
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.filter-controls mat-form-field {
  flex: 1;
  min-width: 180px;
}

.reset-button {
  height: 56px;
  white-space: nowrap;
}

/* Results info */
.results-info {
  padding: 8px 0;
}

.results-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.results-info strong {
  color: #1a1a1a;
  font-weight: 600;
}

/* Table container */
.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.channels-table {
  width: 100%;
  min-width: 900px;
}

/* Table header */
.channels-table th {
  background: #f5f5f5;
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
  padding: 16px;
  border-bottom: 2px solid #e0e0e0;
}

/* Table cells */
.channels-table td {
  padding: 16px;
  color: #333;
  font-size: 14px;
  border-bottom: 1px solid #e0e0e0;
}

/* Table rows */
.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f9f9f9;
  cursor: pointer;
}

/* Channel cell */
.channel-cell {
  font-weight: 500;
  color: #1976d2;
}

/* No data state */
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  text-align: center;
}

.no-data mat-icon {
  font-size: 48px;
  width: 48px;
  height: 48px;
  color: #999;
}

.no-data p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

/* Paginator */
mat-paginator {
  background: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Responsive design */
@media (max-width: 768px) {
  .channels-container {
    padding: 16px;
  }

  .header h1 {
    font-size: 24px;
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

  .table-container {
    border-radius: 4px;
  }

  .channels-table th,
  .channels-table td {
    padding: 12px 8px;
    font-size: 13px;
  }
}

/* Material overrides */
::ng-deep .mat-mdc-form-field {
  font-size: 14px;
}

::ng-deep .mat-mdc-text-field-wrapper {
  background-color: white;
}

::ng-deep .mat-sort-header-arrow {
  color: #1976d2;
}
```

---

## Testing Checklist

After implementation, verify the following:

### Data Loading
- [ ] Component loads data from API on init
- [ ] Loading spinner displays during data fetch
- [ ] Error message displays if API fails
- [ ] Retry button works after error

### Table Display
- [ ] All 8 columns display correctly
- [ ] Data formats correctly (numbers, percentages, duration)
- [ ] Table is scrollable horizontally on small screens
- [ ] Header row is sticky when scrolling

### Sorting
- [ ] All columns are sortable
- [ ] Default sort is Sessions (descending)
- [ ] Sort direction indicator works
- [ ] Sorting updates table correctly

### Filtering
- [ ] Search bar filters across all text fields
- [ ] Search has 300ms debounce
- [ ] Clear button appears when search has text
- [ ] Year filter works correctly
- [ ] Month filter works correctly
- [ ] Channel filter works correctly
- [ ] Multiple filters work together
- [ ] Reset button clears all filters

### Pagination
- [ ] Paginator displays correct page count
- [ ] Page size options work (10, 25, 50, 100)
- [ ] First/Last page buttons work
- [ ] Filtering resets to first page

### UI/UX
- [ ] Results count displays correctly
- [ ] "X of Y records" shows when filtered
- [ ] No data message shows when no matches
- [ ] Hover effect on table rows
- [ ] Responsive design works on mobile
- [ ] Icons display correctly

### Edge Cases
- [ ] Handles null/undefined values gracefully
- [ ] Empty data set displays properly
- [ ] Large data sets perform well
- [ ] Special characters in search work

---

## Common Issues & Solutions

### Issue: API returns 404
**Solution**: Verify the backend endpoint is running and accessible at `http://localhost:5090/api/Metrics/channels/all`

### Issue: Data not displaying
**Solution**: Check browser console for errors. Verify data structure matches interface.

### Issue: Filters not working
**Solution**: Ensure `filterPredicate` is set in `ngAfterViewInit` and filter state is properly updated.

### Issue: Sorting not working
**Solution**: Verify `MatSort` is imported and `@ViewChild` is properly connected in `ngAfterViewInit`.

### Issue: Pagination not working
**Solution**: Ensure `MatPaginator` is imported and connected to `dataSource.paginator` in `ngAfterViewInit`.

---

## Next Steps

After successful implementation:

1. Test with real API data
2. Verify all filters work independently and together
3. Test responsive design on different screen sizes
4. Consider adding export functionality
5. Consider adding chart visualizations
6. Add unit tests for component logic
7. Add e2e tests for user interactions
