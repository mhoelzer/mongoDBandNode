const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// connection url
const url = "mongodb://localhost:27017";

// db name
const databaseName = "myproject";

// use connect method to connect to the server
MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server!");
    const database = client.db(databaseName);
    // client.close();  // <-- connect to mongodb; connect to server and db myproject; this part just prints the console and ends the mongo stuff

    // // call the insertDocument function 
    // insertDocuments(database, () => {
    //     client.close();
    // });

    // // findDocument method to mongoclient.connect callback
    // insertDocuments(database, () => {
    //     findDocuments(database, () => {
    //         client.close();
    //     });
    // });

    // // callback function from MC.connect to include update method 
    // insertDocuments(database, () => {
    //     updateDocument(database, () => {
    //         client.close();
    //     });
    // });
    
    // // remove method to MC.con cb fun 
    // insertDocuments(database, () => {
    //     updateDocument(database, () => {
    //         removeDocument(database, () => {
    //             client.close();
    //         });
    //     });
    // });
    
    // add indexCol method to app 
    insertDocuments(database, () => {
        indexCollection(database, () => {
            client.close();
        });
    });
});

// this adds 3 docs to the documents collection
const insertDocuments = (database, callback) => {
    // get the documents collection
    const collection = database.collection("documents");
    // insert some docuemtns; returns obj with fields: results (result doc from mongodb), ops (ducs inserted with added _id fields), and connection (connection used to perform the insert)
    collection.insertMany([
        {a: 1},
        {a: 2},
        {a: 3}
    ], (err, result) => { // this is the callback function; err is where first param is always err; check for error right away then do something, but if not, w/e
        assert.equal(err, null); // null is absence of obj; if err null, no issue
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection.");
        callback(result); // hey call this function when you're ready since youre doing async stuff; we will give the function and youi do it when you get want 
    });
};

// query that returns all the doucments in the documents collection 
const findDocuments = (database, callback) => {
    // get the documents collection
    const collection = database.collection("documents");
    // // find some documents
    // collection.find({}).toArray((err, docs) => {
    //     assert.equal(err, null);
    //     console.log("Found the following records");
    //     console.log(docs);
    //     callback(docs);
    // });

    // query filter to find documents that meet query criteria (documents with a: 3)
    collection.find({"a": 3}).toArray((err, docs) => {
        assert.equal(err, null);
        console.log(`Found the following records with ("a": 3).`);
        console.log(docs);
        callback(docs);
    });
};

// operation updates a doc in the docs collection
const updateDocument = (database, callback) => {
    // get the docs collection
    const collection = database.collection("documents");
    // update doc to where a is 2, set b to 1; field a is equal to 2 by adding new field b to the document set to 1
    collection.updateOne(
        {a: 2}, 
        {$set: {b: 1}}, 
        (err, result) => {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("Updated the document with the field a = 2.");
            callback(result);
        });
};

// remove doc where field a = 3
const removeDocument = (database, callback) => {
    // get the docs collection
    const collection = database.collection("documents");
    // delete doc where a = 3
    collection.deleteOne({a: 3}, (err, result) => {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the documents with the field a = 3.");
        callback(result);
    });
};

// creates index on a field in docs collection
const indexCollection = (database, callback) => {
    database.collection("documents").createIndex(
        {"a": 1},
        null,
        (err, results) => {
            console.log(results);
            callback();
        }
    );
};