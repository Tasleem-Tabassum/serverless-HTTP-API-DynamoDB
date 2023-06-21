import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS, { dynamodb } from '../config/aws';

export const loginController = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const body: string | null = event.body ?? null;

      if (!body) {
        return {
          statusCode: 400,
          body: 'Request body is missing',
        };
      }

      const reqData = JSON.parse(body)

      const { userName, password } = reqData

      const params = {
        TableName: process.env.USERS_TABLE || '',
        Key: {
          'UserName': {S: userName}
        },
        ProjectionExpression: 'UserName'
      }

      dynamodb.getItem(params, (error, data) => {
        if(error) {
          console.log('Error while checking credentials:', error)
        } else if(!data.Item) {
          console.log('UserName not found', error)
        } else {
          if(data.Item?.password === password) {
            
          }
        }
      })

      return {
        statusCode: 200,
        body: JSON.stringify({  })
      }

    } catch(error) {
        console.error('Error while login:', error);
    
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Login Failed!' }),
        };
    }
}
