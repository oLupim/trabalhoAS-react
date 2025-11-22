import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, updateTask, deleteTask } = useTasks();
  
  // Encontra a tarefa no estado global pelo ID (que é uma string na rota)
  const task = tasks.find((t) => t.id === parseInt(id));

  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  if (!task) {
    return <h1>Tarefa não encontrada no estado global.</h1>;
  }

  const handleEdit = async (e) => {
    e.preventDefault();
    if (title.trim() === '') {
      alert('O título não pode ser vazio.');
      return;
    }

    const success = await updateTask(task.id, { title, description });
    if (success) {
      setEditMode(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja deletar a tarefa: "${task.title}"?`)) {
      const success = await deleteTask(task.id);
      if (success) {
        navigate('/'); // Volta para a lista após deletar
      }
    }
  };
  
  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd' }}>
      <Link to="/" style={{ marginBottom: '20px', display: 'block' }}>
        ← Voltar para a Lista
      </Link>
      
      {editMode ? (
        // Modo Edição
        <>
          <h2>Editar Tarefa</h2>
          <form onSubmit={handleEdit}>
            <div>
              <label>Título:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div style={{ marginTop: '10px' }}>
              <label>Descrição:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div style={{ marginTop: '15px' }}>
              <button type="submit" style={{ padding: '10px' }}>Salvar Alterações</button>
              <button 
                type="button" 
                onClick={() => {
                    setEditMode(false);
                    setTitle(task.title); // Restaura os valores originais
                    setDescription(task.description);
                }} 
                style={{ marginLeft: '10px', padding: '10px' }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </>
      ) : (
        // Modo Visualização
        <>
          <h2>{task.title}</h2>
          <p>
            <strong>ID:</strong> {task.id}
          </p>
          <p>
            <strong>Status:</strong> {task.completed ? 'Concluída' : 'Pendente'}
          </p>
          <p>
            <strong>Descrição:</strong> {task.description || 'Nenhuma descrição fornecida.'}
          </p>
          
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={() => setEditMode(true)} 
              style={{ padding: '10px' }}
            >
              Editar Tarefa
            </button>
            <button 
              onClick={handleDelete} 
              style={{ marginLeft: '10px', padding: '10px', backgroundColor: 'red', color: 'white' }}
            >
              Deletar Tarefa
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskDetail;