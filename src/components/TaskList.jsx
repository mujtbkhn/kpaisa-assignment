import React, { useContext, useState, useEffect } from 'react';
import { TaskContext } from '../contexts/TaskContext';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

function TaskList() {
  const { tasks, addNewTask, toggleTaskCompletion, removeTask } = useContext(TaskContext);
  const { user, logout } = useContext(AuthContext);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      await addNewTask(newTaskTitle, newTaskDescription);
      setNewTaskTitle('');
      setNewTaskDescription('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Task List</h1>
      <form onSubmit={handleAddTask} className="mb-6">
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task title"
            required
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Task description"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Task
          </button>
        </div>
      </form>
      <TransitionGroup className="space-y-2">
        {tasks.map((task) => (
          <CSSTransition key={task.id} timeout={300} classNames="task">
            <div className="flex items-center justify-between bg-white p-4 rounded-md shadow">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => removeTask(task.id)}
                className="text-red-600 hover:text-red-800 focus:outline-none"
              >
                Delete
              </button>
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Logout
      </button>
    </div>
  );
}

export default TaskList;