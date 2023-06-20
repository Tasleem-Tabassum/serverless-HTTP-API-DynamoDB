"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dynamodb = new aws_sdk_1.default.DynamoDB();
const signUp = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const body = (_a = event.body) !== null && _a !== void 0 ? _a : null;
        if (!body) {
            return {
                statusCode: 400,
                body: 'Request body is missing',
            };
        }
        const { userName, password, name, mobile } = JSON.parse(body);
        if (!userName || !password || !name || !mobile) {
            return {
                statusCode: 400,
                body: "All the fields are mandatory"
            };
        }
        yield dynamodb.putItem({
            TableName: process.env.USERS_TABLE || '',
            Item: {
                UserName: userName,
                Password: password,
                Name: name,
                MobileNumber: mobile
            }
        }).promise();
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: "signup successful"
            })
        };
    }
    catch (error) {
        console.error('Error while signup:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Signup Failed' }),
        };
    }
});
exports.signUp = signUp;
