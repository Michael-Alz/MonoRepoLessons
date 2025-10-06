import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box 
} from '@mui/material';

/**
 * Phase 1: Simple App with Tightly Coupled Logic
 * 
 * This version demonstrates the initial approach where:
 * - State is managed directly in the component
 * - Business logic is mixed with UI logic
 * - Testing requires DOM manipulation
 */
function App() {
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('World');

  const handleUpdateName = () => {
    if (name.trim()) {
      setDisplayName(name.trim());
      setName('');
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
          Hello, {displayName}!
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <TextField
            label="Enter your name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

export default App;

