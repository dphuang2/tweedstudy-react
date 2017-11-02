import React, { Component } from 'react';
// import logo from './logo.svg';
import Tweet from './Tweet.js';
import DropDownMenuSimpleExample from './Dropdown.js'
import './Tweet.css';
import logo from './Twitter_Logo_WhiteOnBlue.svg';
import Authentication from './Authentication/Authentication.js';
import './App.css';
import { happyWords, sadWords } from './wordlists';
import Slider  from 'rc-slider';
import './Authentication/Authentication';
import './TweetFilterer.js';
import logo from './logo.svg';
import Slider  from 'rc-slider';
import './App.css';
import { TweetFilterer, FREQUENCY, CELEBRITY, POPULARITY, CLOSENESS, SENTIMENT } from './TweetFilterer';
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';

 class App extends Component {
  constructor(props) {
    super(props); 
    this.filterer = new TweetFilterer();
    this.state = {tweets: []};
    this.filterState = {};
  }
  
  loadFilteredTweets() {
      this.filterer.filterTweets(this.filterState).then(tweets => this.setState({tweets}));
  }

  onSliderChange(key, value) {
      this.filterState[key] = value;
      this.loadFilteredTweets();
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
    var rows = [];
    if(this.state.tweets != null && this.state.tweets !== undefined && this.state.tweets.length > 0){
      this.state.tweets.forEach(function(tweet){
          rows.push(tweet);
        }
      );
    }
    var showme = [];
    var number = 100000000;


    // console.log(this.state);

    return (
      <div className="App">
          <div className="App-header">
              <span className="Title-area col-xs-8 col-sm-5">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="Title">Twitter Study</h1>
              </span>
              <span className="Authentication-area col-xs-4 col-sm-3">
                { this.auth.getScreenNameNoWait() !== null ?
                <span className="Authentication">
                    <span className = "profileImgContainer" id="ownProfile">
                      <img className='profileImg' src={this.state.profileimg}/>
                    </span>
                    <span id="ownId">
                      <p>{this.state.username}</p>
                      <button type="button" onClick={this.logout}> Log me out! </button>
                    </span>
                </span> :
                <span className="Authentication">
                    <button type="button" onClick={this.authenticate}> Authenticate me! </button>
                </span> }
              </span>
          </div>

          <div className="Tweet-list">
             { this.auth.getScreenNameNoWait() !== null ? (
             number = this.state.value,
             showme = rows.filter(function(r){ return r.retweet_count>number;
             }),
             showme.map( r=>  <Tweet {...r} />)
             ) :
             <p> Loading... </p>
             }
          </div>

          <div className="App-footer">
            <span className="Dropdown col-xs-2">
               <DropDownMenuSimpleExample />
            </span>
            <span className="Slider col-xs-9">
                <Slider max={this.state.max} min={this.state.min} onChange={this.onSliderChange.bind(this)}/>
            </span>
          </div>
      </div>
    );
  }
}
export default App;
