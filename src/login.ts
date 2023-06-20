import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const login = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

    } catch(error) {
        console.error('Error while login:', error);
    
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Login Failed!' }),
        };
    }
}
