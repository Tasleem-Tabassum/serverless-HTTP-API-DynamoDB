import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB();

export const getUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let tableItems;

    try {
        await dynamodb.scan({ 
            TableName: process.env.USERS_TABLE || ''
        }, (error, data) => {
            tableItems = data.Items
        })
        return {
            statusCode: 200,
            body: JSON.stringify(tableItems)
        }
    } catch(error) {
        console.error('Error while fetching table items:', error);
    
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Failed fetching table items' }),
        };
    }
}