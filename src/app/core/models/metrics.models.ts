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
  [key: string]: any;
}

export interface MonthlyMetricsParams {
  startDate?: string;
  endDate?: string;
}

export interface MonthlyMrr {
  month: number;
  year: number;
  mrrUsd: number;
}

/**
 * Regional performance metrics with support for both raw and aggregated data
 */
export interface RegionalMetrics {
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

// New separated interfaces
export type { ChannelMonthlyMetrics } from './channel-monthly-metrics';
export type { ChannelAggregatedMetrics } from './channel-aggregated-metrics';

// Legacy interface (keep for backward compatibility)
/**
 * @deprecated Use ChannelMonthlyMetrics or ChannelAggregatedMetrics instead
 */
export interface ChannelMetrics {
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

export interface ChannelMetricsParams {
  startDate?: string;
  endDate?: string;
  channels?: string[];
}

export interface ChannelConversionRates {
  channel: string;
  conversionRate: number;
  period: string;
}

/**
 * Keyword performance metrics with year-over-year comparison
 */
export interface KeywordMetrics {
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
