# Wordle Testing App 🎯

**Your Mission:** Write comprehensive tests for this Wordle game to practice React testing skills!

## 🎮 What is This App?

This is a fully functional Wordle game built with React, TypeScript, and Material-UI. It includes:

- **3, 4, or 5 letter word modes** for different difficulty levels
- **Virtual keyboard interface** - no text input field, only clickable keys
- **Physical keyboard support** - works with both virtual clicks and physical key presses
- **Visual feedback** with color-coded letters (green = correct position, yellow = in word, gray = not in word)
- **Input validation** to ensure only valid words are accepted
- **Game state management** tracking wins, losses, and current progress
- **Used letters tracking** to help players avoid repeating letters
- **Real-time current guess display** with individual letter boxes

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run the app
npm run dev
# Visit: http://localhost:5176

# Run the starter tests
npm test

# Run tests in watch mode (great for development!)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🎯 Your Testing Challenge

Your job is to expand the comprehensive test suite for this Wordle game. **We've provided starter tests to get you going** - 3 basic rendering tests that you can run right now with `npm test`.

The app is intentionally built **without separation of concerns** - all the logic is mixed into the React component. This makes it a perfect example of why DOM-based testing can become complex!

### 🚀 **Getting Started with Testing**

1. **Run the existing tests**: `npm test` - You should see 3 passing tests!
2. **Look at the starter file**: `src/__tests__/App.test.tsx` 
3. **Study the examples**: See how we use `getByTestId()` and test patterns
4. **Add your own tests**: Follow the TODO comments and scenarios below

### 🏷️ Test IDs Available

The app includes `data-testid` attributes on all major elements for easy testing:

#### **Game Structure**
- `game-title` - Main title
- `game-board` - The entire game grid
- `cell-{row}-{col}` - Individual letter cells (e.g., `cell-0-0`, `cell-1-2`)
- `game-message` - Success/error messages
- `game-stats` - Game statistics display

#### **Controls**
- `word-length-selector` - Word length dropdown container
- `word-length-select` - The actual select element
- `length-3`, `length-4`, `length-5` - Individual length options
- `new-game-button` - Start new game button
- `instructions-button` - Show instructions button

#### **Current Guess Display**
- `current-guess-label` - "Current Guess" heading
- `current-guess-display` - Container for current guess letters
- `current-guess-letter-{index}` - Individual letter boxes (e.g., `current-guess-letter-0`)
- `guess-instructions` - Instructions text

#### **Virtual Keyboard**
- `virtual-keyboard` - The entire keyboard container
- `keyboard-row-{0|1|2}` - Individual keyboard rows
- `keyboard-key-{letter}` - Individual keys (e.g., `keyboard-key-a`, `keyboard-key-enter`, `keyboard-key-backspace`)

#### **Used Letters**
- `used-letters-title` - "Used Letters" heading
- `used-letters` - Container for used letter chips
- `used-letter-{letter}` - Individual letter chips (e.g., `used-letter-a`)

#### **Instructions Dialog**
- `instructions-dialog` - The dialog container
- `instructions-title` - Dialog title
- `instructions-content` - Dialog content
- `close-instructions-button` - Close dialog button

## 📝 Testing Scenarios to Implement

### 🚀 **First: Run the Existing Tests!**

Before you start writing new tests, let's make sure everything is working:

```bash
# Navigate to the wordle-testing-app directory
cd wordle-testing-app

# Install dependencies (if you haven't already)
npm install

# Run the tests
npm test
```

**You should see this output:**
```
> wordle-testing-app@0.0.0 test
> jest

 PASS  src/__tests__/App.test.tsx
  Wordle App - Basic Rendering Tests
    🟢 Beginner Level Tests
      ✓ App renders without crashing (78 ms)
      ✓ Title displays correctly (39 ms)
      ✓ Game board shows 6 rows of empty cells (47 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.118 s
```

**If the tests pass** ✅ - Great! You're ready to start adding more tests.

**If the tests fail** ❌ - Check that:
- You ran `npm install` first
- You're in the correct directory (`wordle-testing-app`)
- The app can run with `npm run dev` (test in another terminal)

### 📋 **Testing Scenarios Checklist**

Here are the testing scenarios you should implement. **We've already done the first 3 for you** - now it's your turn to continue! Start with the easier ones and work your way up.

### 🟢 **Beginner Level Tests**

1. **Rendering Tests** ✅ **DONE - See `src/__tests__/App.test.tsx`**
   - ✅ App renders without crashing
   - ✅ Title displays correctly  
   - ✅ Game board shows 6 rows of empty cells
   - 🔲 Current guess display is present
   - 🔲 Virtual keyboard is present
   - 🔲 All control buttons are present

2. **Word Length Selection** 🔲 **YOUR TURN!**
   - 🔲 Can select 3, 4, or 5 letter modes
   - 🔲 Game board updates to show correct number of columns
   - 🔲 Current guess display updates to show correct number of boxes
   - 🔲 New game starts with correct word length

3. **Current Guess Display** 🔲 **YOUR TURN!**
   - 🔲 Current guess shows in letter boxes
   - 🔲 Boxes update as letters are added
   - 🔲 Empty boxes show when letters are removed
   - 🔲 Display updates correctly for different word lengths

4. **Virtual Keyboard Functionality** 🔲 **YOUR TURN!**
   - 🔲 All letter keys are present and clickable
   - 🔲 Clicking letters adds them to current guess
   - 🔲 ENTER key submits guess (when guess is complete)
   - 🔲 BACKSPACE key removes last letter
   - 🔲 Keys show correct color based on letter status

### 🟡 **Intermediate Level Tests**

5. **Game Initialization**
   - New game button resets the game state
   - Game starts with empty board
   - Current guess is cleared
   - Game status is "playing"

6. **Input Validation**
   - Cannot submit guess shorter than word length
   - Cannot submit invalid words
   - Error messages display correctly
   - Error messages clear after valid input

7. **Virtual Keyboard State Management**
   - Keys are disabled when game is over
   - ENTER key is disabled for incomplete guesses
   - Keys show correct status colors after each guess
   - Keyboard updates in real-time with game state

8. **Instructions Dialog**
   - Instructions button opens dialog
   - Dialog displays game rules
   - Close button closes dialog
   - Dialog can be closed by clicking outside

### 🔴 **Advanced Level Tests**

9. **Guess Submission**
   - Valid guesses are submitted to the board
   - Current guess display clears after submission
   - Current row advances after each guess
   - ENTER key is disabled for incomplete guesses

10. **Letter Status Logic**
    - Correct letters show green background
    - Present letters show yellow background
    - Absent letters show gray background
    - Used letters appear in the used letters section

11. **Virtual Keyboard Integration**
    - Clicking keyboard letters updates current guess display
    - Virtual keyboard and physical keyboard work together
    - Both ENTER methods (key press and button click) work
    - Both input methods (physical keys and virtual clicks) work identically

12. **Game Win/Loss Conditions**
    - Game ends with win message when word is guessed
    - Game ends with loss message after 6 failed attempts
    - Keyboard is disabled after game ends
    - Correct word is revealed on loss

13. **Keyboard Interaction**
    - Physical Enter key submits guess
    - Physical letter keys add to current guess
    - Physical Backspace key removes letters
    - Virtual keyboard is accessible via mouse/touch

### 🚀 **Expert Level Tests**

14. **Complex Game Scenarios**
    - Test complete game flow from start to win
    - Test complete game flow from start to loss
    - Test multiple games in sequence
    - Test switching word lengths mid-game

15. **Mixed Input Method Testing**
    - Test games using only virtual keyboard
    - Test games using only physical keyboard  
    - Test games mixing both input methods
    - Test rapid switching between input methods

16. **Edge Cases**
    - Words with repeated letters
    - All letters correct but wrong positions
    - Mix of correct, present, and absent letters
    - Boundary conditions (first/last guess)
    - Virtual keyboard state with complex letter combinations

## 🏁 **Starting Point: Your First Tests**

We've created **3 starter tests** in `src/__tests__/App.test.tsx` to get you going:

```bash
npm test
# Should show:
# ✓ App renders without crashing
# ✓ Title displays correctly  
# ✓ Game board shows 6 rows of empty cells
```

### **📖 Study the Starter Code**

Look at `src/__tests__/App.test.tsx` to understand:

1. **Theme Provider Setup** - How to render the app with Material-UI theme
2. **Test Structure** - `describe` blocks and `test` functions
3. **Element Selection** - Using `screen.getByTestId()`
4. **Assertions** - `toBeInTheDocument()`, `toHaveTextContent()`
5. **Loop Testing** - Testing multiple similar elements (game board cells)

### **🎯 Your Next Steps**

1. **Complete the rendering tests** - Add the missing checkboxes from test #1
2. **Add word length selection tests** - Test the dropdown functionality  
3. **Test virtual keyboard** - Click keys and verify behavior
4. **Add user interaction tests** - Full game scenarios
5. **Test edge cases** - Error conditions, invalid inputs, etc.

### **💡 Pro Tips for Success**

- **Start small** - Add one test at a time
- **Run tests frequently** - Use `npm run test:watch` for instant feedback
- **Study the working examples** - Copy patterns from the starter tests
- **Use the test IDs** - They're designed to make testing easier
- **Read the error messages** - They'll guide you to solutions

## 🧪 Testing Tips & Strategies

### **DOM Query Strategies**
```typescript
// Use data-testid for reliable element selection
const titleElement = screen.getByTestId('game-title');
const currentGuessDisplay = screen.getByTestId('current-guess-display');

// Query specific cells and current guess letters
const firstRowFirstCell = screen.getByTestId('cell-0-0');
const firstGuessLetter = screen.getByTestId('current-guess-letter-0');

// Query virtual keyboard keys
const letterAKey = screen.getByTestId('keyboard-key-a');
const enterKey = screen.getByTestId('keyboard-key-enter');
const backspaceKey = screen.getByTestId('keyboard-key-backspace');

// Query by role for semantic elements
const selectElement = screen.getByRole('combobox');
const newGameButton = screen.getByRole('button', { name: /new game/i });
```

### **User Interaction Patterns**
```typescript
import { userEvent } from '@testing-library/user-event';

// Click virtual keyboard keys to build word
await userEvent.click(letterHKey);
await userEvent.click(letterEKey);
await userEvent.click(letterLKey);
await userEvent.click(letterLKey);
await userEvent.click(letterOKey);
await userEvent.click(enterKey);

// Use backspace to correct mistakes
await userEvent.click(backspaceKey);
await userEvent.click(letterPKey);

// Click buttons
await userEvent.click(newGameButton);

// Select dropdown options
await userEvent.selectOptions(selectElement, '3');

// Test physical keyboard input
await userEvent.keyboard('HELLO{Enter}');
await userEvent.keyboard('{Backspace}P');

// Test mixed input methods
await userEvent.keyboard('HE');
await userEvent.click(letterLKey);
await userEvent.click(letterLKey);
await userEvent.keyboard('O{Enter}');
```

### **Async Testing Patterns**
```typescript
// Wait for elements to appear
await waitFor(() => {
  expect(screen.getByTestId('game-message')).toBeInTheDocument();
});

// Wait for state changes
await waitFor(() => {
  expect(screen.getByTestId('current-guess-letter-0')).toHaveTextContent('H');
});

// Wait for game board updates
await waitFor(() => {
  expect(screen.getByTestId('cell-0-0')).toHaveTextContent('H');
});
```

## 🎯 Success Criteria

Your test suite should:

- ✅ **Cover all major functionality** - Every feature should have tests
- ✅ **Handle edge cases** - Test boundary conditions and error states
- ✅ **Be reliable** - Tests should pass consistently
- ✅ **Be readable** - Clear test names and good organization
- ✅ **Run fast** - Efficient DOM queries and minimal setup
- ✅ **Provide good coverage** - Aim for >80% code coverage

## 🤔 Reflection Questions

As you write tests, consider these questions:

1. **Which tests are hardest to write?** Why?
2. **Which tests are most brittle?** What makes them break easily?
3. **How long do your tests take to run?** What slows them down?
4. **What would happen if the UI layout changed?** Which tests would break?
5. **How would you test this differently with separated business logic?**

## 🏆 Bonus Challenges

Once you've mastered the basic tests:

1. **Performance Testing** - Measure how long different test scenarios take
2. **Accessibility Testing** - Test keyboard navigation and screen reader support
3. **Visual Regression Testing** - Test that the UI looks correct
4. **Integration Testing** - Test complete user workflows
5. **Stress Testing** - Test with many rapid interactions

## 📚 Resources

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Matchers](https://jestjs.io/docs/expect)
- [Material-UI Testing Guide](https://mui.com/guides/testing/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 📊 **Word Lists**

The app uses authentic word lists for a realistic testing experience:

- **3-letter words**: 60 simple, educational words
- **4-letter words**: 60 common words  
- **5-letter words**: 300+ official Wordle words from the original game

This gives you plenty of variety for comprehensive testing scenarios!

---

**Good luck!** 🍀 Remember, the goal isn't just to make tests pass - it's to understand how architecture affects testability. Pay attention to which tests are easy vs. hard to write, and think about how you might structure the code differently to make testing easier.

**Next Step:** After completing this exercise, compare your experience with the model-based testing approaches in the other lesson examples!
