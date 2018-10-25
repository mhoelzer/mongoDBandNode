const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// connection url
const url = "mongodb://localhost:27017";

// db name
const dbName = "myproject";

// use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    client.close();
})