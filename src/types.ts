export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'CNY';

export type TransformationMethod = 'CPI' | 'PPP' | 'GOLD' | 'WAGE' | `CUSTOM:${string}`;

export interface TemporalCurrency {
  amount: number;
  currency: Currency;
  year: number;
  month?: number | undefined;
  day?: number | undefined;
}

export interface CalculatedTemporalCurrency extends TemporalCurrency {
  method: TransformationMethod;
  sourceYear: number;
  sourceMonth?: number | undefined;
  sourceDay?: number | undefined;
}

export interface TransformationResult {
  original: TemporalCurrency;
  result: CalculatedTemporalCurrency;
  method: TransformationMethod;
  rate: number;
}

export interface TransformationFunction {
  (source: TemporalCurrency, targetYear: number, targetMonth?: number, targetDay?: number): CalculatedTemporalCurrency;
}

export interface MethodConfig {
  name: TransformationMethod;
  description: string;
  transform: TransformationFunction;
}

export type ParsedNotation = {
  amount: number;
  currency: Currency;
  year: number;
  month?: number | undefined;
  day?: number | undefined;
  method?: TransformationMethod | undefined;
  sourceYear?: number | undefined;
  sourceMonth?: number | undefined;
  sourceDay?: number | undefined;
};