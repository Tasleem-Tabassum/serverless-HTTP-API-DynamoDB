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
exports.changePasswordController = void 0;
var bcrypt = require("bcryptjs");
var getUser_controller_1 = require("./getUser.controller");
var aws_1 = require("../config/aws");
var changePasswordController = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var decodedToken, reqData, userName, oldPassword, newPassword, mobile, oldPasswordMatch, passwordHash, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                decodedToken = event.decodedToken;
                if (!decodedToken || !event.body) {
                    return [2 /*return*/, {
                            statusCode: 401,
                            body: JSON.stringify({ message: 'Unauthorized' }),
                        }];
                }
                reqData = JSON.parse(event.body);
                userName = reqData.userName, oldPassword = reqData.oldPassword, newPassword = reqData.newPassword, mobile = reqData.mobile;
                return [4 /*yield*/, verifyPassword(userName, oldPassword, mobile)];
            case 1:
                oldPasswordMatch = _a.sent();
                if (!oldPasswordMatch) {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: JSON.stringify({ message: 'Old password is incorrect' }),
                        }];
                }
                return [4 /*yield*/, bcrypt.hash(newPassword, 8)];
            case 2:
                passwordHash = _a.sent();
                return [4 /*yield*/, updatePassword(userName, passwordHash)];
            case 3:
                _a.sent();
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify({ message: 'Password changed successfully' })
                    }];
            case 4:
                error_1 = _a.sent();
                console.error('Error while changing password:', error_1);
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ message: 'Changing password failed' }),
                    }];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.changePasswordController = changePasswordController;
var verifyPassword = function (userName, password, mobile) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, getUser_controller_1.getUserFromDb)(userName, mobile)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, bcrypt.compare(password, user.password)];
        }
    });
}); };
var updatePassword = function (userName, password) { return __awaiter(void 0, void 0, void 0, function () {
    var params, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                params = {
                    TableName: process.env.USERS_TABLE || '',
                    Key: {
                        'UserName': userName
                    },
                    UpdateExpression: 'SET Password = :password',
                    ExpressionAttributeValues: {
                        ':password': password
                    }
                };
                return [4 /*yield*/, aws_1.dynamodb.update(params).promise()];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error while updating password:', error_2);
                throw error_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
