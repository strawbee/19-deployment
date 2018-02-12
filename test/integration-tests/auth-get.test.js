'use strict';

require('jest');
const superagent = require('superagent');
const Auth = require('../../model/auth');
const server = require('../../lib/server');
// const errorHandler = require('../../lib/error-handler');
const basePath = `:3000/api/v1`;

describe('GET api/v1/signin', () => {
    beforeAll(() => server.start(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`)));

    beforeAll(() => {
        return superagent.post(`${basePath}/signup`)
            .send(new Auth({
                username: 'joy',
                password: 'cats',
                email: 'joy@joy.joy',
            }))
            .then(res => res);
    });
    
    afterAll(() => server.stop());
    afterAll(() => Promise.all([Auth.remove()]));

    it('should return status 200 for a valid request', () => {
        return superagent.get(`${basePath}/signin`)
            .auth('joy', 'cats')
            .then(res => expect(res.status).toBe(200));
    });


    it('should return status 401 for invalid request', () => {
        return superagent.get(`${basePath}/signin`)
            .auth('hello', 'world')
            .catch(err => expect(err.status).toBe(401));
    });

    it('should return status 404 for request to invalid path', () => {
        return superagent.get(`${basePath}/cats`)
            .auth('joy', 'cats')
            .catch(err => expect(err.status).toBe(404));
    });
});