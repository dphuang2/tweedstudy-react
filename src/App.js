import React, { Component } from 'react';
import logo from './logo.svg';
import Authentication from './Authentication/Authentication.js'
import './App.css';
import { happyWords, sadWords } from './wordlists';
import Slider  from 'rc-slider';
import './Authentication/Authentication';
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';

import Tweet from './Tweet.js'

var tweetData = require('./tweets.json');
/*
 *TODO:
 *Build feed with fake twitter data [tweets.json]
 *Build slider than can filter fake twitter data [tweets.json]
 */

 class App extends Component {
  constructor(props) {
    super(props); 
    this.wordSentiments = {};
    this.state = { value: 0, max: 100, min: 0, username: undefined };
    this.auth = new Authentication();
    this.data = null;
    this.authenticate = this.authenticate.bind(this);
    this.logout = this.logout.bind(this);
    this.auth.getScreenName()
      .then((username) => {
        this.setState({
            username
            });
        });
  }

  getSmallestPop(tweets) {
      return tweets.map(this.getPopularity).reduce((a, b) => a < b ? a : b);
  }

  getLargestPop(tweets) {
      return tweets.map(this.getPopularity).reduce((a, b) => a > b ? a : b);
  }

  filterInfo(filter_var)
  {
      if(this.data != null) {
          var filteredTwitter = this.data.filter(tweet => this.getPopularity(tweet) >= filter_var);
          return filteredTwitter;
      } else {
          return [];
      }
  }

  onSliderChange(value) {
    this.setState({
      value,
    });
  }

  getPopularity(tweet) {
      return tweet.retweet_count;
  }

  getWordSentiment(word) {
      if(this.wordSentiments.hasOwnProperty(word))
          return this.wordSentiments[word];
      
      for(let i = 0; i < sadWords.length; i++) {
          let sad = sadWords[i];
          if(sad === word || (sad.endsWith("*") && word.startsWith(sad.substring(0, sad.length - 1)))) {
              this.wordSentiments[word] = -1;
              return -1;
          }
      }

      for(let i = 0; i < happyWords.length; i++) {
          let happy = happyWords[i];
          if(happy === word || (happy.endsWith("*") && word.startsWith(happy.substring(0, happy.length - 1)))) {
              this.wordSentiments[word] = 1;
              return 1;
          }
      }
      return 0;
  }

  getSentiment(tweet) {
      let words = tweet.toLowerCase().replace(/[^\w\s]/g, "").split(" ");
      return words.map(this.getWordSentiment.bind(this)).reduce((x, y) => x + y);
  }

  getCelebrity(tweet) {
      let celeb = 0;

      if(tweet.user.verified)
          celeb++;

      if(tweet.user.followers_count > 100000)
          celeb += 3;
      else if(tweet.user.followers_count > 10000)
          celeb += 2;
      else if(tweet.user.followers_count > 1000)
          celeb += 1; 
      else
          celeb -= 1;
    return celeb
  }

  authenticate() {
      this.auth.authenticate().then(url => { 
              window.location = url;
        });
  }

  logout() {
      this.auth.logout();
      this.setState({username: undefined});
  }

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
              <div>
                  <Slider max={this.state.max} min={this.state.min} onChange={this.onSliderChange.bind(this)}/>
              </div>
            {this.filterInfo(this.state.value)
            .map((number) => 
                    <p className="tweet" key={number.id}>{number.text}  {number.retweet_count}</p>)}
          </div>
          { this.auth.getScreenNameNoWait() !== null ? 
                <div className="Authentication">
                    <p>Hi {this.state.username} </p>
                    <button type="button" onClick={this.logout}> Log me out! </button>
                </div> :
                <div className="Authentication">
                    <button type="button" onClick={this.authenticate}> Authenticate me! </button>
                </div> }
      </div>
    );
  }
}
export default App;
