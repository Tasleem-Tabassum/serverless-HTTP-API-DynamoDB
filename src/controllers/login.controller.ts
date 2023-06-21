import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS, { dynamodb } from '../config/aws';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';


export const loginController = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const body: string | null = event.body ?? null;

      if (!body) {
        return {
          statusCode: 400,
          body: 'Request body is missing',
        };
      }

      const reqData = JSON.parse(body)

      const { userName, password } = reqData

      const params = {
        TableName: process.env.USERS_TABLE || '',
        Key: {
          'UserName': userName
        },
        ProjectionExpression: 'UserName'
      }

      const data = await dynamodb.get(params).promise()
      const itemRetrieved = data.Item
      if(!itemRetrieved) {
        return {
          statusCode: 404,
          body: "User not found"
        }
      }

      const isMatch = await bcrypt.compare(password, itemRetrieved.password)
      if(!isMatch) {
        return {
          statusCode: 404,
          body: "Unable to login!"
        }
      } else {
        const token = jwt.sign({UserName: userName}, process.env.JWT_SECRET || '', {
          expiresIn: 3600
        })
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Login successful', token })
        }
      }

    } catch(error) {
        console.error('Error while login:', error);
    
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Login Failed!' }),
        };
    }
}
