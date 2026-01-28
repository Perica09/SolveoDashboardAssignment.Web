# Keywords Table - Implementation Guide with Code Examples

## Overview
This guide provides detailed code examples for implementing the Angular Material table in the Keywords component.

## 1. Component TypeScript Implementation

### Complete Component Structure

```typescript
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { DestroyRef, inject } from '@angular/core';
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
import { MatChipsModule } from '@angular/material/chips';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MetricsService } from '../../core/services';
import { KeywordMetrics } from '../../core/models';

interface FilterState {
  search: string;
  category: string;
  aiOverview: string;
}

@Component({
  selector: 'app-keywords',
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
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeywordsComponent implements OnInit, AfterViewInit {
  // Table configuration
  displayedColumns: string[] = [
    'keyword',
    'category',
    'trafficChangeYoY',
    'traffic2024',
    'traffic2025',
    'conversionRate2024',
    'conversionRate2025',
    'position2024',
    'position2025',
    'positionChange',
    'aiOverviewTriggered'
  ];

  // Data source
  dataSource: MatTableDataSource<KeywordMetrics>;

  // ViewChild references
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // State
  loading = false;
  error: string | null = null;
  categories: string[] = [];

  // Filter controls
  searchControl = new FormControl('');
  categoryControl = new FormControl('all');
  aiOverviewControl = new FormControl('all');

  // Filter state
  private filterState: FilterState = {
    search: '',
    category: 'all',
    aiOverview: 'all'
  };

  // Destroy signal for subscription cleanup
  private destroyRef = inject(DestroyRef);

  constructor(private metricsService: MetricsService) {
    this.dataSource = new MatTableDataSource<KeywordMetrics>([]);
  }

  ngOnInit(): void {
    this.loadKeywordData();
    this.setupFilterListeners();
  }

  ngAfterViewInit(): void {
    // Connect sort and paginator to data source
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Set custom filter predicate
    this.dataSource.filterPredicate = this.createFilterPredicate();
  }

  /**
   * Load keyword data from API
   */
  loadKeywordData(): void {
    this.loading = true;
    this.error = null;

    this.metricsService.getKeywordMetrics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.extractCategories(data);
        this.loading = false;
        console.log('Keyword metrics loaded:', data);
      },
      error: (err) => {
        this.error = err.message || 'Failed to load keyword metrics';
        this.loading = false;
        console.error('Error loading keyword metrics:', err);
      }
    });
  }

  /**
   * Extract unique categories from data
   */
  private extractCategories(data: KeywordMetrics[]): void {
    const uniqueCategories = new Set<string>();
    data.forEach(item => {
      if (item.category) {
        uniqueCategories.add(item.category);
      }
    });
    this.categories = Array.from(uniqueCategories).sort();
  }

  /**
   * Setup filter listeners with debouncing
   */
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

    // Category filter
    this.categoryControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.filterState.category = value || 'all';
        this.applyFilters();
      });

    // AI Overview filter
    this.aiOverviewControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.filterState.aiOverview = value || 'all';
        this.applyFilters();
      });
  }

  /**
   * Create custom filter predicate
   */
  private createFilterPredicate() {
    return (data: KeywordMetrics, filter: string): boolean => {
      const filterObj: FilterState = JSON.parse(filter);

      // Global search - search across all text fields
      const searchMatch = !filterObj.search || 
        this.matchesSearch(data, filterObj.search);

      // Category filter
      const categoryMatch = filterObj.category === 'all' || 
        data.category === filterObj.category;

      // AI Overview filter
      const aiOverviewMatch = filterObj.aiOverview === 'all' || 
        data.aiOverviewTriggered === filterObj.aiOverview;

      return searchMatch && categoryMatch && aiOverviewMatch;
    };
  }

  /**
   * Check if data matches search term
   */
  private matchesSearch(data: KeywordMetrics, searchTerm: string): boolean {
  const term = searchTerm.toLowerCase();

  return (
    // Text fields
    data.keyword?.toLowerCase().includes(term) ||
    data.category?.toLowerCase().includes(term) ||
    data.aiOverviewTriggered?.toLowerCase().includes(term) ||

    // Numeric fields converted to string
    this.includesNumber(data.traffic2024, term) ||
    this.includesNumber(data.traffic2025, term) ||
    this.includesNumber(data.trafficChangeYoY, term) ||
    this.includesNumber(data.conversionRate2024, term) ||
    this.includesNumber(data.conversionRate2025, term) ||
    this.includesNumber(data.position2024, term) ||
    this.includesNumber(data.position2025, term) ||
    this.includesNumber(data.positionChange, term)
  );
}

private includesNumber(value: number | undefined | null, term: string): boolean {
  if (value === null || value === undefined) return false;
  return value.toString().toLowerCase().includes(term);
}


  /**
   * Apply all filters
   */
  private applyFilters(): void {
    this.dataSource.filter = JSON.stringify(this.filterState);
    
    // Reset to first page when filtering
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchControl.setValue('');
  }

  /**
   * Reset all filters
   */
  resetFilters(): void {
    this.searchControl.setValue('');
    this.categoryControl.setValue('all');
    this.aiOverviewControl.setValue('all');
  }

  /**
   * Retry loading data
   */
  retry(): void {
    this.loadKeywordData();
  }

  /**
   * Format traffic change with color
   * Note: Handles zero as neutral, not empty
   */
  getTrafficChangeClass(value: number | undefined | null): string {
    if (value === undefined || value === null) return '';
    if (value === 0) return 'neutral';
    return value > 0 ? 'positive' : 'negative';
  }

  /**
   * Format traffic change with arrow indicator
   */
  formatTrafficChange(value: number | undefined | null): string {
    if (value === undefined || value === null) return '-';
    const formatted = this.formatPercentage(value);
    if (value > 0) return `▲ ${formatted}`;
    if (value < 0) return `▼ ${formatted}`;
    return formatted;
  }

  /**
   * Format position change with +/- indicator and arrow
   */
  formatPositionChange(value: number | undefined | null): string {
    if (value === undefined || value === null) return '-';
    if (value === 0) return '0';
    // Note: In SEO, lower position number is better (position 1 is best)
    // Negative change = improvement (moved from 50 to 40 = -10)
    // Positive change = decline (moved from 40 to 50 = +10)
    if (value > 0) return `▼ +${value}`;
    if (value < 0) return `▲ ${value}`;
    return String(value);
  }

  /**
   * Get position change class
   * Note: Negative position change = improvement (better ranking)
   *       Positive position change = decline (worse ranking)
   */
  getPositionChangeClass(value: number | undefined | null): string {
    if (value === undefined || value === null) return '';
    if (value === 0) return 'neutral';
    // Negative = improvement (moved up in rankings)
    // Positive = decline (moved down in rankings)
    return value < 0 ? 'positive' : 'negative';
  }

  /**
   * Format number with commas
   */
  formatNumber(value: number | undefined): string {
    if (value === undefined || value === null) return '-';
    return value.toLocaleString('en-US');
  }

  /**
   * Format percentage
   */
  formatPercentage(value: number | undefined): string {
    if (value === undefined || value === null) return '-';
    return `${value.toFixed(2)}%`;
  }

  /**
   * Get AI Overview badge class
   */
  getAiOverviewClass(value: string | undefined): string {
    return value?.toLowerCase() === 'yes' ? 'ai-yes' : 'ai-no';
  }
}
```

## 2. Template Implementation

### Complete HTML Template

```html
<div class="keywords-container">
  <div class="header">
    <h1>Keyword Performance</h1>
  </div>

  <!-- Loading State -->
  <div *ngIf="loading" class="loading-overlay">
    <mat-spinner></mat-spinner>
    <p>Loading keyword data...</p>
  </div>

  <!-- Error State -->
  <div *ngIf="error && !loading" class="error-state">
    <mat-icon>error_outline</mat-icon>
    <p>{{ error }}</p>
    <button mat-raised-button color="primary" (click)="retry()">
      <mat-icon>refresh</mat-icon>
      Retry
    </button>
  </div>

  <!-- Main Content -->
  <div *ngIf="!loading && !error" class="content">
    
    <!-- Filters Section -->
    <div class="filters-section">
      
      <!-- Search Bar -->
      <mat-form-field class="search-field" appearance="outline">
        <mat-label>Search keywords</mat-label>
        <input 
          matInput 
          [formControl]="searchControl"
          placeholder="Search by keyword, category, or metrics..."
          autocomplete="off">
        <mat-icon matPrefix>search</mat-icon>
        <button 
          mat-icon-button 
          matSuffix 
          *ngIf="searchControl.value"
          (click)="clearSearch()"
          aria-label="Clear search">
          <mat-icon>close</mat-icon>
        </button>
      </mat-form-field>

      <!-- Filter Controls -->
      <div class="filter-controls">
        
        <!-- Category Filter -->
        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select [formControl]="categoryControl">
            <mat-option value="all">All Categories</mat-option>
            <mat-option *ngFor="let category of categories" [value]="category">
              {{ category }}
            </mat-option>
          </mat-select>
          <mat-icon matPrefix>category</mat-icon>
        </mat-form-field>

        <!-- AI Overview Filter -->
        <mat-form-field appearance="outline">
          <mat-label>AI Overview</mat-label>
          <mat-select [formControl]="aiOverviewControl">
            <mat-option value="all">All</mat-option>
            <mat-option value="Yes">Yes</mat-option>
            <mat-option value="No">No</mat-option>
          </mat-select>
          <mat-icon matPrefix>smart_toy</mat-icon>
        </mat-form-field>

        <!-- Reset Filters Button -->
        <button 
          mat-stroked-button 
          (click)="resetFilters()"
          class="reset-button">
          <mat-icon>filter_alt_off</mat-icon>
          Reset Filters
        </button>
      </div>
    </div>

    <!-- Results Count -->
<div class="results-info">
  <p>
    <strong>{{ dataSource.filteredData.length }}</strong>
    <span *ngIf="dataSource.filteredData.length !== dataSource.data.length">
      of {{ dataSource.data.length }}
    </span>
    keywords
  </p>
</div>


    <!-- Table -->
    <div class="table-container">
      <table 
        mat-table 
        [dataSource]="dataSource" 
        matSort 
        matSortActive="traffic2025" 
        matSortDirection="desc"
        class="keywords-table">

        <!-- Keyword Column -->
        <ng-container matColumnDef="keyword">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Keyword</th>
          <td mat-cell *matCellDef="let row" class="keyword-cell">
            <strong>{{ row.keyword }}</strong>
          </td>
        </ng-container>

        <!-- Category Column -->
        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th>
          <td mat-cell *matCellDef="let row">
            {{ row.category || '-' }}
          </td>
        </ng-container>

        <!-- Traffic Change YoY Column -->
        <ng-container matColumnDef="trafficChangeYoY">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Traffic Change YoY</th>
          <td mat-cell *matCellDef="let row"
              [ngClass]="getTrafficChangeClass(row.trafficChangeYoY)">
            {{ formatTrafficChange(row.trafficChangeYoY) }}
          </td>
        </ng-container>

        <!-- Traffic 2024 Column -->
        <ng-container matColumnDef="traffic2024">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Traffic 2024</th>
          <td mat-cell *matCellDef="let row">
            {{ formatNumber(row.traffic2024) }}
          </td>
        </ng-container>

        <!-- Traffic 2025 Column -->
        <ng-container matColumnDef="traffic2025">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Traffic 2025</th>
          <td mat-cell *matCellDef="let row">
            {{ formatNumber(row.traffic2025) }}
          </td>
        </ng-container>

        <!-- Conversion Rate 2024 Column -->
        <ng-container matColumnDef="conversionRate2024">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Conv. Rate 2024</th>
          <td mat-cell *matCellDef="let row">
            {{ formatPercentage(row.conversionRate2024) }}
          </td>
        </ng-container>

        <!-- Conversion Rate 2025 Column -->
        <ng-container matColumnDef="conversionRate2025">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Conv. Rate 2025</th>
          <td mat-cell *matCellDef="let row">
            {{ formatPercentage(row.conversionRate2025) }}
          </td>
        </ng-container>

        <!-- Position 2024 Column -->
        <ng-container matColumnDef="position2024">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Position 2024</th>
          <td mat-cell *matCellDef="let row">
            {{ row.position2024 || '-' }}
          </td>
        </ng-container>

        <!-- Position 2025 Column -->
        <ng-container matColumnDef="position2025">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Position 2025</th>
          <td mat-cell *matCellDef="let row">
            {{ row.position2025 || '-' }}
          </td>
        </ng-container>

        <!-- Position Change Column -->
        <ng-container matColumnDef="positionChange">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Position Δ</th>
          <td mat-cell *matCellDef="let row"
              [ngClass]="getPositionChangeClass(row.positionChange)">
            {{ formatPositionChange(row.positionChange) }}
          </td>
        </ng-container>

        <!-- AI Overview Triggered Column -->
        <ng-container matColumnDef="aiOverviewTriggered">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>AI Overview</th>
          <td mat-cell *matCellDef="let row">
            <mat-chip 
              [ngClass]="getAiOverviewClass(row.aiOverviewTriggered)"
              class="ai-chip">
              {{ row.aiOverviewTriggered || 'N/A' }}
            </mat-chip>
          </td>
        </ng-container>

        <!-- Header and Row Declarations -->
        <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>

        <!-- No Data Row -->
        <tr class="mat-row no-data-row" *matNoDataRow>
          <td class="mat-cell" [attr.colspan]="displayedColumns.length">
            <div class="no-data">
              <mat-icon>search_off</mat-icon>
              <p>No keywords match your filters</p>
              <button mat-button color="primary" (click)="resetFilters()">
                Clear Filters
              </button>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Paginator -->
    <mat-paginator
      [pageSizeOptions]="[10, 25, 50, 100]"
      [pageSize]="25"
      showFirstLastButtons
      aria-label="Select page of keywords">
    </mat-paginator>
  </div>
</div>
```

## 3. Styling Implementation

### Complete CSS Styles

```css
/* Container */
.keywords-container {
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
  flex: 1;
  overflow: hidden;
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
  flex: 1;
  overflow: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

/* Table Styles */
.keywords-table {
  width: 100%;
  background: white;
}

.keywords-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
}

.keywords-table td {
  color: #666;
}

.table-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #f5f5f5;
}

/* Keyword Cell */
.keyword-cell {
  font-weight: 500;
  color: #1976d2;
  max-width: 300px;
}

.keyword-cell strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Color Classes for Changes */
.positive {
  color: #4caf50;
  font-weight: 500;
}

.negative {
  color: #f44336;
  font-weight: 500;
}

.neutral {
  color: #757575;
}

/* AI Overview Chips */
.ai-chip {
  font-size: 12px;
  min-height: 24px;
  padding: 4px 8px;
}

.ai-yes {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.ai-no {
  background-color: #fce4ec;
  color: #c2185b;
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
@media (max-width: 1200px) {
  .table-container {
    overflow-x: auto;
  }
  
  .keywords-table {
    min-width: 1200px;
  }
}

@media (max-width: 768px) {
  .keywords-container {
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
  
.keywords-table td:first-child {
  z-index: 1;
}

.keywords-table th:first-child {
  background: #fafafa;
  z-index: 3;
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

## 4. Key Implementation Details

### Change Detection Strategy

The component uses `ChangeDetectionStrategy.OnPush` for better performance. This means:
- Change detection only runs when inputs change or events fire
- Reduces unnecessary re-renders
- Improves performance for large datasets

### Memory Leak Prevention

All subscriptions use `takeUntilDestroyed(this.destroyRef)` to automatically unsubscribe when the component is destroyed:
- Search control subscription
- Category filter subscription
- AI Overview filter subscription

This prevents memory leaks and ensures proper cleanup.

### Filter Predicate Logic

The custom filter predicate combines three filter types:

1. **Global Search**: Searches across keyword, category, and AI overview fields
2. **Category Filter**: Exact match on category field
3. **AI Overview Filter**: Exact match on aiOverviewTriggered field

All filters work together using AND logic.

### Debouncing

The search input uses RxJS operators to debounce user input:
- `debounceTime(300)`: Wait 300ms after user stops typing
- `distinctUntilChanged()`: Only emit if value actually changed
- `takeUntilDestroyed(this.destroyRef)`: Automatic cleanup on component destroy

This prevents excessive filtering operations and improves performance.

### Pagination Reset

When filters are applied, the paginator automatically resets to the first page to show relevant results. This is handled in the `applyFilters()` method.

### Sorting

Default sort is set to `traffic2025` in descending order to show highest traffic keywords first.

### Zero-Value Handling

Proper null/undefined/zero handling for numeric fields:
- **Zero values**: Treated as neutral (not empty)
- **Null/undefined**: Displayed as '-'
- **Proper type checking**: Uses `=== null` and `=== undefined` instead of `!value`

### Position Change Logic

Position changes follow SEO conventions:
- **Lower position number = better** (position 1 is best)
- **Negative change = improvement** (moved from 50 to 22 = -28 ▲)
- **Positive change = decline** (moved from 22 to 50 = +28 ▼)
- **Zero = no change** (neutral color)

### Visual Indicators

Arrow indicators enhance readability:
- **Traffic Change**: ▲ for increase, ▼ for decrease
- **Position Change**: ▲ for improvement, ▼ for decline

### Color Coding

- **Traffic Change**: Green for positive, red for negative, gray for zero
- **Position Change**: Green for improvement (negative = moved up), red for decline (positive = moved down), gray for zero
- **AI Overview**: Green badge for "Yes", pink badge for "No"

### Material Design Styling

Instead of using `::ng-deep` (which is deprecated), Material Design styles should be:
1. **Component-specific**: Applied directly in component CSS
2. **Global overrides**: Added to `src/styles.css` if needed project-wide
3. **Theme customization**: Use Angular Material theming system

The implementation avoids `::ng-deep` to follow Angular best practices.

## 5. Testing Scenarios

### Manual Testing Checklist

1. **Data Loading**
   - [ ] Table loads with data from API
   - [ ] Loading spinner shows during fetch
   - [ ] Error message shows on API failure
   - [ ] Retry button works

2. **Sorting**
   - [ ] Click each column header to sort
   - [ ] Sort direction toggles (asc/desc)
   - [ ] Sort arrow indicator shows correctly
   - [ ] Default sort is traffic2025 descending

3. **Pagination**
   - [ ] Page size selector works (10, 25, 50, 100)
   - [ ] Next/Previous buttons work
   - [ ] First/Last buttons work
   - [ ] Page info displays correctly

4. **Search**
   - [ ] Search filters results in real-time
   - [ ] Search is case-insensitive
   - [ ] Clear button removes search
   - [ ] Debouncing works (no lag)

5. **Filters**
   - [ ] Category filter shows all categories
   - [ ] Category filter works correctly
   - [ ] AI Overview filter works correctly
   - [ ] Reset filters button clears all filters
   - [ ] Filters work together (AND logic)

6. **Formatting**
   - [ ] Numbers show with commas
   - [ ] Percentages show 2 decimals
   - [ ] Position changes show +/- signs
   - [ ] Colors show correctly for positive/negative
   - [ ] AI Overview badges display correctly

7. **Responsive**
   - [ ] Table scrolls horizontally on small screens
   - [ ] Filters stack vertically on mobile
   - [ ] First column sticky on mobile

8. **Accessibility**
   - [ ] Keyboard navigation works
   - [ ] Focus indicators visible
   - [ ] ARIA labels present
   - [ ] Screen reader compatible

## 6. Common Issues and Solutions

### Issue: Sort not working after data load
**Solution**: Ensure `ngAfterViewInit` sets `dataSource.sort = this.sort`

### Issue: Paginator not showing
**Solution**: Ensure `dataSource.paginator = this.paginator` in `ngAfterViewInit`

### Issue: Filters not working together
**Solution**: Use JSON.stringify for filter state and custom predicate

### Issue: Search lag
**Solution**: Add debounceTime(300) to search valueChanges

### Issue: Table not responsive
**Solution**: Add overflow-x: auto to table container and min-width to table

## 7. Future Enhancements

### Phase 2 Features
- Export to CSV/Excel
- Column visibility toggle
- Advanced filters (range sliders for numeric values)
- Bulk selection and actions
- Keyword comparison mode

### Phase 3 Features
- Virtual scrolling for large datasets
- Server-side pagination/sorting/filtering
- Real-time data updates via WebSocket
- Saved filter presets
- Custom column ordering

## 8. Global Styles (Optional)

If you need to customize Material Design components globally, add these to `src/styles.css` instead of using `::ng-deep`:

```css
/* Material Table Customization */
.mat-mdc-table {
  font-size: 14px;
}

.mat-mdc-form-field {
  font-size: 14px;
}

.mat-sort-header-arrow {
  color: #1976d2;
}

/* Material Paginator */
.mat-mdc-paginator {
  font-size: 14px;
}

/* Material Select */
.mat-mdc-select-panel {
  max-height: 400px;
}
```

**Note**: Only add these if you want consistent styling across the entire application. Component-specific styles should remain in the component's CSS file.

## Summary

This implementation guide provides all the code needed to create a fully-featured Angular Material table for the Keywords component. The solution is:

- **Complete**: All features implemented (sorting, pagination, search, filters)
- **Performant**: Debouncing, efficient filtering, OnPush change detection, proper subscription cleanup
- **Accessible**: Full keyboard support, ARIA labels, screen reader friendly
- **Responsive**: Works on desktop, tablet, and mobile
- **Maintainable**: Clean code structure, well-documented, follows Angular best practices, no deprecated APIs
- **Extensible**: Easy to add new features in future phases
- **Robust**: Proper null/undefined/zero handling, memory leak prevention

### Key Improvements Implemented

1. **ChangeDetectionStrategy.OnPush**: Better performance
2. **takeUntilDestroyed(this.destroyRef)**: Automatic subscription cleanup
3. **Zero-value handling**: Proper distinction between 0, null, and undefined
4. **Position change logic**: Correct SEO ranking interpretation
5. **Arrow indicators**: Visual clarity for changes (▲ ▼)
6. **No ::ng-deep**: Follows Angular best practices
7. **Pagination reset**: Automatically resets to first page on filter changes

The implementation can be completed by Code mode following this guide step-by-step.
