import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Users from './pages/Users/Users';
import Tasks from './pages/Tasks/Tasks';
import Navbar from './resources/Navbar';
import Notification from './resources/Notifications';
import ProtectedRoute from './resources/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Notification /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/users"
          element={<ProtectedRoute element={<Users />} allowedRoles={['admin']} />}
        />
        <Route
          path="/login"
          element={<ProtectedRoute element={<Login />} publicRoute={true} />}
        />
        <Route
          path="/register"
          element={<ProtectedRoute element={<Register />} publicRoute={true} />}
        />
        <Route
          path="/tasks"
          element={<ProtectedRoute element={<Tasks />} allowedRoles={['user', 'admin']} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
