import React, { useState } from "react";
import "./loginpage.css";
import firebaseExports from './firebase';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Loginpage() {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const { firebase, firestore } = firebaseExports;

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    //Prevent page reload
    event.preventDefault();
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      navigate('/home');
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password")

    }
  };      


  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <h2>SIGN IN</h2>
          <label>Email </label>
          <input type="text" name="uname" required value={email} onChange={(e)=>setEmail(e.target.value)}/>
         
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required value={password} onChange={(e)=>setPassword(e.target.value)}/>
          
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );

  return (
     <div className="app">
      <ToastContainer />
        <div className="login-form">
            {renderForm} 
        </div>
    </div>
  );
}

export default Loginpage;