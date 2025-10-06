# Lesson 05: React Testing - From DOM Testing to Model-Based Architecture

## 🎯 Learning Objectives

By the end of this lesson, you will understand:

1. **Two fundamental approaches to React testing**
2. **DOM-based testing** using React Testing Library
3. **Model-based testing** with proper separation of concerns
4. **Mocking strategies** for isolated component testing
5. **The evolution from tightly coupled to testable architecture**

## 🚀 Project Overview

We'll build a simple greeting application that demonstrates two different testing philosophies:

### Phase 1: Simple Vite + Material-UI App
- Input field for name entry
- "Update" button and Enter key functionality  
- Dynamic title that displays "Hello, [name]"

### Phase 2: Two Testing Approaches

#### Approach 1: DOM-Based Testing
- Test the UI directly by finding DOM elements
- Simulate user interactions (typing, clicking)
- Assert on the rendered output
- **Pros**: Tests the actual user experience
- **Cons**: Tightly coupled to UI implementation

#### Approach 2: Model-Based Testing
- Extract business logic into a `model.ts` file
- Test the model independently with Jest
- Test the UI by mocking the model
- **Pros**: Separated concerns, faster tests, easier to maintain
- **Cons**: Requires more architectural thinking

## 📁 Project Structure

```
lesson-05-greeting-app/
├── src/
│   ├── App.tsx                 # Main component (Phase 1)
│   ├── AppWithModel.tsx        # Refactored component (Phase 2)
│   ├── model.ts                # Business logic model
│   └── __tests__/
│       ├── App.dom.test.tsx    # DOM-based tests
│       ├── model.test.ts       # Model unit tests
│       └── AppWithModel.test.tsx # Mocked UI tests
├── package.json
└── vite.config.ts
```

## 🔄 The Testing Evolution

### Why This Progression Matters

1. **Start Simple**: Students see immediate results with DOM testing
2. **Identify Pain Points**: Tight coupling becomes apparent as tests grow
3. **Introduce Architecture**: Model separation solves testing challenges
4. **Best Practices**: Mocking enables fast, reliable tests

### Key Concepts Demonstrated

- **Separation of Concerns**: UI vs Business Logic
- **Test Isolation**: Unit tests vs Integration tests  
- **Mocking Strategies**: When and how to mock dependencies
- **Test Maintainability**: How architecture affects test longevity

## 🛠️ Technologies Used

- **Vite**: Fast development build tool
- **React**: UI framework
- **Material-UI**: Component library
- **Jest**: Testing framework
- **React Testing Library**: DOM testing utilities
- **TypeScript**: Type safety

## 📚 What Students Will Learn

1. **DOM Testing Fundamentals**
   - Finding elements with queries
   - Simulating user events
   - Asserting on rendered content

2. **Model-Based Architecture**
   - Extracting business logic
   - Creating testable interfaces
   - Dependency injection patterns

3. **Mocking Techniques**
   - Jest module mocking
   - Spy functions and assertions
   - Isolating components from dependencies

4. **Testing Strategy**
   - When to use each approach
   - Balancing test speed vs confidence
   - Building maintainable test suites

## 🎯 Expected Outcomes

Students will understand that **good testing starts with good architecture**. They'll see how separating concerns makes code more testable, maintainable, and reliable.

---

*This lesson bridges the gap between basic React knowledge and professional testing practices, showing students how architectural decisions impact testing strategy.*

