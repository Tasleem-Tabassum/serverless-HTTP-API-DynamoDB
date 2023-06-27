import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS, { dynamodb } from '../config/aws';
import * as jwt from 'jsonwebtoken';

export const getUserController = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {

      const authToken = event.headers?.authorization || '';

      const token = authToken.split(' ')[1];

      const secretKey = process.env.JWT_SECRET || ''

      const decodedToken: any = jwt.verify(token, secretKey);

      console.log(decodedToken)

      if(!authToken || !decodedToken || !decodedToken.UserName) {
        console.log('decodedToken',decodedToken)
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized' }),
        };
      }

      const userName = decodedToken.UserName;

      const user = await getUserFromDb(userName)
      console.log('user in getuser',user)

      if(!user) {
          return {
              statusCode: 404,
              body: JSON.stringify({ message: "User not found" })
          }
      }
      
      return {
          statusCode: 200,
          body: JSON.stringify({ user })
      }
  } catch (error) {
    console.error('Error while fetching table items:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed fetching table items' }),
    };
  }
};

export const getUserFromDb = async (userName: string): Promise<any> => {
  const params = {
    TableName: process.env.USERS_TABLE || '',
    KeyConditionExpression: 'UserName = :userName',
    ExpressionAttributeValues: {
      ':userName': userName,
    }
  };

  try {
    const data = await dynamodb.query(params).promise();
    console.log('data from query', data.Items);
    return data.Items;
  } catch (error) {
    console.log('Error occurred while scanning data from DynamoDB', error);
    return null;
  }
};
