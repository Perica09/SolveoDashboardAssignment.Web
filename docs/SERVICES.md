# Services Documentation

Complete reference for all Angular services in the application.

## 📋 Table of Contents

- [Overview](#overview)
- [MetricsService](#metricsservice)
- [AlertsService](#alertsservice)
- [HTTP Error Interceptor](#http-error-interceptor)
- [Utility Functions](#utility-functions)
- [Usage Examples](#usage-examples)

---

## Overview

The application uses a service layer pattern to separate business logic from presentation. All services are provided at the root level (`providedIn: 'root'`) making them singleton services available throughout the application.

### Service Architecture

```
Components
    ↓
Services (Business Logic)
    ↓
HttpClient (HTTP Communication)
    ↓
HTTP Interceptors (Error Handling)
    ↓
API Backend
```

---

## MetricsService

**Location**: [`src/app/core/services/metrics.service.ts`](../src/app/core/services/metrics.service.ts)

**Purpose**: Handles all metrics-related API calls including monthly metrics, regional performance, channel analytics, and keyword tracking.

### Class Definition

```typescript
@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private readonly baseUrl = `${environment.apiUrl}/Metrics`;
  
  constructor(private http: HttpClient) {}
}
```

### Methods

#### Monthly Metrics

##### `getLatestMonthlyMetrics()`

Get the latest monthly metrics.

```typescript
getLatestMonthlyMetrics(): Observable<MonthlyMetrics>
```

**Returns**: `Observable<MonthlyMetrics>`

**API Endpoint**: `GET /api/Metrics/monthly/latest`

**Example**:
```typescript
this.metricsService.getLatestMonthlyMetrics()
  .subscribe(data => {
    console.log('Latest MRR:', data.mrr);
    console.log('Total Sessions:', data.totalSessions);
  });
```

---

##### `getMonthlyMetrics(params?)`

Get monthly metrics with optional date range filtering.

```typescript
getMonthlyMetrics(params?: MonthlyMetricsParams): Observable<MonthlyMetrics[]>
```

**Parameters**:
- `params` (optional): [`MonthlyMetricsParams`](./MODELS.md#monthlymetricsparams)
  - `startDate`: Start date (ISO 8601)
  - `endDate`: End date (ISO 8601)

**Returns**: `Observable<MonthlyMetrics[]>`

**API Endpoint**: `GET /api/Metrics/monthly`

**Example**:
```typescript
const params = {
  startDate: '2024-01-01',
  endDate: '2024-12-31'
};

this.metricsService.getMonthlyMetrics(params)
  .subscribe(data => {
    console.log('Monthly data:', data);
  });
```

---

##### `getMrrHistory(months)`

Get MRR history for the specified number of months.

```typescript
getMrrHistory(months: number = 12): Observable<MonthlyMrr[]>
```

**Parameters**:
- `months`: Number of months to retrieve (default: 12)

**Returns**: `Observable<MonthlyMrr[]>`

**API Endpoint**: `GET /api/Metrics/mrr-history?months={months}`

**Example**:
```typescript
this.metricsService.getMrrHistory(6)
  .subscribe(data => {
    data.forEach(item => {
      console.log(`${item.year}-${item.month}: $${item.mrrUsd}`);
    });
  });
```

---

#### Regional Metrics

##### `getAllRegionalPerformance()`

Get all regional performance metrics.

```typescript
getAllRegionalPerformance(): Observable<RegionalMetrics[]>
```

**Returns**: `Observable<RegionalMetrics[]>`

**API Endpoint**: `GET /api/Metrics/regional/all`

**Example**:
```typescript
this.metricsService.getAllRegionalPerformance()
  .subscribe(data => {
    console.log('Regional data:', data);
  });
```

---

##### `getRegionalMetrics(params?)`

Get regional metrics with optional filtering.

```typescript
getRegionalMetrics(params?: RegionalMetrics): Observable<RegionalMetrics[]>
```

**Parameters**:
- `params` (optional): Filter parameters

**Returns**: `Observable<RegionalMetrics[]>`

**API Endpoint**: `GET /api/Metrics/regional`

---

##### `getTrialToPaid(params?)`

Get trial to paid conversion metrics by region.

```typescript
getTrialToPaid(params?: DateRangeParams): Observable<TrialToPaidMetrics[]>
```

**Parameters**:
- `params` (optional): [`DateRangeParams`](./MODELS.md#daterangeparams)

**Returns**: `Observable<TrialToPaidMetrics[]>`

**API Endpoint**: `GET /api/Metrics/regional/trial-to-paid`

---

##### `getTrafficTrends(params?)`

Get traffic trends by region.

```typescript
getTrafficTrends(params?: DateRangeParams): Observable<TrafficTrendsMetrics[]>
```

**Parameters**:
- `params` (optional): [`DateRangeParams`](./MODELS.md#daterangeparams)

**Returns**: `Observable<TrafficTrendsMetrics[]>`

**API Endpoint**: `GET /api/Metrics/regional/traffic-trends`

---

##### `getCacLtv(params?)`

Get customer acquisition cost and lifetime value metrics.

```typescript
getCacLtv(params?: CacLtvParams): Observable<CacLtvMetrics[]>
```

**Parameters**:
- `params` (optional): [`CacLtvParams`](./MODELS.md#cacltvparams)
  - `startDate`: Start date
  - `endDate`: End date
  - `regions`: Array of region names

**Returns**: `Observable<CacLtvMetrics[]>`

**API Endpoint**: `GET /api/Metrics/regional/cac-ltv`

---

#### Channel Metrics

##### `getChannelMetrics(params?)` (Deprecated)

Get channel metrics (legacy endpoint).

```typescript
/**
 * @deprecated Use getAllChannelMetrics() for monthly data
 */
getChannelMetrics(params?: ChannelMetricsParams): Observable<ChannelMetrics[]>
```

**Parameters**:
- `params` (optional): [`ChannelMetricsParams`](./MODELS.md#channelmetricsparams)

**Returns**: `Observable<ChannelMetrics[]>`

**API Endpoint**: `GET /api/Metrics/channels`

**Note**: This method is deprecated. Use `getAllChannelMetrics()` instead.

---

##### `getAllChannelMetrics()`

Get all channel metrics with monthly breakdown.

```typescript
getAllChannelMetrics(): Observable<ChannelMonthlyMetrics[]>
```

**Returns**: `Observable<ChannelMonthlyMetrics[]>`

**API Endpoint**: `GET /api/Metrics/channels/all`

**Example**:
```typescript
this.metricsService.getAllChannelMetrics()
  .subscribe(data => {
    data.forEach(item => {
      console.log(`${item.month} - ${item.channel}: ${item.sessions} sessions`);
    });
  });
```

---

##### `getAggregatedChannelMetrics(params?)`

Get aggregated channel metrics (future implementation).

```typescript
getAggregatedChannelMetrics(params?: {
  startDate?: string;
  endDate?: string;
  channels?: string[];
}): Observable<ChannelAggregatedMetrics[]>
```

**Parameters**:
- `params` (optional):
  - `startDate`: Start date
  - `endDate`: End date
  - `channels`: Array of channel names

**Returns**: `Observable<ChannelAggregatedMetrics[]>`

**API Endpoint**: `GET /api/Metrics/channels/aggregated`

---

##### `getChannelConversionRates(params?)`

Get channel conversion rates.

```typescript
getChannelConversionRates(params?: DateRangeParams): Observable<ChannelConversionRates[]>
```

**Parameters**:
- `params` (optional): [`DateRangeParams`](./MODELS.md#daterangeparams)

**Returns**: `Observable<ChannelConversionRates[]>`

**API Endpoint**: `GET /api/Metrics/channels/conversion-rates`

---

#### Keyword Metrics

##### `getKeywordMetrics(params?)`

Get keyword performance metrics.

```typescript
getKeywordMetrics(params?: KeywordMetricsParams): Observable<KeywordMetrics[]>
```

**Parameters**:
- `params` (optional): [`KeywordMetricsParams`](./MODELS.md#keywordmetricsparams)
  - `categories`: Array of categories to filter
  - `minTraffic`: Minimum traffic threshold
  - `maxTraffic`: Maximum traffic threshold

**Returns**: `Observable<KeywordMetrics[]>`

**API Endpoint**: `GET /api/Metrics/keywords`

**Example**:
```typescript
const params = {
  categories: ['SEO', 'PPC'],
  minTraffic: 1000
};

this.metricsService.getKeywordMetrics(params)
  .subscribe(data => {
    data.forEach(keyword => {
      console.log(`${keyword.keyword}: ${keyword.trafficChangeYoY}% change`);
    });
  });
```

---

##### `getKeywordTrafficChange(params?)`

Get keyword traffic changes over time.

```typescript
getKeywordTrafficChange(params?: KeywordTrafficChangeParams): Observable<KeywordTrafficChange[]>
```

**Parameters**:
- `params` (optional): [`KeywordTrafficChangeParams`](./MODELS.md#keywordtrafficchangeparams)
  - `minChangePercentage`: Minimum change percentage
  - `categories`: Array of categories

**Returns**: `Observable<KeywordTrafficChange[]>`

**API Endpoint**: `GET /api/Metrics/keywords/traffic-change`

---

## AlertsService

**Location**: [`src/app/core/services/alerts.service.ts`](../src/app/core/services/alerts.service.ts)

**Purpose**: Handles all alert-related API calls including fetching alerts by type and severity.

### Class Definition

```typescript
@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private readonly baseUrl = `${environment.apiUrl}/Alerts`;
  
  constructor(private http: HttpClient) {}
}
```

### Methods

##### `getAlerts(params?)`

Get all alerts with optional date range filtering.

```typescript
getAlerts(params?: DateRangeParams): Observable<Alert[]>
```

**Parameters**:
- `params` (optional): [`DateRangeParams`](./MODELS.md#daterangeparams)

**Returns**: `Observable<Alert[]>`

**API Endpoint**: `GET /api/Alerts`

**Example**:
```typescript
this.alertsService.getAlerts()
  .subscribe(alerts => {
    const critical = alerts.filter(a => a.severity === 'Critical');
    console.log(`${critical.length} critical alerts`);
  });
```

---

##### `getHighTrafficLowConversion(params?)`

Get high traffic, low conversion alerts.

```typescript
getHighTrafficLowConversion(params?: HighTrafficLowConversionParams): Observable<Alert[]>
```

**Parameters**:
- `params` (optional): [`HighTrafficLowConversionParams`](./MODELS.md#hightrafficlowconversionparams)
  - `minTraffic`: Minimum traffic threshold
  - `maxConversion`: Maximum conversion rate threshold

**Returns**: `Observable<Alert[]>`

**API Endpoint**: `GET /api/Alerts/high-traffic-low-conversion`

**Example**:
```typescript
const params = {
  minTraffic: 2000,
  maxConversion: 1.5
};

this.alertsService.getHighTrafficLowConversion(params)
  .subscribe(alerts => {
    console.log('High traffic, low conversion alerts:', alerts);
  });
```

---

##### `getAiOverviewCannibalization(params?)`

Get AI overview cannibalization alerts.

```typescript
getAiOverviewCannibalization(params?: AiOverviewCannibalizationParams): Observable<Alert[]>
```

**Parameters**:
- `params` (optional): [`AiOverviewCannibalizationParams`](./MODELS.md#aioverviewcannibalizationparams)
  - `minDeclinePercentage`: Minimum decline percentage

**Returns**: `Observable<Alert[]>`

**API Endpoint**: `GET /api/Alerts/ai-overview-cannibalization`

**Example**:
```typescript
const params = { minDeclinePercentage: 10.0 };

this.alertsService.getAiOverviewCannibalization(params)
  .subscribe(alerts => {
    console.log('AI cannibalization alerts:', alerts);
  });
```

---

##### `getRegionalUnderperformance(params?)`

Get regional underperformance alerts.

```typescript
getRegionalUnderperformance(params?: DateRangeParams): Observable<Alert[]>
```

**Parameters**:
- `params` (optional): [`DateRangeParams`](./MODELS.md#daterangeparams)

**Returns**: `Observable<Alert[]>`

**API Endpoint**: `GET /api/Alerts/regional-underperformance`

---

##### `getSeasonalDips(params?)`

Get seasonal dips alerts.

```typescript
getSeasonalDips(params?: DateRangeParams): Observable<Alert[]>
```

**Parameters**:
- `params` (optional): [`DateRangeParams`](./MODELS.md#daterangeparams)

**Returns**: `Observable<Alert[]>`

**API Endpoint**: `GET /api/Alerts/seasonal-dips`

---

##### `getChannelWaste(params?)`

Get channel waste alerts.

```typescript
getChannelWaste(params?: ChannelWasteParams): Observable<Alert[]>
```

**Parameters**:
- `params` (optional): [`ChannelWasteParams`](./MODELS.md#channelwasteparams)
  - `maxConversion`: Maximum conversion rate
  - `minSessions`: Minimum sessions
  - `channelsToCheck`: Array of channel names
  - `startDate`: Start date
  - `endDate`: End date

**Returns**: `Observable<Alert[]>`

**API Endpoint**: `GET /api/Alerts/channel-waste`

**Example**:
```typescript
const params = {
  maxConversion: 2.0,
  minSessions: 10000,
  channelsToCheck: ['Paid Search', 'Display']
};

this.alertsService.getChannelWaste(params)
  .subscribe(alerts => {
    console.log('Channel waste alerts:', alerts);
  });
```

---

## HTTP Error Interceptor

**Location**: [`src/app/core/services/http-error.interceptor.ts`](../src/app/core/services/http-error.interceptor.ts)

**Purpose**: Global HTTP error handling for all API requests.

### Function Definition

```typescript
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Error handling logic
    })
  );
};
```

### Features

- **Client-side error handling**: Network errors, timeouts
- **Server-side error handling**: HTTP status codes
- **User-friendly messages**: Converts technical errors to readable messages
- **Console logging**: Detailed error logging for debugging

### Error Status Codes Handled

| Status Code | Message |
|-------------|---------|
| 400 | Bad Request: Please check your input |
| 401 | Unauthorized: Please log in |
| 403 | Forbidden: You do not have permission |
| 404 | Not Found: The requested resource was not found |
| 500 | Internal Server Error: Please try again later |
| 503 | Service Unavailable: Please try again later |

### Configuration

Registered in [`app.config.ts`](../src/app/app.config.ts):

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([httpErrorInterceptor])
    )
  ]
};
```

### Error Response Format

```typescript
{
  message: string;      // User-friendly error message
  status: number;       // HTTP status code
  statusText: string;   // HTTP status text
  error: any;          // Original error object
}
```

---

## Utility Functions

### buildHttpParams

**Location**: [`src/app/core/utils/http-params.util.ts`](../src/app/core/utils/http-params.util.ts)

**Purpose**: Convert JavaScript objects to Angular HttpParams for API requests.

```typescript
export function buildHttpParams(params?: any): HttpParams
```

**Parameters**:
- `params` (optional): Object with key-value pairs

**Returns**: `HttpParams` object

**Features**:
- Handles null/undefined values (skips them)
- Supports arrays (appends multiple values)
- Converts all values to strings

**Example**:
```typescript
const params = {
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  categories: ['SEO', 'PPC'],
  minTraffic: 1000
};

const httpParams = buildHttpParams(params);
// Result: ?startDate=2024-01-01&endDate=2024-12-31&categories=SEO&categories=PPC&minTraffic=1000
```

**Usage in Services**:
```typescript
getKeywordMetrics(params?: KeywordMetricsParams): Observable<KeywordMetrics[]> {
  const httpParams = buildHttpParams(params);
  return this.http.get<KeywordMetrics[]>(`${this.baseUrl}/keywords`, { params: httpParams });
}
```

---

## Usage Examples

### Basic Service Usage

```typescript
import { Component, OnInit } from '@angular/core';
import { MetricsService } from '@app/core/services';
import { KeywordMetrics } from '@app/core/models';

@Component({
  selector: 'app-keywords',
  template: `...`
})
export class KeywordsComponent implements OnInit {
  keywords: KeywordMetrics[] = [];
  loading = false;
  error: string | null = null;

  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.loadKeywords();
  }

  loadKeywords(): void {
    this.loading = true;
    this.error = null;

    this.metricsService.getKeywordMetrics()
      .subscribe({
        next: (data) => {
          this.keywords = data;
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

### Using Multiple Services

```typescript
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MetricsService, AlertsService } from '@app/core/services';

@Component({
  selector: 'app-dashboard',
  template: `...`
})
export class DashboardComponent implements OnInit {
  constructor(
    private metricsService: MetricsService,
    private alertsService: AlertsService
  ) {}

  ngOnInit(): void {
    // Load multiple data sources in parallel
    forkJoin({
      metrics: this.metricsService.getLatestMonthlyMetrics(),
      alerts: this.alertsService.getAlerts(),
      keywords: this.metricsService.getKeywordMetrics()
    }).subscribe({
      next: (data) => {
        console.log('Metrics:', data.metrics);
        console.log('Alerts:', data.alerts);
        console.log('Keywords:', data.keywords);
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
      }
    });
  }
}
```

### Error Handling

```typescript
import { Component } from '@angular/core';
import { MetricsService } from '@app/core/services';
import { catchError, retry } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-example',
  template: `...`
})
export class ExampleComponent {
  constructor(private metricsService: MetricsService) {}

  loadDataWithRetry(): void {
    this.metricsService.getLatestMonthlyMetrics()
      .pipe(
        retry(3), // Retry up to 3 times
        catchError(err => {
          console.error('Failed after 3 retries:', err);
          return of(null); // Return fallback value
        })
      )
      .subscribe(data => {
        if (data) {
          console.log('Data loaded:', data);
        } else {
          console.log('Using fallback data');
        }
      });
  }
}
```

### Filtering with Parameters

```typescript
import { Component } from '@angular/core';
import { MetricsService } from '@app/core/services';
import { KeywordMetricsParams } from '@app/core/models';

@Component({
  selector: 'app-filtered-keywords',
  template: `...`
})
export class FilteredKeywordsComponent {
  constructor(private metricsService: MetricsService) {}

  loadHighTrafficKeywords(): void {
    const params: KeywordMetricsParams = {
      categories: ['SEO'],
      minTraffic: 5000
    };

    this.metricsService.getKeywordMetrics(params)
      .subscribe(data => {
        console.log('High traffic SEO keywords:', data);
      });
  }

  loadDateRangeData(): void {
    const params = {
      startDate: '2024-01-01',
      endDate: '2024-03-31'
    };

    this.metricsService.getMonthlyMetrics(params)
      .subscribe(data => {
        console.log('Q1 2024 metrics:', data);
      });
  }
}
```

### Unsubscribing from Observables

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MetricsService } from '@app/core/services';

@Component({
  selector: 'app-example',
  template: `...`
})
export class ExampleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.metricsService.getLatestMonthlyMetrics()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log('Data:', data);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## Service Testing

### Unit Test Example

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MetricsService } from './metrics.service';
import { environment } from '@environments/environment';

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

  it('should fetch latest monthly metrics', () => {
    const mockData = {
      month: 'January',
      year: 2024,
      totalSessions: 10000,
      totalConversions: 500,
      conversionRate: 5.0,
      revenue: 50000
    };

    service.getLatestMonthlyMetrics().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Metrics/monthly/latest`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
```

---

## Best Practices

### 1. Always Handle Errors

```typescript
this.metricsService.getKeywordMetrics()
  .subscribe({
    next: (data) => { /* handle success */ },
    error: (err) => { /* handle error */ }
  });
```

### 2. Unsubscribe from Observables

Use `takeUntil`, `async` pipe, or `takeUntilDestroyed` to prevent memory leaks.

### 3. Use Type Safety

Always specify types for better IDE support and compile-time checking.

```typescript
// ✅ Good
this.metricsService.getKeywordMetrics()
  .subscribe((data: KeywordMetrics[]) => { ... });

// ❌ Avoid
this.metricsService.getKeywordMetrics()
  .subscribe((data: any) => { ... });
```

### 4. Centralize API Configuration

Use environment files for API URLs and configuration.

### 5. Use RxJS Operators

Leverage RxJS operators for data transformation and error handling.

```typescript
this.metricsService.getKeywordMetrics()
  .pipe(
    map(data => data.filter(k => k.traffic2025 > 1000)),
    catchError(err => of([]))
  )
  .subscribe(data => { ... });
```

---

**Last Updated**: January 2026  
**Maintained By**: Development Team
