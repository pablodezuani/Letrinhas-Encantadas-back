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
exports.PasswordResetController = void 0;
const PasswordResetService_1 = require("../../services/auth/PasswordResetService");
const service = new PasswordResetService_1.PasswordResetService();
class PasswordResetController {
    handleRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }
            const result = yield service.requestReset(email);
            return res.json(result);
        });
    }
    handleConfirm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, password } = req.body;
            if (!token || !password) {
                return res.status(400).json({ error: 'Token and password are required' });
            }
            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters' });
            }
            const result = yield service.confirmReset(token, password);
            return res.json(result);
        });
    }
}
exports.PasswordResetController = PasswordResetController;
