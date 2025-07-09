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
  
  // Check token expiration on app load - no redirects
  useEffect(() => {
    if (isTokenExpired()) {
      clearAuthData();
      // We don't redirect anywhere - always stay where the user is
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
    
    // Set up periodic check for token expiration (every minute) - no redirects
    const tokenCheckInterval = setInterval(() => {
      if (isTokenExpired()) {
        clearAuthData();
        // We no longer redirect the user regardless of which page they're on
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
        <Route path="/login" element={<Navigate to="/" />} />
        <Route path="/signup" element={<Navigate to="/" />} />
        

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
