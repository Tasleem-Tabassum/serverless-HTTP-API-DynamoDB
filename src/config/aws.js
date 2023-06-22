"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamodb = void 0;
var AWS = require("aws-sdk");
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
exports.dynamodb = new AWS.DynamoDB.DocumentClient();
exports.default = AWS;
