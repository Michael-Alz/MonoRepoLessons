import { ID, Result, success, failure } from '../../core/types.js';
import { SearchQuery, TaskListItem, Status, Priority, SortField, SortDirection } from '../entities.js';
import { IndexStore } from './IndexStore.js';

/**
 * Search service for advanced task queries
 */
export class SearchService {
  constructor(private store: IndexStore) {}

  /**
   * Parse search query from string
   */
  parseQuery(queryString: string): SearchQuery {
    const query: SearchQuery = {};
    const tokens = queryString.trim().split(/\s+/);

    for (const token of tokens) {
      if (token.startsWith('status:')) {
        const status = token.substring(7) as Status;
        if (['todo', 'doing', 'done', 'archived'].includes(status)) {
          query.statuses = query.statuses || [];
          if (!query.statuses.includes(status)) {
            query.statuses.push(status);
          }
        }
      } else if (token.startsWith('priority:')) {
        const priority = parseInt(token.substring(9));
        if (priority >= 1 && priority <= 5) {
          query.priorities = query.priorities || [];
          if (!query.priorities.includes(priority as Priority)) {
            query.priorities.push(priority as Priority);
          }
        }
      } else if (token.startsWith('tag:')) {
        const tagName = token.substring(4);
        const tag = this.store.getTagByName(tagName);
        if (tag) {
          query.tags = query.tags || [];
          if (!query.tags.includes(tag.id)) {
            query.tags.push(tag.id);
          }
        }
      } else if (token.startsWith('project:')) {
        const projectName = token.substring(8);
        const projects = this.store.getAllProjects();
        const project = projects.find(p => p.name.toLowerCase() === projectName.toLowerCase());
        if (project) {
          query.projectId = project.id;
        }
      } else if (token.startsWith('due:')) {
        const dueStr = token.substring(4);
        const dueDate = this.parseDueDate(dueStr);
        if (dueDate) {
          query.dueBefore = dueDate;
        }
      } else if (token.startsWith('sort:')) {
        const sortStr = token.substring(5);
        const sortParts = sortStr.split(':');
        if (sortParts.length === 2) {
          const field = sortParts[0] as SortField;
          const dir = sortParts[1] as SortDirection;
          if (['title', 'priority', 'createdAt', 'updatedAt', 'dueAt'].includes(field) &&
              ['asc', 'desc'].includes(dir)) {
            query.sort = { field, dir };
          }
        }
      } else if (token.startsWith('+')) {
        // Positive tag filter
        const tagName = token.substring(1);
        const tag = this.store.getTagByName(tagName);
        if (tag) {
          query.tags = query.tags || [];
          if (!query.tags.includes(tag.id)) {
            query.tags.push(tag.id);
          }
        }
      } else if (token.startsWith('-')) {
        // Negative tag filter (exclude)
        // This would require more complex query logic
        // For now, we'll treat it as a regular text search
        query.text = query.text ? `${query.text} ${token}` : token;
      } else {
        // Regular text search
        query.text = query.text ? `${query.text} ${token}` : token;
      }
    }

    return query;
  }

  /**
   * Search tasks with parsed query
   */
  search(query: SearchQuery): TaskListItem[] {
    return this.store.searchTasks(query);
  }

  /**
   * Search tasks with string query
   */
  searchByString(queryString: string): TaskListItem[] {
    const query = this.parseQuery(queryString);
    return this.search(query);
  }

  /**
   * Get tasks by text search
   */
  searchByText(text: string): TaskListItem[] {
    return this.search({ text });
  }

  /**
   * Get tasks by status
   */
  searchByStatus(statuses: Status[]): TaskListItem[] {
    return this.search({ statuses });
  }

  /**
   * Get tasks by priority
   */
  searchByPriority(priorities: Priority[]): TaskListItem[] {
    return this.search({ priorities });
  }

  /**
   * Get tasks by tags
   */
  searchByTags(tagIds: ID[]): TaskListItem[] {
    return this.search({ tags: tagIds });
  }

  /**
   * Get tasks by project
   */
  searchByProject(projectId: ID): TaskListItem[] {
    return this.search({ projectId });
  }

  /**
   * Get overdue tasks
   */
  searchOverdue(): TaskListItem[] {
    const now = new Date().toISOString();
    return this.search({ dueBefore: now });
  }

  /**
   * Get tasks due today
   */
  searchDueToday(): TaskListItem[] {
    const today = new Date();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    return this.search({ dueBefore: endOfDay.toISOString() });
  }

  /**
   * Get tasks due this week
   */
  searchDueThisWeek(): TaskListItem[] {
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);
    return this.search({ dueBefore: endOfWeek.toISOString() });
  }

  /**
   * Get high priority tasks
   */
  searchHighPriority(): TaskListItem[] {
    return this.search({ priorities: [1, 2] });
  }

  /**
   * Get recently updated tasks
   */
  searchRecentlyUpdated(days: number = 7): TaskListItem[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    const allTasks = this.store.getAllTasks();
    return allTasks
      .filter(task => new Date(task.updatedAt) >= cutoff)
      .map(task => {
        const project = task.projectId ? this.store.getProject(task.projectId) : undefined;
        const tagObjects = task.tags.map(tagId => this.store.getTag(tagId)).filter(Boolean) as any[];
        
        return {
          task,
          project,
          tagObjects,
          isOverdue: task.dueAt ? new Date(task.dueAt) < new Date() && task.status !== 'done' : false,
          daysUntilDue: task.dueAt ? Math.ceil((new Date(task.dueAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : undefined
        };
      });
  }

  /**
   * Parse due date from string
   */
  private parseDueDate(dueStr: string): string | undefined {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dueStr.toLowerCase()) {
      case 'today':
        return today.toISOString();
      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString();
      case 'week':
      case 'this-week':
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);
        return endOfWeek.toISOString();
      case 'month':
      case 'this-month':
        const endOfMonth = new Date(today);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        return endOfMonth.toISOString();
      default:
        // Try to parse as ISO date or relative date
        if (dueStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // YYYY-MM-DD format
          return new Date(dueStr).toISOString();
        } else if (dueStr.match(/^\+(\d+)d$/)) {
          // +Nd format (N days from now)
          const days = parseInt(dueStr.substring(1, dueStr.length - 1));
          const future = new Date(today);
          future.setDate(future.getDate() + days);
          return future.toISOString();
        }
        return undefined;
    }
  }
}
