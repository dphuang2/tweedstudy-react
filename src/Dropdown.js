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
        this.state = {value: POPULARITY};
    }

    handleChange = (event, index, value) => {
        this.setState({value});
        this.props.onChange(event, value, index);
    };

    render() {

        return (
            <div>
                <MuiThemeProvider>
                    <DropDownMenu value={this.state.value} onChange={this.handleChange} labelStyle={styles.customColor}>
                        <MenuItem value={POPULARITY} primaryText={POPULARITY}/>
                        <MenuItem value={FREQUENCY} primaryText={FREQUENCY} />
                        <MenuItem value={SENTIMENT} primaryText={SENTIMENT} />
                        <MenuItem value={CLOSENESS} primaryText={CLOSENESS} />
                        <MenuItem value={CELEBRITY} primaryText={CELEBRITY} />
                    </DropDownMenu>
                </MuiThemeProvider>
            </div>
        );
    }
}

FeatureDropdown.defaultProps = {
    onChange: (event, value, index) => {}
}
