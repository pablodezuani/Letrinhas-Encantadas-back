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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
const crypto_1 = require("crypto");
class PasswordResetService {
    requestReset(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.user.findFirst({ where: { email } });
            // Retorna sucesso mesmo se email não existir (evita enumeração)
            if (!user)
                return { message: 'If the email exists, a reset link was sent.' };
            // Invalida tokens anteriores
            yield prisma_1.default.passwordResetToken.updateMany({
                where: { userId: user.id, used: false },
                data: { used: true },
            });
            const token = (0, crypto_1.randomBytes)(32).toString('hex');
            const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora
            yield prisma_1.default.passwordResetToken.create({
                data: { userId: user.id, token, expiresAt },
            });
            // TODO: enviar email com o token
            // await emailService.send({ to: email, token })
            console.log(`[PASSWORD RESET] Token para ${email}: ${token}`);
            return { message: 'If the email exists, a reset link was sent.' };
        });
    }
    confirmReset(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const resetToken = yield prisma_1.default.passwordResetToken.findUnique({
                where: { token },
            });
            if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
                throw new Error('Token invalid or expired');
            }
            const passwordHash = yield (0, bcryptjs_1.hash)(newPassword, 8);
            yield prisma_1.default.user.update({
                where: { id: resetToken.userId },
                data: { Password: passwordHash },
            });
            yield prisma_1.default.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { used: true },
            });
            return { message: 'Password updated successfully' };
        });
    }
}
exports.PasswordResetService = PasswordResetService;
