import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Upload from "./pages/Upload";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Loading from "./components/Loading";
import Results from "./pages/Results";
import Export from "./pages/Export";

const App = () => {
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
  
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
    </>
  );
};

export default App;
