import { ID, Timestamp, Status, Priority, SortField, SortDirection, PanelType } from '../core/types.js';

/**
 * Core task entity
 */
export interface Task {
  id: ID;
  title: string;
  notes?: string;
  status: Status;
  priority: Priority;
  projectId?: ID;
  tags: ID[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  dueAt?: Timestamp;
  completedAt?: Timestamp;
}

/**
 * Project entity for organizing tasks
 */
export interface Project {
  id: ID;
  name: string;
  order: number;
  parentId?: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Tag entity for categorizing tasks
 */
export interface Tag {
  id: ID;
  name: string;
  color?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * View state for UI management
 */
export interface ViewState {
  focusedPanel: PanelType;
  selection: {
    panel: string;
    id?: ID;
  };
  filters: {
    query?: string;
    statuses?: Status[];
    priorities?: Priority[];
    tags?: ID[];
    projectId?: ID;
    dueBefore?: Timestamp;
    sort: {
      field: SortField;
      dir: SortDirection;
    };
  };
}

/**
 * Data store structure
 */
export interface DataStore {
  version: number;
  tasks: Task[];
  projects: Project[];
  tags: Tag[];
  lastModified: Timestamp;
}

/**
 * Task creation input (without generated fields)
 */
export type CreateTaskInput = {
  title: string;
  notes?: string;
  status?: Status;
  priority?: Priority;
  projectId?: ID;
  tags?: ID[];
  dueAt?: Timestamp;
};

/**
 * Task update input (partial, with required ID)
 */
export type UpdateTaskInput = {
  id: ID;
  title?: string;
  notes?: string;
  status?: Status;
  priority?: Priority;
  projectId?: ID;
  tags?: ID[];
  dueAt?: Timestamp;
};

/**
 * Project creation input
 */
export type CreateProjectInput = {
  name: string;
  order?: number;
  parentId?: ID;
};

/**
 * Project update input
 */
export type UpdateProjectInput = {
  id: ID;
  name?: string;
  order?: number;
  parentId?: ID;
};

/**
 * Tag creation input
 */
export type CreateTagInput = {
  name: string;
  color?: string;
};

/**
 * Tag update input
 */
export type UpdateTagInput = {
  id: ID;
  name?: string;
  color?: string;
};

/**
 * Search query structure
 */
export interface SearchQuery {
  text?: string;
  statuses?: Status[];
  priorities?: Priority[];
  tags?: ID[];
  projectId?: ID;
  dueBefore?: Timestamp;
  sort?: {
    field: SortField;
    dir: SortDirection;
  };
}

/**
 * Task list item for display
 */
export interface TaskListItem {
  task: Task;
  project?: Project;
  tagObjects: Tag[];
  isOverdue: boolean;
  daysUntilDue?: number;
}
