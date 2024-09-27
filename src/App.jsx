import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <div className="min-h-screen bg-gray-100">
            <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route 
                    path="/tasks" 
                    element={
                      <PrivateRoute>
                        <TaskList />
                      </PrivateRoute>
                    } 
                  />
                  <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
              </div>
            </div>
          </div>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;