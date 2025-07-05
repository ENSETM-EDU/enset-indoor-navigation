import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ExplorerPage from './pages/ExplorerPage';
import ExamenPage from './pages/ExamenPage';
import NavigatePage from './pages/NavigatePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explorer" element={<ExplorerPage />} />
          <Route path="/examen" element={<ExamenPage />} />
          <Route path="/navigate/:salle" element={<NavigatePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;