/**
 * Aggregated channel metrics across time periods
 * Used for summary views and analytics
 * 
 * This interface is for future server-side aggregation endpoints.
 * Not used in the initial implementation but prepared for scalability.
 */
export interface ChannelAggregatedMetrics {
  /**
   * Channel name
   */
  channel: string;

  /**
   * Total sessions across all months in the period
   */
  totalSessions: number;

  /**
   * Total signups across all months in the period
   */
  totalSignups: number;

  /**
   * Average conversion rate across the period
   */
  avgConversionRate: number;

  /**
   * Average session duration in seconds across the period
   */
  avgSessionDurationSec: number;

  /**
   * Average bounce rate across the period (0-1 decimal)
   */
  avgBounceRate: number;

  /**
   * Average pages per session across the period
   */
  avgPagesPerSession: number;

  /**
   * Number of months included in this aggregation
   */
  monthCount: number;

  /**
   * Start of aggregation period (YYYY-MM format)
   */
  periodStart?: string;

  /**
   * End of aggregation period (YYYY-MM format)
   */
  periodEnd?: string;
}
