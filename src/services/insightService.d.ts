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
declare class InsightService {
    /**
     * Generates comprehensive crime insights from FIR data
     */
    generateInsights(firs: FIR[]): CrimeInsight;
    /**
     * Analyzes peak crime hours (0-23)
     * Returns array of hours with crime counts
     *
     * Time Complexity: O(n) for counting
     */
    getPeakHours(firs: FIR[]): {
        hour: number;
        count: number;
    }[];
    /**
     * Analyzes crime distribution by day of week
     * Time Complexity: O(n)
     */
    getDayWiseTrends(firs: FIR[]): {
        day: string;
        count: number;
    }[];
    /**
     * Gets most frequent crime types
     * Time Complexity: O(n log n)
     */
    getTopCrimeTypes(firs: FIR[], limit?: number): {
        type: string;
        count: number;
    }[];
    /**
     * Analyzes crimes by month
     */
    getMonthlyTrends(firs: FIR[]): {
        month: string;
        count: number;
    }[];
    /**
     * Gets crime statistics by area
     */
    getAreaStatistics(firs: FIR[]): {
        area: string;
        count: number;
    }[];
    /**
     * Calculates crime rate change between two periods
     */
    calculateTrendChange(current: FIR[], previous: FIR[]): number;
    /**
     * Predicts peak hours for patrol planning
     * Returns top 3 hours with highest crime
     */
    getPredictedPeakHours(firs: FIR[]): number[];
    /**
     * Gets high-risk days for patrol planning
     */
    getHighRiskDays(firs: FIR[]): string[];
}
export declare const insightService: InsightService;
export {};
//# sourceMappingURL=insightService.d.ts.map