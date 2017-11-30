var express = require('express');
var router = express.Router();
var MESSAGES_COLLECTION = 'messages';
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
    console.log("/cities Database connection ready");
});
// Generic error handler used by all endpoints.
var handleError = function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
};

/* GET single MESSAGES by id listing. */
router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    db.collection(MESSAGES_COLLECTION).findOne({ _id: new ObjectID(id) }, function(err, doc) {
        if (err) {
            app.handleError(res, err.message, "Failed to find MESSAGES");
        } else {
            res.status(200).json(doc);
        }
    });
});

/* GET all MESSAGES */
router.get('/', function (req, res, next){

    db.collection(MESSAGES_COLLECTION).find({}).toArray(function (err, docs) {
        if (err){
            app.handleError(res, err.message, "Failed to get MESSAGESs");
        }

        else {
            res.status(200).json(docs)
        }
    })
});

/*POST MESSAGES */
router.post('/', function(req, res, next){
    var newMessage = req.body;


    db.collection(MESSAGES_COLLECTION).insertOne(newMessage, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new MESSAGE.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});
/*UPDATE MESSAGES */
router.put('/:id', function (req, res, next){
    var updateDoc = req.body;
    delete updateDoc._id;

    db.collection(MESSAGES_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to update MESSAGES");
        } else {
            updateDoc._id = req.params.id;
            res.status(200).json(updateDoc);
        }
    });
})
/*DELETE MESSAGES */

router.delete('/:id', function (req, res, next){
    db.collection(MESSAGES_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
        if (err) {
            handleError(res, err.message, "Failed to delete MESSAGES");
        } else {
            res.status(200).json(req.params.id);
        }
    });
})


module.exports = router;