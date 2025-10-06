# React Testing Demo - Greeting App

This app demonstrates two different approaches to React testing by showing the same functionality implemented in two different architectural styles.

## 🚀 Running the Demo

### Option 1: Run Both Versions Simultaneously

**Tightly-Coupled Version** (Component-based):
```bash
npm run dev-com
```
- Runs on: http://localhost:5173
- Shows: Business logic mixed with UI logic
- Testing: Requires DOM-based testing

**Model-Based Version**:
```bash
npm run dev-model
```
- Runs on: http://localhost:5273
- Shows: Business logic separated into model.ts
- Testing: Can use pure unit tests + mocked UI tests

### Option 2: Run Single Version
```bash
npm run dev
```
- Runs on: http://localhost:5174 (or next available port)
- Default version (can be changed in main.tsx)

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📚 Test Files

- `App.dom.test.tsx` - DOM-based testing approach
- `model.test.ts` - Pure business logic testing
- `AppWithModel.test.tsx` - UI testing with mocked dependencies

## 🎓 For Students

1. **Open both versions side by side** in different browser tabs
2. **Notice they look and behave identically** - good architecture doesn't change UX
3. **Compare the test files** to see how architecture affects testing strategy
4. **Run the tests** to see both approaches in action

## 🔄 Key Learning Points

- **Same functionality, different testability**
- **Separation of concerns enables better testing**
- **Architecture decisions impact test strategy**
- **Both approaches have their place in real applications**

