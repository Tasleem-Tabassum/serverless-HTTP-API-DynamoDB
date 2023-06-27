import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { dynamodb } from "../config/aws";
import * as jwt from 'jsonwebtoken';

export const updateUserController = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      console.log(event)
      const authToken = event.headers?.authorization || '';

      const token = authToken.split(' ')[1];

      const secretKey = process.env.JWT_SECRET || ''

      const decodedToken: any = jwt.verify(token, secretKey);

      console.log(decodedToken)

      if(!decodedToken || !decodedToken.UserName) {
        console.log('decodedToken',decodedToken)
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized' }),
        };
      }

      const reqData: string | null = event.body ?? null;

      if (!reqData) {
        return {
          statusCode: 400,
          body: 'Request body is missing',
        };
      }

      const { userName, password, name, role, mobile } = JSON.parse(reqData);

      const updateExpression = 'SET #password = :password, #name = :name, #role = :role';
      const expressionAttributeNames = {
        '#password': 'Password',
        '#name': 'Name',
        '#role': 'Role',
      };
      const expressionAttributeValues = {
        ':password': password,
        ':name': name,
        ':role': role,
      }

      const params = {
        TableName: process.env.USERS_TABLE || '',
        Key: {
          'UserName': userName,
          'MobileNumber': mobile
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      };

      const data = await dynamodb.update(params).promise();

      return {
        statusCode: 200,
        body: JSON.stringify({ user: data.Attributes })
      }

    } catch(error) {
        console.error('Error while updating user profile:', error);
    
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Failed to update user profile' }),
        };
    }
}