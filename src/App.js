import React, { Component } from 'react';
import Tweet from './Tweet.js';
import DropDownMenuSimpleExample from './Dropdown.js'
import './Tweet.css';
import Authentication from './Authentication/Authentication.js';
import './App.css';
import { happyWords, sadWords } from './wordlists';
import Slider  from 'rc-slider';
import './Authentication/Authentication';
import 'rc-slider/assets/index.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.wordSentiments = {};
        this.state = { value: 0, max: 100, min: 0, username: undefined, profileimg: "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png", filtervalue: undefined};
        this.data = null;
        this.authenticate = this.authenticate.bind(this);
        this.logout = this.logout.bind(this);
        this.auth = new Authentication();
        this.auth.getScreenName()
            .then((username) => {
                this.setState({
                    username: username,
                    tweets: this.auth.tweets,
                    profileimg: this.auth.profile_img,
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
        var rows = [];
        if(this.state.tweets != null && this.state.tweets !== undefined && this.state.tweets.length > 0) {
            this.state.tweets.forEach(function(tweet) {
                rows.push(tweet);
            }
            );
        }
        var showme = [];
        var number = 100000000;

        return (
            <div className="container-fluid">
                <div className="App-header row">
                    <h1 className="col-xs-offset-1 col-xs-8 Title">Twitter Study</h1>
                    {
                        this.auth.getScreenNameNoWait() !== null &&
                            (<div className="col-xs-3">
                                <img className='profile-img img-circle' src={this.state.profileimg} alt="user profile"/>
                                <p className="hidden-xs">{this.state.username}</p>
                                <button className="btn btn-danger btn-xs" type="button" onClick={this.logout}>Log out</button>
                            </div>)
                    }
                </div>

                <div id="tweet-list">
                    {
                        this.auth.getScreenNameNoWait() !== null ? (
                            number = this.state.value,
                            showme = rows.filter(function(r) { return r.retweet_count>number; }),
                            showme.map( r=>  <Tweet key={r.id} {...r} />)
                        ) : (!this.auth.loading && <button className="btn btn-primary brn-lg btn-block" type="button" onClick={this.authenticate}> Login with twitter </button>)
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

                {this.auth.loading  &&
                        <div className="loading">
                            <div className="line"></div>
                            <div className="line"></div>
                            <div className="line"></div>
                        </div> }
                    </div>
        );
    }
}
export default App;
