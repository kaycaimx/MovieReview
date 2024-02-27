import "../style/appLayout.css";

import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function AppLayout() {
  const { user, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <div className="appTitle">
        <h1>Movie Reviews</h1>
      </div>
      <div className="appHeader">
        <nav className="menu">
          <ul className="menu-list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="profile">Profile</Link>
            </li>
            <li>
              <Link to="reviews">My Reviews</Link>
            </li>
            <li>
              <Link to="debugger">Auth Debugger</Link>
            </li>
            <li>
              <button
                className="exit-button"
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                LogOut
              </button>
            </li>
          </ul>
        </nav>
        <div>Welcome 👋 {user.name} </div>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}