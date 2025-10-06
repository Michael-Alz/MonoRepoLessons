import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box 
} from '@mui/material';
import { GreetingModel, createGreetingModel } from './model';

/**
 * Phase 2: App Refactored with Model-Based Architecture
 * 
 * This version demonstrates:
 * - Separation of business logic (model) from UI logic
 * - Dependency injection pattern
 * - Easier testing through mocking
 * - Better maintainability and testability
 */

interface AppWithModelProps {
  model?: GreetingModel; // Optional for dependency injection in tests
}

function AppWithModel({ model: injectedModel }: AppWithModelProps) {
  // Use injected model or create default one
  const [model] = useState<GreetingModel>(() => injectedModel || createGreetingModel());
  const [inputValue, setInputValue] = useState('');
  const [greeting, setGreeting] = useState(model.getGreeting());

  // Update greeting when model changes
  const refreshGreeting = () => {
    setGreeting(model.getGreeting());
  };

  const handleUpdateName = () => {
    const success = model.updateName(inputValue);
    if (success) {
      setInputValue(''); // Clear input only on successful update
      refreshGreeting();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleUpdateName();
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          data-testid="greeting-title"
        >
          {greeting}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <TextField
            label="Enter your name"
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            data-testid="name-input"
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleUpdateName}
            data-testid="update-button"
          >
            Update
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AppWithModel;

