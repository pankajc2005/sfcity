import { FIR } from '../types';
/**
 * Data Loader Service
 * Handles fetching and loading CSV data from public folder
 */
declare class DataLoaderService {
    /**
     * Fetch CSV data from public folder
     * @param filePath - Path to CSV file in public folder
     * @returns Promise resolving to FIR array
     */
    loadCSVFromPublic(filePath: string): Promise<{
        records: FIR[];
        errors: string[];
    }>;
    /**
     * Load Mumbai FIR dummy data
     */
    loadMumbaiData(): Promise<{
        records: FIR[];
        errors: string[];
    }>;
    /**
     * Load integration test data
     */
    loadIntegrationData(): Promise<{
        records: FIR[];
        errors: string[];
    }>;
}
export declare const dataLoaderService: DataLoaderService;
export {};
//# sourceMappingURL=dataLoaderService.d.ts.map