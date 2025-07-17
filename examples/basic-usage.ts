import { TimeBucks, NotationParser } from '../src';

// Example 1: Creating temporal currency values
console.log('=== Creating Temporal Currency Values ===');

const ford1908 = TimeBucks.create(825, 'USD', 1908);
console.log('Model T Ford in 1908:', ford1908.toString());

const salary2024 = TimeBucks.create(75000, 'USD', 2024);
console.log('Modern salary:', salary2024.toString());

// Example 2: Transforming values using different methods
console.log('\n=== Transforming Values ===');

const fordCPI = ford1908.transform('CPI', 2024);
console.log('Ford price in 2024 CPI terms:', fordCPI.toString());

const fordWage = ford1908.transform('WAGE', 2024);
console.log('Ford price in 2024 wage terms:', fordWage.toString());

const fordGold = ford1908.transform('GOLD', 2024);
console.log('Ford price in 2024 gold terms:', fordGold.toString());

// Example 3: Parsing notation strings
console.log('\n=== Parsing Notation Strings ===');

const parsed = NotationParser.parse('$80,000@1930');
console.log('Parsed Babe Ruth salary:', parsed.toString());

const parsedCalculated = NotationParser.parse('$1,400,000@2024[CPI:1930]');
console.log('Parsed calculated value:', parsedCalculated.toString());

// Example 4: Demonstrating different currencies
console.log('\n=== Different Currencies ===');

const eurAmount = TimeBucks.create(100, 'EUR', 2000);
console.log('Euros in 2000:', eurAmount.toString());

const gbpAmount = TimeBucks.create(50, 'GBP', 1950);
console.log('Pounds in 1950:', gbpAmount.toString());

const yenAmount = TimeBucks.create(10000, 'JPY', 1990);
console.log('Yen in 1990:', yenAmount.toString());

// Example 5: Academic writing example
console.log('\n=== Academic Writing Example ===');

const ruthSalary = TimeBucks.create(80000, 'USD', 1930);
const ruthCPI = ruthSalary.transform('CPI', 2024);
const ruthWage = ruthSalary.transform('WAGE', 2024);

console.log(`Babe Ruth's ${ruthSalary.toString()} salary equals ${ruthCPI.toString()} in CPI terms,`);
console.log(`but ${ruthWage.toString()} when measured against average wages.`);

// Example 6: Contract language example
console.log('\n=== Contract Language Example ===');

const rent2024 = TimeBucks.create(2000, 'USD', 2024);
const rent2025 = rent2024.transform('CPI', 2025);
console.log(`Annual rent: ${rent2024.toString()} escalated to ${rent2025.toString()}`);

// Example 7: Demonstrating precision with dates
console.log('\n=== Precision with Dates ===');

const specificDate = TimeBucks.create(100, 'USD', 1970, 6, 15);
console.log('Specific date value:', specificDate.toString());

const transformedDate = specificDate.transform('CPI', 2024, 12, 25);
console.log('Transformed with dates:', transformedDate.toString());

// Example 8: Validation and error handling
console.log('\n=== Validation and Error Handling ===');

console.log('Valid notation?', NotationParser.validate('$100@1970')); // true
console.log('Valid notation?', NotationParser.validate('invalid')); // false

try {
  NotationParser.parse('invalid notation');
} catch (error) {
  console.log('Error caught:', error.message);
}

// Example 9: Comparison between methods
console.log('\n=== Method Comparison ===');

const base = TimeBucks.create(100, 'USD', 1970);
const methods = ['CPI', 'WAGE', 'GOLD'] as const;

console.log(`Starting with ${base.toString()}:`);
methods.forEach(method => {
  const result = base.transform(method, 2024);
  console.log(`  ${method}: ${result.toString()}`);
});

// Example 10: Mathematical relationships
console.log('\n=== Mathematical Relationships ===');

const original1 = TimeBucks.create(100, 'USD', 1970);
const original2 = TimeBucks.create(200, 'USD', 1970);

const transformed1 = original1.transform('CPI', 2024);
const transformed2 = original2.transform('CPI', 2024);

console.log(`${original1.toString()} becomes ${transformed1.toString()}`);
console.log(`${original2.toString()} becomes ${transformed2.toString()}`);
console.log(`Ratio maintained: ${transformed2.amount / transformed1.amount} (should be 2.0)`);