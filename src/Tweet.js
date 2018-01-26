import React, { Component } from 'react';
import './Tweet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Moment from 'react-moment';
import 'moment-timezone';
import { happyWords, sadWords } from './wordlists';

var wordSentiments = {};
var wordsHash = new Map();
var sadWildcardWords = sadWords.filter((w) => w.endsWith("*"));
var happyWildcardWords = happyWords.filter((w) => w.endsWith("*"));

var messages = undefined;
var request = fetch("/getMessages").then(resp => resp.json());
request.then(jsonObj => { 
    messages = jsonObj;
});

for(let i = 0; i < happyWords.length; i++)
    if(!happyWords[i].endsWith("*"))
        wordsHash[happyWords[i]] = 1;

for(let i = 0; i < sadWords.length; i++)
    if(!sadWords[i].endsWith("*"))
        wordsHash[sadWords[i]] = -1;

var closenessCache = {};

class Tweet extends Component {

    constructor(props) {
        super(props);
        this.orig = props;
    }

    getPopularity() {
        return this.props.retweet_count;
    }

    getWordSentiment(word) { 
        if(wordsHash.has(word))
            return wordsHash.get(word);

        for(let i = 0; i < happyWildcardWords.length; i++) {
            let happy = happyWildcardWords[i];
            if(word.startsWith(happy.substring(0, happy.length - 1))) 
            {
                wordSentiments[word] = 1;
                return 1;
            }
        }

        for(let i = 0; i < sadWildcardWords.length; i++) {
            let sad = sadWildcardWords[i];
            if(word.startsWith(sad.substring(0, sad.length - 1))) 
            {
                wordSentiments[word] = -1;
                return -1;
            }
        }
        wordSentiments[word] = 0;
        return 0;
    }

    getTextSentiment(str) {
        let words = str.toLowerCase().replace(/[^\w\s]/g, "").split(" ");
        return words.map(this.getWordSentiment.bind(this)).reduce((x, y) => x + y);
    }

    getSentiment() {
        return this.getTextSentiment(this.props.full_text);
    }

    getCelebrity() {
        let celeb = 0;

        if(this.props.user.verified)
            celeb++;

        if(this.props.user.followers_count > 100000)
            celeb += 3;
        else if(this.props.user.followers_count > 10000)
            celeb += 2;
        else if(this.props.user.followers_count > 1000)
            celeb += 1; 
        else
            celeb -= 1;
        return celeb
    }

    getFrequency() {
        const MILLIS_IN_MONTH = 30 * 24 * 60 * 60 * 1000;
        let tweetCount = this.props.user.statuses_count;
        let startDate = new Date(this.props.user.created_at);
        // Apparently this works. Who knew?
        let deltaMillis = new Date() - startDate;
        let deltaMonths = deltaMillis / MILLIS_IN_MONTH;
        return tweetCount / deltaMonths;
    }

    getCloseness() {
        // I need this so that the rest of the system will work kinda.
        return 1000;

        // TODO: Make this calculate everything at the beginning, maybe with WebWorkers, and 
        // then save it so we don't have to mess with it all the time.
        // In more detail, my plan is to do this:
        // 1. Hold all the tweet data as actual tweet objects instead of just straight json
        // 2. On startup, in a way that won't harm user experience, calculate all the closenesses (and
        // other stuff if we want) in the background to avoid the annoyance of waiting for network
        // and calculation when we're actually trying to show stuff to the user.
        // 3. This should all just work? Maybe?
        //
        // Or, better yet, I should just capture it from auth. Although they might show up
        // empty because of permissions. I dunno. Who cares. Use auth data and we should 
        // be good I think.
        return this.getUserCloseness(this.props.user);
    }


    async getUserCloseness(user) {
        if(user.id in closenessCache)
            return closenessCache[user.id];
        // I'm not really sure how we're going to get these. Assume magic
        if(messages === undefined)
            await request;

        if(messages.length === 0)
            return 0;
        let out = 0;
        if(user.followers_count > 100000)
            out -= 3;
        else if(user.followers_count > 10000)
            out -= 2;
        else if(user.followers_count > 1000)
            out -= 1;
        else
            out += 1;
        let words = messages.map(message => message
            .text.replace(/[^\w\s]/g, "")
            .split(" "))
            .reduce((x, y) => x.concat(y), []);
        let wordCount = words.length;
        if(wordCount > 1000)
            out += 10;
        else if(wordCount > 100)
            out =+ 5;
        else if(wordCount > 10)
            out += 2;
        else if(wordCount > 0)
            out += 1;

        let averageSentiment = words
            .map(this.getWordSentiment.bind(this)).reduce((x, y) => x + y) / wordCount;
        if(averageSentiment > 0)
            out += 1;
        else 
            out -= 1;

        let mostRecentMessage = messages
            .reduce((x, y) => new Date(x.created_at) > new Date(y.created_at) ? x : y);
        let timeAgo = new Date() - new Date(mostRecentMessage.created_at);
        const MILLIS_IN_HOUR = 60*1000;
        let hoursAgo = timeAgo / MILLIS_IN_HOUR;

        const HOURS_IN_DAY = 24;
        const HOURS_IN_WEEK = HOURS_IN_DAY * 7;
        const HOURS_IN_MONTH = HOURS_IN_DAY * 30;
        if(hoursAgo < 6)
            out += 10;
        else if(hoursAgo < HOURS_IN_DAY)
            out += 5;
        else if(hoursAgo < HOURS_IN_WEEK)
            out += 2;
        else if(hoursAgo < HOURS_IN_MONTH)
            out += 1;

        if(user.verified)
            out -= 1;
        else
            out += 1;

        closenessCache[user.id] = out;
        return this.getUserCloseness(user);
    }

    render() {

    const created_at = new Date(this.props.created_at);
    let time_difference = <Moment fromNow>{created_at}</Moment>

    let tweet = this.props;
    let retweet_status = null;
    if (this.props.hasOwnProperty('retweeted_status')){
        tweet = this.props.retweeted_status;
        retweet_status = <p className="col-xs-offset-2 col-xs-10"> <span className="glyphicon glyphicon-retweet" aria-hidden="true"></span> {this.props.user.screen_name} retweeted </p>;
    }

    let media = null;
    if (tweet.entities.media) {
        media = <img id="media-img" className="img-responsive img-rounded" width={tweet.entities.media[0].sizes.thumb.w * 5} src={tweet.entities.media[0].media_url} alt=""/>;
    }

    let counts = (<p>
        {
            tweet.retweeted ?
            <span style={{color: '#66ff99'}}><span id="counts" className="glyphicon glyphicon-retweet" aria-hidden="true"></span> {tweet.retweet_count}</span> :
            <span><span id="counts" className="glyphicon glyphicon-retweet" aria-hidden="true"></span> {tweet.retweet_count}</span>
        }

        {
            tweet.favorited ?
            <span style={{color: '#ff6699'}}><span id="counts" className="glyphicon glyphicon-heart" aria-hidden="true"></span>{tweet.favorite_count}</span> :
            <span><span id="counts" className="glyphicon glyphicon-heart-empty" aria-hidden="true"></span>{tweet.favorite_count}</span>
        }
        </p>)

    return ( //<p>{this.props.text}</p>
        <div id="tweet" className="row">
            {retweet_status}
            <a className="col-xs-2 col-md-offset-1 col-md-1" href={tweet.user.url}><img className='profileImg img-circle' src={tweet.user.profile_image_url} alt="profile"/></a>
            <span className="col-xs-10">
                <a href={tweet.user.url}><b>{tweet.user.name}</b></a> <span style={{color: '#808080'}}>@{tweet.user.screen_name} • {time_difference}</span>
                <p>{tweet.full_text.slice(tweet.display_text_range[0], tweet.display_text_range[1])}</p>
                {media}
                {counts}
            </span>
        </div>
    );
    }
}

export default Tweet;
