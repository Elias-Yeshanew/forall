"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
exports.getMe = getMe;
const auth_service_1 = require("../services/auth.service");
async function register(req, res, next) {
    try {
        const { name, email, password, phone } = req.body;
        const { user, tokens } = await (0, auth_service_1.registerService)(name, email, password, phone);
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true, secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({ status: 'success', data: { user, token: tokens.accessToken } });
    }
    catch (err) {
        next(err);
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const { user, tokens } = await (0, auth_service_1.loginService)(email, password);
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true, secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.json({ status: 'success', data: { user, token: tokens.accessToken } });
    }
    catch (err) {
        next(err);
    }
}
async function refresh(req, res, next) {
    try {
        const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
        if (!refreshToken)
            return res.status(401).json({ status: 'error', message: 'Refresh token required' });
        const { user, tokens } = await (0, auth_service_1.refreshTokenService)(refreshToken);
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true, secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.json({ status: 'success', data: { user, token: tokens.accessToken } });
    }
    catch (err) {
        next(err);
    }
}
async function logout(req, res, next) {
    try {
        res.clearCookie('refreshToken');
        res.json({ status: 'success', message: 'Logged out successfully' });
    }
    catch (err) {
        next(err);
    }
}
async function getMe(req, res, next) {
    try {
        const user = await (0, auth_service_1.getMeService)(req.user.id);
        res.json({ status: 'success', data: { user } });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=auth.controller.js.map