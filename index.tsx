import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log('App initialization started...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Could not find root element to mount to");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('App successfully mounted.');
  } catch (error) {
    console.error('Failed to mount React app:', error);
  }
}