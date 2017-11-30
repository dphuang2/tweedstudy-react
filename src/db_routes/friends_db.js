var express = require('express');
var router = express.Router();
var FRIENDS_COLLECTION = 'friends';
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var mongo_connection_uri = 'mongodb://tweed-study:uiuc2017@ds251245.mlab.com:51245/tweed-study';
var db;

mongodb.MongoClient.connect(mongo_connection_uri, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    // Save database object from the callback for reuse.
    db = database;
    console.log("/friends Database connection ready");
});
// Generic error handler used by all endpoints.
var handleError = function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
};


/* GET single FRIENDS by id listing. */
router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    db.collection(FRIENDS_COLLECTION).findOne({ _id: new ObjectID(id) }, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to find FRIENDS");
        } else {
            res.status(200).json(doc);
        }
    });
});

/* GET all FRIENDS */
router.get('/', function (req, res, next){

    db.collection(FRIENDS_COLLECTION).find({}).toArray(function (err, docs) {
        if (err){
            handleError(res, err.message, "Failed to get FRIENDS");
        }

        else {
            res.status(200).json(docs)
        }
    })
});

/*POST FRIENDS */
router.post('/', function(req, res, next){
    var newFriend = req.body;
    db.collection(FRIENDS_COLLECTION).insertOne(newFriend, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new FRIEND.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});
/*UPDATE FRIENDS */
router.put('/:id', function (req, res, next){
    var updateDoc = req.body;
    delete updateDoc._id;

    db.collection(FRIENDS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to update FRIENDS");
        } else {
            updateDoc._id = req.params.id;
            res.status(200).json(updateDoc);
        }
    });
})
/*DELETE FRIENDS */

router.delete('/:id', function (req, res, next){
    db.collection(FRIENDS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
        if (err) {
            handleError(res, err.message, "Failed to delete FRIENDS");
        } else {
            res.status(200).json(req.params.id);
        }
    });
})


module.exports = router;