"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasRole = void 0;
function hasRole(...roles) {
    return (req, res, next) => {
        if (!req.user_role || !roles.includes(req.user_role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        return next();
    };
}
exports.hasRole = hasRole;
