import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS, { dynamodb } from '../config/aws';

export const getUserController = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let tableItems;

    try {
        await dynamodb.scan({ 
            TableName: process.env.USERS_TABLE || ''
        }, (error: AWS.AWSError, data: AWS.DynamoDB.ScanOutput) => {
            if(error) {
                console.log('Error occured while scanning data from DynamoDB')
            } else {
                tableItems = data.Items
            }
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