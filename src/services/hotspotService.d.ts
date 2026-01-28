import { FIR, Hotspot } from '../types';
/**
 * Hotspot Service - Analyzes crime density and generates hotspot zones
 *
 * Provides:
 * - Hotspot detection from FIR data
 * - Severity classification
 * - Trend analysis over time
 * - Risk zone identification
 */
declare class HotspotService {
    /**
     * Analyzes FIR data to detect crime hotspots
     * Returns sorted hotspots by severity and density
     *
     * Time Complexity: O(n + g) where n = FIRs, g = grid cells
     */
    detectHotspots(firs: FIR[]): Hotspot[];
    /**
     * Filters hotspots by severity level
     * Time Complexity: O(n) where n = hotspots
     */
    filterBySeverity(hotspots: Hotspot[], severity: 'high' | 'medium' | 'low'): Hotspot[];
    /**
     * Gets hotspots that require immediate attention (high severity)
     */
    getHighRiskZones(hotspots: Hotspot[]): Hotspot[];
    /**
     * Calculates risk score for a hotspot (0-100)
     * Considers FIR count, percentage, and frequency
     */
    calculateRiskScore(hotspot: Hotspot, _totalFIRs: number): number;
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
    };
    /**
     * Finds hotspots that have grown or shrunk over time periods
     * Compares two hotspot arrays from different time periods
     *
     * Returns trends: growing, shrinking, stable
     */
    analyzeTrends(currentHotspots: Hotspot[], previousHotspots: Hotspot[]): {
        growing: Array<{
            zone: Hotspot;
            percentageChange: number;
        }>;
        shrinking: Array<{
            zone: Hotspot;
            percentageChange: number;
        }>;
        stable: Hotspot[];
    };
}
export declare const hotspotService: HotspotService;
export {};
//# sourceMappingURL=hotspotService.d.ts.map