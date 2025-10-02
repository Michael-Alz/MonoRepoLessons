import { Calculator } from '../src/calculator';

describe('Calculator Coverage - explicit branch tests', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  test('errors on unexpected end of expression after operator', () => {
    const result = calculator.calculate(['2', '+']);
    expect(result.error).toBe('Unexpected end of expression');
    expect(result.result).toBeUndefined();
  });

  test('errors when operand token is empty string', () => {
    const result = calculator.calculate(['2', '+', '']);
    expect(result.error).toBe('Unexpected end of expression');
    expect(result.result).toBeUndefined();
  });

  test('errors on missing closing parenthesis', () => {
    const result = calculator.calculate(['(', '2', '+', '3']);
    expect(result.error).toBe('Missing closing parenthesis');
    expect(result.result).toBeUndefined();
  });
});


