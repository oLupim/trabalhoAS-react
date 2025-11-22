import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import TaskList from './components/TaskList.jsx';
import TaskDetail from './components/TaskDetail.jsx';
import { TaskProvider } from './context/TaskContext.jsx';

// 1. Defina as Rotas
const router = createBrowserRouter([
  {
    path: '/',
    element: <TaskList />, // Rota principal: Lista de Tarefas
  },
  {
    path: '/task/:id',
    element: <TaskDetail />, // Rota de detalhe/edição
  },
]);

// 2. Renderize a Aplicação com o Provider e o Router
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TaskProvider>
      <RouterProvider router={router} />
    </TaskProvider>
  </React.StrictMode>,
);