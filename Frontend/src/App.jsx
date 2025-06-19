import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Upload from "./pages/Upload";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Loading from "./components/Loading";
import Results from "./pages/Results";
import Export from "./pages/Export";
import Profile from "./pages/Profile";
import { isTokenExpired, clearAuthData, refreshTokenExpiration } from "./utils/authUtils";

const App = () => {
  const navigate = useNavigate();
  
  // Check token expiration on app load
  useEffect(() => {
    if (isTokenExpired()) {
      clearAuthData();
      // Don't redirect if already on public pages
      const publicPaths = ['/', '/login', '/signup'];
      if (!publicPaths.includes(window.location.pathname)) {
        navigate('/');
      }
    }
  }, [navigate]);
  
  // Set up event listeners to refresh token expiration on user activity
  useEffect(() => {
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      refreshTokenExpiration();
    };
    
    // Add event listeners for user activity
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Set up periodic check for token expiration (every minute)
    const tokenCheckInterval = setInterval(() => {
      if (isTokenExpired()) {
        clearAuthData();
        // Only redirect if on a protected page
        const publicPaths = ['/', '/login', '/signup'];
        if (!publicPaths.includes(window.location.pathname)) {
          navigate('/');
        }
      }
    }, 60000); // Check every minute
    
    return () => {
      // Clean up event listeners and interval
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearInterval(tokenCheckInterval);
    };
  }, [navigate]);
  
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="/upload"
          element={
            <>
              <Navbar />
              <Upload />
            </>
          }
        />
        {/* Loading route without Navbar */}
        <Route path="/loading" element={<Loading />} />
        
        {/* Results route with Navbar */}
        <Route
          path="/results"
          element={
            <>
              <Navbar />
              <Results />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        

        <Route
          path="/export"
          element={<Export />}
        />

        <Route 
        path="/profile"
        element={<Profile />}
        />
  
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
    </>
  );
};

export default App;
