import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildHttpParams } from '../utils/http-params.util';
import {
  MonthlyMetrics,
  MonthlyMetricsParams,
  RegionalMetrics,
  TrialToPaidMetrics,
  TrafficTrendsMetrics,
  CacLtvMetrics,
  CacLtvParams,
  ChannelMetrics,
  ChannelMonthlyMetrics,
  ChannelAggregatedMetrics,
  ChannelMetricsParams,
  ChannelConversionRates,
  KeywordMetrics,
  KeywordMetricsParams,
  KeywordTrafficChange,
  KeywordTrafficChangeParams,
  DateRangeParams,
  MonthlyMrr
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private readonly baseUrl = `${environment.apiUrl}/Metrics`;

  constructor(private http: HttpClient) {}

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
    const httpParams = buildHttpParams(params);
    return this.http.get<MonthlyMetrics[]>(`${this.baseUrl}/monthly`, { params: httpParams });
  }

  /**
   * Get MRR history for the specified number of months
   */
  getMrrHistory(months: number = 12): Observable<MonthlyMrr[]> {
    return this.http.get<MonthlyMrr[]>(`${this.baseUrl}/mrr-history?months=${months}`);
  }

  /**
   * Get all regional performance metrics
   */
  getAllRegionalPerformance(): Observable<RegionalMetrics[]> {
    return this.http.get<RegionalMetrics[]>(`${this.baseUrl}/regional/all`);
  }

  /**
   * Get regional metrics with optional filtering
   */
  getRegionalMetrics(params?: RegionalMetrics): Observable<RegionalMetrics[]> {
    const httpParams = buildHttpParams(params);
    return this.http.get<RegionalMetrics[]>(`${this.baseUrl}/regional`, { params: httpParams });
  }

  /**
   * Get trial to paid conversion metrics by region
   */
  getTrialToPaid(params?: DateRangeParams): Observable<TrialToPaidMetrics[]> {
    const httpParams = buildHttpParams(params);
    return this.http.get<TrialToPaidMetrics[]>(`${this.baseUrl}/regional/trial-to-paid`, { params: httpParams });
  }

  /**
   * Get traffic trends by region
   */
  getTrafficTrends(params?: DateRangeParams): Observable<TrafficTrendsMetrics[]> {
    const httpParams = buildHttpParams(params);
    return this.http.get<TrafficTrendsMetrics[]>(`${this.baseUrl}/regional/traffic-trends`, { params: httpParams });
  }

  /**
   * Get customer acquisition cost and lifetime value metrics
   */
  getCacLtv(params?: CacLtvParams): Observable<CacLtvMetrics[]> {
    const httpParams = buildHttpParams(params);
    return this.http.get<CacLtvMetrics[]>(`${this.baseUrl}/regional/cac-ltv`, { params: httpParams });
  }

  /**
   * Get channel metrics (legacy endpoint)
   * @deprecated Use getAllChannelMetrics() for monthly data
   */
  getChannelMetrics(params?: ChannelMetricsParams): Observable<ChannelMetrics[]> {
    const httpParams = buildHttpParams(params);
    return this.http.get<ChannelMetrics[]>(`${this.baseUrl}/channels`, { params: httpParams });
  }

  /**
   * Get all channel metrics with monthly breakdown
   */
  getAllChannelMetrics(): Observable<ChannelMonthlyMetrics[]> {
    return this.http.get<ChannelMonthlyMetrics[]>(`${this.baseUrl}/channels/all`);
  }

  /**
   * Get aggregated channel metrics (future implementation)
   */
  getAggregatedChannelMetrics(params?: {
    startDate?: string;
    endDate?: string;
    channels?: string[];
  }): Observable<ChannelAggregatedMetrics[]> {
    const httpParams = buildHttpParams(params);
    return this.http.get<ChannelAggregatedMetrics[]>(
      `${this.baseUrl}/channels/aggregated`,
      { params: httpParams }
    );
  }

  /**
   * Get channel conversion rates
   */
  getChannelConversionRates(params?: DateRangeParams): Observable<ChannelConversionRates[]> {
    const httpParams = buildHttpParams(params);
    return this.http.get<ChannelConversionRates[]>(`${this.baseUrl}/channels/conversion-rates`, { params: httpParams });
  }

  /**
   * Get keyword performance metrics
   */
  getKeywordMetrics(params?: KeywordMetricsParams): Observable<KeywordMetrics[]> {
    const httpParams = buildHttpParams(params);
    return this.http.get<KeywordMetrics[]>(`${this.baseUrl}/keywords`, { params: httpParams });
  }

  /**
   * Get keyword traffic changes over time
   */
  getKeywordTrafficChange(params?: KeywordTrafficChangeParams): Observable<KeywordTrafficChange[]> {
    const httpParams = buildHttpParams(params);
    return this.http.get<KeywordTrafficChange[]>(`${this.baseUrl}/keywords/traffic-change`, { params: httpParams });
  }
}
