/*global require, module*/
var ApiBuilder = require('claudia-api-builder'),
    api = new ApiBuilder(),
    Promise = require('bluebird'),
    AWS = require("aws-sdk"),
    DOC = require("dynamodb-doc");

// Create a promisified version of the docClient 
var docClient = Promise.promisifyAll(new DOC.DynamoDB())

// Export the api 
module.exports = api;

// Create a new user
api.post('/users', function(request) {
	'use strict';
    
    var params = {
        TableName: getTableName(request),
        Item: {
            userId: request.body.userId,
            name: request.body.name,
            age: request.body.age
        }
    };

    return docClient.putItemAsync(params);

}, { success: 201 }); // Return HTTP status 201 - Created when successful

// get user for {id}
api.get('/users/{id}', function(request) {
    'use strict';
    
    // Set up parameters for dynamo
    var params = {
        TableName: getTableName(request),
        Key: {
            userId: request.pathParams.id
        }
    };

    // Get the item using our promisified function
    return docClient.getItemAsync(params);

});

// update the user name and age
api.put('/users/{id}', function(request) {
	'use strict';
    
    var params = {
        TableName: getTableName(request),
        Key: {
            userId: request.pathParams.id
        },
		UpdateExpression: "set #name = :n, age = :a",
		ExpressionAttributeNames : {"#name" : "name" },
		ExpressionAttributeValues: {
		    ":n":request.body.name,
		    ":a":request.body.age
		}
    };

    return docClient.updateItemAsync(params);

}); //200 ok is standard for non-errors

// delete user with {id}
api.delete('/users/{id}', function(request) {
	'use strict';
    
    // Set up parameters for dynamo
    var params = {
        TableName: getTableName(request),
        Key: {
            userId: request.pathParams.id
        }
    };

	// Get the item using our promisified function
    // return a nice little message in the .then-clause
    return docClient.deleteItemAsync(params)
        .then(function(data) {
            return "Deleted user with id '" + request.pathParams.id + "'";
        });

}); //200 ok is standard for non-errors

function getTableName(request) {
    // The table name is stored in the Lambda stage variables
    // Go to https://console.aws.amazon.com/apigateway/home/apis/[YOUR API ID]/stages/latest
    // and click Stages -> latest -> Stage variables

    // These values will be found under request.env
    // Here's I'll use a default if not set
    return request.env.tableName || "lambda-users";
};