"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpController = void 0;
var aws_1 = require("../config/aws");
var bcrypt = require("bcryptjs");
var uuid_1 = require("uuid");
var getUser_controller_1 = require("./getUser.controller");
var signUpController = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var body, _a, userName, password, name_1, mobile, role, user, passwordHash, params, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                body = (_b = event.body) !== null && _b !== void 0 ? _b : null;
                if (!body) {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: 'Request body is missing',
                        }];
                }
                _a = JSON.parse(body), userName = _a.userName, password = _a.password, name_1 = _a.name, mobile = _a.mobile, role = _a.role;
                if (!userName || !password || !name_1 || !mobile || !role) {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: "All the fields are mandatory"
                        }];
                }
                if (typeof userName !== 'string') {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: "UserName must be a string"
                        }];
                }
                if (typeof password !== 'string') {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: "Password must be a string"
                        }];
                }
                if (typeof name_1 !== 'string') {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: "Name must be a string"
                        }];
                }
                if (typeof mobile !== 'number') {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: "Mobile Number must be a number"
                        }];
                }
                return [4 /*yield*/, (0, getUser_controller_1.getUserFromDb)(userName, mobile)];
            case 1:
                user = _c.sent();
                if (user) {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: JSON.stringify({
                                message: "UserName already exists!"
                            })
                        }];
                }
                return [4 /*yield*/, bcrypt.hash(password, 8)];
            case 2:
                passwordHash = _c.sent();
                params = {
                    TableName: process.env.USERS_TABLE || '',
                    Item: {
                        id: (0, uuid_1.v4)(),
                        UserName: userName,
                        Password: passwordHash,
                        Name: name_1,
                        Role: role,
                        MobileNumber: mobile,
                        createdAt: new Date().toISOString()
                    }
                };
                return [4 /*yield*/, aws_1.dynamodb.put(params).promise()];
            case 3:
                _c.sent();
                return [2 /*return*/, {
                        statusCode: 201,
                        body: JSON.stringify({
                            message: "signup successful"
                        })
                    }];
            case 4:
                error_1 = _c.sent();
                console.error('Error while signup:', error_1);
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ message: 'Signup Failed' }),
                    }];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.signUpController = signUpController;
