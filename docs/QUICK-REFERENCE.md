# Quick Reference Guide

Fast lookup for common tasks and patterns in the Solveo Dashboard Angular application.

## 📋 Table of Contents

- [Project Commands](#project-commands)
- [Common Imports](#common-imports)
- [API Endpoints](#api-endpoints)
- [Component Selectors](#component-selectors)
- [Common Patterns](#common-patterns)
- [Useful Snippets](#useful-snippets)

---

## Project Commands

### Development

```bash
# Start development server
npm start
# or
ng serve

# Start with specific port
ng serve --port 4300

# Start with open browser
ng serve --open
```

### Build

```bash
# Development build
npm run build
# or
ng build

# Production build
ng build --configuration production

# Build with stats
ng build --stats-json
```

### Testing

```bash
# Run tests
npm test
# or
ng test

# Run tests with coverage
ng test --code-coverage

# Run tests in headless mode
ng test --browsers=ChromeHeadless --watch=false
```

### Code Quality

```bash
# Lint code
ng lint

# Format code (if prettier is configured)
npm run format
```

---

## Common Imports

### Core Modules

```typescript
// Angular Core
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

// RxJS
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
```

### Material Modules

```typescript
// Material Table
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';

// Material Form Fields
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// Material UI
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
```

### Application Services & Models

```typescript
// Services
import { MetricsService, AlertsService } from '@app/core/services';

// Models
import { 
  Alert, 
  KeywordMetrics, 
  RegionalMetrics,
  ChannelMonthlyMetrics,
  DashboardState,
  TableColumn 
} from '@app/core/models';

// Shared Components
import { MetricCardComponent } from '@app/shared/components/metric-card/metric-card.component';
import { LineChartComponent } from '@app/shared/components/line-chart/line-chart.component';
import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
```

---

## API Endpoints

### Metrics Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getLatestMonthlyMetrics()` | `GET /api/Metrics/monthly/latest` | Latest monthly metrics |
| `getMonthlyMetrics(params)` | `GET /api/Metrics/monthly` | Monthly metrics with filters |
| `getMrrHistory(months)` | `GET /api/Metrics/mrr-history?months={months}` | MRR history |
| `getAllRegionalPerformance()` | `GET /api/Metrics/regional/all` | All regional metrics |
| `getAllChannelMetrics()` | `GET /api/Metrics/channels/all` | All channel metrics |
| `getKeywordMetrics(params)` | `GET /api/Metrics/keywords` | Keyword performance |

### Alerts Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getAlerts(params)` | `GET /api/Alerts` | All alerts |
| `getHighTrafficLowConversion(params)` | `GET /api/Alerts/high-traffic-low-conversion` | High traffic alerts |
| `getAiOverviewCannibalization(params)` | `GET /api/Alerts/ai-overview-cannibalization` | AI cannibalization alerts |
| `getRegionalUnderperformance(params)` | `GET /api/Alerts/regional-underperformance` | Regional alerts |
| `getSeasonalDips(params)` | `GET /api/Alerts/seasonal-dips` | Seasonal dip alerts |
| `getChannelWaste(params)` | `GET /api/Alerts/channel-waste` | Channel waste alerts |

---

## Component Selectors

### Core Components

```html
<app-header></app-header>
```

### Feature Components

```html
<app-dashboard></app-dashboard>
<app-keywords></app-keywords>
<app-regions></app-regions>
<app-channels></app-channels>
<app-alerts></app-alerts>
```

### Shared Components

```html
<!-- Metric Card -->
<app-metric-card
  title="Total Revenue"
  [value]="50000"
  format="currency"
  [growth]="12.5"
  trend="up"
></app-metric-card>

<!-- Line Chart -->
<app-line-chart
  [data]="chartData"
  labelKey="month"
  valueKey="value"
  title="MRR Growth"
  color="#4caf50"
></app-line-chart>

<!-- Funnel Chart -->
<app-funnel-chart
  [data]="funnelData"
  title="Conversion Funnel"
></app-funnel-chart>

<!-- Data Table -->
<app-data-table
  [data]="tableData"
  [columns]="columns"
  title="Keywords"
  [maxRows]="10"
></app-data-table>

<!-- Alert Badge -->
<app-alert-badge
  [alert]="alert"
  [compact]="false"
></app-alert-badge>
```

---

## Common Patterns

### Component with Service

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsService } from '@app/core/services';
import { KeywordMetrics } from '@app/core/models';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error">{{ error }}</div>
    <div *ngIf="!loading && !error">
      <div *ngFor="let item of data">{{ item.keyword }}</div>
    </div>
  `
})
export class ExampleComponent implements OnInit {
  data: KeywordMetrics[] = [];
  loading = false;
  error: string | null = null;

  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.metricsService.getKeywordMetrics()
      .subscribe({
        next: (data) => {
          this.data = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message;
          this.loading = false;
        }
      });
  }
}
```

### Material Table Setup

```typescript
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-table-example',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule],
  template: `
    <table mat-table [dataSource]="dataSource" matSort>
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
        <td mat-cell *matCellDef="let row">{{ row.name }}</td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    <mat-paginator [pageSizeOptions]="[5, 10, 25]"></mat-paginator>
  `
})
export class TableExampleComponent implements AfterViewInit {
  displayedColumns = ['name', 'value'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
```

### Reactive Form with Debounce

```typescript
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <input [formControl]="searchControl" placeholder="Search...">
  `
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        console.log('Search:', value);
      });
  }
}
```

### Signal-based State

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-signals',
  standalone: true,
  template: `
    <div>Count: {{ count() }}</div>
    <div>Double: {{ doubleCount() }}</div>
    <button (click)="increment()">Increment</button>
  `
})
export class SignalsComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  increment(): void {
    this.count.update(value => value + 1);
  }
}
```

---

## Useful Snippets

### Format Number

```typescript
formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return value.toLocaleString('en-US');
}
```

### Format Currency

```typescript
formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
```

### Format Percentage

```typescript
formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return `${value.toFixed(2)}%`;
}
```

### Format Date

```typescript
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
```

### Build HTTP Params

```typescript
import { HttpParams } from '@angular/common/http';

function buildHttpParams(params?: any): HttpParams {
  let httpParams = new HttpParams();
  
  if (!params) return httpParams;

  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(item => {
          httpParams = httpParams.append(key, item.toString());
        });
      } else {
        httpParams = httpParams.set(key, value.toString());
      }
    }
  });

  return httpParams;
}
```

### TrackBy Function

```typescript
trackById(index: number, item: any): any {
  return item.id;
}

trackByKeyword(index: number, item: KeywordMetrics): string {
  return item.keyword;
}
```

### Error Handler

```typescript
handleError(error: any): void {
  console.error('Error:', error);
  this.error = error.message || 'An error occurred';
  this.loading = false;
}
```

### Retry Logic

```typescript
import { retry, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

this.service.getData()
  .pipe(
    retry(3),
    catchError(err => {
      console.error('Failed after 3 retries:', err);
      return of(null);
    })
  )
  .subscribe(data => {
    // Handle data
  });
```

---

## File Paths

### Quick Navigation

```
Core:
  Models:     src/app/core/models/
  Services:   src/app/core/services/
  Layout:     src/app/core/layout/

Features:
  Dashboard:  src/app/features/dashboard/
  Keywords:   src/app/features/keywords/
  Regions:    src/app/features/regions/
  Channels:   src/app/features/channels/
  Alerts:     src/app/features/alerts/

Shared:
  Components: src/app/shared/components/

Config:
  Routes:     src/app/app.routes.ts
  Config:     src/app/app.config.ts
  Env:        src/environments/environment.ts
```

---

## Environment Configuration

### Development

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

### Production

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.production.com/api'
};
```

---

## CSS Variables

### Colors

```css
--primary-color: #3f51b5;
--accent-color: #ff4081;
--warn-color: #f44336;
--success-color: #4caf50;
--background-color: #fafafa;
--text-color: #333;
```

### Spacing

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

---

## Testing Patterns

### Component Test

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExampleComponent } from './example.component';

describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Service Test

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  let service: MetricsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MetricsService]
    });
    service = TestBed.inject(MetricsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch data', () => {
    const mockData = { /* ... */ };
    
    service.getData().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
```

---

## Keyboard Shortcuts (VS Code)

| Shortcut | Action |
|----------|--------|
| `Ctrl+P` | Quick file open |
| `Ctrl+Shift+P` | Command palette |
| `Ctrl+B` | Toggle sidebar |
| `Ctrl+`` | Toggle terminal |
| `F12` | Go to definition |
| `Alt+F12` | Peek definition |
| `Shift+F12` | Find all references |
| `Ctrl+Shift+F` | Search in files |
| `Ctrl+Shift+H` | Replace in files |

---

## Troubleshooting

### Clear Angular Cache

```bash
rm -rf .angular/cache
# or on Windows
rmdir /s .angular\cache
```

### Clear Node Modules

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

```bash
# Kill process on port 4200 (Windows)
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Kill process on port 4200 (Mac/Linux)
lsof -ti:4200 | xargs kill -9
```

---

**Last Updated**: January 2026  
**Maintained By**: Development Team
