"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema, target = 'body') {
    return (req, _res, next) => {
        const result = schema.safeParse(req[target]);
        if (!result.success) {
            return next(result.error);
        }
        req[target] = result.data;
        next();
    };
}
//# sourceMappingURL=validate.js.map