import React, { Component } from 'react';
import DropDownMenuSimpleExample from './Dropdown.js'
import Slider  from 'rc-slider';
import { TweetFilterer } from './TweetFilterer';
// TODO: Finish hooking up all the functions, and then make a function to call out
// and set the other data. I know how to do this roughly, but I'm tired now for some reason
// and I can't do it. 



export default class FilterControl extends Component {
    onSliderChange() {
        console.log("slider changed");
    }

    render() {
        return (
            <div>
                <span className={this.props.dropdownClass}>
                    <DropDownMenuSimpleExample />
                </span>
                <span className={this.props.sliderClass}>
                    <Slider min={55} max={110} onChange={this.onSliderChange.bind(this)}/>
                </span>
            </div>
        );
    }
}

FilterControl.defaultProps = {sliderClass: "slider",
    dropdownClass: "dropdown"};
