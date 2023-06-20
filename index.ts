import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Welcome to User Portal!"
            })
        }
    } catch(error) {
        console.error('Error loading home page:', error);
    
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Failed to load home page' }),
        };
    }
}
