import React, { Component } from 'react';
import './Tweet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Moment from 'react-moment';
import 'moment-timezone';

class Tweet extends Component {

    render() {

    const created_at = new Date(this.props.created_at);
    let time_difference = <Moment fromNow>{created_at}</Moment>

    let tweet = this.props;
    let retweet_status = null;
    if (this.props.hasOwnProperty('retweeted_status')){
        tweet = this.props.retweeted_status;
        retweet_status = <p className="col-xs-offset-2 col-xs-10"> <span className="glyphicon glyphicon-retweet" aria-hidden="true"></span> {this.props.user.screen_name} retweeted </p>;
    }

    let media = null;
    if (tweet.entities.media) {
        let size = {}
        media = <img className="img-responsive" width={tweet.entities.media[0].sizes.thumb.w * 5} src={tweet.entities.media[0].media_url} alt=""/>;
    }

    return ( //<p>{this.props.text}</p>
        <div id="tweet" className="row">
            {retweet_status}
            <a className="col-xs-2 col-md-offset-1 col-md-1" href={tweet.user.url}><img className='profileImg img-circle' src={tweet.user.profile_image_url} alt="profile"/></a>
            <span className="col-xs-10">
                <a href={tweet.user.url}><b>{tweet.user.name}</b></a> <span>@{tweet.user.screen_name}</span> • {time_difference}
                <p>{tweet.full_text.slice(tweet.display_text_range[0], tweet.display_text_range[1])}</p>
                {media}
            </span>
        </div>
    );

    }
}

export default Tweet;
