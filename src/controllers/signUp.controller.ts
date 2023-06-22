import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS, { dynamodb } from '../config/aws';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getUserFromDb } from "./getUser.controller";

export const signUpController = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const body: string | null = event.body ?? null;

        if (!body) {
            return {
              statusCode: 400,
              body: 'Request body is missing',
            };
        }

        const { userName, password, name, mobile, role } = JSON.parse(body);

        if(!userName || !password || !name || !mobile || !role) {
            return {
                statusCode: 400,
                body: "All the fields are mandatory"
            }
        }

        if(typeof userName !== 'string') {
            return {
                statusCode: 400,
                body: "UserName must be a string"
            }
        }

        if(typeof password !== 'string') {
            return {
                statusCode: 400,
                body: "Password must be a string"
            }
        }

        if(typeof name !== 'string') {
            return {
                statusCode: 400,
                body: "Name must be a string"
            }
        }
        
        if(typeof mobile !== 'number') {
            return {
                statusCode: 400,
                body: "Mobile Number must be a number"
            }
        }

        const user = await getUserFromDb(userName, mobile);

        if(user) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "UserName already exists!"
                })
            };
        }

        const passwordHash = await bcrypt.hash(password, 8);

        const params = {
            TableName: process.env.USERS_TABLE || '',
            Item: {
                id: uuidv4(),
                UserName: userName,
                Password: passwordHash,
                Name: name,
                Role: role,
                MobileNumber: mobile,
                createdAt: new Date().toISOString()
            }
        }

        await dynamodb.put(params).promise();
        
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