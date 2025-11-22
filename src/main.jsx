// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css'; 
import { CarrinhoProvider } from './context/CarrinhoContext.jsx';
import { ProdutoProvider } from './context/ProdutoContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProdutoProvider> 
        <CarrinhoProvider>
          <App />
        </CarrinhoProvider>
      </ProdutoProvider>
    </BrowserRouter>
  </React.StrictMode>,
);