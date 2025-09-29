# User Story Exercise: From Requirements to Tests

## What is a User Story?

A **user story** is a short, simple description of a feature told from the perspective of the person who desires the new capability, usually a user or customer of the system. User stories follow a simple template:

```
As a [type of user], I want [some goal] so that [some reason].
```

User stories help teams:
- Focus on the user's needs rather than technical implementation
- Break down complex features into manageable pieces
- Provide a basis for acceptance criteria and testing
- Facilitate communication between stakeholders

## Example: To-Do List Manager

Let's explore user stories through a familiar application: a personal to-do list manager.

### Application Description

The to-do list manager is a simple application designed for individual users who want to organize and track their daily tasks. Users can create tasks, mark them as complete, organize them by priority, and manage their personal productivity. The application helps users stay organized and ensures important tasks don't get forgotten.

### User Stories for To-Do List Manager

#### Core Functionality
```
As a user, I want to add new tasks to my list so that I can remember what I need to accomplish.

As a user, I want to mark tasks as complete so that I can track my progress and feel accomplished.

As a user, I want to view all my tasks in one place so that I can see everything I need to do.

As a user, I want to delete tasks from my list so that I can remove items that are no longer relevant.
```

#### Organization Features
```
As a user, I want to set priority levels for my tasks so that I can focus on the most important items first.

As a user, I want to add due dates to tasks so that I can meet deadlines and manage my time effectively.

As a user, I want to categorize tasks by project or area so that I can organize my work and personal responsibilities.

As a user, I want to search through my tasks so that I can quickly find specific items in a long list.
```

#### Productivity Features
```
As a user, I want to see only incomplete tasks so that I can focus on what still needs to be done.

As a user, I want to see my completed tasks so that I can review what I've accomplished.

As a user, I want to edit existing tasks so that I can update details as circumstances change.

As a user, I want to see tasks sorted by priority so that I can work on the most important items first.

As a user, I want to see tasks sorted by due date so that I can meet upcoming deadlines.
```

#### Data Persistence
```
As a user, I want my tasks to be saved automatically so that I don't lose my data when I close the application.

As a user, I want my tasks to be available when I restart the application so that I can continue where I left off.
```

## From User Stories to Tests

User stories naturally translate into test cases because they describe specific behaviors and outcomes. Each user story can generate multiple test scenarios:

### Test Categories from User Stories

1. **Happy Path Tests**: Test the main functionality described in the user story
2. **Edge Case Tests**: Test boundary conditions and unusual inputs
3. **Error Handling Tests**: Test what happens when things go wrong
4. **Integration Tests**: Test how features work together

### Example: Testing "Add New Tasks"

**User Story**: *As a user, I want to add new tasks to my list so that I can remember what I need to accomplish.*

**Test Cases**:

```javascript
describe('Adding Tasks', () => {
  test('should add a task with valid title', () => {
    const todoList = new TodoList();
    const task = todoList.addTask('Buy groceries');
    
    expect(task.title).toBe('Buy groceries');
    expect(task.completed).toBe(false);
    expect(todoList.getTasks()).toHaveLength(1);
  });

  test('should add multiple tasks', () => {
    const todoList = new TodoList();
    todoList.addTask('Task 1');
    todoList.addTask('Task 2');
    
    expect(todoList.getTasks()).toHaveLength(2);
  });

  test('should reject empty task titles', () => {
    const todoList = new TodoList();
    
    expect(() => todoList.addTask('')).toThrow('Task title cannot be empty');
  });

  test('should reject null or undefined titles', () => {
    const todoList = new TodoList();
    
    expect(() => todoList.addTask(null)).toThrow();
    expect(() => todoList.addTask(undefined)).toThrow();
  });

  test('should handle very long task titles', () => {
    const todoList = new TodoList();
    const longTitle = 'A'.repeat(1000);
    
    const task = todoList.addTask(longTitle);
    expect(task.title).toBe(longTitle);
  });
});
```

### Example: Testing "Mark Tasks Complete"

**User Story**: *As a user, I want to mark tasks as complete so that I can track my progress and feel accomplished.*

**Test Cases**:

```javascript
describe('Completing Tasks', () => {
  test('should mark a task as complete', () => {
    const todoList = new TodoList();
    const task = todoList.addTask('Complete project');
    
    todoList.completeTask(task.id);
    
    expect(task.completed).toBe(true);
  });

  test('should handle completing already completed tasks', () => {
    const todoList = new TodoList();
    const task = todoList.addTask('Already done');
    todoList.completeTask(task.id);
    
    // Should not throw error when completing again
    expect(() => todoList.completeTask(task.id)).not.toThrow();
    expect(task.completed).toBe(true);
  });

  test('should throw error for non-existent task ID', () => {
    const todoList = new TodoList();
    
    expect(() => todoList.completeTask('invalid-id')).toThrow('Task not found');
  });

  test('should update completion timestamp', () => {
    const todoList = new TodoList();
    const task = todoList.addTask('Time-sensitive task');
    const beforeTime = new Date();
    
    todoList.completeTask(task.id);
    
    expect(task.completedAt).toBeInstanceOf(Date);
    expect(task.completedAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
  });
});
```

## The Calculator Exercise

Now that you understand user stories and how they translate to tests, let's apply this knowledge to a different domain.

### Application Description

You need to design a terminal-based mathematical calculator application that helps users perform arithmetic calculations interactively. The calculator should provide a user-friendly interface where people can input mathematical expressions and receive immediate results. Users should be able to perform basic arithmetic operations, handle complex expressions with proper mathematical precedence, and receive clear feedback when errors occur. The application should feel intuitive and responsive, making mathematical calculations quick and easy for everyday use.

The calculator will run in a terminal environment and should provide real-time feedback as users type their expressions. It should handle various types of mathematical input and provide helpful error messages when users make mistakes.

### Your Task

**Write comprehensive user stories** for this calculator application. Consider:

1. **Who are the users?** (students, professionals, casual users, etc.)
2. **What do they want to accomplish?** (calculations, learning, problem-solving, etc.)
3. **Why do they need this functionality?** (efficiency, accuracy, convenience, etc.)

### Categories to Consider

Think about user stories for these areas:

#### Basic Operations
- Performing arithmetic calculations
- Handling different number types
- Managing calculation history

#### User Interface
- Inputting expressions
- Viewing results
- Navigating the interface
- Getting help or instructions

#### Advanced Features
- Complex expressions with parentheses
- Error handling and recovery
- Mathematical precedence
- Input validation

#### User Experience
- Ease of use
- Performance and responsiveness
- Accessibility
- Learning curve

### Deliverables

1. **User Stories**: Write 15-20 user stories covering the calculator functionality
2. **Test Planning**: For each user story, identify what test cases would be needed
3. **Priority Ranking**: Organize your user stories by importance (Must Have, Should Have, Could Have)
4. **Acceptance Criteria**: For your top 5 user stories, write specific acceptance criteria

### Example Format

```
As a [type of user], I want [some goal] so that [some reason].

Acceptance Criteria:
- [Specific condition 1]
- [Specific condition 2]
- [Specific condition 3]

Test Scenarios:
- Happy path: [description]
- Edge cases: [description]
- Error conditions: [description]
```

### Evaluation Criteria

Your user stories will be evaluated on:
- **Completeness**: Do they cover all major functionality?
- **Clarity**: Are they easy to understand and unambiguous?
- **User Focus**: Do they reflect real user needs and motivations?
- **Testability**: Can they be easily translated into test cases?
- **Prioritization**: Are the most important features identified?

### Tips for Success

1. **Think like a user**, not a developer
2. **Focus on the "why"** behind each feature
3. **Keep stories small and focused** on single pieces of functionality
4. **Use consistent language** and formatting
5. **Consider different user types** and their varying needs
6. **Think about edge cases** and error scenarios
7. **Remember the terminal interface** constraints and opportunities

Good luck! Remember, great user stories lead to great software that truly serves user needs.
