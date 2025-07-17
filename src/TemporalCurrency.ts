import { Currency, TransformationMethod, TemporalCurrency, CalculatedTemporalCurrency } from './types';
import { TimeBucksTransformer } from './transformations';

export class TimeBucks {
  private constructor(
    public readonly amount: number,
    public readonly currency: Currency,
    public readonly year: number,
    public readonly month?: number,
    public readonly day?: number,
    public readonly method?: TransformationMethod,
    public readonly sourceYear?: number,
    public readonly sourceMonth?: number,
    public readonly sourceDay?: number
  ) {}

  static create(
    amount: number,
    currency: Currency,
    year: number,
    month?: number,
    day?: number
  ): TimeBucks {
    return new TimeBucks(amount, currency, year, month, day);
  }

  static createCalculated(
    amount: number,
    currency: Currency,
    year: number,
    method: TransformationMethod,
    sourceYear: number,
    month?: number,
    day?: number,
    sourceMonth?: number,
    sourceDay?: number
  ): TimeBucks {
    return new TimeBucks(
      amount,
      currency,
      year,
      month,
      day,
      method,
      sourceYear,
      sourceMonth,
      sourceDay
    );
  }

  isCalculated(): this is TimeBucks & { method: TransformationMethod; sourceYear: number } {
    return this.method !== undefined && this.sourceYear !== undefined;
  }

  isNatural(): boolean {
    return !this.isCalculated();
  }

  toTemporalCurrency(): TemporalCurrency {
    return {
      amount: this.amount,
      currency: this.currency,
      year: this.year,
      month: this.month,
      day: this.day,
    };
  }

  toCalculatedTemporalCurrency(): CalculatedTemporalCurrency | null {
    if (!this.isCalculated()) {
      return null;
    }
    return {
      amount: this.amount,
      currency: this.currency,
      year: this.year,
      month: this.month,
      day: this.day,
      method: this.method,
      sourceYear: this.sourceYear,
      sourceMonth: this.sourceMonth,
      sourceDay: this.sourceDay,
    };
  }

  toString(): string {
    const currencySymbol = this.getCurrencySymbol();
    const dateStr = this.formatDate();
    
    if (this.isCalculated()) {
      const sourceDateStr = this.formatSourceDate();
      return `${currencySymbol}${this.amount.toLocaleString()}@${dateStr}[${this.method}:${sourceDateStr}]`;
    }
    
    return `${currencySymbol}${this.amount.toLocaleString()}@${dateStr}`;
  }

  private getCurrencySymbol(): string {
    const symbols: Record<Currency, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CAD: 'C$',
      AUD: 'A$',
      CHF: 'CHF',
      CNY: '¥',
    };
    return symbols[this.currency];
  }

  private formatDate(): string {
    if (this.day && this.month) {
      return `${this.year}-${this.month.toString().padStart(2, '0')}-${this.day.toString().padStart(2, '0')}`;
    }
    if (this.month) {
      return `${this.year}-${this.month.toString().padStart(2, '0')}`;
    }
    return this.year.toString();
  }

  private formatSourceDate(): string {
    if (this.sourceDay && this.sourceMonth) {
      return `${this.sourceYear}-${this.sourceMonth.toString().padStart(2, '0')}-${this.sourceDay.toString().padStart(2, '0')}`;
    }
    if (this.sourceMonth) {
      return `${this.sourceYear}-${this.sourceMonth.toString().padStart(2, '0')}`;
    }
    return this.sourceYear?.toString() || '';
  }

  equals(other: TimeBucks): boolean {
    return (
      this.amount === other.amount &&
      this.currency === other.currency &&
      this.year === other.year &&
      this.month === other.month &&
      this.day === other.day &&
      this.method === other.method &&
      this.sourceYear === other.sourceYear &&
      this.sourceMonth === other.sourceMonth &&
      this.sourceDay === other.sourceDay
    );
  }

  withAmount(amount: number): TimeBucks {
    return new TimeBucks(
      amount,
      this.currency,
      this.year,
      this.month,
      this.day,
      this.method,
      this.sourceYear,
      this.sourceMonth,
      this.sourceDay
    );
  }

  transform(method: TransformationMethod, targetYear: number, targetMonth?: number, targetDay?: number): TimeBucks {
    return TimeBucksTransformer.transform(this, method, targetYear, targetMonth, targetDay);
  }
}