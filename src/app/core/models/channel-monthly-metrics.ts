/**
 * Monthly channel performance metrics
 * Represents raw data from API endpoint: /api/Metrics/channels/all
 * 
 * This interface matches the API response exactly without any transformations.
 * All formatting should be done at the template level.
 */
export interface ChannelMonthlyMetrics {
  /**
   * Month in YYYY-MM format (e.g., "2024-01")
   */
  month: string;

  /**
   * Channel name (e.g., "Organic Search", "Paid Search", "Direct")
   */
  channel: string;

  /**
   * Total number of sessions for this channel in this month
   */
  sessions: number;

  /**
   * Number of signups/conversions for this channel in this month
   */
  signups: number;

  /**
   * Conversion rate as a percentage (e.g., 3.09 means 3.09%)
   */
  conversionRate: number;

  /**
   * Average session duration in seconds
   */
  avgSessionDurationSec: number;

  /**
   * Bounce rate as a decimal (0-1, where 0.56 = 56%)
   */
  bounceRate: number;

  /**
   * Average number of pages viewed per session
   */
  pagesPerSession: number;
}
