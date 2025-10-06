import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from '../App';

/**
 * Approach 1: DOM-Based Testing
 * 
 * These tests interact directly with the rendered DOM:
 * - Find elements using queries (getByTestId, getByRole, etc.)
 * - Simulate user interactions (typing, clicking)
 * - Assert on the actual rendered content
 * 
 * PROS:
 * - Tests the actual user experience
 * - Catches integration issues between components
 * - High confidence that the UI works as expected
 * 
 * CONS:
 * - Slower execution (requires rendering)
 * - Brittle - breaks when UI structure changes
 * - Tightly coupled to implementation details
 */

describe('App - DOM Testing Approach', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('renders initial greeting with "World"', () => {
    const greeting = screen.getByTestId('greeting-title');
    expect(greeting).toHaveTextContent('Hello, World!');
  });

  test('renders name input field', () => {
    const input = screen.getByTestId('name-input').querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  test('renders update button', () => {
    const button = screen.getByTestId('update-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Update');
  });

  test('updates greeting when clicking update button', async () => {
    const user = userEvent.setup();
    const inputElement = screen.getByTestId('name-input').querySelector('input');
    const button = screen.getByTestId('update-button');
    const greeting = screen.getByTestId('greeting-title');

    // Type a name
    await user.type(inputElement, 'Alice');
    expect(inputElement).toHaveValue('Alice');

    // Click update button
    await user.click(button);

    // Check that greeting updated and input cleared
    expect(greeting).toHaveTextContent('Hello, Alice!');
    expect(inputElement).toHaveValue('');
  });

  test('updates greeting when pressing Enter key', async () => {
    const user = userEvent.setup();
    const inputElement = screen.getByTestId('name-input').querySelector('input');
    const greeting = screen.getByTestId('greeting-title');

    // Type a name and press Enter
    await user.type(inputElement, 'Bob{enter}');

    // Check that greeting updated and input cleared
    expect(greeting).toHaveTextContent('Hello, Bob!');
    expect(inputElement).toHaveValue('');
  });

  test('ignores empty or whitespace-only names', async () => {
    const user = userEvent.setup();
    const inputElement = screen.getByTestId('name-input').querySelector('input');
    const button = screen.getByTestId('update-button');
    const greeting = screen.getByTestId('greeting-title');

    // Try with empty string
    await user.click(button);
    expect(greeting).toHaveTextContent('Hello, World!');

    // Try with whitespace only
    await user.type(inputElement, '   ');
    await user.click(button);
    expect(greeting).toHaveTextContent('Hello, World!');
  });

  test('trims whitespace from names', async () => {
    const user = userEvent.setup();
    const inputElement = screen.getByTestId('name-input').querySelector('input');
    const button = screen.getByTestId('update-button');
    const greeting = screen.getByTestId('greeting-title');

    // Type name with leading/trailing whitespace
    await user.type(inputElement, '  Charlie  ');
    await user.click(button);

    // Should trim whitespace
    expect(greeting).toHaveTextContent('Hello, Charlie!');
  });

  test('can update name multiple times', async () => {
    const user = userEvent.setup();
    const inputElement = screen.getByTestId('name-input').querySelector('input');
    const button = screen.getByTestId('update-button');
    const greeting = screen.getByTestId('greeting-title');

    // First update
    await user.type(inputElement, 'David');
    await user.click(button);
    expect(greeting).toHaveTextContent('Hello, David!');

    // Second update
    await user.type(inputElement, 'Eve');
    await user.click(button);
    expect(greeting).toHaveTextContent('Hello, Eve!');
  });
});

/**
 * Alternative Testing Approaches (for comparison)
 */
describe('App - Alternative DOM Testing Patterns', () => {
  test('using fireEvent instead of userEvent', () => {
    render(<App />);
    const inputElement = screen.getByTestId('name-input').querySelector('input');
    const button = screen.getByTestId('update-button');
    const greeting = screen.getByTestId('greeting-title');

    // fireEvent is more low-level than userEvent
    fireEvent.change(inputElement, { target: { value: 'Frank' } });
    fireEvent.click(button);

    expect(greeting).toHaveTextContent('Hello, Frank!');
  });

  test('using keyboard events with fireEvent', () => {
    render(<App />);
    const inputElement = screen.getByTestId('name-input').querySelector('input');
    const greeting = screen.getByTestId('greeting-title');

    fireEvent.change(inputElement, { target: { value: 'Grace' } });
    fireEvent.keyPress(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(greeting).toHaveTextContent('Hello, Grace!');
  });

  test('finding elements by role instead of test-id', async () => {
    render(<App />);
    const user = userEvent.setup();
    
    // Find by role instead of test-id
    const input = screen.getByRole('textbox', { name: /enter your name/i });
    const button = screen.getByRole('button', { name: /update/i });
    const heading = screen.getByRole('heading', { level: 1 });

    await user.type(input, 'Helen');
    await user.click(button);

    expect(heading).toHaveTextContent('Hello, Helen!');
  });
});
