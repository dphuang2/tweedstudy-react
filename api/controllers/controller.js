'use strict';

var qs = require('querystring');
var request = require('request');
var Twitter = require('twitter');

var mongoose = require('mongoose'),
  Task = mongoose.model('Tasks');

exports.list_all_tasks = function(req, res) {
  Task.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.create_a_task = function(req, res) {
  var new_task = new Task(req.body);
  new_task.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.read_a_task = function(req, res) {
  Task.findById(req.params.taskId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.update_a_task = function(req, res) {
  Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.delete_a_task = function(req, res) {
  Task.remove({
    _id: req.params.taskId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};

// GET /getTweets
exports.get_tweets = function(req, res) {
  var json = JSON.parse(require('fs').readFileSync('data/tweets.json', 'utf8'));
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
                        res.json({
                            screen_name: req_data.screen_name,
                            user_id: req_data.user_id,
                            friends: friends,
                            tweets: tweets,
                            messages: messages
                        });
                    });
                });
            });
            // res.json({oauth_token: req_data.oauth_token,
            //     oauth_token_secret: req_data.oauth_token_secret,
            //     screen_name: req_data.screen_name,
            //     user_id: req_data.user_id});
        }
    });
}

// get all cursored data with max_id
function get_all_data_id(client, target, callback){
    var result = [];
    var max_id = -1;
    get_data(client, {count: 200}, target, function cursoring(json){
        if (json != null && json.length > 1){
            if (max_id == -1){
                result.push.apply(result, json);
            } else{
                result.push.apply(result, json.slice(1));
            }
            max_id = json[json.length-1].id;
            get_data(client, {max_id: max_id, count: 200}, target, cursoring);

        } else{
            callback(result);
        }
    });
}

// get all cursored data with next_cursor
function get_all_data_cursor(client, target, callback){
    var result = [];
    get_data(client, {count: 200}, target, function cursoring(json){
        if (json != null){
            result.push.apply(result, json.users);
            if (json.next_cursor != 0){
                get_data(client, {cursor: json.next_cursor, count: 200}, target, cursoring);
            } else{
                callback(result);
            }
        } else{
            callback(result);
        }
    });
}

// call node-twitter's function to get data from twitter
function get_data(client, params, target, callback){
    client.get(target, params, function(error, json, response) {
        if (!error) {
            callback(json);
        } else{
            console.log(target);
            console.log(error);
            callback(null);
        }
    });
}
