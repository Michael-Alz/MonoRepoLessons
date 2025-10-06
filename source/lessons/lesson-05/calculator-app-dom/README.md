# DOM-Based Calculator - The "Ugly" Approach

This calculator demonstrates what happens when you embed ALL business logic directly into React components.

## 🚨 Warning: This is Intentionally "Ugly"

This code is designed to show students what **NOT** to do. It demonstrates:

- ❌ Business logic mixed with UI logic
- ❌ Hard-to-test embedded calculations
- ❌ Slow, brittle DOM-based tests
- ❌ Tight coupling between concerns
- ❌ Difficult maintenance and debugging

## 🏃‍♂️ Running the App

```bash
npm install
npm run dev  # http://localhost:5175
```

## 🧪 Running the Tests

```bash
npm test
```

**Notice how slow and complex the tests are!**

## 📁 File Structure

```
calculator-app-dom/
├── src/
│   ├── Calculator.tsx          # ALL logic embedded here (BAD!)
│   └── __tests__/
│       └── Calculator.dom.test.tsx  # Painful DOM tests
├── package.json
└── README.md
```

## 🔍 What's Wrong Here?

### 1. **Embedded Business Logic**
```typescript
// UGLY: Calculator parsing logic inside React component
const parseExpression = (tokens: string[], position: { value: number }): number => {
  // 50+ lines of business logic mixed with UI code
};
```

### 2. **Impossible to Test Business Logic Independently**
```typescript
// To test "2 + 3 = 5", you must:
await user.click(screen.getByTestId('number-2'));
await user.click(screen.getByTestId('add-button'));
await user.click(screen.getByTestId('number-3'));
await user.click(screen.getByTestId('equals-button'));
```

### 3. **Slow, Brittle Tests**
- Every test requires full DOM rendering
- Complex button-clicking sequences
- Tests break when UI structure changes
- Hard to test edge cases and error conditions

### 4. **Mixed Responsibilities**
The component handles:
- UI rendering
- Event handling
- Mathematical parsing
- Expression evaluation
- Error handling
- State management

## 📊 Test Performance

- **Basic arithmetic test**: 200-500ms
- **Complex expression test**: 1-2 seconds
- **Error condition test**: 500ms-1s
- **Total test suite**: 15-30 seconds

## 🎓 Learning Objectives

Students should observe:

1. **How painful it is** to test business logic through the DOM
2. **How slow** DOM-based tests are
3. **How brittle** tests become when UI and business logic are coupled
4. **How hard it is** to test edge cases and error conditions
5. **How difficult** it is to reuse the calculator logic elsewhere

## 🔄 Compare With Model-Based Version

After experiencing this pain, students should compare with the model-based version in `../calculator-app-model/` to see:

- ⚡ **100x faster tests**
- 🎯 **Direct business logic testing**
- 🛡️ **Stable tests that don't break with UI changes**
- 🧪 **Easy edge case and error testing**
- ♻️ **Reusable business logic**

## 💡 Key Takeaway

**This is why separation of concerns matters!** 

Good architecture isn't just about clean code—it's about **testable, maintainable, and reliable software**.

