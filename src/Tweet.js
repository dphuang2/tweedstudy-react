import React, { Component } from 'react';
// import logo from './logo.svg';
import './Tweet.css';

var tweetData = require('./tweets.json');

/*
 *TODO:
 *Build feed with fake twitter data [tweets.json]
 *Build slider than can filter fake twitter data [tweets.json]
 */

export class Tweet extends Component {
  render() {
    return(
      <div className="Tweet-first">
        <div className="container">
          <div className="row">

            <div className="Tweet-start col-md-4 col-md-offset-4">
              <div className="Tweet-area row">
                <div className="col-md-4">
                  <img src={tweetData[this.props.i]['user']['profile_image_url']} className="Tweet-pro_pic" alt="profile" />
                </div>
                <div className="Tweet-info col-md-8">
                  <p>{tweetData[this.props.i]['user']['name']} <br/><i>@{tweetData[this.props.i]['user']['screen_name']}</i></p>
                  <p>{tweetData[this.props.i]['text']} </p>
                </div>
              </div>
              <div className="row">
                <div className="Tweet-icons col-md-2">
                  <i className="fa fa-comment-o" aria-hidden="true">&nbsp;{tweetData[this.props.i]['popularity']}</i>
                </div>
                <div className="Tweet-icons col-md-2">
                  <i className="fa fa-retweet" aria-hidden="true">&nbsp;{tweetData[this.props.i]['retweet_count']}</i>
                </div>
                <div className="Tweet-icons col-md-2">
                  <i className="fa fa-heart-o" aria-hidden="true">&nbsp;{tweetData[this.props.i]['favourites_count']}</i>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Tweet;
