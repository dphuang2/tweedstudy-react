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
};
