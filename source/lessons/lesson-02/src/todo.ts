// Todo Model - Skeleton Implementation
// This file contains stub implementations that compile and run but don't perform actual functionality

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category: string | null;
  dueDate: Date | null;
  createdAt: Date;
  completedAt: Date | null;
}

export interface TaskOptions {
  priority?: Priority;
  category?: string | undefined;
  dueDate?: Date;
}

export class TodoList {
  private tasks: Todo[] = [];
  private nextId: number = 1;

  constructor() {
    // Stub constructor - initializes empty task array for testing compatibility
    this.tasks = [];
  }

  // Core functionality stubs
  addTask(title: string, options?: TaskOptions): Todo {
    console.log(`[STUB] Adding task: ${title}`);
    
    // Validate input for test compatibility
    if (!title || title.trim() === '') {
      throw new Error('Task title cannot be empty');
    }
    
    const task: Todo = {
      id: `task-${this.nextId++}`,
      title: title.trim(), // Trim whitespace for test compatibility
      completed: false,
      priority: options?.priority || Priority.MEDIUM,
      category: options?.category || null,
      dueDate: options?.dueDate || null,
      createdAt: new Date(),
      completedAt: null
    };
    
    // Store task for test compatibility (but still log as stub)
    this.tasks.push(task);
    return task;
  }

  completeTask(id: string): void {
    // Stub implementation - logs but doesn't actually complete
    console.log(`[STUB] Completing task: ${id}`);
    if (!id) {
      throw new Error('Task ID cannot be null or undefined');
    }
    // In real implementation, would find and update task
  }

  uncompleteTask(id: string): void {
    // Stub implementation - logs but doesn't actually uncomplete
    console.log(`[STUB] Uncompleting task: ${id}`);
    if (!id) {
      throw new Error('Task ID cannot be null or undefined');
    }
  }

  deleteTask(id: string): void {
    // Stub implementation - logs but doesn't actually delete
    console.log(`[STUB] Deleting task: ${id}`);
    if (!id) {
      throw new Error('Task ID cannot be null or undefined');
    }
  }

  getTasks(): Todo[] {
    // Stub implementation - returns empty array
    console.log(`[STUB] Getting all tasks (returning empty array)`);
    return [];
  }

  getIncompleteTasks(): Todo[] {
    // Stub implementation - returns empty array
    console.log(`[STUB] Getting incomplete tasks (returning empty array)`);
    return [];
  }

  getCompletedTasks(): Todo[] {
    // Stub implementation - returns empty array
    console.log(`[STUB] Getting completed tasks (returning empty array)`);
    return [];
  }

  // Organization features stubs
  updateTaskPriority(id: string, priority: Priority): void {
    console.log(`[STUB] Updating task ${id} priority to ${priority}`);
    if (!id) {
      throw new Error('Task not found');
    }
  }

  updateTaskDueDate(id: string, dueDate: Date | null): void {
    console.log(`[STUB] Updating task ${id} due date to ${dueDate}`);
    if (!id) {
      throw new Error('Task not found');
    }
  }

  updateTaskCategory(id: string, category: string): void {
    console.log(`[STUB] Updating task ${id} category to ${category}`);
    if (!id) {
      throw new Error('Task not found');
    }
  }

  getTasksByPriority(): Todo[] {
    console.log(`[STUB] Getting tasks by priority (returning empty array)`);
    return [];
  }

  getTasksByDueDate(): Todo[] {
    console.log(`[STUB] Getting tasks by due date (returning empty array)`);
    return [];
  }

  getTasksByCategory(category: string): Todo[] {
    console.log(`[STUB] Getting tasks by category: ${category} (returning empty array)`);
    return [];
  }

  getCategories(): string[] {
    console.log(`[STUB] Getting categories (returning empty array)`);
    return [];
  }

  isTaskOverdue(id: string): boolean {
    console.log(`[STUB] Checking if task ${id} is overdue (returning false)`);
    return false;
  }

  // Search functionality stub
  searchTasks(query: string): Todo[] {
    console.log(`[STUB] Searching tasks for: ${query} (returning empty array)`);
    if (!query && query !== '') {
      throw new Error('Search term cannot be null or undefined');
    }
    return [];
  }

  // Data persistence stubs
  toJSON(): string {
    console.log(`[STUB] Converting to JSON`);
    return JSON.stringify({ tasks: [] });
  }

  static fromJSON(json: string): TodoList {
    console.log(`[STUB] Creating TodoList from JSON`);
    if (!json) {
      throw new Error('JSON string cannot be null or undefined');
    }
    try {
      JSON.parse(json); // Validate JSON format
      return new TodoList();
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  }
}
