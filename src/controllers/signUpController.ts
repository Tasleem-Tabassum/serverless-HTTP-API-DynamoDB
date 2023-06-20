import * as AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamodb = new AWS.DynamoDB();

export const signUpController = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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

        if(userName !== String) {
            return {
                statusCode: 400,
                body: "UserName must be a string"
            }
        }

        if(password !== String) {
            return {
                statusCode: 400,
                body: "Password must be a string"
            }
        }

        if(name !== String) {
            return {
                statusCode: 400,
                body: "Name must be a string"
            }
        }
        
        if(mobile !== Number) {
            return {
                statusCode: 400,
                body: "Mobile Number must be a number"
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