import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BookFinder } from './components/BookFinder/BookFinder';

function App() {
  return (
    <div className="App">
      <nav>
        <p>find a book</p>
        <p>my books</p>
        <BookFinder />
      </nav>
    </div>
  );
}

export default App;
