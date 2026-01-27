import { FIR, CrimeInsight } from '../types';

/**
 * Insight Service - Generates crime patterns and statistical insights
 *
 * Analyzes:
 * - Peak crime hours
 * - Daily trends
 * - Crime type distribution
 * - Time-based patterns
 *
 * Time Complexity: O(n log n) for sorting operations
 */
class InsightService {
  /**
   * Generates comprehensive crime insights from FIR data
   */
  generateInsights(firs: FIR[]): CrimeInsight {
    return {
      peakHours: this.getPeakHours(firs),
      dayWiseTrends: this.getDayWiseTrends(firs),
      topCrimeTypes: this.getTopCrimeTypes(firs),
      totalFIRs: firs.length,
      totalHotspots: 0, // Set by caller
      generatedAt: new Date(),
    };
  }

  /**
   * Analyzes peak crime hours (0-23)
   * Returns array of hours with crime counts
   *
   * Time Complexity: O(n) for counting
   */
  getPeakHours(firs: FIR[]): { hour: number; count: number }[] {
    const hourCounts: { [key: number]: number } = {};

    firs.forEach((fir) => {
      const hour = parseInt(fir.time.split(':')[0], 10);
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    return Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: hourCounts[i] || 0,
    })).sort((a, b) => b.count - a.count);
  }

  /**
   * Analyzes crime distribution by day of week
   * Time Complexity: O(n)
   */
  getDayWiseTrends(firs: FIR[]): { day: string; count: number }[] {
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dayCounts: { [key: number]: number } = {};

    firs.forEach((fir) => {
      const day = fir.date.getDay();
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    return dayNames.map((day, index) => ({
      day,
      count: dayCounts[index] || 0,
    }));
  }

  /**
   * Gets most frequent crime types
   * Time Complexity: O(n log n)
   */
  getTopCrimeTypes(
    firs: FIR[],
    limit: number = 10
  ): { type: string; count: number }[] {
    const typeCounts: { [key: string]: number } = {};

    firs.forEach((fir) => {
      typeCounts[fir.crimeType] = (typeCounts[fir.crimeType] || 0) + 1;
    });

    return Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Analyzes crimes by month
   */
  getMonthlyTrends(firs: FIR[]): { month: string; count: number }[] {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const monthCounts: { [key: number]: number } = {};

    firs.forEach((fir) => {
      const month = fir.date.getMonth();
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });

    return monthNames.map((month, index) => ({
      month,
      count: monthCounts[index] || 0,
    }));
  }

  /**
   * Gets crime statistics by area
   */
  getAreaStatistics(firs: FIR[]): { area: string; count: number }[] {
    const areaCounts: { [key: string]: number } = {};

    firs.forEach((fir) => {
      areaCounts[fir.area] = (areaCounts[fir.area] || 0) + 1;
    });

    return Object.entries(areaCounts)
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Calculates crime rate change between two periods
   */
  calculateTrendChange(current: FIR[], previous: FIR[]): number {
    if (previous.length === 0) return current.length > 0 ? 100 : 0;

    const change = ((current.length - previous.length) / previous.length) * 100;
    return parseFloat(change.toFixed(2));
  }

  /**
   * Predicts peak hours for patrol planning
   * Returns top 3 hours with highest crime
   */
  getPredictedPeakHours(firs: FIR[]): number[] {
    const peakHours = this.getPeakHours(firs).slice(0, 3);
    return peakHours.map((h) => h.hour);
  }

  /**
   * Gets high-risk days for patrol planning
   */
  getHighRiskDays(firs: FIR[]): string[] {
    const dayTrends = this.getDayWiseTrends(firs);
    const avgCount = dayTrends.reduce((sum, d) => sum + d.count, 0) / 7;

    return dayTrends
      .filter((d) => d.count > avgCount)
      .map((d) => d.day);
  }
}

export const insightService = new InsightService();
