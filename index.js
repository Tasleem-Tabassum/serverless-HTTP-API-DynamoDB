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
exports.handler = void 0;
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Welcome to User Portal!"
            })
        };
    }
    catch (error) {
        console.error('Error loading home page:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to load home page' }),
        };
    }
});
exports.handler = handler;
