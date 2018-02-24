import React, { Component } from 'react';
import Moment from 'react-moment';
import 'moment-timezone';
import './TweetView.css';

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

export default class TweetView extends Component {
    render() {
        let tweet = this.props.tweet;
        const created_at = new Date(tweet.created_at);
        let time_difference = <Moment fromNow>{created_at}</Moment>

        let retweet_status = null;
        if (tweet.hasOwnProperty('retweeted_status')){
            retweet_status = <p className="retweet"><i className="fas fa-retweet"></i> {tweet.user.screen_name} retweeted </p>;
        }

        let media = null;
        if (tweet.entities.media) {
          media = <img id="media-img" width={tweet.entities.media[0].sizes.thumb.w * 5} src={tweet.entities.media[0].media_url} alt=""/>;
        }

        let counts = (<p>
        {
            tweet.retweeted ?
            <span style={{color: '#66ff99'}}><i className="fas fa-retweet"  id="counts"></i> {tweet.retweet_count}</span> :
            <span><i className="fas fa-retweet"  id="counts"></i>{tweet.retweet_count}</span>
        }

        {
            tweet.favorited ?
            <span style={{color: '#ff6699'}}><i className="fas fa-heart"  id="counts"></i>{tweet.favorite_count}</span> :
            <span><i className="far fa-heart"  id="counts"></i>{tweet.favorite_count}</span>
        }
        </p>)

        /**
         * Append anchor tag to links and replace escaped &amp; ish with & ish
         */
        const format = (text, values) => {
          if (!values.length) {
            return (<p>{text}</p>);
          }
          let parts = [];
          let prev_index = 0;
          for (let i = 0; i < values.length; i++){
              parts.push(entities.decode([...text].slice( prev_index, values[i].indices[0]).join('')));
              // console.log(runes.substr(text, prev_index, values[i].indices[0]));
              parts.push(<a title={values[i].expanded_url} href={values[i].url} key={values[i].url}>{values[i].url}</a>);
              prev_index = values[i].indices[1];
          }
          parts.push(entities.decode([...text].slice(prev_index).join('')));

          return (<p>{parts}</p>);
        }

        let full_text = format([...tweet.getText()].slice(tweet.display_text_range[0], tweet.display_text_range[1]), tweet.entities.urls);

        return (
          <div className="tweet">
              {retweet_status}
              <a href={tweet.user.url}><img className='profile-img' src={tweet.user.profile_image_url} alt="profile"/></a>
              <div>
                  <a href={tweet.user.url}><b>{tweet.user.name}</b></a> <span style={{color: '#808080'}}>@{tweet.user.screen_name} • {time_difference}</span>
                  {full_text}
                  {media}
                  {counts}
              </div>
          </div>
      )
    }
}
