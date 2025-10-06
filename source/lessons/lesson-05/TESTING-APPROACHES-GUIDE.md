# React Testing Approaches: A Comprehensive Guide

## 🎯 Overview

This guide demonstrates two fundamental approaches to testing React applications, using a simple greeting app as an example. Students will learn when and how to use each approach effectively.

## 📊 Comparison Table

| Aspect | DOM-Based Testing | Model-Based Testing |
|--------|------------------|-------------------|
| **Speed** | Slower (rendering required) | Faster (no DOM) |
| **Confidence** | High (tests real UI) | Medium (mocked dependencies) |
| **Maintainability** | Lower (brittle to UI changes) | Higher (focused concerns) |
| **Setup Complexity** | Simple (direct testing) | Medium (requires mocking) |
| **Business Logic Coverage** | Indirect | Direct |
| **UI Integration Coverage** | Direct | Indirect |

## 🔍 Approach 1: DOM-Based Testing

### What It Tests
- **User interactions**: Clicking, typing, keyboard events
- **Rendered output**: What users actually see
- **Component integration**: How parts work together
- **Accessibility**: Screen reader compatibility

### Example Test Structure
```typescript
test('updates greeting when clicking update button', async () => {
  const user = userEvent.setup();
  render(<App />);
  
  const input = screen.getByTestId('name-input');
  const button = screen.getByTestId('update-button');
  const greeting = screen.getByTestId('greeting-title');

  await user.type(input, 'Alice');
  await user.click(button);

  expect(greeting).toHaveTextContent('Hello, Alice!');
});
```

### When to Use DOM Testing
✅ **Good for:**
- Testing user workflows end-to-end
- Verifying accessibility features
- Catching integration bugs
- Testing complex UI interactions
- When business logic is simple

❌ **Avoid when:**
- Business logic is complex
- Tests become slow and brittle
- UI changes frequently
- You need to test edge cases in business logic

### Common Patterns
```typescript
// Finding elements
screen.getByTestId('element-id')
screen.getByRole('button', { name: /update/i })
screen.getByLabelText(/enter your name/i)

// User interactions
await user.type(input, 'text')
await user.click(button)
await user.keyboard('{Enter}')

// Assertions
expect(element).toHaveTextContent('expected text')
expect(element).toBeInTheDocument()
expect(element).toHaveValue('expected value')
```

## 🏗️ Approach 2: Model-Based Testing

### Architecture Overview
```
┌─────────────────┐    ┌─────────────────┐
│   UI Component  │────│  Business Model │
│   (React)       │    │   (Pure JS/TS)  │
└─────────────────┘    └─────────────────┘
         │                       │
         │                       │
    ┌─────────┐              ┌─────────┐
    │UI Tests │              │Model    │
    │(Mocked) │              │Tests    │
    └─────────┘              └─────────┘
```

### What It Tests

#### Model Tests (Pure Business Logic)
```typescript
test('rejects empty names', () => {
  const model = new GreetingModelImpl();
  const result = model.updateName('');
  
  expect(result).toBe(false);
  expect(model.getCurrentName()).toBe('World');
});
```

#### UI Tests (Mocked Dependencies)
```typescript
test('calls model.updateName when button clicked', async () => {
  const mockModel = createMockModel();
  render(<AppWithModel model={mockModel} />);
  
  await user.click(screen.getByTestId('update-button'));
  
  expect(mockModel.updateName).toHaveBeenCalled();
});
```

### Benefits of Separation

#### 🚀 **Fast Tests**
- Model tests run in milliseconds
- No DOM rendering overhead
- Can run thousands of tests quickly

#### 🎯 **Focused Testing**
- Business logic tests focus on rules and edge cases
- UI tests focus on user interactions
- Clear separation of concerns

#### 🔧 **Easy Maintenance**
- UI changes don't break business logic tests
- Business logic changes don't break UI structure tests
- Independent evolution of concerns

#### 🧪 **Better Test Coverage**
- Easy to test complex business scenarios
- Simple to test error conditions
- Comprehensive edge case coverage

## 🛠️ Implementation Patterns

### Model Interface Design
```typescript
export interface GreetingModel {
  getCurrentName(): string;
  updateName(newName: string): boolean;
  getGreeting(): string;
  reset(): void;
}
```

### Dependency Injection
```typescript
interface AppProps {
  model?: GreetingModel; // Optional for testing
}

function App({ model: injectedModel }: AppProps) {
  const [model] = useState(() => injectedModel || createGreetingModel());
  // ... rest of component
}
```

### Mock Creation
```typescript
const createMockModel = (): jest.Mocked<GreetingModel> => ({
  getCurrentName: jest.fn(),
  updateName: jest.fn(),
  getGreeting: jest.fn(),
  reset: jest.fn(),
});
```

## 🎓 Teaching Progression

### Phase 1: Start with DOM Testing
1. Students see immediate results
2. Tests are intuitive and match user thinking
3. No architectural complexity
4. Quick wins build confidence

### Phase 2: Identify Limitations
1. Tests become slow as suite grows
2. UI changes break tests frequently
3. Complex business logic is hard to test thoroughly
4. Edge cases require complex setup

### Phase 3: Introduce Model Separation
1. Extract business logic to separate module
2. Show how model can be tested independently
3. Demonstrate faster test execution
4. Highlight improved maintainability

### Phase 4: Compare Approaches
1. Run both test suites side by side
2. Compare execution speed
3. Discuss maintenance scenarios
4. Show when to use each approach

## 🏆 Best Practices

### For DOM Testing
- Use semantic queries (`getByRole`, `getByLabelText`)
- Test user workflows, not implementation details
- Keep tests focused on user behavior
- Use `userEvent` over `fireEvent` for realistic interactions

### For Model Testing
- Test business rules exhaustively
- Include edge cases and error conditions
- Keep models pure (no side effects)
- Use descriptive test names that explain business rules

### For UI Testing with Mocks
- Mock at the boundary (model interface)
- Verify interactions, not implementation
- Keep mocks simple and focused
- Test both success and failure scenarios

## 🤔 Decision Framework

### Choose DOM Testing When:
- Simple business logic
- Focus on user experience
- Integration testing is priority
- Team is new to testing

### Choose Model-Based Testing When:
- Complex business rules
- Performance is important
- Maintainability is priority
- Team understands architecture patterns

### Use Both When:
- Large applications
- Multiple developers
- Long-term maintenance
- High quality requirements

## 📈 Evolution Path

```
Simple App → DOM Tests → Growing Complexity → Extract Model → Model + UI Tests
     ↓              ↓              ↓              ↓              ↓
   Quick Start → Quick Feedback → Pain Points → Architecture → Maintainable
```

This progression mirrors real-world development where applications start simple and evolve toward better architecture as complexity grows.

---

*Remember: The best testing approach depends on your specific context, team skills, and project requirements. Start simple, then evolve as needed.*

