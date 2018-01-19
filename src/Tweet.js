import React, { Component } from 'react';
import './Tweet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Moment from 'react-moment';
import 'moment-timezone';

class Tweet extends Component {

  render() {

  // console.log(this.props);

  const created_at = new Date(this.props.created_at);
  let time_difference = <Moment fromNow>{created_at}</Moment>



  let media = null;
  if (this.props.entities.media) {
    media = <div className="mediaImgContainer"> <img className="mediaImg" src={this.props.entities.media[0].media_url}/> </div>;
  }


  return ( //<p>{this.props.text}</p>
          <div>
            <div> {/* if retweet */}
              <span className = "profileImgContainer col-xs-2">
                <a href={this.props.user.url}><img className='profileImg' src={this.props.user.profile_image_url}/></a>
              </span>
              <div className = "col-xs-10">
                <div className = "col-xs-10">
                <a href={this.props.user.url}><b>{this.props.user.name}</b></a> <span>@{this.props.user.screen_name}</span> • {time_difference}
                </div>
                <div className = "col-xs-10">
                  <div>
                  <p>{this.props.full_text}</p>
                  </div>
                  {media}
                </div>
              </div>
            </div>
          </div>
          );

  }
}

export default Tweet;
