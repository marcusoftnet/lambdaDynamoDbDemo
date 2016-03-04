/* global require, module */
var ApiBuilder = require("claudia-api-builder");
var api = new ApiBuilder();

api.get("/users/{id}", function (request) {
	'use strict';
	var name = request.pathParams.id;

	return "Returning user with id:" + id;
});