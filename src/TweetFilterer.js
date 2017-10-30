import { happyWords, sadWords } from './wordlists';
import 'rc-slider/assets/index.css';
const FREQUENCY = "sentiment";
const CELEBRITY = "celebrity";
const POPULARITY = "popularity";
const CLOSENESS = "closeness";
const SENTIMENT = "sentiment";
class TweetFilterer {
  constructor(onLoaded) {
      if(onLoaded === undefined)
          onLoaded = () => {};
    this.data = null;
    // Set it up to download the needed data from the server (the endpoints are
    // already set up) and filter it and do the calculations. Use some yo dawg promises.
    // It'll be good
    fetch("/getTweets")
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.data = json;
        this.filterTweets(this.currentFilter)
        .then((tweets) => {
                this.currentTweets.length = 0;
                this.currentTweets.push(...tweets);
                onLoaded();
                });
        });

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


    this.currentFilter = null;
    this.currentTweets = [];
  }

  // This doesn't actually use the Promise...
  filterTweets(filterObject) {
      if(filterObject == null)
          return new Promise((resolve, reject) => resolve([]));
      this.currentFilter = filterObject;
      // The filters will make new arrays, so it's ok that we have this one by reference
      let out = this.data;
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
                  return new Promise((resolve, reject) => reject([]));

          }
          out = out.filter(tweet => func(tweet) >= filterObject[key]);
      } 
      return new Promise((resolve, reject) => resolve(out));
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
}
export { TweetFilterer, FREQUENCY, CELEBRITY, POPULARITY, CLOSENESS, SENTIMENT };
