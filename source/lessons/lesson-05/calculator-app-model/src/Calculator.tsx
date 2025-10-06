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
import { CalculatorService, CalculatorResult } from './calculator';

/**
 * MODEL-BASED CALCULATOR - THE "CLEAN" APPROACH
 * 
 * This component demonstrates proper separation of concerns:
 * 
 * 1. Business logic is in separate calculator.ts file
 * 2. Component focuses ONLY on UI concerns
 * 3. Easy to test business logic independently
 * 4. Easy to test UI with mocked calculator
 * 5. Clean, maintainable, and focused code
 * 6. Calculator can be reused in other UIs
 * 
 * Compare this to the DOM-based version!
 */

interface CalculatorProps {
  calculatorService?: CalculatorService; // Dependency injection for testing
}

function Calculator({ calculatorService: injectedService }: CalculatorProps) {
  // Use injected service or create default one
  const [calculatorService] = useState<CalculatorService>(
    () => injectedService || CalculatorService.create()
  );
  
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<CalculatorResult>({ result: 0 });

  // CLEAN UI HANDLERS - NO BUSINESS LOGIC!
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
    // CLEAN: Delegate to business logic
    const calcResult = calculatorService.calculateExpression(expression);
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
          🏗️ Model-Based Calculator
        </Typography>
        
        <Typography variant="subtitle2" align="center" color="text.secondary" sx={{ mb: 2 }}>
          Business logic separated - Easy to test!
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

