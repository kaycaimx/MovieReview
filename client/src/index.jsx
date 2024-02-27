import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from './AuthTokenContext';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from 'react';
import ReactDOM from 'react-dom/client';

import Header from './components/Header';
import Home from './components/Home';
import Pong from './components/Pong';
import Movie from './components/Movie';
import VerifyUser from './components/VerifyUser';
import NotFound from './components/NotFound';
import Profile from './components/Profile';
import AppLayout from "./components/AppLayout";
import Reviews from "./components/Reviews";
import AuthDebugger from "./components/AuthDebugger";

const requestedScopes = [
  "profile",
  "email",
  "read:movie",
  "read:user",
  "read:review",
  "edit:movie",
  "edit:user",
  "edit:review",
  "delete:movie",
  "delete:user",
  "delete:review",
  "write:user",
  "write:movie",
  "write:review",
];

function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Header/>}>
              <Route index element={<Home />} />
              <Route path="/verify-user" element={<VerifyUser />} />
              <Route path="movie/:movieId" element={<Movie />}/>  
            </Route>
            <Route
              path="app"
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
            }>
              <Route path="profile" element={<Profile />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="debugger" element={<AuthDebugger />} />
            </Route>
            <Route path="/ping" element={<Pong />} /> 
            <Route path="*" element={<NotFound />} /> 
          </Routes>          
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);
