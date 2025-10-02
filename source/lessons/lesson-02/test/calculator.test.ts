import { Calculator } from '../src/calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('Basic arithmetic operations', () => {
    test('should add two numbers', () => {
      const result = calculator.calculate(['2', '+', '3']);
      expect(result.result).toBe(5);
      expect(result.error).toBeUndefined();
    });

    test('should subtract two numbers', () => {
      const result = calculator.calculate(['5', '-', '3']);
      expect(result.result).toBe(2);
      expect(result.error).toBeUndefined();
    });

    test('should multiply two numbers', () => {
      const result = calculator.calculate(['4', '*', '3']);
      expect(result.result).toBe(12);
      expect(result.error).toBeUndefined();
    });

    test('should divide two numbers', () => {
      const result = calculator.calculate(['8', '/', '2']);
      expect(result.result).toBe(4);
      expect(result.error).toBeUndefined();
    });
  });

  describe('Decimal numbers', () => {
    test('should handle decimal numbers', () => {
      const result = calculator.calculate(['2.5', '+', '1.5']);
      expect(result.result).toBe(4);
      expect(result.error).toBeUndefined();
    });

  });

  describe('Operator precedence', () => {
    test('should handle multiplication before addition', () => {
      const result = calculator.calculate(['2', '+', '3', '*', '4']);
      expect(result.result).toBe(14); // 2 + (3 * 4) = 14
      expect(result.error).toBeUndefined();
    });

    test('should handle division before subtraction', () => {
      const result = calculator.calculate(['10', '-', '8', '/', '2']);
      expect(result.result).toBe(6); // 10 - (8 / 2) = 6
      expect(result.error).toBeUndefined();
    });

    test('should handle multiple operations with precedence', () => {
      const result = calculator.calculate(['2', '*', '3', '+', '4', '*', '5']);
      expect(result.result).toBe(26); // (2 * 3) + (4 * 5) = 6 + 20 = 26
      expect(result.error).toBeUndefined();
    });
  });

  describe('Parentheses', () => {
    test('should handle simple parentheses', () => {
      const result = calculator.calculate(['(', '2', '+', '3', ')', '*', '4']);
      expect(result.result).toBe(20); // (2 + 3) * 4 = 20
      expect(result.error).toBeUndefined();
    });

    test('should handle nested parentheses', () => {
      const result = calculator.calculate(['(', '(', '2', '+', '3', ')', '*', '4', ')']);
      expect(result.result).toBe(20); // ((2 + 3) * 4) = 20
      expect(result.error).toBeUndefined();
    });

    test('should handle complex nested parentheses', () => {
      const result = calculator.calculate(['(', '2', '+', '(', '3', '*', '4', ')', ')', '/', '2']);
      expect(result.result).toBe(7); // (2 + (3 * 4)) / 2 = 14 / 2 = 7
      expect(result.error).toBeUndefined();
    });
  });

  describe('Unary operators', () => {
    test('should handle unary minus', () => {
      const result = calculator.calculate(['-', '5']);
      expect(result.result).toBe(-5);
      expect(result.error).toBeUndefined();
    });

    test('should handle unary minus in expression', () => {
      const result = calculator.calculate(['3', '+', '-', '2']);
      expect(result.result).toBe(1); // 3 + (-2) = 1
      expect(result.error).toBeUndefined();
    });

    test('should handle unary minus with parentheses', () => {
      const result = calculator.calculate(['-', '(', '2', '+', '3', ')']);
      expect(result.result).toBe(-5); // -(2 + 3) = -5
      expect(result.error).toBeUndefined();
    });
  });

  describe('Complex expressions', () => {
    test('should handle complex mathematical expression', () => {
      const result = calculator.calculate(['2', '*', '(', '3', '+', '4', ')', '-', '5', '/', '2.5']);
      expect(result.result).toBe(12); // 2 * (3 + 4) - 5 / 2.5 = 2 * 7 - 2 = 14 - 2 = 12
      expect(result.error).toBeUndefined();
    });

    test('should handle expression with multiple unary operators', () => {
      const result = calculator.calculate(['-', '2', '*', '-', '3', '+', '1']);
      expect(result.result).toBe(7); // (-2) * (-3) + 1 = 6 + 1 = 7
      expect(result.error).toBeUndefined();
    });

    test('should handle addition and subtraction with multiplication in parentheses', () => {
      const result = calculator.calculate(['1', '+', '2', '-', '(', '4', '*', '34', ')']);
      expect(result.result).toBe(-133); // 1 + 2 - (4 * 34) = 3 - 136 = -133
      expect(result.error).toBeUndefined();
    });
  });

  describe('Error handling', () => {
    test('should handle empty expression', () => {
      const result = calculator.calculate([]);
      expect(result.error).toBe('Empty expression');
      expect(result.result).toBeUndefined();
    });

    test('should handle division by zero', () => {
      const result = calculator.calculate(['5', '/', '0']);
      expect(result.error).toBe('Division by zero');
      expect(result.result).toBeUndefined();
    });

    test('should handle invalid token', () => {
      const result = calculator.calculate(['2', '+', 'abc']);
      expect(result.error).toBe('Invalid token: abc');
      expect(result.result).toBeUndefined();
    });

    test('should handle unexpected token', () => {
      const result = calculator.calculate(['2', '+', '3', ')']);
      expect(result.error).toBe('Unexpected token: )');
      expect(result.result).toBeUndefined();
    });

  });

  describe('Edge cases', () => {
    test('should handle single number', () => {
      const result = calculator.calculate(['42']);
      expect(result.result).toBe(42);
      expect(result.error).toBeUndefined();
    });

    test('should handle zero', () => {
      const result = calculator.calculate(['0']);
      expect(result.result).toBe(0);
      expect(result.error).toBeUndefined();
    });

    test('should handle negative zero', () => {
      const result = calculator.calculate(['-', '0']);
      expect(result.result).toBe(-0);
      expect(result.error).toBeUndefined();
    });

    test('should handle very small decimal', () => {
      const result = calculator.calculate(['0.1', '+', '0.2']);
      expect(result.result).toBeCloseTo(0.3);
      expect(result.error).toBeUndefined();
    });

  });
});
