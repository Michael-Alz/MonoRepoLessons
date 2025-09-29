# Code Coverage Exercise

## Objective

Your task is to achieve **100% code coverage** for the `calculator.ts` file by writing additional unit tests. This exercise will help you understand the importance of thorough testing and how to identify untested code paths.

## Current Status

The calculator currently has **89.39% code coverage** on the `calculator.ts` file. Your goal is to bring this to **100%**.

## How to Check Coverage

### Running Coverage Reports

To see the current test coverage, run:

```bash
npm run test:coverage
```

This will show you:
- Overall coverage percentages
- Which lines are not covered
- A detailed HTML report in the `coverage/` directory

### Understanding Coverage Output

The coverage report shows several metrics:
- **% Stmts**: Percentage of statements executed
- **% Branch**: Percentage of branches (if/else) taken
- **% Funcs**: Percentage of functions called
- **% Lines**: Percentage of lines executed
- **Uncovered Line #s**: Specific line numbers that need tests

### Viewing Detailed Coverage

After running `npm run test:coverage`, you can view the detailed HTML coverage report in several ways:

#### Option 1: Command Line
**macOS/Linux:**
```bash
open coverage/lcov-report/index.html
```

**Windows (Command Prompt):**
```cmd
start coverage\lcov-report\index.html
```

**Windows (PowerShell):**
```powershell
Invoke-Item coverage\lcov-report\index.html
```

**Git Bash (Windows):**
```bash
start coverage/lcov-report/index.html
```

#### Option 2: Visual Studio Code
1. In the Explorer panel, navigate to `coverage/lcov-report/`
2. Right-click on `index.html`
3. Select **"Open with Live Server"** (if you have the Live Server extension)
4. Or select **"Reveal in Finder"** (macOS) or **"Reveal in File Explorer"** (Windows) and double-click the file

#### Option 3: Cursor IDE
1. In the file explorer, navigate to `coverage/lcov-report/`
2. Right-click on `index.html`
3. Select **"Open in Browser"** or **"Open with System Default"**
4. Alternatively, you can preview HTML files directly in Cursor by:
   - Opening `index.html` in the editor
   - Using the preview pane (if available)

#### Option 4: Manual Browser Opening
1. Navigate to your project folder in your file manager
2. Go to `coverage/lcov-report/`
3. Double-click `index.html` to open it in your default browser

The HTML report provides a visual representation of which lines are covered (highlighted in green) and which are not covered (highlighted in red or pink). You can click on individual files to see line-by-line coverage details.

## Your Task

1. **Analyze the current coverage report** to identify uncovered lines in `calculator.ts`
2. **Write additional test cases** to cover the missing lines
3. **Focus on edge cases and error conditions** that might not be currently tested
4. **Verify your progress** by running the coverage report after each new test

## Tips for Achieving 100% Coverage

### Identify Missing Test Cases

Look for:
- **Error conditions**: What happens when invalid input is provided?
- **Edge cases**: Boundary conditions and unusual inputs
- **All code paths**: Ensure every if/else branch is tested
- **Exception handling**: Test scenarios that throw errors

### Common Areas to Test

For a calculator, consider testing:
- Invalid mathematical expressions
- Malformed input that causes parsing errors
- Edge cases in expression evaluation
- Error recovery scenarios
- Boundary conditions

### Writing Effective Tests

Each test should:
- Have a clear, descriptive name
- Test one specific scenario
- Include both the expected result and error cases
- Follow the existing test structure

## Example Test Structure

```typescript
test('should handle [specific scenario]', () => {
  const result = calculator.calculate([/* test tokens */]);
  expect(result.error).toBe('Expected error message');
  expect(result.result).toBeUndefined();
});
```

## Verification

Once you believe you've achieved 100% coverage:

1. Run `npm run test:coverage`
2. Verify that `calculator.ts` shows **100%** in all columns
3. Check that the "Uncovered Line #s" column is empty for `calculator.ts`
4. Ensure all tests still pass with `npm test`

## Success Criteria

- ✅ All existing tests continue to pass
- ✅ `calculator.ts` achieves 100% statement coverage
- ✅ `calculator.ts` achieves 100% branch coverage
- ✅ `calculator.ts` achieves 100% line coverage
- ✅ No uncovered lines remain in the coverage report

## Learning Outcomes

By completing this exercise, you will:
- Understand how to read and interpret code coverage reports
- Learn to identify untested code paths
- Practice writing comprehensive test suites
- Gain experience with edge case testing
- Develop skills in achieving thorough test coverage

## Getting Started

1. Run `npm run test:coverage` to see the current state
2. Open the HTML coverage report to visualize uncovered lines
3. Examine the `calculator.ts` file to understand what needs testing
4. Write tests for the uncovered scenarios
5. Repeat until you achieve 100% coverage

Good luck! Remember, the goal is not just to achieve 100% coverage, but to understand why comprehensive testing is important for code quality and reliability.
