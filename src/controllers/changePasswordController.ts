import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const changePasswordController = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      return {
        statusCode: 200,
        body: JSON.stringify({  })
      }

    } catch(error) {
        console.error('Error while changing password:', error);
    
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Changing password failed' }),
        };
    }
}