# TimeBucks: Universal Notation for Temporal Currency Values

> "A dollar today is not the same as a dollar in 1910"

TimeBucks provides a universal notation system for expressing currency values across time periods, making it clear when a monetary amount is anchored to a specific time period and how it can be converted using different economic models.

## The Problem

Current approaches to historical currency comparison are inconsistent and confusing:
- "In constant dollars" - but which year?
- "Adjusted for inflation" - but which method?
- "$100 in 1910 money" - equivalent to what today?

Different calculation methods (CPI, wage comparison, gold standard) yield dramatically different results, yet most tools hide this complexity.

## The Solution: TimeBucks Notation

### Basic Format
```
$X@YYYY
```

Where:
- `$` = Currency symbol (works with €, £, ¥, etc.)
- `X` = Amount
- `@` = "at" symbol indicating temporal anchor
- `YYYY` = Year (can extend to YYYY-MM-DD for precision)

### Examples
- `$100@1910` = "100 dollars as valued in 1910"
- `€50@2000` = "50 euros as valued in 2000"
- `£25@1950` = "25 pounds as valued in 1950"

### Transformation Operation
```
$X@YYYY₁ →[method] $Y@YYYY₂[method:YYYY₁]
```

**Key principle**: The result preserves complete transformation metadata.

#### Examples
```
$100@1910 →[CPI] $3,150@2024[CPI:1910]
$100@1910 →[WAGE] $2,800@2024[WAGE:1910]
$100@1910 →[GOLD] $4,200@2024[GOLD:1910]
```

## Value Types

### Natural Values
Direct historical or current facts with no calculation involved:
- `$825@1908` (what a Model T actually cost in 1908)
- `$45,000@2024` (what something actually costs in 2024)

### Calculated Values
Derived through economic transformation, preserving full provenance:
- `$27,000@2024[CPI:1908]` (1908 value expressed in 2024 CPI terms)
- `$35,000@2024[WAGE:1908]` (1908 value expressed in 2024 wage equivalents)

## Transformation Methods

### Consumer Price Index (CPI)
Default method measuring general price inflation:
```
$100@1970 →[CPI] $667@2024[CPI:1970]
```

### Purchasing Power Parity (PPP)
For cross-country comparisons:
```
$100@1970 →[PPP] $580@2024[PPP:1970]
```

### Gold Standard (GOLD)
Based on gold price equivalents:
```
$100@1970 →[GOLD] $750@2024[GOLD:1970]
```

### Wage Comparison (WAGE)
Based on average wage multiples:
```
$100@1970 →[WAGE] $720@2024[WAGE:1970]
```

## Usage Examples

### Academic Writing
"The Model T Ford cost $825@1908 →[CPI] $27,000@2024[CPI:1908], but when compared by average wages, $825@1908 →[WAGE] $35,000@2024[WAGE:1908]."

### Contract Language
"Annual rent: $2,000@2024 →[CPI] $X@2025[CPI:2024] (adjusted yearly)"

### Historical Analysis
"Babe Ruth's $80,000@1930 →[CPI] $1.4M@2024[CPI:1930] salary represents $80,000@1930 →[WAGE] $2.1M@2024[WAGE:1930] in wage equivalents."

## Mathematical Rigor

### Complete Dimensional Consistency
- Natural values: `$X@YYYY` (complete temporal currency units)
- Calculated values: `$X@YYYY[method:source_year]` (complete transformation metadata)
- All transformations are invertible and verifiable

### Transformation Function
```
→[method]: USD@t₁ → USD@t₂[method:t₁]
```

The method operator takes temporal currency units and produces new temporal currency units with complete provenance.

## Why This Matters

### Academic Benefits
- **Transparency**: Clear methodology in research
- **Reproducibility**: Anyone can verify calculations
- **Comparison**: Easy to show different methods side-by-side

### Legal Benefits
- **Precision**: Eliminates interpretation disputes in contracts
- **Standardization**: Consistent across all agreements
- **Enforceability**: Clear mathematical basis for adjustments

### General Benefits
- **Education**: Helps people understand economic concepts
- **Clarity**: No ambiguity about time periods or methods
- **Universality**: Works with any currency and time period

## Installation

```bash
npm install timebucks
```

## Quick Start

```typescript
import { TimeBucks } from 'timebucks';

// Create temporal currency values
const ford1908 = TimeBucks.parse('$825@1908');
const modern = ford1908.transform('CPI', 2024);

console.log(modern.toString()); // "$27,000@2024[CPI:1908]"
```

## Contributing

TimeBucks is an open-source standard. Contributions welcome for:
- Additional transformation methods
- Historical data sources
- Language implementations
- Academic papers and examples

## License

MIT License - see LICENSE file for details

---

*"Making temporal currency comparisons transparent, rigorous, and universally understandable."*