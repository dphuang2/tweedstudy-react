import React, { Component } from 'react';
import { happyWords, sadWords } from './wordlists';
import Slider  from 'rc-slider';
import 'rc-slider/assets/index.css';
class TweetFilterer {
  constructor(props) {
    super(props); 
    this.wordSentiments = {};
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
            max: this.getLargestPop(this.data),
            sadWordsHashTable: new Map(sadWords.map(word => [word, 1])),
            happyWordsHashTable: new Map(happyWords.map(word => [word, 1]))
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


  getWordSentiment(word) {
      if(this.wordSentiments.hasOwnProperty(word))
          return this.wordSentiments[word];
      
      if(this.state.sadWordsHashTable.has(word))
      {
		this.wordSentiments[word] = -1;
		return -1;
      }
      else
      {
      	for(let i = 0; i < sadWords.length; i++) {
          let sad = sadWords[i];
          if(sad.endsWith("*") && word.startsWith(sad.substring(0, sad.length - 1))) 
          {
              this.wordSentiments[word] = -1;
              return -1;
          }
      }
      }


      if(this.state.happyWordsHashTable.has(word))
      {
		this.wordSentiments[word] = 1;
		return 1;
      }
      else
      {
      	for(let i = 0; i < happyWords.length; i++) 
      	{
          let happy = happyWords[i];
          if(happy.endsWith("*") && word.startsWith(happy.substring(0, happy.length - 1))) 
          {
              this.wordSentiments[word] = 1;
              return 1;
          }
      	}
      }

      return 0;
  }

  getSentiment(tweet) {
      let words = tweet.text.toLowerCase().replace(/[^\w\s]/g, "").split(" ");
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
}
export default TweetFilterer;
