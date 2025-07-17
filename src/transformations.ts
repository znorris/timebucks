import { TemporalCurrency, CalculatedTemporalCurrency, TransformationMethod, TransformationFunction } from './types';
import { TimeBucks } from './TemporalCurrency';

export class TransformationRegistry {
  private static methods: Map<TransformationMethod, TransformationFunction> = new Map();

  static register(method: TransformationMethod, transform: TransformationFunction): void {
    this.methods.set(method, transform);
  }

  static get(method: TransformationMethod): TransformationFunction | undefined {
    return this.methods.get(method);
  }

  static getAll(): Map<TransformationMethod, TransformationFunction> {
    return new Map(this.methods);
  }

  static transform(
    source: TemporalCurrency,
    method: TransformationMethod,
    targetYear: number,
    targetMonth?: number,
    targetDay?: number
  ): CalculatedTemporalCurrency {
    const transformFunction = this.get(method);
    if (!transformFunction) {
      throw new Error(`Transformation method '${method}' not found`);
    }
    return transformFunction(source, targetYear, targetMonth, targetDay);
  }
}

export class CPITransformation {
  private static readonly CPI_DATA: Record<number, number> = {
    1913: 9.9,
    1920: 20.0,
    1930: 16.7,
    1940: 14.0,
    1950: 24.1,
    1960: 29.6,
    1970: 38.8,
    1980: 82.4,
    1990: 130.7,
    2000: 172.2,
    2010: 218.1,
    2020: 258.8,
    2024: 310.3,
  };

  static getCPIForYear(year: number): number {
    const cpi = this.CPI_DATA[year];
    if (cpi === undefined) {
      const years = Object.keys(this.CPI_DATA).map(Number).sort((a, b) => a - b);
      const before = years.filter(y => y < year).pop();
      const after = years.filter(y => y > year).shift();
      
      if (before && after) {
        const ratio = (year - before) / (after - before);
        const interpolated = this.CPI_DATA[before]! + ratio * (this.CPI_DATA[after]! - this.CPI_DATA[before]!);
        return interpolated;
      }
      
      if (before) return this.CPI_DATA[before]!;
      if (after) return this.CPI_DATA[after]!;
      
      throw new Error(`No CPI data available for year ${year}`);
    }
    return cpi;
  }

  static transform: TransformationFunction = (source, targetYear, targetMonth, targetDay) => {
    const sourceCPI = CPITransformation.getCPIForYear(source.year);
    const targetCPI = CPITransformation.getCPIForYear(targetYear);
    
    const adjustedAmount = source.amount * (targetCPI / sourceCPI);
    
    return {
      amount: Math.round(adjustedAmount * 100) / 100,
      currency: source.currency,
      year: targetYear,
      month: targetMonth ?? undefined,
      day: targetDay ?? undefined,
      method: 'CPI',
      sourceYear: source.year,
      sourceMonth: source.month ?? undefined,
      sourceDay: source.day ?? undefined,
    };
  };
}

export class WageTransformation {
  private static readonly WAGE_DATA: Record<number, number> = {
    1913: 633,
    1920: 1236,
    1930: 1368,
    1940: 1299,
    1950: 2992,
    1960: 4007,
    1970: 6186,
    1980: 12513,
    1990: 21027,
    2000: 32154,
    2010: 41673,
    2020: 51916,
    2024: 59384,
  };

  static getWageForYear(year: number): number {
    const wage = this.WAGE_DATA[year];
    if (wage === undefined) {
      const years = Object.keys(this.WAGE_DATA).map(Number).sort((a, b) => a - b);
      const before = years.filter(y => y < year).pop();
      const after = years.filter(y => y > year).shift();
      
      if (before && after) {
        const ratio = (year - before) / (after - before);
        const interpolated = this.WAGE_DATA[before]! + ratio * (this.WAGE_DATA[after]! - this.WAGE_DATA[before]!);
        return interpolated;
      }
      
      if (before) return this.WAGE_DATA[before]!;
      if (after) return this.WAGE_DATA[after]!;
      
      throw new Error(`No wage data available for year ${year}`);
    }
    return wage;
  }

  static transform: TransformationFunction = (source, targetYear, targetMonth, targetDay) => {
    const sourceWage = WageTransformation.getWageForYear(source.year);
    const targetWage = WageTransformation.getWageForYear(targetYear);
    
    const adjustedAmount = source.amount * (targetWage / sourceWage);
    
    return {
      amount: Math.round(adjustedAmount * 100) / 100,
      currency: source.currency,
      year: targetYear,
      month: targetMonth ?? undefined,
      day: targetDay ?? undefined,
      method: 'WAGE',
      sourceYear: source.year,
      sourceMonth: source.month ?? undefined,
      sourceDay: source.day ?? undefined,
    };
  };
}

export class GoldTransformation {
  private static readonly GOLD_PRICE_DATA: Record<number, number> = {
    1913: 20.67,
    1920: 20.67,
    1930: 20.67,
    1940: 35.00,
    1950: 40.25,
    1960: 35.27,
    1970: 36.56,
    1980: 607.97,
    1990: 383.51,
    2000: 279.11,
    2010: 1224.53,
    2020: 1770.75,
    2024: 2340.00,
  };

  static getGoldPriceForYear(year: number): number {
    const price = this.GOLD_PRICE_DATA[year];
    if (price === undefined) {
      const years = Object.keys(this.GOLD_PRICE_DATA).map(Number).sort((a, b) => a - b);
      const before = years.filter(y => y < year).pop();
      const after = years.filter(y => y > year).shift();
      
      if (before && after) {
        const ratio = (year - before) / (after - before);
        const interpolated = this.GOLD_PRICE_DATA[before]! + ratio * (this.GOLD_PRICE_DATA[after]! - this.GOLD_PRICE_DATA[before]!);
        return interpolated;
      }
      
      if (before) return this.GOLD_PRICE_DATA[before]!;
      if (after) return this.GOLD_PRICE_DATA[after]!;
      
      throw new Error(`No gold price data available for year ${year}`);
    }
    return price;
  }

  static transform: TransformationFunction = (source, targetYear, targetMonth, targetDay) => {
    const sourceGoldPrice = GoldTransformation.getGoldPriceForYear(source.year);
    const targetGoldPrice = GoldTransformation.getGoldPriceForYear(targetYear);
    
    const adjustedAmount = source.amount * (targetGoldPrice / sourceGoldPrice);
    
    return {
      amount: Math.round(adjustedAmount * 100) / 100,
      currency: source.currency,
      year: targetYear,
      month: targetMonth ?? undefined,
      day: targetDay ?? undefined,
      method: 'GOLD',
      sourceYear: source.year,
      sourceMonth: source.month ?? undefined,
      sourceDay: source.day ?? undefined,
    };
  };
}

TransformationRegistry.register('CPI', CPITransformation.transform);
TransformationRegistry.register('WAGE', WageTransformation.transform);
TransformationRegistry.register('GOLD', GoldTransformation.transform);

export class TimeBucksTransformer {
  static transform(
    source: TimeBucks,
    method: TransformationMethod,
    targetYear: number,
    targetMonth?: number,
    targetDay?: number
  ): TimeBucks {
    const sourceTC = source.toTemporalCurrency();
    const result = TransformationRegistry.transform(sourceTC, method, targetYear, targetMonth, targetDay);
    
    return TimeBucks.createCalculated(
      result.amount,
      result.currency,
      result.year,
      result.method,
      result.sourceYear,
      result.month,
      result.day,
      result.sourceMonth,
      result.sourceDay
    );
  }
}