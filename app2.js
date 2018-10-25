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

    insertDocuments(database).then(result => {// if wanted value, then should have this
        findDocuments((database) => {
            updateDocument(database).then(result => {
                removeDocument((database) => {
                    indexCollection((database) => {
                        client.close();
                    })
                })
            })
        })
    })
});

const insertDocuments = (database) => {
    const collection = database.collection("documents");
    return collection.insertMany([ // this will auto return collection to caller; promises are async; return promise to caller and it can chain and what it wants 
        {a: 1},
        {a: 2},
        {a: 3}
    ])
        .then((result) => { // this is the callback; dont like err, so do .catch somewherer
            assert.equal(3, result.result.n);
            assert.equal(3, result.ops.length);
            console.log("Inserted 3 documents into the collection.");
            return result; // if care about seeing this result in a future then
        }).catch(err => console.log(err)); // null or not auto goes here, so dont have to manually check to see if error is there 
};

const findDocuments = (database, callback) => {
    const collection = database.collection("documents");
    // collection.find({}).toArray((err, docs) => {
    //     assert.equal(err, null);
    //     console.log("Found the following records");
    //     console.log(docs);
    //     callback(docs);
    // });

    collection.find({"a": 3}).toArray((err, docs) => {
        assert.equal(err, null);
        console.log(`Found the following records with ("a": 3).`);
        console.log(docs);
        callback(docs);
    });
};

const updateDocument = (database) => {
    const collection = database.collection("documents");
    return collection.updateOne(
        {a: 2}, 
        {$set: {b: 1}})
            .then((result) => {
                assert.equal(1, result.result.n); // the assertuins are here to help run it
                console.log("Updated the document with the field a = 2.");
                return result;
            }).catch(err => console.log(err));
};

const removeDocument = (database, callback) => {
    const collection = database.collection("documents");
    collection.deleteOne({a: 3}, (err, result) => {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the documents with the field a = 3.");
        callback(result);
    });
};

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