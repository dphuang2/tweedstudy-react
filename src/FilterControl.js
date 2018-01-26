import Tweet from './Tweet.js';
import React, { Component } from 'react';
import FeatureDropdown from './Dropdown.js'
import Slider  from 'rc-slider';
import { FREQUENCY, CELEBRITY, POPULARITY, CLOSENESS, SENTIMENT } from './TweetFilterer';

export default class FilterControl extends Component {
    constructor(props) {
        super(props)
        let filterStatus = {};
        [FREQUENCY, CELEBRITY, POPULARITY, CLOSENESS, SENTIMENT]
            .forEach(feature => filterStatus[feature] = this.getLowestFeature(feature));

        let currentFeature = POPULARITY;
        this.state = {currentFeature, filterStatus};
    }

    onSliderChange(value) {
        let filterStatus = this.state.filterStatus;
        filterStatus[this.state.currentFeature] = value;
        this.setState({filterStatus}, 
            (_, __) => this.props.onChange(filterStatus));
        
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
        let out = Math.max(...tweets.map(t => new Tweet(t)).map(t => t.getCelebrity()));
        return out;
    }
    getLowestCelebrity(tweets) {
        let out = Math.min(...tweets.map(t => new Tweet(t)).map(t => t.getCelebrity()));
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
        let lowestFeature;
        let highestFeature;
        if(this.props.tweets !== undefined && this.props.tweets !== null) {
            lowestFeature = this.getLowestFeature(this.state.currentFeature)  
            highestFeature = this.getHighestFeature(this.state.currentFeature) 
        } else {
            lowestFeature = 0;
            highestFeature = 100;
        }
        return (
            <div>
                <span className={ this.props.dropdownClass }>
                    <FeatureDropdown onChange={ this.onDropdownChange.bind(this) } value={ this.state.currentFeature } />
                </span>
                <span className={ this.props.sliderClass }>
                    <Slider min={ lowestFeature } max={ highestFeature } onChange={ this.onSliderChange.bind(this) } defaultValue={ this.state.filterStatus[this.state.currentFeature] }/>
                </span>
            </div>
        );
    }
}

FilterControl.defaultProps = {
    sliderClass: "slider", 
    dropdownClass: "dropdown"
};
