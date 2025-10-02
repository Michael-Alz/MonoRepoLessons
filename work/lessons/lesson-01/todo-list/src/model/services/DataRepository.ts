import { ID, Result, success, failure } from '../../core/types.js';
import { 
  DataStore, 
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
  TaskListItem
} from '../entities.js';
import { DataRepository as IDataRepository, TaskRepository, ProjectRepository, TagRepository, Storage } from '../repository.js';
import { IndexStore } from './IndexStore.js';
import { TaskService } from './TaskService.js';
import { SearchService } from './SearchService.js';
import { JsonStorageAdapter } from '../storage/json.adapter.js';
import { 
  validateProjectInput, 
  validateTagInput, 
  createProject, 
  createTag, 
  updateProject, 
  updateTag 
} from '../validation.js';

/**
 * Project service implementation
 */
class ProjectService implements ProjectRepository {
  constructor(private store: IndexStore) {}

  all(): Project[] {
    return this.store.getAllProjects();
  }

  byId(id: ID): Project | undefined {
    return this.store.getProject(id);
  }

  create(input: CreateProjectInput): Result<Project> {
    const errors = validateProjectInput(input);
    if (errors.length > 0) {
      return failure(new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`));
    }

    const project = createProject(input);
    this.store.addProject(project);
    return success(project);
  }

  update(input: UpdateProjectInput): Result<Project> {
    const existingProject = this.store.getProject(input.id);
    if (!existingProject) {
      return failure(new Error(`Project with ID ${input.id} not found`));
    }

    const errors = validateProjectInput(input);
    if (errors.length > 0) {
      return failure(new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`));
    }

    const updatedProject = updateProject(existingProject, input);
    this.store.updateProject(updatedProject);
    return success(updatedProject);
  }

  remove(id: ID): Result<void> {
    const project = this.store.getProject(id);
    if (!project) {
      return failure(new Error(`Project with ID ${id} not found`));
    }

    this.store.removeProject(id);
    return success(undefined);
  }

  roots(): Project[] {
    return this.store.getRootProjects();
  }

  children(parentId: ID): Project[] {
    return this.store.getChildProjects(parentId);
  }

  hierarchy(): Project[] {
    // Return projects in hierarchical order
    const allProjects = this.all();
    const hierarchy: Project[] = [];
    const visited = new Set<ID>();

    const addProject = (project: Project) => {
      if (visited.has(project.id)) return;
      
      if (project.parentId) {
        const parent = allProjects.find(p => p.id === project.parentId);
        if (parent) {
          addProject(parent);
        }
      }
      
      hierarchy.push(project);
      visited.add(project.id);
    };

    allProjects.forEach(addProject);
    return hierarchy;
  }
}

/**
 * Tag service implementation
 */
class TagService implements TagRepository {
  constructor(private store: IndexStore) {}

  all(): Tag[] {
    return this.store.getAllTags();
  }

  byId(id: ID): Tag | undefined {
    return this.store.getTag(id);
  }

  byName(name: string): Tag | undefined {
    return this.store.getTagByName(name);
  }

  create(input: CreateTagInput): Result<Tag> {
    const errors = validateTagInput(input);
    if (errors.length > 0) {
      return failure(new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`));
    }

    const tag = createTag(input);
    this.store.addTag(tag);
    return success(tag);
  }

  update(input: UpdateTagInput): Result<Tag> {
    const existingTag = this.store.getTag(input.id);
    if (!existingTag) {
      return failure(new Error(`Tag with ID ${input.id} not found`));
    }

    const errors = validateTagInput(input);
    if (errors.length > 0) {
      return failure(new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`));
    }

    const updatedTag = updateTag(existingTag, input);
    this.store.updateTag(updatedTag);
    return success(updatedTag);
  }

  remove(id: ID): Result<void> {
    const tag = this.store.getTag(id);
    if (!tag) {
      return failure(new Error(`Tag with ID ${id} not found`));
    }

    this.store.removeTag(id);
    return success(undefined);
  }

  getOrCreate(name: string, color?: string): Result<Tag> {
    const existing = this.byName(name);
    if (existing) {
      return success(existing);
    }

    return this.create({ name, color });
  }
}

/**
 * Main data repository implementation
 */
export class DataRepository implements IDataRepository {
  public tasks: TaskRepository;
  public projects: ProjectRepository;
  public tags: TagRepository;
  public storage: Storage;

  private store: IndexStore;
  private searchService: SearchService;

  constructor(storage?: Storage) {
    this.store = new IndexStore();
    this.storage = storage || new JsonStorageAdapter();
    this.tasks = new TaskService(this.store);
    this.projects = new ProjectService(this.store);
    this.tags = new TagService(this.store);
    this.searchService = new SearchService(this.store);
  }

  /**
   * Initialize repository with data from storage
   */
  async initialize(): Promise<Result<void>> {
    try {
      const loadResult = await this.storage.load();
      if (!loadResult.success) {
        return failure(loadResult.error);
      }

      const data = loadResult.data;
      this.setDataStore(data);
      return success(undefined);
    } catch (error) {
      return failure(new Error(`Failed to initialize repository: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  }

  /**
   * Save all data to storage
   */
  async save(): Promise<Result<void>> {
    try {
      const data = this.getDataStore();
      return await this.storage.save(data);
    } catch (error) {
      return failure(new Error(`Failed to save data: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  }

  /**
   * Get complete data store
   */
  getDataStore(): DataStore {
    const now = new Date().toISOString();
    
    return {
      version: 1,
      tasks: this.store.getAllTasks(),
      projects: this.store.getAllProjects(),
      tags: this.store.getAllTags(),
      lastModified: now
    };
  }

  /**
   * Set complete data store
   */
  setDataStore(data: DataStore): void {
    // Clear existing data
    this.store.clear();

    // Load new data
    data.tasks.forEach(task => this.store.addTask(task));
    data.projects.forEach(project => this.store.addProject(project));
    data.tags.forEach(tag => this.store.addTag(tag));
  }

  /**
   * Get search service
   */
  getSearchService(): SearchService {
    return this.searchService;
  }

  /**
   * Get index store (for advanced operations)
   */
  getIndexStore(): IndexStore {
    return this.store;
  }
}
