import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const updateUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

    } catch(error) {
        console.error('Error while updating user profile:', error);
    
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Failed to update user profile' }),
        };
    }
}