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
exports.DashboardController = void 0;
const DashboardService_1 = require("../../services/dashboard/DashboardService");
const service = new DashboardService_1.DashboardService();
class DashboardController {
    handleMetrics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const metrics = yield service.getMetrics();
            return res.json(metrics);
        });
    }
    handleChildrenList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search } = req.query;
            const children = yield service.getChildrenList(search);
            return res.json(children);
        });
    }
    handleParentsList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search } = req.query;
            const parents = yield service.getParentsList(search);
            return res.json(parents);
        });
    }
    handleParentDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { parentId } = req.params;
                const detail = yield service.getParentDetail(parentId);
                return res.json(detail);
            }
            catch (error) {
                const status = error.message.includes('not found') ? 404 : 500;
                return res.status(status).json({ error: error.message || 'Unexpected error' });
            }
        });
    }
    handleChildDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { childId } = req.params;
            const detail = yield service.getChildDetail(childId);
            return res.json(detail);
        });
    }
}
exports.DashboardController = DashboardController;
