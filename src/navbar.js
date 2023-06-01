import React, {useEffect, useState} from 'react';
import Home from './home';
import Login from './login';
import Deposit from './deposit';
import CreateAccount from './createaccount';
import Withdraw from './withdraw';
import Balance from './balance';
import { UserContext } from './context';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import {logout} from './config/firebase'
import { getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import './app.css';
import '../src/index.css';
import Transfer from './transfer';

const auth = getAuth();


function NavBar() {
  const [showAlert, setShowAlert] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);        
        setDisplayName(user.displayName); // Store the display name in state
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setDisplayName('');
      }
    });

    // Check local storage for authentication token
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setIsLoggedIn(true);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    try {
      logout();
      setIsLoggedIn(false);
      setUser(null);
      setDisplayName('');
      localStorage.removeItem('authToken'); // Remove authentication token from local storage
      console.log('Logout successful, redirecting to login page');
      setShowAlert(true);
      window.location.href = '/login';
    } catch (error) {
      console.log('Logout failed', error);
    }
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-md navbar-dark">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            BadBank App
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-bs-target="#navbar"
            aria-controls="navbarNav"
            aria-expanded="true"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbar">
            <ul className="navbar-nav ">
              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link to="/deposit" className="nav-link">
                      Deposit
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/withdraw" className="nav-link">
                      Withdraw
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/transfer" className="nav-link">
                      Transfer
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/balance" className="nav-link">
                      Balance
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <ul className="navbar-nav ms-auto ">
              {!isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link to="/createaccount" className="nav-link">
                      Create Account
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">
                      Login
                    </Link>
                  </li>
                </>
              )}
              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <span className="navbar-text  "> {user.email}</span>
                  </li>
                  <li className="nav-item">
                    <button onClick={handleLogout} className="nav-link btn btn-link">
                      Logout
                    </button>
                  </li>
                </>

              )}
            </ul>
          </div>
        </div>
      </nav>
      <div className="container" style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createaccount" element={<CreateAccount />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          {isLoggedIn && (
            <>
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="/balance" element={<Balance />} />
              <Route path="/transfer" element={<Transfer />} />
              
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default NavBar;
