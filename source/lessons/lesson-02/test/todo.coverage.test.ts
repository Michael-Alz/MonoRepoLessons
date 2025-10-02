import { TodoList, Priority } from '../src/todo';

describe('TodoList Coverage - explicit branch tests', () => {
  let todoList: TodoList;

  beforeEach(() => {
    todoList = new TodoList();
  });

  test('uncompleteTask throws for null and undefined IDs', () => {
    expect(() => todoList.uncompleteTask(null as any))
      .toThrow('Task ID cannot be null or undefined');
    expect(() => todoList.uncompleteTask(undefined as any))
      .toThrow('Task ID cannot be null or undefined');
  });

  test('updateTaskPriority throws when ID is empty string', () => {
    expect(() => todoList.updateTaskPriority('' as any, Priority.HIGH))
      .toThrow('Task not found');
  });

  test('updateTaskDueDate throws when ID is empty string', () => {
    expect(() => todoList.updateTaskDueDate('' as any, new Date()))
      .toThrow('Task not found');
  });

  test('updateTaskCategory throws when ID is empty string', () => {
    expect(() => todoList.updateTaskCategory('' as any, 'Work'))
      .toThrow('Task not found');
  });
});


