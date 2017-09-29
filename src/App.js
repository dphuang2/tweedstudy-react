import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Slider, { Range } from 'rc-slider';
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
    this.state = { value: 0 };
    this.data = null;
    fetch("/getTweets")
      .then((response) => {
      return response.json();
      })
      .then((json) => {
      this.data = json;
      console.log(json);
      this.forceUpdate();
      });
  }


  filterInfo(filter_var)
  {
    if(this.data != null)
    {
    var filteredTwitter = this.data.filter(tweet => tweet.retweet_count >= filter_var)
    //console.log(this.data[0].favourites_count)
    //console.log(filteredTwitter);
    return filteredTwitter;
    }
    return [];
  }

  handleChange(event) {
  console.log(event);
  }

  onSliderChange = (value) => {
    this.setState({
      value,
    });
  }

  render() {
    return (
      <div className="App">
          <div className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h2>Welcome to React</h2>
              <div>
                  <Slider onChange={this.onSliderChange}/>
              </div>
              <p> Hopefully this works </p>
        {this.filterInfo(this.state.value).map((number) => <p key={number.id}>{number.text}  {number.retweet_count}</p>)}
          </div>
          <input onChange={(e) => {this.handleChange(e)}} />
      </div>
    );
  }
}
export default App;
