import React, { Component, Suspense, lazy } from 'react';

import logo from './logo.svg';
import './App.css';


class App extends Component {


  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            The Disease Searcher, by the HexaOne Team
          </p>
        </header>
      </div>
    );
  }
}

export default App;
