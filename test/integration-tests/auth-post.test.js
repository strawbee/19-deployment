'use strict';

require('jest');
const superagent = require('superagent');
const faker = require('faker');
// const Auth = require('../../model/auth');
const server = require('../../lib/server');
// const errorHandler = require('../../lib/error-handler');
const mocks = require('../lib/mocks');
const basePath = `:${process.env.PORT}/api/v1`;

describe('POST api/v1/signup', () => {
    beforeAll(server.start);
    afterAll(server.stop);
    afterAll(mocks.auth.removeAll);

    it('should return status 201 for successful sign up', () => {
        this.mockUser = {
            username: faker.internet.userName(),
            password: faker.internet.password(),
            email: faker.internet.email(),
        };
        return superagent.post(`${basePath}/signup`)
            .send(this.mockUser)
            .then(res => expect(res.status).toBe(201));
    });

    it('should return status 401 for invalid post request', () => {
        return superagent.post(`${basePath}/signup`)
            .catch(err => {
                expect(err.status).toBe(401);
            });
    });

    it('should return status 404 for invalid path', () => {
        return superagent.post(`${basePath}/cats`)
            .catch(err => expect(err.status).toBe(404));
    });
});