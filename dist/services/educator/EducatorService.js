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
exports.EducatorService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
class EducatorService {
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email, password }) {
            const exists = yield prisma_1.default.user.findFirst({ where: { email } });
            if (exists)
                throw new Error('Email already in use');
            const passwordHash = yield (0, bcryptjs_1.hash)(password, 8);
            return prisma_1.default.user.create({
                data: { name, email, Password: passwordHash, role: 'EDUCATOR' },
                select: { id: true, name: true, email: true, role: true, created_at: true },
            });
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.user.findMany({
                where: { role: 'EDUCATOR' },
                select: { id: true, name: true, email: true, role: true, created_at: true },
                orderBy: { created_at: 'desc' },
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const educator = yield prisma_1.default.user.findFirst({
                where: { id, role: 'EDUCATOR' },
            });
            if (!educator)
                throw new Error('Educator not found');
            yield prisma_1.default.user.delete({ where: { id } });
            return { message: 'Educator deleted successfully' };
        });
    }
}
exports.EducatorService = EducatorService;
