const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let users = JSON.parse(localStorage.getItem('users')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
let nextUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
let nextTaskId = Object.values(tasks).flat().length > 0 
  ? Math.max(...Object.values(tasks).flat().map(t => t.id)) + 1 
  : 1;

const saveData = () => {
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const registerUser = async (email, password) => {
  await delay(500);
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  const newUser = { id: nextUserId++, email, password };
  users.push(newUser);
  tasks[newUser.id] = [];
  saveData();
  return { user: { id: newUser.id, email: newUser.email } };
};

export const loginUser = async (email, password) => {
  await delay(500);
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    return { user: { id: user.id, email: user.email } };
  }
  throw new Error('Invalid credentials');
};

export const getTasks = async (userId) => {
  await delay(500);
  return [...(tasks[userId] || [])];
};

export const addTask = async (userId, title, description) => {
  await delay(500);
  const newTask = { id: nextTaskId++, title, description, completed: false };
  if (!tasks[userId]) {
    tasks[userId] = [];
  }
  tasks[userId].push(newTask);
  saveData();
  return { ...newTask };
};

export const updateTask = async (userId, taskId, updates) => {
  await delay(500);
  const task = tasks[userId].find(t => t.id === taskId);
  if (task) {
    Object.assign(task, updates);
    saveData();
    return { ...task };
  }
  throw new Error('Task not found');
};

export const deleteTask = async (userId, taskId) => {
  await delay(500);
  const index = tasks[userId].findIndex(t => t.id === taskId);
  if (index !== -1) {
    tasks[userId].splice(index, 1);
    saveData();
  }
};