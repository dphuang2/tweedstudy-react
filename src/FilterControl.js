import Tweet from './Tweet.js';
import React from 'react';
import FeatureDropdown from './Dropdown.js'
import Slider  from 'rc-slider';
import { FREQUENCY, CELEBRITY, POPULARITY, CLOSENESS, SENTIMENT } from './TweetFilterer';

export default class FilterControl {
    constructor() {
        this.filterStatus = {};
        this.currentFeature = POPULARITY;
        this.currentValue = 0;
        this.sliderClass = "slider";
        this.dropdownClass = "dropdown";
        this.onChange = filterState => {};
        this.tweets = [];
    }

    onSliderChange(value) {
        this.currentValue = value;
        this.filterStatus[this.currentFeature] = value;
        this.onChange(this.filterStatus);
    }

    onDropdownChange(event, index, value) {
        this.currentFeature = value;
    }


    getHighestPop(tweets) {
        return Math.max(...tweets.map(t => new Tweet(t)).map(t => t.getPopularity()));
    }
    getLowestPop(tweets) {
        return Math.min(...tweets.map(t => new Tweet(t)).map(t => t.getPopularity()));
    }

    getHighestFrequency(tweets) {
        return Math.max(...tweets.map(t => new Tweet(t)).map(t => t.getFrequency()));
    }
    getLowestFrequency(tweets) {
        return Math.min(...tweets.map(t => new Tweet(t)).map(t => t.getFrequency()));
    }

    getHighestCelebrity(tweets) {
        return Math.max(...tweets.map(t => new Tweet(t)).map(t => t.getCelebrity()));
    }
    getLowestCelebrity(tweets) {
        return Math.min(...tweets.map(t => new Tweet(t)).map(t => t.getCelebrity()));
    }

    getHighestCloseness(tweets) {
        return Math.max(...tweets.map(t => new Tweet(t)).map(t => t.getCloseness()));
    }
    getLowestCloseness(tweets) {
        return Math.min(...tweets.map(t => new Tweet(t)).map(t => t.getCloseness()));
    }

    getHighestSentiment(tweets) {
        return Math.max(...tweets.map(t => new Tweet(t)).map(t => t.getSentiment()));
    }
    getLowestSentiment(tweets) {
        return Math.min(...tweets.map(t => new Tweet(t)).map(t => t.getSentiment()));
    }

    getHighestFeature(feature) {
        const DEFAULT = 100;
        if(this.tweets.length === 0)
            return DEFAULT;
        switch(feature) {
            case FREQUENCY:
                return this.getHighestFrequency(this.tweets);
            case CELEBRITY:
                return this.getHighestCloseness(this.tweets);
            case CLOSENESS:
                return this.getHighestCloseness(this.tweets);
            case POPULARITY:
                return this.getHighestPop(this.tweets);
            case SENTIMENT:
                return this.getHighestSentiment(this.tweets);
            default:
                return DEFAULT;
        }
    }

    getLowestFeature(feature) {
        const DEFAULT = 0;
        if(this.tweets.length === 0)
            return DEFAULT;

        switch(feature) {
            case FREQUENCY:
                return this.getLowestFrequency(this.tweets);
            case CELEBRITY:
                return this.getLowestCloseness(this.tweets);
            case CLOSENESS:
                return this.getLowestCloseness(this.tweets);
            case POPULARITY:
                return this.getLowestPop(this.tweets);
            case SENTIMENT:
                return this.getLowestSentiment(this.tweets);
            default:
                return DEFAULT;
        }
    }

    renderElements() {
        return (
            <div>
                <span className={this.dropdownClass}>
                    <FeatureDropdown onChange={this.onDropdownChange.bind(this)} value={ this.currentFeature } />
                </span>
                <span className={this.sliderClass}>
                    <Slider min={this.getLowestFeature(this.currentFeature)} max={this.getHighestFeature(this.currentFeature)} onChange={this.onSliderChange.bind(this)} defaultValue={ this.value }/>
                </span>
            </div>
        );
    }
}
