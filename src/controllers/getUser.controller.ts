import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS, { dynamodb } from '../config/aws';

export const getUserController = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
      const decodedToken = (event as any).decodedToken;
      console.log('decodedToken',decodedToken)

      if(!decodedToken || !(event as any).body.UserName) {
        console.log('decodedToken',decodedToken)
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized' }),
        };
      }

      const userName = (event as any).body.UserName;
      const mobile = (event as any).body.Mobile;

      const user = await getUserFromDb(userName, mobile)
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

export const getUserFromDb = async (userName: string, mobile: number): Promise<any> => {
  const params = {
    TableName: process.env.USERS_TABLE || '',
    KeyConditionExpression: 'UserName = :userName',
    ExpressionAttributeValues: {
      ':userName': userName,
    },
    ProjectionExpression: 'UserName, Password'
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
