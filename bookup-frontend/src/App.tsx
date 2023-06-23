import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BookFinder } from './components/BookFinder/BookFinder';
import { SignIn } from './components/SignIn/SignIn';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MyBooks } from './components/MyBooks/MyBooks';
import { Buser } from './models/User';

function App() {

  const [currUser, setCurrUser] = useState<Buser>()
  console.log(currUser);
  

  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path='/' element={<SignIn activeUser={active => setCurrUser(active)}/>} />
        <Route path='/mybooks' element={<MyBooks currentUser={currUser!}/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
