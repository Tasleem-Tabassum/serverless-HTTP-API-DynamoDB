import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS, { dynamodb } from '../config/aws';

export const updateUserController = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

      return {
        statusCode: 200,
        body: JSON.stringify({  })
      }

    } catch(error) {
        console.error('Error while updating user profile:', error);
    
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Failed to update user profile' }),
        };
    }
}