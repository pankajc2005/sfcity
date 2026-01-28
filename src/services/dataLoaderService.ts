import { FIR } from '../types';
import { parseCSV } from '../utils/csvParser';

/**
 * Data Loader Service
 * Handles loading FIR data from CSV files
 */
class DataLoaderService {
  /**
   * Load data from a CSV file
   * @param filePath Path to the CSV file
   */
  async loadFromCSVFile(filePath: string): Promise<{
    records: FIR[];
    errors: string[];
  }> {
    const errors: string[] = [];
    
    try {
      const response = await fetch(filePath);
      
      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      const { records, errors: parseErrors } = parseCSV(csvText);
      
      if (parseErrors.length > 0) {
        errors.push(...parseErrors);
      }
      
      return { records, errors };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error loading CSV';
      errors.push(errorMsg);
      return { records: [], errors };
    }
  }

  /**
   * Load Mumbai FIR data from the db folder
   */
  async loadMumbaiData(): Promise<{
    records: FIR[];
    errors: string[];
  }> {
    // Load from the db folder - during development, we need to copy to public folder
    // or use a backend server. For now, we'll try both locations.
    const paths = [
      '/mumbai_fir_dummy_land_only.csv',
      '/db/mumbai_fir_dummy_land_only.csv',
    ];
    
    for (const path of paths) {
      try {
        const result = await this.loadFromCSVFile(path);
        if (result.records.length > 0) {
          return result;
        }
      } catch (error) {
        continue;
      }
    }
    
    return { 
      records: [], 
      errors: ['Could not load data from any configured path'] 
    };
  }

  /**
   * Load integration data (dummy)
   */
  async loadIntegrationData(): Promise<{
    records: FIR[];
    errors: string[];
  }> {
    return { records: [], errors: [] };
  }
}

export const dataLoaderService = new DataLoaderService();
