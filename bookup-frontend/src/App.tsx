import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { SignIn } from './components/SignIn/SignIn';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MyBooks } from './components/MyBooks/MyBooks';
import { Buser } from './models/User';
import { Chat } from './components/Chat/Chat';

function App() {

  const [currUser, setCurrUser] = useState<Buser>()
  const [chatUser, setChatUser] = useState<Buser>()
  console.log("currUser " + JSON.stringify(currUser));
  console.log("chatUser" + chatUser); 
  

  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path='/' element={<SignIn activeUser={active => setCurrUser(active)} chatUser={chatUser => setChatUser(chatUser)}/>} />
        <Route path='/mybooks' element={<MyBooks currentUser={currUser!}/>} />
        <Route path='/chat' element={<Chat currentUser={currUser!} chatUser={chatUser!}/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
