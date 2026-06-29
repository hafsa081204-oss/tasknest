import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
      location.pathname === path
        ? 'bg-primary text-white'
        : 'text-gray-600 hover:bg-indigo-50 hover:text-primary'
    }`;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="text-2xl font-bold text-primary tracking-tight">
          Task<span className="text-gray-800">Nest</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
          <Link to="/tasks" className={linkClass('/tasks')}>Tasks</Link>
          <div className="ml-4 flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              Hi, <span className="font-semibold text-gray-700">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;