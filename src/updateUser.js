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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const updateUser = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        console.error('Error while updating user profile:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to update user profile' }),
        };
    }
});
exports.updateUser = updateUser;
