import * as AWS from "aws-sdk";
import * as dotenv from 'dotenv';
dotenv.config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
})

export const dynamodb = new AWS.DynamoDB.DocumentClient();

export default AWS;