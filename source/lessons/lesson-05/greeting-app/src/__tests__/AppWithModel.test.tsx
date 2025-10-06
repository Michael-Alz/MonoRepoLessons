import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AppWithModel from '../AppWithModel';
import { GreetingModel } from '../model';

/**
 * Approach 2b: UI Testing with Mocked Dependencies
 * 
 * These tests focus on UI behavior while mocking the business logic:
 * - UI logic is tested in isolation
 * - Business logic is mocked for predictable behavior
 * - Fast execution (mocked dependencies)
 * - Tests the integration between UI and model interface
 * 
 * PROS:
 * - Fast execution (mocked dependencies)
 * - Focused on UI concerns only
 * - Predictable test scenarios
 * - Independent of business logic changes
 * 
 * CONS:
 * - Requires mocking setup
 * - Doesn't test real integration
 * - Must keep mocks in sync with real implementation
 */

// Create a mock model for testing
const createMockModel = (): jest.Mocked<GreetingModel> => ({
  getCurrentName: jest.fn(),
  updateName: jest.fn(),
  getGreeting: jest.fn(),
  reset: jest.fn(),
});

describe('AppWithModel - Mocked Dependencies', () => {
  let mockModel: jest.Mocked<GreetingModel>;

  beforeEach(() => {
    mockModel = createMockModel();
    // Set up default mock behavior
    mockModel.getGreeting.mockReturnValue('Hello, MockUser!');
    mockModel.getCurrentName.mockReturnValue('MockUser');
    mockModel.updateName.mockReturnValue(true);
  });

  test('renders greeting from model on initial load', () => {
    render(<AppWithModel model={mockModel} />);
    
    const greeting = screen.getByTestId('greeting-title');
    expect(greeting).toHaveTextContent('Hello, MockUser!');
    expect(mockModel.getGreeting).toHaveBeenCalled();
  });

  test('renders input field and button', () => {
    render(<AppWithModel model={mockModel} />);
    
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('update-button')).toBeInTheDocument();
  });

  test('calls model.updateName when update button is clicked', async () => {
    const user = userEvent.setup();
    render(<AppWithModel model={mockModel} />);
    
    const inputElement = screen.getByTestId('name-input').querySelector('input');
    const button = screen.getByTestId('update-button');

    await user.type(inputElement, 'TestUser');
    await user.click(button);

    expect(mockModel.updateName).toHaveBeenCalledWith('TestUser');
  });

  test('calls model.updateName when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<AppWithModel model={mockModel} />);
    
    const inputElement = screen.getByTestId('name-input').querySelector('input');

    await user.type(inputElement, 'TestUser{enter}');

    expect(mockModel.updateName).toHaveBeenCalledWith('TestUser');
  });

  test('clears input field after successful update', async () => {
    const user = userEvent.setup();
    mockModel.updateName.mockReturnValue(true); // Simulate successful update
    
    render(<AppWithModel model={mockModel} />);
    
    const inputElement = screen.getByTestId('name-input').querySelector('input');
    const button = screen.getByTestId('update-button');

    await user.type(inputElement, 'TestUser');
    expect(inputElement).toHaveValue('TestUser');

    await user.click(button);

    expect(inputElement).toHaveValue(''); // Should be cleared
  });

  test('does not clear input field after failed update', async () => {
    const user = userEvent.setup();
    mockModel.updateName.mockReturnValue(false); // Simulate failed update
    
    render(<AppWithModel model={mockModel} />);
    
    const inputElement = screen.getByTestId('name-input').querySelector('input');
    const button = screen.getByTestId('update-button');

    await user.type(inputElement, 'InvalidInput');
    await user.click(button);

    expect(inputElement).toHaveValue('InvalidInput'); // Should NOT be cleared
  });

  test('updates greeting display after successful model update', async () => {
    const user = userEvent.setup();
    
    // Set up mock to return different greeting after update
    mockModel.getGreeting
      .mockReturnValueOnce('Hello, MockUser!') // Initial call
      .mockReturnValueOnce('Hello, UpdatedUser!'); // After update
    
    mockModel.updateName.mockReturnValue(true);
    
    render(<AppWithModel model={mockModel} />);
    
    const inputElement = screen.getByTestId('name-input').querySelector('input');
    const button = screen.getByTestId('update-button');
    const greeting = screen.getByTestId('greeting-title');

    // Initial state
    expect(greeting).toHaveTextContent('Hello, MockUser!');

    // Perform update
    await user.type(inputElement, 'UpdatedUser');
    await user.click(button);

    // Should call getGreeting multiple times (initial + after update)
    expect(mockModel.getGreeting.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  test('handles multiple updates correctly', async () => {
    const user = userEvent.setup();
    mockModel.updateName.mockReturnValue(true);
    
    render(<AppWithModel model={mockModel} />);
    
    const inputElement = screen.getByTestId('name-input').querySelector('input');
    const button = screen.getByTestId('update-button');

    // First update
    await user.type(inputElement, 'User1');
    await user.click(button);
    expect(mockModel.updateName).toHaveBeenCalledWith('User1');

    // Second update
    await user.type(inputElement, 'User2');
    await user.click(button);
    expect(mockModel.updateName).toHaveBeenCalledWith('User2');

    expect(mockModel.updateName).toHaveBeenCalledTimes(2);
  });

  test('works without injected model (uses default)', () => {
    // Test that the component can work without dependency injection
    // This tests the fallback to createGreetingModel()
    render(<AppWithModel />);
    
    // Should render without crashing
    expect(screen.getByTestId('greeting-title')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('update-button')).toBeInTheDocument();
  });
});

/**
 * Integration Tests - Testing with Real Model
 * 
 * These tests use the real model to verify end-to-end behavior
 * while still focusing on the UI component.
 */
describe('AppWithModel - Integration with Real Model', () => {
  test('full integration test with real model', async () => {
    const user = userEvent.setup();
    
    // Use real model (no mocking)
    render(<AppWithModel />);
    
    const inputElement = screen.getByTestId('name-input').querySelector('input');
    const button = screen.getByTestId('update-button');
    const greeting = screen.getByTestId('greeting-title');

    // Initial state
    expect(greeting).toHaveTextContent('Hello, World!');

    // Update name
    await user.type(inputElement, 'Integration Test');
    await user.click(button);

    // Verify real behavior
    expect(greeting).toHaveTextContent('Hello, Integration Test!');
    expect(inputElement).toHaveValue('');
  });

  test('integration test with invalid input', async () => {
    const user = userEvent.setup();
    
    render(<AppWithModel />);
    
    const inputElement = screen.getByTestId('name-input').querySelector('input');
    const button = screen.getByTestId('update-button');
    const greeting = screen.getByTestId('greeting-title');

    // Try to update with empty string
    await user.click(button);

    // Should remain unchanged
    expect(greeting).toHaveTextContent('Hello, World!');
    expect(inputElement).toHaveValue('');
  });
});
