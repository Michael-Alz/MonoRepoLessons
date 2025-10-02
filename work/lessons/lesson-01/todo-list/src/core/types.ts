/**
 * Core type definitions and utilities
 */

export type ID = string; // UUID v4
export type Timestamp = string; // ISO 8601 string

/**
 * Task status enumeration
 */
export type Status = 'todo' | 'doing' | 'done' | 'archived';

/**
 * Task priority (1 = highest priority)
 */
export type Priority = 1 | 2 | 3 | 4 | 5;

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sortable fields
 */
export type SortField = 'dueAt' | 'priority' | 'updatedAt' | 'createdAt' | 'title';

/**
 * Panel types for focus management
 */
export type PanelType = 'sidebar' | 'list' | 'detail' | 'inspector' | 'log' | 'command';

/**
 * Utility type for making all properties optional except ID
 */
export type PartialExceptId<T extends { id: ID }> = Partial<Omit<T, 'id'>> & Pick<T, 'id'>;

/**
 * Utility type for creating new entities (without ID)
 */
export type CreateInput<T extends { id: ID }> = Omit<T, 'id'>;

/**
 * Validation error type
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Create a success result
 */
export function success<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/**
 * Create an error result
 */
export function failure<E>(error: E): Result<never, E> {
  return { success: false, error };
}

/**
 * Check if a result is successful
 */
export function isSuccess<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success;
}

/**
 * Check if a result is a failure
 */
export function isFailure<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return !result.success;
}
