import { parseCSV } from './csvParser';

describe('csvParser', () => {
  describe('parseCSV', () => {
    it('should parse valid CSV content', () => {
      const csvContent = `id,crimeType,date,time,latitude,longitude,area,zone,policeStation
FIR001,Theft,2026-01-20,14:30,28.5355,77.3910,Downtown,Zone A,Central PS
FIR002,Assault,2026-01-21,09:45,28.5360,77.3920,Uptown,Zone B,North PS`;

      const { records, errors } = parseCSV(csvContent);

      expect(errors).toHaveLength(0);
      expect(records).toHaveLength(2);
      expect(records[0].id).toBe('FIR001');
      expect(records[0].crimeType).toBe('Theft');
      expect(records[0].latitude).toBe(28.5355);
      expect(records[0].longitude).toBe(77.391);
    });

    it('should handle empty CSV content', () => {
      const { records, errors } = parseCSV('');

      expect(errors).toContain('CSV content is empty');
      expect(records).toHaveLength(0);
    });

    it('should require all mandatory headers', () => {
      const csvContent = `id,crimeType,date,time
FIR001,Theft,2026-01-20,14:30`;

      const { records, errors } = parseCSV(csvContent);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('Missing required headers');
      expect(records).toHaveLength(0);
    });

    it('should detect invalid latitude', () => {
      const csvContent = `id,crimeType,date,time,latitude,longitude,area,zone,policeStation
FIR001,Theft,2026-01-20,14:30,invalid,77.3910,Downtown,Zone A,Central PS`;

      const { records: _records, errors } = parseCSV(csvContent);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('Invalid latitude');
    });

    it('should detect latitude out of range', () => {
      const csvContent = `id,crimeType,date,time,latitude,longitude,area,zone,policeStation
FIR001,Theft,2026-01-20,14:30,100,77.3910,Downtown,Zone A,Central PS`;

      const { records: _records, errors } = parseCSV(csvContent);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('Invalid latitude');
    });

    it('should detect invalid longitude', () => {
      const csvContent = `id,crimeType,date,time,latitude,longitude,area,zone,policeStation
FIR001,Theft,2026-01-20,14:30,28.5355,invalid,Downtown,Zone A,Central PS`;

      const { records: _records, errors } = parseCSV(csvContent);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('Invalid longitude');
    });

    it('should handle missing required fields', () => {
      const csvContent = `id,crimeType,date,time,latitude,longitude,area,zone,policeStation
FIR001,,2026-01-20,14:30,28.5355,77.3910,Downtown,Zone A,Central PS`;

      const { records, errors } = parseCSV(csvContent);

      expect(errors.length).toBeGreaterThan(0);
      expect(records).toHaveLength(0);
    });

    it('should parse optional fields', () => {
      const csvContent = `id,crimeType,date,time,latitude,longitude,area,zone,policeStation,description,isAccident,isSensitiveZone
FIR001,Theft,2026-01-20,14:30,28.5355,77.3910,Downtown,Zone A,Central PS,Theft in shop,true,false`;

      const { records, errors } = parseCSV(csvContent);

      expect(errors).toHaveLength(0);
      expect(records[0].description).toBe('Theft in shop');
      expect(records[0].isAccident).toBe(true);
      expect(records[0].isSensitiveZone).toBe(false);
    });

    it('should handle quoted CSV values with commas', () => {
      const csvContent = `id,crimeType,date,time,latitude,longitude,area,zone,policeStation
FIR001,"Theft, armed",2026-01-20,14:30,28.5355,77.3910,"Downtown, Central",Zone A,"Central PS, Main Branch"`;

      const { records, errors } = parseCSV(csvContent);

      expect(errors).toHaveLength(0);
      expect(records[0].crimeType).toBe('Theft, armed');
      expect(records[0].area).toBe('Downtown, Central');
    });

    it('should parse different date formats', () => {
      const csvContent1 = `id,crimeType,date,time,latitude,longitude,area,zone,policeStation
FIR001,Theft,2026-01-20,14:30,28.5355,77.3910,Downtown,Zone A,Central PS`;

      const { records: records1 } = parseCSV(csvContent1);
      expect(records1[0].date.getFullYear()).toBe(2026);
      expect(records1[0].date.getMonth()).toBe(0); // January is 0
    });

    it('should skip empty rows', () => {
      const csvContent = `id,crimeType,date,time,latitude,longitude,area,zone,policeStation
FIR001,Theft,2026-01-20,14:30,28.5355,77.3910,Downtown,Zone A,Central PS

FIR002,Assault,2026-01-21,09:45,28.5360,77.3920,Uptown,Zone B,North PS`;

      const { records, errors } = parseCSV(csvContent);

      expect(errors).toHaveLength(0);
      expect(records).toHaveLength(2);
    });
  });
});
