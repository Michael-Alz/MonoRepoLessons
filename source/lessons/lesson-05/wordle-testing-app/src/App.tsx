import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { getRandomWord, isValidWord } from './wordLists';

type WordLength = 3 | 4 | 5;
type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

interface GuessLetter {
  letter: string;
  status: LetterStatus;
}

interface GameState {
  targetWord: string;
  currentGuess: string;
  guesses: GuessLetter[][];
  currentRow: number;
  gameStatus: 'playing' | 'won' | 'lost';
  wordLength: WordLength;
}

const MAX_GUESSES = 6;

function App() {
  const [gameState, setGameState] = useState<GameState>({
    targetWord: '',
    currentGuess: '',
    guesses: [],
    currentRow: 0,
    gameStatus: 'playing',
    wordLength: 5,
  });

  const [showInstructions, setShowInstructions] = useState(false);
  const [message, setMessage] = useState('');

  // Initialize game
  const initializeGame = useCallback((wordLength: WordLength) => {
    const targetWord = getRandomWord(wordLength);
    const emptyGuesses = Array(MAX_GUESSES).fill(null).map(() =>
      Array(wordLength).fill(null).map(() => ({ letter: '', status: 'empty' as LetterStatus }))
    );
    
    setGameState({
      targetWord,
      currentGuess: '',
      guesses: emptyGuesses,
      currentRow: 0,
      gameStatus: 'playing',
      wordLength,
    });
    setMessage('');
  }, []);

  // Initialize game on mount
  useEffect(() => {
    initializeGame(5);
  }, [initializeGame]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState.gameStatus, gameState.wordLength, gameState.currentGuess]);

  // Handle word length change
  const handleWordLengthChange = (event: SelectChangeEvent<WordLength>) => {
    const newLength = event.target.value as WordLength;
    initializeGame(newLength);
  };

  // Handle physical keyboard input
  const handleKeyDown = (event: KeyboardEvent) => {
    if (gameState.gameStatus !== 'playing') return;
    
    const key = event.key.toUpperCase();
    
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      handleBackspace();
    } else if (/^[A-Z]$/.test(key)) {
      handleLetterClick(key);
    }
  };

  // Handle virtual keyboard letter click
  const handleLetterClick = (letter: string) => {
    if (gameState.gameStatus !== 'playing') return;
    
    const newGuess = gameState.currentGuess + letter;
    if (newGuess.length <= gameState.wordLength) {
      setGameState(prev => ({ ...prev, currentGuess: newGuess }));
    }
  };

  // Handle backspace
  const handleBackspace = () => {
    if (gameState.gameStatus !== 'playing') return;
    
    setGameState(prev => ({ 
      ...prev, 
      currentGuess: prev.currentGuess.slice(0, -1) 
    }));
  };

  // Check letter status in guess
  const checkLetterStatus = (letter: string, position: number, targetWord: string): LetterStatus => {
    if (targetWord[position] === letter) {
      return 'correct';
    } else if (targetWord.includes(letter)) {
      return 'present';
    } else {
      return 'absent';
    }
  };

  // Submit guess
  const submitGuess = () => {
    if (gameState.gameStatus !== 'playing') return;
    
    const guess = gameState.currentGuess;
    
    // Validate guess length
    if (guess.length !== gameState.wordLength) {
      setMessage(`Word must be ${gameState.wordLength} letters long`);
      return;
    }

    // Validate word exists
    if (!isValidWord(guess, gameState.wordLength)) {
      setMessage('Not a valid word');
      return;
    }

    // Create guess with letter statuses
    const guessLetters: GuessLetter[] = guess.split('').map((letter, index) => ({
      letter,
      status: checkLetterStatus(letter, index, gameState.targetWord),
    }));

    // Update game state
    const newGuesses = [...gameState.guesses];
    newGuesses[gameState.currentRow] = guessLetters;

    const isWin = guess === gameState.targetWord;
    const isLoss = gameState.currentRow >= MAX_GUESSES - 1 && !isWin;

    setGameState(prev => ({
      ...prev,
      guesses: newGuesses,
      currentRow: prev.currentRow + 1,
      currentGuess: '',
      gameStatus: isWin ? 'won' : isLoss ? 'lost' : 'playing',
    }));

    // Set result message
    if (isWin) {
      setMessage('Congratulations! You won!');
    } else if (isLoss) {
      setMessage(`Game over! The word was: ${gameState.targetWord}`);
    } else {
      setMessage('');
    }
  };

  // Get letter color based on status
  const getLetterColor = (status: LetterStatus) => {
    switch (status) {
      case 'correct': return '#6aaa64';
      case 'present': return '#c9b458';
      case 'absent': return '#787c7e';
      case 'empty': return '#ffffff';
    }
  };

  // Get used letters
  const getUsedLetters = () => {
    const used: { [key: string]: LetterStatus } = {};
    gameState.guesses.slice(0, gameState.currentRow).forEach(guess => {
      guess.forEach(({ letter, status }) => {
        if (letter && (!used[letter] || status === 'correct' || (status === 'present' && used[letter] === 'absent'))) {
          used[letter] = status;
        }
      });
    });
    return used;
  };

  const usedLetters = getUsedLetters();

  // Virtual keyboard layout
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  // Get keyboard key status
  const getKeyStatus = (letter: string): LetterStatus => {
    if (letter === 'ENTER' || letter === 'BACKSPACE') return 'empty';
    return usedLetters[letter] || 'empty';
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h1" component="h1" gutterBottom data-testid="game-title">
            Wordle Testing Game
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <FormControl size="small" data-testid="word-length-selector">
              <InputLabel>Word Length</InputLabel>
              <Select
                value={gameState.wordLength}
                label="Word Length"
                onChange={handleWordLengthChange}
                data-testid="word-length-select"
              >
                <MenuItem value={3} data-testid="length-3">3 Letters</MenuItem>
                <MenuItem value={4} data-testid="length-4">4 Letters</MenuItem>
                <MenuItem value={5} data-testid="length-5">5 Letters</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              onClick={() => initializeGame(gameState.wordLength)}
              data-testid="new-game-button"
            >
              New Game
            </Button>
            
            <Button
              variant="text"
              onClick={() => setShowInstructions(true)}
              data-testid="instructions-button"
            >
              Instructions
            </Button>
          </Box>
        </Box>

        {/* Game Status */}
        {message && (
          <Alert 
            severity={gameState.gameStatus === 'won' ? 'success' : gameState.gameStatus === 'lost' ? 'error' : 'warning'}
            sx={{ mb: 2 }}
            data-testid="game-message"
          >
            {message}
          </Alert>
        )}

        {/* Game Board */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={1} data-testid="game-board">
            {gameState.guesses.map((guess, rowIndex) => (
              <Grid item xs={12} key={rowIndex}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  {guess.map((letterData, colIndex) => (
                    <Box
                      key={colIndex}
                      sx={{
                        width: 60,
                        height: 60,
                        border: '2px solid #d3d6da',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: getLetterColor(letterData.status),
                        color: letterData.status === 'empty' ? '#000' : '#fff',
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                      }}
                      data-testid={`cell-${rowIndex}-${colIndex}`}
                    >
                      {letterData.letter}
                    </Box>
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Current Guess Display */}
        {gameState.gameStatus === 'playing' && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom data-testid="current-guess-label">
              Current Guess
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 1, 
                justifyContent: 'center',
                mb: 2
              }}
              data-testid="current-guess-display"
            >
              {Array(gameState.wordLength).fill(null).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 50,
                    height: 50,
                    border: '2px solid #d3d6da',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: '#000',
                  }}
                  data-testid={`current-guess-letter-${index}`}
                >
                  {gameState.currentGuess[index] || ''}
                </Box>
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary" data-testid="guess-instructions">
              Use the keyboard below or your physical keyboard to enter letters
            </Typography>
          </Box>
        )}

        {/* Used Letters */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom data-testid="used-letters-title">
            Used Letters
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }} data-testid="used-letters">
            {Object.entries(usedLetters).map(([letter, status]) => (
              <Chip
                key={letter}
                label={letter}
                sx={{
                  backgroundColor: getLetterColor(status),
                  color: '#fff',
                  fontWeight: 'bold',
                }}
                data-testid={`used-letter-${letter.toLowerCase()}`}
              />
            ))}
          </Box>
        </Box>

        {/* Game Stats */}
        <Box sx={{ mt: 3, textAlign: 'center' }} data-testid="game-stats">
          <Typography variant="body2" color="text.secondary">
            Guess {gameState.currentRow} of {MAX_GUESSES} | 
            Word Length: {gameState.wordLength} | 
            Status: {gameState.gameStatus.charAt(0).toUpperCase() + gameState.gameStatus.slice(1)}
          </Typography>
        </Box>

        {/* Virtual Keyboard */}
        <Box sx={{ mt: 4 }} data-testid="virtual-keyboard">
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
            Virtual Keyboard
          </Typography>
          {keyboardRows.map((row, rowIndex) => (
            <Box
              key={rowIndex}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 0.5,
                mb: 1,
                px: rowIndex === 1 ? 2 : 0, // Indent middle row slightly
              }}
              data-testid={`keyboard-row-${rowIndex}`}
            >
              {row.map((key) => {
                const isSpecialKey = key === 'ENTER' || key === 'BACKSPACE';
                const keyStatus = getKeyStatus(key);
                const isDisabled = gameState.gameStatus !== 'playing' || 
                  (key === 'ENTER' && gameState.currentGuess.length !== gameState.wordLength);

                return (
                  <Button
                    key={key}
                    variant="contained"
                    size="small"
                    disabled={isDisabled}
                    onClick={() => {
                      if (key === 'ENTER') {
                        submitGuess();
                      } else if (key === 'BACKSPACE') {
                        handleBackspace();
                      } else {
                        handleLetterClick(key);
                      }
                    }}
                    data-testid={`keyboard-key-${key.toLowerCase()}`}
                    sx={{
                      minWidth: isSpecialKey ? 65 : 40,
                      height: 58,
                      fontSize: isSpecialKey ? '0.7rem' : '1rem',
                      fontWeight: 'bold',
                      backgroundColor: isSpecialKey 
                        ? '#818384' 
                        : getLetterColor(keyStatus),
                      color: keyStatus === 'empty' && !isSpecialKey ? '#000' : '#fff',
                      border: keyStatus === 'empty' ? '2px solid #d3d6da' : 'none',
                      '&:hover': {
                        backgroundColor: isSpecialKey 
                          ? '#6e7071' 
                          : keyStatus === 'empty' 
                            ? '#f0f0f0' 
                            : getLetterColor(keyStatus),
                        opacity: 0.8,
                      },
                      '&:disabled': {
                        backgroundColor: '#d3d6da',
                        color: '#fff',
                        opacity: 0.6,
                      },
                    }}
                  >
                    {key === 'BACKSPACE' ? '⌫' : key}
                  </Button>
                );
              })}
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Instructions Dialog */}
      <Dialog 
        open={showInstructions} 
        onClose={() => setShowInstructions(false)}
        data-testid="instructions-dialog"
      >
        <DialogTitle data-testid="instructions-title">How to Play Wordle</DialogTitle>
        <DialogContent data-testid="instructions-content">
          <Typography paragraph>
            Guess the word in {MAX_GUESSES} tries or less!
          </Typography>
          <Typography paragraph>
            • <strong>Green</strong>: Letter is correct and in the right position
          </Typography>
          <Typography paragraph>
            • <strong>Yellow</strong>: Letter is in the word but in the wrong position
          </Typography>
          <Typography paragraph>
            • <strong>Gray</strong>: Letter is not in the word
          </Typography>
          <Typography paragraph>
            Choose between 3, 4, or 5 letter words for different difficulty levels.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowInstructions(false)} 
            data-testid="close-instructions-button"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
