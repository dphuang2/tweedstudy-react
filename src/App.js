import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/*
 *TODO:
 *Build feed with fake twitter data [tweets.json]
 *Build slider than can filter fake twitter data [tweets.json]
 */

class App extends Component {
  constructor(props) {
    super(props);
    this.data = null;
    fetch("/getTweets")
      .then((response) => {
      return response.body;
      })
      .then((json) => {
      this.data = json;
      });
  }

  handleChange(event) {
  console.log(event);
  }

  render() {
    return (
      <div className="App">
          <div className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h2>Welcome to React</h2>
              <p> Hopefully this works </p>
          </div>
          <input onChange={(e) => {this.handleChange(e)}} />
      </div>
    );
  }
}

export default App;
