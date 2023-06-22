import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { getUserFromDb } from "./getUser.controller";
import { dynamodb } from "../config/aws";

export const changePasswordController = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const decodedToken = (event as any).decodedToken;

      if(!decodedToken || !event.body) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: 'Unauthorized' }),
        }
      }

      const reqData = JSON.parse(event.body);
      const { userName, oldPassword, newPassword, mobile } = reqData;

      const oldPasswordMatch = await verifyPassword(userName, oldPassword, mobile);

      if(!oldPasswordMatch) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Old password is incorrect' }),
        };
      }

      const passwordHash = await bcrypt.hash(newPassword, 8);
      await updatePassword(userName, passwordHash);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Password changed successfully' })
      }

    } catch(error) {
        console.error('Error while changing password:', error);
    
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Changing password failed' }),
        };
    }
}

const verifyPassword = async (userName: string, password: string, mobile: number) => {
  const user = await getUserFromDb(userName, mobile);

  if(!user) {
    return false;
  }

  return bcrypt.compare(password, user.password)
}

const updatePassword = async (userName: string, password: string) => {
  try {

    const params = {
      TableName: process.env.USERS_TABLE || '',
      Key: {
        'UserName': userName
      },
      UpdateExpression: 'SET Password = :password',
      ExpressionAttributeValues: {
        ':password': password
      }
    };

    await dynamodb.update(params).promise();
  } catch(error) {
    console.error('Error while updating password:', error);
    throw error;
  }
}