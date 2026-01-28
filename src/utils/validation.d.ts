import { FIR } from '../types';
/**
 * Validates a single FIR record for data integrity
 *
 * Checks:
 * - All required fields are present
 * - Data types are correct
 * - Values are within acceptable ranges
 * - Geographic coordinates are valid
 *
 * Time Complexity: O(1) - constant number of field checks
 */
export declare const validateFIR: (fir: FIR) => {
    valid: boolean;
    errors: string[];
};
/**
 * Validates an array of FIR records
 *
 * Time Complexity: O(n) where n = number of records
 */
export declare const validateFIRBatch: (firs: FIR[]) => {
    validRecords: FIR[];
    invalidRecords: {
        fir: FIR;
        errors: string[];
    }[];
};
/**
 * Checks for duplicate FIR records by ID
 * Returns records with duplicate IDs
 */
export declare const findDuplicates: (firs: FIR[]) => FIR[];
/**
 * Sanitizes text fields to prevent injection attacks
 * Removes potentially dangerous characters
 */
export declare const sanitizeFIR: (fir: FIR) => FIR;
/**
 * Validates geographic area for a specific city
 * Example: Returns true if coordinates are within city bounds
 */
export declare const isValidGeoLocation: (latitude: number, longitude: number, bounds?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
}) => boolean;
/**
 * Generates a validation report for a batch of FIR records
 */
export declare const generateValidationReport: (firs: FIR[]) => {
    total: number;
    valid: number;
    invalid: number;
    duplicates: number;
    errors: {
        [key: string]: number;
    };
};
//# sourceMappingURL=validation.d.ts.map