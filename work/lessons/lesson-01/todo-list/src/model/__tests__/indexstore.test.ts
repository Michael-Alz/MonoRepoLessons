import { describe, it, expect, beforeEach } from 'vitest';
import { IndexStore } from '../services/IndexStore.js';
import { createTask, createProject, createTag } from '../validation.js';

describe('IndexStore', () => {
  let store: IndexStore;

  beforeEach(() => {
    store = new IndexStore();
  });

  describe('Task management', () => {
    it('should add and retrieve tasks', () => {
      const task = createTask({ title: 'Test Task' });
      store.addTask(task);

      expect(store.getAllTasks()).toHaveLength(1);
      expect(store.getTask(task.id)).toEqual(task);
    });

    it('should update tasks', () => {
      const task = createTask({ title: 'Original Title' });
      store.addTask(task);

      const updated = { ...task, title: 'Updated Title' };
      store.updateTask(updated);

      expect(store.getTask(task.id)?.title).toBe('Updated Title');
    });

    it('should remove tasks', () => {
      const task = createTask({ title: 'Test Task' });
      store.addTask(task);

      store.removeTask(task.id);

      expect(store.getAllTasks()).toHaveLength(0);
      expect(store.getTask(task.id)).toBeUndefined();
    });
  });

  describe('Project management', () => {
    it('should add and retrieve projects', () => {
      const project = createProject({ name: 'Test Project' });
      store.addProject(project);

      expect(store.getAllProjects()).toHaveLength(1);
      expect(store.getProject(project.id)).toEqual(project);
    });

    it('should get root projects', () => {
      const rootProject = createProject({ name: 'Root Project' });
      const childProject = createProject({ name: 'Child Project', parentId: rootProject.id });

      store.addProject(rootProject);
      store.addProject(childProject);

      const roots = store.getRootProjects();
      expect(roots).toHaveLength(1);
      expect(roots[0].id).toBe(rootProject.id);
    });

    it('should get child projects', () => {
      const rootProject = createProject({ name: 'Root Project' });
      const childProject = createProject({ name: 'Child Project', parentId: rootProject.id });

      store.addProject(rootProject);
      store.addProject(childProject);

      const children = store.getChildProjects(rootProject.id);
      expect(children).toHaveLength(1);
      expect(children[0].id).toBe(childProject.id);
    });
  });

  describe('Tag management', () => {
    it('should add and retrieve tags', () => {
      const tag = createTag({ name: 'urgent' });
      store.addTag(tag);

      expect(store.getAllTags()).toHaveLength(1);
      expect(store.getTag(tag.id)).toEqual(tag);
      expect(store.getTagByName('urgent')).toEqual(tag);
    });

    it('should handle case-insensitive tag lookup', () => {
      const tag = createTag({ name: 'Urgent' });
      store.addTag(tag);

      expect(store.getTagByName('urgent')).toEqual(tag);
      expect(store.getTagByName('URGENT')).toEqual(tag);
    });
  });

  describe('Search functionality', () => {
    beforeEach(() => {
      // Create test data
      const project = createProject({ name: 'Work' });
      const tag = createTag({ name: 'urgent', color: 'red' });
      
      store.addProject(project);
      store.addTag(tag);

      const task1 = createTask({ 
        title: 'Important task', 
        projectId: project.id,
        tags: [tag.id],
        priority: 1,
        status: 'todo'
      });
      
      const task2 = createTask({ 
        title: 'Regular task', 
        priority: 3,
        status: 'done'
      });

      store.addTask(task1);
      store.addTask(task2);
    });

    it('should search by text', () => {
      const results = store.searchTasks({ text: 'important' });
      expect(results).toHaveLength(1);
      expect(results[0].task.title).toBe('Important task');
    });

    it('should search by status', () => {
      const results = store.searchTasks({ statuses: ['todo'] });
      expect(results).toHaveLength(1);
      expect(results[0].task.status).toBe('todo');
    });

    it('should search by priority', () => {
      const results = store.searchTasks({ priorities: [1] });
      expect(results).toHaveLength(1);
      expect(results[0].task.priority).toBe(1);
    });

    it('should search by project', () => {
      const project = store.getAllProjects()[0];
      const results = store.searchTasks({ projectId: project.id });
      expect(results).toHaveLength(1);
      expect(results[0].task.projectId).toBe(project.id);
    });

    it('should search by tags', () => {
      const tag = store.getAllTags()[0];
      const results = store.searchTasks({ tags: [tag.id] });
      expect(results).toHaveLength(1);
      expect(results[0].task.tags).toContain(tag.id);
    });

    it('should combine multiple filters', () => {
      const results = store.searchTasks({ 
        text: 'task',
        statuses: ['todo', 'done']
      });
      expect(results).toHaveLength(2);
    });

    it('should sort results', () => {
      const results = store.searchTasks({ 
        sort: { field: 'priority', dir: 'asc' }
      });
      expect(results).toHaveLength(2);
      expect(results[0].task.priority).toBe(1);
      expect(results[1].task.priority).toBe(3);
    });
  });

  describe('Index maintenance', () => {
    it('should maintain project index when updating tasks', () => {
      const project = createProject({ name: 'Work' });
      store.addProject(project);

      const task = createTask({ title: 'Test Task' });
      store.addTask(task);

      // Move task to project
      const updatedTask = { ...task, projectId: project.id };
      store.updateTask(updatedTask);

      const projectTasks = store.getTasksByProject(project.id);
      expect(projectTasks).toHaveLength(1);
      expect(projectTasks[0].id).toBe(task.id);
    });

    it('should maintain tag index when updating tasks', () => {
      const tag = createTag({ name: 'urgent' });
      store.addTag(tag);

      const task = createTask({ title: 'Test Task' });
      store.addTask(task);

      // Add tag to task
      const updatedTask = { ...task, tags: [tag.id] };
      store.updateTask(updatedTask);

      const tagTasks = store.getTasksByTag(tag.id);
      expect(tagTasks).toHaveLength(1);
      expect(tagTasks[0].id).toBe(task.id);
    });

    it('should clean up indexes when removing tasks', () => {
      const project = createProject({ name: 'Work' });
      const tag = createTag({ name: 'urgent' });
      
      store.addProject(project);
      store.addTag(tag);

      const task = createTask({ 
        title: 'Test Task',
        projectId: project.id,
        tags: [tag.id]
      });
      store.addTask(task);

      // Remove task
      store.removeTask(task.id);

      expect(store.getTasksByProject(project.id)).toHaveLength(0);
      expect(store.getTasksByTag(tag.id)).toHaveLength(0);
    });
  });

  describe('Overdue tasks', () => {
    it('should identify overdue tasks', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Yesterday
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Tomorrow

      const overdueTask = createTask({ 
        title: 'Overdue Task',
        dueAt: pastDate,
        status: 'todo'
      });
      
      const futureTask = createTask({ 
        title: 'Future Task',
        dueAt: futureDate,
        status: 'todo'
      });

      store.addTask(overdueTask);
      store.addTask(futureTask);

      const overdueTasks = store.getOverdueTasks();
      expect(overdueTasks).toHaveLength(1);
      expect(overdueTasks[0].id).toBe(overdueTask.id);
    });

    it('should not include completed tasks in overdue', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const completedOverdueTask = createTask({ 
        title: 'Completed Overdue Task',
        dueAt: pastDate,
        status: 'done'
      });

      store.addTask(completedOverdueTask);

      const overdueTasks = store.getOverdueTasks();
      expect(overdueTasks).toHaveLength(0);
    });
  });
});
