# Calculator Testing Comparison: DOM vs Model-Based Approaches

**Welcome, Students!** 👋

You're about to discover one of the most important lessons in software development: **how architecture affects testing**. We've built two identical calculators that work exactly the same way, but are tested completely differently. By the end of this lesson, you'll understand why separation of concerns is crucial for building testable software.

## 🎯 What You'll Learn

Both calculators have **identical functionality** but completely different architectures:

- **DOM-Based Calculator**: Business logic embedded in React component (the "ugly" way)
- **Model-Based Calculator**: Business logic separated into pure TypeScript classes (the "clean" way)

## 🧪 The Tests You Need to Write

As a developer, you need to test that your calculator works correctly. Here are the essential tests every calculator needs:

### **Core Mathematical Operations**
- Basic arithmetic: `2 + 3 = 5`, `8 - 3 = 5`, `4 * 6 = 24`, `15 / 3 = 5`
- Operator precedence: `2 + 3 * 4 = 14` (not 20!)
- Parentheses: `(2 + 3) * 4 = 20`
- Complex expressions: `1 + 3 * (9 + 1) = 31`

### **Error Handling**
- Division by zero: `5 / 0 = Error`
- Invalid expressions: `2 + + 3 = Error`
- Missing parentheses: `(2 + 3 = Error`

### **Edge Cases**
- Decimal numbers: `2.5 + 1.5 = 4`
- Negative numbers: `-5 + 3 = -2`
- Very large numbers, zero, etc.

Now, let's see how these **same tests** are implemented in both approaches...

## 🚀 Running the Demos

### DOM-Based Calculator (The "Ugly" Approach)
```bash
cd calculator-app-dom
npm install
npm run dev  # Runs on http://localhost:5175
npm test     # Run the painful DOM tests
```

### Model-Based Calculator (The "Clean" Approach)
```bash
cd calculator-app-model
npm install
npm run dev  # Runs on http://localhost:5275
npm test     # Run the fast, clean tests
```

## 📊 Side-by-Side Comparison

| Aspect | DOM-Based | Model-Based |
|--------|-----------|-------------|
| **Test Speed** | 🐌 Slow (2-5 seconds) | ⚡ Fast (< 1 second) |
| **Test Complexity** | 🤯 Complex button sequences | 🎯 Simple function calls |
| **Business Logic Testing** | 😰 Through DOM manipulation | 🧪 Direct unit tests |
| **Error Case Testing** | 😵 Extremely difficult | ✅ Trivial |
| **Test Maintenance** | 💔 Breaks with UI changes | 🛡️ Stable |
| **Debugging** | 🔍 Hard to isolate issues | 🎯 Clear separation |
| **Code Reusability** | ❌ Tied to React | ✅ Works anywhere |

## 🔍 Architecture Comparison

### DOM-Based Architecture (BAD)
```
┌─────────────────────────────────────┐
│           React Component           │
│  ┌─────────────────────────────────┐│
│  │        UI Logic                 ││
│  │  ┌─────────────────────────────┐││
│  │  │    Business Logic           │││
│  │  │  - Calculator parsing      │││
│  │  │  - Expression evaluation   │││
│  │  │  - Error handling          │││
│  │  │  - Mathematical operations │││
│  │  └─────────────────────────────┘││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘

❌ PROBLEMS:
- Everything mixed together
- Hard to test business logic
- UI changes break business tests
- Cannot reuse calculator logic
```

### Model-Based Architecture (GOOD)
```
┌─────────────────┐    ┌─────────────────┐
│ React Component │────│ Calculator Model│
│                 │    │                 │
│ - UI Logic      │    │ - Business Logic│
│ - State Mgmt    │    │ - Pure Functions│
│ - Event Handlers│    │ - Error Handling│
│ - Display Logic │    │ - Math Operations│
└─────────────────┘    └─────────────────┘
         │                       │
         │                       │
    ┌─────────┐              ┌─────────┐
    │UI Tests │              │Model    │
    │(Mocked) │              │Tests    │
    └─────────┘              └─────────┘

✅ BENEFITS:
- Clear separation of concerns
- Independent testing
- Reusable business logic
- Maintainable code
```

## 📝 Let's Walk Through Some Examples

Let's see how the **same mathematical tests** are implemented in both approaches. Pay attention to how complexity affects each approach differently!

### **Example 1: Simple Addition (2 + 3 = 5)**

#### DOM-Based Test - Must Click Every Button! 😰
```typescript
test('should calculate 2 + 3 = 5', async () => {
  const user = userEvent.setup();
  const display = screen.getByTestId('calculator-display');

  // PAINFUL: Must click through UI for simple math
  await user.click(screen.getByTestId('number-2'));      // Click "2"
  await user.click(screen.getByTestId('add-button'));    // Click "+"
  await user.click(screen.getByTestId('number-3'));      // Click "3"
  await user.click(screen.getByTestId('equals-button')); // Click "="

  expect(display).toHaveValue('5');
});
```
**4 button clicks + DOM setup = SLOW! ⏱️**

#### Model-Based Test - Direct Function Call! ⚡
```typescript
test('should calculate 2 + 3 = 5', () => {
  const result = calculator.calculate(['2', '+', '3']);
  expect(result.result).toBe(5);
});
```
**1 function call = LIGHTNING FAST! ⚡**

---

### **Example 2: Complex Expression (1 + 3 * (9 + 1) = 31)**

Now let's see what happens when the math gets more complex...

#### DOM-Based Test - Button Clicking Nightmare! 😱
```typescript
test('should calculate 1 + 3 * (9 + 1) = 31', async () => {
  const user = userEvent.setup();
  const display = screen.getByTestId('calculator-display');

  // EXTREMELY PAINFUL: Look at all these button clicks!
  await user.click(screen.getByTestId('number-1'));           // Click "1"
  await user.click(screen.getByTestId('add-button'));         // Click "+"
  await user.click(screen.getByTestId('number-3'));           // Click "3"
  await user.click(screen.getByTestId('multiply-button'));    // Click "*"
  await user.click(screen.getByTestId('open-paren-button'));  // Click "("
  await user.click(screen.getByTestId('number-9'));           // Click "9"
  await user.click(screen.getByTestId('add-button'));         // Click "+"
  await user.click(screen.getByTestId('number-1'));           // Click "1"
  await user.click(screen.getByTestId('close-paren-button')); // Click ")"
  await user.click(screen.getByTestId('equals-button'));      // Click "="

  expect(display).toHaveValue('31');
});
```
**10 button clicks + DOM setup = VERY SLOW! 🐌 (2-3 seconds)**

#### Model-Based Test - Still Just One Function Call! 🚀
```typescript
test('should calculate 1 + 3 * (9 + 1) = 31', () => {
  const result = calculator.calculate(['1', '+', '3', '*', '(', '9', '+', '1', ')']);
  expect(result.result).toBe(31);
});
```
**Still 1 function call = STILL LIGHTNING FAST! ⚡ (1-5ms)**

---

### **Example 3: Very Complex Expression**

Let's try something even more complex: `((2 + 3) * 4) - (8 / 2) + 1 = 17`

#### DOM-Based Test - Absolute Madness! 🤯
```typescript
test('should calculate ((2 + 3) * 4) - (8 / 2) + 1 = 17', async () => {
  const user = userEvent.setup();
  const display = screen.getByTestId('calculator-display');

  // INSANELY PAINFUL: 17 button clicks!
  await user.click(screen.getByTestId('open-paren-button'));  // (
  await user.click(screen.getByTestId('open-paren-button'));  // (
  await user.click(screen.getByTestId('number-2'));           // 2
  await user.click(screen.getByTestId('add-button'));         // +
  await user.click(screen.getByTestId('number-3'));           // 3
  await user.click(screen.getByTestId('close-paren-button')); // )
  await user.click(screen.getByTestId('multiply-button'));    // *
  await user.click(screen.getByTestId('number-4'));           // 4
  await user.click(screen.getByTestId('close-paren-button')); // )
  await user.click(screen.getByTestId('subtract-button'));    // -
  await user.click(screen.getByTestId('open-paren-button'));  // (
  await user.click(screen.getByTestId('number-8'));           // 8
  await user.click(screen.getByTestId('divide-button'));      // /
  await user.click(screen.getByTestId('number-2'));           // 2
  await user.click(screen.getByTestId('close-paren-button')); // )
  await user.click(screen.getByTestId('add-button'));         // +
  await user.click(screen.getByTestId('number-1'));           // 1
  await user.click(screen.getByTestId('equals-button'));      // =

  expect(display).toHaveValue('17');
});
```
**18 button clicks + DOM setup = PAINFULLY SLOW! 🐌 (3-5 seconds)**

#### Model-Based Test - You Guessed It... Still One Function Call! 🎯
```typescript
test('should calculate ((2 + 3) * 4) - (8 / 2) + 1 = 17', () => {
  const result = calculator.calculate([
    '(', '(', '2', '+', '3', ')', '*', '4', ')', '-', '(', '8', '/', '2', ')', '+', '1'
  ]);
  expect(result.result).toBe(17);
});
```
**STILL 1 function call = STILL LIGHTNING FAST! ⚡ (1-5ms)**

## 🤔 But Wait... What About UI Testing in the Model Approach?

Great question! In the model-based approach, we **separate our concerns**:

### **Business Logic Tests** (Fast & Comprehensive)
```typescript
// Test the math - does 1 + 3 * (9 + 1) actually equal 31?
test('calculator should handle complex expressions', () => {
  const result = calculator.calculate(['1', '+', '3', '*', '(', '9', '+', '1', ')']);
  expect(result.result).toBe(31); // Test the MATH
});
```

### **UI Tests** (Fast & Focused)
```typescript
// Test the UI - does clicking buttons create the right expression?
test('UI should build expression when buttons are clicked', async () => {
  const mockCalculator = jest.fn().mockReturnValue({ result: 999 });
  const user = userEvent.setup();
  
  render(<Calculator calculatorService={mockCalculator} />);
  
  // Click the same buttons as the complex DOM test
  await user.click(screen.getByTestId('number-1'));
  await user.click(screen.getByTestId('add-button'));
  await user.click(screen.getByTestId('number-3'));
  await user.click(screen.getByTestId('multiply-button'));
  await user.click(screen.getByTestId('open-paren-button'));
  await user.click(screen.getByTestId('number-9'));
  await user.click(screen.getByTestId('add-button'));
  await user.click(screen.getByTestId('number-1'));
  await user.click(screen.getByTestId('close-paren-button'));
  await user.click(screen.getByTestId('equals-button'));

  // Test that UI called calculator with correct expression
  expect(mockCalculator).toHaveBeenCalledWith('1 + 3 * (9 + 1)');
  // We DON'T test the math here - that's the calculator's job!
});
```

## 🎯 The Key Insight: Complexity Doesn't Scale the Same Way!

Notice what happens as expressions get more complex:

| Expression Complexity | DOM-Based Test | Model-Based Business Logic | Model-Based UI Test |
|----------------------|----------------|---------------------------|-------------------|
| **Simple: 2 + 3** | 4 clicks | 1 function call | 4 clicks (but mocked) |
| **Medium: 1 + 3 * (9 + 1)** | 10 clicks | 1 function call | 10 clicks (but mocked) |
| **Complex: ((2+3)*4)-(8/2)+1** | 18 clicks | 1 function call | 18 clicks (but mocked) |

### **DOM-Based Problems:**
- ❌ **Every test** must click through the entire UI
- ❌ **Every test** tests both UI AND math logic
- ❌ Complex expressions = very slow tests
- ❌ If math is wrong, UI test fails (confusing!)
- ❌ If UI changes, math tests break (brittle!)

### **Model-Based Benefits:**
- ✅ **Math tests** are always 1 function call (fast!)
- ✅ **UI tests** use mocks (don't depend on correct math)
- ✅ Complex expressions don't slow down math tests
- ✅ Math bugs don't break UI tests
- ✅ UI changes don't break math tests

## 🧪 Testing Edge Cases Comparison

### DOM-Based: Testing Division by Zero
```typescript
test('should handle division by zero through button clicks', async () => {
  const user = userEvent.setup();
  const display = screen.getByTestId('calculator-display');

  // Click 5 / 0 = through the UI - SLOW!
  await user.click(screen.getByTestId('number-5'));
  await user.click(screen.getByTestId('divide-button'));
  await user.click(screen.getByTestId('number-0'));
  await user.click(screen.getByTestId('equals-button'));

  expect(display).toHaveValue('Error');
  expect(screen.getByTestId('error-display')).toHaveTextContent('Division by zero');
});
```

### Model-Based: Testing Division by Zero
```typescript
test('should handle division by zero', () => {
  const result = calculator.calculate(['5', '/', '0']);
  expect(result.error).toBe('Division by zero');
  expect(result.result).toBeUndefined();
});
```

**The difference is DRAMATIC!**

## 📈 Performance Metrics

### Test Execution Times (Approximate)

| Test Type | DOM-Based | Model-Based | Difference |
|-----------|-----------|-------------|------------|
| Basic arithmetic | 200-500ms | 1-5ms | **100x faster** |
| Complex expressions | 1-2 seconds | 1-5ms | **400x faster** |
| Error conditions | 500ms-1s | 1-5ms | **200x faster** |
| Edge cases | 1-3 seconds | 1-5ms | **600x faster** |

### Test Suite Totals

| Approach | Total Tests | Execution Time | Lines of Code |
|----------|-------------|----------------|---------------|
| DOM-Based | 25 tests | 15-30 seconds | ~400 lines |
| Model-Based | 40+ tests | 1-2 seconds | ~300 lines |

## 🎓 Educational Value

### What Students Learn from DOM-Based Approach
- ❌ How NOT to structure applications
- 😰 The pain of testing tightly coupled code
- 🐌 Why DOM tests are slow and brittle
- 💔 How UI changes break business logic tests

### What Students Learn from Model-Based Approach
- ✅ Proper separation of concerns
- ⚡ Benefits of fast, focused unit tests
- 🧪 How to test business logic independently
- 🏗️ Clean architecture principles

## 🔧 Key Teaching Points

### 1. **Same Functionality, Different Testability**
Both calculators work identically from the user's perspective, but one is dramatically easier to test.

### 2. **Architecture Affects Testing Strategy**
The way you structure your code determines how you can test it.

### 3. **Separation of Concerns Enables Better Testing**
When business logic is separated, it can be tested independently and thoroughly.

### 4. **Fast Tests Enable Better Development**
When tests run quickly, developers run them more often, leading to better code quality.

### 5. **Maintainability Matters**
Model-based tests remain stable when UI changes, while DOM-based tests break frequently.

## 🎯 Student Exercise Ideas

### Exercise 1: Compare Test Execution
1. Run both test suites
2. Time the execution
3. Compare the results

### Exercise 2: Add New Feature
1. Add a "square root" operation to both calculators
2. Compare the effort required to test it in each approach

### Exercise 3: UI Redesign
1. Change the button layout in both calculators
2. See which tests break and which remain stable

### Exercise 4: Error Handling
1. Add a new error condition (e.g., "Result too large")
2. Compare the testing effort in both approaches

## 🎓 What You Should Take Away

After working through these examples, you should understand:

### **1. Separation of Concerns is Powerful**
- **DOM-based**: UI + Business Logic mixed together = Hard to test
- **Model-based**: UI and Business Logic separated = Easy to test both

### **2. Complexity Affects Approaches Differently**
- **DOM-based**: Complex expressions = Complex, slow tests
- **Model-based**: Complex expressions = Same simple, fast tests

### **3. Fast Tests Change How You Develop**
- When tests run in milliseconds, you run them constantly
- When tests take seconds, you avoid running them
- Fast feedback = Better code quality

### **4. Architecture Decisions Have Consequences**
- How you structure code determines how you can test it
- Good architecture makes testing easier, not harder
- Bad architecture makes simple things complicated

## 🚀 Try It Yourself!

1. **Run both test suites** - Time how long each takes
2. **Add a new operation** (like square root) to both calculators
3. **Change the UI layout** - See which tests break
4. **Add complex expressions** - Notice the testing effort difference

## 🏆 The Big Picture

This isn't just about calculators - it's about **every application you'll ever build**:

- **Web apps**: Separate business logic from React components
- **Mobile apps**: Separate business logic from UI frameworks  
- **APIs**: Separate business logic from HTTP handling
- **Games**: Separate game logic from rendering

**Good architecture is the foundation of testable, maintainable software!**

## 📚 Additional Resources

- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
