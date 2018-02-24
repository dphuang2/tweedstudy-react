import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import {FREQUENCY, CELEBRITY, POPULARITY, CLOSENESS, SENTIMENT } from './TweetFilterer';

const styles = {
    customColor: {
        color: "#ffffff",
    },
};

export default class FeatureDropdown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: props.value};
        this.options = [POPULARITY, FREQUENCY, SENTIMENT, CLOSENESS, CELEBRITY];
    }

    handleChange = (event, index, value) => {
        this.setState({value});
        this.props.onChange(event, index, value);
    };

    render() {

        return (
            <div>
                <MuiThemeProvider>
                    <DropDownMenu value={this.state.value} onChange={this.handleChange} labelStyle={styles.customColor}>
                        { this.options.map(o => <MenuItem key={o} value={o} primaryText={o} />) }
                    </DropDownMenu>
                </MuiThemeProvider>
            </div>
        );
    }
}

FeatureDropdown.defaultProps = {
    onChange: (event, value, index) => {}
}
