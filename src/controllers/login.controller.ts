import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS, { dynamodb } from '../config/aws';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { getUserFromDb } from "./getUser.controller";

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

    const { userName, mobile, password } = reqData

    // const params = {
    //   TableName: process.env.USERS_TABLE || '',
    //   Key: {
    //     'UserName': userName,
    //     'MobileNumber': mobile
    //   },
    //   ProjectionExpression: 'UserName'
    // }

    // const data = await dynamodb.get(params).promise()


    const user = await getUserFromDb(userName, mobile)



    console.log(user)
    const itemRetrieved = user.Items
    console.log("item retreived from db",itemRetrieved)

    if(!itemRetrieved) {
      return {
        statusCode: 404,
        body: "User not found"
      }
    }

    const isMatch = await bcrypt.compare(password, itemRetrieved.password)
    console.log("comparing passwords", isMatch)

    if(!isMatch) {
      return {
        statusCode: 404,
        body: "Unable to login!"
      }
    } else {
      console.log("Before generating token")
      const token = jwt.sign({UserName: userName}, process.env.JWT_SECRET || '', {
        expiresIn: 3600
      })
      console.log("Before generating token")

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
