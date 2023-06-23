import * as AWS from "aws-sdk";
import * as dotenv from 'dotenv';
dotenv.config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY || 'AKIAUVT4VM35WYIZQG7H',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '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',
    region: process.env.AWS_REGION || 'us-east-1',
})

export const dynamodb = new AWS.DynamoDB.DocumentClient();

export default AWS;