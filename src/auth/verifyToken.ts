import * as jwt from 'jsonwebtoken';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export const verifyTokenHandler = async () => {
  // const token = event.authorizationToken.replace('Bearer ', '')
  // const methodArn = event.methodArn

  try {
    // if(!token || !methodArn) return callback(null, 'Unauthorized')
    

  } catch(error) {
      console.error('', error);
  }
}