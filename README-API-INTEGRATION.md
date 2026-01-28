# API Integration Documentation

## Overview

This document describes the Angular frontend integration with the SolveoDashboardAssignment.Api backend. The frontend is built using Angular 18 with standalone components and provides full type-safe access to all API endpoints.

## Project Structure

```
src/app/
├── core/
│   ├── models/                    # TypeScript interfaces for all API models
│   │   ├── common.models.ts       # Shared types (DateRangeParams, ApiError, etc.)
│   │   ├── alerts.models.ts       # Alert-related interfaces
│   │   ├── metrics.models.ts      # Metrics-related interfaces
│   │   ├── excel-import.models.ts # Import statistics models
│   │   └── index.ts               # Barrel export
│   └── services/                  # Angular services for API communication
│       ├── alerts.service.ts      # Alerts API endpoints
│       ├── metrics.service.ts     # Metrics API endpoints
│       ├── excel-import.service.ts # Excel import endpoint
│       ├── http-error.interceptor.ts # Global error handling
│       └── index.ts               # Barrel export
├── features/                      # Feature components
│   ├── dashboard/                 # Dashboard with monthly metrics
│   ├── alerts/                    # Alerts management
│   ├── channels/                  # Channel performance
│   ├── keywords/                  # Keyword analytics
│   └── regions/                   # Regional metrics
└── environments/
    └── environment.ts             # API URL configuration
```

## API Configuration

The API base URL is configured in [`environment.ts`](src/environments/environment.ts):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5090/api'
};
```

## Services

### AlertsService

Provides access to all alert-related endpoints.

**Location:** [`src/app/core/services/alerts.service.ts`](src/app/core/services/alerts.service.ts)

**Methods:**
- `getAlerts(params?: DateRangeParams): Observable<Alert[]>`
- `getHighTrafficLowConversion(params?: HighTrafficLowConversionParams): Observable<Alert[]>`
- `getAiOverviewCannibalization(params?: AiOverviewCannibalizationParams): Observable<Alert[]>`
- `getRegionalUnderperformance(params?: DateRangeParams): Observable<Alert[]>`
- `getSeasonalDips(params?: DateRangeParams): Observable<Alert[]>`
- `getChannelWaste(params?: ChannelWasteParams): Observable<Alert[]>`

**Example Usage:**
```typescript
import { AlertsService } from './core/services';
import { Alert, DateRangeParams } from './core/models';

constructor(private alertsService: AlertsService) {}

loadAlerts(): void {
  const params: DateRangeParams = {
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z'
  };

  this.alertsService.getAlerts(params).subscribe({
    next: (alerts: Alert[]) => {
      console.log('Alerts loaded:', alerts);
    },
    error: (err) => {
      console.error('Error loading alerts:', err);
    }
  });
}
```

### MetricsService

Provides access to all metrics-related endpoints.

**Location:** [`src/app/core/services/metrics.service.ts`](src/app/core/services/metrics.service.ts)

**Monthly Metrics Methods:**
- `getLatestMonthlyMetrics(): Observable<MonthlyMetrics>`
- `getMonthlyMetrics(params?: MonthlyMetricsParams): Observable<MonthlyMetrics[]>`
- `getMrrGrowth(): Observable<MrrGrowthMetrics[]>`

**Regional Metrics Methods:**
- `getRegionalMetrics(params?: RegionalMetricsParams): Observable<RegionalMetrics[]>`
- `getTrialToPaid(params?: DateRangeParams): Observable<TrialToPaidMetrics[]>`
- `getTrafficTrends(params?: DateRangeParams): Observable<TrafficTrendsMetrics[]>`
- `getCacLtv(params?: CacLtvParams): Observable<CacLtvMetrics[]>`

**Channel Metrics Methods:**
- `getChannelMetrics(params?: ChannelMetricsParams): Observable<ChannelMetrics[]>`
- `getChannelConversionRates(params?: DateRangeParams): Observable<ChannelConversionRates[]>`

**Keyword Metrics Methods:**
- `getKeywordMetrics(params?: KeywordMetricsParams): Observable<KeywordMetrics[]>`
- `getKeywordTrafficChange(params?: KeywordTrafficChangeParams): Observable<KeywordTrafficChange[]>`

**Example Usage:**
```typescript
import { MetricsService } from './core/services';
import { MonthlyMetrics } from './core/models';

constructor(private metricsService: MetricsService) {}

loadDashboard(): void {
  // Get latest monthly metrics
  this.metricsService.getLatestMonthlyMetrics().subscribe({
    next: (metrics: MonthlyMetrics) => {
      console.log('Latest metrics:', metrics);
    },
    error: (err) => {
      console.error('Error:', err);
    }
  });

  // Get MRR growth
  this.metricsService.getMrrGrowth().subscribe({
    next: (growth) => {
      console.log('MRR growth:', growth);
    }
  });
}
```

### ExcelImportService

Handles Excel file uploads.

**Location:** [`src/app/core/services/excel-import.service.ts`](src/app/core/services/excel-import.service.ts)

**Methods:**
- `importExcelFile(file: File): Observable<ImportStatisticsDto>`

**Example Usage:**
```typescript
import { ExcelImportService } from './core/services';
import { ImportStatisticsDto } from './core/models';

constructor(private importService: ExcelImportService) {}

onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    
    this.importService.importExcelFile(file).subscribe({
      next: (stats: ImportStatisticsDto) => {
        console.log('Import successful:', stats);
        console.log(`Total rows: ${stats.totalRowsAllSheets}`);
        console.log(`Imported: ${stats.totalImportedAllSheets}`);
        console.log(`Skipped: ${stats.totalSkippedAllSheets}`);
      },
      error: (err) => {
        console.error('Import failed:', err);
      }
    });
  }
}
```

## Models

All TypeScript interfaces are located in [`src/app/core/models/`](src/app/core/models/).

### Common Models

**DateRangeParams** - Used for date filtering
```typescript
interface DateRangeParams {
  startDate?: string; // ISO 8601 format
  endDate?: string;   // ISO 8601 format
}
```

**ApiError** - Error response structure
```typescript
interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  error?: any;
}
```

### Alert Models

**Alert** - Alert data structure
```typescript
interface Alert {
  id?: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
```

### Metrics Models

**MonthlyMetrics** - Monthly performance data
```typescript
interface MonthlyMetrics {
  month: string;
  year: number;
  totalSessions: number;
  totalConversions: number;
  conversionRate: number;
  revenue: number;
  mrr?: number;
  [key: string]: any;
}
```

**RegionalMetrics** - Regional performance data
```typescript
interface RegionalMetrics {
  region: string;
  country?: string;
  city?: string;
  sessions: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  [key: string]: any;
}
```

**ChannelMetrics** - Channel performance data
```typescript
interface ChannelMetrics {
  channel: string;
  sessions: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  cost?: number;
  roi?: number;
  [key: string]: any;
}
```

**KeywordMetrics** - Keyword performance data
```typescript
interface KeywordMetrics {
  keyword: string;
  category?: string;
  traffic: number;
  conversions: number;
  conversionRate: number;
  position?: number;
  [key: string]: any;
}
```

## Error Handling

The application uses a global HTTP error interceptor located at [`src/app/core/services/http-error.interceptor.ts`](src/app/core/services/http-error.interceptor.ts).

**Features:**
- Catches all HTTP errors globally
- Provides user-friendly error messages
- Logs errors to console for debugging
- Handles specific status codes (400, 401, 403, 404, 500, 503)

**Error Response Structure:**
```typescript
{
  message: string;      // User-friendly error message
  status: number;       // HTTP status code
  statusText: string;   // HTTP status text
  error: any;          // Original error object
}
```

**Component-Level Error Handling:**
```typescript
this.metricsService.getLatestMonthlyMetrics().subscribe({
  next: (data) => {
    // Handle success
    this.data = data;
  },
  error: (err) => {
    // Error is already processed by interceptor
    this.errorMessage = err.message;
    console.error('Error:', err);
  }
});
```

## Components

### Dashboard Component

**Location:** [`src/app/features/dashboard/dashboard.component.ts`](src/app/features/dashboard/dashboard.component.ts)

**Features:**
- Displays latest monthly metrics
- Shows MRR growth trends
- Loading and error states
- Retry functionality

**API Calls:**
- `GET /api/Metrics/monthly/latest`
- `GET /api/Metrics/monthly/mrr-growth`

### Alerts Component

**Location:** [`src/app/features/alerts/alerts.component.ts`](src/app/features/alerts/alerts.component.ts)

**Features:**
- Lists all alerts
- Filter by alert type
- Date range filtering
- Multiple alert type support

**API Calls:**
- `GET /api/Alerts`
- `GET /api/Alerts/high-traffic-low-conversion`
- `GET /api/Alerts/ai-overview-cannibalization`
- `GET /api/Alerts/regional-underperformance`
- `GET /api/Alerts/seasonal-dips`
- `GET /api/Alerts/channel-waste`

### Channels Component

**Location:** [`src/app/features/channels/channels.component.ts`](src/app/features/channels/channels.component.ts)

**Features:**
- Displays channel metrics
- Shows conversion rates by channel
- Tabular data display

**API Calls:**
- `GET /api/Metrics/channels`
- `GET /api/Metrics/channels/conversion-rates`

### Keywords Component

**Location:** [`src/app/features/keywords/keywords.component.ts`](src/app/features/keywords/keywords.component.ts)

**Features:**
- Displays keyword performance
- Shows traffic changes
- Category filtering support

**API Calls:**
- `GET /api/Metrics/keywords`
- `GET /api/Metrics/keywords/traffic-change`

### Regions Component

**Location:** [`src/app/features/regions/regions.component.ts`](src/app/features/regions/regions.component.ts)

**Features:**
- Displays regional metrics
- Trial-to-paid conversion analysis
- CAC/LTV metrics
- Traffic trends

**API Calls:**
- `GET /api/Metrics/regional`
- `GET /api/Metrics/regional/trial-to-paid`
- `GET /api/Metrics/regional/traffic-trends`
- `GET /api/Metrics/regional/cac-ltv`

## Query Parameters

All services handle query parameters automatically using `HttpParams`. Arrays are properly serialized for ASP.NET Core model binding.

**Example with multiple parameters:**
```typescript
const params: RegionalMetricsParams = {
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-12-31T23:59:59Z',
  regions: ['North America', 'Europe'],
  countries: ['USA', 'UK', 'Germany']
};

this.metricsService.getRegionalMetrics(params).subscribe(...);
```

**Generated URL:**
```
/api/Metrics/regional?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z&regions=North%20America&regions=Europe&countries=USA&countries=UK&countries=Germany
```

## Date Handling

All date parameters should be in ISO 8601 format:

```typescript
// Correct format
const params: DateRangeParams = {
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-12-31T23:59:59Z'
};

// Converting JavaScript Date to ISO string
const now = new Date();
const params: DateRangeParams = {
  startDate: now.toISOString(),
  endDate: new Date(Date.now() + 86400000).toISOString()
};
```

## Testing the Integration

### 1. Start the Backend API

Ensure your backend API is running at `http://localhost:5090`

### 2. Start the Angular Development Server

```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200`

### 3. Navigate to Components

- **Dashboard:** `http://localhost:4200/dashboard`
- **Alerts:** `http://localhost:4200/alerts`
- **Channels:** `http://localhost:4200/channels`
- **Keywords:** `http://localhost:4200/keywords`
- **Regions:** `http://localhost:4200/regions`

### 4. Check Browser Console

All API calls are logged to the browser console for debugging:
- Successful responses show the data
- Errors show detailed error information

### 5. Check Network Tab

Open browser DevTools → Network tab to inspect:
- Request URLs
- Request/Response headers
- Response data
- Status codes

## Common Issues and Solutions

### CORS Errors

If you see CORS errors, ensure your backend API has CORS configured:

```csharp
// In Program.cs or Startup.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

app.UseCors("AllowAngular");
```

### API URL Configuration

If the API is running on a different port, update [`src/environments/environment.ts`](src/environments/environment.ts):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:YOUR_PORT/api'
};
```

### Type Mismatches

If the actual API responses don't match the TypeScript interfaces:

1. Check the browser console for the actual response structure
2. Update the corresponding interface in [`src/app/core/models/`](src/app/core/models/)
3. The `[key: string]: any` index signature allows additional properties

## Best Practices

### 1. Always Use Typed Services

```typescript
// ✅ Good - Type-safe
this.metricsService.getLatestMonthlyMetrics().subscribe({
  next: (data: MonthlyMetrics) => {
    console.log(data.totalSessions); // TypeScript knows this property exists
  }
});

// ❌ Bad - No type safety
this.http.get('http://localhost:5090/api/Metrics/monthly/latest').subscribe({
  next: (data: any) => {
    console.log(data.totalSessions); // No type checking
  }
});
```

### 2. Handle Errors Properly

```typescript
// ✅ Good - Proper error handling
this.metricsService.getLatestMonthlyMetrics().subscribe({
  next: (data) => {
    this.data = data;
    this.loading = false;
  },
  error: (err) => {
    this.error = err.message;
    this.loading = false;
    console.error('Error:', err);
  }
});
```

### 3. Use Loading States

```typescript
// ✅ Good - User feedback
loadData(): void {
  this.loading = true;
  this.error = null;

  this.metricsService.getLatestMonthlyMetrics().subscribe({
    next: (data) => {
      this.data = data;
    },
    error: (err) => {
      this.error = err.message;
    },
    complete: () => {
      this.loading = false;
    }
  });
}
```

### 4. Unsubscribe from Observables

```typescript
// ✅ Good - Prevent memory leaks
import { Subject, takeUntil } from 'rxjs';

export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.metricsService.getLatestMonthlyMetrics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.data = data;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## API Endpoint Reference

### Alerts Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Alerts` | Get all alerts |
| GET | `/api/Alerts/high-traffic-low-conversion` | High traffic, low conversion alerts |
| GET | `/api/Alerts/ai-overview-cannibalization` | AI overview cannibalization alerts |
| GET | `/api/Alerts/regional-underperformance` | Regional underperformance alerts |
| GET | `/api/Alerts/seasonal-dips` | Seasonal dips alerts |
| GET | `/api/Alerts/channel-waste` | Channel waste alerts |

### Metrics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Metrics/monthly/latest` | Latest monthly metrics |
| GET | `/api/Metrics/monthly` | Monthly metrics with date range |
| GET | `/api/Metrics/monthly/mrr-growth` | MRR growth metrics |
| GET | `/api/Metrics/regional` | Regional metrics |
| GET | `/api/Metrics/regional/trial-to-paid` | Trial to paid conversion |
| GET | `/api/Metrics/regional/traffic-trends` | Regional traffic trends |
| GET | `/api/Metrics/regional/cac-ltv` | CAC/LTV by region |
| GET | `/api/Metrics/channels` | Channel metrics |
| GET | `/api/Metrics/channels/conversion-rates` | Channel conversion rates |
| GET | `/api/Metrics/keywords` | Keyword metrics |
| GET | `/api/Metrics/keywords/traffic-change` | Keyword traffic changes |

### Excel Import Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ExcelImport/import` | Import Excel file |

## Support

For issues or questions:
1. Check the browser console for error messages
2. Check the Network tab for API responses
3. Verify the backend API is running
4. Ensure CORS is properly configured
5. Check that the API URL in environment.ts is correct

## Summary

This Angular frontend provides:
- ✅ Full type safety with TypeScript interfaces
- ✅ Dedicated services for each API controller
- ✅ Global error handling with HTTP interceptor
- ✅ Standalone components (no NgModules)
- ✅ Proper loading and error states
- ✅ Environment-based configuration
- ✅ Complete coverage of all 18 API endpoints
- ✅ Example implementations in all feature components
