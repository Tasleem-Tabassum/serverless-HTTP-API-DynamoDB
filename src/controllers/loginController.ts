import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS, { dynamodb } from '../config/aws';

export const loginController = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const body: string | null = event.body ?? null;

      if (!body) {
        return {
          statusCode: 400,
          body: 'Request body is missing',
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({  })
      }

    } catch(error) {
        console.error('Error while login:', error);
    
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Login Failed!' }),
        };
    }
}
