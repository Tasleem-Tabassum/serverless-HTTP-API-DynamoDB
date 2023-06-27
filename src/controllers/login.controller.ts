import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS, { dynamodb } from '../config/aws';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { getUserFromDb } from "./getUser.controller";
import * as dotenv from 'dotenv';
dotenv.config();

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

    if (!password) {
      return {
        statusCode: 500,
        body: "User password is missing",
      };
    }

    const user = await getUserFromDb(userName);

    console.log("user retrieved from db", user);

    if (!user || user.length === 0 || !user[0].Password) {
      return {
        statusCode: 404,
        body: "User not found",
      };
    }

    const userPassword = user[0].Password;

    const isMatch = await bcrypt.compare(password, userPassword);

    console.log("Comparing passwords:", isMatch);

    if (!isMatch) {
      return {
        statusCode: 401,
        body: "Invalid password",
      };
    } else {
      console.log("Before generating token")
      const secretKey = process.env.JWT_SECRET || ''
      const token = jwt.sign({UserName: userName}, secretKey, {
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
