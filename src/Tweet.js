import React, { Component } from 'react';
import { withRouter } from 'react';
import Time from 'react-time'
import RelativeTime from 'react-relative-time'
// import logo from './logo.svg';
import './Tweet.css';
import { AppRegistry, Text, StyleSheet } from 'react';
var tweetData = require('./tweets.json');

/*
 *TODO:
 *Build feed with fake twitter data [tweets.json]
 *Build slider than can filter fake twitter data [tweets.json]
 */

export class Tweet extends Component {
  render() {
    let now = new Date();
    let wasDate = new Date(tweetData[this.props.i]['created_at']);
    let state = ((now.getMonth() - wasDate.getMonth()) + (now.getYear() - wasDate.getYear()) + (now.getDay() - wasDate.getDay()));
    let display_date;
    if((now.getMonth() - wasDate.getMonth()) + (now.getYear() - wasDate.getYear()) > 0 ){
      display_date = <Time value={wasDate} format="YYYY-MM-DD hh:mm" />
    }
    else
    {
      display_date = <RelativeTime value ={wasDate} format="YYYY-MM-DD hh:mm"/>
    }
    return(
      <div className="Tweet-first">
        <div className="container">
          <div className="row">




            <div className="Tweet-start col-md-6 col-md-offset-3">
              <div className="Tweet-area row">
                <span className="Tweet-info col-md-2">
                  <img src={tweetData[this.props.i]['user']['profile_image_url']} className="Tweet-pro_pic" alt="profile" />
                </span>
                
                <span className="Tweet-info col-md-10">
                  <p>{tweetData[this.props.i]['user']['name']} &nbsp;
                  <a href = {tweetData[this.props.i]['user']['url']} target = '_blank'>@{tweetData[this.props.i]['user']['screen_name']}</a>&nbsp;&nbsp;
                  {display_date}
                  </p>
 
                  <p>{tweetData[this.props.i]['text']} </p>




                      <div className="row">
                        <span className="Tweet-icons col-md-2">
                          <i className="fa fa-comment-o" aria-hidden="true">&nbsp;{tweetData[this.props.i]['popularity']}</i>
                        </span>
                        <span className="Tweet-icons col-md-2">
                          <i className="fa fa-retweet" aria-hidden="true">&nbsp;{tweetData[this.props.i]['retweet_count']}</i>
                        </span>
                        <span className="Tweet-icons col-md-2">
                          <i className="fa fa-heart-o" aria-hidden="true">&nbsp;{tweetData[this.props.i]['favourites_count']}</i>
                        </span>
                      </div>

                </span>
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Tweet;
