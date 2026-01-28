import { MonthlyMetrics } from './metrics.models';

/**
 * Extended metrics interface for dashboard-specific fields
 */
export interface DashboardMetrics extends MonthlyMetrics {
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

/**
 * Funnel stage data
 */
export interface FunnelData {
  stage: string;
  value: number;
  percentage: number;
  color?: string;
}


/**
 * Generic chart data point
 */
export interface ChartDataPoint {
  label: string;
  value: number;
}

/**
 * Table column definition
 */
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'currency' | 'percentage';
  format?: (value: any) => string;
}

/**
 * Dashboard section state for granular loading/error handling
 */
export interface SectionState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

/**
 * Complete dashboard state
 */
export interface DashboardState {
  executiveSummary: SectionState<DashboardMetrics>;
  mrrGrowth: SectionState<ChartDataPoint[]>;
  trafficTrends: SectionState<ChartDataPoint[]>;
  conversionFunnel: SectionState<FunnelData[]>;
  keywords: SectionState<any[]>;
  regions: SectionState<any[]>;
  channels: SectionState<any[]>;
  alerts: SectionState<any[]>;
}
