import Tweet from './Tweet.js';
import React, { Component } from 'react';
import FeatureDropdown from './Dropdown.js'
import Slider  from 'rc-slider';
import { FREQUENCY, CELEBRITY, POPULARITY, CLOSENESS, SENTIMENT } from './TweetFilterer';

export default class FilterControl extends Component {
    constructor(props) {
        super(props)
        let filterStatus = {};
        for(let feature in [FREQUENCY, CELEBRITY, POPULARITY, CLOSENESS, SENTIMENT])
            filterStatus[feature] = 0;

        let currentFeature = POPULARITY;
        this.state = {currentFeature, filterStatus};
    }

    onSliderChange(value) {
        let filterStatus = this.state.filterStatus;
        filterStatus[this.state.currentFeature] = value;
        this.setState({filterStatus}, 
            (_, __) => this.props.onChange(this.filterStatus));
        
    }

    onDropdownChange(event, index, value) {
        this.setState({currentFeature: value});
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
        console.log("Starting calculation");
        let out = Math.max(...tweets.map(t => new Tweet(t)).map(t => t.getCelebrity()));
        console.log(`Highest celebrity is ${out}`);
        return out;
    }
    getLowestCelebrity(tweets) {
        console.log("Starting calculation");
        let out = Math.min(...tweets.map(t => new Tweet(t)).map(t => t.getCelebrity()));
        console.log(`Lowest celebrity is ${out}`);
        return out;
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
        console.log("CALLED highest with " + feature);
        const DEFAULT = 100;
        if(this.props.tweets.length === 0)
            return DEFAULT;
        switch(feature) {
            case FREQUENCY:
                return this.getHighestFrequency(this.props.tweets);
            case CELEBRITY:
                return this.getHighestCloseness(this.props.tweets);
            case CLOSENESS:
                return this.getHighestCloseness(this.props.tweets);
            case POPULARITY:
                return this.getHighestPop(this.props.tweets);
            case SENTIMENT:
                return this.getHighestSentiment(this.props.tweets);
            default:
                return DEFAULT;
        }
    }

    getLowestFeature(feature) {
        console.log("CALLED lowest with " + feature);
        const DEFAULT = 0;
        if(this.props.tweets.length === 0)
            return DEFAULT;

        switch(feature) {
            case FREQUENCY:
                return this.getLowestFrequency(this.props.tweets);
            case CELEBRITY:
                return this.getLowestCloseness(this.props.tweets);
            case CLOSENESS:
                return this.getLowestCloseness(this.props.tweets);
            case POPULARITY:
                return this.getLowestPop(this.props.tweets);
            case SENTIMENT:
                return this.getLowestSentiment(this.props.tweets);
            default:
                return DEFAULT;
        }
    }

    render() {
        return (
            <div>
                <span className={ this.props.dropdownClass }>
                    <FeatureDropdown onChange={ this.onDropdownChange.bind(this) } value={ this.state.currentFeature } />
                </span>
                <span className={ this.props.sliderClass }>
                    <Slider min={ this.getLowestFeature(this.state.currentFeature) } max={ this.getHighestFeature(this.state.currentFeature) } onChange={ this.onSliderChange.bind(this) } defaultValue={ this.state.filterStatus[this.state.currentFeature] }/>
                </span>
            </div>
        );
    }
}

FilterControl.defaultProps = {
    sliderClass: "slider", 
    dropdownClass: "dropdown"
};
