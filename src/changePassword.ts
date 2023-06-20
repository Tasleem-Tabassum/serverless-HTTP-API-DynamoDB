import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const changePassword = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

    } catch(error) {
        console.error('Error while changing password:', error);
    
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Changing password failed' }),
        };
    }
}