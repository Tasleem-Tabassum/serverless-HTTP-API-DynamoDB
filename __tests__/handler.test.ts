import { dynamodb } from '../src/config/aws';
import { loginController } from '../src/controllers/login.controller';
import { getUserFromDb } from '../src/controllers/getUser.controller';
import { signUpController } from '../src/controllers/signUp.controller';
import * as getUserController from '../src/controllers/getUser.controller';
import { changePasswordController } from '../src/controllers/changePassword.controller';
import * as bcrypt from "bcryptjs";
import * as jwt from 'jsonwebtoken';


describe('signUpController', () => {
  let mockEvent: any;

  beforeEach(() => {
    mockEvent = {
      body: JSON.stringify({
        userName: 'john_doe',
        password: 'password123',
        name: 'John Doe',
        mobile: 1234567890,
        role: 'user',
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if request body is missing', async () => {
    mockEvent.body = null;

    const result = await signUpController(mockEvent);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe('Request body is missing');
  });

  it('should return 400 if any field is missing in the request body', async () => {
    mockEvent.body = JSON.stringify({
      userName: 'john_doe',
      password: 'password123',
      name: 'John Doe',
    });

    const result = await signUpController(mockEvent);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe('All the fields are mandatory');
  });

  it('should return 400 if userName is not a string', async () => {
    mockEvent.body = JSON.stringify({
      userName: 123, 
      password: 'password123',
      name: 'John Doe',
      mobile: 1234567890,
      role: 'user',
    });

    const result = await signUpController(mockEvent);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe('UserName must be a string');
  });

  it('should return 400 if password is not a string', async () => {
    mockEvent.body = JSON.stringify({
      userName: 'john_doe',
      password: 123,  
      name: 'John Doe',
      mobile: 1234567890,
      role: 'user',
    });

    const result = await signUpController(mockEvent);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe('Password must be a string');
  });

  it('should return 400 if name is not a string', async () => {
    mockEvent.body = JSON.stringify({
      userName: 'john_doe',
      password: 'password123',
      name: 123,  
      mobile: 1234567890,
      role: 'user',
    });

    const result = await signUpController(mockEvent);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe('Name must be a string');
  });

  it('should return 400 if mobile is not a number', async () => {
    mockEvent.body = JSON.stringify({
      userName: 'john_doe',
      password: 'password123',
      name: 'John Doe',
      mobile: '1234567890', 
      role: 'user',
    });

    const result = await signUpController(mockEvent);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe('Mobile Number must be a number');
  });

  it('should return 400 if userName already exists', async () => {
    const mockDynamoDBGet = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Item: {
          UserName: 'john_doe',
        },
      }),
    });
    
    jest.spyOn(dynamodb, 'get').mockImplementation(mockDynamoDBGet);

    const result = await signUpController(mockEvent);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe(JSON.stringify({ message: 'UserName already exists!' }));
    expect(mockDynamoDBGet).toHaveBeenCalledWith({
      TableName: 'user-auth-user-table-dev',
      Key: {
        UserName: 'john_doe',
        MobileNumber: 1234567890,
      },
    });
  });

//   it('should return 201 if signup is successful', async () => {
//     const event: any = {
//         body: JSON.stringify({
//             userName: 'john_doe',
//             password: 'password123',
//             name: 'John Doe',
//             mobile: 1234567890,
//             role: 'user',
//         }),
//     };

//     const mockDynamoDBGet = jest.fn().mockReturnValue({
//         promise: jest.fn().mockResolvedValue({}),
//     });
//     const mockDynamoDBPut = jest.fn().mockReturnValue({
//     promise: jest.fn().mockResolvedValue({}),
//     });
//     // Mocking AWS SDK DynamoDB DocumentClient
//     jest.spyOn(dynamodb, 'get').mockImplementation(mockDynamoDBGet);
//     jest.spyOn(dynamodb, 'put').mockImplementation(mockDynamoDBPut);

//     const result = await signUpController(event);

//     expect(result.statusCode).toBe(201);
//     expect(result.body).toBe(JSON.stringify({ message: 'signup successful' }));
//     expect(mockDynamoDBGet).toHaveBeenCalledWith({
//     TableName: 'user-auth-user-table-dev',
//     Key: {
//         UserName: 'john_doe',
//         MobileNumber: 1234567890,
//     },
//     });
//     expect(mockDynamoDBPut).toHaveBeenCalledWith({
//     TableName: '',
//     Item: {
//         id: expect.any(String),
//         UserName: 'john_doe',
//         Password: expect.any(String),
//         Name: 'John Doe',
//         Role: 'user',
//         MobileNumber: 1234567890,
//         createdAt: expect.any(String),
//     },
//     });
//   });

  it('should return 500 if an error occurs during signup', async () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    const mockDynamoDBGet = jest.fn().mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error('DynamoDB error')),
    });
    
    jest.spyOn(dynamodb, 'get').mockImplementation(mockDynamoDBGet);

    const result = await signUpController(mockEvent);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(JSON.stringify({ message: 'Signup Failed' }));
    expect(mockConsoleError).toHaveBeenCalledWith('Error while signup:', expect.any(Error));
    expect(mockDynamoDBGet).toHaveBeenCalledWith({
      TableName: 'user-auth-user-table-dev',
      Key: {
        UserName: 'john_doe',
        MobileNumber: 1234567890,
      },
    });
  });
});

jest.mock('../src/controllers/getUser.controller', () => ({
    getUserFromDb: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
}));
  
describe('loginController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if request body is missing', async () => {
        const event: any = {
        body: null,
        };

        const result = await loginController(event);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe('Request body is missing');
    });

    it('should return 500 if user password is missing', async () => {
        const event: any = {
        body: JSON.stringify({
            userName: 'testuser',
            mobile: '1234567890',
            password: null,
        }),
        };

        const result = await loginController(event);

        expect(result.statusCode).toBe(500);
        expect(result.body).toBe('User password is missing');
    });

    it('should return 404 if user is not found', async () => {
        const event: any = {
        body: JSON.stringify({
            userName: 'testuser',
            mobile: '1234567890',
            password: 'password123',
        }),
        };

        (getUserFromDb as jest.Mock).mockResolvedValue([]);

        const result = await loginController(event);

        expect(result.statusCode).toBe(404);
        expect(result.body).toBe('User not found');
    });

    it('should return 401 if password is invalid', async () => {
        const event: any = {
        body: JSON.stringify({
            userName: 'testuser',
            mobile: '1234567890',
            password: 'invalidpassword',
        }),
        };

        (getUserFromDb as jest.Mock).mockResolvedValue([
            {
              Password: 'hashedpassword',
            },
        ]);

        const result = await loginController(event);

        expect(result.statusCode).toBe(401);
        expect(result.body).toBe('Invalid password');
    });

    it('should return 200 with token for valid login', async () => {
        const event: any = {
        body: JSON.stringify({
            userName: 'testuser',
            mobile: '1234567890',
            password: 'validpassword',
        }),
        };

        (getUserFromDb as jest.Mock).mockResolvedValue([
            {
              Password: 'hashedpassword',
            },
        ]);

        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        jest.mock('jsonwebtoken', () => ({
            sign: jest.fn(() => 'mockedtoken'),
        }));

        const result = await loginController(event);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body).message).toBe('Login successful');
    });

    it('should return 500 if an error occurs', async () => {
        const event: any = {
        body: JSON.stringify({
            userName: 'testuser',
            mobile: '1234567890',
            password: 'validpassword',
        }),
        };

        (getUserFromDb as jest.Mock).mockRejectedValue(new Error('Database error'));

        const result = await loginController(event);

        expect(result.statusCode).toBe(500);
        expect(result.body).toBe(JSON.stringify({ message: 'Login Failed!' }));
    });
});

// jest.mock('jsonwebtoken', () => ({
//     verify: jest.fn(),
//   }));

// jest.mock('../src/config/aws', () => ({
//     dynamodb: {
//       query: jest.fn().mockReturnValue({
//         promise: jest.fn().mockResolvedValue({ Items: [{ name: 'John Doe' }] }),
//       }),
//     },
//   }));

jest.mock('../src/controllers/getUser.controller');

describe('getUserController', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 401 if token is missing or invalid', async () => {
      const event: any = {
        headers: {
          authorization: '',
        },
      };

      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });
  
      const result = await getUserController.getUserController(event);
  
      expect(result.statusCode).toBe(401);
      expect(result.body).toBe(JSON.stringify({ message: 'Unauthorized' }));
    });
  
    it('should return 404 if user is not found', async () => {
        jest.spyOn(jwt, 'verify').mockImplementation(() => ({ UserName: 'testuser' }));
        (getUserFromDb as jest.Mock).mockResolvedValue(null);
    
        const event: any = {
          headers: {
            authorization: 'Bearer validtoken',
          },
        };
    
        const result = await getUserController.getUserController(event);
    
        expect(result.statusCode).toBe(404);
        expect(result.body).toBe(JSON.stringify({ message: 'User not found' }));
    });
  
    it('should return 200 with user data for a valid request', async () => {
        jest.spyOn(jwt, 'verify').mockImplementation(() => ({ UserName: 'testuser' }));
        (getUserFromDb as jest.Mock).mockResolvedValue([{ name: 'John Doe' }]);
    
        const event: any = {
          headers: {
            authorization: 'Bearer validtoken',
          },
        };
    
        const result = await getUserController.getUserController(event);
    
        expect(result.statusCode).toBe(200);
        expect(result.body).toContain('user');
    });
  
    it('should return 500 if an error occurs', async () => {
        jest.spyOn(jwt, 'verify').mockImplementation(() => ({ UserName: 'testuser' }));
        (getUserFromDb as jest.Mock).mockRejectedValue(new Error('Database error'));
    
        const event: any = {
          headers: {
            authorization: 'Bearer validtoken',
          },
        };
    
        const result = await getUserController.getUserController(event);
    
        expect(result.statusCode).toBe(500);
        expect(result.body).toBe(JSON.stringify({ message: 'Failed fetching table items' }));
    });
  });

describe('changePasswordController', async () => {
    let event: any;

    beforeEach(() => {
        // Initialize the event object with necessary properties for each test case
        event = {
        headers: {
            authorization: 'Bearer token',
        },
        body: JSON.stringify({
            userName: 'testUser',
            oldPassword: 'oldPassword',
            newPassword: 'newPassword',
            mobile: 1234567890,
        }),
        };
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return an unauthorized response when token is invalid', async () => {
        jest.spyOn(global.console, 'error').mockImplementation(() => {}); // Mock console.error to suppress error logs

        event.headers.authorization = 'Bearer invalidToken';

        const result = await changePasswordController(event);

        expect(result.statusCode).toBe(401);
        expect(result.body).toBe(JSON.stringify({ message: 'Unauthorized' }));
    });

    it('should return a bad request response when request body is missing', async () => {
        event.body = null;

        const result = await changePasswordController(event);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe('Request body is missing');
    });

    it('should return a bad request response when old password is incorrect', async () => {
        const mockGetUserFromDb = getUserFromDb as jest.MockedFunction<typeof getUserFromDb>;
        mockGetUserFromDb.mockResolvedValueOnce([{ Password: 'correctPassword' }]);

        const result = await changePasswordController(event);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe(JSON.stringify({ message: 'Old password is incorrect' }));
    });

    it('should return an error response when password update fails', async () => {
        const mockGetUserFromDb = getUserFromDb as jest.MockedFunction<typeof getUserFromDb>;
        mockGetUserFromDb.mockResolvedValueOnce([{ Password: 'oldPassword' }]);

        const mockDynamoDBUpdate = jest.spyOn(dynamodb, 'update').mockRejectedValueOnce(new Error('Update failed') as never);

        const result = await changePasswordController(event);

        expect(result.statusCode).toBe(500);
        expect(result.body).toBe(JSON.stringify({ message: 'Changing password failed' }));
        //expect(mockDynamoDBUpdate).toHaveBeenCalled();
    });

    it('should return a success response when password is changed successfully', async () => {
        const mockGetUserFromDb = getUserFromDb as jest.MockedFunction<typeof getUserFromDb>;
        mockGetUserFromDb.mockResolvedValueOnce([{ Password: 'oldPassword' }]);

        const mockDynamoDBUpdate = jest.spyOn(dynamodb, 'update').mockResolvedValueOnce({} as never)
        

        const result = await changePasswordController(event);

        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(JSON.stringify({ message: 'Password changed successfully', updatedUser: {} }));
    //   expect(mockDynamoDBUpdate).toHaveBeenCalled();
    });
});