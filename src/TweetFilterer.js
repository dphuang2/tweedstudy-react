import { happyWords, sadWords } from './wordlists';
import 'rc-slider/assets/index.css';
const FREQUENCY = "sentiment";
const CELEBRITY = "celebrity";
const POPULARITY = "popularity";
const CLOSENESS = "closeness";
const SENTIMENT = "sentiment";
class TweetFilterer {
  constructor() {
    this.data = null;
    // Set it up to download the needed data from the server (the endpoints are
    // already set up) and filter it and do the calculations. Use some yo dawg promises.
    // It'll be good

    this.wordSentiments = {};
    this.wordsHash = new Map();
    this.sadWildcardWords = sadWords.filter((w) => w.endsWith("*"));
    this.happyWildcardWords = happyWords.filter((w) => w.endsWith("*"));

    for(let i = 0; i < happyWords.length; i++)
        if(!happyWords[i].endsWith("*"))
            this.wordsHash[happyWords[i]] = 1;
    for(let i = 0; i < sadWords.length; i++)
        if(!sadWords[i].endsWith("*"))
            this.wordsHash[sadWords[i]] = -1;

    this.currentTweets = [];
  }

  filterTweets(filterObject) {
      let _filterTweets = (tweets, filterObject) => {
          for(let key in filterObject) {
              let func;
              switch(key) {
                  case FREQUENCY:
                      func = this.getFrequency;
                      break;
                  case CELEBRITY:
                      func = this.getCelebrity;
                      break;
                  case POPULARITY:
                      func = this.getPopularity;
                      break;
                  case SENTIMENT:
                      func = this.getSentiment;
                      break;
                  case CLOSENESS:
                      func = this.getCloseness;
                      break;
                  default:
                      console.log(`You gave me ${key} as a key, but that's not an available key!`);
                      reject([]);
                      return;

              }
              tweets = tweets.filter(tweet => func(tweet) >= filterObject[key]);
          } 
          return tweets;
      };

      if(filterObject == null)
          return new Promise((resolve, reject) => resolve([]));
      let that = this;
      return new Promise((resolve, reject) => {
              if(that.data == null) {
              fetch("/getTweets")
              .then((response) => {
                        return response.json();
                      })
              .then((json) => {
                        that.data = json;
                        resolve(_filterTweets(that.data, filterObject));
                      });
              } else {
                resolve(_filterTweets(filterObject, this.data));
              }
      });
  }

  getSmallestPop(tweets) {
      return tweets.map(this.getPopularity).reduce((a, b) => a < b ? a : b);
  }

  getLargestPop(tweets) {
      return tweets.map(this.getPopularity).reduce((a, b) => a > b ? a : b);
  }

  getPopularity(tweet) {
      return tweet.retweet_count;
  }

  getWordSentiment(word) { 
      if(this.wordsHash.has(word))
          return this.wordsHash.get(word);

      for(let i = 0; i < this.happyWildcardWords.length; i++) {
          let happy = this.happyWildcardWords[i];
          if(word.startsWith(happy.substring(0, happy.length - 1))) 
          {
              this.wordSentiments.set(word, 1);
              return 1;
          }
      }

      for(let i = 0; i < this.sadWildcardWords.length; i++) {
          let sad = this.sadWildcardWords[i];
          if(word.startsWith(sad.substring(0, sad.length - 1))) 
          {
              this.wordSentiments.set(word, -1);
              return -1;
          }
      }
      this.wordSentiments.set(word, 0);
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

  getFrequency(tweet) {
      const MILLIS_IN_MONTH = 30 * 24 * 60 * 60 * 1000;
      let tweetCount = tweet.user.statuses_count;
      let startDate = new Date(tweet.user.created_at);
      // Apparently this works. Who knew?
      let deltaMillis = new Date() - startDate;
      let deltaMonths = deltaMillis / MILLIS_IN_MONTH;
      return tweetCount / deltaMonths;
  }

  async getCloseness(tweet) {
      // Load messages, and implement algorithm. Not quite trivial but doable
  }
}
export { TweetFilterer, FREQUENCY, CELEBRITY, POPULARITY, CLOSENESS, SENTIMENT };
