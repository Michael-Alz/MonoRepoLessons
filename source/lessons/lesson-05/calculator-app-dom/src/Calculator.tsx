import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  Box,
  Alert
} from '@mui/material';

/**
 * DOM-BASED CALCULATOR - THE "UGLY" APPROACH
 * 
 * This component demonstrates what happens when you embed ALL business logic
 * directly into the React component. Notice how:
 * 
 * 1. Calculator parsing logic is mixed with UI logic
 * 2. State management is intertwined with business rules
 * 3. Testing requires DOM manipulation for EVERYTHING
 * 4. Business logic cannot be tested independently
 * 5. The component becomes massive and hard to maintain
 * 
 * This is intentionally "ugly" to show students why separation matters!
 */

interface CalculatorResult {
  result?: number;
  error?: string;
}

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<CalculatorResult>({ result: 0 });

  // ALL CALCULATOR LOGIC EMBEDDED IN THE COMPONENT - UGLY!
  const parseExpression = (tokens: string[], position: { value: number }): number => {
    let result = parseTerm(tokens, position);

    while (position.value < tokens.length) {
      const operator = tokens[position.value];
      
      if (operator === '+') {
        position.value++;
        result += parseTerm(tokens, position);
      } else if (operator === '-') {
        position.value++;
        result -= parseTerm(tokens, position);
      } else {
        break;
      }
    }

    return result;
  };

  const parseTerm = (tokens: string[], position: { value: number }): number => {
    let result = parseFactor(tokens, position);

    while (position.value < tokens.length) {
      const operator = tokens[position.value];
      
      if (operator === '*') {
        position.value++;
        result *= parseFactor(tokens, position);
      } else if (operator === '/') {
        position.value++;
        const divisor = parseFactor(tokens, position);
        if (divisor === 0) {
          throw new Error("Division by zero");
        }
        result /= divisor;
      } else {
        break;
      }
    }

    return result;
  };

  const parseFactor = (tokens: string[], position: { value: number }): number => {
    if (position.value >= tokens.length) {
      throw new Error("Unexpected end of expression");
    }

    const token = tokens[position.value];
    if (!token) {
      throw new Error("Unexpected end of expression");
    }

    // Handle unary minus
    if (token === '-') {
      position.value++;
      return -parseFactor(tokens, position);
    }

    // Handle unary plus
    if (token === '+') {
      position.value++;
      return parseFactor(tokens, position);
    }

    // Handle parentheses
    if (token === '(') {
      position.value++;
      const result = parseExpression(tokens, position);
      
      if (position.value >= tokens.length || tokens[position.value] !== ')') {
        throw new Error("Missing closing parenthesis");
      }
      
      position.value++;
      return result;
    }

    // Handle numbers
    if (isNumber(token)) {
      position.value++;
      return parseFloat(token);
    }

    throw new Error(`Invalid token: ${token || 'undefined'}`);
  };

  const isNumber = (token: string): boolean => {
    return !isNaN(parseFloat(token)) && isFinite(parseFloat(token));
  };

  const tokenize = (expr: string): string[] => {
    const tokens: string[] = [];
    let current = '';
    
    for (let i = 0; i < expr.length; i++) {
      const char = expr[i];
      
      if (char === ' ') {
        continue;
      }
      
      if ('+-*/()'.includes(char)) {
        if (current) {
          tokens.push(current);
          current = '';
        }
        tokens.push(char);
      } else {
        current += char;
      }
    }
    
    if (current) {
      tokens.push(current);
    }
    
    return tokens;
  };

  // CALCULATE FUNCTION EMBEDDED IN COMPONENT - UGLY!
  const calculate = (expr: string): CalculatorResult => {
    try {
      if (!expr.trim()) {
        return { error: "Empty expression" };
      }

      const tokens = tokenize(expr);
      const position = { value: 0 };
      const result = parseExpression(tokens, position);
      
      if (position.value < tokens.length) {
        return { error: `Unexpected token: ${tokens[position.value] || 'undefined'}` };
      }

      return { result };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Unknown error" };
    }
  };

  // BUTTON HANDLERS WITH MIXED LOGIC - UGLY!
  const handleNumberClick = (num: string) => {
    if (display === '0' || result.error) {
      setDisplay(num);
      setExpression(num);
    } else {
      const newDisplay = display + num;
      setDisplay(newDisplay);
      setExpression(expression + num);
    }
    setResult({ result: 0 });
  };

  const handleOperatorClick = (op: string) => {
    const newExpression = expression + ' ' + op + ' ';
    setExpression(newExpression);
    setDisplay(newExpression);
    setResult({ result: 0 });
  };

  const handleEqualsClick = () => {
    const calcResult = calculate(expression);
    setResult(calcResult);
    
    if (calcResult.result !== undefined) {
      setDisplay(calcResult.result.toString());
      setExpression(calcResult.result.toString());
    } else {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setResult({ result: 0 });
  };

  const handleParentheses = (paren: string) => {
    const newExpression = expression + paren;
    setExpression(newExpression);
    setDisplay(newExpression);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          🔗 DOM-Based Calculator
        </Typography>
        
        <Typography variant="subtitle2" align="center" color="text.secondary" sx={{ mb: 2 }}>
          Business logic embedded in component - Hard to test!
        </Typography>

        {result.error && (
          <Alert severity="error" sx={{ mb: 2 }} data-testid="error-display">
            {result.error}
          </Alert>
        )}

        <TextField
          fullWidth
          variant="outlined"
          value={display}
          InputProps={{
            readOnly: true,
            style: { fontSize: '1.5rem', textAlign: 'right' }
          }}
          sx={{ mb: 2 }}
          data-testid="calculator-display"
        />

        <Grid container spacing={1}>
          {/* Row 1 */}
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClear}
              data-testid="clear-button"
              sx={{ height: 60 }}
            >
              C
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleParentheses('(')}
              data-testid="open-paren-button"
              sx={{ height: 60 }}
            >
              (
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleParentheses(')')}
              data-testid="close-paren-button"
              sx={{ height: 60 }}
            >
              )
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => handleOperatorClick('/')}
              data-testid="divide-button"
              sx={{ height: 60 }}
            >
              ÷
            </Button>
          </Grid>

          {/* Row 2 */}
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleNumberClick('7')}
              data-testid="number-7"
              sx={{ height: 60 }}
            >
              7
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleNumberClick('8')}
              data-testid="number-8"
              sx={{ height: 60 }}
            >
              8
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleNumberClick('9')}
              data-testid="number-9"
              sx={{ height: 60 }}
            >
              9
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => handleOperatorClick('*')}
              data-testid="multiply-button"
              sx={{ height: 60 }}
            >
              ×
            </Button>
          </Grid>

          {/* Row 3 */}
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleNumberClick('4')}
              data-testid="number-4"
              sx={{ height: 60 }}
            >
              4
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleNumberClick('5')}
              data-testid="number-5"
              sx={{ height: 60 }}
            >
              5
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleNumberClick('6')}
              data-testid="number-6"
              sx={{ height: 60 }}
            >
              6
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => handleOperatorClick('-')}
              data-testid="subtract-button"
              sx={{ height: 60 }}
            >
              −
            </Button>
          </Grid>

          {/* Row 4 */}
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleNumberClick('1')}
              data-testid="number-1"
              sx={{ height: 60 }}
            >
              1
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleNumberClick('2')}
              data-testid="number-2"
              sx={{ height: 60 }}
            >
              2
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleNumberClick('3')}
              data-testid="number-3"
              sx={{ height: 60 }}
            >
              3
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => handleOperatorClick('+')}
              data-testid="add-button"
              sx={{ height: 60 }}
            >
              +
            </Button>
          </Grid>

          {/* Row 5 */}
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleNumberClick('0')}
              data-testid="number-0"
              sx={{ height: 60 }}
            >
              0
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleNumberClick('.')}
              data-testid="decimal-button"
              sx={{ height: 60 }}
            >
              .
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleEqualsClick}
              data-testid="equals-button"
              sx={{ height: 60 }}
            >
              =
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Expression: {expression || 'None'}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Calculator;

