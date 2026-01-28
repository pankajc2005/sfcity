import { FIR, FilterCriteria } from '../types';
/**
 * FIR Service - Manages FIR data operations
 *
 * For MVP, uses in-memory storage (localStorage fallback)
 * In production, would integrate with backend API
 */
declare class FIRService {
    private firData;
    private storageKey;
    constructor();
    /**
     * Load FIR data from localStorage
     */
    private loadFromStorage;
    /**
     * Save FIR data to localStorage
     * Time Complexity: O(n) for JSON serialization
     */
    private saveToStorage;
    /**
     * Add a single FIR record
     * Validates and sanitizes before adding
     * Returns: { success, firId, error }
     */
    addFIR(fir: FIR): {
        success: boolean;
        firId?: string;
        error?: string;
    };
    /**
     * Add multiple FIR records in batch
     * Time Complexity: O(n) where n = number of records
     */
    addFIRBatch(firs: FIR[]): {
        success: number;
        failed: number;
        errors: {
            fir: FIR;
            error: string;
        }[];
    };
    /**
     * Get all FIR records
     * Time Complexity: O(1) - returns reference to array
     */
    getAll(): FIR[];
    /**
     * Get FIR by ID
     * Time Complexity: O(n) - linear search
     */
    getFIRById(id: string): FIR | undefined;
    /**
     * Search FIRs by criteria
     * Time Complexity: O(n) where n = total FIRs
     * Uses filter chaining for multiple conditions
     */
    search(criteria: FilterCriteria): FIR[];
    /**
     * Update FIR record
     * Time Complexity: O(n) - linear search
     */
    updateFIR(id: string, updates: Partial<FIR>): boolean;
    /**
     * Delete FIR record by ID
     * Time Complexity: O(n)
     */
    deleteFIR(id: string): boolean;
    /**
     * Get statistics about FIR data
     * Time Complexity: O(n)
     */
    getStatistics(): {
        total: number;
        byType: {
            [key: string]: number;
        };
        byArea: {
            [key: string]: number;
        };
        dateRange: {
            earliest: Date | null;
            latest: Date | null;
        };
    };
    /**
     * Clear all FIR data
     * Use with caution - typically for testing only
     */
    clear(): void;
    /**
     * Export data as CSV format
     * Time Complexity: O(n)
     */
    exportAsCSV(firs?: FIR[]): string;
}
export declare const firService: FIRService;
export {};
//# sourceMappingURL=firService.d.ts.map