# Components Documentation

Complete reference for all Angular components in the application.

## 📋 Table of Contents

- [Overview](#overview)
- [Core Components](#core-components)
- [Feature Components](#feature-components)
- [Shared Components](#shared-components)
- [Component Patterns](#component-patterns)

---

## Overview

The application follows a modular component architecture with three main categories:

1. **Core Components**: Layout and navigation components
2. **Feature Components**: Page-level components for each route
3. **Shared Components**: Reusable UI components

All components use Angular's standalone component architecture for better tree-shaking and modularity.

---

## Core Components

### HeaderComponent

**Location**: [`src/app/core/layout/header/header.component.ts`](../src/app/core/layout/header/header.component.ts)

**Purpose**: Application header with navigation and search functionality.

#### Component Definition

```typescript
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `searchQuery` | `string` | Current search query value |
| `navItems` | `NavItem[]` | Navigation menu items |

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `navigateToDashboard()` | - | `void` | Navigate to dashboard route |
| `onSearch()` | - | `void` | Handle search submission |

#### NavItem Interface

```typescript
interface NavItem {
  label: string;    // Display label
  route: string;    // Router path
  exact: boolean;   // Exact route matching
}
```

#### Navigation Items

- Dashboard (`/dashboard`)
- Keywords (`/keywords`)
- Regions (`/regions`)
- Channels (`/channels`)
- Alerts (`/alerts`)

#### Usage

```typescript
import { HeaderComponent } from '@app/core/layout/header/header.component';

@Component({
  imports: [HeaderComponent],
  template: '<app-header></app-header>'
})
```

---

## Feature Components

### DashboardComponent

**Location**: [`src/app/features/dashboard/dashboard.component.ts`](../src/app/features/dashboard/dashboard.component.ts)

**Purpose**: Main dashboard displaying executive summary, charts, tables, and alerts.

#### Component Definition

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MetricCardComponent,
    LineChartComponent,
    FunnelChartComponent,
    DataTableComponent,
    AlertBadgeComponent,
    MatTabsModule,
    MatButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy
```

#### Key Features

- **Executive Summary**: KPI cards with latest metrics
- **MRR Growth Chart**: 12-month MRR trend visualization
- **Traffic Trends Chart**: Website traffic over time
- **Conversion Funnel**: Multi-stage conversion visualization
- **Dynamic Tables**: Keywords, regions, and channels with auto-sizing
- **Alert System**: Severity-based alert tabs

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `state` | `DashboardState` | Complete dashboard state |
| `keywordColumns` | `TableColumn[]` | Keyword table column definitions |
| `regionColumns` | `TableColumn[]` | Region table column definitions |
| `channelColumns` | `TableColumn[]` | Channel table column definitions |
| `alertsBySeverity` | `{ [key: string]: Alert[] }` | Alerts grouped by severity |
| `keywordMaxRows` | `number` | Dynamic row count for keyword table |
| `showGoToTop` | `boolean` | Show scroll-to-top button |

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `loadDashboardData()` | - | `void` | Load all dashboard sections |
| `loadExecutiveSummary()` | - | `void` | Load executive summary metrics |
| `loadMrrGrowth()` | - | `void` | Load MRR history chart data |
| `loadTrafficTrends()` | - | `void` | Load traffic trends chart data |
| `loadConversionFunnel()` | - | `void` | Load conversion funnel data |
| `loadKeywords()` | - | `void` | Load keyword metrics |
| `loadRegions()` | - | `void` | Load regional metrics |
| `loadChannels()` | - | `void` | Load channel metrics |
| `loadAlerts()` | - | `void` | Load alerts |
| `calculateTableRows()` | - | `void` | Calculate dynamic table row count |
| `showMoreAlerts(severity)` | `string` | `void` | Expand alert list for severity |
| `showLessAlerts(severity)` | `string` | `void` | Collapse alert list for severity |

#### Lifecycle Hooks

- `ngOnInit()`: Initialize data loading
- `ngAfterViewInit()`: Calculate initial table rows
- `ngOnDestroy()`: Cleanup timers

#### Host Listeners

- `@HostListener('window:resize')`: Recalculate table rows on resize
- `@HostListener('window:scroll')`: Toggle scroll-to-top button

#### Constants

```typescript
private readonly SCROLL_THRESHOLD = 300;
private readonly RESIZE_DEBOUNCE_MS = 150;
private readonly MOBILE_BREAKPOINT = 1024;
private readonly DEFAULT_TABLE_ROWS = 10;
private readonly MIN_TABLE_ROWS = 5;
private readonly MAX_TABLE_ROWS = 30;
```

---

### KeywordsComponent

**Location**: [`src/app/features/keywords/keywords.component.ts`](../src/app/features/keywords/keywords.component.ts)

**Purpose**: Keyword performance analytics with year-over-year comparison.

#### Component Definition

```typescript
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
  changeDetection: ChangeDetectionStrategy.Default
})
export class KeywordsComponent implements OnInit, AfterViewInit
```

#### Key Features

- **Material Table**: Sortable, paginated keyword table
- **Advanced Filtering**: Search, category, and AI overview filters
- **Year-over-Year Comparison**: 2024 vs 2025 metrics
- **Visual Indicators**: Color-coded traffic changes and position changes
- **Debounced Search**: 300ms debounce on search input

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `displayedColumns` | `string[]` | Table column names |
| `dataSource` | `MatTableDataSource<KeywordMetrics>` | Material table data source |
| `loading` | `boolean` | Loading state |
| `error` | `string \| null` | Error message |
| `categories` | `string[]` | Available categories |
| `searchControl` | `FormControl` | Search input control |
| `categoryControl` | `FormControl` | Category filter control |
| `aiOverviewControl` | `FormControl` | AI overview filter control |

#### ViewChild References

- `@ViewChild(MatSort) sort`: Material sort directive
- `@ViewChild(MatPaginator) paginator`: Material paginator

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `loadKeywordData()` | - | `void` | Load keyword metrics from API |
| `clearSearch()` | - | `void` | Clear search input |
| `resetFilters()` | - | `void` | Reset all filters to default |
| `retry()` | - | `void` | Retry loading data after error |
| `formatNumber(value)` | `number \| undefined \| null` | `string` | Format number with commas |
| `formatPercentage(value)` | `number \| undefined \| null` | `string` | Format as percentage |
| `formatTrafficChange(value)` | `number \| undefined \| null` | `string` | Format traffic change with arrow |
| `formatPositionChange(value)` | `number \| undefined \| null` | `string` | Format position change with arrow |
| `getTrafficChangeClass(value)` | `number \| undefined \| null` | `string` | Get CSS class for traffic change |
| `getPositionChangeClass(value)` | `number \| undefined \| null` | `string` | Get CSS class for position change |
| `getAiOverviewClass(value)` | `string \| undefined` | `string` | Get CSS class for AI overview |
| `trackByKeyword(index, item)` | `number, KeywordMetrics` | `string` | TrackBy function for performance |

---

### RegionsComponent

**Location**: [`src/app/features/regions/regions.component.ts`](../src/app/features/regions/regions.component.ts)

**Purpose**: Regional performance metrics with time-based aggregation.

#### Component Definition

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
export class RegionsComponent implements OnInit, AfterViewInit
```

#### Key Features

- **Multi-level Filtering**: Region, country, city filters
- **Time Period Aggregation**: View data by time period (3, 6, 12 months, all)
- **Dynamic Columns**: Columns change based on aggregation mode
- **Comprehensive Metrics**: Traffic, conversions, MRR, CAC, LTV

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `displayedColumns` | `string[]` | Dynamic column list (getter) |
| `dataSource` | `MatTableDataSource<RegionalMetrics>` | Table data source |
| `loading` | `boolean` | Loading state |
| `error` | `string \| null` | Error message |
| `rawData` | `RegionalMetrics[]` | Unfiltered data |
| `regions` | `string[]` | Available regions |
| `countries` | `string[]` | Available countries |
| `cities` | `string[]` | Available cities |
| `searchControl` | `FormControl` | Search control |
| `regionControl` | `FormControl` | Region filter |
| `countryControl` | `FormControl` | Country filter |
| `cityControl` | `FormControl` | City filter |
| `timePeriodControl` | `FormControl` | Time period filter |

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `loadRegionalData()` | - | `void` | Load regional metrics |
| `applyTimePeriodFilter()` | - | `void` | Apply time period aggregation |
| `aggregateByLocation(records)` | `RegionalMetrics[]` | `RegionalMetrics[]` | Aggregate data by location |
| `clearSearch()` | - | `void` | Clear search input |
| `resetFilters()` | - | `void` | Reset all filters |
| `retry()` | - | `void` | Retry loading data |
| `formatNumber(value)` | `number \| undefined \| null` | `string` | Format number |
| `formatCurrency(value)` | `number \| undefined \| null` | `string` | Format as currency |
| `formatPercentage(value)` | `number \| undefined \| null` | `string` | Format as percentage |
| `formatMonth(value)` | `string \| undefined \| null` | `string` | Format month string |

#### Computed Properties

- `isAggregatedView`: Returns true if time period filter is active

---

### ChannelsComponent

**Location**: [`src/app/features/channels/channels.component.ts`](../src/app/features/channels/channels.component.ts)

**Purpose**: Channel performance metrics with monthly breakdown.

#### Component Definition

```typescript
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChannelsComponent implements OnInit, AfterViewInit
```

#### Key Features

- **OnPush Change Detection**: Optimized performance
- **Monthly Breakdown**: View metrics by month and channel
- **Multiple Filters**: Year, month, channel, and search
- **Comprehensive Metrics**: Sessions, signups, conversion rate, bounce rate, session duration

#### Properties (Signals)

| Property | Type | Description |
|----------|------|-------------|
| `loading` | `signal<boolean>` | Loading state signal |
| `error` | `signal<string \| null>` | Error message signal |
| `years` | `signal<string[]>` | Available years signal |
| `channels` | `signal<string[]>` | Available channels signal |

#### Properties (Regular)

| Property | Type | Description |
|----------|------|-------------|
| `displayedColumns` | `string[]` | Table columns (readonly) |
| `dataSource` | `MatTableDataSource<ChannelMonthlyMetrics>` | Table data |
| `searchControl` | `FormControl` | Search control (non-nullable) |
| `yearControl` | `FormControl` | Year filter (non-nullable) |
| `monthControl` | `FormControl` | Month filter (non-nullable) |
| `channelControl` | `FormControl` | Channel filter (non-nullable) |
| `months` | `MonthOption[]` | Month options (readonly) |

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `clearSearch()` | - | `void` | Clear search input |
| `resetFilters()` | - | `void` | Reset all filters |
| `retry()` | - | `void` | Retry loading data |
| `formatNumber(value)` | `number \| null \| undefined` | `string` | Format number |
| `formatPercentage(value)` | `number \| null \| undefined` | `string` | Format percentage |
| `formatDuration(seconds)` | `number \| null \| undefined` | `string` | Format duration as MM:SS |
| `formatDecimal(value, decimals)` | `number \| null \| undefined, number` | `string` | Format decimal |
| `formatBounceRate(rate)` | `number \| null \| undefined` | `string` | Format bounce rate (decimal to %) |
| `formatMonth(value)` | `string \| null \| undefined` | `string` | Format month string |
| `trackByChannelMonth(index, item)` | `number, ChannelMonthlyMetrics` | `string` | TrackBy function |

---

### AlertsComponent

**Location**: [`src/app/features/alerts/alerts.component.ts`](../src/app/features/alerts/alerts.component.ts)

**Purpose**: Alert management with severity-based filtering.

#### Component Definition

```typescript
@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    MatTooltipModule
  ],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit, AfterViewInit
```

#### Key Features

- **Severity Filtering**: Filter by Critical, High, Medium, Low
- **Alert Type Filtering**: Filter by specific alert types
- **Severity Counts**: Display count badges for each severity
- **Custom Sorting**: Sort by severity, date, message
- **Tooltips**: Show full text for truncated messages

#### Properties (Signals)

| Property | Type | Description |
|----------|------|-------------|
| `loading` | `signal<boolean>` | Loading state |
| `error` | `signal<string \| null>` | Error message |
| `severityCounts` | `signal<Record<string, number>>` | Alert counts by severity |
| `activeSeverity` | `signal<string \| null>` | Currently active severity filter |

#### Properties (Regular)

| Property | Type | Description |
|----------|------|-------------|
| `displayedColumns` | `string[]` | Table columns (readonly) |
| `dataSource` | `MatTableDataSource<Alert>` | Table data |
| `severities` | `Array<'Critical' \| 'High' \| 'Medium' \| 'Low'>` | Severity levels |
| `searchControl` | `FormControl` | Search control |
| `selectedAlertType` | `string` | Selected alert type filter |
| `alertTypes` | `Array<{value: string, label: string}>` | Alert type options |

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `loadAlerts()` | - | `void` | Load alerts based on filters |
| `filterBySeverity(severity)` | `string` | `void` | Toggle severity filter |
| `clearSeverityFilter()` | - | `void` | Clear severity filter |
| `clearSearch()` | - | `void` | Clear search input |
| `resetFilters()` | - | `void` | Reset all filters |
| `onAlertTypeChange()` | - | `void` | Handle alert type change |
| `retry()` | - | `void` | Retry loading data |
| `getSeverityIcon(severity)` | `string` | `string` | Get emoji icon for severity |
| `formatDate(timestamp)` | `string` | `string` | Format date string |
| `formatAlertType(alertType)` | `string \| undefined` | `string` | Format alert type name |
| `truncateText(text, maxLength)` | `string \| undefined, number` | `string` | Truncate long text |
| `shouldShowTooltip(text, maxLength)` | `string \| undefined, number` | `boolean` | Check if tooltip needed |
| `trackByAlert(index, alert)` | `number, Alert` | `string` | TrackBy function |

---

## Shared Components

### MetricCardComponent

**Location**: [`src/app/shared/components/metric-card/metric-card.component.ts`](../src/app/shared/components/metric-card/metric-card.component.ts)

**Purpose**: Reusable KPI card component.

#### Component Definition

```typescript
@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricCardComponent
```

#### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | `string` | `''` | Card title |
| `value` | `number \| string \| null` | `null` | Main value to display |
| `growth` | `number` | - | Growth percentage (optional) |
| `icon` | `string` | - | Material icon name (optional) |
| `loading` | `boolean` | `false` | Show loading state |
| `trend` | `'up' \| 'down' \| 'neutral'` | - | Trend indicator (optional) |
| `format` | `'number' \| 'currency' \| 'percentage'` | `'number'` | Value format |
| `alert` | `boolean` | `false` | Show alert styling |

#### Computed Properties

| Property | Type | Description |
|----------|------|-------------|
| `formattedValue` | `string` | Formatted value based on format type |
| `growthClass` | `string` | CSS class for growth indicator |
| `trendIcon` | `string` | Material icon for trend |

#### Usage

```typescript
<app-metric-card
  title="Total Revenue"
  [value]="50000"
  format="currency"
  [growth]="12.5"
  trend="up"
  icon="attach_money"
></app-metric-card>
```

---

### LineChartComponent

**Location**: [`src/app/shared/components/line-chart/line-chart.component.ts`](../src/app/shared/components/line-chart/line-chart.component.ts)

**Purpose**: Reusable line chart using Chart.js.

#### Component Definition

```typescript
@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent implements OnChanges
```

#### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `data` | `any[]` | `[]` | Chart data array |
| `labelKey` | `string` | `'label'` | Property name for labels |
| `valueKey` | `string` | `'value'` | Property name for values |
| `title` | `string` | `''` | Chart title |
| `color` | `string` | `'#3f51b5'` | Line color |
| `loading` | `boolean` | `false` | Show loading state |

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `lineChartType` | `ChartType` | Chart type ('line') |
| `lineChartData` | `ChartConfiguration['data']` | Chart.js data configuration |
| `lineChartOptions` | `ChartConfiguration['options']` | Chart.js options |

#### Usage

```typescript
<app-line-chart
  [data]="mrrData"
  labelKey="month"
  valueKey="mrr"
  title="MRR Growth"
  color="#4caf50"
  [loading]="loading"
></app-line-chart>
```

---

### FunnelChartComponent

**Location**: [`src/app/shared/components/funnel-chart/funnel-chart.component.ts`](../src/app/shared/components/funnel-chart/funnel-chart.component.ts)

**Purpose**: Conversion funnel visualization.

#### Component Definition

```typescript
@Component({
  selector: 'app-funnel-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './funnel-chart.component.html',
  styleUrls: ['./funnel-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FunnelChartComponent implements OnChanges
```

#### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `data` | `FunnelData[]` | `[]` | Funnel stage data |
| `title` | `string` | `'Conversion Funnel'` | Chart title |
| `loading` | `boolean` | `false` | Show loading state |

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `maxValue` | `number` | Maximum value for width calculation |

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getWidth(value)` | `number` | `number` | Calculate bar width percentage |
| `getColor(index)` | `number` | `string` | Get color for stage |

#### Usage

```typescript
<app-funnel-chart
  [data]="funnelData"
  title="Conversion Funnel"
  [loading]="loading"
></app-funnel-chart>
```

---

### DataTableComponent

**Location**: [`src/app/shared/components/data-table/data-table.component.ts`](../src/app/shared/components/data-table/data-table.component.ts)

**Purpose**: Reusable data table with sorting and formatting.

#### Component Definition

```typescript
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnChanges
```

#### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `data` | `any[]` | `[]` | Table data |
| `columns` | `TableColumn[]` | `[]` | Column definitions |
| `title` | `string` | `''` | Table title |
| `loading` | `boolean` | `false` | Show loading state |
| `maxRows` | `number` | `10` | Maximum rows to display |

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `sortColumn` | `string \| null` | Currently sorted column |
| `sortDirection` | `'asc' \| 'desc'` | Sort direction |
| `displayData` | `any[]` | Displayed data (sliced) |

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `sort(column)` | `TableColumn` | `void` | Sort table by column |
| `formatValue(value, column)` | `unknown, TableColumn` | `string` | Format cell value |
| `getSortIcon(column)` | `TableColumn` | `string` | Get sort indicator |

#### Usage

```typescript
<app-data-table
  [data]="keywords"
  [columns]="keywordColumns"
  title="Top Keywords"
  [maxRows]="10"
  [loading]="loading"
></app-data-table>
```

---

### AlertBadgeComponent

**Location**: [`src/app/shared/components/alert-badge/alert-badge.component.ts`](../src/app/shared/components/alert-badge/alert-badge.component.ts)

**Purpose**: Display individual alerts with severity indicators.

#### Component Definition

```typescript
@Component({
  selector: 'app-alert-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-badge.component.html',
  styleUrls: ['./alert-badge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertBadgeComponent
```

#### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `alert` | `Alert` | required | Alert data |
| `compact` | `boolean` | `false` | Use compact layout |

#### Computed Properties

| Property | Type | Description |
|----------|------|-------------|
| `severityClass` | `string` | CSS class for severity |
| `severityIcon` | `string` | Emoji icon for severity |

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `formatAlertType(alertType)` | `string \| undefined` | `string` | Format alert type name |
| `formatDate(timestamp)` | `string` | `string` | Format date string |

#### Usage

```typescript
<app-alert-badge
  [alert]="alert"
  [compact]="false"
></app-alert-badge>
```

---

## Component Patterns

### Standalone Components

All components use Angular's standalone architecture:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, /* other imports */],
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent { }
```

### Change Detection Strategies

#### OnPush (Performance Optimized)

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedComponent { }
```

Used in:
- `MetricCardComponent`
- `LineChartComponent`
- `FunnelChartComponent`
- `DataTableComponent`
- `AlertBadgeComponent`
- `ChannelsComponent`

#### Default

Used in components with complex state management:
- `DashboardComponent`
- `KeywordsComponent`
- `RegionsComponent`
- `AlertsComponent`

### Reactive Forms

Components use reactive forms for better control:

```typescript
searchControl = new FormControl('');
categoryControl = new FormControl('all');

ngOnInit(): void {
  this.searchControl.valueChanges
    .pipe(debounceTime(300), distinctUntilChanged())
    .subscribe(value => {
      // Handle search
    });
}
```

### Material Table Pattern

```typescript
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatPaginator) paginator!: MatPaginator;

dataSource = new MatTableDataSource<DataType>([]);

ngAfterViewInit(): void {
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
  this.dataSource.filterPredicate = this.createFilterPredicate();
}
```

### Error Handling Pattern

```typescript
loading = false;
error: string | null = null;

loadData(): void {
  this.loading = true;
  this.error = null;

  this.service.getData()
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
```

### Unsubscribe Pattern

```typescript
private destroyRef = inject(DestroyRef);

ngOnInit(): void {
  this.service.getData()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(data => { /* ... */ });
}
```

### TrackBy Functions

```typescript
trackByKeyword(index: number, item: KeywordMetrics): string {
  return item.keyword;
}
```

```html
<tr *ngFor="let item of data; trackBy: trackByKeyword">
```

---

## Best Practices

### 1. Use Standalone Components

All new components should be standalone for better tree-shaking.

### 2. Implement OnPush When Possible

Use `ChangeDetectionStrategy.OnPush` for components that don't need frequent updates.

### 3. Use Reactive Forms

Prefer reactive forms over template-driven forms for better control and testability.

### 4. Implement TrackBy

Always use trackBy functions in `*ngFor` loops for better performance.

### 5. Handle Errors Gracefully

Always provide error handling and user feedback.

### 6. Use Signals for Reactive State

Use Angular signals for reactive state management (Angular 16+).

### 7. Unsubscribe from Observables

Use `takeUntilDestroyed` or `async` pipe to prevent memory leaks.

### 8. Type Everything

Use TypeScript interfaces for all data structures.

---

**Last Updated**: January 2026  
**Maintained By**: Development Team
