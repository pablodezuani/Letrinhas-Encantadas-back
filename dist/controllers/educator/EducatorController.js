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
exports.EducatorController = void 0;
const EducatorService_1 = require("../../services/educator/EducatorService");
const service = new EducatorService_1.EducatorService();
class EducatorController {
    handleCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Name, email and password are required' });
            }
            const educator = yield service.create({ name, email, password });
            return res.status(201).json(educator);
        });
    }
    handleList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const educators = yield service.list();
            return res.json(educators);
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
exports.EducatorController = EducatorController;
