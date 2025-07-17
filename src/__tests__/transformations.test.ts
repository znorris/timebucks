import { TimeBucks } from '../TemporalCurrency';
import { TransformationRegistry, CPITransformation, WageTransformation, GoldTransformation } from '../transformations';

describe('Transformations', () => {
  describe('CPITransformation', () => {
    it('should get CPI for known years', () => {
      expect(CPITransformation.getCPIForYear(1970)).toBe(38.8);
      expect(CPITransformation.getCPIForYear(2024)).toBe(310.3);
    });

    it('should interpolate CPI for unknown years', () => {
      const cpi1975 = CPITransformation.getCPIForYear(1975);
      expect(cpi1975).toBeGreaterThan(38.8); // 1970 CPI
      expect(cpi1975).toBeLessThan(82.4); // 1980 CPI
    });

    it('should transform 1970 dollars to 2024 dollars', () => {
      const source = TimeBucks.create(100, 'USD', 1970);
      const result = CPITransformation.transform(source.toTemporalCurrency(), 2024);
      
      expect(result.amount).toBeCloseTo(800, 0); // Approximately 8x inflation
      expect(result.currency).toBe('USD');
      expect(result.year).toBe(2024);
      expect(result.method).toBe('CPI');
      expect(result.sourceYear).toBe(1970);
    });
  });

  describe('WageTransformation', () => {
    it('should get wage for known years', () => {
      expect(WageTransformation.getWageForYear(1970)).toBe(6186);
      expect(WageTransformation.getWageForYear(2024)).toBe(59384);
    });

    it('should transform 1970 dollars to 2024 dollars using wage comparison', () => {
      const source = TimeBucks.create(100, 'USD', 1970);
      const result = WageTransformation.transform(source.toTemporalCurrency(), 2024);
      
      expect(result.amount).toBeCloseTo(960, 0); // Approximately 9.6x wage growth
      expect(result.currency).toBe('USD');
      expect(result.year).toBe(2024);
      expect(result.method).toBe('WAGE');
      expect(result.sourceYear).toBe(1970);
    });
  });

  describe('GoldTransformation', () => {
    it('should get gold price for known years', () => {
      expect(GoldTransformation.getGoldPriceForYear(1970)).toBe(36.56);
      expect(GoldTransformation.getGoldPriceForYear(2024)).toBe(2340.00);
    });

    it('should transform 1970 dollars to 2024 dollars using gold standard', () => {
      const source = TimeBucks.create(100, 'USD', 1970);
      const result = GoldTransformation.transform(source.toTemporalCurrency(), 2024);
      
      expect(result.amount).toBeCloseTo(6400, 0); // Approximately 64x gold price increase
      expect(result.currency).toBe('USD');
      expect(result.year).toBe(2024);
      expect(result.method).toBe('GOLD');
      expect(result.sourceYear).toBe(1970);
    });
  });

  describe('TransformationRegistry', () => {
    it('should have registered default methods', () => {
      expect(TransformationRegistry.get('CPI')).toBeDefined();
      expect(TransformationRegistry.get('WAGE')).toBeDefined();
      expect(TransformationRegistry.get('GOLD')).toBeDefined();
    });

    it('should allow custom method registration', () => {
      const customMethod = jest.fn();
      TransformationRegistry.register('CUSTOM:test', customMethod);
      
      expect(TransformationRegistry.get('CUSTOM:test')).toBe(customMethod);
    });

    it('should transform using registered methods', () => {
      const source = TimeBucks.create(100, 'USD', 1970);
      const result = TransformationRegistry.transform(source.toTemporalCurrency(), 'CPI', 2024);
      
      expect(result.method).toBe('CPI');
      expect(result.sourceYear).toBe(1970);
      expect(result.year).toBe(2024);
    });

    it('should throw error for unknown method', () => {
      const source = TimeBucks.create(100, 'USD', 1970);
      
      expect(() => {
        TransformationRegistry.transform(source.toTemporalCurrency(), 'UNKNOWN' as any, 2024);
      }).toThrow('Transformation method \'UNKNOWN\' not found');
    });
  });

  describe('Integration tests', () => {
    it('should demonstrate different methods yield different results', () => {
      const original = TimeBucks.create(100, 'USD', 1970);
      
      const cpiResult = original.transform('CPI', 2024);
      const wageResult = original.transform('WAGE', 2024);
      const goldResult = original.transform('GOLD', 2024);
      
      expect(cpiResult.amount).not.toBe(wageResult.amount);
      expect(wageResult.amount).not.toBe(goldResult.amount);
      expect(cpiResult.amount).not.toBe(goldResult.amount);
      
      // All should be greater than original
      expect(cpiResult.amount).toBeGreaterThan(100);
      expect(wageResult.amount).toBeGreaterThan(100);
      expect(goldResult.amount).toBeGreaterThan(100);
    });

    it('should preserve source information in transformations', () => {
      const original = TimeBucks.create(100, 'USD', 1970, 6, 15);
      const transformed = original.transform('CPI', 2024, 12, 25);
      
      expect(transformed.sourceYear).toBe(1970);
      expect(transformed.sourceMonth).toBe(6);
      expect(transformed.sourceDay).toBe(15);
      expect(transformed.year).toBe(2024);
      expect(transformed.month).toBe(12);
      expect(transformed.day).toBe(25);
    });

    it('should format transformed values correctly', () => {
      const original = TimeBucks.create(100, 'USD', 1970);
      const transformed = original.transform('CPI', 2024);
      
      const formatted = transformed.toString();
      expect(formatted).toMatch(/^\$[\d,.]+@2024\[CPI:1970\]$/);
    });
  });
});