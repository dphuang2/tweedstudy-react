import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Tweet from './Tweet.js'

var tweetData = require('./tweets.json');

/*
 *TODO:
 *Build feed with fake twitter data [tweets.json]
 *Build slider than can filter fake twitter data [tweets.json]
 */

class App extends Component {
  render() {
    var tweetObjs = [];
    for(var i = 0; i < tweetData.length; i++){
      tweetObjs.push(<Tweet key={i} i={i} />);
    }
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
        <div className="App-tweet-section">
          {tweetObjs}
        </div>
      </div>
    );
  }
}

export default App;
