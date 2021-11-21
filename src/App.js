import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import NavbarComponent from './components/Navbar';
import RegionVisualization from './components/RegionVisualization'

function App() {
  const styles={
    display: 'flex',
    flexDirection: 'column'
  }

  return (
    <BrowserRouter>
      <div style={styles}>
        <NavbarComponent />
        <Routes>
          <Route exact path='/' element={<LandingPage />} />
          <Route path='/visualize' element={<RegionVisualization />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
