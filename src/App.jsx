import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Home from "./components/Home";
import Paste from "./components/Paste";
import ViewPaste from "./components/ViewPaste";
import Navbar from "./components/Navbar";
import './App.css';
import PastesList from "./components/PastesList";
import PasteView from "./components/PasteView";


const router = createBrowserRouter(
  [
    {
      path: "/",
      element:
        <div className="w-full h-full flex flex-col">
          <Navbar />
          <Home />
        </div>
    },
    {
      path: "/pastes",
      element: 
        <div className="w-full h-full flex flex-col">
          <Navbar />
          <Paste />
        </div>
    },
    {
      path: "/pastes/:id",
      element: 
        <div className="w-full h-full flex flex-col">
          <Navbar />
          <ViewPaste />
        </div>
    }
  ]
);

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Persist dark mode setting on page load
  useEffect(() => {
    const isDark = localStorage.getItem('dark-mode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 bg-blue-500 text-white rounded"
      >
        Toggle Dark Mode
      </button>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
