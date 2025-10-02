import { ID, Result } from '../core/types.js';
import { 
  Task, 
  Project, 
  Tag, 
  CreateTaskInput, 
  UpdateTaskInput,
  CreateProjectInput,
  UpdateProjectInput,
  CreateTagInput,
  UpdateTagInput,
  SearchQuery,
  TaskListItem,
  DataStore
} from './entities.js';

/**
 * Task repository interface
 */
export interface TaskRepository {
  /**
   * Get all tasks
   */
  all(): Task[];

  /**
   * Get task by ID
   */
  byId(id: ID): Task | undefined;

  /**
   * Create a new task
   */
  create(input: CreateTaskInput): Result<Task>;

  /**
   * Update an existing task
   */
  update(input: UpdateTaskInput): Result<Task>;

  /**
   * Delete a task
   */
  remove(id: ID): Result<void>;

  /**
   * Search tasks with query
   */
  search(query: SearchQuery): TaskListItem[];

  /**
   * Get tasks by project
   */
  byProject(projectId: ID): Task[];

  /**
   * Get tasks by tag
   */
  byTag(tagId: ID): Task[];

  /**
   * Get tasks by status
   */
  byStatus(status: string): Task[];

  /**
   * Get overdue tasks
   */
  overdue(): Task[];
}

/**
 * Project repository interface
 */
export interface ProjectRepository {
  /**
   * Get all projects
   */
  all(): Project[];

  /**
   * Get project by ID
   */
  byId(id: ID): Project | undefined;

  /**
   * Create a new project
   */
  create(input: CreateProjectInput): Result<Project>;

  /**
   * Update an existing project
   */
  update(input: UpdateProjectInput): Result<Project>;

  /**
   * Delete a project
   */
  remove(id: ID): Result<void>;

  /**
   * Get root projects (no parent)
   */
  roots(): Project[];

  /**
   * Get child projects
   */
  children(parentId: ID): Project[];

  /**
   * Get project hierarchy
   */
  hierarchy(): Project[];
}

/**
 * Tag repository interface
 */
export interface TagRepository {
  /**
   * Get all tags
   */
  all(): Tag[];

  /**
   * Get tag by ID
   */
  byId(id: ID): Tag | undefined;

  /**
   * Get tag by name
   */
  byName(name: string): Tag | undefined;

  /**
   * Create a new tag
   */
  create(input: CreateTagInput): Result<Tag>;

  /**
   * Update an existing tag
   */
  update(input: UpdateTagInput): Result<Tag>;

  /**
   * Delete a tag
   */
  remove(id: ID): Result<void>;

  /**
   * Get or create tag by name
   */
  getOrCreate(name: string, color?: string): Result<Tag>;
}

/**
 * Storage interface for persistence
 */
export interface Storage {
  /**
   * Load data from storage
   */
  load(): Promise<Result<DataStore>>;

  /**
   * Save data to storage
   */
  save(data: DataStore): Promise<Result<void>>;

  /**
   * Check if storage exists
   */
  exists(): Promise<boolean>;

  /**
   * Create backup
   */
  backup(): Promise<Result<string>>;

  /**
   * Restore from backup
   */
  restore(backupPath: string): Promise<Result<void>>;
}

/**
 * Main data repository that aggregates all entities
 */
export interface DataRepository {
  tasks: TaskRepository;
  projects: ProjectRepository;
  tags: TagRepository;
  storage: Storage;

  /**
   * Initialize repository with data
   */
  initialize(): Promise<Result<void>>;

  /**
   * Save all data
   */
  save(): Promise<Result<void>>;

  /**
   * Get complete data store
   */
  getDataStore(): DataStore;

  /**
   * Set complete data store
   */
  setDataStore(data: DataStore): void;
}
