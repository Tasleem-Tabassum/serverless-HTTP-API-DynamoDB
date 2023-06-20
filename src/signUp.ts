import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamodb = new AWS.DynamoDB();

export const signUp = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const body: string | null = event.body ?? null;

        if (!body) {
            return {
              statusCode: 400,
              body: 'Request body is missing',
            };
        }

        const { userName, password, name, mobile } = JSON.parse(body);

        if(!userName || !password || !name || !mobile) {
            return {
                statusCode: 400,
                body: "All the fields are mandatory"
            }
        }

        await dynamodb.putItem({
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
        }
    } catch(error) {
        console.error('Error while signup:', error);
    
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Signup Failed' }),
        };
    }
}