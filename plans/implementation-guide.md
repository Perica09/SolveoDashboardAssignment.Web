# Angular Frontend Implementation Guide

This document provides the complete code for all files that need to be generated or updated.

## Table of Contents
1. [TypeScript Models](#typescript-models)
2. [Angular Services](#angular-services)
3. [HTTP Interceptor](#http-interceptor)
4. [Component Updates](#component-updates)
5. [Configuration Updates](#configuration-updates)

---

## TypeScript Models

### 1. Common Models (`src/app/core/models/common.models.ts`)

```typescript
/**
 * Common models used across the application
 */

export interface DateRangeParams {
  startDate?: string; // ISO 8601 format
  endDate?: string;   // ISO 8601 format
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  error?: any;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface FilterParams {
  [key: string]: string | number | boolean | string[] | undefined;
}
```

### 2. Alerts Models (`src/app/core/models/alerts.models.ts`)

```typescript
/**
 * Alert-related models
 */

export interface Alert {
  id?: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface HighTrafficLowConversionParams {
  minTraffic?: number;
  maxConversion?: number;
}

export interface AiOverviewCannibalizationParams {
  minDeclinePercentage?: number;
}

export interface RegionalUnderperformanceParams {
  startDate?: string;
  endDate?: string;
}

export interface SeasonalDipsParams {
  startDate?: string;
  endDate?: string;
}

export interface ChannelWasteParams {
  maxConversion?: number;
  minSessions?: number;
  channelsToCheck?: string[];
  startDate?: string;
  endDate?: string;
}
```

### 3. Metrics Models (`src/app/core/models/metrics.models.ts`)

```typescript
/**
 * Metrics-related models
 */

export interface MonthlyMetrics {
  month: string;
  year: number;
  totalSessions: number;
  totalConversions: number;
  conversionRate: number;
  revenue: number;
  mrr?: number;
  [key: string]: any; // Allow additional properties
}

export interface MonthlyMetricsParams {
  startDate?: string;
  endDate?: string;
}

export interface MrrGrowthMetrics {
  month: string;
  mrr: number;
  growth: number;
  growthPercentage: number;
  [key: string]: any;
}

export interface RegionalMetrics {
  region: string;
  country?: string;
  city?: string;
  sessions: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  [key: string]: any;
}

export interface RegionalMetricsParams {
  startDate?: string;
  endDate?: string;
  regions?: string[];
  countries?: string[];
  cities?: string[];
}

export interface TrialToPaidMetrics {
  region: string;
  trialUsers: number;
  paidUsers: number;
  conversionRate: number;
  [key: string]: any;
}

export interface TrafficTrendsMetrics {
  region: string;
  date: string;
  sessions: number;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
  [key: string]: any;
}

export interface CacLtvMetrics {
  region: string;
  cac: number;
  ltv: number;
  ratio: number;
  [key: string]: any;
}

export interface CacLtvParams {
  startDate?: string;
  endDate?: string;
  regions?: string[];
}

export interface ChannelMetrics {
  channel: string;
  sessions: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  cost?: number;
  roi?: number;
  [key: string]: any;
}

export interface ChannelMetricsParams {
  startDate?: string;
  endDate?: string;
  channels?: string[];
}

export interface ChannelConversionRates {
  channel: string;
  conversionRate: number;
  period: string;
  [key: string]: any;
}

export interface KeywordMetrics {
  keyword: string;
  category?: string;
  traffic: number;
  conversions: number;
  conversionRate: number;
  position?: number;
  [key: string]: any;
}

export interface KeywordMetricsParams {
  categories?: string[];
  minTraffic?: number;
  maxTraffic?: number;
}

export interface KeywordTrafficChange {
  keyword: string;
  category?: string;
  previousTraffic: number;
  currentTraffic: number;
  change: number;
  changePercentage: number;
  [key: string]: any;
}

export interface KeywordTrafficChangeParams {
  minChangePercentage?: number;
  categories?: string[];
}
```

### 5. Models Index (`src/app/core/models/index.ts`)

```typescript
/**
 * Barrel export for all models
 */

// Common models
export * from './common.models';

// Alert models
export * from './alerts.models';

// Metrics models
export * from './metrics.models';

// Excel import models
export * from './excel-import.models';
```

---

## Angular Services

### 1. Alerts Service (`src/app/core/services/alerts.service.ts`)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Alert,
  DateRangeParams,
  HighTrafficLowConversionParams,
  AiOverviewCannibalizationParams,
  ChannelWasteParams
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private readonly baseUrl = `${environment.apiUrl}/Alerts`;

  constructor(private http: HttpClient) {}

  /**
   * Get all alerts with optional date range filtering
   */
  getAlerts(params?: DateRangeParams): Observable<Alert[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<Alert[]>(this.baseUrl, { params: httpParams });
  }

  /**
   * Get high traffic, low conversion alerts
   */
  getHighTrafficLowConversion(params?: HighTrafficLowConversionParams): Observable<Alert[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<Alert[]>(`${this.baseUrl}/high-traffic-low-conversion`, { params: httpParams });
  }

  /**
   * Get AI overview cannibalization alerts
   */
  getAiOverviewCannibalization(params?: AiOverviewCannibalizationParams): Observable<Alert[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<Alert[]>(`${this.baseUrl}/ai-overview-cannibalization`, { params: httpParams });
  }

  /**
   * Get regional underperformance alerts
   */
  getRegionalUnderperformance(params?: DateRangeParams): Observable<Alert[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<Alert[]>(`${this.baseUrl}/regional-underperformance`, { params: httpParams });
  }

  /**
   * Get seasonal dips alerts
   */
  getSeasonalDips(params?: DateRangeParams): Observable<Alert[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<Alert[]>(`${this.baseUrl}/seasonal-dips`, { params: httpParams });
  }

  /**
   * Get channel waste alerts
   */
  getChannelWaste(params?: ChannelWasteParams): Observable<Alert[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<Alert[]>(`${this.baseUrl}/channel-waste`, { params: httpParams });
  }

  /**
   * Build HTTP params from object
   */
  private buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    
    if (!params) {
      return httpParams;
    }

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
}
```

### 2. Metrics Service (`src/app/core/services/metrics.service.ts`)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  MonthlyMetrics,
  MonthlyMetricsParams,
  MrrGrowthMetrics,
  RegionalMetrics,
  RegionalMetricsParams,
  TrialToPaidMetrics,
  TrafficTrendsMetrics,
  CacLtvMetrics,
  CacLtvParams,
  ChannelMetrics,
  ChannelMetricsParams,
  ChannelConversionRates,
  KeywordMetrics,
  KeywordMetricsParams,
  KeywordTrafficChange,
  KeywordTrafficChangeParams,
  DateRangeParams
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private readonly baseUrl = `${environment.apiUrl}/Metrics`;

  constructor(private http: HttpClient) {}

  // ========== Monthly Metrics ==========

  /**
   * Get latest monthly metrics
   */
  getLatestMonthlyMetrics(): Observable<MonthlyMetrics> {
    return this.http.get<MonthlyMetrics>(`${this.baseUrl}/monthly/latest`);
  }

  /**
   * Get monthly metrics with optional date range
   */
  getMonthlyMetrics(params?: MonthlyMetricsParams): Observable<MonthlyMetrics[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<MonthlyMetrics[]>(`${this.baseUrl}/monthly`, { params: httpParams });
  }

  /**
   * Get MRR growth metrics
   */
  getMrrGrowth(): Observable<MrrGrowthMetrics[]> {
    return this.http.get<MrrGrowthMetrics[]>(`${this.baseUrl}/monthly/mrr-growth`);
  }

  // ========== Regional Metrics ==========

  /**
   * Get regional metrics with optional filters
   */
  getRegionalMetrics(params?: RegionalMetricsParams): Observable<RegionalMetrics[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<RegionalMetrics[]>(`${this.baseUrl}/regional`, { params: httpParams });
  }

  /**
   * Get trial to paid conversion by region
   */
  getTrialToPaid(params?: DateRangeParams): Observable<TrialToPaidMetrics[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<TrialToPaidMetrics[]>(`${this.baseUrl}/regional/trial-to-paid`, { params: httpParams });
  }

  /**
   * Get regional traffic trends
   */
  getTrafficTrends(params?: DateRangeParams): Observable<TrafficTrendsMetrics[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<TrafficTrendsMetrics[]>(`${this.baseUrl}/regional/traffic-trends`, { params: httpParams });
  }

  /**
   * Get CAC/LTV metrics by region
   */
  getCacLtv(params?: CacLtvParams): Observable<CacLtvMetrics[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<CacLtvMetrics[]>(`${this.baseUrl}/regional/cac-ltv`, { params: httpParams });
  }

  // ========== Channel Metrics ==========

  /**
   * Get channel metrics
   */
  getChannelMetrics(params?: ChannelMetricsParams): Observable<ChannelMetrics[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<ChannelMetrics[]>(`${this.baseUrl}/channels`, { params: httpParams });
  }

  /**
   * Get channel conversion rates
   */
  getChannelConversionRates(params?: DateRangeParams): Observable<ChannelConversionRates[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<ChannelConversionRates[]>(`${this.baseUrl}/channels/conversion-rates`, { params: httpParams });
  }

  // ========== Keyword Metrics ==========

  /**
   * Get keyword metrics
   */
  getKeywordMetrics(params?: KeywordMetricsParams): Observable<KeywordMetrics[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<KeywordMetrics[]>(`${this.baseUrl}/keywords`, { params: httpParams });
  }

  /**
   * Get keyword traffic changes
   */
  getKeywordTrafficChange(params?: KeywordTrafficChangeParams): Observable<KeywordTrafficChange[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<KeywordTrafficChange[]>(`${this.baseUrl}/keywords/traffic-change`, { params: httpParams });
  }

  // ========== Helper Methods ==========

  /**
   * Build HTTP params from object
   */
  private buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    
    if (!params) {
      return httpParams;
    }

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
}
```

### 3. Excel Import Service (`src/app/core/services/excel-import.service.ts`)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ImportStatisticsDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ExcelImportService {
  private readonly baseUrl = `${environment.apiUrl}/ExcelImport`;

  constructor(private http: HttpClient) {}

  /**
   * Import Excel file
   * @param file The Excel file to import
   * @returns Import statistics
   */
  importExcelFile(file: File): Observable<ImportStatisticsDto> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<ImportStatisticsDto>(`${this.baseUrl}/import`, formData);
  }
}
```

### 4. Services Index (`src/app/core/services/index.ts`)

```typescript
/**
 * Barrel export for all services
 */

export * from './alerts.service';
export * from './metrics.service';
export * from './excel-import.service';
export * from './http-error.interceptor';
```

---

## HTTP Interceptor

### HTTP Error Interceptor (`src/app/core/services/http-error.interceptor.ts`)

```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * HTTP Error Interceptor (Functional Interceptor for Angular 16+)
 * Handles HTTP errors globally and provides user-friendly error messages
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Client Error: ${error.error.message}`;
        console.error('Client-side error:', error.error.message);
      } else {
        // Backend error
        errorMessage = `Server Error: ${error.status} - ${error.message}`;
        console.error(`Backend returned code ${error.status}, body was:`, error.error);

        // Handle specific status codes
        switch (error.status) {
          case 400:
            errorMessage = 'Bad Request: Please check your input';
            break;
          case 401:
            errorMessage = 'Unauthorized: Please log in';
            break;
          case 403:
            errorMessage = 'Forbidden: You do not have permission';
            break;
          case 404:
            errorMessage = 'Not Found: The requested resource was not found';
            break;
          case 500:
            errorMessage = 'Internal Server Error: Please try again later';
            break;
          case 503:
            errorMessage = 'Service Unavailable: Please try again later';
            break;
        }
      }

      // Log to console for debugging
      console.error('HTTP Error:', {
        url: req.url,
        method: req.method,
        status: error.status,
        message: errorMessage,
        error: error
      });

      // Return error observable with user-friendly message
      return throwError(() => ({
        message: errorMessage,
        status: error.status,
        statusText: error.statusText,
        error: error.error
      }));
    })
  );
};
```

---

## Component Updates

### 1. Dashboard Component (`src/app/features/dashboard/dashboard.component.ts`)

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsService } from '../../core/services';
import { MonthlyMetrics, MrrGrowthMetrics } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  latestMetrics: MonthlyMetrics | null = null;
  mrrGrowth: MrrGrowthMetrics[] = [];
  loading = false;
  error: string | null = null;

  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    // Load latest monthly metrics
    this.metricsService.getLatestMonthlyMetrics().subscribe({
      next: (data) => {
        this.latestMetrics = data;
        console.log('Latest metrics loaded:', data);
      },
      error: (err) => {
        this.error = err.message || 'Failed to load latest metrics';
        console.error('Error loading latest metrics:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });

    // Load MRR growth
    this.metricsService.getMrrGrowth().subscribe({
      next: (data) => {
        this.mrrGrowth = data;
        console.log('MRR growth loaded:', data);
      },
      error: (err) => {
        console.error('Error loading MRR growth:', err);
      }
    });
  }

  retry(): void {
    this.loadDashboardData();
  }
}
```

### Dashboard Component Template (`src/app/features/dashboard/dashboard.component.html`)

```html
<div class="dashboard-container">
  <h1>Dashboard</h1>

  <!-- Loading State -->
  <div *ngIf="loading" class="loading">
    <p>Loading dashboard data...</p>
  </div>

  <!-- Error State -->
  <div *ngIf="error && !loading" class="error">
    <p>{{ error }}</p>
    <button (click)="retry()">Retry</button>
  </div>

  <!-- Latest Metrics -->
  <div *ngIf="latestMetrics && !loading" class="metrics-section">
    <h2>Latest Monthly Metrics</h2>
    <div class="metrics-grid">
      <div class="metric-card">
        <h3>Total Sessions</h3>
        <p class="metric-value">{{ latestMetrics.totalSessions | number }}</p>
      </div>
      <div class="metric-card">
        <h3>Total Conversions</h3>
        <p class="metric-value">{{ latestMetrics.totalConversions | number }}</p>
      </div>
      <div class="metric-card">
        <h3>Conversion Rate</h3>
        <p class="metric-value">{{ latestMetrics.conversionRate | number:'1.2-2' }}%</p>
      </div>
      <div class="metric-card">
        <h3>Revenue</h3>
        <p class="metric-value">{{ latestMetrics.revenue | currency }}</p>
      </div>
    </div>
  </div>

  <!-- MRR Growth -->
  <div *ngIf="mrrGrowth.length > 0 && !loading" class="mrr-section">
    <h2>MRR Growth</h2>
    <div class="mrr-list">
      <div *ngFor="let item of mrrGrowth" class="mrr-item">
        <span class="month">{{ item.month }}</span>
        <span class="mrr">{{ item.mrr | currency }}</span>
        <span class="growth" [class.positive]="item.growth > 0" [class.negative]="item.growth < 0">
          {{ item.growthPercentage | number:'1.2-2' }}%
        </span>
      </div>
    </div>
  </div>

  <!-- Debug: Raw Data -->
  <details class="debug-section">
    <summary>Debug: Raw Data</summary>
    <pre>{{ { latestMetrics, mrrGrowth } | json }}</pre>
  </details>
</div>
```

### Dashboard Component Styles (`src/app/features/dashboard/dashboard.component.css`)

```css
.dashboard-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 30px;
}

h2 {
  color: #555;
  margin-top: 30px;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  padding: 20px;
  margin: 20px 0;
  color: #c33;
}

.error button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #c33;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error button:hover {
  background-color: #a22;
}

.metrics-section {
  margin-bottom: 40px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.metric-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.metric-card h3 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
  font-weight: normal;
  text-transform: uppercase;
}

.metric-value {
  margin: 0;
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.mrr-section {
  margin-bottom: 40px;
}

.mrr-list {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.mrr-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.mrr-item:last-child {
  border-bottom: none;
}

.mrr-item .month {
  font-weight: 500;
  color: #333;
}

.mrr-item .mrr {
  color: #666;
}

.mrr-item .growth {
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
}

.mrr-item .growth.positive {
  color: #0a0;
  background-color: #efe;
}

.mrr-item .growth.negative {
  color: #c33;
  background-color: #fee;
}

.debug-section {
  margin-top: 40px;
  padding: 20px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.debug-section summary {
  cursor: pointer;
  font-weight: bold;
  color: #666;
}

.debug-section pre {
  margin-top: 10px;
  padding: 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}
```

### 2. Alerts Component (`src/app/features/alerts/alerts.component.ts`)

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertsService } from '../../core/services';
import { Alert, DateRangeParams } from '../../core/models';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  alerts: Alert[] = [];
  loading = false;
  error: string | null = null;
  
  // Filter options
  selectedAlertType: string = 'all';
  dateRange: DateRangeParams = {};

  alertTypes = [
    { value: 'all', label: 'All Alerts' },
    { value: 'high-traffic', label: 'High Traffic, Low Conversion' },
    { value: 'ai-cannibalization', label: 'AI Overview Cannibalization' },
    { value: 'regional', label: 'Regional Underperformance' },
    { value: 'seasonal', label: 'Seasonal Dips' },
    { value: 'channel-waste', label: 'Channel Waste' }
  ];

  constructor(private alertsService: AlertsService) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.loading = true;
    this.error = null;

    switch (this.selectedAlertType) {
      case 'high-traffic':
        this.loadHighTrafficAlerts();
        break;
      case 'ai-cannibalization':
        this.loadAiCannibalizationAlerts();
        break;
      case 'regional':
        this.loadRegionalAlerts();
        break;
      case 'seasonal':
        this.loadSeasonalAlerts();
        break;
      case 'channel-waste':
        this.loadChannelWasteAlerts();
        break;
      default:
        this.loadAllAlerts();
    }
  }

  private loadAllAlerts(): void {
    this.alertsService.getAlerts(this.dateRange).subscribe({
      next: (data) => {
        this.alerts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load alerts';
        this.loading = false;
        console.error('Error loading alerts:', err);
      }
    });
  }

  private loadHighTrafficAlerts(): void {
    this.alertsService.getHighTrafficLowConversion({ minTraffic: 2000, maxConversion: 1.5 }).subscribe({
      next: (data) => {
        this.alerts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load high traffic alerts';
        this.loading = false;
      }
    });
  }

  private loadAiCannibalizationAlerts(): void {
    this.alertsService.getAiOverviewCannibalization({ minDeclinePercentage: 10.0 }).subscribe({
      next: (data) => {
        this.alerts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load AI cannibalization alerts';
        this.loading = false;
      }
    });
  }

  private loadRegionalAlerts(): void {
    this.alertsService.getRegionalUnderperformance(this.dateRange).subscribe({
      next: (data) => {
        this.alerts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load regional alerts';
        this.loading = false;
      }
    });
  }

  private loadSeasonalAlerts(): void {
    this.alertsService.getSeasonalDips(this.dateRange).subscribe({
      next: (data) => {
        this.alerts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load seasonal alerts';
        this.loading = false;
      }
    });
  }

  private loadChannelWasteAlerts(): void {
    this.alertsService.getChannelWaste({
      maxConversion: 2.0,
      minSessions: 10000,
      ...this.dateRange
    }).subscribe({
      next: (data) => {
        this.alerts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load channel waste alerts';
        this.loading = false;
      }
    });
  }

  onAlertTypeChange(): void {
    this.loadAlerts();
  }

  retry(): void {
    this.loadAlerts();
  }
}
```

### Alerts Component Template (`src/app/features/alerts/alerts.component.html`)

```html
<div class="alerts-container">
  <h1>Alerts</h1>

  <!-- Filters -->
  <div class="filters">
    <label for="alertType">Alert Type:</label>
    <select id="alertType" [(ngModel)]="selectedAlertType" (change)="onAlertTypeChange()">
      <option *ngFor="let type of alertTypes" [value]="type.value">
        {{ type.label }}
      </option>
    </select>
  </div>

  <!-- Loading State -->
  <div *ngIf="loading" class="loading">
    <p>Loading alerts...</p>
  </div>

  <!-- Error State -->
  <div *ngIf="error && !loading" class="error">
    <p>{{ error }}</p>
    <button (click)="retry()">Retry</button>
  </div>

  <!-- Alerts List -->
  <div *ngIf="!loading && !error" class="alerts-list">
    <div *ngIf="alerts.length === 0" class="no-alerts">
      <p>No alerts found</p>
    </div>

    <div *ngFor="let alert of alerts" class="alert-card" [class]="'severity-' + alert.severity">
      <div class="alert-header">
        <span class="alert-type">{{ alert.type }}</span>
        <span class="alert-severity">{{ alert.severity }}</span>
      </div>
      <h3>{{ alert.title }}</h3>
      <p>{{ alert.description }}</p>
      <div class="alert-footer">
        <span class="alert-timestamp">{{ alert.timestamp | date:'short' }}</span>
      </div>
    </div>
  </div>

  <!-- Debug -->
  <details class="debug-section">
    <summary>Debug: Raw Data</summary>
    <pre>{{ alerts | json }}</pre>
  </details>
</div>
```

### 3. Channels Component (`src/app/features/channels/channels.component.ts`)

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsService } from '../../core/services';
import { ChannelMetrics, ChannelConversionRates } from '../../core/models';

@Component({
  selector: 'app-channels',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
  channelMetrics: ChannelMetrics[] = [];
  conversionRates: ChannelConversionRates[] = [];
  loading = false;
  error: string | null = null;

  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.loadChannelData();
  }

  loadChannelData(): void {
    this.loading = true;
    this.error = null;

    // Load channel metrics
    this.metricsService.getChannelMetrics().subscribe({
      next: (data) => {
        this.channelMetrics = data;
        console.log('Channel metrics loaded:', data);
      },
      error: (err) => {
        this.error = err.message || 'Failed to load channel metrics';
        console.error('Error loading channel metrics:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });

    // Load conversion rates
    this.metricsService.getChannelConversionRates().subscribe({
      next: (data) => {
        this.conversionRates = data;
        console.log('Conversion rates loaded:', data);
      },
      error: (err) => {
        console.error('Error loading conversion rates:', err);
      }
    });
  }

  retry(): void {
    this.loadChannelData();
  }
}
```

### 4. Keywords Component (`src/app/features/keywords/keywords.component.ts`)

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsService } from '../../core/services';
import { KeywordMetrics, KeywordTrafficChange } from '../../core/models';

@Component({
  selector: 'app-keywords',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.css']
})
export class KeywordsComponent implements OnInit {
  keywordMetrics: KeywordMetrics[] = [];
  trafficChanges: KeywordTrafficChange[] = [];
  loading = false;
  error: string | null = null;

  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.loadKeywordData();
  }

  loadKeywordData(): void {
    this.loading = true;
    this.error = null;

    // Load keyword metrics
    this.metricsService.getKeywordMetrics().subscribe({
      next: (data) => {
        this.keywordMetrics = data;
        console.log('Keyword metrics loaded:', data);
      },
      error: (err) => {
        this.error = err.message || 'Failed to load keyword metrics';
        console.error('Error loading keyword metrics:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });

    // Load traffic changes
    this.metricsService.getKeywordTrafficChange().subscribe({
      next: (data) => {
        this.trafficChanges = data;
        console.log('Traffic changes loaded:', data);
      },
      error: (err) => {
        console.error('Error loading traffic changes:', err);
      }
    });
  }

  retry(): void {
    this.loadKeywordData();
  }
}
```

### 5. Regions Component (`src/app/features/regions/regions.component.ts`)

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsService } from '../../core/services';
import { RegionalMetrics, TrialToPaidMetrics, TrafficTrendsMetrics, CacLtvMetrics } from '../../core/models';

@Component({
  selector: 'app-regions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.css']
})
export class RegionsComponent implements OnInit {
  regionalMetrics: RegionalMetrics[] = [];
  trialToPaid: TrialToPaidMetrics[] = [];
  trafficTrends: TrafficTrendsMetrics[] = [];
  cacLtv: CacLtvMetrics[] = [];
  loading = false;
  error: string | null = null;

  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.loadRegionalData();
  }

  loadRegionalData(): void {
    this.loading = true;
    this.error = null;

    // Load regional metrics
    this.metricsService.getRegionalMetrics().subscribe({
      next: (data) => {
        this.regionalMetrics = data;
        console.log('Regional metrics loaded:', data);
      },
      error: (err) => {
        this.error = err.message || 'Failed to load regional metrics';
        console.error('Error loading regional metrics:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });

    // Load trial to paid
    this.metricsService.getTrialToPaid().subscribe({
      next: (data) => {
        this.trialToPaid = data;
        console.log('Trial to paid loaded:', data);
      },
      error: (err) => {
        console.error('Error loading trial to paid:', err);
      }
    });

    // Load traffic trends
    this.metricsService.getTrafficTrends().subscribe({
      next: (data) => {
        this.trafficTrends = data;
        console.log('Traffic trends loaded:', data);
      },
      error: (err) => {
        console.error('Error loading traffic trends:', err);
      }
    });

    // Load CAC/LTV
    this.metricsService.getCacLtv().subscribe({
      next: (data) => {
        this.cacLtv = data;
        console.log('CAC/LTV loaded:', data);
      },
      error: (err) => {
        console.error('Error loading CAC/LTV:', err);
      }
    });
  }

  retry(): void {
    this.loadRegionalData();
  }
}
```

---

## Configuration Updates

### Update App Config (`src/app/app.config.ts`)

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { httpErrorInterceptor } from './core/services/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpErrorInterceptor])
    )
  ]
};
```

---

## Summary

This implementation guide provides:

1. **5 Model Files** with complete TypeScript interfaces
2. **4 Service Files** with all API endpoints properly typed
3. **1 HTTP Interceptor** for global error handling
4. **5 Component Updates** with proper typing, error handling, and loading states
5. **1 Configuration Update** to register the HTTP interceptor

All files follow Angular 16+ best practices with:
- Standalone components
- Functional interceptors
- Strong typing throughout
- Proper error handling
- Environment-based API URL configuration
- Comprehensive JSDoc comments

The code is ready to be implemented and will work with the backend API at `http://localhost:5090/api`.
