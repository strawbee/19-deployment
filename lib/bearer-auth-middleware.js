'use strict';

const jwt = require('jsonwebtoken');
const errorHandler = require('./error-handler');
const Auth = require('../model/auth');

module.exports = function(req, res, next) {
    let authHeaders = req.headers.authorization;
    if (!authHeaders) 
        return errorHandler(new Error('Authorization failed. Headers do not match requirements.'), res);

    let token = authHeaders.split('Bearer ')[1];
    if (!token)
        return errorHandler(new Error('Authorization failed. Token required.'), res);

    // verify === decrypt
    return jwt.verify(token, process.env.APP_SECRET, (err, decodedValue) => {
        if (err) {
            err.message = 'Authorization failed. Cannot verify.';
            return errorHandler(err, res);
        }

        return Auth.findOne({ compareHash: decodedValue.token })
            .then (user => {
                if (!user) return errorHandler(new Error('Validation error. No user found.'), res);
                req.user = user;
                next();
            })
            .catch (err => errorHandler(err, res));
    });
};