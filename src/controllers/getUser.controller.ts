import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS, { dynamodb } from '../config/aws';

// interface CustomAPIGatewayProxyEvent extends APIGatewayProxyEvent {
//     decodedToken?: {
//       UserName: string;
//     };
//   }

export const getUserController = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    try {
        const decodedToken = (event as any).decodedToken;

        if(!decodedToken || !(event as any).body.UserName) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Unauthorized' }),
            };
        }

        const userName = (event as any).body.UserName;

        const user = await getUserFromDb(userName)

        if(!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "User not found" })
            }
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({ user })
        }
    } catch(error) {
        console.error('Error while fetching table items:', error);
    
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Failed fetching table items' }),
        };
    }
}

export const getUserFromDb = async (userName: string): Promise<any> => {

    await dynamodb.get({ 
        TableName: process.env.USERS_TABLE || '',
        Key: {
            'UserName': userName
        },
    }, 
    (error: AWS.AWSError, data: AWS.DynamoDB.ScanOutput) => {
        if(error) {
            console.log('Error occured while scanning data from DynamoDB', error)
            return null
        } else {
            return data.Items
        }
    })
}