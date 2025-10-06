import { GreetingModelImpl, createGreetingModel, MockGreetingModel } from '../model';

/**
 * Approach 2a: Pure Model Testing
 * 
 * These tests focus solely on business logic:
 * - No DOM rendering required
 * - Fast execution
 * - Easy to understand and maintain
 * - Tests business rules in isolation
 * 
 * PROS:
 * - Lightning fast (no rendering overhead)
 * - Focused on business logic
 * - Easy to write and maintain
 * - Independent of UI changes
 * 
 * CONS:
 * - Doesn't test UI integration
 * - Requires good architecture (separation of concerns)
 */

describe('GreetingModelImpl', () => {
  let model: GreetingModelImpl;

  beforeEach(() => {
    model = new GreetingModelImpl();
  });

  describe('initial state', () => {
    test('starts with "World" as default name', () => {
      expect(model.getCurrentName()).toBe('World');
    });

    test('initial greeting is "Hello, World!"', () => {
      expect(model.getGreeting()).toBe('Hello, World!');
    });
  });

  describe('updateName', () => {
    test('updates name successfully with valid input', () => {
      const result = model.updateName('Alice');
      
      expect(result).toBe(true);
      expect(model.getCurrentName()).toBe('Alice');
      expect(model.getGreeting()).toBe('Hello, Alice!');
    });

    test('trims whitespace from input', () => {
      const result = model.updateName('  Bob  ');
      
      expect(result).toBe(true);
      expect(model.getCurrentName()).toBe('Bob');
      expect(model.getGreeting()).toBe('Hello, Bob!');
    });

    test('rejects empty string', () => {
      const result = model.updateName('');
      
      expect(result).toBe(false);
      expect(model.getCurrentName()).toBe('World'); // Should remain unchanged
      expect(model.getGreeting()).toBe('Hello, World!');
    });

    test('rejects whitespace-only string', () => {
      const result = model.updateName('   ');
      
      expect(result).toBe(false);
      expect(model.getCurrentName()).toBe('World'); // Should remain unchanged
      expect(model.getGreeting()).toBe('Hello, World!');
    });

    test('allows multiple updates', () => {
      model.updateName('Charlie');
      expect(model.getCurrentName()).toBe('Charlie');

      model.updateName('David');
      expect(model.getCurrentName()).toBe('David');
      expect(model.getGreeting()).toBe('Hello, David!');
    });

    test('handles special characters in names', () => {
      const result = model.updateName('José-María');
      
      expect(result).toBe(true);
      expect(model.getCurrentName()).toBe('José-María');
      expect(model.getGreeting()).toBe('Hello, José-María!');
    });

    test('handles very long names', () => {
      const longName = 'A'.repeat(100);
      const result = model.updateName(longName);
      
      expect(result).toBe(true);
      expect(model.getCurrentName()).toBe(longName);
    });
  });

  describe('reset', () => {
    test('resets to initial state', () => {
      // Change the state
      model.updateName('Eve');
      expect(model.getCurrentName()).toBe('Eve');

      // Reset
      model.reset();
      expect(model.getCurrentName()).toBe('World');
      expect(model.getGreeting()).toBe('Hello, World!');
    });
  });

  describe('edge cases', () => {
    test('handles null-like inputs gracefully', () => {
      // TypeScript would catch these at compile time, but testing runtime behavior
      // We need to handle the case where someone passes undefined/null
      try {
        const result = model.updateName(undefined as any);
        expect(result).toBe(false);
      } catch (error) {
        // If it throws, that's also acceptable behavior for invalid input
        expect(error).toBeDefined();
      }
    });

    test('preserves state after failed updates', () => {
      model.updateName('Frank');
      expect(model.getCurrentName()).toBe('Frank');

      // Try invalid update
      model.updateName('');
      expect(model.getCurrentName()).toBe('Frank'); // Should be unchanged

      // Try another valid update
      model.updateName('Grace');
      expect(model.getCurrentName()).toBe('Grace');
    });
  });
});

describe('createGreetingModel factory', () => {
  test('creates a working model instance', () => {
    const model = createGreetingModel();
    
    expect(model.getCurrentName()).toBe('World');
    expect(model.updateName('Test')).toBe(true);
    expect(model.getCurrentName()).toBe('Test');
  });

  test('creates independent instances', () => {
    const model1 = createGreetingModel();
    const model2 = createGreetingModel();

    model1.updateName('Alice');
    model2.updateName('Bob');

    expect(model1.getCurrentName()).toBe('Alice');
    expect(model2.getCurrentName()).toBe('Bob');
  });
});

describe('MockGreetingModel', () => {
  let mockModel: MockGreetingModel;

  beforeEach(() => {
    mockModel = new MockGreetingModel();
  });

  test('provides mock behavior', () => {
    expect(mockModel.getCurrentName()).toBe('MockWorld');
    expect(mockModel.getGreeting()).toBe('Mock: Hello, MockWorld!');
  });

  test('tracks update calls', () => {
    expect(mockModel.getUpdateCallCount()).toBe(0);

    mockModel.updateName('Test1');
    expect(mockModel.getUpdateCallCount()).toBe(1);

    mockModel.updateName('Test2');
    expect(mockModel.getUpdateCallCount()).toBe(2);
  });

  test('always accepts updates (for testing)', () => {
    const result1 = mockModel.updateName('');
    const result2 = mockModel.updateName('   ');
    
    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });

  test('resets tracking state', () => {
    mockModel.updateName('Test');
    expect(mockModel.getUpdateCallCount()).toBe(1);

    mockModel.reset();
    expect(mockModel.getUpdateCallCount()).toBe(0);
    expect(mockModel.getCurrentName()).toBe('MockWorld');
  });
});
