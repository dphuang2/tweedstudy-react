import 'rc-slider/assets/index.css';
const FREQUENCY = "Frequency";
const CELEBRITY = "Celebrity";
const POPULARITY = "Popularity";
const CLOSENESS = "Closeness";
const SENTIMENT = "Sentiment";
export default class TweetFilterer {
  constructor(tweets) {
    this.data = tweets;
  }

  async filterTweets(filterObject) {
      let _filterTweets = (tweets, filterObject) => {
          for(let key in filterObject) {
              let func;
              switch(key) {
                  case FREQUENCY:
                      func = t => t.getFrequency();
                      break;
                  case CELEBRITY:
                      func = t => t.getCelebrity();
                      break;
                  case POPULARITY:
                      func = t => t.getPopularity();
                      break;
                  case SENTIMENT:
                      func = t => t.getSentiment();
                      break;
                  case CLOSENESS:
                      func = t => t.getCloseness();
                      break;
                  default:
                      throw new Error(`You gave me ${key} as a key, but that's not an available key!`);

              }
              tweets = tweets.filter(tweet => func(tweet) >= filterObject[key]);
          } 
          return tweets;
      };

      if(filterObject === null)
          return [];

      if(this.data === null) {
          throw new Error("There are no tweets!");
      }
      return _filterTweets(this.data, filterObject);
  }

}
export { TweetFilterer, FREQUENCY, CELEBRITY, POPULARITY, CLOSENESS, SENTIMENT };
