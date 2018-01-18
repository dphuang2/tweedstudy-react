import React, { Component } from 'react';
import './Tweet.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class Tweet extends Component {

  render() {

  console.log(this.props);

  var time_ago_created_at = 10;

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
                <a href={this.props.user.url}><b>{this.props.user.name}</b></a> <span>@{this.props.user.screen_name}</span> • {time_ago_created_at}
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


    // <div class="row gutter-0">
    //   <% if tweet.retweet? %>
    //     <div class="col-xs-2">
    //       <a target="_blank" href="<%=tweet.retweet_user_url%>"><img class='profileimg' src="<%=tweet.retweet_user_profile_img%>"></a>
    //     </div>
    //     <div class="col-xs-10">
    //       <a target="_blank" href="<%=tweet.retweet_user_url%>"><b><%=tweet.retweet_user_name%></b></a><span style='color: #808080;'>@<%=tweet.retweet_user_screen_name%></span> • <%=time_ago_from_string tweet.tweet_created_at%>
    //   <% else %>
    //     <div class="col-xs-2">
    //       <a target="_blank" href="<%=tweet.user_url%>"><img class='profileimg' src="<%=tweet.user_profile_img%>"></a>
    //     </div>
    //     <div class="col-xs-10">
    //       <a target="_blank" href="<%=tweet.user_url%>"><b><%=tweet.user_name%></b></a> <span style='color: #808080;'>@<%=tweet.user_screen_name%></span> • <%=time_ago_from_string tweet.tweet_created_at%>
    //   <% end %>
    //   <br>
    //   <%=format_tweet_text(tweet.text)%>
    //   <br>
    //   <% unless tweet.media_url.nil? %>
    //     <% if tweet.media_url =~ %r{\Ahttps?://.+\.(?:jpe?g|png)\z}i %>
    //       <img class="mediaimg" src="<%=tweet.media_url%>" style='max-width:100%;'> <br>
    //     <% else %>
    //       <video width='100%' controls autoplay muted loop>
    //         <source src=<%=tweet.media_url%> type='video/mp4'>
    //       </video>
      //   <% end %>
      // <% end %>
