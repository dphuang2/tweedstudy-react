import Tweet from './Tweet.js';
import React, { Component } from 'react';
import FeatureDropdown from './Dropdown.js'
import Slider  from 'rc-slider';
import { TweetFilterer, FREQUENCY, CELEBRITY, POPULARITY, CLOSENESS, SENTIMENT } from './TweetFilterer';

export default class FilterControl extends Component {
    constructor(props) {
        super(props);
        this.filterStatus = {};
        this.state = { currentFeature: POPULARITY };
    }

    onSliderChange(value) {
        this.filterStatus[this.state.currentFeature] = value;
        console.log(this.filterStatus);
        this.props.onChange(this.filterStatus);
    }

    onDropdownChange(event, index, value) {
        this.setState({currentFeature: value});
    }


    getHighestPop(tweets) {
        // TODO: Math.max() === -Infinity. I don't even know what to say.
        return Math.max(...tweets.map(t => new Tweet(t)).map(t => t.getPopularity()));
    }
    getLowestPop(tweets) {
        return Math.min(...tweets.map(t => new Tweet(t)).map(t => t.getPopularity()));
    }

    getHighestFrequency(tweets) {
        return Math.max(...tweets.map(t => t.getFrequency()));
    }
    getLowestFrequency(tweets) {
        return Math.min(...tweets.map(t => t.getFrequency()));
    }

    getHighestCelebrity(tweets) {
        return Math.max(...tweets.map(t => t.getCelebrity()));
    }
    getLowestCelebrity(tweets) {
        return Math.min(...tweets.map(t => t.getCelebrity()));
    }

    getHighestCloseness(tweets) {
        return Math.max(...tweets.map(t => t.getCloseness()));
    }
    getLowestCloseness(tweets) {
        return Math.min(...tweets.map(t => t.getCloseness()));
    }

    getHighestSentiment(tweets) {
        return Math.max(...tweets.map(t => t.getSentiment()));
    }
    getLowestSentiment(tweets) {
        return Math.min(...tweets.map(t => t.getSentiment()));
    }

    getHighestFeature(feature) {
        switch(feature) {
            case FREQUENCY:
                return this.getHighestFrequency(this.props.tweets);
            case CELEBRITY:
                return this.getHighestCloseness(this.props.tweets);
            case CLOSENESS:
                return this.getHighestCloseness(this.props.tweets);
            case POPULARITY:
                console.log(`Got something; ${this.getHighestPop(this.props.tweets)}`);
                return this.getHighestPop(this.props.tweets);
            case SENTIMENT:
                return this.getHighestSentiment(this.props.tweets);
            default:
                return 100;
        }
    }

    getLowestFeature(feature) {
        switch(feature) {
            case FREQUENCY:
                return this.getLowestFrequency(this.props.tweets);
            case CELEBRITY:
                return this.getLowestCloseness(this.props.tweets);
            case CLOSENESS:
                return this.getLowestCloseness(this.props.tweets);
            case POPULARITY:
                console.log(`Got something; ${this.getLowestPop(this.props.tweets)}`);
                return this.getLowestPop(this.props.tweets);
            case SENTIMENT:
                return this.getLowestSentiment(this.props.tweets);
            default:
                return 0;
        }
    }

    render() {
        return (
            <div>
                <span className={this.props.dropdownClass}>
                    <FeatureDropdown onChange={this.onDropdownChange.bind(this)} />
                </span>
                <span className={this.props.sliderClass}>
                    <Slider min={this.getLowestFeature(this.state.currentFeature)} max={this.getHighestFeature(this.state.currentFeature)} onChange={this.onSliderChange.bind(this)}/>
                </span>
            </div>
        );
    }
}

FilterControl.defaultProps = {
    sliderClass: "slider",
    dropdownClass: "dropdown"
};
