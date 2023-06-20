import { loginController } from './controllers/loginController';
import { getUserController } from './controllers/getUserController';
import { signUpController } from './controllers/signUpController';
import { updateUserController } from './controllers/updateUserController';
import { changePasswordController } from './controllers/changePasswordController';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const login = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => loginController(event)

export const signUp = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => signUpController(event)

export const getUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => getUserController(event)

export const changePassword = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => changePasswordController(event)

export const updateUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => updateUserController(event)
