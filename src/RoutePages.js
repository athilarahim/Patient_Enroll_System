// App.js
import React from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import App from './App';
import Loginpage from './loginpage';

function RoutePages() {
  return (
    <Router>
      <Routes>
      <Route exact path="/" element={<Loginpage />} />
      <Route path="/home" element={<App />} />
      </Routes>
    </Router>
  );
}

export default RoutePages;
