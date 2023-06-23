import { loginController } from './controllers/login.controller';
import { getUserController } from './controllers/getUser.controller';
import { signUpController } from './controllers/signUp.controller';
import { updateUserController } from './controllers/updateUser.controller';
import { changePasswordController } from './controllers/changePassword.controller';
import { APIGatewayAuthorizerEvent, APIGatewayAuthorizerResult, APIGatewayProxyEvent, APIGatewayProxyResult, CustomAuthorizerEvent } from 'aws-lambda';
import { authenticateMiddleware} from './middleware/auth.middleware';

export const login = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => loginController(event)

export const signUp = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => signUpController(event)

export const getUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => getUserController(event)

export const changePassword = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => changePasswordController(event)

export const updateUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => updateUserController(event)

export const authUser = async (event: CustomAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => authenticateMiddleware(event)
