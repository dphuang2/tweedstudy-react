'use strict';
module.exports = function(app) {
  var tweedStudy = require('../controllers/controller');

  /*
   * Example
  app.route('/tasks')
    .get(todoList.list_all_tasks)
    .post(todoList.create_a_task);
    */

  app.route("/getTweets")
  .get(tweedStudy.get_tweets);

  app.route("/auth/twitter")
    .get(tweedStudy.authenticate);

  app.route("/auth/twitter/verify")
    .get(tweedStudy.verify);

  app.route("/getFriends")
  .get(tweedStudy.get_friends);

  app.route("/getMessages")
  .get(tweedStudy.get_messages);

  app.route("/getUsers")
  .get(tweedStudy.get_users);

  app.route("/postLog")
  .post(tweedStudy.post_log);
};
