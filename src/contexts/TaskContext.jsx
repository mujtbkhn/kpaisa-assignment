import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getTasks, addTask, updateTask, deleteTask } from '../services/api';
import { AuthContext } from './AuthContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchTasks = useCallback(async () => {
    if (user) {
      try {
        const fetchedTasks = await getTasks(user.id);
        console.log('Fetched tasks:', fetchedTasks);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addNewTask = async (title, description) => {
    if (user) {
      try {
        const newTask = await addTask(user.id, title, description);
        console.log('New task added:', newTask);
        setTasks(prevTasks => [...prevTasks, newTask]);
      } catch (error) {
        console.error('Failed to add task:', error);
      }
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    if (user) {
      try {
        const taskToUpdate = tasks.find(t => t.id === taskId);
        if (taskToUpdate) {
          const updatedTask = await updateTask(user.id, taskId, { completed: !taskToUpdate.completed });
          setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? updatedTask : task));
        }
      } catch (error) {
        console.error('Failed to update task:', error);
      }
    }
  };

  const removeTask = async (taskId) => {
    if (user) {
      try {
        await deleteTask(user.id, taskId);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addNewTask, toggleTaskCompletion, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};