import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Slider  from 'rc-slider';
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';
/*
 *TODO:
 *Build feed with fake twitter data [tweets.json]
 *Build slider than can filter fake twitter data [tweets.json]
 */

 class App extends Component {
  constructor(props) {
    super(props); 
    this.state = { value: 0, max: 100, min: 0 };
    this.data = null;
    fetch("/getTweets")
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.data = json;
        this.setState({
            min: this.getSmallestPop(this.data),
            max: this.getLargestPop(this.data)
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
      if(this.data != null)
      {
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

  render() {
    return (
      <div className="App">
          <div className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h2>Welcome to React</h2>
              <div>
                  <Slider max={this.state.max} min={this.state.min} onChange={this.onSliderChange.bind(this)}/>
              </div>
              <p> Hopefully this works </p>
                {this.filterInfo(this.state.value).map((number) => <p className="tweet" key={number.id}>{number.text}  {number.retweet_count}</p>)}
          </div>
      </div>
    );
  }
}
export default App;
