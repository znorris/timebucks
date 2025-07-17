import { NotationParser } from '../parser';
import { TimeBucks } from '../TemporalCurrency';

describe('NotationParser', () => {
  describe('parse', () => {
    it('should parse basic USD notation', () => {
      const tb = NotationParser.parse('$100@1970');
      
      expect(tb.amount).toBe(100);
      expect(tb.currency).toBe('USD');
      expect(tb.year).toBe(1970);
      expect(tb.month).toBeUndefined();
      expect(tb.day).toBeUndefined();
      expect(tb.isNatural()).toBe(true);
    });

    it('should parse notation with commas in amount', () => {
      const tb = NotationParser.parse('$1,000@1970');
      
      expect(tb.amount).toBe(1000);
      expect(tb.currency).toBe('USD');
      expect(tb.year).toBe(1970);
    });

    it('should parse notation with decimal amounts', () => {
      const tb = NotationParser.parse('$100.50@1970');
      
      expect(tb.amount).toBe(100.5);
      expect(tb.currency).toBe('USD');
      expect(tb.year).toBe(1970);
    });

    it('should parse different currencies', () => {
      const eur = NotationParser.parse('€100@2000');
      const gbp = NotationParser.parse('£50@1950');
      const jpy = NotationParser.parse('¥10000@1990');
      
      expect(eur.currency).toBe('EUR');
      expect(gbp.currency).toBe('GBP');
      expect(jpy.currency).toBe('JPY');
    });

    it('should parse Canadian and Australian dollars', () => {
      const cad = NotationParser.parse('C$100@2000');
      const aud = NotationParser.parse('A$100@2000');
      
      expect(cad.currency).toBe('CAD');
      expect(aud.currency).toBe('AUD');
    });

    it('should parse dates with month', () => {
      const tb = NotationParser.parse('$100@1970-06');
      
      expect(tb.year).toBe(1970);
      expect(tb.month).toBe(6);
      expect(tb.day).toBeUndefined();
    });

    it('should parse dates with month and day', () => {
      const tb = NotationParser.parse('$100@1970-06-15');
      
      expect(tb.year).toBe(1970);
      expect(tb.month).toBe(6);
      expect(tb.day).toBe(15);
    });

    it('should parse calculated values', () => {
      const tb = NotationParser.parse('$667@2024[CPI:1970]');
      
      expect(tb.amount).toBe(667);
      expect(tb.currency).toBe('USD');
      expect(tb.year).toBe(2024);
      expect(tb.method).toBe('CPI');
      expect(tb.sourceYear).toBe(1970);
      expect(tb.isCalculated()).toBe(true);
    });

    it('should parse calculated values with source dates', () => {
      const tb = NotationParser.parse('$667@2024-06-15[CPI:1970-03-10]');
      
      expect(tb.year).toBe(2024);
      expect(tb.month).toBe(6);
      expect(tb.day).toBe(15);
      expect(tb.method).toBe('CPI');
      expect(tb.sourceYear).toBe(1970);
      expect(tb.sourceMonth).toBe(3);
      expect(tb.sourceDay).toBe(10);
    });

    it('should parse different transformation methods', () => {
      const cpi = NotationParser.parse('$667@2024[CPI:1970]');
      const wage = NotationParser.parse('$720@2024[WAGE:1970]');
      const gold = NotationParser.parse('$750@2024[GOLD:1970]');
      
      expect(cpi.method).toBe('CPI');
      expect(wage.method).toBe('WAGE');
      expect(gold.method).toBe('GOLD');
    });

    it('should throw error for invalid notation', () => {
      expect(() => NotationParser.parse('invalid')).toThrow('Invalid TimeBucks notation');
      expect(() => NotationParser.parse('$100')).toThrow('Invalid TimeBucks notation');
      expect(() => NotationParser.parse('100@1970')).toThrow('Invalid TimeBucks notation');
    });

    it('should throw error for unsupported currency', () => {
      expect(() => NotationParser.parse('₹100@1970')).toThrow('Invalid TimeBucks notation');
    });
  });

  describe('validate', () => {
    it('should return true for valid notation', () => {
      expect(NotationParser.validate('$100@1970')).toBe(true);
      expect(NotationParser.validate('€1,000@2000')).toBe(true);
      expect(NotationParser.validate('$667@2024[CPI:1970]')).toBe(true);
    });

    it('should return false for invalid notation', () => {
      expect(NotationParser.validate('invalid')).toBe(false);
      expect(NotationParser.validate('$100')).toBe(false);
      expect(NotationParser.validate('100@1970')).toBe(false);
    });
  });

  describe('parseRaw', () => {
    it('should return raw parsed data', () => {
      const parsed = NotationParser.parseRaw('$100@1970');
      
      expect(parsed.amount).toBe(100);
      expect(parsed.currency).toBe('USD');
      expect(parsed.year).toBe(1970);
      expect(parsed.method).toBeUndefined();
      expect(parsed.sourceYear).toBeUndefined();
    });

    it('should return raw parsed data for calculated values', () => {
      const parsed = NotationParser.parseRaw('$667@2024[CPI:1970]');
      
      expect(parsed.amount).toBe(667);
      expect(parsed.currency).toBe('USD');
      expect(parsed.year).toBe(2024);
      expect(parsed.method).toBe('CPI');
      expect(parsed.sourceYear).toBe(1970);
    });
  });
});