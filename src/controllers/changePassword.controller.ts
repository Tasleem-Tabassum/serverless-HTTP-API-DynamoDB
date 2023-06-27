import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { getUserFromDb } from "./getUser.controller";
import { dynamodb } from "../config/aws";

export const changePasswordController = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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

      const userNameFromToken = decodedToken.UserName;

      const user = await getUserFromDb(userNameFromToken)
      console.log('user in getuser',user)

      const reqData: string | null = event.body ?? null;

      if (!reqData) {
        return {
          statusCode: 400,
          body: 'Request body is missing',
        };
      }
      const { userName, oldPassword, newPassword, mobile } = JSON.parse(reqData);

      const oldPasswordMatch = await verifyPassword(userName, oldPassword, mobile);
      console.log(oldPasswordMatch)

      if(!oldPasswordMatch) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Old password is incorrect' }),
        };
      }

      const passwordHash = await bcrypt.hash(newPassword, 8);
      const updatedUser = await updatePassword(userName, passwordHash, mobile);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Password changed successfully', updatedUser })
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
  const user = await getUserFromDb(userName);
  console.log(user[0])

  const passwordFromDb: string = user[0].Password
  console.log(passwordFromDb)

  if(!passwordFromDb || passwordFromDb?.length === 0) {
    return false;
  }

  return await bcrypt.compare(password, passwordFromDb)
}

const updatePassword = async (userName: string, password: string, mobile: number) => {
  try {

    const params = {
      TableName: process.env.USERS_TABLE || '',
      Key: {
        'UserName': userName,
        'MobileNumber': mobile
      },
      UpdateExpression: 'SET Password = :password',
      ExpressionAttributeValues: {
        ':password': password
      }
    };

    const updatedUser = await dynamodb.update(params).promise();
    return updatedUser;
  } catch(error) {
    console.error('Error while updating password:', error);
    throw error;
  }
}