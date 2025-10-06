# Model-Based Calculator - The "Clean" Approach

This calculator demonstrates proper separation of concerns with business logic separated from UI logic.

## ✅ This is the "Right" Way

This code demonstrates best practices:

- ✅ Business logic separated into pure TypeScript classes
- ✅ Fast, focused unit tests
- ✅ Easy-to-test UI with mocked dependencies
- ✅ Loose coupling between concerns
- ✅ Maintainable and debuggable code
- ✅ Reusable business logic

## 🏃‍♂️ Running the App

```bash
npm install
npm run dev  # http://localhost:5275
```

## 🧪 Running the Tests

```bash
npm test
```

**Notice how fast and comprehensive the tests are!**

## 📁 File Structure

```
calculator-app-model/
├── src/
│   ├── calculator.ts           # Pure business logic (GOOD!)
│   ├── Calculator.tsx          # Clean UI component
│   └── __tests__/
│       ├── calculator.test.ts      # Fast business logic tests
│       └── Calculator.ui.test.tsx  # Focused UI tests with mocks
├── package.json
└── README.md
```

## 🏗️ What's Right Here?

### 1. **Separated Business Logic**
```typescript
// CLEAN: Pure business logic in separate file
export class Calculator {
  calculate(tokens: string[]): CalculatorResult {
    // Business logic with no UI dependencies
  }
}
```

### 2. **Easy to Test Business Logic**
```typescript
// To test "2 + 3 = 5", you simply:
const result = calculator.calculate(['2', '+', '3']);
expect(result.result).toBe(5);
```

### 3. **Fast, Reliable Tests**
- Business logic tests run in milliseconds
- No DOM rendering required
- Easy to test all edge cases
- Tests remain stable when UI changes

### 4. **Clear Separation of Responsibilities**

**Calculator Model** (`calculator.ts`):
- Mathematical operations
- Expression parsing
- Error handling
- Pure functions with no side effects

**React Component** (`Calculator.tsx`):
- UI rendering
- Event handling
- State management
- Display logic only

## 📊 Test Performance

- **Basic arithmetic test**: 1-5ms
- **Complex expression test**: 1-5ms
- **Error condition test**: 1-5ms
- **Total test suite**: 1-2 seconds

**That's 100-400x faster than the DOM-based approach!**

## 🧪 Test Types

### 1. **Pure Business Logic Tests** (`calculator.test.ts`)
```typescript
describe('Calculator - Pure Business Logic', () => {
  test('should handle complex expressions', () => {
    const result = calculator.calculate(['(', '2', '+', '3', ')', '*', '4']);
    expect(result.result).toBe(20);
  });
});
```

### 2. **UI Tests with Mocked Dependencies** (`Calculator.ui.test.tsx`)
```typescript
test('should call calculator service when equals is clicked', async () => {
  mockCalculatorService.calculateExpression.mockReturnValue({ result: 8 });
  
  await user.click(screen.getByTestId('equals-button'));
  
  expect(mockCalculatorService.calculateExpression).toHaveBeenCalled();
});
```

### 3. **Integration Tests**
```typescript
test('should perform real calculation end-to-end', async () => {
  // Uses real calculator service for full integration testing
});
```

## 🎯 Architecture Benefits

### 1. **Testability**
- Business logic can be tested independently
- UI can be tested with predictable mocks
- Easy to test all edge cases and error conditions

### 2. **Maintainability**
- Changes to business logic don't affect UI tests
- Changes to UI don't affect business logic tests
- Clear separation makes debugging easier

### 3. **Reusability**
- Calculator logic can be used in web, mobile, desktop, or CLI apps
- Same business logic, different UIs

### 4. **Performance**
- Tests run 100x faster
- Developers run tests more frequently
- Better development experience

## 🔄 Compare With DOM-Based Version

Students should compare this with the DOM-based version in `../calculator-app-dom/` to see the dramatic difference:

| Aspect | DOM-Based | Model-Based |
|--------|-----------|-------------|
| Test Speed | 🐌 15-30 seconds | ⚡ 1-2 seconds |
| Business Logic Testing | 😰 Through DOM | 🧪 Direct unit tests |
| Edge Case Testing | 😵 Very difficult | ✅ Trivial |
| Maintainability | 💔 Brittle | 🛡️ Stable |

## 💡 Key Takeaways

1. **Separation of concerns enables better testing**
2. **Fast tests lead to better development practices**
3. **Clean architecture pays dividends over time**
4. **Good design makes testing easier, not harder**

## 🎓 Learning Objectives

Students should understand:

- How to separate business logic from UI logic
- The benefits of dependency injection for testing
- How mocking enables focused UI testing
- Why fast tests matter for development workflow
- How good architecture enables code reuse

## 🏆 This is Professional-Grade Code

This approach is used in production applications because it:
- Scales well as complexity grows
- Enables confident refactoring
- Supports multiple UI platforms
- Facilitates team collaboration
- Reduces bugs through comprehensive testing

