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
export const validateFIR = (fir: FIR): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check required fields
  if (!fir.id || fir.id.trim().length === 0) {
    errors.push('FIR ID is required');
  }

  if (!fir.crimeType || fir.crimeType.trim().length === 0) {
    errors.push('Crime type is required');
  }

  if (!fir.date) {
    errors.push('Date is required');
  } else if (!(fir.date instanceof Date) || isNaN(fir.date.getTime())) {
    errors.push('Invalid date format');
  } else if (fir.date > new Date()) {
    errors.push('Date cannot be in the future');
  }

  if (!fir.time || !/^\d{2}:\d{2}(:\d{2})?$/.test(fir.time)) {
    errors.push('Time must be in HH:MM or HH:MM:SS format');
  }

  // Validate coordinates
  if (typeof fir.latitude !== 'number' || isNaN(fir.latitude)) {
    errors.push('Latitude must be a valid number');
  } else if (fir.latitude < -90 || fir.latitude > 90) {
    errors.push('Latitude must be between -90 and 90');
  }

  if (typeof fir.longitude !== 'number' || isNaN(fir.longitude)) {
    errors.push('Longitude must be a valid number');
  } else if (fir.longitude < -180 || fir.longitude > 180) {
    errors.push('Longitude must be between -180 and 180');
  }

  // Check text fields
  if (!fir.area || fir.area.trim().length === 0) {
    errors.push('Area is required');
  }

  if (!fir.zone || fir.zone.trim().length === 0) {
    errors.push('Zone is required');
  }

  if (!fir.policeStation || fir.policeStation.trim().length === 0) {
    errors.push('Police station is required');
  }

  // Check boolean fields
  if (typeof fir.isAccident !== 'boolean') {
    errors.push('isAccident must be a boolean value');
  }

  if (typeof fir.isSensitiveZone !== 'boolean') {
    errors.push('isSensitiveZone must be a boolean value');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates an array of FIR records
 *
 * Time Complexity: O(n) where n = number of records
 */
export const validateFIRBatch = (
  firs: FIR[]
): { validRecords: FIR[]; invalidRecords: { fir: FIR; errors: string[] }[] } => {
  const validRecords: FIR[] = [];
  const invalidRecords: { fir: FIR; errors: string[] }[] = [];

  firs.forEach((fir) => {
    const validation = validateFIR(fir);
    if (validation.valid) {
      validRecords.push(fir);
    } else {
      invalidRecords.push({ fir, errors: validation.errors });
    }
  });

  return { validRecords, invalidRecords };
};

/**
 * Checks for duplicate FIR records by ID
 * Returns records with duplicate IDs
 */
export const findDuplicates = (firs: FIR[]): FIR[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  firs.forEach((fir) => {
    if (seen.has(fir.id)) {
      duplicates.add(fir.id);
    } else {
      seen.add(fir.id);
    }
  });

  return firs.filter((fir) => duplicates.has(fir.id));
};

/**
 * Sanitizes text fields to prevent injection attacks
 * Removes potentially dangerous characters
 */
export const sanitizeFIR = (fir: FIR): FIR => {
  return {
    ...fir,
    id: sanitizeText(fir.id),
    crimeType: sanitizeText(fir.crimeType),
    area: sanitizeText(fir.area),
    zone: sanitizeText(fir.zone),
    policeStation: sanitizeText(fir.policeStation),
    description: fir.description ? sanitizeText(fir.description) : undefined,
  };
};

/**
 * Removes potentially dangerous characters from text
 */
function sanitizeText(text: string): string {
  if (!text) return '';
  // Remove script tags and dangerous HTML
  return text
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Validates geographic area for a specific city
 * Example: Returns true if coordinates are within city bounds
 */
export const isValidGeoLocation = (
  latitude: number,
  longitude: number,
  bounds?: { minLat: number; maxLat: number; minLng: number; maxLng: number }
): boolean => {
  // Default bounds for Delhi, India (MVP example)
  const defaultBounds = {
    minLat: 28.4,
    maxLat: 28.9,
    minLng: 76.8,
    maxLng: 77.4,
  };

  const validBounds = bounds || defaultBounds;

  return (
    latitude >= validBounds.minLat &&
    latitude <= validBounds.maxLat &&
    longitude >= validBounds.minLng &&
    longitude <= validBounds.maxLng
  );
};

/**
 * Generates a validation report for a batch of FIR records
 */
export const generateValidationReport = (
  firs: FIR[]
): {
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
  errors: { [key: string]: number };
} => {
  const { validRecords, invalidRecords } = validateFIRBatch(firs);
  const duplicates = findDuplicates(firs);
  const errorCounts: { [key: string]: number } = {};

  invalidRecords.forEach(({ errors }) => {
    errors.forEach((error) => {
      errorCounts[error] = (errorCounts[error] || 0) + 1;
    });
  });

  return {
    total: firs.length,
    valid: validRecords.length,
    invalid: invalidRecords.length,
    duplicates: duplicates.length,
    errors: errorCounts,
  };
};
