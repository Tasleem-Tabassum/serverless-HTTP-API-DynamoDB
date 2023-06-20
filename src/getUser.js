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
exports.getUser = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dynamodb = new aws_sdk_1.default.DynamoDB();
const getUser = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let tableItems;
    try {
        yield dynamodb.scan({
            TableName: process.env.USERS_TABLE || ''
        }, (error, data) => {
            tableItems = data.Items;
        });
        return {
            statusCode: 200,
            body: JSON.stringify(tableItems)
        };
    }
    catch (error) {
        console.error('Error while fetching table items:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed fetching table items' }),
        };
    }
});
exports.getUser = getUser;
