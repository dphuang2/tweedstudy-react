import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const styles = {
  customColor: {
    color: "#ffffff",
  },
};

export default class DropDownMenuSimpleExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: 1};
  }

  handleChange = (event, index, value) => this.setState({value});

  render() {

    return (
      <div>
        <MuiThemeProvider>
        <DropDownMenu value={this.state.value} onChange={this.handleChange} labelStyle={styles.customColor}>
          <MenuItem value={1} primaryText="Popularity" />
          <MenuItem value={2} primaryText="Frequency" />
          <MenuItem value={3} primaryText="Sentiment" />
          <MenuItem value={4} primaryText="Closeness" />
          <MenuItem value={5} primaryText="Celebrity" />
        </DropDownMenu>
        </MuiThemeProvider>
      </div>
    );
  }
}
