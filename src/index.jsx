import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App.jsx';
import './styles/globals.css';
import './styles/layout.css';
import './styles/components.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

