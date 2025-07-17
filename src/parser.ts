import { Currency, TransformationMethod, ParsedNotation } from './types';
import { TimeBucks } from './TemporalCurrency';

export class NotationParser {
  private static readonly CURRENCY_SYMBOLS: Record<string, Currency> = {
    '$': 'USD',
    '€': 'EUR',
    '£': 'GBP',
    '¥': 'JPY',
    'C$': 'CAD',
    'A$': 'AUD',
    'CHF': 'CHF',
  };

  private static readonly NOTATION_REGEX = /^([€£¥$]|C\$|A\$|CHF)([\d,]+(?:\.\d{2})?)@(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?(?:\[([A-Z]+(?::[A-Z0-9]+)?):(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?\])?$/;

  static parse(notation: string): TimeBucks {
    const match = notation.match(this.NOTATION_REGEX);
    if (!match) {
      throw new Error(`Invalid TimeBucks notation: ${notation}`);
    }

    const [
      ,
      currencySymbol,
      amountStr,
      yearStr,
      monthStr,
      dayStr,
      methodStr,
      sourceYearStr,
      sourceMonthStr,
      sourceDayStr,
    ] = match;

    const currency = this.CURRENCY_SYMBOLS[currencySymbol!];
    if (!currency) {
      throw new Error(`Unsupported currency symbol: ${currencySymbol}`);
    }

    const amount = parseFloat(amountStr!.replace(/,/g, ''));
    const year = parseInt(yearStr!, 10);
    const month = monthStr ? parseInt(monthStr, 10) : undefined;
    const day = dayStr ? parseInt(dayStr, 10) : undefined;

    if (methodStr && sourceYearStr) {
      const method = methodStr as TransformationMethod;
      const sourceYear = parseInt(sourceYearStr, 10);
      const sourceMonth = sourceMonthStr ? parseInt(sourceMonthStr, 10) : undefined;
      const sourceDay = sourceDayStr ? parseInt(sourceDayStr, 10) : undefined;

      return TimeBucks.createCalculated(
        amount,
        currency,
        year,
        method,
        sourceYear,
        month,
        day,
        sourceMonth,
        sourceDay
      );
    }

    return TimeBucks.create(amount, currency, year, month, day);
  }

  static validate(notation: string): boolean {
    try {
      this.parse(notation);
      return true;
    } catch {
      return false;
    }
  }

  static parseRaw(notation: string): ParsedNotation {
    const match = notation.match(this.NOTATION_REGEX);
    if (!match) {
      throw new Error(`Invalid TimeBucks notation: ${notation}`);
    }

    const [
      ,
      currencySymbol,
      amountStr,
      yearStr,
      monthStr,
      dayStr,
      methodStr,
      sourceYearStr,
      sourceMonthStr,
      sourceDayStr,
    ] = match;

    const currency = this.CURRENCY_SYMBOLS[currencySymbol!];
    if (!currency) {
      throw new Error(`Unsupported currency symbol: ${currencySymbol}`);
    }

    const result: ParsedNotation = {
      amount: parseFloat(amountStr!.replace(/,/g, '')),
      currency,
      year: parseInt(yearStr!, 10),
      month: monthStr ? parseInt(monthStr, 10) : undefined,
      day: dayStr ? parseInt(dayStr, 10) : undefined,
    };

    if (methodStr && sourceYearStr) {
      result.method = methodStr as TransformationMethod;
      result.sourceYear = parseInt(sourceYearStr, 10);
      result.sourceMonth = sourceMonthStr ? parseInt(sourceMonthStr, 10) : undefined;
      result.sourceDay = sourceDayStr ? parseInt(sourceDayStr, 10) : undefined;
    }

    return result;
  }
}