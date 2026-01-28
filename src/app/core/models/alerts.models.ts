/**
 * Alert-related models
 */

/**
 * Alert interface representing system alerts with severity levels
 */
export interface Alert {
  message: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  detectedAt: string;
  recommendedAction?: string;
  alertType?: string;
  entity?: string;
  value?: number;
  threshold?: number;
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
