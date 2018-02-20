import React, { Component } from 'react';
import Moment from 'react-moment';
import 'moment-timezone';
import './TweetView.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class TweetView extends Component {
    render() {
        let tweet = this.props.tweet;
        const created_at = new Date(tweet.created_at);
        let time_difference = <Moment fromNow>{created_at}</Moment>
        let retweet_status = null;
        if (tweet.hasOwnProperty('retweeted_status')){
            retweet_status = <p className="col-xs-offset-2 col-xs-10"> 
                <span className="glyphicon glyphicon-retweet" aria-hidden="true"></span>
                { tweet.user.screen_name } retweeted </p>;
        }

        let media = null;
        if (tweet.entities.media) {
            media = <img id="media-img" className="img-responsive img-rounded" 
            width={tweet.entities.media[0].sizes.thumb.w * 5} 
            src={tweet.entities.media[0].media_url} alt=""/>;
        }

        let counts = (<p>
            {
                tweet.retweeted ?
                    <span style={{color: '#66ff99'}}><span id="counts" className="glyphicon glyphicon-retweet" aria-hidden="true"></span> { tweet.retweet_count }</span> :
                    <span><span id="counts" className="glyphicon glyphicon-retweet" aria-hidden="true"></span> { tweet.retweet_count }</span>
            }

            {
                tweet.favorited ?
                    <span style={{color: '#ff6699'}}><span id="counts" className="glyphicon glyphicon-heart" aria-hidden="true"></span>{tweet.favorite_count}</span> :
                    <span><span id="counts" className="glyphicon glyphicon-heart-empty" aria-hidden="true"></span>{ tweet.favorite_count }</span>
            }
        </p>)

        let text = tweet.getText().slice(tweet.display_text_range[0], tweet.display_text_range[1]);

        return ( <div id="tweet" className="row">
                {retweet_status}
                <a className="col-xs-2 col-md-offset-1 col-md-1" href={ tweet.user.url }><img className='profileImg img-circle' src={ tweet.user.profile_image_url } alt="profile"/></a>
                <span className="col-xs-10">
                    <a href={ tweet.user.url }><b>{ tweet.user.name }</b></a> <span style={ {color: '#808080'} }>@{ tweet.user.screen_name } • { time_difference }</span>
                    <p>{ text }</p>
                    { media }
                    { counts }
                </span>
            </div>
        );
    }
}
