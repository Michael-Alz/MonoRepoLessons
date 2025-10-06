# Lesson 05: Self-Guided Learning Tour

**Welcome to React Testing: DOM vs Model-Based Approaches!** 👋

This is your self-guided tour through one of the most important concepts in software development: **how architecture affects testing**. You'll work through hands-on examples at your own pace and discover why separation of concerns is crucial for building testable software.

## 🎯 What You'll Learn Today

By the end of this lesson, you'll understand:
- Two different approaches to testing React applications
- When to use DOM-based testing vs model-based testing
- How architecture decisions impact your testing strategy
- Why separation of concerns makes code more maintainable

## 🗺️ Your Learning Journey (Self-Paced)

### **Step 1: Get Your Bearings** (10 minutes)
1. **Read the Overview** 📖
   - Start with `README.md` to understand the lesson structure
   - Look at the file organization to see what you'll be building

2. **Set Up Your Environment** 🛠️
   - Make sure you have Node.js 16+ installed
   - Open multiple terminal windows - you'll need them!

**🎯 Goal:** Understand what you're about to learn and get your workspace ready.

### **Step 2: Experience the Simple Approach** (20 minutes)
1. **Run the Greeting Apps** 🚀
   ```bash
   # Terminal 1 - Component-based version
   cd greeting-app
   npm install
   npm run dev-com  # http://localhost:5173
   
   # Terminal 2 - Model-based version  
   npm run dev-model  # http://localhost:5273
   ```

2. **Play with Both Versions** 🎮
   - Open both URLs in different browser tabs
   - Try entering different names in both
   - Notice they work identically but have different headers

3. **Run the Tests** 🧪
   ```bash
   # Terminal 3 - See the difference!
   npm test
   ```

**🎯 Goal:** See that identical functionality can be tested in completely different ways.

**💡 Key Insight:** Both apps work the same, but the tests are dramatically different!

### **Step 3: Dive Deep with Calculators** (30 minutes)
1. **Experience the "Ugly" DOM-Based Approach** 😰
   ```bash
   # Terminal 4 - DOM-based calculator
   cd ../calculator-app-dom
   npm install
   npm run dev  # http://localhost:5175
   npm test     # Watch it crawl... 🐌
   ```

2. **Experience the "Clean" Model-Based Approach** ⚡
   ```bash
   # Terminal 5 - Model-based calculator
   cd ../calculator-app-model  
   npm install
   npm run dev  # http://localhost:5275
   npm test     # Watch it fly! 🚀
   ```

3. **Compare Side-by-Side** 📊
   - Open both calculators in browser tabs
   - Try the same calculations in both (they work identically!)
   - Time how long each test suite takes to run
   - Look at the test code complexity

**🎯 Goal:** Experience firsthand why architecture matters for testing.

**💡 Key Insight:** Complex expressions make DOM tests painfully slow, but model tests stay lightning fast!

### **Step 4: Understand the Why** (15 minutes)
1. **Read the Comparison Guide** 📚
   - Open `CALCULATOR-COMPARISON.md`
   - Follow the step-by-step examples
   - Pay special attention to the `1 + 3 * (9 + 1)` example

2. **Analyze the Test Code** 🔍
   - Look at `calculator-app-dom/src/__tests__/Calculator.dom.test.tsx`
   - Look at `calculator-app-model/src/__tests__/calculator.test.ts`
   - Count the lines of code for the same functionality

**🎯 Goal:** Understand exactly why one approach scales better than the other.

**💡 Key Insight:** As expressions get more complex, DOM tests get exponentially harder, but model tests stay simple!

### **Step 5: Master Complex DOM Testing** (30 minutes)
1. **Experience the Wordle Testing Challenge** 🎮
   ```bash
   # Terminal 6 - Complex DOM testing practice
   cd ../wordle-testing-app
   npm install
   npm run dev  # http://localhost:5176
   npm test     # See the starter tests pass!
   ```

2. **Study the Starter Tests** 📖
   - Open `src/__tests__/App.test.tsx`
   - Run the tests and see 3 passing tests
   - Study how Material-UI components are tested
   - Learn the testing patterns and helper functions

3. **Build Your Testing Skills** 🛠️
   - Follow the README.md testing scenarios
   - Start with the remaining rendering tests
   - Add virtual keyboard interaction tests
   - Test complex game logic and edge cases

**🎯 Goal:** Experience the complexity of testing a real-world DOM-heavy application.

**💡 Key Insight:** Complex UIs require sophisticated testing strategies - this is where architecture decisions really matter!

### **Step 6: Hands-On Practice** (20 minutes)
1. **Try Adding a New Feature** 🛠️
   - Add a "square" button (x²) to both calculators
   - Write tests for both approaches
   - Compare the effort required

2. **Break Something on Purpose** 🔧
   - Change the button layout in both calculators
   - See which tests break and which stay stable
   - Fix the broken tests

3. **Test Complex Expressions** 🧮
   - Try calculating `((5 + 3) * 2) - (10 / 2) + 1` in both approaches
   - Write tests for this expression
   - Time how long each test takes

**🎯 Goal:** Get hands-on experience with both approaches.

**💡 Key Insight:** UI changes break DOM tests but not model tests!

## 🤔 Self-Check Questions

As you work through the lesson, ask yourself:

### After Step 2:
- **Q:** Why do both greeting apps work identically but test differently?
- **A:** Same UI, different architecture - one mixes concerns, one separates them.

### After Step 3:
- **Q:** Why are the DOM tests so much slower?
- **A:** They have to render components, simulate clicks, and wait for DOM updates.

### After Step 4:
- **Q:** Why don't model-based UI tests need to test the math?
- **A:** They use mocks to isolate UI concerns from business logic.

### After Step 5:
- **Q:** What makes testing complex UI components challenging?
- **A:** Many interactive elements, state management, user interactions, and integration between components make DOM testing complex and slow.

### After Step 6:
- **Q:** When would you choose each approach?
- **A:** DOM for simple components, model-based for complex business logic.

## 🚨 If You Get Stuck

### Common Issues and Solutions:

#### **Tests Won't Run**
```bash
# Try this:
npm install --save-dev @types/jest @testing-library/jest-dom
```

#### **Port Already in Use**
- Check if you have other apps running
- Use different ports or stop conflicting processes

#### **TypeScript Errors**
- Make sure all dependencies are installed
- Check that your Node.js version is 16+

#### **Can't See the Difference**
- Make sure you're running tests in both calculator apps
- Time the test execution with a stopwatch
- Look at the actual test code, not just the results

## 🎯 Success Checklist

By the end of this lesson, you should be able to:

- [ ] **Explain** the difference between DOM-based and model-based testing
- [ ] **Run** both types of test suites and see the performance difference
- [ ] **Write** basic tests using both approaches
- [ ] **Test complex UI components** like the Wordle game with virtual keyboards and state management
- [ ] **Identify** when to use each approach
- [ ] **Understand** why separation of concerns matters for testing

## 🚀 Going Further

### **If You Want More Challenge:**
1. **Complete the Wordle Test Suite** 🎮
   - Implement all the testing scenarios in the Wordle app README
   - Add edge case tests for complex game states
   - Measure test execution times for different scenarios

2. **Performance Analysis** 📊
   - Use `console.time()` to measure exact test execution times
   - Create a spreadsheet comparing different test scenarios
   - Compare Wordle DOM tests vs calculator model tests

3. **Real-World Application** 🌍
   - Take a component from a project you're working on
   - Refactor it using the model-based approach
   - Compare the testing experience

4. **Advanced Patterns** 🎓
   - Learn about test doubles (mocks, stubs, spies)
   - Explore dependency injection patterns
   - Study clean architecture principles

### **If You Need More Practice:**
1. **Start with Simpler Examples** 🎯
   - Begin with the greeting app and make sure you understand it fully
   - Write additional tests for edge cases
   - Practice with the React Testing Library queries

2. **Focus on the Wordle Basics** 🎮
   - Complete just the beginner-level Wordle tests
   - Study the starter test patterns carefully
   - Ask for help with the more complex scenarios

3. **Guided Learning** 👥
   - Work with a classmate to discuss the concepts
   - Ask questions in class or office hours
   - Review the additional resources below

## 📚 Additional Resources

### **Essential Reading:**
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Mocking Guide](https://jestjs.io/docs/mock-functions)

### **Deep Dives:**
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 🏆 Key Takeaways

Remember these important points:

1. **Architecture Affects Testing** - How you structure code determines how you can test it
2. **Fast Tests Enable Better Development** - When tests run quickly, you run them more often
3. **Separation of Concerns is Powerful** - Isolated components are easier to test and maintain
4. **Context Matters** - Choose the right approach for your specific situation
5. **Both Approaches Have Value** - DOM tests for integration, model tests for business logic

---

**🎉 Congratulations!** You've completed a comprehensive tour of React testing approaches. You now have the knowledge to make informed decisions about testing strategy in your own projects.

**Next Steps:** Apply these concepts to your own code and see the difference good architecture can make!

## 🎓 Student Activities

### Activity 1: DOM Test Writing (15 minutes)
Students write tests for:
- Enter key functionality
- Empty input handling
- Multiple name updates
- Input field clearing

### Activity 2: Model Design (10 minutes)
Students design their own model interface for a different app (e.g., counter, todo item)

### Activity 3: Mock Creation (10 minutes)
Students create mocks for their designed model and write basic UI tests

## 🔍 Assessment Checkpoints

### Understanding Check 1 (After DOM Testing)
**Question:** "What are the pros and cons of testing the UI directly?"
**Expected Answer:** 
- Pros: Tests real user experience, catches integration issues
- Cons: Slower, brittle to UI changes, hard to test complex logic

### Understanding Check 2 (After Model Introduction)
**Question:** "Why separate business logic from UI logic?"
**Expected Answer:**
- Easier to test business rules
- Faster test execution
- Better maintainability
- Independent evolution of concerns

### Understanding Check 3 (After Mocking)
**Question:** "When would you use mocked vs real dependencies in tests?"
**Expected Answer:**
- Mocked: Fast unit tests, isolated component testing
- Real: Integration tests, end-to-end workflows

## 🚨 Common Student Struggles

### 1. "Why make it more complex?"
**Response:** Start with simple examples, then show how complexity grows. Emphasize that good architecture pays off over time.

### 2. "Mocking seems like cheating"
**Response:** Explain that mocking enables focused testing. Show how it complements, not replaces, integration tests.

### 3. "Which approach should I always use?"
**Response:** Emphasize context-dependent decisions. Show the decision framework from the guide.

## 🛠️ Technical Setup Notes

### Prerequisites
- Node.js 16+ installed
- Basic React knowledge
- Understanding of Jest basics

### Common Setup Issues
1. **Jest configuration:** Students may struggle with jsdom setup
2. **Import errors:** TypeScript module resolution can be tricky
3. **Mock syntax:** Jest mocking syntax is not intuitive

### Quick Fixes
```bash
# If tests don't run
npm install --save-dev @types/jest

# If DOM queries fail
npm install --save-dev @testing-library/jest-dom

# If TypeScript complains
# Add to tsconfig.json: "types": ["jest", "@testing-library/jest-dom"]
```

## 📊 Success Metrics

Students should be able to:
1. ✅ Write basic DOM tests using React Testing Library
2. ✅ Identify when DOM testing becomes problematic
3. ✅ Extract business logic into testable models
4. ✅ Create and use mocks for UI testing
5. ✅ Explain the trade-offs between approaches

## 🔄 Extension Activities

### For Advanced Students
1. **Performance Testing:** Measure and compare test execution times
2. **Coverage Analysis:** Use Jest coverage reports to compare approaches
3. **Real-World Refactoring:** Take a complex component and apply model separation

### For Struggling Students
1. **Guided Practice:** Pair programming with instructor
2. **Simplified Examples:** Start with even simpler components
3. **Visual Aids:** Draw architecture diagrams together

## 📚 Additional Resources

### For Students
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Mocking Guide](https://jestjs.io/docs/mock-functions)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### For Instructors
- [Testing Philosophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Architecture Patterns](https://martinfowler.com/articles/practical-test-pyramid.html)

## 🎯 Key Takeaways

1. **Start Simple:** DOM testing is a great entry point
2. **Evolve Architecture:** Good testing drives good design
3. **Context Matters:** Different approaches for different situations
4. **Balance is Key:** Use both approaches strategically

---

*Remember: The goal is not to convince students that one approach is always better, but to give them tools to make informed decisions based on their specific context.*
