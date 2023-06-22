import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { JwtPayload } from 'jsonwebtoken';

export interface CustomAPIGatewayProxyEvent extends APIGatewayProxyEvent {
  decodedToken?: string | JwtPayload; // Replace string with the actual type of decodedToken
}