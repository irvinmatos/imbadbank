import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Home from './home';
import NavBar from './navbar';
import CreateAccount from './createaccount';
import Login from './login';
import Deposit from './deposit';
import Withdraw from './withdraw';
import AllData from './alldata';
import Transfer from './transfer';
import { auth } from './config/firebase';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in
        setIsLoggedIn(true);
        setUser(user);
        setDisplayName(user.displayName);
      } else {
        // User is logged out
        setIsLoggedIn(false);
        setUser(null);
        setDisplayName('');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    // Show a loading state while checking authentication
    return <p>Loading...</p>;
  }

  return (
    <>
    <NavBar isLoggedIn={isLoggedIn} handleLogout={() => auth.signOut()} />
    <Router>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/createAccount"
            element={isLoggedIn ? <Navigate to="/" /> : <CreateAccount setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/deposit"
            element={isLoggedIn ? <Deposit email={user.email} /> : <Navigate to="/login" />}
          />
          <Route
            path="/withdraw"
            element={isLoggedIn ? <Withdraw email={user.email} /> : <Navigate to="/login" />}
          />
          <Route
            path="/transfer"
            element={isLoggedIn ? <Transfer email={user.email} /> : <Navigate to="/login" />}
          />
          <Route path="/allData" element={isLoggedIn ? <AllData /> : <Navigate to="/login" />} />
        </Routes>
      
    </Router>
    
    </>
  );
}

export default App;
