# Models & Interfaces Documentation

Complete reference for all TypeScript interfaces and type definitions used in the application.

## 📋 Table of Contents

- [Common Models](#common-models)
- [Alert Models](#alert-models)
- [Metrics Models](#metrics-models)
- [Dashboard Models](#dashboard-models)
- [Channel Models](#channel-models)
- [Usage Examples](#usage-examples)

---

## Common Models

Located in [`src/app/core/models/common.models.ts`](../src/app/core/models/common.models.ts)

### DateRangeParams

Parameters for filtering data by date range.

```typescript
interface DateRangeParams {
  startDate?: string;  // ISO 8601 format (YYYY-MM-DD)
  endDate?: string;    // ISO 8601 format (YYYY-MM-DD)
}
```

**Properties:**
- `startDate` (optional): Start date for filtering in ISO 8601 format
- `endDate` (optional): End date for filtering in ISO 8601 format

**Usage:**
```typescript
const params: DateRangeParams = {
  startDate: '2024-01-01',
  endDate: '2024-12-31'
};
```

---

### ApiError

Standardized error response structure.

```typescript
interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  error?: any;
}
```

**Properties:**
- `message`: Human-readable error message
- `status` (optional): HTTP status code
- `statusText` (optional): HTTP status text
- `error` (optional): Original error object

---

### ApiResponse<T>

Generic API response wrapper.

```typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

**Type Parameters:**
- `T`: Type of the data payload

**Properties:**
- `data`: Response payload of type T
- `success`: Indicates if the request was successful
- `message` (optional): Additional response message

---

### PaginationParams

Parameters for paginated API requests.

```typescript
interface PaginationParams {
  page?: number;
  pageSize?: number;
}
```

**Properties:**
- `page` (optional): Page number (1-indexed)
- `pageSize` (optional): Number of items per page

---

### FilterParams

Generic filter parameters for API requests.

```typescript
interface FilterParams {
  [key: string]: string | number | boolean | string[] | undefined;
}
```

**Usage:**
```typescript
const filters: FilterParams = {
  category: 'SEO',
  minTraffic: 1000,
  active: true,
  tags: ['important', 'trending']
};
```

---

## Alert Models

Located in [`src/app/core/models/alerts.models.ts`](../src/app/core/models/alerts.models.ts)

### Alert

Main alert interface representing system alerts with severity levels.

```typescript
interface Alert {
  message: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  detectedAt: string;
  recommendedAction?: string;
  alertType?: string;
  entity?: string;
  value?: number;
  threshold?: number;
}
```

**Properties:**
- `message`: Alert description
- `severity`: Alert severity level (Critical, High, Medium, Low)
- `detectedAt`: ISO 8601 timestamp when alert was detected
- `recommendedAction` (optional): Suggested action to resolve the alert
- `alertType` (optional): Type/category of the alert
- `entity` (optional): Entity affected by the alert (e.g., keyword, region)
- `value` (optional): Current value that triggered the alert
- `threshold` (optional): Threshold value that was exceeded

**Example:**
```typescript
const alert: Alert = {
  message: 'High traffic with low conversion rate detected',
  severity: 'High',
  detectedAt: '2024-01-15T10:30:00Z',
  recommendedAction: 'Review landing page optimization',
  alertType: 'HighTrafficLowConversion',
  entity: 'Organic Search',
  value: 0.8,
  threshold: 1.5
};
```

---

### HighTrafficLowConversionParams

Parameters for high traffic, low conversion alerts.

```typescript
interface HighTrafficLowConversionParams {
  minTraffic?: number;
  maxConversion?: number;
}
```

**Properties:**
- `minTraffic` (optional): Minimum traffic threshold
- `maxConversion` (optional): Maximum conversion rate threshold (percentage)

---

### AiOverviewCannibalizationParams

Parameters for AI overview cannibalization alerts.

```typescript
interface AiOverviewCannibalizationParams {
  minDeclinePercentage?: number;
}
```

**Properties:**
- `minDeclinePercentage` (optional): Minimum decline percentage to trigger alert

---

### RegionalUnderperformanceParams

Parameters for regional underperformance alerts.

```typescript
interface RegionalUnderperformanceParams {
  startDate?: string;
  endDate?: string;
}
```

Extends [`DateRangeParams`](#daterangeparams).

---

### SeasonalDipsParams

Parameters for seasonal dips alerts.

```typescript
interface SeasonalDipsParams {
  startDate?: string;
  endDate?: string;
}
```

Extends [`DateRangeParams`](#daterangeparams).

---

### ChannelWasteParams

Parameters for channel waste alerts.

```typescript
interface ChannelWasteParams {
  maxConversion?: number;
  minSessions?: number;
  channelsToCheck?: string[];
  startDate?: string;
  endDate?: string;
}
```

**Properties:**
- `maxConversion` (optional): Maximum acceptable conversion rate
- `minSessions` (optional): Minimum sessions to consider
- `channelsToCheck` (optional): Array of channel names to analyze
- `startDate` (optional): Start date for analysis
- `endDate` (optional): End date for analysis

---

## Metrics Models

Located in [`src/app/core/models/metrics.models.ts`](../src/app/core/models/metrics.models.ts)

### MonthlyMetrics

Monthly aggregated metrics.

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

**Properties:**
- `month`: Month name or YYYY-MM format
- `year`: Year number
- `totalSessions`: Total sessions for the month
- `totalConversions`: Total conversions for the month
- `conversionRate`: Conversion rate percentage
- `revenue`: Total revenue
- `mrr` (optional): Monthly Recurring Revenue
- Additional dynamic properties allowed via index signature

---

### MonthlyMetricsParams

Parameters for monthly metrics queries.

```typescript
interface MonthlyMetricsParams {
  startDate?: string;
  endDate?: string;
}
```

Extends [`DateRangeParams`](#daterangeparams).

---

### MonthlyMrr

Monthly Recurring Revenue data.

```typescript
interface MonthlyMrr {
  month: number;
  year: number;
  mrrUsd: number;
}
```

**Properties:**
- `month`: Month number (1-12)
- `year`: Year number
- `mrrUsd`: MRR in USD

---

### RegionalMetrics

Regional performance metrics with support for both raw and aggregated data.

```typescript
interface RegionalMetrics {
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
  month?: string;
  organicTraffic?: number;
  paidTraffic?: number;
  trialsStarted?: number;
  paidConversions?: number;
  trialToPaidRate?: number;
  mrrUsd?: number;
  cacUsd?: number;
  ltvUsd?: number;
  [key: string]: any;
}
```

**Properties:**
- `region`: Geographic region name
- `country` (optional): Country name
- `city` (optional): City name
- `totalTraffic` (optional): Total traffic count
- `totalConversions` (optional): Total conversions
- `averageTrialToPaidRate` (optional): Average trial to paid conversion rate
- `trafficTrendPercentage` (optional): Traffic trend percentage
- `cacLtvRatio` (optional): Customer Acquisition Cost to Lifetime Value ratio
- `averageCac` (optional): Average Customer Acquisition Cost
- `averageLtv` (optional): Average Lifetime Value
- `monthCount` (optional): Number of months in aggregation
- Additional properties for detailed metrics

---

### TrialToPaidMetrics

Trial to paid conversion metrics by region.

```typescript
interface TrialToPaidMetrics {
  region: string;
  trialUsers: number;
  paidUsers: number;
  conversionRate: number;
  [key: string]: any;
}
```

**Properties:**
- `region`: Geographic region
- `trialUsers`: Number of trial users
- `paidUsers`: Number of paid users
- `conversionRate`: Conversion rate percentage

---

### TrafficTrendsMetrics

Traffic trend metrics over time.

```typescript
interface TrafficTrendsMetrics {
  region: string;
  date: string;
  sessions: number;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
  [key: string]: any;
}
```

**Properties:**
- `region`: Geographic region
- `date`: Date in ISO format
- `sessions`: Number of sessions
- `trend`: Trend direction (up, down, stable)
- `changePercentage`: Percentage change

---

### CacLtvMetrics

Customer Acquisition Cost and Lifetime Value metrics.

```typescript
interface CacLtvMetrics {
  region: string;
  cac: number;
  ltv: number;
  ratio: number;
  [key: string]: any;
}
```

**Properties:**
- `region`: Geographic region
- `cac`: Customer Acquisition Cost
- `ltv`: Lifetime Value
- `ratio`: CAC to LTV ratio

---

### CacLtvParams

Parameters for CAC/LTV queries.

```typescript
interface CacLtvParams {
  startDate?: string;
  endDate?: string;
  regions?: string[];
}
```

**Properties:**
- `startDate` (optional): Start date
- `endDate` (optional): End date
- `regions` (optional): Array of region names to filter

---

### KeywordMetrics

Keyword performance metrics with year-over-year comparison.

```typescript
interface KeywordMetrics {
  keyword: string;
  category?: string;
  traffic2024?: number;
  conversionRate2024?: number;
  position2024?: number;
  traffic2025?: number;
  conversionRate2025?: number;
  position2025?: number;
  trafficChangeYoY?: number;
  positionChange?: number;
  aiOverviewTriggered?: string;
  [key: string]: any;
}
```

**Properties:**
- `keyword`: Keyword text
- `category` (optional): Keyword category
- `traffic2024` (optional): Traffic in 2024
- `conversionRate2024` (optional): Conversion rate in 2024
- `position2024` (optional): Search position in 2024
- `traffic2025` (optional): Traffic in 2025
- `conversionRate2025` (optional): Conversion rate in 2025
- `position2025` (optional): Search position in 2025
- `trafficChangeYoY` (optional): Year-over-year traffic change percentage
- `positionChange` (optional): Position change (negative is better)
- `aiOverviewTriggered` (optional): Whether AI overview is triggered ('Yes'/'No')

---

### KeywordMetricsParams

Parameters for keyword metrics queries.

```typescript
interface KeywordMetricsParams {
  categories?: string[];
  minTraffic?: number;
  maxTraffic?: number;
}
```

**Properties:**
- `categories` (optional): Array of categories to filter
- `minTraffic` (optional): Minimum traffic threshold
- `maxTraffic` (optional): Maximum traffic threshold

---

### KeywordTrafficChange

Keyword traffic change over time.

```typescript
interface KeywordTrafficChange {
  keyword: string;
  category?: string;
  previousTraffic: number;
  currentTraffic: number;
  change: number;
  changePercentage: number;
  [key: string]: any;
}
```

**Properties:**
- `keyword`: Keyword text
- `category` (optional): Keyword category
- `previousTraffic`: Previous period traffic
- `currentTraffic`: Current period traffic
- `change`: Absolute change
- `changePercentage`: Percentage change

---

### KeywordTrafficChangeParams

Parameters for keyword traffic change queries.

```typescript
interface KeywordTrafficChangeParams {
  minChangePercentage?: number;
  categories?: string[];
}
```

**Properties:**
- `minChangePercentage` (optional): Minimum change percentage to include
- `categories` (optional): Array of categories to filter

---

## Channel Models

### ChannelMonthlyMetrics

Monthly channel performance metrics (raw API data).

Located in [`src/app/core/models/channel-monthly-metrics.ts`](../src/app/core/models/channel-monthly-metrics.ts)

```typescript
interface ChannelMonthlyMetrics {
  month: string;                    // YYYY-MM format
  channel: string;                  // Channel name
  sessions: number;                 // Total sessions
  signups: number;                  // Number of signups/conversions
  conversionRate: number;           // Conversion rate as percentage
  avgSessionDurationSec: number;    // Average session duration in seconds
  bounceRate: number;               // Bounce rate as decimal (0-1)
  pagesPerSession: number;          // Average pages per session
}
```

**Properties:**
- `month`: Month in YYYY-MM format (e.g., "2024-01")
- `channel`: Channel name (e.g., "Organic Search", "Paid Search", "Direct")
- `sessions`: Total number of sessions
- `signups`: Number of signups/conversions
- `conversionRate`: Conversion rate as percentage (e.g., 3.09 = 3.09%)
- `avgSessionDurationSec`: Average session duration in seconds
- `bounceRate`: Bounce rate as decimal (0-1, where 0.56 = 56%)
- `pagesPerSession`: Average pages viewed per session

**Example:**
```typescript
const channelData: ChannelMonthlyMetrics = {
  month: '2024-01',
  channel: 'Organic Search',
  sessions: 15420,
  signups: 476,
  conversionRate: 3.09,
  avgSessionDurationSec: 342,
  bounceRate: 0.56,
  pagesPerSession: 3.2
};
```

---

### ChannelAggregatedMetrics

Aggregated channel metrics across time periods.

Located in [`src/app/core/models/channel-aggregated-metrics.ts`](../src/app/core/models/channel-aggregated-metrics.ts)

```typescript
interface ChannelAggregatedMetrics {
  channel: string;
  totalSessions: number;
  totalSignups: number;
  avgConversionRate: number;
  avgSessionDurationSec: number;
  avgBounceRate: number;
  avgPagesPerSession: number;
  monthCount: number;
  periodStart?: string;
  periodEnd?: string;
}
```

**Properties:**
- `channel`: Channel name
- `totalSessions`: Total sessions across all months
- `totalSignups`: Total signups across all months
- `avgConversionRate`: Average conversion rate
- `avgSessionDurationSec`: Average session duration in seconds
- `avgBounceRate`: Average bounce rate (0-1 decimal)
- `avgPagesPerSession`: Average pages per session
- `monthCount`: Number of months in aggregation
- `periodStart` (optional): Start of period (YYYY-MM)
- `periodEnd` (optional): End of period (YYYY-MM)

---

### ChannelMetrics (Deprecated)

Legacy channel metrics interface.

```typescript
/**
 * @deprecated Use ChannelMonthlyMetrics or ChannelAggregatedMetrics instead
 */
interface ChannelMetrics {
  channel: string;
  sessions: number;
  conversions?: number;
  conversionRate: number;
  totalSessions?: number;
  totalSignups?: number;
  averageSessionDuration?: number;
  monthCount?: number;
  cost?: number;
  roi?: number;
}
```

**Note**: This interface is maintained for backward compatibility but should not be used in new code.

---

### ChannelMetricsParams

Parameters for channel metrics queries.

```typescript
interface ChannelMetricsParams {
  startDate?: string;
  endDate?: string;
  channels?: string[];
}
```

**Properties:**
- `startDate` (optional): Start date
- `endDate` (optional): End date
- `channels` (optional): Array of channel names to filter

---

### ChannelConversionRates

Channel conversion rates over time.

```typescript
interface ChannelConversionRates {
  channel: string;
  conversionRate: number;
  period: string;
}
```

**Properties:**
- `channel`: Channel name
- `conversionRate`: Conversion rate percentage
- `period`: Time period

---

## Dashboard Models

Located in [`src/app/core/models/dashboard.models.ts`](../src/app/core/models/dashboard.models.ts)

### DashboardMetrics

Extended metrics interface for dashboard-specific fields.

```typescript
interface DashboardMetrics extends MonthlyMetrics {
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
```

**Properties:**
- Inherits all properties from [`MonthlyMetrics`](#monthlymetrics)
- `latestMrr`: Latest Monthly Recurring Revenue
- `growthPercentageMoM`: Month-over-month growth percentage
- `websiteTraffic`: Total website traffic
- `paidConversions`: Number of paid conversions
- `trialToPaidPercentage`: Trial to paid conversion percentage
- `churnRate`: Customer churn rate
- `uniqueSignups`: Number of unique signups
- `trialsStarted`: Number of trials started

---

### FunnelData

Funnel stage data for conversion visualization.

```typescript
interface FunnelData {
  stage: string;
  value: number;
  percentage: number;
  color?: string;
}
```

**Properties:**
- `stage`: Funnel stage name
- `value`: Absolute value for this stage
- `percentage`: Percentage relative to first stage
- `color` (optional): Color for visualization

**Example:**
```typescript
const funnelStages: FunnelData[] = [
  { stage: 'Website Traffic', value: 50000, percentage: 100, color: '#4caf50' },
  { stage: 'Unique Signups', value: 5000, percentage: 10, color: '#8bc34a' },
  { stage: 'Trials Started', value: 2500, percentage: 5, color: '#cddc39' },
  { stage: 'Paid Conversions', value: 500, percentage: 1, color: '#ffc107' }
];
```

---

### ChartDataPoint

Generic chart data point.

```typescript
interface ChartDataPoint {
  label: string;
  value: number;
}
```

**Properties:**
- `label`: X-axis label
- `value`: Y-axis value

---

### TableColumn

Table column definition for data tables.

```typescript
interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'currency' | 'percentage';
  format?: (value: any) => string;
}
```

**Properties:**
- `key`: Property key in data object
- `label`: Display label for column header
- `sortable` (optional): Whether column is sortable
- `type` (optional): Data type for formatting
- `format` (optional): Custom formatting function

**Example:**
```typescript
const columns: TableColumn[] = [
  { key: 'keyword', label: 'Keyword', sortable: true, type: 'text' },
  { key: 'traffic', label: 'Traffic', sortable: true, type: 'number' },
  { key: 'conversionRate', label: 'Conv. Rate', sortable: true, type: 'percentage' },
  { 
    key: 'revenue', 
    label: 'Revenue', 
    sortable: true, 
    type: 'currency',
    format: (value) => `$${value.toFixed(2)}`
  }
];
```

---

### SectionState<T>

Dashboard section state for granular loading/error handling.

```typescript
interface SectionState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}
```

**Type Parameters:**
- `T`: Type of the data for this section

**Properties:**
- `loading`: Whether section is currently loading
- `error`: Error message if loading failed
- `data`: Section data of type T

---

### DashboardState

Complete dashboard state.

```typescript
interface DashboardState {
  executiveSummary: SectionState<DashboardMetrics>;
  mrrGrowth: SectionState<ChartDataPoint[]>;
  trafficTrends: SectionState<ChartDataPoint[]>;
  conversionFunnel: SectionState<FunnelData[]>;
  keywords: SectionState<any[]>;
  regions: SectionState<any[]>;
  channels: SectionState<any[]>;
  alerts: SectionState<any[]>;
}
```

**Properties:**
- `executiveSummary`: Executive summary metrics state
- `mrrGrowth`: MRR growth chart data state
- `trafficTrends`: Traffic trends chart data state
- `conversionFunnel`: Conversion funnel data state
- `keywords`: Keywords table data state
- `regions`: Regions table data state
- `channels`: Channels table data state
- `alerts`: Alerts data state

---

## Usage Examples

### Fetching Data with Type Safety

```typescript
import { MetricsService } from '@app/core/services';
import { KeywordMetrics, KeywordMetricsParams } from '@app/core/models';

// In component
constructor(private metricsService: MetricsService) {}

loadKeywords(): void {
  const params: KeywordMetricsParams = {
    categories: ['SEO', 'PPC'],
    minTraffic: 1000
  };

  this.metricsService.getKeywordMetrics(params)
    .subscribe((data: KeywordMetrics[]) => {
      // data is fully typed
      console.log(data[0].keyword);
      console.log(data[0].trafficChangeYoY);
    });
}
```

### Working with Alerts

```typescript
import { Alert } from '@app/core/models';

const alerts: Alert[] = [
  {
    message: 'Traffic spike detected',
    severity: 'High',
    detectedAt: new Date().toISOString(),
    recommendedAction: 'Monitor server capacity'
  }
];

// Filter by severity
const criticalAlerts = alerts.filter(a => a.severity === 'Critical');
```

### Building Dashboard State

```typescript
import { DashboardState, SectionState } from '@app/core/models';

const initialState: DashboardState = {
  executiveSummary: { loading: false, error: null, data: null },
  mrrGrowth: { loading: false, error: null, data: null },
  trafficTrends: { loading: false, error: null, data: null },
  conversionFunnel: { loading: false, error: null, data: null },
  keywords: { loading: false, error: null, data: null },
  regions: { loading: false, error: null, data: null },
  channels: { loading: false, error: null, data: null },
  alerts: { loading: false, error: null, data: null }
};
```

---

## Type Exports

All models are exported from the barrel file:

```typescript
// Import from barrel
import { 
  Alert, 
  KeywordMetrics, 
  RegionalMetrics,
  DashboardState 
} from '@app/core/models';
```

Located in [`src/app/core/models/index.ts`](../src/app/core/models/index.ts)

---

**Last Updated**: January 2026  
**Maintained By**: Development Team
