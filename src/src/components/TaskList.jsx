import React from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import TaskForm from './TaskForm'; // Inclui o formulário aqui

function TaskList() {
  const { tasks, loading, error, toggleTask } = useTasks();

  if (loading) return <h1>Carregando tarefas...</h1>;
  if (error) return <h1 style={{ color: 'red' }}>Erro: {error}</h1>;
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Gerenciador de Tarefas</h1>
      
      {/* Formulário de Criação */}
      <TaskForm />

      <h2>Lista de Tarefas ({tasks.length})</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '10px', 
              borderBottom: '1px solid #eee' 
            }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              style={{ marginRight: '10px' }}
            />
            <span 
              style={{ 
                flexGrow: 1,
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? '#888' : '#000',
              }}
            >
              {task.title}
            </span>
            <Link to={`/task/${task.id}`} style={{ marginLeft: '15px' }}>
              Ver Detalhes
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;