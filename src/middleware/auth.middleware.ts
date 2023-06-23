import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { APIGatewayAuthorizerResult, CustomAuthorizerEvent } from 'aws-lambda';
dotenv.config();

// interface CustomAPIGatewayProxyEvent extends APIGatewayProxyEvent {
//   decodedToken?: any;
// }

export const authenticateMiddleware = async (
  event: CustomAuthorizerEvent
  ): Promise<APIGatewayAuthorizerResult> => {
  try {

    const authToken = event.authorizationToken || '';

    console.log('authtoken',authToken)

    const token = authToken.replace('Bearer ', '')
    console.log('authToken token', token)

    if(token.length === 0) {
      return generatePolicy('undefined', 'Deny', event.methodArn)
    }

    const decodedToken: jwt.JwtPayload = jwt.verify(token, process.env.JWT_SECRET || '') as jwt.JwtPayload;

    if(typeof decodedToken.UserName !== 'undefined' && decodedToken.UserName.length > 0) {
      return generatePolicy(decodedToken.UserName, 'Allow', event.methodArn)
      
    }

    return generatePolicy('undefined', 'Deny', event.methodArn)
    
  } catch(error) {
    console.error("Authentication error:", error);
    return generatePolicy('undefined', 'Deny', event.methodArn)
    // return {
    //   statusCode: 401,
    //   body: JSON.stringify({ message: "Unauthorized"})
    // };
  }
};

const generatePolicy = (principalId: string | undefined, effect: string, resource: any) => {
  let authResponse: APIGatewayAuthorizerResult = {
    principalId: principalId || '',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  }

  console.log('authResponse',authResponse)
  return authResponse
}