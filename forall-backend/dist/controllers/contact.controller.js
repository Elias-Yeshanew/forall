"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitContact = submitContact;
exports.getContacts = getContacts;
exports.updateContact = updateContact;
exports.getContactStats = getContactStats;
const contact_service_1 = require("../services/contact.service");
async function submitContact(req, res, next) {
    try {
        const contact = await (0, contact_service_1.createContactService)(req.body);
        res.status(201).json({ status: 'success', data: { contact } });
    }
    catch (err) {
        next(err);
    }
}
async function getContacts(req, res, next) {
    try {
        const result = await (0, contact_service_1.getContactsService)({
            status: req.query.status,
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 20,
        });
        res.json({ status: 'success', ...result });
    }
    catch (err) {
        next(err);
    }
}
async function updateContact(req, res, next) {
    try {
        const contact = await (0, contact_service_1.updateContactService)(req.params.id, req.body);
        res.json({ status: 'success', data: { contact } });
    }
    catch (err) {
        next(err);
    }
}
async function getContactStats(req, res, next) {
    try {
        const stats = await (0, contact_service_1.getContactStatsService)();
        res.json({ status: 'success', data: { stats } });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=contact.controller.js.map