import { FIR, FilterCriteria } from '../types';
import { validateFIR, sanitizeFIR } from '../utils/validation';

/**
 * FIR Service - Manages FIR data operations
 *
 * For MVP, uses in-memory storage (localStorage fallback)
 * In production, would integrate with backend API
 */
class FIRService {
  private firData: FIR[] = [];
  private storageKey = 'safecity_fir_data';

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Load FIR data from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.firData = parsed.map((item: any) => ({
          ...item,
          date: new Date(item.date), // Rehydrate Date objects
        }));
      }
    } catch (error) {
      console.error('Failed to load FIR data from storage:', error);
      this.firData = [];
    }
  }

  /**
   * Save FIR data to localStorage
   * Time Complexity: O(n) for JSON serialization
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.firData));
    } catch (error) {
      console.error('Failed to save FIR data to storage:', error);
    }
  }

  /**
   * Add a single FIR record
   * Validates and sanitizes before adding
   * Returns: { success, firId, error }
   */
  addFIR(fir: FIR): { success: boolean; firId?: string; error?: string } {
    const validation = validateFIR(fir);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', '),
      };
    }

    const sanitized = sanitizeFIR(fir);
    this.firData.push(sanitized);
    this.saveToStorage();

    return { success: true, firId: sanitized.id };
  }

  /**
   * Add multiple FIR records in batch
   * Time Complexity: O(n) where n = number of records
   */
  addFIRBatch(firs: FIR[]): {
    success: number;
    failed: number;
    errors: { fir: FIR; error: string }[];
  } {
    const errors: { fir: FIR; error: string }[] = [];
    let success = 0;
    let failed = 0;

    firs.forEach((fir) => {
      const result = this.addFIR(fir);
      if (result.success) {
        success++;
      } else {
        failed++;
        errors.push({ fir, error: result.error || 'Unknown error' });
      }
    });

    return { success, failed, errors };
  }

  /**
   * Get all FIR records
   * Time Complexity: O(1) - returns reference to array
   */
  getAll(): FIR[] {
    return [...this.firData]; // Return copy to prevent direct mutation
  }

  /**
   * Get FIR by ID
   * Time Complexity: O(n) - linear search
   */
  getFIRById(id: string): FIR | undefined {
    return this.firData.find((fir) => fir.id === id);
  }

  /**
   * Search FIRs by criteria
   * Time Complexity: O(n) where n = total FIRs
   * Uses filter chaining for multiple conditions
   */
  search(criteria: FilterCriteria): FIR[] {
    let results = [...this.firData];

    // Filter by date range
    if (criteria.dateFrom) {
      results = results.filter((fir) => fir.date >= criteria.dateFrom!);
    }
    if (criteria.dateTo) {
      results = results.filter((fir) => fir.date <= criteria.dateTo!);
    }

    // Filter by crime types
    if (criteria.crimeTypes.length > 0) {
      results = results.filter((fir) =>
        criteria.crimeTypes.includes(fir.crimeType)
      );
    }

    // Filter by areas
    if (criteria.areas.length > 0) {
      results = results.filter((fir) => criteria.areas.includes(fir.area));
    }

    // Filter by zones
    if (criteria.zones.length > 0) {
      results = results.filter((fir) => criteria.zones.includes(fir.zone));
    }

    // Filter by police stations
    if (criteria.policeStations.length > 0) {
      results = results.filter((fir) =>
        criteria.policeStations.includes(fir.policeStation)
      );
    }

    // Filter by severity
    if (criteria.severity) {
      results = results.filter((fir) => fir.severity === criteria.severity);
    }

    return results;
  }

  /**
   * Update FIR record
   * Time Complexity: O(n) - linear search
   */
  updateFIR(id: string, updates: Partial<FIR>): boolean {
    const index = this.firData.findIndex((fir) => fir.id === id);

    if (index === -1) return false;

    const updated = { ...this.firData[index], ...updates, id }; // Prevent ID change
    const validation = validateFIR(updated);

    if (!validation.valid) return false;

    this.firData[index] = sanitizeFIR(updated);
    this.saveToStorage();

    return true;
  }

  /**
   * Delete FIR record by ID
   * Time Complexity: O(n)
   */
  deleteFIR(id: string): boolean {
    const index = this.firData.findIndex((fir) => fir.id === id);

    if (index === -1) return false;

    this.firData.splice(index, 1);
    this.saveToStorage();

    return true;
  }

  /**
   * Get statistics about FIR data
   * Time Complexity: O(n)
   */
  getStatistics(): {
    total: number;
    byType: { [key: string]: number };
    byArea: { [key: string]: number };
    dateRange: { earliest: Date | null; latest: Date | null };
  } {
    const byType: { [key: string]: number } = {};
    const byArea: { [key: string]: number } = {};
    let earliest: Date | null = null;
    let latest: Date | null = null;

    this.firData.forEach((fir) => {
      // Count by crime type
      byType[fir.crimeType] = (byType[fir.crimeType] || 0) + 1;

      // Count by area
      byArea[fir.area] = (byArea[fir.area] || 0) + 1;

      // Track date range
      if (!earliest || fir.date < earliest) {
        earliest = fir.date;
      }
      if (!latest || fir.date > latest) {
        latest = fir.date;
      }
    });

    return {
      total: this.firData.length,
      byType,
      byArea,
      dateRange: { earliest, latest },
    };
  }

  /**
   * Clear all FIR data
   * Use with caution - typically for testing only
   */
  clear(): void {
    this.firData = [];
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Export data as CSV format
   * Time Complexity: O(n)
   */
  exportAsCSV(firs?: FIR[]): string {
    const dataToExport = firs || this.firData;

    const headers = [
      'id',
      'crimeType',
      'date',
      'time',
      'latitude',
      'longitude',
      'area',
      'zone',
      'policeStation',
      'description',
      'isAccident',
      'isSensitiveZone',
    ];

    const csvRows = [headers.join(',')];

    dataToExport.forEach((fir) => {
      const values = [
        fir.id,
        fir.crimeType,
        fir.date.toISOString().split('T')[0],
        fir.time,
        fir.latitude,
        fir.longitude,
        fir.area,
        fir.zone,
        fir.policeStation,
        fir.description || '',
        fir.isAccident ? 'true' : 'false',
        fir.isSensitiveZone ? 'true' : 'false',
      ];
      csvRows.push(
        values.map((v) => (typeof v === 'string' ? `"${v}"` : v)).join(',')
      );
    });

    return csvRows.join('\n');
  }
}

// Export singleton instance
export const firService = new FIRService();
