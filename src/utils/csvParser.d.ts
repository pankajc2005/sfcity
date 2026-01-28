import { FIR } from '../types';
/**
 * Parses CSV content into FIR records
 *
 * CSV format expected:
 * id,crimeType,date,time,latitude,longitude,area,zone,policeStation,description,isAccident,isSensitiveZone
 *
 * @param csvContent Raw CSV text content
 * @returns Array of FIR records and any parsing errors
 *
 * Algorithm: Linear scan O(n) where n = number of CSV rows
 * - Splits by newlines
 * - Parses headers
 * - Validates each row
 * - Returns records and errors separately
 */
export declare const parseCSV: (csvContent: string) => {
    records: FIR[];
    errors: string[];
};
/**
 * Parses Excel file (simplified - assumes CSV export format)
 * For real Excel support, integrate xlsx library
 */
export declare const parseExcel: (content: string) => {
    records: FIR[];
    errors: string[];
};
//# sourceMappingURL=csvParser.d.ts.map