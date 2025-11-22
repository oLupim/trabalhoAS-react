import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';

function TaskForm() {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');

    // Validação Simples: Título obrigatório
    if (title.trim() === '') {
      setFeedback('O título da tarefa é obrigatório!');
      return;
    }

    const success = await addTask({ title, description });

    if (success) {
      setTitle('');
      setDescription('');
      setFeedback('Tarefa adicionada com sucesso!');
    } else {
      setFeedback('Erro ao adicionar a tarefa.');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px 0' }}>
      <h3>Adicionar Nova Tarefa</h3>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" style={{ marginTop: '10px', padding: '10px' }}>
          Salvar Tarefa
        </button>
      </form>
      {feedback && <p style={{ color: feedback.startsWith('Erro') ? 'red' : 'green' }}>{feedback}</p>}
    </div>
  );
}

export default TaskForm;