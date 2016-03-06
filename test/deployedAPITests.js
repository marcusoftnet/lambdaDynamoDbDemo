var should = require("should");
var request = require('request');

describe("Integration tests of the deployed API", function() {

    after(function(done) {
        request({
            url: getURLToDeployedLambda(testUserData.userId),
            method: "DELETE",
            headers: {
                "content-type": "application/json",
            }
        }, function(err, response) {
            response.statusCode.should.equal(200);
            done();
        });
    })

    it("create a new user", function(done) {
        createNewUserAnd(testUserData, function(response) {
            response.statusCode.should.equal(201);
            done();
        });
    });

    it("get a user by id", function(done) {

        createNewUserAnd(testUserData, function(response) {
            request({
                url: getURLToDeployedLambda(testUserData.userId),
                method: "GET",
                headers: {
                    "content-type": "application/json",
                }
            }, function(err, response) {
                response.statusCode.should.equal(200);

                var body = JSON.parse(response.body);
                body.Item.name.should.equal(testUserData.name);
                done();
            });
        });
    });

    it("updates user data", function(done) {

        createNewUserAnd(testUserData, function(response) {
            var updatedUserData = testUserData;
            updatedUserData.name = "Carl Marcus Hammarberg";

            request({
                url: getURLToDeployedLambda(testUserData.userId),
                method: "PUT",
                json: true,
                headers: {
                    "content-type": "application/json",
                },
                body: updatedUserData
            }, function(err, response) {
                response.statusCode.should.equal(200);

                request({
                    url: getURLToDeployedLambda(updatedUserData.userId),
                    method: "GET",
                    headers: {
                        "content-type": "application/json",
                    }
                }, function(err, response) {
                    response.statusCode.should.equal(200);

                    var body = JSON.parse(response.body);
                    body.Item.name.should.equal(updatedUserData.name);
                    done();
                });
            });
        });
    });

    it("delete a user by id", function(done) {

        createNewUserAnd(testUserData, function(response) {
            request({
                url: getURLToDeployedLambda(testUserData.userId),
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                }
            }, function(err, response) {
                response.statusCode.should.equal(200);
                done();
            });
        });
    });

    function createNewUserAnd(userData, cb) {
        request({
            url: getURLToDeployedLambda(),
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: userData
        }, function(err, response) {
            if (err) throw "There was an error: " + err.message;
            cb(response);
        });
    };

    var getURLToDeployedLambda = function(id) {
        var config = require("../claudia.json");
        var apiId = config.api.id;
        var region = config.lambda.region;

        var suffix = id ? "/" + id : "";

        return "https://" + apiId + ".execute-api." + region + ".amazonaws.com/latest/users" + suffix;
    };

    var testUserData = {
        'userId': '123',
        'name': 'Marcus Hammarberg',
        'age': 43
    };

});