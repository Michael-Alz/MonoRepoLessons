import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from '../App';

// Create the same theme used in main.tsx for consistent testing
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6aaa64',
    },
    secondary: {
      main: '#c9b458',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
  },
});

// Helper function to render App with theme provider (like in main.tsx)
const renderAppWithTheme = () => {
  return render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
};

describe('Wordle App - Basic Rendering Tests', () => {
  describe('🟢 Beginner Level Tests', () => {
    test('App renders without crashing', () => {
      // This test ensures the app can mount and render without throwing errors
      renderAppWithTheme();
      
      // If we get here without an error, the app rendered successfully!
      // We can add a simple assertion to make sure something is in the document
      expect(document.body).toBeInTheDocument();
    });

    test('Title displays correctly', () => {
      renderAppWithTheme();
      
      // Look for the main title using the test ID
      const titleElement = screen.getByTestId('game-title');
      
      // Check that the title exists and has the correct text
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('Wordle Testing Game');
    });

    test('Game board shows 6 rows of empty cells', () => {
      renderAppWithTheme();
      
      // Find the game board
      const gameBoard = screen.getByTestId('game-board');
      expect(gameBoard).toBeInTheDocument();
      
      // Check that we have 6 rows (0-5)
      for (let row = 0; row < 6; row++) {
        // For each row, check that we have the correct number of cells
        // Default word length is 5, so we should have 5 cells per row
        for (let col = 0; col < 5; col++) {
          const cell = screen.getByTestId(`cell-${row}-${col}`);
          expect(cell).toBeInTheDocument();
          
          // Initially, all cells should be empty
          expect(cell).toHaveTextContent('');
        }
      }
    });

    // TODO: Add more tests here!
    // Students can continue with:
    // - Current guess display is present
    // - Virtual keyboard is present  
    // - All control buttons are present
    // - Word length selection tests
    // - Virtual keyboard functionality tests
    // - And much more!
  });

  // TODO: Add more test suites here!
  // describe('🟡 Intermediate Level Tests', () => { ... });
  // describe('🔴 Advanced Level Tests', () => { ... });
  // describe('🚀 Expert Level Tests', () => { ... });
});

/*
 * 🎯 STUDENT INSTRUCTIONS:
 * 
 * This file contains starter tests to get you going. Your mission is to:
 * 
 * 1. Run these tests and make sure they pass: `npm test`
 * 2. Add more rendering tests (current guess display, virtual keyboard, etc.)
 * 3. Move on to interaction tests (clicking keys, submitting guesses, etc.)
 * 4. Test edge cases and complex scenarios
 * 
 * Remember:
 * - Use `screen.getByTestId()` to find elements reliably
 * - Use `userEvent` for user interactions (clicking, typing)
 * - Use `waitFor()` for async operations
 * - Check the README.md for comprehensive testing scenarios
 * 
 * Good luck! 🍀
 */
