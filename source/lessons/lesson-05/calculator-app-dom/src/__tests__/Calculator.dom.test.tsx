import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Calculator from '../Calculator';

/**
 * DOM-BASED CALCULATOR TESTS - THE "UGLY" APPROACH
 * 
 * These are the SAME TESTS as the model-based version, but implemented
 * through painful DOM manipulation. Notice how EVERY test requires:
 * 
 * 1. Full component rendering
 * 2. DOM manipulation to test business logic
 * 3. Complex button clicking sequences
 * 4. Slow execution due to DOM operations
 * 5. Brittle tests that break when UI changes
 * 
 * Compare these IDENTICAL test scenarios with the model-based approach!
 */

describe('Calculator Tests - DOM-Based Implementation', () => {
  beforeEach(() => {
    render(<Calculator />);
  });

  describe('Basic Arithmetic Operations', () => {
    test('should add two numbers: 2 + 3 = 5', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      // PAINFUL: Must click through UI for simple math
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-3'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('5');
    });

    test('should subtract two numbers: 5 - 3 = 2', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      await user.click(screen.getByTestId('number-5'));
      await user.click(screen.getByTestId('subtract-button'));
      await user.click(screen.getByTestId('number-3'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('2');
    });

    test('should multiply two numbers: 4 * 3 = 12', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      await user.click(screen.getByTestId('number-4'));
      await user.click(screen.getByTestId('multiply-button'));
      await user.click(screen.getByTestId('number-3'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('12');
    });

    test('should divide two numbers: 8 / 2 = 4', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      await user.click(screen.getByTestId('number-8'));
      await user.click(screen.getByTestId('divide-button'));
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('4');
    });
  });

  describe('Decimal Numbers', () => {
    test('should handle decimal addition: 2.5 + 1.5 = 4', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      // EXTREMELY PAINFUL: Many clicks for simple decimal math
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('decimal-button'));
      await user.click(screen.getByTestId('number-5'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-1'));
      await user.click(screen.getByTestId('decimal-button'));
      await user.click(screen.getByTestId('number-5'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('4');
    });

    test('should handle floating point precision: 0.1 + 0.2 ≈ 0.3', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      await user.click(screen.getByTestId('number-0'));
      await user.click(screen.getByTestId('decimal-button'));
      await user.click(screen.getByTestId('number-1'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-0'));
      await user.click(screen.getByTestId('decimal-button'));
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('equals-button'));

      // Note: Floating point precision issues make this test fragile
      const result = parseFloat(display.value);
      expect(result).toBeCloseTo(0.3);
    });
  });

  describe('Operator Precedence', () => {
    test('should handle multiplication before addition: 2 + 3 * 4 = 14', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      // SLOW: Complex sequence for operator precedence
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-3'));
      await user.click(screen.getByTestId('multiply-button'));
      await user.click(screen.getByTestId('number-4'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('14'); // 2 + (3 * 4) = 14
    });

    test('should handle division before subtraction: 10 - 8 / 2 = 6', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      await user.click(screen.getByTestId('number-1'));
      await user.click(screen.getByTestId('number-0'));
      await user.click(screen.getByTestId('subtract-button'));
      await user.click(screen.getByTestId('number-8'));
      await user.click(screen.getByTestId('divide-button'));
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('6'); // 10 - (8 / 2) = 6
    });

    test('should handle multiple operations: 2 * 3 + 4 * 5 = 26', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      // VERY SLOW: Long sequence for complex precedence
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('multiply-button'));
      await user.click(screen.getByTestId('number-3'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-4'));
      await user.click(screen.getByTestId('multiply-button'));
      await user.click(screen.getByTestId('number-5'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('26'); // (2 * 3) + (4 * 5) = 26
    });
  });

  describe('Parentheses', () => {
    test('should handle simple parentheses: (2 + 3) * 4 = 20', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      // EXTREMELY SLOW: Many clicks for parentheses
      await user.click(screen.getByTestId('open-paren-button'));
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-3'));
      await user.click(screen.getByTestId('close-paren-button'));
      await user.click(screen.getByTestId('multiply-button'));
      await user.click(screen.getByTestId('number-4'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('20'); // (2 + 3) * 4 = 20
    });

    test('should handle nested parentheses: ((2 + 3) * 4) = 20', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      await user.click(screen.getByTestId('open-paren-button'));
      await user.click(screen.getByTestId('open-paren-button'));
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-3'));
      await user.click(screen.getByTestId('close-paren-button'));
      await user.click(screen.getByTestId('multiply-button'));
      await user.click(screen.getByTestId('number-4'));
      await user.click(screen.getByTestId('close-paren-button'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('20'); // ((2 + 3) * 4) = 20
    });

    test('should handle complex nested parentheses: (2 + (3 * 4)) / 2 = 7', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      // PAINFULLY SLOW: Very long sequence
      await user.click(screen.getByTestId('open-paren-button'));
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('open-paren-button'));
      await user.click(screen.getByTestId('number-3'));
      await user.click(screen.getByTestId('multiply-button'));
      await user.click(screen.getByTestId('number-4'));
      await user.click(screen.getByTestId('close-paren-button'));
      await user.click(screen.getByTestId('close-paren-button'));
      await user.click(screen.getByTestId('divide-button'));
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('7'); // (2 + (3 * 4)) / 2 = 7
    });
  });

  describe('Error Handling', () => {
    test('should handle division by zero', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      await user.click(screen.getByTestId('number-5'));
      await user.click(screen.getByTestId('divide-button'));
      await user.click(screen.getByTestId('number-0'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('Error');
      expect(screen.getByTestId('error-display')).toHaveTextContent('Division by zero');
    });

    test('should handle missing closing parenthesis', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      await user.click(screen.getByTestId('open-paren-button'));
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-3'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('Error');
      expect(screen.getByTestId('error-display')).toHaveTextContent('Missing closing parenthesis');
    });

    test('should handle unexpected end of expression', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('Error');
      expect(screen.getByTestId('error-display')).toHaveTextContent('Unexpected end of expression');
    });
  });

  describe('Complex Expressions', () => {
    test('should handle complex mathematical expression: 2 * (3 + 4) - 5 / 2.5 = 12', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      // INCREDIBLY SLOW: Very complex sequence
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('multiply-button'));
      await user.click(screen.getByTestId('open-paren-button'));
      await user.click(screen.getByTestId('number-3'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-4'));
      await user.click(screen.getByTestId('close-paren-button'));
      await user.click(screen.getByTestId('subtract-button'));
      await user.click(screen.getByTestId('number-5'));
      await user.click(screen.getByTestId('divide-button'));
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('decimal-button'));
      await user.click(screen.getByTestId('number-5'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('12'); // 2 * (3 + 4) - 5 / 2.5 = 12
    });

    test('should handle very complex nested expression: ((2 + 3) * (4 - 1)) / (5 + 10) = 1', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      // ABSURDLY SLOW: Extremely long sequence
      await user.click(screen.getByTestId('open-paren-button'));
      await user.click(screen.getByTestId('open-paren-button'));
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-3'));
      await user.click(screen.getByTestId('close-paren-button'));
      await user.click(screen.getByTestId('multiply-button'));
      await user.click(screen.getByTestId('open-paren-button'));
      await user.click(screen.getByTestId('number-4'));
      await user.click(screen.getByTestId('subtract-button'));
      await user.click(screen.getByTestId('number-1'));
      await user.click(screen.getByTestId('close-paren-button'));
      await user.click(screen.getByTestId('close-paren-button'));
      await user.click(screen.getByTestId('divide-button'));
      await user.click(screen.getByTestId('open-paren-button'));
      await user.click(screen.getByTestId('number-5'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-1'));
      await user.click(screen.getByTestId('number-0'));
      await user.click(screen.getByTestId('close-paren-button'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('1'); // ((2 + 3) * (4 - 1)) / (5 + 10) = 1
    });
  });

  describe('Edge Cases', () => {
    test('should handle single number: 42 = 42', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      await user.click(screen.getByTestId('number-4'));
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('42');
    });

    test('should handle zero: 0 = 0', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      await user.click(screen.getByTestId('number-0'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('0');
    });

    test('should handle multiple decimal points gracefully', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      // Try to enter 2.5.5 (invalid)
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('decimal-button'));
      await user.click(screen.getByTestId('number-5'));
      await user.click(screen.getByTestId('decimal-button')); // Second decimal
      await user.click(screen.getByTestId('number-5'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('Error');
    });
  });

  describe('UI State Management', () => {
    test('should clear display and expression', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      // Enter some numbers first
      await user.click(screen.getByTestId('number-1'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-2'));
      
      // Then clear
      await user.click(screen.getByTestId('clear-button'));

      expect(display).toHaveValue('0');
      expect(screen.getByText('Expression: None')).toBeInTheDocument();
    });

    test('should start new calculation after error', async () => {
      const user = userEvent.setup();
      const display = screen.getByTestId('calculator-display');

      // Create an error first
      await user.click(screen.getByTestId('number-5'));
      await user.click(screen.getByTestId('divide-button'));
      await user.click(screen.getByTestId('number-0'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('Error');

      // Start new calculation
      await user.click(screen.getByTestId('number-7'));

      expect(display).toHaveValue('7');
    });
  });
});

/**
 * SUMMARY OF PROBLEMS WITH THIS APPROACH:
 * 
 * 1. SLOW: Every test takes 200ms-2s due to DOM operations
 * 2. BRITTLE: Tests break when UI structure changes
 * 3. COMPLEX: Simple math requires complex button sequences
 * 4. HARD TO DEBUG: When tests fail, is it UI or business logic?
 * 5. LIMITED: Difficult to test edge cases thoroughly
 * 6. MAINTENANCE NIGHTMARE: UI changes break business logic tests
 * 7. COUPLING: Cannot test business logic independently
 * 
 * Total execution time: 15-30 seconds for ~20 tests
 * 
 * Compare this with the model-based approach!
 */