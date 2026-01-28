import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Generic API service for basic data fetching
 * @deprecated Use specific services (MetricsService, AlertsService) instead
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMonthlyMetrics() {
    return this.http.get(`${this.baseUrl}/metrics/monthly`);
  }

  getKeywordPerformance() {
    return this.http.get(`${this.baseUrl}/keywords`);
  }

  getRegionalPerformance() {
    return this.http.get(`${this.baseUrl}/regions`);
  }

  getChannelPerformance() {
    return this.http.get(`${this.baseUrl}/channels`);
  }

  getAlerts() {
    return this.http.get(`${this.baseUrl}/alerts`);
  }
}
