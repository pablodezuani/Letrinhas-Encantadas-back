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
exports.WordController = void 0;
const WordService_1 = require("../../services/word/WordService");
const service = new WordService_1.WordService();
class WordController {
    handleCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { text, category, difficulty, emoji, sound, data, imageUrl, audioUrl, gameTypes } = req.body;
            if (!text || !category) {
                return res.status(400).json({ error: 'Text and category are required' });
            }
            const word = yield service.create({ text, category, difficulty, emoji, sound, data, imageUrl, audioUrl, gameTypes });
            return res.status(201).json(word);
        });
    }
    handleList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { gameType, category, difficulty, active, search } = req.query;
            const words = yield service.list({
                gameType: gameType,
                category: category,
                difficulty: difficulty,
                active: active !== undefined ? active === 'true' : undefined,
                search: search,
            });
            return res.json(words);
        });
    }
    handleUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const word = yield service.update(id, req.body);
            return res.json(word);
        });
    }
    handleDelete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield service.delete(id);
            return res.json(result);
        });
    }
}
exports.WordController = WordController;
