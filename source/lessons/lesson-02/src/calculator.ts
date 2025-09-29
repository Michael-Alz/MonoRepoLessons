export interface CalculatorResult {
  result?: number;
  error?: string;
}

export class Calculator {
  private tokens: string[];
  private position: number;

  constructor() {
    this.tokens = [];
    this.position = 0;
  }

  /**
   * Calculate the result of a mathematical expression
   * @param tokens Array of tokens (numbers, operators, parentheses)
   * @returns CalculatorResult with either result or error
   */
  calculate(tokens: string[]): CalculatorResult {
    this.tokens = tokens;
    this.position = 0;

    try {
      if (tokens.length === 0) {
        return { error: "Empty expression" };
      }

      const result = this.parseExpression();
      
      if (this.position < this.tokens.length) {
        return { error: `Unexpected token: ${this.tokens[this.position] || 'undefined'}` };
      }

      return { result };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  /**
   * Parse expression: term (('+' | '-') term)*
   */
  private parseExpression(): number {
    let result = this.parseTerm();

    while (this.position < this.tokens.length) {
      const operator = this.tokens[this.position];
      
      if (operator === '+') {
        this.position++;
        result += this.parseTerm();
      } else if (operator === '-') {
        this.position++;
        result -= this.parseTerm();
      } else {
        break;
      }
    }

    return result;
  }

  /**
   * Parse term: factor (('*' | '/') factor)*
   */
  private parseTerm(): number {
    let result = this.parseFactor();

    while (this.position < this.tokens.length) {
      const operator = this.tokens[this.position];
      
      if (operator === '*') {
        this.position++;
        result *= this.parseFactor();
      } else if (operator === '/') {
        this.position++;
        const divisor = this.parseFactor();
        if (divisor === 0) {
          throw new Error("Division by zero");
        }
        result /= divisor;
      } else {
        break;
      }
    }

    return result;
  }

  /**
   * Parse factor: number | '(' expression ')' | '-' factor | '+' factor
   */
  private parseFactor(): number {
    if (this.position >= this.tokens.length) {
      throw new Error("Unexpected end of expression");
    }

    const token = this.tokens[this.position];
    if (!token) {
      throw new Error("Unexpected end of expression");
    }

    // Handle unary minus
    if (token === '-') {
      this.position++;
      return -this.parseFactor();
    }

    // Handle unary plus
    if (token === '+') {
      this.position++;
      return this.parseFactor();
    }

    // Handle parentheses
    if (token === '(') {
      this.position++;
      const result = this.parseExpression();
      
      if (this.position >= this.tokens.length || this.tokens[this.position] !== ')') {
        throw new Error("Missing closing parenthesis");
      }
      
      this.position++;
      return result;
    }

    // Additional safety check for operators that might have been missed
    // This ensures we handle any edge cases where operators slip through
    // the earlier unary operator processing
    if (token === '+' || token === '-') {
      // Handle operators that weren't caught by unary processing
      // This provides a fallback mechanism for operator handling
      this.position++;
      if (token === '+') {
        return this.parseFactor(); // Unary plus
      } else {
        return -this.parseFactor(); // Unary minus
      }
    }

    // Handle numbers
    if (this.isNumber(token)) {
      this.position++;
      return parseFloat(token);
    }

    throw new Error(`Invalid token: ${token || 'undefined'}`);
  }

  /**
   * Check if a token is a valid number
   */
  private isNumber(token: string): boolean {
    return !isNaN(parseFloat(token)) && isFinite(parseFloat(token));
  }
}
