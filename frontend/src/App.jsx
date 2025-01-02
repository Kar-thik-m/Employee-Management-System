import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SideBar from './Components/SideBar/SideBar.jsx';
import Dashboard from './Page/Dashbord/Dashbord.jsx';
import Profile from './Components/Profile/Profile.jsx';
import Home from './Page/Home/Home.jsx';
import Login from './Authentication/Login/Login.jsx';
import Register from './Authentication/Register/Register.jsx';
import { AuthProvider } from './contextApi/AuthContext.jsx';
import ProtectedRoute from './Utils/ProtectedRoute.jsx';
import TaskList from './Components/TaskList/TaskList.jsx';
import Reports from './Components/reports/reports.jsx';
import Admindashboard from './Components/Admindashboard/Admindashboard.jsx';
import AssingTask from './Components/Assing/AssingTask.jsx';



function App() {
  return (
    <AuthProvider>
      <div className="wholepage">
        <Router>
          <div className='left'>
            <SideBar />
          </div>
          <div className='right' >
            <Routes>
              <Route index path="/" element={<ProtectedRoute element={<Home />} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/tasklist" element={<ProtectedRoute element={<TaskList />} />} />
              <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
              <Route path="/reports" element={<ProtectedRoute element={<Reports />} />} />
              <Route path="/admindashboard" element={<ProtectedRoute element={<Admindashboard />} />} />
              <Route path="/assingtask" element={<ProtectedRoute element={<AssingTask />} />} />
              <Route path="*" element={<div>Not Found</div>} />
            </Routes>
          </div>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
