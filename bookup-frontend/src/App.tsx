import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BookFinder } from './components/BookFinder/BookFinder';
import { SignIn } from './components/SignIn/SignIn';

function App() {
  return (
    <div className="App">
      <nav>
        <SignIn></SignIn>        
      </nav>
    </div>
  );
}

export default App;
