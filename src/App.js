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
            var filteredTwitter = this.data.filter(tweet => tweet.retweet_count >= filter_var);
            return filteredTwitter;
        }
        return [];
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
                {this.filterInfo(1).map((number) => <p key={number.id}>{number.text}  {number.retweet_count}</p>)}
                </div>
                <input onChange={(e) => {this.handleChange(e)}} />
                </div>
               );
    }
}

export default App;
