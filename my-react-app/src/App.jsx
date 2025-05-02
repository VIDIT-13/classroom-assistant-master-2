                                        import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './pages/Profile';
import AssignmentList from './components/assignments/AssignmentList';
import AssignmentCreate from './components/assignments/AssignmentCreate';
import AssignmentDetail from './components/assignments/AssignmentDetail';
import SubmissionCreate from './components/submissions/SubmissionCreate';
import SubmissionList from './components/submissions/SubmissionList';
import PrivateRoute from './components/routing/PrivateRoute';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto p-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes using PrivateRoute */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/assignments" element={<AssignmentList />} />
                <Route path="/assignments/create" element={<AssignmentCreate />} />
                <Route path="/assignments/:id" element={<AssignmentDetail />} />
                <Route path="/assignments/:id/submit" element={<SubmissionCreate />} />
                <Route path="/assignments/:id/submissions" element={<SubmissionList />} />
              </Route>
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
