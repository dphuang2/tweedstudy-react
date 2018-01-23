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

for(let i = 0; i < happyWords.length; i++)
    if(!happyWords[i].endsWith("*"))
        wordsHash[happyWords[i]] = 1;

for(let i = 0; i < sadWords.length; i++)
    if(!sadWords[i].endsWith("*"))
        wordsHash[sadWords[i]] = -1;

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
        return this.getTextSentiment(this.props.text);
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

    async getCloseness() {
        return await this.getUserCloseness(this.props.user);
    }

    async getUserCloseness(user) {
        // I'm not really sure how we're going to get these. Assume magic
        // Also implement caching for this at some point
        let messages = JSON.parse(await fetch("/getMessages"));
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

        return out;
    }


    render() {
        const created_at = new Date(this.props.created_at);
        let time_difference = <Moment fromNow>{created_at}</Moment>

            let media = null;
        if (this.props.entities.media) {
            media = <div className="mediaImgContainer"> <img alt="media" className="mediaImg" src={this.props.entities.media[0].media_url}/> </div>;
        }

        return ( 
            <div>
                <div> {/* if retweet */}
                    <span className = "profileImgContainer col-xs-2">
                        <a href={this.props.user.url}><img alt="profileImage" className='profileImg' src={this.props.user.profile_image_url}/></a>
                    </span>
                    <div className = "col-xs-10">
                        <div className = "col-xs-10">
                            <a href={this.props.user.url}><b>{this.props.user.name}</b></a> <span>@{this.props.user.screen_name}</span> • {time_difference}
                        </div>
                        <div className = "col-xs-10">
                            <div>
                                <p>{this.props.text}</p>
                            </div>
                            {media}
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}

export default Tweet;
