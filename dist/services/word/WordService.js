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
exports.WordService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class WordService {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.word.create({ data });
        });
    }
    list() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            const { gameType, category, difficulty, active, search } = filter;
            return prisma_1.default.word.findMany({
                where: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (active !== undefined && { active })), (category && { category })), (difficulty && { difficulty })), (gameType && { gameTypes: { has: gameType } })), (search && { text: { contains: search, mode: 'insensitive' } })),
                orderBy: { createdAt: 'desc' },
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const word = yield prisma_1.default.word.findUnique({ where: { id } });
            if (!word)
                throw new Error('Word not found');
            return word;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.findById(id);
            return prisma_1.default.word.update({ where: { id }, data });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.findById(id);
            yield prisma_1.default.word.delete({ where: { id } });
            return { message: 'Word deleted successfully' };
        });
    }
}
exports.WordService = WordService;
