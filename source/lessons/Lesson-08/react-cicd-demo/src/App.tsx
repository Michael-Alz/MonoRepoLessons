import { useState } from 'react'

function App() {
  const [count, setCount] = useState<number>(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>React CI/CD Demo</h1>
        <p>Click count: {count}</p>
        <button onClick={() => setCount(count + 1)}>
          Increment
        </button>
        <button onClick={() => setCount(0)}>
          Reset
        </button>
      </header>
    </div>
  )
}

export default App

