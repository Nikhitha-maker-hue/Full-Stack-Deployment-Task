import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link className="brand" to={isAuthenticated ? "/tasks" : "/login"}>
          <span className="brand-mark">✓</span>
          TaskFlow
        </Link>

        {isAuthenticated && (
          <nav className="nav-links" aria-label="Main navigation">
            <NavLink to="/tasks" end>Tasks</NavLink>
            <NavLink to="/tasks/new">New Task</NavLink>
          </nav>
        )}

        {isAuthenticated && (
          <div className="nav-user">
            <span className="user-name">{user?.name}</span>
            <button className="button button-ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}