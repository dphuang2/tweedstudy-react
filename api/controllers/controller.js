'use strict';

var qs = require('querystring');
var request = require('request');
var Twitter = require('twitter');

var mongoose = require('mongoose'),
  Task = mongoose.model('Tasks');

// Import getData functions for gathering data from Twitter API
var getData = require('../helpers/getData');
var get_data = getData.get_data;
var get_all_data_id = getData.get_all_data_id;
var get_all_data_cursor = getData.get_all_data_cursor;
var get_profile_img = getData.get_profile_img;

// Import database method
var pushData = require('../helpers/pushData');
var push_to_database = pushData.push_to_database;
function readJsonFile(filename) {
    return JSON.parse(require('fs').readFileSync(filename, 'utf8'));
}

// GET /getTweets
exports.get_tweets = function(req, res) {
  var json = readJsonFile("data/tweets.json");
  res.json(json);
}


exports.get_users = function(req, res) {
  var json = readJsonFile("data/users.json");
  res.json(json);
}

exports.get_messages = function(req, res) {
  var json = readJsonFile("data/messages.json");
  res.json(json);
}

exports.get_friends = function(req, res) {
  var json = readJsonFile("data/friends.json");
  res.json(json);
}

// GET /auth/twitter
exports.authenticate = function(req, res) {
    var oauth = { callback: 'http://127.0.0.1:3001'
        , consumer_key: process.env.CONSUMER_KEY || 'eiVbxbQIfNYWCJJfXXwkSTflK'
        , consumer_secret: process.env.CONSUMER_SECRET || '8zJtZZATHYxh2sh7uAXhJBufhtUfPfffqE6nI0IQXf7h577nbe'};
    var url = 'https://api.twitter.com/oauth/request_token';
    request.post({url:url, oauth:oauth}, function(e, r, body){
        var req_data = qs.parse(body);
        var redirect_uri = 'https://api.twitter.com/oauth/authenticate'
                         + '?'
                         + qs.stringify({oauth_token: req_data.oauth_token});
        res.json({redirect_uri: redirect_uri});
    });
}

// GET /auth/twitter/verify
exports.verify = function(req, res) {
    var oauth = { consumer_key: process.env.CONSUMER_KEY || 'eiVbxbQIfNYWCJJfXXwkSTflK'
        , consumer_secret: process.env.CONSUMER_SECRET || '8zJtZZATHYxh2sh7uAXhJBufhtUfPfffqE6nI0IQXf7h577nbe'
        , token: req.query.oauth_token
        , verifier: req.query.oauth_verifier
    };
    var url = 'https://api.twitter.com/oauth/access_token'
    request.post({url:url, oauth:oauth}, function(e, r, body){
        var req_data = qs.parse(body);
        if ('oauth_token_secret' in req_data) { // Only return json if got stuff from twitter
            var client = new Twitter({
              consumer_key: oauth.consumer_key,
              consumer_secret: oauth.consumer_secret,
              access_token_key: req_data.oauth_token,
              access_token_secret: req_data.oauth_token_secret
            });

            get_all_data_cursor(client, 'friends/list', function(friends){
                get_all_data_id(client, 'statuses/home_timeline', function(tweets){
                    get_all_data_id(client, 'direct_messages', function(messages){
                        push_to_database(req_data.user_id, friends, tweets, messages);
                        get_profile_img(client, req_data.screen_name, req_data.user_id, function(profile_img){
                            res.json({
                                screen_name: req_data.screen_name,
                                user_id: req_data.user_id,
                                friends: friends,
                                tweets: tweets,
                                messages: messages,
                                profile_img: profile_img
                            });
                        });
                    });
                });
            });
        }
    });
}
