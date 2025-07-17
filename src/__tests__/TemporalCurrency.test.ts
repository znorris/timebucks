import { TimeBucks } from "../TemporalCurrency";

describe("TimeBucks", () => {
  describe("create", () => {
    it("should create a natural temporal currency value", () => {
      const tb = TimeBucks.create(100, "USD", 1970);

      expect(tb.amount).toBe(100);
      expect(tb.currency).toBe("USD");
      expect(tb.year).toBe(1970);
      expect(tb.month).toBeUndefined();
      expect(tb.day).toBeUndefined();
      expect(tb.isNatural()).toBe(true);
      expect(tb.isCalculated()).toBe(false);
    });

    it("should create a temporal currency value with month and day", () => {
      const tb = TimeBucks.create(100, "USD", 1970, 6, 15);

      expect(tb.amount).toBe(100);
      expect(tb.currency).toBe("USD");
      expect(tb.year).toBe(1970);
      expect(tb.month).toBe(6);
      expect(tb.day).toBe(15);
    });
  });

  describe("createCalculated", () => {
    it("should create a calculated temporal currency value", () => {
      const tb = TimeBucks.createCalculated(667, "USD", 2024, "CPI", 1970);

      expect(tb.amount).toBe(667);
      expect(tb.currency).toBe("USD");
      expect(tb.year).toBe(2024);
      expect(tb.method).toBe("CPI");
      expect(tb.sourceYear).toBe(1970);
      expect(tb.isNatural()).toBe(false);
      expect(tb.isCalculated()).toBe(true);
    });
  });

  describe("toString", () => {
    it("should format natural values correctly", () => {
      const tb = TimeBucks.create(1000, "USD", 1970);
      expect(tb.toString()).toBe("$1,000@1970");
    });

    it("should format calculated values correctly", () => {
      const tb = TimeBucks.createCalculated(6670, "USD", 2024, "CPI", 1970);
      expect(tb.toString()).toBe("$6,670@2024[CPI:1970]");
    });

    it("should format different currencies correctly", () => {
      const eur = TimeBucks.create(100, "EUR", 2000);
      const gbp = TimeBucks.create(50, "GBP", 1950);
      const jpy = TimeBucks.create(10000, "JPY", 1990);

      expect(eur.toString()).toBe("€100@2000");
      expect(gbp.toString()).toBe("£50@1950");
      expect(jpy.toString()).toBe("¥10,000@1990");
    });

    it("should format dates with month and day", () => {
      const tb = TimeBucks.create(100, "USD", 1970, 6, 15);
      expect(tb.toString()).toBe("$100@1970-06-15");
    });

    it("should format calculated values with source dates", () => {
      const tb = TimeBucks.createCalculated(
        667,
        "USD",
        2024,
        "CPI",
        1970,
        6,
        15,
        3,
        10,
      );
      expect(tb.toString()).toBe("$667@2024-06-15[CPI:1970-03-10]");
    });
  });

  describe("equals", () => {
    it("should return true for identical natural values", () => {
      const tb1 = TimeBucks.create(100, "USD", 1970);
      const tb2 = TimeBucks.create(100, "USD", 1970);
      expect(tb1.equals(tb2)).toBe(true);
    });

    it("should return true for identical calculated values", () => {
      const tb1 = TimeBucks.createCalculated(667, "USD", 2024, "CPI", 1970);
      const tb2 = TimeBucks.createCalculated(667, "USD", 2024, "CPI", 1970);
      expect(tb1.equals(tb2)).toBe(true);
    });

    it("should return false for different amounts", () => {
      const tb1 = TimeBucks.create(100, "USD", 1970);
      const tb2 = TimeBucks.create(200, "USD", 1970);
      expect(tb1.equals(tb2)).toBe(false);
    });

    it("should return false for different currencies", () => {
      const tb1 = TimeBucks.create(100, "USD", 1970);
      const tb2 = TimeBucks.create(100, "EUR", 1970);
      expect(tb1.equals(tb2)).toBe(false);
    });

    it("should return false for different years", () => {
      const tb1 = TimeBucks.create(100, "USD", 1970);
      const tb2 = TimeBucks.create(100, "USD", 1980);
      expect(tb1.equals(tb2)).toBe(false);
    });
  });

  describe("withAmount", () => {
    it("should create a new instance with different amount", () => {
      const original = TimeBucks.create(100, "USD", 1970);
      const modified = original.withAmount(200);

      expect(original.amount).toBe(100);
      expect(modified.amount).toBe(200);
      expect(modified.currency).toBe("USD");
      expect(modified.year).toBe(1970);
    });

    it("should preserve calculated value metadata", () => {
      const original = TimeBucks.createCalculated(
        667,
        "USD",
        2024,
        "CPI",
        1970,
      );
      const modified = original.withAmount(1000);

      expect(modified.amount).toBe(1000);
      expect(modified.method).toBe("CPI");
      expect(modified.sourceYear).toBe(1970);
    });
  });

  describe("transform", () => {
    it("should transform using CPI method", () => {
      const original = TimeBucks.create(100, "USD", 1970);
      const transformed = original.transform("CPI", 2024);

      expect(transformed.isCalculated()).toBe(true);
      expect(transformed.method).toBe("CPI");
      expect(transformed.sourceYear).toBe(1970);
      expect(transformed.year).toBe(2024);
      expect(transformed.currency).toBe("USD");
      expect(transformed.amount).toBeGreaterThan(100);
    });

    it("should transform using WAGE method", () => {
      const original = TimeBucks.create(100, "USD", 1970);
      const transformed = original.transform("WAGE", 2024);

      expect(transformed.isCalculated()).toBe(true);
      expect(transformed.method).toBe("WAGE");
      expect(transformed.sourceYear).toBe(1970);
      expect(transformed.year).toBe(2024);
    });

    it("should transform using GOLD method", () => {
      const original = TimeBucks.create(100, "USD", 1970);
      const transformed = original.transform("GOLD", 2024);

      expect(transformed.isCalculated()).toBe(true);
      expect(transformed.method).toBe("GOLD");
      expect(transformed.sourceYear).toBe(1970);
      expect(transformed.year).toBe(2024);
    });
  });
});
