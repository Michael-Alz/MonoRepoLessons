import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import AppWithModel from './AppWithModel.tsx'

// Declare the global variable for TypeScript
declare const __APP_MODE__: string;

// Automatically switch based on the build mode
const AppToRender = __APP_MODE__ === 'model' ? AppWithModel : App;

// Add a header to show which version is running
const AppWrapper = () => (
  <>
    <div style={{ 
      backgroundColor: __APP_MODE__ === 'model' ? '#e3f2fd' : '#fff3e0', 
      padding: '10px', 
      textAlign: 'center',
      borderBottom: '2px solid #ccc',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h3 style={{ margin: 0 }}>
        {__APP_MODE__ === 'model' ? '🏗️ Model-Based Version' : '🔗 Tightly-Coupled Version'}
      </h3>
      <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
        {__APP_MODE__ === 'model' 
          ? 'Business logic separated into model.ts - Easy to test!' 
          : 'Business logic mixed with UI logic - Harder to test'}
      </p>
    </div>
    <AppToRender />
  </>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
)
