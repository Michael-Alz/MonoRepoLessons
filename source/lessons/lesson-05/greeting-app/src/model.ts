/**
 * Phase 2: Extracted Business Logic Model
 * 
 * This model demonstrates separation of concerns:
 * - Business logic is isolated from UI concerns
 * - Easy to test independently with Jest
 * - Can be mocked for UI testing
 * - Follows single responsibility principle
 */

export interface GreetingModel {
  getCurrentName(): string;
  updateName(newName: string): boolean;
  getGreeting(): string;
  reset(): void;
}

/**
 * Implementation of the greeting business logic
 */
export class GreetingModelImpl implements GreetingModel {
  private currentName: string = 'World';

  /**
   * Get the current display name
   */
  getCurrentName(): string {
    return this.currentName;
  }

  /**
   * Update the display name with validation
   * @param newName - The new name to set
   * @returns true if update was successful, false if rejected
   */
  updateName(newName: string): boolean {
    // Business rule: reject empty or whitespace-only names
    const trimmedName = newName.trim();
    if (!trimmedName) {
      return false;
    }

    this.currentName = trimmedName;
    return true;
  }

  /**
   * Get the formatted greeting message
   */
  getGreeting(): string {
    return `Hello, ${this.currentName}!`;
  }

  /**
   * Reset to initial state
   */
  reset(): void {
    this.currentName = 'World';
  }
}

/**
 * Factory function for creating model instances
 * Useful for dependency injection and testing
 */
export function createGreetingModel(): GreetingModel {
  return new GreetingModelImpl();
}

/**
 * Mock implementation for testing
 * This can be used to create predictable test scenarios
 */
export class MockGreetingModel implements GreetingModel {
  private name: string = 'MockWorld';
  private updateCallCount: number = 0;

  getCurrentName(): string {
    return this.name;
  }

  updateName(newName: string): boolean {
    this.updateCallCount++;
    this.name = newName || 'MockDefault';
    return true;
  }

  getGreeting(): string {
    return `Mock: Hello, ${this.name}!`;
  }

  reset(): void {
    this.name = 'MockWorld';
    this.updateCallCount = 0;
  }

  // Test helper methods
  getUpdateCallCount(): number {
    return this.updateCallCount;
  }
}

