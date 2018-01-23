import React, { Component } from 'react';
import './Tweet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Moment from 'react-moment';
import 'moment-timezone';

class Tweet extends Component {

    render() {

    const created_at = new Date(this.props.created_at);
    let time_difference = <Moment fromNow>{created_at}</Moment>

    let media = null;
    if (this.props.entities.media) {
        media = <img className="mediaImg" src={this.props.entities.media[0].media_url} alt=""/>;
    }

    return ( //<p>{this.props.text}</p>
        <div id="tweet" className="row"> {/* if retweet */}
            <a className="col-xs-2 col-md-offset-1 col-md-1" href={this.props.user.url}><img className='profileImg img-circle' src={this.props.user.profile_image_url} alt="profile"/></a>
            <span className="col-xs-10">
                <a href={this.props.user.url}><b>{this.props.user.name}</b></a> <span>@{this.props.user.screen_name}</span> • {time_difference}
                <p>{this.props.full_text}</p>
                {media}
            </span>
        </div>
    );

    }
}

export default Tweet;
