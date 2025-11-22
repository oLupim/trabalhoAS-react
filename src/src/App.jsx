import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext.jsx'; // Importa o Provider
import TaskList from './components/TaskList.jsx';
import TaskDetail from './components/TaskDetail.jsx';

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

// 2. Componente App: Envolve a aplicação com o Provider e o Router
function App() {
  return (
    <TaskProvider>
      <div 
        style={{
          maxWidth: '800px', 
          margin: '0 auto',  
          padding: '20px'   
        }}
      > 
        <RouterProvider router={router} />
      </div>
    </TaskProvider>
  );
}

export default App;