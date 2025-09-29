// Test setup file for todo list manager tests

// Mock blessed globally to prevent terminal rendering during tests
jest.mock('blessed', () => ({
  screen: jest.fn(() => ({
    render: jest.fn(),
    destroy: jest.fn(),
    key: jest.fn(),
    on: jest.fn(),
    append: jest.fn(),
    focus: jest.fn()
  })),
  list: jest.fn(() => ({
    setItems: jest.fn(),
    getItem: jest.fn(),
    selected: 0,
    on: jest.fn(),
    focus: jest.fn(),
    select: jest.fn()
  })),
  form: jest.fn(() => ({
    on: jest.fn(),
    reset: jest.fn(),
    submit: jest.fn()
  })),
  textbox: jest.fn(() => ({
    getValue: jest.fn(),
    setValue: jest.fn(),
    focus: jest.fn(),
    on: jest.fn()
  })),
  button: jest.fn(() => ({
    on: jest.fn(),
    focus: jest.fn()
  })),
  box: jest.fn(() => ({
    setContent: jest.fn(),
    on: jest.fn()
  }))
}));

// Mock file system operations
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn()
}));

// Mock path operations
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
  dirname: jest.fn(),
  resolve: jest.fn()
}));

// Global test utilities
global.createMockTask = (overrides = {}) => ({
  id: 'mock-id',
  title: 'Mock Task',
  completed: false,
  priority: 'MEDIUM',
  category: null,
  dueDate: null,
  createdAt: new Date(),
  completedAt: null,
  ...overrides
});

// Console suppression for cleaner test output
const originalConsole = console;
global.console = {
  ...originalConsole,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Restore console after tests if needed
afterAll(() => {
  global.console = originalConsole;
});
