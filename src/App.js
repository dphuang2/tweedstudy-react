import React, { Component } from 'react';

import Tweet from './Tweet.js';

import Authentication from './Authentication/Authentication.js';
import './Authentication/Authentication';

import TweetFilterer from './TweetFilterer.js';
import FilterControl from './FilterControl.js';

import TweetView from './TweetView';

import './Tweet.css';
import './App.css';

 class App extends Component {
  constructor(props) {
    super(props);
    this.auth = new Authentication();
    this.state = {
        tweets: [],
        value: 0,
        max: 100,
        min: 0,
        username: undefined,
        profileimg: "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
        filtervalue: undefined };

    this.filterer = new TweetFilterer([]);
    this.allTweets = [];
    this.messages = [];

    if(this.isLoggedIn()) {
        this.auth.getTweets().then(tweets => {
            App.messages = this.auth.getMessagesNoWait();
            this.allTweets = tweets.map(t => new Tweet(t));
            this.filterer = new TweetFilterer(this.allTweets);
            this.setState({ tweets: this.allTweets });
        });

        this.auth.getScreenName()
            .then((username) => {
                this.setState({
                    username: username,
                    profileimg: this.auth.profile_img,
                });
            });
      }

  }

  onSliderChange(value) {
    this.setState({
      value,
    });
  }

     // A filterState is an object where they keys are one of FREQUENCY, CELEBRITY, POPULARITY, CLOSENESS, SENTIMENT,
     // And the values are the numerical minumum values of the appropriate feature. Not all of the keys
     // must appear, but no keys other than the ones specifically allowed may appear.
  loadFilteredTweets(filterState) {
      this.filterer.filterTweets(filterState).then(tweets => this.setState({tweets}));
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

  isLoggedIn() {
      return this.auth.isAuthenticated();
  }

  render() {
    return (
      <div className="container">
        <header>
              <h1 className="title">Twitter Study</h1>
              {
                  this.isLoggedIn() &&
                  (<div className="profile">
                      <img className='profile-img' src={this.state.profileimg} alt="user profile"/>
                      <p className="username">{this.state.username}</p>
                      <button type="button" onClick={this.logout.bind(this)}>Log out</button>
                  </div>)
              }
          </header>

          <div className="main">
              {
                { this.isLoggedIn() ?
                  this.state.tweets.map(r =>
                    <TweetView key={ r.id.toString() } tweet={ r } />
                  ):
                  <button type="button" onClick={this.authenticate.bind(this)}> Login with twitter </button>
               }
          </div>

          <div className="footer">
            <FilterControl dropdownClass={"dropdown"} sliderClass={"slider"} onChange={filterState => this.loadFilteredTweets(filterState)} tweets={ this.allTweets } />
          </div>
      </div>
    );
  }
}
export default App;
