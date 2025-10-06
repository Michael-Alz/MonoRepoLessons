import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Calculator from '../Calculator';
import { CalculatorService, CalculatorResult } from '../calculator';

/**
 * UI TESTS WITH MOCKED CALCULATOR - THE "CLEAN" APPROACH
 * 
 * These tests focus ONLY on UI behavior and integration with the calculator service.
 * Business logic is mocked so we can test UI concerns in isolation.
 * 
 * Notice how these tests are:
 * 1. FAST: Business logic is mocked
 * 2. FOCUSED: Only UI behavior is tested
 * 3. RELIABLE: Predictable mock responses
 * 4. MAINTAINABLE: Independent of business logic changes
 */

// Mock the calculator service
const createMockCalculatorService = (): jest.Mocked<CalculatorService> => ({
  calculateExpression: jest.fn(),
} as any);

describe('Calculator UI Tests - Focused on UI Behavior', () => {
  let mockCalculatorService: jest.Mocked<CalculatorService>;

  beforeEach(() => {
    mockCalculatorService = createMockCalculatorService();
    // Set up default mock behavior
    mockCalculatorService.calculateExpression.mockReturnValue({ result: 0 });
  });

  describe('UI Rendering', () => {
    test('renders calculator title and subtitle', () => {
      render(<Calculator calculatorService={mockCalculatorService} />);
      expect(screen.getByText('🏗️ Model-Based Calculator')).toBeInTheDocument();
      expect(screen.getByText('Business logic separated - Easy to test!')).toBeInTheDocument();
    });

    test('renders display field with initial value', () => {
      render(<Calculator calculatorService={mockCalculatorService} />);
      const display = screen.getByTestId('calculator-display');
      expect(display).toBeInTheDocument();
      expect(display).toHaveValue('0');
    });

    test('renders all number buttons (0-9)', () => {
      render(<Calculator calculatorService={mockCalculatorService} />);
      for (let i = 0; i <= 9; i++) {
        expect(screen.getByTestId(`number-${i}`)).toBeInTheDocument();
      }
    });

    test('renders all operator buttons', () => {
      render(<Calculator calculatorService={mockCalculatorService} />);
      expect(screen.getByTestId('add-button')).toBeInTheDocument();
      expect(screen.getByTestId('subtract-button')).toBeInTheDocument();
      expect(screen.getByTestId('multiply-button')).toBeInTheDocument();
      expect(screen.getByTestId('divide-button')).toBeInTheDocument();
    });

    test('renders control buttons', () => {
      render(<Calculator calculatorService={mockCalculatorService} />);
      expect(screen.getByTestId('equals-button')).toBeInTheDocument();
      expect(screen.getByTestId('clear-button')).toBeInTheDocument();
      expect(screen.getByTestId('decimal-button')).toBeInTheDocument();
      expect(screen.getByTestId('open-paren-button')).toBeInTheDocument();
      expect(screen.getByTestId('close-paren-button')).toBeInTheDocument();
    });

    test('renders expression display area', () => {
      render(<Calculator calculatorService={mockCalculatorService} />);
      expect(screen.getByText('Expression: None')).toBeInTheDocument();
    });
  });

  describe('Number Input Behavior', () => {
    test('updates display when number button is clicked', async () => {
      const user = userEvent.setup();
      render(<Calculator calculatorService={mockCalculatorService} />);
      
      const display = screen.getByTestId('calculator-display');
      await user.click(screen.getByTestId('number-5'));

      expect(display).toHaveValue('5');
    });

    test('builds multi-digit numbers', async () => {
      const user = userEvent.setup();
      render(<Calculator calculatorService={mockCalculatorService} />);
      
      const display = screen.getByTestId('calculator-display');
      await user.click(screen.getByTestId('number-1'));
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('number-3'));

      expect(display).toHaveValue('123');
    });

    test('replaces initial zero with first number', async () => {
      const user = userEvent.setup();
      render(<Calculator calculatorService={mockCalculatorService} />);
      
      const display = screen.getByTestId('calculator-display');
      expect(display).toHaveValue('0'); // Initial state
      
      await user.click(screen.getByTestId('number-7'));
      expect(display).toHaveValue('7'); // Should replace, not append
    });

    test('handles decimal point input', async () => {
      const user = userEvent.setup();
      render(<Calculator calculatorService={mockCalculatorService} />);
      
      const display = screen.getByTestId('calculator-display');
      await user.click(screen.getByTestId('number-3'));
      await user.click(screen.getByTestId('decimal-button'));
      await user.click(screen.getByTestId('number-1'));
      await user.click(screen.getByTestId('number-4'));

      expect(display).toHaveValue('3.14');
    });
  });

  describe('Operator Input Behavior', () => {
    test('updates expression when operator is clicked', async () => {
      const user = userEvent.setup();
      render(<Calculator calculatorService={mockCalculatorService} />);
      
      await user.click(screen.getByTestId('number-5'));
      await user.click(screen.getByTestId('add-button'));

      expect(screen.getByText('Expression: 5 + ')).toBeInTheDocument();
    });

    test('shows expression in display when operator is clicked', async () => {
      const user = userEvent.setup();
      render(<Calculator calculatorService={mockCalculatorService} />);
      
      const display = screen.getByTestId('calculator-display');
      await user.click(screen.getByTestId('number-3'));
      await user.click(screen.getByTestId('multiply-button'));

      expect(display).toHaveValue('3 * ');
    });

    test('handles all operator buttons correctly', async () => {
      const user = userEvent.setup();
      render(<Calculator calculatorService={mockCalculatorService} />);
      
      const operators = [
        { testId: 'add-button', symbol: ' + ' },
        { testId: 'subtract-button', symbol: ' - ' },
        { testId: 'multiply-button', symbol: ' * ' },
        { testId: 'divide-button', symbol: ' / ' }
      ];

      for (const op of operators) {
        await user.click(screen.getByTestId('clear-button')); // Reset
        await user.click(screen.getByTestId('number-2'));
        await user.click(screen.getByTestId(op.testId));
        
        expect(screen.getByText(`Expression: 2${op.symbol}`)).toBeInTheDocument();
      }
    });
  });

  describe('Parentheses Input Behavior', () => {
    test('adds opening parenthesis to expression', async () => {
      const user = userEvent.setup();
      render(<Calculator calculatorService={mockCalculatorService} />);
      
      await user.click(screen.getByTestId('open-paren-button'));
      expect(screen.getByText('Expression: (')).toBeInTheDocument();
    });

    test('adds closing parenthesis to expression', async () => {
      const user = userEvent.setup();
      render(<Calculator calculatorService={mockCalculatorService} />);
      
      await user.click(screen.getByTestId('open-paren-button'));
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('close-paren-button'));
      
      expect(screen.getByText('Expression: (2)')).toBeInTheDocument();
    });

    test('builds complex parenthetical expressions', async () => {
      const user = userEvent.setup();
      render(<Calculator calculatorService={mockCalculatorService} />);
      
      await user.click(screen.getByTestId('open-paren-button'));
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-3'));
      await user.click(screen.getByTestId('close-paren-button'));
      await user.click(screen.getByTestId('multiply-button'));
      await user.click(screen.getByTestId('number-4'));

      expect(screen.getByText('Expression: (2 + 3) * 4')).toBeInTheDocument();
    });
  });

  describe('Calculator Service Integration', () => {
    test('calls calculator service when equals is clicked', async () => {
      const user = userEvent.setup();
      mockCalculatorService.calculateExpression.mockReturnValue({ result: 8 });
      
      render(<Calculator calculatorService={mockCalculatorService} />);
      
      await user.click(screen.getByTestId('number-5'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-3'));
      await user.click(screen.getByTestId('equals-button'));

      expect(mockCalculatorService.calculateExpression).toHaveBeenCalledWith('5 + 3');
    });

    test('displays result from calculator service', async () => {
      const user = userEvent.setup();
      mockCalculatorService.calculateExpression.mockReturnValue({ result: 15 });
      
      render(<Calculator calculatorService={mockCalculatorService} />);
      const display = screen.getByTestId('calculator-display');
      
      await user.click(screen.getByTestId('number-5'));
      await user.click(screen.getByTestId('multiply-button'));
      await user.click(screen.getByTestId('number-3'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('15');
    });

    test('updates expression to show result after calculation', async () => {
      const user = userEvent.setup();
      mockCalculatorService.calculateExpression.mockReturnValue({ result: 42 });
      
      render(<Calculator calculatorService={mockCalculatorService} />);
      
      await user.click(screen.getByTestId('number-6'));
      await user.click(screen.getByTestId('multiply-button'));
      await user.click(screen.getByTestId('number-7'));
      await user.click(screen.getByTestId('equals-button'));

      expect(screen.getByText('Expression: 42')).toBeInTheDocument();
    });

    test('displays error from calculator service', async () => {
      const user = userEvent.setup();
      mockCalculatorService.calculateExpression.mockReturnValue({ 
        error: 'Division by zero' 
      });
      
      render(<Calculator calculatorService={mockCalculatorService} />);
      const display = screen.getByTestId('calculator-display');
      
      await user.click(screen.getByTestId('number-5'));
      await user.click(screen.getByTestId('divide-button'));
      await user.click(screen.getByTestId('number-0'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('Error');
      expect(screen.getByTestId('error-display')).toHaveTextContent('Division by zero');
    });

    test('handles different error types from calculator service', async () => {
      const user = userEvent.setup();
      const errorCases = [
        'Division by zero',
        'Invalid token: abc',
        'Missing closing parenthesis',
        'Unexpected end of expression'
      ];

      for (const errorMessage of errorCases) {
        mockCalculatorService.calculateExpression.mockReturnValue({ error: errorMessage });
        
        render(<Calculator calculatorService={mockCalculatorService} />);
        const display = screen.getByTestId('calculator-display');
        
        await user.click(screen.getByTestId('equals-button'));
        
        expect(display).toHaveValue('Error');
        expect(screen.getByTestId('error-display')).toHaveTextContent(errorMessage);
        
        // Clean up for next iteration
        screen.getByTestId('calculator-display').closest('div')?.remove();
      }
    });
  });

  describe('Clear Functionality', () => {
    test('resets display to zero when clear is clicked', async () => {
      const user = userEvent.setup();
      render(<Calculator calculatorService={mockCalculatorService} />);
      
      const display = screen.getByTestId('calculator-display');
      
      // Build up some state
      await user.click(screen.getByTestId('number-5'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-3'));
      
      expect(display).toHaveValue('5 + 3');
      
      // Clear
      await user.click(screen.getByTestId('clear-button'));
      
      expect(display).toHaveValue('0');
    });

    test('resets expression when clear is clicked', async () => {
      const user = userEvent.setup();
      render(<Calculator calculatorService={mockCalculatorService} />);
      
      // Build up expression
      await user.click(screen.getByTestId('number-5'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-3'));
      
      expect(screen.getByText('Expression: 5 + 3')).toBeInTheDocument();
      
      // Clear
      await user.click(screen.getByTestId('clear-button'));
      
      expect(screen.getByText('Expression: None')).toBeInTheDocument();
    });

    test('clears error state when clear is clicked', async () => {
      const user = userEvent.setup();
      mockCalculatorService.calculateExpression.mockReturnValue({ error: 'Test error' });
      
      render(<Calculator calculatorService={mockCalculatorService} />);
      
      // Create error state
      await user.click(screen.getByTestId('equals-button'));
      expect(screen.getByTestId('error-display')).toBeInTheDocument();
      
      // Clear should remove error
      await user.click(screen.getByTestId('clear-button'));
      expect(screen.queryByTestId('error-display')).not.toBeInTheDocument();
    });
  });

  describe('Error State Handling', () => {
    test('starts new calculation after error', async () => {
      const user = userEvent.setup();
      
      // First, simulate an error
      mockCalculatorService.calculateExpression.mockReturnValue({ 
        error: 'Invalid expression' 
      });
      
      render(<Calculator calculatorService={mockCalculatorService} />);
      const display = screen.getByTestId('calculator-display');
      
      await user.click(screen.getByTestId('equals-button'));
      expect(display).toHaveValue('Error');
      
      // Now start new calculation
      await user.click(screen.getByTestId('number-7'));
      expect(display).toHaveValue('7'); // Should replace error
      expect(screen.queryByTestId('error-display')).not.toBeInTheDocument();
    });

    test('clears error when starting new calculation', async () => {
      const user = userEvent.setup();
      mockCalculatorService.calculateExpression.mockReturnValue({ error: 'Test error' });
      
      render(<Calculator calculatorService={mockCalculatorService} />);
      
      // Create error
      await user.click(screen.getByTestId('equals-button'));
      expect(screen.getByTestId('error-display')).toBeInTheDocument();
      
      // Start new calculation
      await user.click(screen.getByTestId('number-1'));
      expect(screen.queryByTestId('error-display')).not.toBeInTheDocument();
    });
  });

  describe('Default Calculator Service', () => {
    test('works without injected calculator service', () => {
      // Test that component can work without dependency injection
      render(<Calculator />);
      
      expect(screen.getByTestId('calculator-display')).toBeInTheDocument();
      expect(screen.getByText('🏗️ Model-Based Calculator')).toBeInTheDocument();
    });

    test('can perform basic calculation with default service', async () => {
      const user = userEvent.setup();
      
      // Use real calculator service (no mocking)
      render(<Calculator />);
      
      const display = screen.getByTestId('calculator-display');
      
      // Perform 2 + 3 = 5
      await user.click(screen.getByTestId('number-2'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-3'));
      await user.click(screen.getByTestId('equals-button'));

      expect(display).toHaveValue('5');
    });
  });

  describe('UI State Consistency', () => {
    test('maintains consistent state between display and expression', async () => {
      const user = userEvent.setup();
      render(<Calculator calculatorService={mockCalculatorService} />);
      
      const display = screen.getByTestId('calculator-display');
      
      // Build expression
      await user.click(screen.getByTestId('number-1'));
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('number-2'));
      
      expect(display).toHaveValue('1 + 2');
      expect(screen.getByText('Expression: 1 + 2')).toBeInTheDocument();
    });

    test('updates both display and expression after calculation', async () => {
      const user = userEvent.setup();
      mockCalculatorService.calculateExpression.mockReturnValue({ result: 99 });
      
      render(<Calculator calculatorService={mockCalculatorService} />);
      const display = screen.getByTestId('calculator-display');
      
      await user.click(screen.getByTestId('number-1'));
      await user.click(screen.getByTestId('equals-button'));
      
      expect(display).toHaveValue('99');
      expect(screen.getByText('Expression: 99')).toBeInTheDocument();
    });
  });
});

/**
 * BENEFITS OF THIS UI TESTING APPROACH:
 * 
 * 1. FAST: Business logic is mocked, tests run quickly
 * 2. FOCUSED: Tests only UI concerns, not business logic
 * 3. RELIABLE: Predictable mock responses eliminate flakiness
 * 4. MAINTAINABLE: Business logic changes don't break UI tests
 * 5. ISOLATED: Can test UI edge cases without complex business setup
 * 6. COMPREHENSIVE: Easy to test all UI states and error conditions
 * 7. DEBUGGABLE: Clear separation makes issues easier to identify
 * 8. FLEXIBLE: Can test UI with any business logic scenario via mocks
 * 
 * Combined with the separate business logic tests, this provides
 * complete coverage with fast, maintainable, and reliable tests!
 */