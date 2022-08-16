import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { QuestionsContextProvider } from './contexts/QuestionsContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QuestionsContextProvider>
      <App />
    </QuestionsContextProvider>
  </React.StrictMode>
);