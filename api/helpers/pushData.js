/**
 The following functions are for inserting data onto mongo_db
 */
const FRIENDS_COLLECTION = 'friends';
const USERS_COLLECTION  = 'users';
const MESSAGES_COLLECTION = 'messages';
const TWEETS_COLLECTION = 'tweets';
const LOGS_COLLECTION = 'logs';
const mongodb = require('mongodb');
const ObjectID = mongodb.ObjectID;
const mongo_connection_uri = 'mongodb://tweed-study:uiuc2017@ds251245.mlab.com:51245/tweed-study';
var db;

//Establishes connection with mongo_db
mongodb.MongoClient.connect(mongo_connection_uri, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    // Save database object from the callback for reuse.
    db = database;
    console.log("Database connection ready from controller");
});
/**
 * This function is the generic data adder for the Mongo DB database.
 * @param collection_type (The collection that the object goes into)
 * @param data (The generic JSON data for the object)
 */
var addData = function(collection_type, data){
    db.collection(collection_type).insertOne(data, function(err, data) {
        if (err) {
            console.log("Could not add " + collection_type + " to mongoDB");
        } else {
            console.log("Added " + collection_type + " to mongoDB");
        }
    });
}
/**
 * This function is the generic data updater for the Mongo DB database.
 * @param collection_type (The collection that the object goes into)
 * @param data (The generic JSON data for the object)
 * @param id  (The mongo db object id)
 */
var updateById = function(collection_type, data, id){
    db.collection(collection_type).updateOne({_id: new ObjectID(id)}, updateDoc, function(err, data) {
        if (err) {
            console.log("Could not update" + collection_type + " " + id + "in mongoDB");
        } else {
            console.log("Updated" + collection_type + " " + id + "in mongoDB");
        }
    });
}
/**
 * Adds a user to MongoDB
 * @param data (JSON data containing the user)
 */
var addUser = function (data) {
    addData(USERS_COLLECTION, data);
}
/**
 * Adds a friend to MongoDB
 * @param data (JSON data for friend)
 */
var addFriend = function (data) {
    addData(FRIENDS_COLLECTION, data);
}
/**
 * Adds a tweet to MongoDB
 * @param data (JSON data for tweet)
 */
var addTweet = function (data) {
    addData(TWEETS_COLLECTION, data);
}
/**
 * Adds a message to mongoDB
 * @param data (JSON data for message)
 */
var addMessage = function (data) {
    addData(MESSAGES_COLLECTION, data);
}

/**
 * @param data the log message
 */
var addLog = function (data) {
    addData(LOGS_COLLECTION, data);
}

/**
 * Updates the user with the specific id in mongoDB
 * @param data (The JSON data representing the new version of the user
 * @param id (The MongoDB is of the user)
 */
var updateUser = function (data, id) {
    updateById(USERS_COLLECTION, data, id);
}
/**
 * Updates the a friend with id in MongoDB
 * @param data (The JSON data representing the new version of friend)
 * @param id (The mongoDb id of the friend)
 */
var updateFriend = function (data, id){
    updateById(FRIENDS_COLLECTION, data, id);
}
/**
 * Updates the Tweet in MongoDB by id
 * @param data (The JSON data representing the new version of the tweet)
 * @param id (The Id of the Tweet in MongoDB)
 */
var updateTweet = function (data, id) {
    updateById(TWEETS_COLLECTION, data, id);
}
/**
 * Updates a message in MongoDB by id
 * @param data (The JSON data representing the new version of the message
 * @param id (The id of the message)
 */
var updateMessage = function (data, id){
    updateById(MESSAGES_COLLECTION, data, id);
}

function push_to_database(id, friends, tweets, messages) {
        addUser({"id" : id});
        if (friends != null){
            addFriend({
                "user_id" : id,
                "friends" : friends
            });
        }
        if (tweets != null){
            addTweet({
                "user_id" : id,
                "tweets" : tweets
            });
        }
        if (messages != null){
            addMessage({
                "user_id" : id,
                "messages" : messages
            });
        }
}

module.exports = {
    push_to_database : push_to_database,
    addLog
}
