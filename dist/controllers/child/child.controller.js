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
exports.ChildController = void 0;
const child_service_1 = require("../../services/child/child.service");
const childService = new child_service_1.ChildService();
class ChildController {
    handleCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parentId = req.user_id;
                const data = req.body;
                if (!data.name)
                    return res.status(400).json({ error: 'Name is required' });
                const child = yield childService.create(Object.assign(Object.assign({}, data), { parentId }));
                return res.status(201).json(child);
            }
            catch (error) {
                return res.status(500).json({ error: error.message || 'Unexpected error' });
            }
        });
    }
    handleUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parentId = req.user_id;
                const { id } = req.params;
                const data = req.body;
                const child = yield childService.update(id, parentId, data);
                return res.status(200).json(child);
            }
            catch (error) {
                const status = error.message.includes('not found') ? 404 : 500;
                return res.status(status).json({ error: error.message || 'Unexpected error' });
            }
        });
    }
    handleDelete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parentId = req.user_id;
                const { id } = req.params;
                const result = yield childService.delete(id, parentId);
                return res.status(200).json(result);
            }
            catch (error) {
                const status = error.message.includes('not found') ? 404 : 500;
                return res.status(status).json({ error: error.message || 'Unexpected error' });
            }
        });
    }
    handleListAllWithParent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const children = yield childService.findAllWithParent();
                return res.status(200).json(children);
            }
            catch (error) {
                return res.status(500).json({ error: error.message || 'Unexpected error' });
            }
        });
    }
    handleListByParent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parentId = req.user_id;
                if (!parentId)
                    return res.status(401).json({ error: 'Unauthorized' });
                const children = yield childService.findByParent(parentId);
                return res.status(200).json(children);
            }
            catch (error) {
                return res.status(500).json({ error: error.message || 'Unexpected error' });
            }
        });
    }
}
exports.ChildController = ChildController;
