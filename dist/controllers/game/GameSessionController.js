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
exports.GameSessionController = void 0;
const GameSessionService_1 = require("../../services/game/GameSessionService");
const service = new GameSessionService_1.GameSessionService();
class GameSessionController {
    handleCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { childId, gameType, score, maxScore, timeSpent, completed, items } = req.body;
            if (!childId || !gameType) {
                return res.status(400).json({ error: 'childId and gameType are required' });
            }
            const session = yield service.create({
                childId,
                gameType,
                score: score !== null && score !== void 0 ? score : 0,
                maxScore: maxScore !== null && maxScore !== void 0 ? maxScore : 0,
                timeSpent: timeSpent !== null && timeSpent !== void 0 ? timeSpent : 0,
                completed: completed !== null && completed !== void 0 ? completed : false,
                items,
            });
            return res.status(201).json(session);
        });
    }
    handleListByChild(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { childId } = req.params;
            const sessions = yield service.listByChild(childId);
            return res.json(sessions);
        });
    }
    handleSummaryByChild(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { childId } = req.params;
            const summary = yield service.summaryByChild(childId);
            return res.json(summary);
        });
    }
}
exports.GameSessionController = GameSessionController;
