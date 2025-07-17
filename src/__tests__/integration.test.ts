import { TimeBucks } from "../TemporalCurrency";
import { NotationParser } from "../parser";

describe("Integration Tests", () => {
  describe("Round-trip parsing and formatting", () => {
    it("should parse and format natural values correctly", () => {
      const notation = "$1,000@1970";
      const parsed = NotationParser.parse(notation);
      const formatted = parsed.toString();

      expect(formatted).toBe(notation);
    });

    it("should parse and format calculated values correctly", () => {
      const notation = "$8,000@2024[CPI:1970]";
      const parsed = NotationParser.parse(notation);
      const formatted = parsed.toString();

      expect(formatted).toBe(notation);
    });

    it("should parse and format dates correctly", () => {
      const notation = "$100@1970-06-15";
      const parsed = NotationParser.parse(notation);
      const formatted = parsed.toString();

      expect(formatted).toBe(notation);
    });

    it("should parse and format calculated values with dates correctly", () => {
      const notation = "$800@2024-12-25[CPI:1970-06-15]";
      const parsed = NotationParser.parse(notation);
      const formatted = parsed.toString();

      expect(formatted).toBe(notation);
    });
  });

  describe("Real-world examples", () => {
    it("should handle Model T Ford example", () => {
      const ford1908 = TimeBucks.create(825, "USD", 1908);
      const ford2024CPI = ford1908.transform("CPI", 2024);
      const ford2024WAGE = ford1908.transform("WAGE", 2024);

      expect(ford2024CPI.amount).toBeGreaterThan(20000);
      expect(ford2024WAGE.amount).toBeGreaterThan(30000);
      expect(ford2024CPI.toString()).toMatch(/^\$[\d,.]+@2024\[CPI:1908\]$/);
      expect(ford2024WAGE.toString()).toMatch(/^\$[\d,.]+@2024\[WAGE:1908\]$/);
    });

    it("should handle Babe Ruth salary example", () => {
      const ruthSalary = TimeBucks.create(80000, "USD", 1930);
      const ruth2024CPI = ruthSalary.transform("CPI", 2024);
      const ruth2024WAGE = ruthSalary.transform("WAGE", 2024);

      expect(ruth2024CPI.amount).toBeGreaterThan(1000000);
      expect(ruth2024WAGE.amount).toBeGreaterThan(2000000);
      expect(ruth2024CPI.toString()).toMatch(/^\$[\d,.]+@2024\[CPI:1930\]$/);
      expect(ruth2024WAGE.toString()).toMatch(/^\$[\d,.]+@2024\[WAGE:1930\]$/);
    });

    it("should demonstrate the TimeBucks principle", () => {
      const dollar1910 = TimeBucks.create(1, "USD", 1910);
      const dollar2024 = TimeBucks.create(1, "USD", 2024);

      const converted1910 = dollar1910.transform("CPI", 2024);

      expect(converted1910.amount).toBeGreaterThan(dollar2024.amount);
      expect(converted1910.toString()).not.toBe(dollar2024.toString());
    });
  });

  describe("Error handling", () => {
    it("should handle invalid transformations gracefully", () => {
      const tb = TimeBucks.create(100, "USD", 1970);

      expect(() => {
        tb.transform("INVALID" as any, 2024);
      }).toThrow("Transformation method 'INVALID' not found");
    });

    it("should handle invalid notation gracefully", () => {
      expect(() => {
        NotationParser.parse("invalid notation");
      }).toThrow("Invalid TimeBucks notation");
    });

    it("should handle unsupported currencies gracefully", () => {
      expect(() => {
        NotationParser.parse("₹100@1970");
      }).toThrow("Invalid TimeBucks notation");
    });
  });

  describe("Edge cases", () => {
    it("should handle very old years", () => {
      const old = TimeBucks.create(100, "USD", 1913);
      const modern = old.transform("CPI", 2024);

      expect(modern.amount).toBeGreaterThan(100);
      expect(modern.sourceYear).toBe(1913);
    });

    it("should handle same year transformations", () => {
      const tb = TimeBucks.create(100, "USD", 1970);
      const transformed = tb.transform("CPI", 1970);

      expect(transformed.amount).toBeCloseTo(100, 2);
      expect(transformed.year).toBe(1970);
      expect(transformed.sourceYear).toBe(1970);
    });

    it("should handle zero amounts", () => {
      const zero = TimeBucks.create(0, "USD", 1970);
      const transformed = zero.transform("CPI", 2024);

      expect(transformed.amount).toBe(0);
    });

    it("should handle negative amounts", () => {
      const negative = TimeBucks.create(-100, "USD", 1970);
      const transformed = negative.transform("CPI", 2024);

      expect(transformed.amount).toBeLessThan(0);
    });
  });

  describe("Comparison scenarios", () => {
    it("should show different methods yield different results", () => {
      const original = TimeBucks.create(100, "USD", 1970);

      const cpi = original.transform("CPI", 2024);
      const wage = original.transform("WAGE", 2024);
      const gold = original.transform("GOLD", 2024);

      const results = [cpi.amount, wage.amount, gold.amount];
      const unique = [...new Set(results)];

      expect(unique.length).toBe(3);
    });

    it("should maintain mathematical relationships", () => {
      const tb1 = TimeBucks.create(100, "USD", 1970);
      const tb2 = TimeBucks.create(200, "USD", 1970);

      const transformed1 = tb1.transform("CPI", 2024);
      const transformed2 = tb2.transform("CPI", 2024);

      expect(transformed2.amount).toBeCloseTo(transformed1.amount * 2, 2);
    });
  });
});
