import React, { createContext, useState, useEffect, useContext } from 'react';

const API_URL = 'http://localhost:3001/tasks';

// 1. Criar o Context
export const TaskContext = createContext();

// 2. Hook customizado para uso
export const useTasks = () => {
  return useContext(TaskContext);
};

// 3. O TaskProvider com estado e funções CRUD
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // === READ (Busca inicial - única vez) ===
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
      setError("Não foi possível carregar as tarefas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []); // [] garante que rode apenas na montagem

  // === CREATE (Adicionar nova tarefa) ===
  const addTask = async (newTaskData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...newTaskData, 
          completed: false 
        }),
      });
      if (!response.ok) {
        throw new Error(`Erro ao adicionar: ${response.status}`);
      }
      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);
      return true; // Sucesso
    } catch (err) {
      console.error("Erro ao adicionar tarefa:", err);
      setError("Não foi possível adicionar a tarefa.");
      return false; // Falha
    }
  };

  // === UPDATE (Geral) ===
  const updateTask = async (id, updatedFields) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;

    // Mescla os campos atuais com os novos
    const newUpdatedTask = { ...taskToUpdate, ...updatedFields };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT', // PUT para substituição total
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUpdatedTask),
      });
      if (!response.ok) {
        throw new Error(`Erro ao atualizar: ${response.status}`);
      }
      
      // Atualiza o estado local
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? newUpdatedTask : task))
      );
      return true;
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err);
      setError("Não foi possível atualizar a tarefa.");
      return false;
    }
  };
  
  // === UPDATE (Toggle específico) ===
  const toggleTask = (id) => {
      const taskToToggle = tasks.find(task => task.id === id);
      if (taskToToggle) {
          updateTask(id, { completed: !taskToToggle.completed });
      }
  }


  // === DELETE (Deletar tarefa) ===
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Erro ao deletar: ${response.status}`);
      }
      // Remove do estado local
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      return true;
    } catch (err) {
      console.error("Erro ao deletar tarefa:", err);
      setError("Não foi possível deletar a tarefa.");
      return false;
    }
  };

  const contextValue = {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};