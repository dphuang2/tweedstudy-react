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
    let withinDay = (now.getDay() - wasDate.getDay()) % 6;
    let withinMonth = (now.getMonth() - wasDate.getMonth());
    let withinYear = now.getYear() - wasDate.getYear();
    let withinHours = 0;
    
    //display date according to  current time
    if(withinDay <= 1){ 
    withinHours = now.getHours() - wasDate.getHours();
    }
     if((state) > 0 ){
      display_date = <Time value={wasDate} format="MM-DD-YYYY hh:mm" />
    }
    else if(withinHours != 0 && withinHours <=12){ //within a day and display hours
      display_date = <RelativeTime value={wasDate} format="hh"/>
    }
    else if (withinMonth > 0 && withinYear == 0){ // within a year
      display_date = <Time value ={wasDate} format="MM-DD hh:mm"/>
    }
    else
    {
      display_date = <RelativeTime value ={wasDate} format="YYYY-MM-DD hh:mm"/>
    }

    //display image if the text contains url
    var TweetText;
    var textUrl;
    var subString = "http";
    var text = new String(tweetData[this.props.i]['text']);

    if(text.includes(subString)){
      var index = text.indexOf(subString);
      TweetText = text.substring(0,index);
      textUrl = text.substring(index);

    }
    else{
            TweetText = tweetData[this.props.i]['text']
            textUrl = "";
    }

    return(
      <div className="Tweet-first">
        <div className="container">
          <div className="row">

            <div className="Tweet-start col-md-6 col-md-offset-3">
              <div className="Tweet-area row">
                <span className="Tweet-info col-md-2">
                  <img src={tweetData[this.props.i]['profile_image_url']} className="Tweet-pro_pic" alt="profile" />
                </span>

                <span className="Tweet-info col-md-10">
                  <p>{tweetData[this.props.i]['user']['name']} &nbsp;
                  <a href = {tweetData[this.props.i]['user']['url']} target = '_blank'>@{tweetData[this.props.i]['user']['screen_name']}</a>&nbsp;&nbsp;
                  {display_date}
                  </p>


                  <p>{TweetText}
                  <a href = {textUrl} target = '_blank'>{textUrl}</a></p>





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
