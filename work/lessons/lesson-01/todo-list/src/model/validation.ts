import { v4 as uuidv4 } from 'uuid';
import { ID, Timestamp, Status, Priority, ValidationError } from '../core/types.js';
import { 
  Task, 
  Project, 
  Tag, 
  CreateTaskInput, 
  UpdateTaskInput,
  CreateProjectInput,
  UpdateProjectInput,
  CreateTagInput,
  UpdateTagInput
} from './entities.js';

/**
 * Validation utilities
 */

/**
 * Generate a new UUID
 */
export function generateId(): ID {
  return uuidv4();
}

/**
 * Get current timestamp
 */
export function getCurrentTimestamp(): Timestamp {
  return new Date().toISOString();
}

/**
 * Validate task input
 */
export function validateTaskInput(input: CreateTaskInput | UpdateTaskInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if ('title' in input && (!input.title || input.title.trim().length === 0)) {
    errors.push({
      field: 'title',
      message: 'Title is required',
      value: input.title
    });
  }

  if ('title' in input && input.title && input.title.length > 200) {
    errors.push({
      field: 'title',
      message: 'Title must be 200 characters or less',
      value: input.title
    });
  }

  if ('priority' in input && input.priority !== undefined) {
    if (![1, 2, 3, 4, 5].includes(input.priority)) {
      errors.push({
        field: 'priority',
        message: 'Priority must be between 1 and 5',
        value: input.priority
      });
    }
  }

  if ('status' in input && input.status !== undefined) {
    if (!['todo', 'doing', 'done', 'archived'].includes(input.status)) {
      errors.push({
        field: 'status',
        message: 'Status must be one of: todo, doing, done, archived',
        value: input.status
      });
    }
  }

  if ('dueAt' in input && input.dueAt !== undefined) {
    if (!isValidTimestamp(input.dueAt)) {
      errors.push({
        field: 'dueAt',
        message: 'Due date must be a valid ISO timestamp',
        value: input.dueAt
      });
    }
  }

  if ('tags' in input && input.tags !== undefined) {
    if (!Array.isArray(input.tags)) {
      errors.push({
        field: 'tags',
        message: 'Tags must be an array',
        value: input.tags
      });
    } else if (input.tags.some(tag => typeof tag !== 'string' || !isValidUuid(tag))) {
      errors.push({
        field: 'tags',
        message: 'All tags must be valid UUIDs',
        value: input.tags
      });
    }
  }

  return errors;
}

/**
 * Validate project input
 */
export function validateProjectInput(input: CreateProjectInput | UpdateProjectInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if ('name' in input && (!input.name || input.name.trim().length === 0)) {
    errors.push({
      field: 'name',
      message: 'Name is required',
      value: input.name
    });
  }

  if ('name' in input && input.name && input.name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Name must be 100 characters or less',
      value: input.name
    });
  }

  if ('order' in input && input.order !== undefined) {
    if (typeof input.order !== 'number' || input.order < 0) {
      errors.push({
        field: 'order',
        message: 'Order must be a non-negative number',
        value: input.order
      });
    }
  }

  return errors;
}

/**
 * Validate tag input
 */
export function validateTagInput(input: CreateTagInput | UpdateTagInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if ('name' in input && (!input.name || input.name.trim().length === 0)) {
    errors.push({
      field: 'name',
      message: 'Name is required',
      value: input.name
    });
  }

  if ('name' in input && input.name && input.name.length > 50) {
    errors.push({
      field: 'name',
      message: 'Name must be 50 characters or less',
      value: input.name
    });
  }

  if ('color' in input && input.color !== undefined) {
    if (input.color && !isValidColor(input.color)) {
      errors.push({
        field: 'color',
        message: 'Color must be a valid hex color or blessed color name',
        value: input.color
      });
    }
  }

  return errors;
}

/**
 * Create a new task with defaults
 */
export function createTask(input: CreateTaskInput): Task {
  const now = getCurrentTimestamp();
  
  return {
    id: generateId(),
    title: input.title,
    notes: input.notes,
    status: input.status ?? 'todo',
    priority: input.priority ?? 3,
    projectId: input.projectId,
    tags: input.tags ?? [],
    createdAt: now,
    updatedAt: now,
    dueAt: input.dueAt,
    completedAt: input.status === 'done' ? now : undefined
  };
}

/**
 * Create a new project with defaults
 */
export function createProject(input: CreateProjectInput): Project {
  const now = getCurrentTimestamp();
  
  return {
    id: generateId(),
    name: input.name,
    order: input.order ?? 0,
    parentId: input.parentId,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Create a new tag with defaults
 */
export function createTag(input: CreateTagInput): Tag {
  const now = getCurrentTimestamp();
  
  return {
    id: generateId(),
    name: input.name,
    color: input.color,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Update a task with new values
 */
export function updateTask(task: Task, input: UpdateTaskInput): Task {
  const now = getCurrentTimestamp();
  const updated = { ...task };
  
  if (input.title !== undefined) updated.title = input.title;
  if (input.notes !== undefined) updated.notes = input.notes;
  if (input.status !== undefined) {
    updated.status = input.status;
    updated.completedAt = input.status === 'done' ? now : undefined;
  }
  if (input.priority !== undefined) updated.priority = input.priority;
  if (input.projectId !== undefined) updated.projectId = input.projectId;
  if (input.tags !== undefined) updated.tags = input.tags;
  if (input.dueAt !== undefined) updated.dueAt = input.dueAt;
  
  updated.updatedAt = now;
  
  return updated;
}

/**
 * Update a project with new values
 */
export function updateProject(project: Project, input: UpdateProjectInput): Project {
  const now = getCurrentTimestamp();
  const updated = { ...project };
  
  if (input.name !== undefined) updated.name = input.name;
  if (input.order !== undefined) updated.order = input.order;
  if (input.parentId !== undefined) updated.parentId = input.parentId;
  
  updated.updatedAt = now;
  
  return updated;
}

/**
 * Update a tag with new values
 */
export function updateTag(tag: Tag, input: UpdateTagInput): Tag {
  const now = getCurrentTimestamp();
  const updated = { ...tag };
  
  if (input.name !== undefined) updated.name = input.name;
  if (input.color !== undefined) updated.color = input.color;
  
  updated.updatedAt = now;
  
  return updated;
}

/**
 * Utility functions
 */

function isValidTimestamp(timestamp: string): boolean {
  const date = new Date(timestamp);
  return !isNaN(date.getTime()) && date.toISOString() === timestamp;
}

function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

function isValidColor(color: string): boolean {
  // Check for hex color
  if (/^#[0-9a-f]{6}$/i.test(color)) return true;
  
  // Check for blessed color names
  const blessedColors = [
    'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white',
    'lightblack', 'lightred', 'lightgreen', 'lightyellow', 'lightblue', 
    'lightmagenta', 'lightcyan', 'lightwhite'
  ];
  
  return blessedColors.includes(color.toLowerCase());
}
