// Exemplo em src/App.jsx
import { useTasks } from './context/TaskContext';

function App() {
  const { tasks, loading, error, toggleTask, deleteTask } = useTasks();

  if (loading) return <div>Carregando tarefas...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Gerenciador de Tarefas</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}>Deletar</button>
          </li>
        ))}
      </ul>
      {/* Aqui você adicionaria o componente para adicionar nova tarefa, usando addTask */}
    </div>
  );
}

export default App;