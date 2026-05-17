"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const user_service_1 = require("../services/user.service");
async function getUsers(req, res, next) {
    try {
        const users = await (0, user_service_1.getAllUsersService)();
        res.json({ status: 'success', data: { users } });
    }
    catch (err) {
        next(err);
    }
}
async function createUser(req, res, next) {
    try {
        const user = await (0, user_service_1.createUserService)(req.body);
        res.status(201).json({ status: 'success', data: { user } });
    }
    catch (err) {
        next(err);
    }
}
async function updateUser(req, res, next) {
    try {
        const user = await (0, user_service_1.updateUserService)(req.params.id, req.body);
        res.json({ status: 'success', data: { user } });
    }
    catch (err) {
        next(err);
    }
}
async function deleteUser(req, res, next) {
    try {
        await (0, user_service_1.deleteUserService)(req.params.id);
        res.json({ status: 'success', message: 'User deleted successfully' });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=user.controller.js.map