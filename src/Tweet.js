import { happyWords, sadWords } from './wordlists';
import App from './App';

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

class Tweet {
    constructor(jsonObj) {
        this.jsonObj = jsonObj;
        this.created_at = jsonObj.created_at;
        this.text = jsonObj.full_text;
        this.user = jsonObj.user;
        this.entities = jsonObj.entities;
        if(jsonObj.retweeted_status !== undefined)
            this.retweeted_status = jsonObj.retweeted_status;
        this.retweet_count = jsonObj.retweet_count;
        this.favorited = jsonObj.favorited;
        this.favorite_count = jsonObj.favorite_count;
        this.display_text_range = jsonObj.display_text_range;
        this.id = jsonObj.id;

        // Calculate stuff...
        this.getPopularity();
        this.getSentiment();
        this.getCloseness()
        this.getFrequency();
        this.getCelebrity();
    }

    getPopularity() {
        return this.retweet_count;
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
        if(this.sentiment === undefined)
            this.sentiment = this.getTextSentiment(this.getText());
        return this.sentiment;
    }

    getCelebrity() {
        if(this.celebrity === undefined) {
            let celeb = 0;

            if(this.user.verified)
                celeb++;

            if(this.user.followers_count > 100000)
                celeb += 3;
            else if(this.user.followers_count > 10000)
                celeb += 2;
            else if(this.user.followers_count > 1000)
                celeb += 1;
            else
                celeb -= 1;
            this.celebrity = celeb;
        }
        return this.celebrity;
    }

    getFrequency() {
        if(this.frequency === undefined) {
            const MILLIS_IN_MONTH = 30 * 24 * 60 * 60 * 1000;
            let tweetCount = this.user.statuses_count;
            let startDate = new Date(this.user.created_at);
            let deltaMillis = new Date() - startDate;
            let deltaMonths = deltaMillis / MILLIS_IN_MONTH;
            this.frequency = tweetCount / deltaMonths;
        }
        return this.frequency;
    }

    getCloseness() {
        if(this.closeness === undefined)
            this.closeness = this.getUserCloseness(this.user);

        return this.closeness;
    }


    getUserCloseness(user) {
        // TODO: Implement caching on this method too. We're working from a small number of users, this can be really fast

        // No one has to know I've done this
        const messages = App.messages;

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

    getText() {
        if (this.hasOwnProperty('retweeted_status'))
            return this.jsonObj.retweeted_status.full_text;
        else
            return this.jsonObj.full_text;
    }
}

export default Tweet;
