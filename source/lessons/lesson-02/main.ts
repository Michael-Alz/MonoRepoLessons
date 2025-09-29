#!/usr/bin/env node

import { CalculatorUI } from './src/ui';

/**
 * Main entry point for the Recursive Descent Calculator
 * 
 * This calculator supports:
 * - Basic arithmetic operations: +, -, *, /
 * - Parentheses for grouping
 * - Decimal numbers
 * - Unary operators (+ and -)
 * 
 * Usage:
 * - Type mathematical expressions using numbers, operators, and parentheses
 * - Separate tokens with spaces (e.g., "2 + 3 * ( 4 - 1 )")
 * - Use arrow keys to navigate and backspace to edit
 * - Press Enter to calculate
 * - Press Ctrl+C or 'q' to quit
 */

function main(): void {
  console.log('Starting Recursive Descent Calculator...');
  console.log('Press Ctrl+C or \'q\' to quit');
  
  try {
    const ui = new CalculatorUI();
    ui.start();
  } catch (error) {
    console.error('Failed to start calculator:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions gracefully
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
if (require.main === module) {
  main();
}
