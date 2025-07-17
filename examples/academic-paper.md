# Example Academic Paper Using TimeBucks Notation

## Income Inequality and Housing Affordability in American Cities, 1970-2020

### Abstract

This study examines the relationship between median household income and housing costs across major American metropolitan areas from 1970 to 2020. Using the TimeBucks notation system for temporal currency values, we demonstrate how different economic adjustment methods reveal varying perspectives on affordability trends. All monetary values employ the TimeBucks standard ($X@YYYY[method:source]) to ensure transparency and reproducibility.

### Introduction

The relationship between housing costs and income has been a persistent concern in urban economics. However, comparisons across time periods are often complicated by inconsistent inflation adjustment methods and unclear temporal anchoring. This study employs the TimeBucks notation system to provide transparent, reproducible monetary comparisons across five decades of housing data.

### Methodology

All monetary values are expressed using TimeBucks notation ($X@YYYY), where X represents the amount and YYYY represents the year of valuation. When temporal transformations are performed, the complete notation $X@YYYY[method:source] preserves the calculation method and source year for full transparency.

Unless otherwise specified, Consumer Price Index (CPI) adjustments use Bureau of Labor Statistics CPI-U data. Wage comparisons employ median household income data from the U.S. Census Bureau's Current Population Survey.

### Findings

#### San Francisco Housing Market Analysis

In 1970, the median home price in San Francisco was $24,000@1970, while median household income stood at $9,500@1970—yielding a price-to-income ratio of 2.5. By 2020, median home prices had reached $1,400,000@2020 while median household income was $112,000@2020, producing a ratio of 12.5.

When adjusted for general inflation, the 1970 home price of $24,000@1970 →[CPI] $160,080@2020[CPI:1970] demonstrates that housing costs increased far beyond general price inflation. The actual 2020 median price of $1,400,000@2020 represents an 8.7× increase over inflation-adjusted expectations.

Similarly, the 1970 median income of $9,500@1970 →[CPI] $63,360@2020[CPI:1970] shows that real wage growth significantly lagged behind housing appreciation. The actual 2020 median income of $112,000@2020 represents a 1.77× increase over inflation-adjusted expectations—substantial, but insufficient to maintain 1970s housing affordability.

#### Alternative Adjustment Methods

When measured against average wage growth rather than general inflation, the comparison yields different insights:

- 1970 home price: $24,000@1970 →[WAGE] $145,000@2020[WAGE:1970]
- 1970 median income: $9,500@1970 →[WAGE] $57,500@2020[WAGE:1970]

Under wage-adjusted calculations, the 2020 housing market appears even more severely disconnected from historical norms, with homes costing 9.7× their wage-adjusted historical equivalent.

#### Cross-Metropolitan Comparison

Similar patterns emerge across other major metropolitan areas:

**New York City:**
- 1970: $28,000@1970 (median home) vs. $10,200@1970 (median income)
- 2020: $680,000@2020 (median home) vs. $98,000@2020 (median income)
- Inflation-adjusted 1970 home price: $28,000@1970 →[CPI] $186,760@2020[CPI:1970]
- Actual 2020 price represents 3.6× inflation-adjusted expectations

**Los Angeles:**
- 1970: $22,000@1970 (median home) vs. $9,800@1970 (median income)
- 2020: $850,000@2020 (median home) vs. $89,000@2020 (median income)
- Inflation-adjusted 1970 home price: $22,000@1970 →[CPI] $146,740@2020[CPI:1970]
- Actual 2020 price represents 5.8× inflation-adjusted expectations

### Discussion

The TimeBucks notation system reveals how different adjustment methods can substantially alter our understanding of historical economic trends. The transparency afforded by complete transformation metadata ($X@YYYY[method:source]) enables readers to verify calculations and understand the methodological basis for each comparison.

Traditional economic analysis often obscures these methodological choices, leading to confusion about whether values are "in constant dollars" or "adjusted for inflation" without specifying the base year or adjustment method. The TimeBucks system eliminates this ambiguity by encoding all transformation information directly in the notation.

### Implications for Policy

The dramatic divergence between housing costs and both general inflation and wage growth suggests that housing affordability has fundamentally deteriorated over the past five decades. Young adults entering the job market with starting salaries averaging $45,000@2020 face housing costs that have increased far beyond what would be expected based on general economic growth.

### Conclusion

This analysis demonstrates the value of the TimeBucks notation system for economic research requiring temporal currency comparisons. By providing transparent, reproducible notation for monetary values across time periods, researchers can ensure that their methodological choices are clear and their results are verifiable.

The housing affordability crisis emerges clearly when monetary values are properly anchored to their temporal context and adjustment methods are made explicit. Future research should adopt similar transparency standards to ensure that economic analysis is both rigorous and reproducible.

---

### References

*Note: This is a demonstration paper showing TimeBucks notation usage. Actual research would include complete citations and peer-reviewed sources.*

Bureau of Labor Statistics. Consumer Price Index for All Urban Consumers (CPI-U). Various years.

U.S. Census Bureau. Current Population Survey. Various years.

Federal Housing Finance Agency. House Price Index. Various years.

---

### Appendix: TimeBucks Notation Examples

**Natural Values (Historical Facts):**
- $24,000@1970 (actual 1970 median home price)
- $9,500@1970 (actual 1970 median income)
- $1,400,000@2020 (actual 2020 median home price)

**Calculated Values (Transformations):**
- $24,000@1970 →[CPI] $160,080@2020[CPI:1970]
- $9,500@1970 →[WAGE] $57,500@2020[WAGE:1970]
- $28,000@1970 →[CPI] $186,760@2020[CPI:1970]

**Validation:**
All calculations can be verified using the TimeBucks library:
```typescript
import { TimeBucks } from 'timebucks';

const sf1970 = TimeBucks.create(24000, 'USD', 1970);
const sf2020cpi = sf1970.transform('CPI', 2020);
console.log(sf2020cpi.toString()); // $160,080@2020[CPI:1970]
```