import { FIR, Hotspot } from '../types';
import { detectHotspots } from '../utils/geoUtils';

/**
 * Hotspot Service - Analyzes crime density and generates hotspot zones
 *
 * Provides:
 * - Hotspot detection from FIR data
 * - Severity classification
 * - Trend analysis over time
 * - Risk zone identification
 */
class HotspotService {
  /**
   * Analyzes FIR data to detect crime hotspots
   * Returns sorted hotspots by severity and density
   *
   * Time Complexity: O(n + g) where n = FIRs, g = grid cells
   */
  detectHotspots(firs: FIR[]): Hotspot[] {
    if (firs.length === 0) return [];

    const hotspots = detectHotspots(firs);

    // Sort by severity (high > medium > low) then by FIR count
    return hotspots.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      const severityDiff =
        severityOrder[a.severity] - severityOrder[b.severity];

      if (severityDiff !== 0) return severityDiff;

      return b.firCount - a.firCount;
    });
  }

  /**
   * Filters hotspots by severity level
   * Time Complexity: O(n) where n = hotspots
   */
  filterBySeverity(hotspots: Hotspot[], severity: 'high' | 'medium' | 'low'): Hotspot[] {
    return hotspots.filter((h) => h.severity === severity);
  }

  /**
   * Gets hotspots that require immediate attention (high severity)
   */
  getHighRiskZones(hotspots: Hotspot[]): Hotspot[] {
    return this.filterBySeverity(hotspots, 'high');
  }

  /**
   * Calculates risk score for a hotspot (0-100)
   * Considers FIR count, percentage, and frequency
   */
  calculateRiskScore(hotspot: Hotspot, _totalFIRs: number): number {
    // Base score from percentage (0-50)
    const percentageScore = Math.min((hotspot.percentage / 2), 50);

    // Severity multiplier
    const severityMultiplier = {
      high: 1.5,
      medium: 1.0,
      low: 0.5,
    };

    const score = percentageScore * severityMultiplier[hotspot.severity];

    return Math.min(score, 100);
  }

  /**
   * Generates hotspot statistics
   */
  getStatistics(hotspots: Hotspot[]): {
    totalHotspots: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    topZones: Hotspot[];
    averageFIRsPerHotspot: number;
  } {
    const highRisk = this.filterBySeverity(hotspots, 'high').length;
    const mediumRisk = this.filterBySeverity(hotspots, 'medium').length;
    const lowRisk = this.filterBySeverity(hotspots, 'low').length;

    const totalFIRsInHotspots = hotspots.reduce((sum, h) => sum + h.firCount, 0);

    return {
      totalHotspots: hotspots.length,
      highRisk,
      mediumRisk,
      lowRisk,
      topZones: hotspots.slice(0, 5),
      averageFIRsPerHotspot:
        hotspots.length > 0 ? totalFIRsInHotspots / hotspots.length : 0,
    };
  }

  /**
   * Finds hotspots that have grown or shrunk over time periods
   * Compares two hotspot arrays from different time periods
   *
   * Returns trends: growing, shrinking, stable
   */
  analyzeTrends(
    currentHotspots: Hotspot[],
    previousHotspots: Hotspot[]
  ): {
    growing: Array<{ zone: Hotspot; percentageChange: number }>;
    shrinking: Array<{ zone: Hotspot; percentageChange: number }>;
    stable: Hotspot[];
  } {
    const trends = {
      growing: [] as Array<{ zone: Hotspot; percentageChange: number }>,
      shrinking: [] as Array<{ zone: Hotspot; percentageChange: number }>,
      stable: [] as Hotspot[],
    };

    const previousMap = new Map(previousHotspots.map((h) => [h.zoneId, h]));

    currentHotspots.forEach((current) => {
      const previous = previousMap.get(current.zoneId);

      if (!previous) {
        trends.growing.push({
          zone: current,
          percentageChange: 100,
        });
      } else {
        const change = ((current.firCount - previous.firCount) / previous.firCount) * 100;

        if (change > 10) {
          trends.growing.push({ zone: current, percentageChange: change });
        } else if (change < -10) {
          trends.shrinking.push({ zone: current, percentageChange: change });
        } else {
          trends.stable.push(current);
        }
      }
    });

    return trends;
  }
}

export const hotspotService = new HotspotService();
