'use strict';

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

module.exports = function (req, res, next) {
    var authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }

    var token = authHeader.split(' ')[1]; //Authorization: Bearer hereisToken
    if (!token || token === '') {
        return next();
    }
    var decodedToken = void 0;
    try {
        decodedToken = _jsonwebtoken2.default.verify(token, "somesupersecretkey");
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
};
//# sourceMappingURL=is-auth.js.map
//# sourceMappingURL=is-auth.js.map