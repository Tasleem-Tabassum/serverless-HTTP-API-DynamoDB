import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { dynamodb } from "../config/aws";

export const updateUserController = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

      const decodedToken = (event as any).decodedToken;

      if(!decodedToken || !event.body) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: 'Unauthorized' }),
        };
      }

      const userName = decodedToken.UserName;

      const reqData = JSON.parse(event.body);
      const { password, name, role, mobile } = reqData;

      const updateExpression = 'SET #password = :password, #name = :name, #role = :role, #mobile = :mobile';
      const expressionAttributeNames = {
        '#password': 'Password',
        '#name': 'Name',
        '#role': 'Role',
        '#mobile': 'MobileNumber'
      };
      const expressionAttributeValues = {
        ':password': password,
        ':name': name,
        ':role': role,
        ':mobile': mobile
      }

      const params = {
        TableName: process.env.USERS_TABLE || '',
        Key: {
          'UserName': userName
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