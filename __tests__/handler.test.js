const handler = require('../dist/src/handler');
const indexHandler = require('../dist/index');
const { test } = require('node:test');

test("Home page", async () => {
    it("should return a welcome message", async () => {
        const res = await indexHandler.handler();
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Welcome to User Portal!");
    });
});

test('user signup', async () => { 
    it("should return user signup success", async () => {
        const res = await handler.signUp();
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("signup successful");
    });
})

describe('user login', () => { 
    it("should return user login success", async () => {
        const res = await handler.login();
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Login successful");
    });
})

describe('get user', () => { 
    it("should return user details", async () => {
        expect(handler.getUser).toBe(200);
        // expect(handler.getUser).toBe("signup successful")
    });
})

// describe('user signup', () => { 
//     it("should return user signup success", async () => {
//         expect(handler.signUp).toBe(201);
//         expect(handler.signUp).toBe("signup successful")
//     });
// })

// describe('user signup', () => { 
//     it("should return user signup success", async () => {
//         expect(handler.signUp).toBe(201);
//         expect(handler.signUp).toBe("signup successful")
//     });
// })

