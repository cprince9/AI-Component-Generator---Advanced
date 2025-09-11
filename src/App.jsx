import React from 'react';
import "./App.css";
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Docs from './pages/Docs';
import About from './pages/About';
import NoPage from './pages/NoPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className="bg-white dark:bg-primary-bg text-gray-900 dark:text-gray-100 min-h-screen">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;