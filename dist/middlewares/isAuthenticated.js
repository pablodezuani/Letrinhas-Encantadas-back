"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
function isAuthenticated(req, res, next) {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: 'Token not provided' });
    }
    const [, token] = authToken.split(' ');
    try {
        const { sub, role } = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        req.user_id = sub;
        req.user_role = role;
        return next();
    }
    catch (_a) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
exports.isAuthenticated = isAuthenticated;
