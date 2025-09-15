import { useState } from 'react';
import './App.css';

function App() {
	const [count, setCount] = useState(0);

	return (
		<div className="App">
			<h1>Langze An (Michael)</h1>

			<h2>Count: {count}</h2>
			<button onClick={() => setCount(count + 1)}>Click Me</button>

			<input type="text" />
		</div>
	);
}

export default App;
