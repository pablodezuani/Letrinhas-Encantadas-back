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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSessionService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class GameSessionService {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { items } = data, sessionData = __rest(data, ["items"]);
            const child = yield prisma_1.default.child.findUnique({ where: { id: data.childId } });
            if (!child)
                throw new Error('Child not found');
            return prisma_1.default.gameSession.create({
                data: Object.assign(Object.assign({}, sessionData), { items: (items === null || items === void 0 ? void 0 : items.length)
                        ? { create: items }
                        : undefined }),
                include: { items: true },
            });
        });
    }
    listByChild(childId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.gameSession.findMany({
                where: { childId },
                include: { items: true },
                orderBy: { playedAt: 'desc' },
            });
        });
    }
    summaryByChild(childId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessions = yield prisma_1.default.gameSession.findMany({
                where: { childId },
                include: { items: true },
                orderBy: { playedAt: 'desc' },
            });
            const byGame = {};
            for (const session of sessions) {
                if (!byGame[session.gameType]) {
                    byGame[session.gameType] = { sessions: 0, avgScore: 0, lastPlayed: session.playedAt };
                }
                const g = byGame[session.gameType];
                const pct = session.maxScore > 0 ? (session.score / session.maxScore) * 100 : 0;
                g.avgScore = (g.avgScore * g.sessions + pct) / (g.sessions + 1);
                g.sessions += 1;
                if (session.playedAt > g.lastPlayed)
                    g.lastPlayed = session.playedAt;
            }
            return {
                totalSessions: sessions.length,
                byGame,
                recentSessions: sessions.slice(0, 10),
            };
        });
    }
}
exports.GameSessionService = GameSessionService;
