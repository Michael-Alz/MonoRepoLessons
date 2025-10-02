import { ID, Result, success, failure } from '../../core/types.js';
import { Task, Project, Tag, TaskListItem, SearchQuery, Status, Priority } from '../entities.js';

/**
 * In-memory store with indexes for fast queries
 */
export class IndexStore {
  private tasks: Map<ID, Task> = new Map();
  private projects: Map<ID, Project> = new Map();
  private tags: Map<ID, Tag> = new Map();
  private tagByName: Map<string, Tag> = new Map();

  // Indexes for fast queries
  private tasksByProject: Map<ID, Set<ID>> = new Map();
  private tasksByTag: Map<ID, Set<ID>> = new Map();
  private tasksByStatus: Map<Status, Set<ID>> = new Map();
  private tasksByPriority: Map<Priority, Set<ID>> = new Map();
  private overdueTasks: Set<ID> = new Set();

  /**
   * Add a task to the store and update indexes
   */
  addTask(task: Task): void {
    this.tasks.set(task.id, task);
    this.updateTaskIndexes(task);
  }

  /**
   * Update a task in the store and update indexes
   */
  updateTask(task: Task): void {
    const oldTask = this.tasks.get(task.id);
    if (oldTask) {
      this.removeTaskFromIndexes(oldTask);
    }
    this.tasks.set(task.id, task);
    this.updateTaskIndexes(task);
  }

  /**
   * Remove a task from the store and update indexes
   */
  removeTask(id: ID): void {
    const task = this.tasks.get(id);
    if (task) {
      this.removeTaskFromIndexes(task);
      this.tasks.delete(id);
    }
  }

  /**
   * Add a project to the store
   */
  addProject(project: Project): void {
    this.projects.set(project.id, project);
  }

  /**
   * Update a project in the store
   */
  updateProject(project: Project): void {
    this.projects.set(project.id, project);
  }

  /**
   * Remove a project from the store
   */
  removeProject(id: ID): void {
    this.projects.delete(id);
  }

  /**
   * Add a tag to the store and update indexes
   */
  addTag(tag: Tag): void {
    this.tags.set(tag.id, tag);
    this.tagByName.set(tag.name.toLowerCase(), tag);
  }

  /**
   * Update a tag in the store and update indexes
   */
  updateTag(tag: Tag): void {
    const oldTag = this.tags.get(tag.id);
    if (oldTag) {
      this.tagByName.delete(oldTag.name.toLowerCase());
    }
    this.tags.set(tag.id, tag);
    this.tagByName.set(tag.name.toLowerCase(), tag);
  }

  /**
   * Remove a tag from the store and update indexes
   */
  removeTag(id: ID): void {
    const tag = this.tags.get(id);
    if (tag) {
      this.tagByName.delete(tag.name.toLowerCase());
      this.tags.delete(id);
    }
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get task by ID
   */
  getTask(id: ID): Task | undefined {
    return this.tasks.get(id);
  }

  /**
   * Get all projects
   */
  getAllProjects(): Project[] {
    return Array.from(this.projects.values());
  }

  /**
   * Get project by ID
   */
  getProject(id: ID): Project | undefined {
    return this.projects.get(id);
  }

  /**
   * Get all tags
   */
  getAllTags(): Tag[] {
    return Array.from(this.tags.values());
  }

  /**
   * Get tag by ID
   */
  getTag(id: ID): Tag | undefined {
    return this.tags.get(id);
  }

  /**
   * Get tag by name
   */
  getTagByName(name: string): Tag | undefined {
    return this.tagByName.get(name.toLowerCase());
  }

  /**
   * Search tasks with query
   */
  searchTasks(query: SearchQuery): TaskListItem[] {
    let taskIds = new Set<ID>();

    // Start with all tasks
    if (!query.text && !query.statuses && !query.priorities && !query.tags && !query.projectId && !query.dueBefore) {
      taskIds = new Set(this.tasks.keys());
    } else {
      // Apply filters
      if (query.statuses && query.statuses.length > 0) {
        const statusIds = new Set<ID>();
        query.statuses.forEach(status => {
          const ids = this.tasksByStatus.get(status);
          if (ids) {
            ids.forEach(id => statusIds.add(id));
          }
        });
        taskIds = statusIds;
      } else {
        taskIds = new Set(this.tasks.keys());
      }

      if (query.priorities && query.priorities.length > 0) {
        const priorityIds = new Set<ID>();
        query.priorities.forEach(priority => {
          const ids = this.tasksByPriority.get(priority);
          if (ids) {
            ids.forEach(id => priorityIds.add(id));
          }
        });
        taskIds = new Set([...taskIds].filter(id => priorityIds.has(id)));
      }

      if (query.tags && query.tags.length > 0) {
        const tagIds = new Set<ID>();
        query.tags.forEach(tagId => {
          const ids = this.tasksByTag.get(tagId);
          if (ids) {
            ids.forEach(id => tagIds.add(id));
          }
        });
        taskIds = new Set([...taskIds].filter(id => tagIds.has(id)));
      }

      if (query.projectId) {
        const projectIds = this.tasksByProject.get(query.projectId);
        if (projectIds) {
          taskIds = new Set([...taskIds].filter(id => projectIds.has(id)));
        } else {
          taskIds = new Set();
        }
      }

      if (query.dueBefore) {
        const dueDate = new Date(query.dueBefore);
        taskIds = new Set([...taskIds].filter(id => {
          const task = this.tasks.get(id);
          if (!task?.dueAt) return false;
          return new Date(task.dueAt) <= dueDate;
        }));
      }

      if (query.text) {
        const searchText = query.text.toLowerCase();
        taskIds = new Set([...taskIds].filter(id => {
          const task = this.tasks.get(id);
          if (!task) return false;
          return task.title.toLowerCase().includes(searchText) ||
                 (task.notes && task.notes.toLowerCase().includes(searchText));
        }));
      }
    }

    // Convert to TaskListItem objects
    const results: TaskListItem[] = [];
    for (const taskId of taskIds) {
      const task = this.tasks.get(taskId);
      if (!task) continue;

      const project = task.projectId ? this.projects.get(task.projectId) : undefined;
      const tagObjects = task.tags.map(tagId => this.tags.get(tagId)).filter(Boolean) as Tag[];
      
      const isOverdue = task.dueAt ? new Date(task.dueAt) < new Date() && task.status !== 'done' : false;
      const daysUntilDue = task.dueAt ? Math.ceil((new Date(task.dueAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : undefined;

      results.push({
        task,
        project,
        tagObjects,
        isOverdue,
        daysUntilDue
      });
    }

    // Apply sorting
    if (query.sort) {
      results.sort((a, b) => {
        const { field, dir } = query.sort!;
        let aValue: any, bValue: any;

        switch (field) {
          case 'title':
            aValue = a.task.title.toLowerCase();
            bValue = b.task.title.toLowerCase();
            break;
          case 'priority':
            aValue = a.task.priority;
            bValue = b.task.priority;
            break;
          case 'createdAt':
            aValue = new Date(a.task.createdAt).getTime();
            bValue = new Date(b.task.createdAt).getTime();
            break;
          case 'updatedAt':
            aValue = new Date(a.task.updatedAt).getTime();
            bValue = new Date(b.task.updatedAt).getTime();
            break;
          case 'dueAt':
            aValue = a.task.dueAt ? new Date(a.task.dueAt).getTime() : Number.MAX_SAFE_INTEGER;
            bValue = b.task.dueAt ? new Date(b.task.dueAt).getTime() : Number.MAX_SAFE_INTEGER;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return dir === 'asc' ? -1 : 1;
        if (aValue > bValue) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return results;
  }

  /**
   * Get tasks by project
   */
  getTasksByProject(projectId: ID): Task[] {
    const taskIds = this.tasksByProject.get(projectId);
    if (!taskIds) return [];
    
    return Array.from(taskIds)
      .map(id => this.tasks.get(id))
      .filter(Boolean) as Task[];
  }

  /**
   * Get tasks by tag
   */
  getTasksByTag(tagId: ID): Task[] {
    const taskIds = this.tasksByTag.get(tagId);
    if (!taskIds) return [];
    
    return Array.from(taskIds)
      .map(id => this.tasks.get(id))
      .filter(Boolean) as Task[];
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(status: Status): Task[] {
    const taskIds = this.tasksByStatus.get(status);
    if (!taskIds) return [];
    
    return Array.from(taskIds)
      .map(id => this.tasks.get(id))
      .filter(Boolean) as Task[];
  }

  /**
   * Get overdue tasks
   */
  getOverdueTasks(): Task[] {
    return Array.from(this.overdueTasks)
      .map(id => this.tasks.get(id))
      .filter(Boolean) as Task[];
  }

  /**
   * Get root projects (no parent)
   */
  getRootProjects(): Project[] {
    return Array.from(this.projects.values())
      .filter(project => !project.parentId)
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Get child projects
   */
  getChildProjects(parentId: ID): Project[] {
    return Array.from(this.projects.values())
      .filter(project => project.parentId === parentId)
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.tasks.clear();
    this.projects.clear();
    this.tags.clear();
    this.tagByName.clear();
    this.tasksByProject.clear();
    this.tasksByTag.clear();
    this.tasksByStatus.clear();
    this.tasksByPriority.clear();
    this.overdueTasks.clear();
  }

  /**
   * Update task indexes
   */
  private updateTaskIndexes(task: Task): void {
    // Update project index
    if (task.projectId) {
      if (!this.tasksByProject.has(task.projectId)) {
        this.tasksByProject.set(task.projectId, new Set());
      }
      this.tasksByProject.get(task.projectId)!.add(task.id);
    }

    // Update tag indexes
    task.tags.forEach(tagId => {
      if (!this.tasksByTag.has(tagId)) {
        this.tasksByTag.set(tagId, new Set());
      }
      this.tasksByTag.get(tagId)!.add(task.id);
    });

    // Update status index
    if (!this.tasksByStatus.has(task.status)) {
      this.tasksByStatus.set(task.status, new Set());
    }
    this.tasksByStatus.get(task.status)!.add(task.id);

    // Update priority index
    if (!this.tasksByPriority.has(task.priority)) {
      this.tasksByPriority.set(task.priority, new Set());
    }
    this.tasksByPriority.get(task.priority)!.add(task.id);

    // Update overdue index
    if (task.dueAt && new Date(task.dueAt) < new Date() && task.status !== 'done') {
      this.overdueTasks.add(task.id);
    } else {
      this.overdueTasks.delete(task.id);
    }
  }

  /**
   * Remove task from indexes
   */
  private removeTaskFromIndexes(task: Task): void {
    // Remove from project index
    if (task.projectId) {
      const projectTasks = this.tasksByProject.get(task.projectId);
      if (projectTasks) {
        projectTasks.delete(task.id);
        if (projectTasks.size === 0) {
          this.tasksByProject.delete(task.projectId);
        }
      }
    }

    // Remove from tag indexes
    task.tags.forEach(tagId => {
      const tagTasks = this.tasksByTag.get(tagId);
      if (tagTasks) {
        tagTasks.delete(task.id);
        if (tagTasks.size === 0) {
          this.tasksByTag.delete(tagId);
        }
      }
    });

    // Remove from status index
    const statusTasks = this.tasksByStatus.get(task.status);
    if (statusTasks) {
      statusTasks.delete(task.id);
      if (statusTasks.size === 0) {
        this.tasksByStatus.delete(task.status);
      }
    }

    // Remove from priority index
    const priorityTasks = this.tasksByPriority.get(task.priority);
    if (priorityTasks) {
      priorityTasks.delete(task.id);
      if (priorityTasks.size === 0) {
        this.tasksByPriority.delete(task.priority);
      }
    }

    // Remove from overdue index
    this.overdueTasks.delete(task.id);
  }
}
