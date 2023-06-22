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
exports.loginController = void 0;
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var getUser_controller_1 = require("./getUser.controller");
var loginController = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var body, reqData, userName, mobile, password, user, itemRetrieved, isMatch, token, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                body = (_a = event.body) !== null && _a !== void 0 ? _a : null;
                if (!body) {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: 'Request body is missing',
                        }];
                }
                reqData = JSON.parse(body);
                userName = reqData.userName, mobile = reqData.mobile, password = reqData.password;
                return [4 /*yield*/, (0, getUser_controller_1.getUserFromDb)(userName, mobile)];
            case 1:
                user = _b.sent();
                console.log(user);
                itemRetrieved = user.Items;
                console.log("item retreived from db", itemRetrieved);
                if (!itemRetrieved) {
                    return [2 /*return*/, {
                            statusCode: 404,
                            body: "User not found"
                        }];
                }
                return [4 /*yield*/, bcrypt.compare(password, itemRetrieved.password)];
            case 2:
                isMatch = _b.sent();
                console.log("comparing passwords", isMatch);
                if (!isMatch) {
                    return [2 /*return*/, {
                            statusCode: 404,
                            body: "Unable to login!"
                        }];
                }
                else {
                    console.log("Before generating token");
                    token = jwt.sign({ UserName: userName }, process.env.JWT_SECRET || '', {
                        expiresIn: 3600
                    });
                    console.log("Before generating token");
                    return [2 /*return*/, {
                            statusCode: 200,
                            body: JSON.stringify({ message: 'Login successful', token: token })
                        }];
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error('Error while login:', error_1);
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ message: 'Login Failed!' }),
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.loginController = loginController;
