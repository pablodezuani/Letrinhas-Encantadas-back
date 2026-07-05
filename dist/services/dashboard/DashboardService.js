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
exports.DashboardService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DashboardService {
    getMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            const [totalChildren, totalParents, totalSessions, recentSessions] = yield Promise.all([
                prisma_1.default.child.count(),
                prisma_1.default.user.count({ where: { role: 'PARENT' } }),
                prisma_1.default.gameSession.count(),
                prisma_1.default.gameSession.findMany({
                    take: 20,
                    orderBy: { playedAt: 'desc' },
                    include: {
                        child: { select: { id: true, name: true } },
                    },
                }),
            ]);
            const sessionsByGame = yield prisma_1.default.gameSession.groupBy({
                by: ['gameType'],
                _count: { id: true },
                _avg: { score: true, timeSpent: true },
            });
            const last30Days = new Date();
            last30Days.setDate(last30Days.getDate() - 30);
            const sessionsLast30Days = yield prisma_1.default.gameSession.count({
                where: { playedAt: { gte: last30Days } },
            });
            return {
                totalChildren,
                totalParents,
                totalSessions,
                sessionsLast30Days,
                sessionsByGame,
                recentSessions,
            };
        });
    }
    getChildrenList(search) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.child.findMany({
                where: search
                    ? { name: { contains: search, mode: 'insensitive' } }
                    : undefined,
                include: {
                    parent: { select: { id: true, name: true, email: true } },
                    _count: { select: { gameSessions: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
        });
    }
    getParentsList(search) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.user.findMany({
                where: Object.assign({ role: 'PARENT' }, (search
                    ? {
                        OR: [
                            { name: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } },
                        ],
                    }
                    : {})),
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    created_at: true,
                    _count: { select: { children: true } },
                },
                orderBy: { created_at: 'desc' },
            });
        });
    }
    getParentDetail(parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield prisma_1.default.user.findFirst({
                where: { id: parentId, role: 'PARENT' },
                select: { id: true, name: true, email: true, role: true, created_at: true },
            });
            if (!parent)
                throw new Error('Parent not found');
            const children = yield prisma_1.default.child.findMany({
                where: { parentId },
                include: { _count: { select: { gameSessions: true } } },
                orderBy: { createdAt: 'desc' },
            });
            return { parent, children };
        });
    }
    getChildDetail(childId) {
        return __awaiter(this, void 0, void 0, function* () {
            const child = yield prisma_1.default.child.findUnique({
                where: { id: childId },
                include: {
                    parent: { select: { id: true, name: true, email: true } },
                },
            });
            if (!child)
                throw new Error('Child not found');
            const sessions = yield prisma_1.default.gameSession.findMany({
                where: { childId },
                include: { items: true },
                orderBy: { playedAt: 'desc' },
            });
            const byGame = {};
            for (const s of sessions) {
                if (!byGame[s.gameType])
                    byGame[s.gameType] = { sessions: 0, totalScore: 0, totalMax: 0 };
                byGame[s.gameType].sessions += 1;
                byGame[s.gameType].totalScore += s.score;
                byGame[s.gameType].totalMax += s.maxScore;
            }
            const gameStats = Object.entries(byGame).map(([gameType, data]) => ({
                gameType,
                sessions: data.sessions,
                avgScorePct: data.totalMax > 0 ? Math.round((data.totalScore / data.totalMax) * 100) : 0,
            }));
            return { child, sessions, gameStats };
        });
    }
}
exports.DashboardService = DashboardService;
