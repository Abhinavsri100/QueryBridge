import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { logout } from '../slices/authSlice';
import { Database, LogOut, MessageSquare, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <Database size={24} />
          <span>TalkWithDB</span>
        </Link>
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-item">
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
              <Link to="/chat" className="nav-item">
                <MessageSquare size={20} />
                <span>Chat</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-login">Login</Link>
              <Link to="/signup" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
