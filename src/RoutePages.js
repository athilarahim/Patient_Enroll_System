// App.js
import React from 'react';
import { BrowserRouter as Router,Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Loginpage from './loginpage';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

function RoutePages() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Loginpage />} />
        <Route path="/home" element={user ? <App /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to={user ? "/home" : "/"} replace />} />
      </Routes>
    </Router>
  );
}

export default RoutePages;
