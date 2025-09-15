# Lesson-00: Creating a React Vite Project
**Date: September 8**

## 🎯 Learning Objectives
By the end of this lesson, you will be able to:
- Set up a modern React development environment using Vite
- Understand the project structure of a React Vite application
- Run a development server and build your React app
- Configure basic project settings

## 📋 Prerequisites
Before starting, ensure you have the following installed on your system:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- A code editor (VS Code recommended)
- Git (for version control)

### Verify Your Installation
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show a version number
```

## 🚀 Step 1: Create a New React Vite Project

Vite is a modern build tool that provides a faster development experience compared to traditional tools like Create React App.

### Option A: Using npm
```bash
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
```

### Option B: Using yarn
```bash
yarn create vite my-react-app --template react-ts
cd my-react-app
yarn install
```

### Option C: Interactive Creation
```bash
npm create vite@latest
# Follow the prompts:
# 1. Project name: my-react-app
# 2. Select framework: React
# 3. Select variant: TypeScript
```

## 📁 Understanding the Project Structure

After creation, your project will have this structure:

```
my-react-app/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### Key Files Explained:

- **`index.html`**: The main HTML file that serves as the entry point
- **`src/main.tsx`**: The TypeScript entry point that renders your React app
- **`src/App.tsx`**: The main React component (TypeScript)
- **`src/vite-env.d.ts`**: TypeScript declarations for Vite
- **`tsconfig.json`**: TypeScript configuration for your app
- **`tsconfig.node.json`**: TypeScript configuration for Node.js (build tools)
- **`vite.config.ts`**: Vite configuration file (TypeScript)
- **`package.json`**: Project dependencies and scripts

## 🏃‍♂️ Step 2: Running Your Development Server

Navigate to your project directory and start the development server:

```bash
cd my-react-app
npm run dev
# or
yarn dev
```

You should see output similar to:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and navigate to `http://localhost:5173/` to see your React app running!

## 🛠️ Step 3: Available Scripts

Your `package.json` includes several useful scripts:

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint (if configured)
```

## 🎨 Step 4: Making Your First Changes

Let's customize the default app:

1. Open `src/App.tsx` in your code editor
2. Replace the content with:

```tsx
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState<number>(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to CS 5500!</h1>
        <p>This is my first React Vite TypeScript project.</p>
        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
      </header>
    </div>
  )
}

export default App
```

3. Save the file and watch your browser automatically reload with the changes!

## 🎯 Why TypeScript?

TypeScript provides several advantages for software engineering:

- **Type Safety**: Catch errors at compile time instead of runtime
- **Better IDE Support**: Enhanced autocomplete, refactoring, and navigation
- **Self-Documenting Code**: Types serve as inline documentation
- **Easier Refactoring**: Confident code changes with type checking
- **Team Collaboration**: Clear interfaces and contracts between code modules

### TypeScript Features You'll Notice:

- **Type Annotations**: `useState<number>(0)` explicitly types the state
- **Automatic Type Inference**: TypeScript infers return types when possible
- **Interface Definitions**: Define shapes of objects and props (we'll see this in later lessons)
- **Compile-Time Checking**: Errors caught before your code runs
- **Better IntelliSense**: Enhanced autocomplete and error detection in your IDE

## 🔧 Step 5: Additional Configuration (Optional)

### Installing Additional Dependencies
Common packages you might want to add (with TypeScript support):

```bash
# For routing (includes TypeScript types)
npm install react-router-dom
npm install @types/react-router-dom

# For HTTP requests (includes TypeScript types)
npm install axios

# For styling with TypeScript support
npm install styled-components
npm install @types/styled-components
# or
npm install @mui/material @emotion/react @emotion/styled
```

### TypeScript Configuration

The `tsconfig.json` file controls TypeScript compilation. Key settings include:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Environment Variables
Create a `.env` file in your project root for environment variables:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=My React App
```

Access them in your code with `import.meta.env.VITE_API_URL`

## 🏗️ Step 6: Building for Production

When you're ready to deploy:

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

## 🎯 Assignment

1. **Copy this lesson to your work directory**:
   ```bash
   cp -r source/lessons/lesson-00/ work/lessons/lesson-00/
   ```

2. **Create your React Vite project** following the steps above

3. **Customize your app** with:
   - Change the title to include your name
   - Add at least 2 interactive elements (buttons, inputs, etc.)
   - Style it with custom CSS

4. **Commit your work** to your fork:
   ```bash
   git add work/lessons/lesson-00/
   git commit -m "Complete lesson-00: React Vite setup"
   git push origin main
   ```

## 🆘 Troubleshooting

### Common Issues:

**Port already in use:**
```bash
npm run dev -- --port 3000
```

**Node version too old:**
- Update Node.js to version 18 or higher

**Permission errors:**
- On macOS/Linux, avoid using `sudo` with npm
- Consider using a Node version manager like `nvm`

**Vite not found:**
```bash
npm install -g create-vite
```

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [ES6+ JavaScript Features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [VS Code React Extensions](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)

## 🎉 Next Steps

In the next lesson, we'll explore:
- React components and props
- State management with hooks
- Event handling
- Component lifecycle

---

**Great job completing your first lesson!** 🚀

Remember to commit your work and push it to your fork regularly.
