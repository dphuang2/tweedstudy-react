import React, { Component } from 'react';
import Tweet from './Tweet.js';
import './Tweet.css';
import logo from './Twitter_Logo_WhiteOnBlue.svg';
import Authentication from './Authentication/Authentication.js';
import './App.css';
import './Authentication/Authentication';
import TweetFilterer from './TweetFilterer.js';
import './App.css';
import FilterControl from './FilterControl.js';

 class App extends Component {
  constructor(props) {
    super(props); 
    this.auth = new Authentication();
    this.state = { tweets: [], value: 0, max: 100, min: 0, username: undefined, profileimg: "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png", filtervalue: undefined };
    this.filterer = new TweetFilterer([]);
    this.allTweets = [];

    this.auth.getTweets().then(tweets => {
        this.filterer = new TweetFilterer(tweets);
        this.allTweets = tweets;
        this.setState({tweets});
    });

    this.auth.getScreenName()
      .then((username) => {
        this.setState({
            username: username,
            profileimg: this.auth.profile_img,
            });
        });
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
      return this.auth.getScreenNameNoWait() !== undefined;
  }

  render() {
    return (
      <div className="App">
          <div className="App-header">
              <span className="Title-area col-xs-8 col-sm-5">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="Title">Twitter Study</h1>
              </span>
              <span className="Authentication-area col-xs-4 col-sm-3">
                  { !this.isLoggedIn()
                          ?
                <span className="Authentication">
                    <span className = "profileImgContainer" id="ownProfile">
                      <img alt="profileImage" className='profileImg' src={this.state.profileimg}/>
                    </span>
                    <span id="ownId">
                      <p>{this.state.username}</p>
                      <button type="button" onClick={this.logout.bind(this)}> Log me out! </button>
                    </span>
                </span> 
                        :
                <span className="Authentication">
                    <button type="button" onClick={this.authenticate.bind(this)}> Authenticate me! </button>
                </span> }
              </span>
          </div>

          <div className="Tweet-list">
             { this.isLoggedIn() ?
             this.state.tweets.map(r =>  <Tweet key={r.id.toString()} {...r} />)
             :
            <button className="btn btn-primary brn-lg btn-block" type="button" onClick={this.authenticate}> Login with twitter </button>
             }
          </div>

          <div className="App-footer">
            <FilterControl dropdownClass={"Dropdown col-xs-2"} sliderClass={"Slider col-xs-9"} onChange={filterState => this.loadFilteredTweets(filterState)} tweets={ this.allTweets } />
          </div>
      </div>
    );
  }
}
export default App;
