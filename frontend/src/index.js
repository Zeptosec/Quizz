import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { QuestionsContextProvider } from './contexts/QuestionsContext';
import { AuthContextProvider } from './contexts/AuthContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <QuestionsContextProvider>
        <App />
      </QuestionsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);