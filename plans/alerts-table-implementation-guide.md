# Alerts Table Implementation Guide

## Overview
This guide provides step-by-step instructions for implementing the Alerts table transformation. Follow these steps in order for a smooth implementation.

## Prerequisites
- Review [`alerts-table-architecture.md`](./alerts-table-architecture.md) for design decisions
- Ensure Angular Material is installed (already in project)
- Familiarize yourself with [`channels.component.ts`](../src/app/features/channels/channels.component.ts) as reference

## Implementation Checklist

### Step 1: Update Component Imports
**File**: [`alerts.component.ts`](../src/app/features/alerts/alerts.component.ts)

Add the following imports:
```typescript
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
import { ViewChild, AfterViewInit, ChangeDetectorRef, inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
```

Update component decorator imports array:
```typescript
imports: [
  CommonModule,
  FormsModule, // Keep for category dropdown
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
]
```

### Step 2: Define Component State and Configuration

Add these properties to the component class:

```typescript
// Table configuration
readonly displayedColumns: string[] = [
  'severity',
  'message',
  'alertType',
  'recommendedAction',
  'detectedAt'
];

// Data source
dataSource = new MatTableDataSource<Alert>([]);

// Reactive state using signals
loading = signal(false);
error = signal<string | null>(null);

// Severity configuration
readonly severities: Array<'Critical' | 'High' | 'Medium' | 'Low'> = [
  'Critical',
  'High',
  'Medium',
  'Low'
];

severityCounts = signal<Record<string, number>>({
  Critical: 0,
  High: 0,
  Medium: 0,
  Low: 0
});

// Filter state
activeSeverity = signal<string | null>(null);
readonly searchControl = new FormControl('', { nonNullable: true });

// ViewChild references
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatPaginator) paginator!: MatPaginator;

// Dependency injection
private readonly destroyRef = inject(DestroyRef);
private readonly cdr = inject(ChangeDetectorRef);
```

### Step 3: Implement Lifecycle Hooks

Update `ngOnInit` and add `ngAfterViewInit`:

```typescript
ngOnInit(): void {
  this.loadAlerts();
  this.setupSearchListener();
}

ngAfterViewInit(): void {
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
  this.paginator.pageSize = 10;
  this.dataSource.filterPredicate = this.createFilterPredicate();
  this.dataSource.sortingDataAccessor = this.createSortingAccessor();
  this.cdr.markForCheck();
}
```

### Step 4: Update Data Loading Logic

Refactor the `loadAlerts` method to use the new state management:

```typescript
loadAlerts(): void {
  this.loading.set(true);
  this.error.set(null);

  // Determine which API call to make based on selectedAlertType
  const apiCall = this.getApiCallForAlertType();

  apiCall
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.calculateSeverityCounts(data);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load alerts');
        this.loading.set(false);
        this.cdr.markForCheck();
      }
    });
}

private getApiCallForAlertType() {
  switch (this.selectedAlertType) {
    case 'high-traffic':
      return this.alertsService.getHighTrafficLowConversion({ 
        minTraffic: 2000, 
        maxConversion: 1.5 
      });
    case 'ai-cannibalization':
      return this.alertsService.getAiOverviewCannibalization({ 
        minDeclinePercentage: 10.0 
      });
    case 'regional':
      return this.alertsService.getRegionalUnderperformance(this.dateRange);
    case 'seasonal':
      return this.alertsService.getSeasonalDips(this.dateRange);
    case 'channel-waste':
      return this.alertsService.getChannelWaste({
        maxConversion: 2.0,
        minSessions: 10000,
        ...this.dateRange
      });
    default:
      return this.alertsService.getAlerts(this.dateRange);
  }
}
```

### Step 5: Implement Severity Count Calculation

```typescript
private calculateSeverityCounts(alerts: Alert[]): void {
  const counts = alerts.reduce((acc, alert) => {
    acc[alert.severity] = (acc[alert.severity] || 0) + 1;
    return acc;
  }, {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0
  } as Record<string, number>);
  
  this.severityCounts.set(counts);
}
```

### Step 6: Implement Filter Logic

```typescript
private setupSearchListener(): void {
  this.searchControl.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(() => {
      this.applyFilters();
    });
}

private createFilterPredicate(): (alert: Alert, filter: string) => boolean {
  return (alert: Alert, filter: string): boolean => {
    const filterObj = JSON.parse(filter);
    
    // Severity filter
    const severityMatch = !filterObj.severity || 
      alert.severity === filterObj.severity;
    
    // Search filter
    const searchTerm = filterObj.search.toLowerCase();
    const searchMatch = !searchTerm ||
      alert.message.toLowerCase().includes(searchTerm) ||
      (alert.alertType || '').toLowerCase().includes(searchTerm) ||
      (alert.recommendedAction || '').toLowerCase().includes(searchTerm) ||
      (alert.entity || '').toLowerCase().includes(searchTerm);
    
    return severityMatch && searchMatch;
  };
}

private applyFilters(): void {
  const filterValue = JSON.stringify({
    severity: this.activeSeverity(),
    search: this.searchControl.value
  });
  
  this.dataSource.filter = filterValue;
  
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

filterBySeverity(severity: string): void {
  if (this.activeSeverity() === severity) {
    this.activeSeverity.set(null);
  } else {
    this.activeSeverity.set(severity);
  }
  this.applyFilters();
}

clearSeverityFilter(): void {
  this.activeSeverity.set(null);
  this.applyFilters();
}

clearSearch(): void {
  this.searchControl.setValue('');
}

resetFilters(): void {
  this.searchControl.setValue('');
  this.activeSeverity.set(null);
  this.selectedAlertType = 'all';
  this.loadAlerts();
}
```

### Step 7: Implement Sorting Logic

```typescript
private createSortingAccessor(): (alert: Alert, property: string) => string | number {
  return (alert: Alert, property: string): string | number => {
    switch (property) {
      case 'severity':
        const severityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
        return severityOrder[alert.severity];
      case 'detectedAt':
        return new Date(alert.detectedAt).getTime();
      case 'message':
        return alert.message;
      case 'alertType':
        return alert.alertType || '';
      case 'recommendedAction':
        return alert.recommendedAction || '';
      default:
        return '';
    }
  };
}
```

### Step 8: Add Formatting Helper Methods

```typescript
getSeverityIcon(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical': return '🔴';
    case 'high': return '🟠';
    case 'medium': return '🟡';
    case 'low': return '🔵';
    default: return '⚪';
  }
}

formatDate(timestamp: string): string {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

formatAlertType(alertType?: string): string {
  if (!alertType) return '-';
  return alertType
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase());
}

truncateText(text: string | undefined, maxLength: number = 100): string {
  if (!text) return '-';
  return text.length > maxLength 
    ? text.substring(0, maxLength) + '...' 
    : text;
}

trackByAlert(index: number, alert: Alert): string {
  return `${alert.severity}-${alert.detectedAt}-${alert.message}`;
}
```

### Step 9: Update Component Template

**File**: [`alerts.component.html`](../src/app/features/alerts/alerts.component.html)

Replace the entire template with:

```html
<div class="alerts-container">
  <div class="header">
    <h1>Alerts</h1>
    <p class="subtitle">Monitor and manage system alerts</p>
  </div>

  <!-- Loading overlay -->
  <div *ngIf="loading()" class="loading-overlay">
    <mat-spinner></mat-spinner>
    <p>Loading alerts...</p>
  </div>

  <!-- Error state -->
  <div *ngIf="error() && !loading()" class="error-state">
    <mat-icon>error_outline</mat-icon>
    <p>{{ error() }}</p>
    <button mat-raised-button color="primary" (click)="retry()">
      <mat-icon>refresh</mat-icon> Retry
    </button>
  </div>

  <!-- Content -->
  <div class="content" [class.hidden]="loading() || error()">

    <!-- Severity Filters -->
    <div class="severity-filters">
      <button 
        *ngFor="let severity of severities"
        class="severity-filter-btn"
        [class.active]="activeSeverity() === severity"
        [class]="'severity-' + severity.toLowerCase()"
        (click)="filterBySeverity(severity)"
        mat-stroked-button>
        <span class="severity-icon">{{ getSeverityIcon(severity) }}</span>
        <span class="severity-label">{{ severity }}</span>
        <span class="severity-count">({{ severityCounts()[severity] }})</span>
      </button>
      <button 
        *ngIf="activeSeverity()"
        class="clear-severity-btn"
        (click)="clearSeverityFilter()"
        mat-button>
        <mat-icon>clear</mat-icon> Clear Filter
      </button>
    </div>

    <!-- Search and Category Filters -->
    <div class="filters-section">
      <mat-form-field class="search-field" appearance="outline">
        <mat-icon matIconPrefix>search</mat-icon>
        <input matInput [formControl]="searchControl" 
               placeholder="Search alerts" 
               autocomplete="off">
        <button mat-icon-button matSuffix 
                *ngIf="searchControl.value" 
                (click)="clearSearch()">
          <mat-icon>close</mat-icon>
        </button>
      </mat-form-field>

      <mat-form-field appearance="outline" class="category-field">
        <mat-label>Alert Category</mat-label>
        <mat-select [(ngModel)]="selectedAlertType" (selectionChange)="onAlertTypeChange()">
          <mat-option *ngFor="let type of alertTypes" [value]="type.value">
            {{ type.label }}
          </mat-option>
        </mat-select>
        <mat-icon matPrefix>category</mat-icon>
      </mat-form-field>

      <button mat-stroked-button (click)="resetFilters()" class="reset-button">
        <mat-icon>filter_alt_off</mat-icon> Reset Filters
      </button>
    </div>

    <!-- Results info -->
    <div class="results-info">
      <p>
        <strong>{{ dataSource.filteredData.length }}</strong>
        <span *ngIf="dataSource.filteredData.length !== dataSource.data.length">
          of {{ dataSource.data.length }}
        </span>
        alerts
      </p>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table mat-table [dataSource]="dataSource" matSort 
             matSortActive="detectedAt" matSortDirection="desc" 
             class="alerts-table">

        <!-- Severity Column -->
        <ng-container matColumnDef="severity">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Severity</th>
          <td mat-cell *matCellDef="let alert" class="severity-cell">
            <span class="severity-badge" [class]="'severity-' + alert.severity.toLowerCase()">
              <span class="severity-icon">{{ getSeverityIcon(alert.severity) }}</span>
              <span class="severity-text">{{ alert.severity }}</span>
            </span>
          </td>
        </ng-container>

        <!-- Message Column -->
        <ng-container matColumnDef="message">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Message</th>
          <td mat-cell *matCellDef="let alert" class="message-cell">
            <strong>{{ truncateText(alert.message, 80) }}</strong>
          </td>
        </ng-container>

        <!-- Alert Type Column -->
        <ng-container matColumnDef="alertType">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
          <td mat-cell *matCellDef="let alert" class="type-cell">
            <span class="type-badge">{{ formatAlertType(alert.alertType) }}</span>
          </td>
        </ng-container>

        <!-- Recommended Action Column -->
        <ng-container matColumnDef="recommendedAction">
          <th mat-header-cell *matHeaderCellDef>Recommended Action</th>
          <td mat-cell *matCellDef="let alert" class="action-cell">
            {{ truncateText(alert.recommendedAction, 60) }}
          </td>
        </ng-container>

        <!-- Detected At Column -->
        <ng-container matColumnDef="detectedAt">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Detected At</th>
          <td mat-cell *matCellDef="let alert" class="date-cell">
            {{ formatDate(alert.detectedAt) }}
          </td>
        </ng-container>

        <!-- Header and rows -->
        <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
        <tr mat-row *matRowDef="let alert; columns: displayedColumns;" 
            class="alert-row"
            [class]="'severity-' + alert.severity.toLowerCase()"
            [attr.data-severity]="alert.severity"></tr>

        <!-- No data row -->
        <tr class="mat-row no-data-row" *matNoDataRow>
          <td class="mat-cell" [attr.colspan]="displayedColumns.length">
            <div class="no-data">
              <mat-icon>search_off</mat-icon>
              <p>No alerts match your filters</p>
              <button mat-button color="primary" (click)="resetFilters()">Clear Filters</button>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Paginator -->
    <mat-paginator [pageSizeOptions]="[10, 25, 50]" 
                   [pageSize]="10" 
                   showFirstLastButtons 
                   aria-label="Select page of alerts">
    </mat-paginator>
  </div>
</div>
```

### Step 10: Create Component Styles

**File**: [`alerts.component.css`](../src/app/features/alerts/alerts.component.css)

```css
.alerts-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  margin-bottom: 24px;
}

.header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.subtitle {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* Loading and Error States */
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

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  background: #fff3f3;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
}

.error-state mat-icon {
  font-size: 48px;
  width: 48px;
  height: 48px;
  color: #d32f2f;
}

.error-state p {
  color: #d32f2f;
  font-size: 14px;
  margin: 0;
}

.content.hidden {
  display: none;
}

/* Severity Filters */
.severity-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
}

.severity-filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 2px solid transparent;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.severity-filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.severity-filter-btn.active {
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.severity-filter-btn.severity-critical {
  border-color: #d32f2f;
}

.severity-filter-btn.severity-critical.active {
  background: #ffebee;
  border-color: #d32f2f;
}

.severity-filter-btn.severity-high {
  border-color: #f57c00;
}

.severity-filter-btn.severity-high.active {
  background: #fff3e0;
  border-color: #f57c00;
}

.severity-filter-btn.severity-medium {
  border-color: #fbc02d;
}

.severity-filter-btn.severity-medium.active {
  background: #fffde7;
  border-color: #fbc02d;
}

.severity-filter-btn.severity-low {
  border-color: #1976d2;
}

.severity-filter-btn.severity-low.active {
  background: #e3f2fd;
  border-color: #1976d2;
}

.severity-icon {
  font-size: 16px;
  line-height: 1;
}

.severity-label {
  font-weight: 500;
}

.severity-count {
  color: #666;
  font-size: 13px;
}

.clear-severity-btn {
  color: #666;
}

/* Filters Section */
.filters-section {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.search-field {
  flex: 1;
  min-width: 300px;
}

.category-field {
  min-width: 250px;
}

.reset-button {
  margin-top: 8px;
}

/* Results Info */
.results-info {
  margin-bottom: 16px;
  padding: 8px 0;
}

.results-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.results-info strong {
  color: #333;
  font-size: 16px;
}

/* Table Container */
.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 16px;
}

.alerts-table {
  width: 100%;
}

/* Table Header */
.alerts-table th {
  background: #f5f5f5;
  font-weight: 600;
  color: #333;
  padding: 16px;
  border-bottom: 2px solid #e0e0e0;
}

/* Table Rows */
.alert-row {
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
}

.alert-row:hover {
  background-color: #fafafa;
  transform: translateX(2px);
}

.alert-row.severity-critical {
  border-left-color: #d32f2f;
}

.alert-row.severity-high {
  border-left-color: #f57c00;
}

.alert-row.severity-medium {
  border-left-color: #fbc02d;
}

.alert-row.severity-low {
  border-left-color: #1976d2;
}

/* Table Cells */
.alerts-table td {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.severity-cell {
  width: 120px;
}

.severity-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
}

.severity-badge.severity-critical {
  background: #ffebee;
  color: #d32f2f;
}

.severity-badge.severity-high {
  background: #fff3e0;
  color: #f57c00;
}

.severity-badge.severity-medium {
  background: #fffde7;
  color: #f9a825;
}

.severity-badge.severity-low {
  background: #e3f2fd;
  color: #1976d2;
}

.message-cell {
  max-width: 300px;
}

.message-cell strong {
  color: #333;
  font-size: 14px;
  line-height: 1.4;
}

.type-cell {
  width: 180px;
}

.type-badge {
  display: inline-block;
  padding: 4px 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 500;
}

.action-cell {
  color: #666;
  font-size: 13px;
  line-height: 1.4;
  max-width: 250px;
}

.date-cell {
  width: 160px;
  color: #666;
  font-size: 13px;
  white-space: nowrap;
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
  padding: 40px 20px;
  gap: 12px;
}

.no-data mat-icon {
  font-size: 48px;
  width: 48px;
  height: 48px;
  color: #999;
}

.no-data p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

/* Paginator */
::ng-deep .mat-mdc-paginator {
  background: white;
  border-radius: 0 0 8px 8px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .table-container {
    overflow-x: auto;
  }
  
  .alerts-table {
    min-width: 900px;
  }
}

@media (max-width: 768px) {
  .alerts-container {
    padding: 16px;
  }
  
  .header h1 {
    font-size: 24px;
  }
  
  .severity-filters {
    gap: 8px;
  }
  
  .severity-filter-btn {
    font-size: 12px;
    padding: 6px 12px;
  }
  
  .filters-section {
    flex-direction: column;
  }
  
  .search-field,
  .category-field {
    width: 100%;
    min-width: unset;
  }
}
```

### Step 11: Testing Checklist

After implementation, verify the following:

- [ ] Table displays all alerts correctly
- [ ] Pagination works (10 items per page)
- [ ] Search filters alerts across all fields
- [ ] Severity filter buttons show correct counts
- [ ] Clicking severity filter shows only those alerts
- [ ] Active severity filter has visual indication
- [ ] Clear severity filter button works
- [ ] Category dropdown still works
- [ ] Sorting works on all sortable columns
- [ ] Severity sorts in correct order (Critical > High > Medium > Low)
- [ ] Date sorts chronologically
- [ ] Loading state displays correctly
- [ ] Error state displays with retry button
- [ ] Empty state displays when no alerts match filters
- [ ] Reset filters button clears all filters
- [ ] Table rows have correct severity border colors
- [ ] Hover effects work on table rows
- [ ] Responsive design works on mobile
- [ ] All icons display correctly
- [ ] Severity badges have correct colors

### Step 12: Final Cleanup

1. Remove old card-based HTML from template
2. Remove unused CSS from old implementation
3. Remove debug section if present
4. Update any comments in the code
5. Verify no console errors
6. Test with different data scenarios:
   - Empty alerts list
   - Single alert
   - Many alerts (100+)
   - All same severity
   - Mixed severities

## Common Issues and Solutions

### Issue: Table not displaying data
**Solution**: Check that `ngAfterViewInit` is properly setting up the data source connections

### Issue: Filters not working
**Solution**: Verify filter predicate is correctly parsing the JSON filter string

### Issue: Sorting not working correctly
**Solution**: Check the `sortingDataAccessor` implementation for the specific column

### Issue: Pagination not resetting on filter
**Solution**: Ensure `applyFilters()` calls `paginator.firstPage()`

### Issue: Severity counts not updating
**Solution**: Verify `calculateSeverityCounts()` is called after data loads

### Issue: Search debounce not working
**Solution**: Check that `takeUntilDestroyed` is properly configured with `destroyRef`

## Performance Optimization Tips

1. Use `trackBy` function for table rows
2. Use `OnPush` change detection strategy
3. Use signals for reactive state
4. Debounce search input (300ms)
5. Limit initial page size to 10 items
6. Use Material's built-in virtual scrolling if needed for very large datasets

## Accessibility Checklist

- [ ] All buttons have proper ARIA labels
- [ ] Table has proper semantic structure
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces filter changes
- [ ] Focus management is correct
- [ ] Color contrast meets WCAG standards

## Next Steps

After completing this implementation:
1. Test thoroughly with real data
2. Gather user feedback
3. Consider adding export functionality
4. Consider adding alert details modal
5. Consider adding bulk actions
6. Consider adding auto-refresh capability
