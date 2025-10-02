import { ID, Result, success, failure } from '../../core/types.js';
import { 
  Task, 
  CreateTaskInput, 
  UpdateTaskInput, 
  SearchQuery, 
  TaskListItem 
} from '../entities.js';
import { TaskRepository } from '../repository.js';
import { IndexStore } from './IndexStore.js';
import { 
  validateTaskInput, 
  createTask, 
  updateTask 
} from '../validation.js';

/**
 * Task service implementation
 */
export class TaskService implements TaskRepository {
  constructor(private store: IndexStore) {}

  /**
   * Get all tasks
   */
  all(): Task[] {
    return this.store.getAllTasks();
  }

  /**
   * Get task by ID
   */
  byId(id: ID): Task | undefined {
    return this.store.getTask(id);
  }

  /**
   * Create a new task
   */
  create(input: CreateTaskInput): Result<Task> {
    // Validate input
    const errors = validateTaskInput(input);
    if (errors.length > 0) {
      return failure(new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`));
    }

    // Create task
    const task = createTask(input);
    
    // Add to store
    this.store.addTask(task);
    
    return success(task);
  }

  /**
   * Update an existing task
   */
  update(input: UpdateTaskInput): Result<Task> {
    // Check if task exists
    const existingTask = this.store.getTask(input.id);
    if (!existingTask) {
      return failure(new Error(`Task with ID ${input.id} not found`));
    }

    // Validate input
    const errors = validateTaskInput(input);
    if (errors.length > 0) {
      return failure(new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`));
    }

    // Update task
    const updatedTask = updateTask(existingTask, input);
    
    // Update in store
    this.store.updateTask(updatedTask);
    
    return success(updatedTask);
  }

  /**
   * Delete a task
   */
  remove(id: ID): Result<void> {
    // Check if task exists
    const task = this.store.getTask(id);
    if (!task) {
      return failure(new Error(`Task with ID ${id} not found`));
    }

    // Remove from store
    this.store.removeTask(id);
    
    return success(undefined);
  }

  /**
   * Search tasks with query
   */
  search(query: SearchQuery): TaskListItem[] {
    return this.store.searchTasks(query);
  }

  /**
   * Get tasks by project
   */
  byProject(projectId: ID): Task[] {
    return this.store.getTasksByProject(projectId);
  }

  /**
   * Get tasks by tag
   */
  byTag(tagId: ID): Task[] {
    return this.store.getTasksByTag(tagId);
  }

  /**
   * Get tasks by status
   */
  byStatus(status: string): Task[] {
    return this.store.getTasksByStatus(status as any);
  }

  /**
   * Get overdue tasks
   */
  overdue(): Task[] {
    return this.store.getOverdueTasks();
  }

  /**
   * Toggle task completion status
   */
  toggleComplete(id: ID): Result<Task> {
    const task = this.store.getTask(id);
    if (!task) {
      return failure(new Error(`Task with ID ${id} not found`));
    }

    const newStatus = task.status === 'done' ? 'todo' : 'done';
    return this.update({ id, status: newStatus });
  }

  /**
   * Move task to different project
   */
  moveToProject(id: ID, projectId: ID | undefined): Result<Task> {
    return this.update({ id, projectId });
  }

  /**
   * Add tag to task
   */
  addTag(id: ID, tagId: ID): Result<Task> {
    const task = this.store.getTask(id);
    if (!task) {
      return failure(new Error(`Task with ID ${id} not found`));
    }

    if (task.tags.includes(tagId)) {
      return success(task); // Tag already exists
    }

    const updatedTags = [...task.tags, tagId];
    return this.update({ id, tags: updatedTags });
  }

  /**
   * Remove tag from task
   */
  removeTag(id: ID, tagId: ID): Result<Task> {
    const task = this.store.getTask(id);
    if (!task) {
      return failure(new Error(`Task with ID ${id} not found`));
    }

    const updatedTags = task.tags.filter(t => t !== tagId);
    return this.update({ id, tags: updatedTags });
  }

  /**
   * Set task priority
   */
  setPriority(id: ID, priority: number): Result<Task> {
    if (priority < 1 || priority > 5) {
      return failure(new Error('Priority must be between 1 and 5'));
    }

    return this.update({ id, priority: priority as any });
  }

  /**
   * Set task due date
   */
  setDueDate(id: ID, dueAt: string | undefined): Result<Task> {
    return this.update({ id, dueAt });
  }

  /**
   * Archive completed tasks
   */
  archiveCompleted(): Result<number> {
    const completedTasks = this.byStatus('done');
    let archivedCount = 0;

    for (const task of completedTasks) {
      const result = this.update({ id: task.id, status: 'archived' });
      if (result.success) {
        archivedCount++;
      }
    }

    return success(archivedCount);
  }
}
