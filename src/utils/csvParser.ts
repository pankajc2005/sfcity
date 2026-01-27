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
export const parseCSV = (
  csvContent: string
): { records: FIR[]; errors: string[] } => {
  const records: FIR[] = [];
  const errors: string[] = [];

  if (!csvContent || csvContent.trim().length === 0) {
    errors.push('CSV content is empty');
    return { records, errors };
  }

  const lines = csvContent.split('\n').filter((line) => line.trim());

  if (lines.length < 2) {
    errors.push('CSV must contain at least headers and one data row');
    return { records, errors };
  }

  // Parse header
  const headerLine = lines[0];
  const headers = headerLine.split(',').map((h) => h.trim().toLowerCase());

  const requiredHeaders = [
    'id',
    'crimetype',
    'date',
    'time',
    'latitude',
    'longitude',
    'area',
    'zone',
    'policestation',
  ];

  const missingHeaders = requiredHeaders.filter(
    (h) => !headers.includes(h)
  );
  if (missingHeaders.length > 0) {
    errors.push(`Missing required headers: ${missingHeaders.join(', ')}`);
    return { records, errors };
  }

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    try {
      const line = lines[i];
      if (!line.trim()) continue; // Skip empty lines

      const values = parseCSVRow(line);
      const record = parseFIRRecord(values, headers, i + 1);

      records.push(record);
    } catch (error) {
      errors.push(
        `Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  return { records, errors };
};

/**
 * Parses a single CSV row accounting for quoted values
 * Handles CSV format: "value1","value2",value3
 */
function parseCSVRow(row: string): string[] {
  const values: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // Field separator
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add the last field
  values.push(current.trim());

  return values;
}

/**
 * Converts CSV row values to FIR record
 * Validates data types and required fields
 */
function parseFIRRecord(
  values: string[],
  headers: string[],
  _rowNumber: number
): FIR {
  const data: Record<string, string> = {};

  headers.forEach((header, index) => {
    if (index < values.length) {
      data[header] = values[index] || '';
    }
  });

  // Validate and convert fields
  const id = data['id']?.trim();
  if (!id) throw new Error('FIR ID is required');

  const crimeType = data['crimetype']?.trim();
  if (!crimeType) throw new Error('Crime type is required');

  const dateStr = data['date']?.trim();
  if (!dateStr) throw new Error('Date is required');
  const date = parseDate(dateStr);
  if (!date) throw new Error(`Invalid date format: ${dateStr}`);

  const time = data['time']?.trim();
  if (!time) throw new Error('Time is required');

  const latitude = parseFloat(data['latitude']?.trim() || '');
  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    throw new Error(`Invalid latitude: ${data['latitude']}`);
  }

  const longitude = parseFloat(data['longitude']?.trim() || '');
  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    throw new Error(`Invalid longitude: ${data['longitude']}`);
  }

  const area = data['area']?.trim();
  if (!area) throw new Error('Area is required');

  const zone = data['zone']?.trim();
  if (!zone) throw new Error('Zone is required');

  const policeStation = data['policestation']?.trim();
  if (!policeStation) throw new Error('Police station is required');

  const description = data['description']?.trim() || undefined;
  const isAccident =
    data['isaccident']?.trim().toLowerCase() === 'true' ? true : false;
  const isSensitiveZone =
    data['issensitivezone']?.trim().toLowerCase() === 'true' ? true : false;

  return {
    id,
    crimeType,
    date,
    time,
    latitude,
    longitude,
    area,
    zone,
    policeStation,
    description,
    isAccident,
    isSensitiveZone,
  };
}

/**
 * Parses date string in multiple formats
 * Supports: YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY
 */
function parseDate(dateStr: string): Date | null {
  // Try YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const date = new Date(dateStr + 'T00:00:00');
    if (!isNaN(date.getTime())) return date;
  }

  // Try DD/MM/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(
      `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`
    );
    if (!isNaN(date.getTime())) return date;
  }

  // Try MM/DD/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date;
  }

  return null;
}

/**
 * Parses Excel file (simplified - assumes CSV export format)
 * For real Excel support, integrate xlsx library
 */
export const parseExcel = (
  content: string
): { records: FIR[]; errors: string[] } => {
  // For MVP, treat Excel as CSV
  // In production, use xlsx library for proper .xlsx handling
  return parseCSV(content);
};
