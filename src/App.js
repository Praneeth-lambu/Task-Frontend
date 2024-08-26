import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Users from './pages/Users/Users';
import Tasks from './pages/Tasks/Tasks';
import PrivateRoute from './resources/Privateroute';
import Navbar from './resources/Navbar';
import ProtectedRoute from './resources/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/users"
          element={<ProtectedRoute element={<Users />} />}
        />
        <Route
          path="/tasks"
          element={<PrivateRoute element={<Tasks />}/>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
