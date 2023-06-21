import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CustomAPIGatewayProxyEvent } from '../interfaces/CustomEvent';
import * as jwt from 'jsonwebtoken';

// interface CustomAPIGatewayProxyEvent extends APIGatewayProxyEvent {
//   decodedToken?: any;
// }

export const authenticateMiddleware = async (
  event: CustomAPIGatewayProxyEvent,
  _context: any,
  next: () => Promise<APIGatewayProxyEvent>
  ): Promise<APIGatewayProxyResult> => {
  try {
    const token = event.headers.Authorization || event.queryStringParameters?.token || '';

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || '');

    event.decodedToken = decodedToken;

    return next().then((updatedEvent) => ({
      statusCode: 200,
      body: JSON.stringify({
        event: updatedEvent,
        decodedToken: decodedToken
      })
    }));
    
  } catch(error) {
    console.error("Authentication error:", error);
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized"})
    };
  }
};