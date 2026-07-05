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
exports.ChildService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ChildService {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const child = yield prisma_1.default.child.create({ data });
            return child;
        });
    }
    update(id, parentId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const child = yield prisma_1.default.child.findFirst({ where: { id, parentId } });
            if (!child)
                throw new Error('Child not found or access denied');
            return prisma_1.default.child.update({ where: { id }, data });
        });
    }
    delete(id, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const child = yield prisma_1.default.child.findFirst({ where: { id, parentId } });
            if (!child)
                throw new Error('Child not found or access denied');
            yield prisma_1.default.child.delete({ where: { id } });
            return { message: 'Child deleted' };
        });
    }
    findAllWithParent() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.child.findMany({
                include: {
                    parent: { select: { id: true, name: true, email: true } },
                },
            });
        });
    }
    findByParent(parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.child.findMany({
                where: { parentId },
                include: {
                    parent: { select: { id: true, name: true, email: true } },
                    gameSessions: {
                        orderBy: { playedAt: 'desc' },
                        take: 5,
                    },
                },
                orderBy: { createdAt: 'asc' },
            });
        });
    }
}
exports.ChildService = ChildService;
