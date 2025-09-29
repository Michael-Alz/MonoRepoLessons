import { TodoList, Todo, Priority } from '../src/todo';

describe('TodoList Model', () => {
  let todoList: TodoList;

  beforeEach(() => {
    todoList = new TodoList();
  });

  describe('Core Functionality - Adding Tasks', () => {
    // User Story: As a user, I want to add new tasks to my list so that I can remember what I need to accomplish.
    // 
    // This user story focuses on the fundamental need to capture tasks that need to be done.
    // The user wants to be able to input a task description and have it stored in their list
    // so they don't forget important things they need to do.
    
    describe('Happy Path', () => {
      test('should add a task with valid title', () => {
        // Test Setup: This test verifies the core functionality described in the user story.
        // We're testing that a user can successfully add a task with a meaningful title
        // and that the system properly stores all the necessary task information.
        
        // Data Setup: Create a realistic task title that a user might actually enter
        const taskTitle = 'Buy groceries';
        
        // Action: Perform the core action from the user story - adding a new task
        // This simulates the user entering a task title and submitting it
        const task = todoList.addTask(taskTitle);
        
        // Expected Values: Define what we expect to happen when a user adds a task
        const expectedTitle = 'Buy groceries';
        const expectedCompletedStatus = false; // New tasks should start as incomplete
        const expectedListLength = 1; // After adding one task, list should have one item
        
        // Verification: Test that the user story requirement is met
        // "I want to add new tasks to my list" - verify the task was added with correct title
        expect(task.title).toBe(expectedTitle);
        
        // "so that I can remember what I need to accomplish" - verify task is stored as incomplete
        // (incomplete tasks are what the user needs to accomplish)
        expect(task.completed).toBe(expectedCompletedStatus);
        
        // Verify system generates necessary metadata for task management
        expect(task.id).toBeDefined(); // System should assign unique identifier
        expect(task.createdAt).toBeInstanceOf(Date); // System should track when task was created
        
        // Verify the task is actually stored in the user's list
        expect(todoList.getTasks()).toHaveLength(expectedListLength);
      });

      test('should add multiple tasks', () => {
        // Test Setup: This test verifies that users can add multiple tasks to build up their list
        // This reflects the real-world scenario where users have multiple things to remember
        
        // Data Setup: Create multiple realistic task titles
        const firstTaskTitle = 'Task 1';
        const secondTaskTitle = 'Task 2';
        const thirdTaskTitle = 'Task 3';
        
        // Action: Add multiple tasks sequentially (simulating user adding tasks over time)
        todoList.addTask(firstTaskTitle);
        todoList.addTask(secondTaskTitle);
        todoList.addTask(thirdTaskTitle);
        
        // Expected Values: Define what we expect after adding multiple tasks
        const expectedTaskCount = 3; // Should have all three tasks
        const expectedTaskTitles = ['Task 1', 'Task 2', 'Task 3']; // Should preserve order and content
        
        // Verification: Test that multiple tasks can be added to fulfill user story
        // "I want to add new tasks to my list" - verify all tasks were added
        expect(todoList.getTasks()).toHaveLength(expectedTaskCount);
        
        // "so that I can remember what I need to accomplish" - verify all tasks are preserved with correct titles
        expect(todoList.getTasks().map(t => t.title)).toEqual(expectedTaskTitles);
      });

      test('should generate unique IDs for each task', () => {
        // Test Setup: This test ensures the system can distinguish between different tasks
        // This is crucial for the user story because users need to be able to manage
        // individual tasks (complete, delete, edit) without affecting other tasks
        
        // Data Setup: Create two different tasks with different titles
        const firstTaskTitle = 'First task';
        const secondTaskTitle = 'Second task';
        
        // Action: Add two separate tasks to the list
        const task1 = todoList.addTask(firstTaskTitle);
        const task2 = todoList.addTask(secondTaskTitle);
        
        // Expected Values: Each task should have a unique identifier
        // (We can't predict the exact ID values, but we know they should be different)
        const expectedIdUniqueness = true; // IDs should not be the same
        
        // Verification: Test that the system can distinguish between tasks
        // This supports the user story by ensuring each task the user adds
        // can be individually managed and remembered
        expect(task1.id).not.toBe(task2.id);
        
        // Additional verification: Both IDs should actually exist
        expect(task1.id).toBeDefined();
        expect(task2.id).toBeDefined();
      });
    });

    describe('Edge Cases', () => {
      test('should handle very long task titles', () => {
        const longTitle = 'A'.repeat(1000);
        const task = todoList.addTask(longTitle);
        
        expect(task.title).toBe(longTitle);
        expect(task.title.length).toBe(1000);
      });

      test('should handle task titles with special characters', () => {
        const specialTitle = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        const task = todoList.addTask(specialTitle);
        
        expect(task.title).toBe(specialTitle);
      });

      test('should handle task titles with unicode characters', () => {
        const unicodeTitle = '📝 Buy groceries 🛒 for dinner 🍽️';
        const task = todoList.addTask(unicodeTitle);
        
        expect(task.title).toBe(unicodeTitle);
      });

      test('should trim whitespace from task titles', () => {
        const task = todoList.addTask('  Trimmed task  ');
        
        expect(task.title).toBe('Trimmed task');
      });
    });

    describe('Error Handling', () => {
      test('should reject empty task titles', () => {
        expect(() => todoList.addTask('')).toThrow('Task title cannot be empty');
      });

      test('should reject whitespace-only task titles', () => {
        expect(() => todoList.addTask('   ')).toThrow('Task title cannot be empty');
      });

      test('should reject null task titles', () => {
        expect(() => todoList.addTask(null as any)).toThrow('Task title cannot be empty');
      });

      test('should reject undefined task titles', () => {
        expect(() => todoList.addTask(undefined as any)).toThrow('Task title cannot be empty');
      });
    });
  });

  describe('Core Functionality - Marking Tasks Complete', () => {
    // User Story: As a user, I want to mark tasks as complete so that I can track my progress and feel accomplished.
    //
    // This user story addresses the psychological need for users to see their progress and feel
    // a sense of accomplishment. When users complete tasks, they want to mark them as done
    // both to track what they've achieved and to remove completed items from their active work.
    
    describe('Happy Path', () => {
      test('should mark a task as complete', () => {
        // Test Setup: This test verifies the core completion functionality from the user story.
        // We're testing that users can mark tasks as complete to track their progress.
        
        // Data Setup: Create a task that represents something a user would complete
        const taskTitle = 'Complete project';
        const task = todoList.addTask(taskTitle);
        
        // Capture the time before completion for verification
        const beforeCompletionTime = new Date();
        
        // Action: Perform the core action from the user story - marking a task complete
        // This simulates the user checking off a completed task
        todoList.completeTask(task.id);
        
        // Expected Values: Define what we expect when a user marks a task complete
        const expectedCompletedStatus = true; // Task should be marked as completed
        const expectedCompletedAtType = Date; // System should record when it was completed
        
        // Verification: Test that the user story requirements are met
        // "I want to mark tasks as complete" - verify the task is marked as completed
        expect(task.completed).toBe(expectedCompletedStatus);
        
        // "so that I can track my progress" - verify system records completion timestamp
        expect(task.completedAt).toBeInstanceOf(expectedCompletedAtType);
        
        // Additional verification: completion time should be reasonable (after we started the test)
        expect(task.completedAt!.getTime()).toBeGreaterThanOrEqual(beforeCompletionTime.getTime());
      });

      test('should mark multiple tasks as complete', () => {
        // Test Setup: This test verifies that users can mark multiple tasks as complete
        // This reflects real-world usage where users accomplish multiple things and want
        // to track progress on all of them to feel accomplished about their productivity
        
        // Data Setup: Create multiple tasks representing different accomplishments
        const firstTaskTitle = 'Task 1';
        const secondTaskTitle = 'Task 2';
        const task1 = todoList.addTask(firstTaskTitle);
        const task2 = todoList.addTask(secondTaskTitle);
        
        // Action: Mark both tasks as complete (simulating user completing multiple items)
        todoList.completeTask(task1.id);
        todoList.completeTask(task2.id);
        
        // Expected Values: Both tasks should be marked as completed
        const expectedCompletedStatus = true;
        
        // Verification: Test that multiple completions support the user story
        // "I want to mark tasks as complete" - verify both tasks can be marked complete
        expect(task1.completed).toBe(expectedCompletedStatus);
        expect(task2.completed).toBe(expectedCompletedStatus);
        
        // "so that I can track my progress and feel accomplished" - verify both have completion timestamps
        expect(task1.completedAt).toBeInstanceOf(Date);
        expect(task2.completedAt).toBeInstanceOf(Date);
      });

      test('should set completion timestamp when marking complete', () => {
        const task = todoList.addTask('Time-sensitive task');
        const beforeTime = new Date();
        
        todoList.completeTask(task.id);
        
        expect(task.completedAt).toBeInstanceOf(Date);
        expect(task.completedAt!.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      });
    });

    describe('Edge Cases', () => {
      test('should handle completing already completed tasks', () => {
        const task = todoList.addTask('Already done');
        todoList.completeTask(task.id);
        const firstCompletionTime = task.completedAt;
        
        // Should not throw error when completing again
        expect(() => todoList.completeTask(task.id)).not.toThrow();
        expect(task.completed).toBe(true);
        expect(task.completedAt).toBe(firstCompletionTime); // Should not change timestamp
      });

      test('should allow uncompleting a completed task', () => {
        const task = todoList.addTask('Toggle task');
        todoList.completeTask(task.id);
        
        todoList.uncompleteTask(task.id);
        
        expect(task.completed).toBe(false);
        expect(task.completedAt).toBeNull();
      });
    });

    describe('Error Handling', () => {
      test('should throw error for non-existent task ID', () => {
        expect(() => todoList.completeTask('invalid-id')).toThrow('Task not found');
      });

      test('should throw error for null task ID', () => {
        expect(() => todoList.completeTask(null as any)).toThrow('Task ID cannot be null or undefined');
      });

      test('should throw error for undefined task ID', () => {
        expect(() => todoList.completeTask(undefined as any)).toThrow('Task ID cannot be null or undefined');
      });
    });
  });

  describe('Core Functionality - Viewing Tasks', () => {
    // User Story: As a user, I want to view all my tasks in one place so that I can see everything I need to do.
    //
    // This user story addresses the fundamental need for users to have visibility into their workload.
    // Users need to see all their tasks in a single, organized view so they can plan their work,
    // prioritize what to do next, and ensure nothing gets forgotten or overlooked.
    
    describe('Happy Path', () => {
      test('should return empty array when no tasks exist', () => {
        // Test Setup: This test verifies the initial state when a user first starts using the system
        // Even with no tasks, the user should be able to view their (empty) task list
        // This ensures the viewing functionality works in all states
        
        // Data Setup: Start with a fresh, empty todo list (no tasks added)
        // The beforeEach already gives us an empty todoList, so no additional setup needed
        
        // Action: Attempt to view all tasks (simulating user opening their task list)
        const allTasks = todoList.getTasks();
        
        // Expected Values: Define what we expect when viewing an empty task list
        const expectedEmptyArray = []; // Should return empty array, not null or undefined
        const expectedTaskCount = 0; // Should have zero tasks
        
        // Verification: Test that the user story is supported even with no tasks
        // "I want to view all my tasks in one place" - verify viewing works (returns empty array)
        expect(allTasks).toEqual(expectedEmptyArray);
        
        // "so that I can see everything I need to do" - verify user can see there's nothing to do
        expect(allTasks).toHaveLength(expectedTaskCount);
      });

      test('should return all tasks in order of creation', () => {
        const task1 = todoList.addTask('First task');
        const task2 = todoList.addTask('Second task');
        const task3 = todoList.addTask('Third task');
        
        const tasks = todoList.getTasks();
        expect(tasks).toHaveLength(3);
        expect(tasks[0]).toBe(task1);
        expect(tasks[1]).toBe(task2);
        expect(tasks[2]).toBe(task3);
      });

      test('should return both completed and incomplete tasks', () => {
        const task1 = todoList.addTask('Incomplete task');
        const task2 = todoList.addTask('Complete task');
        todoList.completeTask(task2.id);
        
        const tasks = todoList.getTasks();
        expect(tasks).toHaveLength(2);
        expect(tasks.some(t => t.completed)).toBe(true);
        expect(tasks.some(t => !t.completed)).toBe(true);
      });
    });

    describe('Edge Cases', () => {
      test('should handle large number of tasks', () => {
        for (let i = 0; i < 1000; i++) {
          todoList.addTask(`Task ${i}`);
        }
        
        expect(todoList.getTasks()).toHaveLength(1000);
      });

      test('should return a copy of tasks array to prevent external modification', () => {
        todoList.addTask('Protected task');
        const tasks = todoList.getTasks();
        
        tasks.push({} as any); // Try to modify returned array
        
        expect(todoList.getTasks()).toHaveLength(1); // Original should be unchanged
      });
    });
  });

  describe('Core Functionality - Deleting Tasks', () => {
    // User Story: As a user, I want to delete tasks from my list so that I can remove items that are no longer relevant.
    
    describe('Happy Path', () => {
      test('should delete a task by ID', () => {
        const task = todoList.addTask('Task to delete');
        
        todoList.deleteTask(task.id);
        
        expect(todoList.getTasks()).toHaveLength(0);
      });

      test('should delete specific task without affecting others', () => {
        const task1 = todoList.addTask('Keep this');
        const task2 = todoList.addTask('Delete this');
        const task3 = todoList.addTask('Keep this too');
        
        todoList.deleteTask(task2.id);
        
        const remainingTasks = todoList.getTasks();
        expect(remainingTasks).toHaveLength(2);
        expect(remainingTasks.map(t => t.title)).toEqual(['Keep this', 'Keep this too']);
      });

      test('should delete completed tasks', () => {
        const task = todoList.addTask('Completed task');
        todoList.completeTask(task.id);
        
        todoList.deleteTask(task.id);
        
        expect(todoList.getTasks()).toHaveLength(0);
      });
    });

    describe('Edge Cases', () => {
      test('should handle deleting from empty list', () => {
        expect(() => todoList.deleteTask('non-existent')).toThrow('Task not found');
      });

      test('should handle deleting the same task twice', () => {
        const task = todoList.addTask('Delete twice');
        todoList.deleteTask(task.id);
        
        expect(() => todoList.deleteTask(task.id)).toThrow('Task not found');
      });
    });

    describe('Error Handling', () => {
      test('should throw error for non-existent task ID', () => {
        todoList.addTask('Existing task');
        
        expect(() => todoList.deleteTask('invalid-id')).toThrow('Task not found');
      });

      test('should throw error for null task ID', () => {
        expect(() => todoList.deleteTask(null as any)).toThrow('Task ID cannot be null or undefined');
      });

      test('should throw error for undefined task ID', () => {
        expect(() => todoList.deleteTask(undefined as any)).toThrow('Task ID cannot be null or undefined');
      });
    });
  });

  describe('Organization Features - Priority Levels', () => {
    // User Story: As a user, I want to set priority levels for my tasks so that I can focus on the most important items first.
    //
    // This user story addresses the need for users to organize their workload by importance.
    // In real life, not all tasks are equally important. Users need to be able to mark some tasks
    // as high priority so they can focus their limited time and energy on what matters most.
    
    describe('Happy Path', () => {
      test('should add task with priority', () => {
        // Test Setup: This test verifies that users can assign priority levels when creating tasks
        // This supports the user story by allowing users to categorize tasks by importance
        // from the moment they create them
        
        // Data Setup: Create a task that would realistically be high priority
        const taskTitle = 'High priority task';
        const taskPriority = Priority.HIGH;
        
        // Action: Add a task with a specific priority level
        // This simulates a user creating a task and marking it as high priority
        const task = todoList.addTask(taskTitle, { priority: taskPriority });
        
        // Expected Values: Define what we expect when a user sets task priority
        const expectedPriority = Priority.HIGH; // Task should retain the assigned priority
        
        // Verification: Test that the user story requirement is met
        // "I want to set priority levels for my tasks" - verify priority was set correctly
        expect(task.priority).toBe(expectedPriority);
        
        // Additional verification: ensure the task still has all other expected properties
        expect(task.title).toBe(taskTitle);
        expect(task.completed).toBe(false); // Should still be incomplete initially
      });

      test('should default to medium priority when not specified', () => {
        const task = todoList.addTask('Default priority task');
        
        expect(task.priority).toBe(Priority.MEDIUM);
      });

      test('should update task priority', () => {
        const task = todoList.addTask('Changeable priority');
        
        todoList.updateTaskPriority(task.id, Priority.HIGH);
        
        expect(task.priority).toBe(Priority.HIGH);
      });

      test('should get tasks sorted by priority', () => {
        const lowTask = todoList.addTask('Low priority', { priority: Priority.LOW });
        const highTask = todoList.addTask('High priority', { priority: Priority.HIGH });
        const mediumTask = todoList.addTask('Medium priority', { priority: Priority.MEDIUM });
        
        const sortedTasks = todoList.getTasksByPriority();
        
        expect(sortedTasks[0]).toBe(highTask);
        expect(sortedTasks[1]).toBe(mediumTask);
        expect(sortedTasks[2]).toBe(lowTask);
      });
    });

    describe('Edge Cases', () => {
      test('should handle all priority levels', () => {
        const highTask = todoList.addTask('High', { priority: Priority.HIGH });
        const mediumTask = todoList.addTask('Medium', { priority: Priority.MEDIUM });
        const lowTask = todoList.addTask('Low', { priority: Priority.LOW });
        
        expect(highTask.priority).toBe(Priority.HIGH);
        expect(mediumTask.priority).toBe(Priority.MEDIUM);
        expect(lowTask.priority).toBe(Priority.LOW);
      });

      test('should maintain priority after completion', () => {
        const task = todoList.addTask('Important task', { priority: Priority.HIGH });
        
        todoList.completeTask(task.id);
        
        expect(task.priority).toBe(Priority.HIGH);
      });
    });

    describe('Error Handling', () => {
      test('should throw error when updating priority of non-existent task', () => {
        expect(() => todoList.updateTaskPriority('invalid-id', Priority.HIGH))
          .toThrow('Task not found');
      });

      test('should throw error for invalid priority value', () => {
        const task = todoList.addTask('Test task');
        
        expect(() => todoList.updateTaskPriority(task.id, 'INVALID' as any))
          .toThrow('Invalid priority level');
      });
    });
  });

  describe('Organization Features - Due Dates', () => {
    // User Story: As a user, I want to add due dates to tasks so that I can meet deadlines and manage my time effectively.
    
    describe('Happy Path', () => {
      test('should add task with due date', () => {
        const dueDate = new Date('2024-12-31');
        const task = todoList.addTask('Task with deadline', { dueDate });
        
        expect(task.dueDate).toEqual(dueDate);
      });

      test('should update task due date', () => {
        const task = todoList.addTask('Flexible deadline');
        const newDueDate = new Date('2024-06-15');
        
        todoList.updateTaskDueDate(task.id, newDueDate);
        
        expect(task.dueDate).toEqual(newDueDate);
      });

      test('should get tasks sorted by due date', () => {
        const laterTask = todoList.addTask('Later task', { dueDate: new Date('2024-12-31') });
        const soonerTask = todoList.addTask('Sooner task', { dueDate: new Date('2024-06-15') });
        const middleTask = todoList.addTask('Middle task', { dueDate: new Date('2024-09-15') });
        
        const sortedTasks = todoList.getTasksByDueDate();
        
        expect(sortedTasks[0]).toBe(soonerTask);
        expect(sortedTasks[1]).toBe(middleTask);
        expect(sortedTasks[2]).toBe(laterTask);
      });

      test('should remove due date from task', () => {
        const task = todoList.addTask('Flexible task', { dueDate: new Date() });
        
        todoList.updateTaskDueDate(task.id, null);
        
        expect(task.dueDate).toBeNull();
      });
    });

    describe('Edge Cases', () => {
      test('should handle tasks without due dates in sorting', () => {
        const taskWithDate = todoList.addTask('Has date', { dueDate: new Date('2024-06-15') });
        const taskWithoutDate = todoList.addTask('No date');
        
        const sortedTasks = todoList.getTasksByDueDate();
        
        expect(sortedTasks[0]).toBe(taskWithDate);
        expect(sortedTasks[1]).toBe(taskWithoutDate);
      });

      test('should handle past due dates', () => {
        const pastDate = new Date('2020-01-01');
        const task = todoList.addTask('Overdue task', { dueDate: pastDate });
        
        expect(task.dueDate).toEqual(pastDate);
        expect(todoList.isTaskOverdue(task.id)).toBe(true);
      });

      test('should handle future due dates', () => {
        const futureDate = new Date('2030-01-01');
        const task = todoList.addTask('Future task', { dueDate: futureDate });
        
        expect(task.dueDate).toEqual(futureDate);
        expect(todoList.isTaskOverdue(task.id)).toBe(false);
      });
    });

    describe('Error Handling', () => {
      test('should throw error when updating due date of non-existent task', () => {
        expect(() => todoList.updateTaskDueDate('invalid-id', new Date()))
          .toThrow('Task not found');
      });

      test('should throw error for invalid date', () => {
        const task = todoList.addTask('Test task');
        
        expect(() => todoList.updateTaskDueDate(task.id, new Date('invalid-date')))
          .toThrow('Invalid date');
      });
    });
  });

  describe('Organization Features - Categories', () => {
    // User Story: As a user, I want to categorize tasks by project or area so that I can organize my work and personal responsibilities.
    
    describe('Happy Path', () => {
      test('should add task with category', () => {
        const task = todoList.addTask('Work task', { category: 'Work' });
        
        expect(task.category).toBe('Work');
      });

      test('should update task category', () => {
        const task = todoList.addTask('Uncategorized task');
        
        todoList.updateTaskCategory(task.id, 'Personal');
        
        expect(task.category).toBe('Personal');
      });

      test('should get tasks by category', () => {
        todoList.addTask('Work task 1', { category: 'Work' });
        todoList.addTask('Personal task', { category: 'Personal' });
        todoList.addTask('Work task 2', { category: 'Work' });
        
        const workTasks = todoList.getTasksByCategory('Work');
        
        expect(workTasks).toHaveLength(2);
        expect(workTasks.every(t => t.category === 'Work')).toBe(true);
      });

      test('should get all categories', () => {
        todoList.addTask('Work task', { category: 'Work' });
        todoList.addTask('Personal task', { category: 'Personal' });
        todoList.addTask('Shopping task', { category: 'Shopping' });
        
        const categories = todoList.getCategories();
        
        expect(categories).toContain('Work');
        expect(categories).toContain('Personal');
        expect(categories).toContain('Shopping');
        expect(categories).toHaveLength(3);
      });
    });

    describe('Edge Cases', () => {
      test('should handle tasks without categories', () => {
        const task = todoList.addTask('No category task');
        
        expect(task.category).toBeNull();
      });

      test('should handle empty category string', () => {
        const task = todoList.addTask('Empty category', { category: '' });
        
        expect(task.category).toBeNull();
      });

      test('should handle case-sensitive categories', () => {
        todoList.addTask('Task 1', { category: 'Work' });
        todoList.addTask('Task 2', { category: 'work' });
        
        const categories = todoList.getCategories();
        
        expect(categories).toContain('Work');
        expect(categories).toContain('work');
        expect(categories).toHaveLength(2);
      });
    });

    describe('Error Handling', () => {
      test('should throw error when updating category of non-existent task', () => {
        expect(() => todoList.updateTaskCategory('invalid-id', 'Work'))
          .toThrow('Task not found');
      });

      test('should return empty array for non-existent category', () => {
        const tasks = todoList.getTasksByCategory('NonExistent');
        
        expect(tasks).toEqual([]);
      });
    });
  });

  describe('Productivity Features - Filtering', () => {
    // User Story: As a user, I want to see only incomplete tasks so that I can focus on what still needs to be done.
    // User Story: As a user, I want to see my completed tasks so that I can review what I've accomplished.
    
    describe('Happy Path', () => {
      test('should get only incomplete tasks', () => {
        const incompleteTask = todoList.addTask('Not done yet');
        const completeTask = todoList.addTask('Already done');
        todoList.completeTask(completeTask.id);
        
        const incompleteTasks = todoList.getIncompleteTasks();
        
        expect(incompleteTasks).toHaveLength(1);
        expect(incompleteTasks[0]).toBe(incompleteTask);
      });

      test('should get only completed tasks', () => {
        const incompleteTask = todoList.addTask('Not done yet');
        const completeTask = todoList.addTask('Already done');
        todoList.completeTask(completeTask.id);
        
        const completedTasks = todoList.getCompletedTasks();
        
        expect(completedTasks).toHaveLength(1);
        expect(completedTasks[0]).toBe(completeTask);
      });

      test('should return empty arrays when no tasks match filter', () => {
        expect(todoList.getIncompleteTasks()).toEqual([]);
        expect(todoList.getCompletedTasks()).toEqual([]);
      });
    });

    describe('Edge Cases', () => {
      test('should handle all tasks being completed', () => {
        const task1 = todoList.addTask('Task 1');
        const task2 = todoList.addTask('Task 2');
        todoList.completeTask(task1.id);
        todoList.completeTask(task2.id);
        
        expect(todoList.getIncompleteTasks()).toEqual([]);
        expect(todoList.getCompletedTasks()).toHaveLength(2);
      });

      test('should handle all tasks being incomplete', () => {
        todoList.addTask('Task 1');
        todoList.addTask('Task 2');
        
        expect(todoList.getIncompleteTasks()).toHaveLength(2);
        expect(todoList.getCompletedTasks()).toEqual([]);
      });
    });
  });

  describe('Productivity Features - Search', () => {
    // User Story: As a user, I want to search through my tasks so that I can quickly find specific items in a long list.
    //
    // This user story addresses the scalability problem that occurs when users have many tasks.
    // As task lists grow, it becomes difficult to manually scan through all tasks to find a specific one.
    // Search functionality allows users to quickly locate tasks by typing keywords, making the system
    // usable even with hundreds of tasks.
    
    describe('Happy Path', () => {
      test('should find tasks by title search', () => {
        // Test Setup: This test verifies that users can search through their tasks to find specific items
        // This is crucial for the user story because it enables quick task location in large lists
        
        // Data Setup: Create multiple tasks where some share common keywords
        // This simulates a realistic scenario where a user has accumulated many tasks
        const groceryTask = 'Buy groceries';
        const bookPurchaseTask = 'Buy books';
        const readingTask = 'Read books';
        
        todoList.addTask(groceryTask);
        todoList.addTask(bookPurchaseTask);
        todoList.addTask(readingTask);
        
        // Action: Search for tasks containing a specific keyword
        // This simulates a user typing a search term to find related tasks
        const searchTerm = 'buy';
        const results = todoList.searchTasks(searchTerm);
        
        // Expected Values: Define what we expect from the search
        const expectedResultCount = 2; // Should find 'Buy groceries' and 'Buy books'
        const expectedMatchCondition = true; // All results should contain the search term
        
        // Verification: Test that the user story requirement is met
        // "I want to search through my tasks" - verify search returns matching tasks
        expect(results).toHaveLength(expectedResultCount);
        
        // "so that I can quickly find specific items" - verify all results contain search term
        expect(results.every(t => t.title.toLowerCase().includes(searchTerm))).toBe(expectedMatchCondition);
        
        // Additional verification: ensure the correct specific tasks were found
        const resultTitles = results.map(t => t.title);
        expect(resultTitles).toContain(groceryTask);
        expect(resultTitles).toContain(bookPurchaseTask);
        expect(resultTitles).not.toContain(readingTask); // Should not match 'Read books'
      });

      test('should perform case-insensitive search', () => {
        todoList.addTask('Important Meeting');
        
        const results = todoList.searchTasks('important');
        
        expect(results).toHaveLength(1);
        expect(results[0].title).toBe('Important Meeting');
      });

      test('should search in task categories', () => {
        todoList.addTask('Task 1', { category: 'Work' });
        todoList.addTask('Task 2', { category: 'Personal' });
        
        const results = todoList.searchTasks('work');
        
        expect(results).toHaveLength(1);
        expect(results[0].category).toBe('Work');
      });
    });

    describe('Edge Cases', () => {
      test('should return empty array for no matches', () => {
        todoList.addTask('Task 1');
        todoList.addTask('Task 2');
        
        const results = todoList.searchTasks('nonexistent');
        
        expect(results).toEqual([]);
      });

      test('should handle empty search term', () => {
        todoList.addTask('Task 1');
        todoList.addTask('Task 2');
        
        const results = todoList.searchTasks('');
        
        expect(results).toHaveLength(2); // Should return all tasks
      });

      test('should handle special characters in search', () => {
        todoList.addTask('Task with @#$ symbols');
        
        const results = todoList.searchTasks('@#$');
        
        expect(results).toHaveLength(1);
      });
    });

    describe('Error Handling', () => {
      test('should handle null search term', () => {
        todoList.addTask('Task 1');
        
        expect(() => todoList.searchTasks(null as any)).toThrow('Search term cannot be null or undefined');
      });

      test('should handle undefined search term', () => {
        todoList.addTask('Task 1');
        
        expect(() => todoList.searchTasks(undefined as any)).toThrow('Search term cannot be null or undefined');
      });
    });
  });

  describe('Data Persistence', () => {
    // User Story: As a user, I want my tasks to be saved automatically so that I don't lose my data when I close the application.
    // User Story: As a user, I want my tasks to be available when I restart the application so that I can continue where I left off.
    
    describe('Happy Path', () => {
      test('should serialize todo list to JSON', () => {
        todoList.addTask('Task 1', { priority: Priority.HIGH });
        todoList.addTask('Task 2', { category: 'Work' });
        
        const json = todoList.toJSON();
        
        expect(json).toBeDefined();
        expect(typeof json).toBe('string');
      });

      test('should deserialize todo list from JSON', () => {
        todoList.addTask('Task 1', { priority: Priority.HIGH });
        const task2 = todoList.addTask('Task 2', { category: 'Work' });
        todoList.completeTask(task2.id);
        
        const json = todoList.toJSON();
        const newTodoList = TodoList.fromJSON(json);
        
        expect(newTodoList.getTasks()).toHaveLength(2);
        expect(newTodoList.getTasks()[0].title).toBe('Task 1');
        expect(newTodoList.getTasks()[0].priority).toBe(Priority.HIGH);
        expect(newTodoList.getTasks()[1].title).toBe('Task 2');
        expect(newTodoList.getTasks()[1].category).toBe('Work');
        expect(newTodoList.getTasks()[1].completed).toBe(true);
      });

      test('should maintain task relationships after serialization', () => {
        const task = todoList.addTask('Test task', { 
          priority: Priority.HIGH, 
          category: 'Work',
          dueDate: new Date('2024-12-31')
        });
        todoList.completeTask(task.id);
        
        const json = todoList.toJSON();
        const newTodoList = TodoList.fromJSON(json);
        const restoredTask = newTodoList.getTasks()[0];
        
        expect(restoredTask.id).toBe(task.id);
        expect(restoredTask.completed).toBe(true);
        expect(restoredTask.priority).toBe(Priority.HIGH);
        expect(restoredTask.category).toBe('Work');
        expect(restoredTask.dueDate).toEqual(new Date('2024-12-31'));
      });
    });

    describe('Edge Cases', () => {
      test('should handle empty todo list serialization', () => {
        const json = todoList.toJSON();
        const newTodoList = TodoList.fromJSON(json);
        
        expect(newTodoList.getTasks()).toEqual([]);
      });

      test('should handle large todo lists', () => {
        for (let i = 0; i < 100; i++) {
          todoList.addTask(`Task ${i}`, { 
            priority: i % 3 === 0 ? Priority.HIGH : Priority.MEDIUM,
            category: i % 2 === 0 ? 'Work' : 'Personal'
          });
        }
        
        const json = todoList.toJSON();
        const newTodoList = TodoList.fromJSON(json);
        
        expect(newTodoList.getTasks()).toHaveLength(100);
      });
    });

    describe('Error Handling', () => {
      test('should throw error for invalid JSON', () => {
        expect(() => TodoList.fromJSON('invalid json')).toThrow('Invalid JSON format');
      });

      test('should throw error for null JSON', () => {
        expect(() => TodoList.fromJSON(null as any)).toThrow('JSON string cannot be null or undefined');
      });

      test('should throw error for malformed todo data', () => {
        const invalidJson = JSON.stringify({ tasks: [{ invalidField: 'value' }] });
        
        expect(() => TodoList.fromJSON(invalidJson)).toThrow('Invalid todo data format');
      });
    });
  });
});
