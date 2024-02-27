import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Outlet, useNavigate } from "react-router-dom";

import '../style/style.css';

export default function Header() {
	const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  return (
		<div className='headerWrapper'>
    	<header className='header'>
        <h1>Movie Reviews</h1>
      </header>
      <div className='btnWrapper'>
				{ !isAuthenticated? (
					<button className='loginBtn' onClick={loginWithRedirect}> Log In </button>
				) : (
					<button className='loginBtn' onClick={() => navigate("/app")}> Profile </button>
				)}
        { !isAuthenticated? (
					<button className='signupBtn' onClick={signUp}> Sign Up </button>
				) : (
					<button className='signupBtn' onClick={() => logout({ returnTo: window.location.origin })}> Sign Out </button>
				)}
      </div>
			<div className='content'>
				<Outlet />	
			</div>
		</div>
	);
}