import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildHttpParams } from '../utils/http-params.util';
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
    const httpParams = buildHttpParams(params);
    return this.http.get<Alert[]>(this.baseUrl, { params: httpParams });
  }

  /**
   * Get high traffic, low conversion alerts
   */
  getHighTrafficLowConversion(params?: HighTrafficLowConversionParams): Observable<Alert[]> {
    const httpParams = buildHttpParams(params);
    return this.http.get<Alert[]>(`${this.baseUrl}/high-traffic-low-conversion`, { params: httpParams });
  }

  /**
   * Get AI overview cannibalization alerts
   */
  getAiOverviewCannibalization(params?: AiOverviewCannibalizationParams): Observable<Alert[]> {
    const httpParams = buildHttpParams(params);
    return this.http.get<Alert[]>(`${this.baseUrl}/ai-overview-cannibalization`, { params: httpParams });
  }

  /**
   * Get regional underperformance alerts
   */
  getRegionalUnderperformance(params?: DateRangeParams): Observable<Alert[]> {
    const httpParams = buildHttpParams(params);
    return this.http.get<Alert[]>(`${this.baseUrl}/regional-underperformance`, { params: httpParams });
  }

  /**
   * Get seasonal dips alerts
   */
  getSeasonalDips(params?: DateRangeParams): Observable<Alert[]> {
    const httpParams = buildHttpParams(params);
    return this.http.get<Alert[]>(`${this.baseUrl}/seasonal-dips`, { params: httpParams });
  }

  /**
   * Get channel waste alerts
   */
  getChannelWaste(params?: ChannelWasteParams): Observable<Alert[]> {
    const httpParams = buildHttpParams(params);
    return this.http.get<Alert[]>(`${this.baseUrl}/channel-waste`, { params: httpParams });
  }
}
