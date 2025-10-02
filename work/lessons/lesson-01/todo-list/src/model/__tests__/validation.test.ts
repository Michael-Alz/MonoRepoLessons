import { describe, it, expect } from 'vitest';
import { 
  validateTaskInput, 
  validateProjectInput, 
  validateTagInput,
  createTask,
  createProject,
  createTag,
  updateTask,
  updateProject,
  updateTag
} from '../validation.js';
import { CreateTaskInput, CreateProjectInput, CreateTagInput } from '../entities.js';

describe('Validation', () => {
  describe('validateTaskInput', () => {
    it('should validate valid task input', () => {
      const input: CreateTaskInput = {
        title: 'Test Task',
        notes: 'Test notes',
        priority: 2,
        status: 'todo'
      };

      const errors = validateTaskInput(input);
      expect(errors).toHaveLength(0);
    });

    it('should reject empty title', () => {
      const input: CreateTaskInput = {
        title: '',
        priority: 2
      };

      const errors = validateTaskInput(input);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('title');
      expect(errors[0].message).toBe('Title is required');
    });

    it('should reject invalid priority', () => {
      const input: CreateTaskInput = {
        title: 'Test Task',
        priority: 6 as any
      };

      const errors = validateTaskInput(input);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('priority');
      expect(errors[0].message).toBe('Priority must be between 1 and 5');
    });

    it('should reject invalid status', () => {
      const input: CreateTaskInput = {
        title: 'Test Task',
        status: 'invalid' as any
      };

      const errors = validateTaskInput(input);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('status');
      expect(errors[0].message).toBe('Status must be one of: todo, doing, done, archived');
    });

    it('should reject title that is too long', () => {
      const input: CreateTaskInput = {
        title: 'a'.repeat(201),
        priority: 2
      };

      const errors = validateTaskInput(input);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('title');
      expect(errors[0].message).toBe('Title must be 200 characters or less');
    });
  });

  describe('validateProjectInput', () => {
    it('should validate valid project input', () => {
      const input: CreateProjectInput = {
        name: 'Test Project',
        order: 1
      };

      const errors = validateProjectInput(input);
      expect(errors).toHaveLength(0);
    });

    it('should reject empty name', () => {
      const input: CreateProjectInput = {
        name: '',
        order: 1
      };

      const errors = validateProjectInput(input);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('name');
      expect(errors[0].message).toBe('Name is required');
    });

    it('should reject negative order', () => {
      const input: CreateProjectInput = {
        name: 'Test Project',
        order: -1
      };

      const errors = validateProjectInput(input);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('order');
      expect(errors[0].message).toBe('Order must be a non-negative number');
    });
  });

  describe('validateTagInput', () => {
    it('should validate valid tag input', () => {
      const input: CreateTagInput = {
        name: 'urgent',
        color: 'red'
      };

      const errors = validateTagInput(input);
      expect(errors).toHaveLength(0);
    });

    it('should reject empty name', () => {
      const input: CreateTagInput = {
        name: '',
        color: 'red'
      };

      const errors = validateTagInput(input);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('name');
      expect(errors[0].message).toBe('Name is required');
    });

    it('should reject name that is too long', () => {
      const input: CreateTagInput = {
        name: 'a'.repeat(51),
        color: 'red'
      };

      const errors = validateTagInput(input);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('name');
      expect(errors[0].message).toBe('Name must be 50 characters or less');
    });
  });

  describe('createTask', () => {
    it('should create task with defaults', () => {
      const input: CreateTaskInput = {
        title: 'Test Task'
      };

      const task = createTask(input);

      expect(task.title).toBe('Test Task');
      expect(task.status).toBe('todo');
      expect(task.priority).toBe(3);
      expect(task.tags).toEqual([]);
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    it('should create completed task with completedAt timestamp', () => {
      const input: CreateTaskInput = {
        title: 'Test Task',
        status: 'done'
      };

      const task = createTask(input);

      expect(task.status).toBe('done');
      expect(task.completedAt).toBeDefined();
    });
  });

  describe('createProject', () => {
    it('should create project with defaults', () => {
      const input: CreateProjectInput = {
        name: 'Test Project'
      };

      const project = createProject(input);

      expect(project.name).toBe('Test Project');
      expect(project.order).toBe(0);
      expect(project.id).toBeDefined();
      expect(project.createdAt).toBeDefined();
      expect(project.updatedAt).toBeDefined();
    });
  });

  describe('createTag', () => {
    it('should create tag with defaults', () => {
      const input: CreateTagInput = {
        name: 'urgent'
      };

      const tag = createTag(input);

      expect(tag.name).toBe('urgent');
      expect(tag.id).toBeDefined();
      expect(tag.createdAt).toBeDefined();
      expect(tag.updatedAt).toBeDefined();
    });
  });

  describe('updateTask', () => {
    it('should update task fields', () => {
      const task = createTask({ title: 'Original Title' });
      const updated = updateTask(task, { 
        id: task.id, 
        title: 'Updated Title',
        status: 'done'
      });

      expect(updated.title).toBe('Updated Title');
      expect(updated.status).toBe('done');
      expect(updated.completedAt).toBeDefined();
      expect(updated.updatedAt).toBeDefined();
      // Note: updatedAt might be the same if created in same millisecond
    });
  });

  describe('updateProject', () => {
    it('should update project fields', () => {
      const project = createProject({ name: 'Original Name' });
      const updated = updateProject(project, { 
        id: project.id, 
        name: 'Updated Name',
        order: 5
      });

      expect(updated.name).toBe('Updated Name');
      expect(updated.order).toBe(5);
      expect(updated.updatedAt).toBeDefined();
      // Note: updatedAt might be the same if created in same millisecond
    });
  });

  describe('updateTag', () => {
    it('should update tag fields', () => {
      const tag = createTag({ name: 'original' });
      const updated = updateTag(tag, { 
        id: tag.id, 
        name: 'updated',
        color: 'blue'
      });

      expect(updated.name).toBe('updated');
      expect(updated.color).toBe('blue');
      expect(updated.updatedAt).toBeDefined();
      // Note: updatedAt might be the same if created in same millisecond
    });
  });
});
