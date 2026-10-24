import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FinancialProvider } from './context/FinancialContext';
import { SolverErrorBoundary } from './components/SolverErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SolverErrorBoundary>
      <FinancialProvider>
        <App />
      </FinancialProvider>
    </SolverErrorBoundary>
  </React.StrictMode>,
);
