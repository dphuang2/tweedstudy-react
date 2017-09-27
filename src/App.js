import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/*
 *TODO:
 *Build feed with fake twitter data [tweets.json]
 *Build slider than can filter fake twitter data [tweets.json]
 */

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
          <p> Hopefully this works </p>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <div className="App-first-tweet ">
          <div className="container">
            <div className="row">
              <div className="col-md-4 col-md-offset-4">

                <div className="row">
                  <div className="col-md-4">
                    <img src={logo} className="App-pro_pic" alt="logo" />
                  </div>
                  <div className="App-tweet-info col-md-6">
                    <p>Name &nbsp;<i>Handle</i></p>
                    <p> My first tweet </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
