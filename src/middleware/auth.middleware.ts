import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { APIGatewayAuthorizerResult, CustomAuthorizerEvent } from 'aws-lambda';
dotenv.config();

// interface CustomAPIGatewayProxyEvent extends APIGatewayProxyEvent {
//   decodedToken?: any;
// }

export const authenticateMiddleware = async (
  event: any
  ): Promise<APIGatewayAuthorizerResult> => {
  try {

    console.log(event)

    const authToken = event.headers?.authorization || '';

    console.log(authToken)

    const token = authToken.split(' ')[1];
    console.log('without bearer', token)

    if(token.length === 0) {
      return generatePolicy('undefined', 'Deny', event.routeArn)
    }

    console.log("jwt secret",process.env.JWT_SECRET)
    const secretKey = process.env.JWT_SECRET || ''

    const decodedToken: any = jwt.verify(token, secretKey);

    console.log("decodedtoken",decodedToken)

    if(typeof decodedToken.UserName !== 'undefined' && decodedToken.UserName.length > 0) {
      return generatePolicy(decodedToken.UserName, 'Allow', event.routeArn)
      
    }

    return generatePolicy('undefined', 'Deny', event.routeArn)
    
  } catch(error) {
    console.error("Authentication error:", error);
    return generatePolicy('undefined', 'Deny', event.routeArn)
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