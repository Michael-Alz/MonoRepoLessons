import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App Component', () => {
  test('renders heading', () => {
    render(<App />)
    const heading = screen.getByText(/React CI\/CD Demo/i)
    expect(heading).toBeInTheDocument()
  })

  test('initial count is 0', () => {
    render(<App />)
    const count = screen.getByText(/Click count: 0/i)
    expect(count).toBeInTheDocument()
  })

  test('increment button increases count', () => {
    render(<App />)
    const button = screen.getByText(/Increment/i)
    fireEvent.click(button)
    const count = screen.getByText(/Click count: 1/i)
    expect(count).toBeInTheDocument()
  })

  test('reset button sets count to 0', () => {
    render(<App />)
    const incrementButton = screen.getByText(/Increment/i)
    const resetButton = screen.getByText(/Reset/i)
    
    fireEvent.click(incrementButton)
    fireEvent.click(incrementButton)
    fireEvent.click(resetButton)
    
    const count = screen.getByText(/Click count: 0/i)
    expect(count).toBeInTheDocument()
  })
})

