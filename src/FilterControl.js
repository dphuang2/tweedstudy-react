import React, { Component } from 'react';
import FeatureDropdown from './Dropdown.js'
import Slider  from 'rc-slider';
import { FREQUENCY, CELEBRITY, POPULARITY, CLOSENESS, SENTIMENT } from './TweetFilterer';

import { logger } from './Logger';

export default class FilterControl extends Component {
    constructor(props) {
        const LOW_NUMBER = -10000;
        super(props)
        let filterStatus = {};
        // NB That sentiment can be negative, so we can't set these to 0, 
        // but we can't ask the tweets because it takes forever and also 
        // we don't have them on construction. So, we have this.
        // Don't tell anyone. 
        [FREQUENCY, CELEBRITY, POPULARITY, CLOSENESS, SENTIMENT]
            .forEach(feature => filterStatus[feature] = LOW_NUMBER);

        let currentFeature = POPULARITY;
        this.state = {currentFeature, filterStatus};
    }

    onSliderChange(value) {
        logger.logInfo(`Changed slider to ${value} on ${this.state.currentFeature}`);
        let filterStatus = this.state.filterStatus;
        filterStatus[this.state.currentFeature] = value;
        this.setState({filterStatus}, 
            (_, __) => this.props.onChange(filterStatus));
        
    }

    onDropdownChange(event, index, value) {
        logger.logInfo(`Changed to ${value} filtering`);
        this.setState({currentFeature: value});
    }


    getHighestPop(tweets) {
        return Math.max(...tweets.map(t => t.getPopularity()));
    }
    getLowestPop(tweets) {
        return Math.min(...tweets.map(t => t.getPopularity()));
    }

    getHighestFrequency(tweets) {
        return Math.max(...tweets.map(t => t.getFrequency()));
    }
    getLowestFrequency(tweets) {
        return Math.min(...tweets.map(t => t.getFrequency()));
    }

    getHighestCelebrity(tweets) {
        let out = Math.max(...tweets.map(t => t.getCelebrity()));
        return out;
    }
    getLowestCelebrity(tweets) {
        let out = Math.min(...tweets.map(t => t.getCelebrity()));
        return out;
    }

    getHighestCloseness(tweets) {
        let ret = Math.max(...tweets.map(t => t.getCloseness()));
        console.log(`highest closeness is ${ret}`);
        return ret;
    }
    getLowestCloseness(tweets) {
        let ret = Math.min(...tweets.map(t => t.getCloseness()));
        console.log(`lowest closeness is ${ret}`);
        return ret;
    }

    getHighestSentiment(tweets) {
        return Math.max(...tweets.map(t => t.getSentiment()));
    }
    getLowestSentiment(tweets) {
        return Math.min(...tweets.map(t => t.getSentiment()));
    }

    getHighestFeature(feature) {
        const DEFAULT = 100;
        if(this.props.tweets.length === 0)
            return DEFAULT;

        let highest;
        switch(feature) {
            case FREQUENCY:
                highest = this.getHighestFrequency(this.props.tweets);
                break;
            case CELEBRITY:
                highest = this.getHighestCloseness(this.props.tweets);
                break;
            case CLOSENESS:
                highest = this.getHighestCloseness(this.props.tweets);
                break;
            case POPULARITY:
                highest = this.getHighestPop(this.props.tweets);
                break;
            case SENTIMENT:
                highest = this.getHighestSentiment(this.props.tweets);
                break;
            default:
                highest = DEFAULT;
                break;
        }
        return highest;
    }

    getLowestFeature(feature) {
        const DEFAULT = 0;
        if(this.props.tweets.length === 0)
            return DEFAULT;

        let lowest;
        switch(feature) {
            case FREQUENCY:
                lowest = this.getLowestFrequency(this.props.tweets);
                break;
            case CELEBRITY:
                lowest = this.getLowestCloseness(this.props.tweets);
                break;
            case CLOSENESS:
                lowest = this.getLowestCloseness(this.props.tweets);
                break;
            case POPULARITY:
                lowest = this.getLowestPop(this.props.tweets);
                break;
            case SENTIMENT:
                lowest = this.getLowestSentiment(this.props.tweets);
                break;
            default:
                lowest = DEFAULT;
                break;
        }
        return lowest;
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
