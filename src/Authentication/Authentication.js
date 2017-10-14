import React, { Component } from 'react';
import './Authentication.css';

class Authentication extends Component {
    constructor(props) {
        super(props);
        let _self = this;
        this.state = {'isAuthenticated': false};
        this.authenticate = this.authenticate.bind(this);
        this.logout = this.logout.bind(this);

        // This block of code parses the current URL and checks for oauth_token and oauth_verifier
        // If these two things exist within the URL, then make request to /auth/twitter/verify
        var url = require('url');
        var curr_url = window.location.href
        var url_parts = url.parse(curr_url, true);
        var query = url_parts.query;
        if (Object.keys(query).length !== 0) { // If the query has oauth tokens
            if ('oauth_token' in query && 'oauth_verifier' in query && 'oauth_token_secret' in window.sessionStorage) {
                fetch("/auth/twitter/verify?oauth_token="+query['oauth_token']+
                    "&oauth_verifier="+query['oauth_verifier']+
                    "&oauth_token_secret="+window.sessionStorage['oauth_token_secret'])
                    .then(function(res){
                        res.json().then(function(json){
                            _self.setState({'oauth_token': json.oauth_token,
                                'oauth_token_secret': json.oauth_token_secret,
                                'screen_name': json.screen_name,
                                'user_id': json.user_id,
                                'isAuthenticated': true
                            });
                        });
                    });

            }
        }
    }

    authenticate() {
        // send request for redirect_uri
        fetch("/auth/twitter")
            .then(function(res){
                res.json().then(function(json){
                    window.sessionStorage['oauth_token_secret'] = json.oauth_token_secret;
                    window.location = json.redirect_uri; // Redirect to the redirect_uri in the response
                });
            });
    }

    logout() {
        this.setState({'isAuthenticated': false});
    }

    render() {
        console.log(this.state);
        if (this.state['isAuthenticated']) {
            console.log(this.state['isAuthenticated'])
            return (
                <div className="Authentication">
                    <p> Hi {this.state['screen_name']}! </p> 
                    <button type="button" onClick={this.logout}> Log me out! </button>
                </div>
            );
        } else {
            return (
                <div className="Authentication">
                    <button type="button" onClick={this.authenticate}> Authenticate me! </button>
                </div>
            );
        }
    }
}

export default Authentication;
