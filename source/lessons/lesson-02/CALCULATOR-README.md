# Recursive Descent Calculator

A terminal-based calculator built with TypeScript that uses recursive descent parsing to evaluate mathematical expressions.

## Features

- **Basic arithmetic operations**: `+`, `-`, `*`, `/`
- **Parentheses support**: `(` and `)` for grouping expressions
- **Decimal numbers**: Support for floating-point numbers
- **Unary operators**: Support for unary `+` and `-`
- **Interactive terminal UI**: Built with blessed for a rich terminal experience
- **Real-time editing**: Arrow keys for navigation, backspace for deletion
- **Auto-spacing**: Operators and parentheses automatically get proper spacing
- **Comprehensive error handling**: Clear error messages for invalid expressions

## Project Structure

```
lesson-02/
├── main.ts                 # Entry point
├── src/
│   ├── calculator.ts       # Calculator class with recursive descent parser
│   └── ui.ts              # Blessed terminal UI
├── test/
│   └── calculator.test.ts  # Comprehensive test suite
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

### Running the Calculator

```bash
# Development mode (with ts-node)
npm run calculator

# Production mode (compile first)
npm run build
npm start
```

### Using the Calculator

1. **Input**: Type mathematical expressions using numbers, operators, and parentheses
2. **Editing**: 
   - Use left/right arrow keys to move cursor
   - Use backspace to delete characters
   - Operators and parentheses automatically get spaces added around them
   - Spaces are allowed and ignored during parsing
3. **Calculate**: Press Enter to evaluate the expression
4. **Quit**: Press Ctrl+C or 'q' to exit

### Expression Examples

```
2 + 3 * 4           # Result: 14 (follows operator precedence)
( 2 + 3 ) * 4       # Result: 20 (parentheses override precedence)
-5 + 3              # Result: -2 (unary minus)
10 / 2.5            # Result: 4 (decimal numbers)
2 * ( 3 + 4 ) - 5   # Result: 9 (complex expression)
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Implementation Details

### Recursive Descent Parser

The calculator uses a recursive descent parser with the following grammar:

```
expression → term (('+' | '-') term)*
term       → factor (('*' | '/') factor)*
factor     → number | '(' expression ')' | ('-' | '+') factor
```

This grammar ensures proper operator precedence:
1. Parentheses (highest precedence)
2. Unary operators (`+`, `-`)
3. Multiplication and division (`*`, `/`)
4. Addition and subtraction (`+`, `-`) (lowest precedence)

### Error Handling

The calculator handles various error conditions:
- Empty expressions
- Division by zero
- Missing parentheses
- Invalid tokens
- Incomplete expressions
- Unexpected tokens

### Terminal UI

The blessed-based UI provides:
- Real-time formula editing with cursor position
- Separate display areas for input, result, and errors
- Keyboard navigation and editing
- Clear instructions and visual feedback

## Development

### Building

```bash
npm run build
```

### Cleaning

```bash
npm run clean
```

## Dependencies

- **blessed**: Terminal UI framework
- **typescript**: TypeScript compiler
- **jest**: Testing framework
- **ts-jest**: TypeScript support for Jest
- **ts-node**: TypeScript execution for development
